---
id: ARC-BACKUP-CHAT-001
title: Chat Backup Facility (Automatic every 10 minutes)
status: Draft v1.0
scope: Automatically snapshot the current chat transcript to backups/chat/ at a fixed interval
---

1) Goals
- Preserve the latest chat context (at minimum the most recent exchange) automatically, every 10 minutes.
- Allow manual start/stop without admin privileges.

2) Design
- Canonical chat log: logs/chat/current.md (append-only, last exchange always added)
  - Format: delimited exchanges with timestamps
  - Maintains a sentinel marker <!-- LOG END --> used by the agent to append reliably
- Backup process: scripts/backup/chat-backup.ps1
  - Reads logs/chat/current.md
  - Writes timestamped snapshot backups/chat/chat-YYYYMMDD-HHMMSS.md
  - Interval default: 10 minutes (configurable)
  - Writes PID to scripts/backup/.pids/chat-backup.pid
- Control scripts:
  - scripts/backup/start-chat-backup.ps1 (starts in background)
  - scripts/backup/stop-chat-backup.ps1 (signals/terminates process)

3) Behavior
- Start script ensures directories exist, launches backup loop minimized, outputs PID.
- Stop script reads PID file and attempts to stop the process.
- Backups are lightweight Markdown snapshots for easy inspection.

4) Acceptance Criteria (QA)
- Presence: the three scripts exist
- logs/chat/current.md exists and contains the sentinel <!-- LOG END -->
- When run manually with a short interval, a new file appears under backups/chat/
