Local development notes

> **Quick Start**: See [GETTING_STARTED.md](GETTING_STARTED.md) for a comprehensive guide with server management, features overview, and troubleshooting.

1) Serving the frontend

To serve the static frontend locally run:

**Windows:**
```bash
python server/serve_static.py --port 8080
# then open http://localhost:8080 in your browser
```

**macOS/Linux:**
```bash
python3 server/serve_static.py --port 8080
# then open http://localhost:8080 in your browser
```

Or use the convenience script:
- Windows: `start-server.bat 8080`
- macOS/Linux: `./start-server.sh 8080`

2) Running QA checks (pytest)

Run the lightweight QA checks that validate the static architecture evidence:

```bash
pytest -q
```

The tests are intentionally simple (stdlib-only) and check that `src/frontend/index.html` contains the required test IDs, has no inline style attributes outside scripts, and defines key global function names used for wiring.

If you'd like a headless browser runtime QA (Playwright), I can add it, but this requires installing extra packages.
