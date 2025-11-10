# Using the Custom Agent Across Your GitHub Profile

## Overview

This repository includes a custom GitHub Copilot agent (`my-agent.agent.md`) that follows Johan's "True North" architecture-first philosophy. This guide explains how to use this agent across multiple repositories in your GitHub profile.

## Important: Custom Agents are Repository-Specific

**Custom agents are NOT profile-wide.** Each repository must have its own copy of the agent configuration file. GitHub does not currently support profile-wide or organization-wide custom agents - they must be configured per repository.

## How to Apply This Agent to Other Repositories

To use the "One Time Build Agent" in other repositories:

### Step 1: Copy the Agent File

Copy the entire `.github/agents/` directory from this repository to your target repository:

```bash
# From this repository
cp -r .github/agents/ /path/to/target-repository/.github/

# Or manually create the directory and copy the file
mkdir -p /path/to/target-repository/.github/agents/
cp .github/agents/my-agent.agent.md /path/to/target-repository/.github/agents/
```

### Step 2: Ensure Compatible Repository Structure

The agent expects these files and directories:

- `rules.md` - Architecture and governance rules (at repository root)
- `qa/requirements.json` - Machine-verifiable QA requirements
- `qa/reports/` - Directory for QA reports (will be created if needed)
- `scripts/run-qa.js` - QA execution script
- `scripts/migrate.sh` - Database migration script
- `scripts/health-check-server.js` - Health check support script

You may need to adapt or create these files for your target repository.

### Step 3: Commit and Merge to Default Branch

The agent configuration must be in the **default branch** (usually `main` or `master`) to be active:

```bash
cd /path/to/target-repository
git add .github/agents/
git commit -m "Add One Time Build Agent custom agent"
git push origin main
```

### Step 4: Verify Agent Availability

Once merged to the default branch:

1. Open GitHub Copilot in the repository
2. The "One Time Build Agent" should appear as an available custom agent
3. You can now use it to build, test, and maintain that repository

## Applying to Multiple Repositories

To use this agent across all your repositories:

### Option 1: Manual Copy (Recommended for Different Structures)

Repeat Steps 1-4 for each repository individually. This allows you to:
- Adapt the agent to each repository's specific needs
- Maintain different versions if repositories have different requirements
- Ensure each repository has the necessary support files

### Option 2: Template Repository

Create a template repository with the agent pre-configured:

1. Create a new repository with the agent and all required files
2. Mark it as a template repository in GitHub settings
3. When creating new repositories, use this template
4. New repositories will have the agent automatically included

### Option 3: Scripted Deployment

Create a script to deploy the agent to multiple repositories:

```bash
#!/bin/bash
# deploy-agent.sh

REPOS=(
  "username/repo1"
  "username/repo2"
  "username/repo3"
)

for repo in "${REPOS[@]}"; do
  echo "Deploying agent to $repo..."
  
  # Clone the repository
  git clone "https://github.com/$repo.git" temp-repo
  cd temp-repo
  
  # Create agents directory
  mkdir -p .github/agents
  
  # Copy agent file
  cp /path/to/this/repo/.github/agents/my-agent.agent.md .github/agents/
  
  # Commit and push
  git add .github/agents/
  git commit -m "Add One Time Build Agent"
  git push origin main
  
  # Clean up
  cd ..
  rm -rf temp-repo
done
```

## Agent Requirements by Repository Type

### For Next.js/React Projects

Required files:
- `rules.md` - Architecture rules
- `qa/requirements.json` - QA checks
- `scripts/run-qa.js` - QA runner
- Build configuration (`next.config.js`, `package.json`)

### For Python Projects

Required files:
- `rules.md` - Architecture rules
- `qa/requirements.json` - QA checks
- `scripts/run-qa.py` - QA runner (Python version)
- Requirements files (`requirements.txt`, `setup.py`)

### For Other Project Types

Adapt the agent's expectations:
- Create equivalent QA scripts for your stack
- Ensure `rules.md` reflects your architecture approach
- Modify `qa/requirements.json` to check your specific requirements

## Customizing the Agent per Repository

While the agent file can be identical across repositories, you may want to customize:

1. **QA Requirements** - Different projects may need different checks
2. **Script Paths** - Adjust if your repository uses different script locations
3. **Health Check Paths** - Change `/admin/health` to match your routing
4. **Environment Variables** - Update the list of required env vars

To customize, edit `.github/agents/my-agent.agent.md` in each repository.

## Maintaining Consistency

To keep the agent consistent across repositories:

1. **Version Control** - Keep this repository as the "source of truth"
2. **Update Process** - When updating the agent:
   - Update it in this repository first
   - Test thoroughly
   - Deploy updates to other repositories
3. **Documentation** - Document any repository-specific customizations

## Limitations

**Important Limitations:**
- Custom agents are repository-specific only
- Cannot be configured at the profile or organization level
- Each repository needs its own copy
- Changes must be merged to the default branch to take effect
- Agent is only available in repositories where it's been configured

## Verification

To verify the agent is active in a repository:

1. Check that `.github/agents/my-agent.agent.md` exists
2. Confirm the file is in the default branch
3. Invoke GitHub Copilot and look for "One Time Build Agent" in available agents
4. Test the agent with a simple task

## Troubleshooting

### Agent Not Appearing

- Ensure the file is in `.github/agents/my-agent.agent.md`
- Verify it's merged to the default branch
- Check the YAML front matter is valid
- Wait a few minutes for GitHub to process the change

### Agent Not Working as Expected

- Review the agent file for syntax errors
- Ensure required files (`rules.md`, `qa/requirements.json`) exist
- Check that scripts referenced by the agent are present
- Verify the repository structure matches agent expectations

## Support and Documentation

- **Agent Configuration**: `.github/agents/my-agent.agent.md`
- **Agent Documentation**: `.github/agents/README.md`
- **Architecture Rules**: `rules.md`
- **QA Requirements**: `qa/requirements.json`
- **GitHub Custom Agents**: https://gh.io/customagents/config
- **Copilot CLI**: https://gh.io/customagents/cli

## Next Steps

1. Review the agent file to understand its workflow
2. Identify repositories where you want to use this agent
3. Ensure target repositories have compatible structure
4. Follow the deployment steps above
5. Test the agent in each repository
6. Document any repository-specific customizations

---

**Note**: This guide reflects current GitHub Copilot capabilities as of 2024. GitHub may introduce profile-wide or organization-wide custom agents in the future. Check GitHub's documentation for updates.
