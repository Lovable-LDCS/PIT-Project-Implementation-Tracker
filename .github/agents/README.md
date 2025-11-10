# Custom Agent Configuration

## Overview

This directory contains custom agent configurations for GitHub Copilot. Custom agents are specialized AI assistants that are configured to follow specific workflows, methodologies, and best practices for this repository.

## About Custom Agents

**Important:** Custom agents are **repository-specific**, not profile-wide. Each repository can define its own custom agents that will be available to developers working in that specific repository.

To use custom agents across multiple repositories in your GitHub profile:
- Copy the `.github/agents/` directory to each repository
- Ensure each repository has the agent file(s) merged into the default branch
- The agent will become available for that repository once merged

## Current Agent: One Time Build Agent

### Purpose
The **One Time Build Agent** (`my-agent.agent.md`) is a full-stack autonomous build and QA agent that follows Johan's "True North" architecture-first philosophy.

### Key Responsibilities
- Updates architecture (`rules.md`)
- Encodes machine-verifiable QA (`qa/requirements.json`)
- Performs full repository builds
- Delivers GREEN QA handovers with no manual user actions required

### Philosophy
The agent operates on these core principles:
1. **Architecture-first:** All implementation and QA derive from versioned architecture files
2. **One Time Build:** Every scope runs from architecture → QA → implementation → QA → GREEN → handover
3. **No legacy:** Unwired or obsolete code is deleted after two failed wiring cycles
4. **Strict wiring:** QA ensures both static (imports/routes) and runtime (UI response) wiring
5. **Resilience and verifiability:** Every failure must show as RED in QA before being fixed

### How It Works

The agent follows this workflow:
1. Update/confirm architecture (`rules.md`)
2. Encode QA checks (`qa/requirements.json`)
3. Run full QA (expect RED for new features)
4. Implement code/wiring to meet architecture
5. Re-run QA until GREEN
6. Generate handover artifacts (`qa/reports`, `qa/handover.md`)
7. Never mark GREEN until all checks pass

### QA Requirements

The agent enforces these checks:
- Architecture integrity (`rules.md` and `qa/requirements.json` in sync)
- Environment validation (`SUPABASE_URL`, `RESEND_API_KEY`, etc.)
- Type safety and lint (no TypeScript or ESLint errors)
- Build integrity (`next build` must pass)
- Unit + E2E tests (Playwright)
- Route smoke tests
- Database migrations applied and schema in sync
- RLS policies validated
- API health checks return 200
- Email sender verified or fallback configured
- Responsive UI & consistent UX
- Security posture verified
- Logging and audit trail confirmed
- Health Checker (Admin-only) available at `/admin/health`

### Strict Wiring Rules

- Components must appear in UI and respond interactively
- "Preview: Desktop | Mobile" toggle must work visually and revert correctly
- Admin tabs visible only for admin role
- Unwired or invisible components → QA RED
- Two consecutive wiring failures → delete component as legacy

### Health Checker

The agent ensures an `/admin/health` page exists with:
- All QA checks run and displayed
- Human-readable health report
- "Run QA" button
- `STRICT MODE` toggle (QA_STRICT=1)
- Results downloadable as JSON

### CI and Automation

The agent expects these scripts:
- `scripts/run-qa.js` — executes QA
- `scripts/migrate.sh` — applies migrations
- `scripts/health-check-server.js` — supports in-app QA

### Handover Rules

- No partial handovers — only GREEN QA
- User (Johan) verifies results **via UI only**
- All diagnostic info stored in `qa/reports/`
- Human-readable handover (`qa/handover.md`) generated with UI verification steps

### Enforcement

The agent:
- Never requests manual CLI, code, or SQL actions from the user
- Always updates architecture first, then QA, then code
- Always fails visibly (RED) before fixing
- Deletes legacy code after two failed wiring cycles if not in architecture
- Produces full QA and human-readable health report before declaring GREEN

## Using the Custom Agent

Once this file is merged into the default branch:

1. The agent becomes available in GitHub Copilot
2. Developers can invoke the agent using the custom agent tool
3. The agent will follow the workflows and rules defined in `my-agent.agent.md`

## Testing Locally

You can test custom agents locally using the Copilot CLI:
```bash
# See https://gh.io/customagents/cli for details
```

## Format Details

For information about the custom agent file format, see:
https://gh.io/customagents/config

## Applying to Other Repositories

To use this agent in other repositories:

1. Copy the `.github/agents/` directory to the target repository
2. Ensure the repository has compatible structure:
   - `rules.md` at the root
   - `qa/requirements.json` for QA checks
   - Compatible CI/CD scripts
3. Commit and merge to the default branch
4. The agent will become available in that repository

## Important Notes

- Custom agents are **not profile-wide** - they must be configured per repository
- Each repository can have multiple custom agents
- Agent configurations must be in the default branch to be active
- Changes to agent files require a merge to the default branch to take effect

## Maintenance

To update the agent:
1. Edit `.github/agents/my-agent.agent.md`
2. Test changes locally if possible
3. Submit a PR with the changes
4. Merge to default branch
5. Updated agent will be available after merge

## Support

For questions about this custom agent or its configuration:
- Review the agent file: `.github/agents/my-agent.agent.md`
- Check the repository architecture: `rules.md`
- Review QA requirements: `qa/requirements.json`
- Consult GitHub's custom agent documentation: https://gh.io/customagents/config
