# Automated Agent Deployment Script

This PowerShell script automatically deploys the "One Time Build Agent" to all repositories in your GitHub account.

## What This Script Does

✅ **Automatic Deployment** - No manual file copying or pasting commands  
✅ **Bulk Processing** - Deploys to all your repositories at once  
✅ **Safe Operation** - Creates pull requests (doesn't push directly to default branch)  
✅ **Smart Skipping** - Skips repositories that already have the agent  
✅ **Detailed Reporting** - Shows exactly what happened in each repository  

## One-Time Setup (5 minutes)

### Step 1: Install GitHub CLI (One Time)

**Option A: Using Windows Package Manager (Recommended)**
```powershell
winget install GitHub.cli
```

**Option B: Using Chocolatey**
```powershell
choco install gh
```

**Option C: Manual Download**
Download from: https://cli.github.com/

### Step 2: Authenticate (One Time)

```powershell
gh auth login
```

Follow the prompts to authenticate with your GitHub account.

## Usage

### Basic Usage (Recommended)

Deploy to all your personal repositories:

```powershell
.\deploy-agent-to-all-repos.ps1
```

### Test First (Dry Run)

See what would happen without making changes:

```powershell
.\deploy-agent-to-all-repos.ps1 -DryRun
```

### Deploy to Organization Repositories

```powershell
.\deploy-agent-to-all-repos.ps1 -OrgName "your-org-name"
```

### Advanced: Push Directly (Skip PRs)

⚠️ Use with caution - pushes directly to default branch:

```powershell
.\deploy-agent-to-all-repos.ps1 -SkipPR
```

## What Happens

1. **Script checks** - Verifies GitHub CLI is installed and authenticated
2. **Fetches repos** - Gets list of all your repositories (excludes archived ones)
3. **Confirms** - Asks you to confirm before proceeding
4. **For each repository:**
   - Clones the repository
   - Checks if agent already exists (skips if yes)
   - Creates a new branch `add-custom-agent`
   - Copies the agent file to `.github/agents/my-agent.agent.md`
   - Commits and pushes changes
   - Creates a pull request
5. **Reports** - Shows summary and saves detailed results to JSON file

## Expected Output

```
✓ GitHub CLI is installed and authenticated
✓ Found agent file: .github\agents\my-agent.agent.md
ℹ Fetching your personal repositories
✓ Found 15 active repositories

⚠ This will deploy the custom agent to 15 repositories.
Continue? (yes/no): yes

ℹ Processing: user/repo1
  ℹ Cloning repository...
  ℹ Creating branch: add-custom-agent
  ℹ Copying agent file...
  ℹ Committing changes...
  ℹ Pushing changes...
  ℹ Creating pull request...
  ✓ PR created: https://github.com/user/repo1/pull/1

...

================================================================================
DEPLOYMENT SUMMARY
================================================================================
✓ Successfully deployed to: 12 repositories
⚠ Skipped (already exists): 3 repositories
✗ Failed: 0 repositories

Detailed Results:
Repository    Status    PR
----------    ------    --
user/repo1    Success   https://github.com/user/repo1/pull/1
user/repo2    Success   https://github.com/user/repo2/pull/1
user/repo3    Skipped   Agent already exists
...

ℹ Detailed results saved to: agent-deployment-results-20241110-152030.json

================================================================================
✓ Deployment complete!
================================================================================

ℹ Next steps:
1. Review and merge the pull requests in each repository
2. The agent will become active once merged to the default branch
```

## After Running the Script

1. **Review Pull Requests** - Go to each repository and review the PRs
2. **Merge** - Merge the PRs to activate the agent in each repository
3. **Verify** - Open GitHub Copilot in each repository to see the agent

## Troubleshooting

### "GitHub CLI is not installed"
Install using one of the methods in Step 1 above.

### "Not authenticated with GitHub CLI"
Run `gh auth login` and follow the prompts.

### "Failed to clone repository"
- Check that you have access to the repository
- Verify your GitHub token has the correct permissions
- Try running `gh auth refresh -s repo`

### "PR creation failed"
- The changes were pushed but PR creation failed
- You can create the PR manually from the repository
- Or run the script again - it will skip repos that already have the changes

### Script hangs or is slow
- Normal if you have many repositories
- Each repository takes ~5-10 seconds to process
- You can interrupt with Ctrl+C and run again (it will skip already-processed repos)

## Results File

The script saves detailed results to a JSON file:

```
agent-deployment-results-YYYYMMDD-HHMMSS.json
```

This file contains:
- Repository name
- Status (Success/Failed/Skipped)
- PR URL or error message
- Timestamps

You can review this file to see exactly what happened in each repository.

## Security & Safety

- ✅ **Read-only by default** - Creates PRs, doesn't push to default branch
- ✅ **Skips existing** - Won't overwrite if agent already exists
- ✅ **Dry run mode** - Test before making changes
- ✅ **Detailed logging** - Know exactly what's happening
- ✅ **No secrets** - Uses your existing GitHub authentication

## Comparison to Manual Method

**Manual Method:**
- Open each repository (e.g., 20 repositories)
- Create `.github/agents/` directory
- Copy/paste agent file content
- Commit changes
- Create PR
- Time: ~5 minutes per repository = 100 minutes for 20 repos

**Automated Script:**
- Run one command
- Time: ~2 minutes setup + ~5 minutes execution = 7 minutes total

## Alternative: Template Repository

If you create new repositories frequently, you can instead:

1. Go to this repository's Settings
2. Check "Template repository"
3. When creating new repositories, select this as the template
4. New repositories will automatically include the agent

## Support

For issues with:
- **The script itself** - Open an issue in this repository
- **GitHub CLI** - See https://cli.github.com/
- **The custom agent** - See `.github/agents/README.md`

## Notes

- Script is designed for Windows PowerShell
- Requires PowerShell 5.1 or later (included with Windows 10+)
- Can be adapted for macOS/Linux with minor changes
- Results are saved locally for your records
