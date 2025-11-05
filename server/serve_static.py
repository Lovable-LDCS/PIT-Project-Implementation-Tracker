#!/usr/bin/env python3
"""
Simple static file server for local development.

Serves the `src/frontend` directory on the specified port (default 8080).
Usage: python3 server/serve_static.py [--port 8080]
"""
import http.server
import socketserver
import argparse
import os


def main():
    parser = argparse.ArgumentParser(description='Serve src/frontend on localhost')
    parser.add_argument('--port', '-p', type=int, default=8080, help='Port to serve on')
    args = parser.parse_args()

    webroot = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'frontend')
    os.chdir(webroot)

    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(('', args.port), handler) as httpd:
        print(f"Serving {webroot} at http://localhost:{args.port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nShutting down')


if __name__ == '__main__':
    main()
