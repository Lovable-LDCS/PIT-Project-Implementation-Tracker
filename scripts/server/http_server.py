import http.server
import socketserver
import os
import sys
import threading
import mimetypes
from pathlib import Path
from datetime import datetime

PORT = int(os.environ.get("PM_LOCAL_PORT", "8080"))
REPO_ROOT = Path(__file__).resolve().parents[2]
SERVE_DIR = REPO_ROOT / "src" / "frontend"
PIDS_DIR = Path(__file__).resolve().parents[1] / ".pids"
PID_FILE = PIDS_DIR / "http-server.pid"
OCR_LOG_DIR = REPO_ROOT / "logs" / "ocr"

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Serve from SERVE_DIR regardless of CWD
        path = http.server.SimpleHTTPRequestHandler.translate_path(self, path)
        # The default translate_path uses os.getcwd(); rewrite to SERVE_DIR
        rel = os.path.relpath(path, os.getcwd())
        return str(SERVE_DIR / rel)

    def _serve_file(self, fp: Path):
        try:
            if not fp.exists() or not fp.is_file():
                self.send_error(404, "File not found")
                return
            ctype = mimetypes.guess_type(fp.name)[0] or "application/octet-stream"
            data = fp.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_error(500, f"Error serving file: {e}")

    def do_GET(self):
        if self.path == "/favicon.ico":
            # Serve a tiny in-memory icon to avoid 404 noise
            ico_bytes = bytes([0])  # minimal placeholder
            self.send_response(200)
            self.send_header("Content-Type", "image/x-icon")
            self.send_header("Content-Length", str(len(ico_bytes)))
            self.end_headers()
            self.wfile.write(ico_bytes)
            return

        # Safe read-only alias to clipboard watcher path
        if self.path.startswith("/_clipboard/"):
            rel = self.path[len("/_clipboard/"):]
            # Serve latest screenshot if path is '/_clipboard/latest'
            if rel == "latest" or rel == "latest/":
                clip_dir = (REPO_ROOT / "projects" / "_clipboard").resolve()
                if not clip_dir.exists():
                    self.send_error(404, "Clipboard directory not found")
                    return
                # Find latest image by modified time
                latest = None
                latest_mtime = 0.0
                for ext in (".png", ".jpg", ".jpeg", ".gif", ".bmp"):
                    for p in clip_dir.glob(f"*{ext}"):
                        try:
                            mt = p.stat().st_mtime
                            if mt > latest_mtime:
                                latest_mtime = mt
                                latest = p
                        except Exception:
                            continue
                if latest is None:
                    self.send_error(404, "No clipboard images found")
                    return
                return self._serve_file(latest)
            # Otherwise, serve the requested file under _clipboard
            fp = (REPO_ROOT / "projects" / "_clipboard" / rel).resolve()
            return self._serve_file(fp)

        # Safe read-only alias to entire repo
        if self.path.startswith("/repo/"):
            rel = self.path[len("/repo/"):]
            fp = (REPO_ROOT / rel).resolve()
            # Allow directory listing for convenience
            if fp.exists() and fp.is_dir():
                prev = os.getcwd()
                try:
                    os.chdir(str(fp))
                    return http.server.SimpleHTTPRequestHandler.do_GET(self)
                finally:
                    os.chdir(prev)
            return self._serve_file(fp)

        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        # Accept local ingest posts (e.g., OCR/diagnostics) — localhost only, write-only
        try:
            if not self.path.startswith('/_ingest/'):
                self.send_error(404, 'Not Found')
                return
            host, _ = self.client_address
            if host not in ('127.0.0.1', '::1'):
                self.send_error(403, 'Forbidden')
                return
            length = int(self.headers.get('Content-Length') or '0')
            if length <= 0 or length > 1024*1024:
                self.send_error(400, 'Invalid content length')
                return
            body = self.rfile.read(length)
            OCR_LOG_DIR.mkdir(parents=True, exist_ok=True)
            ts = datetime.now().strftime('%Y%m%d-%H%M%S-%f')
            if self.path == '/_ingest/clip-ocr':
                (OCR_LOG_DIR / f'clip-ocr-{ts}.txt').write_bytes(body)
                (OCR_LOG_DIR / 'latest.txt').write_bytes(body)
                resp = b'OK'
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            elif self.path == '/_ingest/ui-diagnostics':
                # Store raw JSON diagnostics as-is
                (OCR_LOG_DIR / f'ui-{ts}.json').write_bytes(body)
                (OCR_LOG_DIR / 'ui-latest.json').write_bytes(body)
                resp = b'OK'
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            else:
                self.send_error(404, 'Unknown ingest endpoint')
                return
        except Exception as e:
            self.send_error(500, f'Error: {e}')
            return

    def log_message(self, format, *args):
        sys.stdout.write("[HTTP] " + (format % args) + "\n")


def main():
    os.makedirs(PIDS_DIR, exist_ok=True)
    # Write PID
    with open(PID_FILE, "w", encoding="ascii") as f:
        f.write(str(os.getpid()))

    os.chdir(str(SERVE_DIR))
    # Bind to IPv4 localhost for compatibility on Windows
    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), Handler) as httpd:
        try:
            sys.stdout.write(f"Serving {SERVE_DIR} on http://localhost:{PORT}/ (PID {os.getpid()})\n")
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            try:
                PID_FILE.unlink(missing_ok=True)
            except Exception:
                pass

if __name__ == "__main__":
    main()
