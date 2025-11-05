import os
from pathlib import Path
import signal

PIDS_DIR = Path(__file__).resolve().parents[1] / ".pids"
PID_FILE = PIDS_DIR / "http-server.pid"

if PID_FILE.exists():
    pid = int(PID_FILE.read_text().strip())
    try:
        os.kill(pid, signal.SIGTERM)
        print(f"Signaled server PID {pid} to stop.")
    except Exception as e:
        print(f"Could not stop PID {pid}: {e}")
    try:
        PID_FILE.unlink()
    except Exception:
        pass
else:
    print("No PID file found; server may not be running.")
