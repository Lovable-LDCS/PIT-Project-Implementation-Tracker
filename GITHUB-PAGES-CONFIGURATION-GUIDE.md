# GitHub Pages Configuration Guide

## Quick Answers to Your Questions

### 1. Deploy from Branch vs Deploy from GitHub Actions?

**✅ Choose: "Deploy from GitHub Actions"**

**Why:**
- Our existing workflow (`.github/workflows/deploy-pages.yml`) is a GitHub Actions workflow
- It automatically deploys on every push to `main`
- It's already configured and ready to work
- More flexible and modern approach

**How to Set:**
1. Go to: https://github.com/Lovable-LDCS/PIT-Project-Implementation-Tracker/settings/pages
2. Under **Source**, select **"GitHub Actions"**
3. Save

That's it! No need to configure "Deploy from branch" or use the suggested workflows.

---

### 2. Should You Use the Suggested Workflows?

**❌ No - You Don't Need Them**

Your repository already has a custom deployment workflow at `.github/workflows/deploy-pages.yml` that:
- Is specifically designed for your static HTML app
- Deploys the `src/frontend` directory
- Works perfectly for your use case

The suggested workflows (Static HTML, mdBook, Astro, Gatsby) are **starter templates** for repos without workflows. Since you already have one, ignore these.

---

### 3. Can the Agent Configure GitHub Settings Autonomously?

**❌ No - Not Currently Possible**

**Technical Limitation:**
- GitHub does not allow agents/apps to modify repository Settings (Pages, Environments, Security)
- These require either:
  - Manual configuration via GitHub UI
  - GitHub Personal Access Token (PAT) with `repo` and `admin:repo_hook` scopes
  - GitHub App with elevated permissions

**Why This Restriction Exists:**
- Security: Prevents malicious code from changing critical repo settings
- Compliance: Repository configuration is controlled by repo admins
- Audit: Changes to settings should be deliberate and tracked

**Current Agent Capabilities:**
The coding agent (Copilot) can:
- ✅ Read code and files
- ✅ Write/edit code files
- ✅ Run tests and linters
- ✅ Commit and push code changes
- ✅ Use GitHub API to read workflow status
- ❌ Modify repository Settings
- ❌ Configure Environments
- ❌ Change branch protection rules
- ❌ Manage secrets

---

### 4. How to Give More Rights to the Coding Agent

**Option A: Manual Configuration (Recommended)**

For repository settings that require admin access, configure them manually:

**One-Time Setup (5 minutes):**
1. **GitHub Pages Source:**
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"
   - Save

2. **Environment Configuration:**
   - Go to Settings → Environments
   - If `github-pages` environment exists:
     - Click on it
     - Deployment branches: Select "Selected branches" → Add `main`
     - Deployment protection rules: Remove reviewers and wait timers
   - If it doesn't exist:
     - It will be auto-created on first successful workflow run

3. **Done!**
   - Future deployments are fully automated
   - Agent can push code → workflow deploys automatically
   - No further manual intervention needed

---

**Option B: GitHub Personal Access Token (Advanced)**

If you want to enable agent configuration of settings via API:

**Steps:**
1. Create a Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scopes:
     - `repo` (full control of private repositories)
     - `admin:repo_hook` (write repo hooks)
   - Copy the token

2. Add as Repository Secret:
   - Go to repository Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `GH_PAT` or `ADMIN_TOKEN`
   - Value: [your token]

3. Update Workflow to Use Token:
   ```yaml
   - name: Configure GitHub Pages
     env:
       GH_TOKEN: ${{ secrets.GH_PAT }}
     run: |
       gh api --method PUT /repos/${{ github.repository }}/pages \
         -f source[branch]=main -f source[path]=/src/frontend
   ```

**⚠️ Security Warning:**
- PATs grant broad access to your account
- Anyone with the token can perform admin actions
- Use with extreme caution
- Consider using GitHub Apps instead for better security

---

**Option C: GitHub App (Most Secure)**

Create a custom GitHub App with specific permissions:

1. Go to https://github.com/settings/apps
2. Create new GitHub App
3. Grant permissions:
   - Repository administration: Read & write
   - Actions: Read & write
   - Pages: Read & write
4. Install on your repository
5. Use app authentication in workflows

This is the most secure approach but requires more setup.

---

## What's Already Automated

After the one-time manual setup above, the agent handles:

✅ **Automated Deployment:**
- Agent makes code changes
- Agent commits and pushes to branch
- PR is merged to `main`
- GitHub Actions workflow automatically deploys
- No manual intervention needed

✅ **Automated QA:**
- Agent runs QA checks
- QA verifies deployment success
- QA checks live URL accessibility
- QA fails if deployment broken

✅ **Continuous Delivery:**
- Every push to `main` → automatic deployment
- Workflow runs → QA validates → App is live
- Fully autonomous after initial setup

---

## Step-by-Step: Complete Setup

**Do This Once (5 minutes):**

1. **Enable GitHub Pages with Actions:**
   ```
   Settings → Pages → Source: "GitHub Actions" → Save
   ```

2. **Verify Workflow Exists:**
   ```bash
   # Already exists at:
   .github/workflows/deploy-pages.yml
   ```

3. **Trigger First Deployment:**
   - Merge this PR to `main`, OR
   - Go to Actions → "Deploy to GitHub Pages" → "Run workflow"

4. **Verify Success:**
   ```bash
   # Check deployment
   python3 scripts/qa/check-deployment.py
   
   # Visit URL
   https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/
   ```

5. **Done!**
   - Future pushes to `main` deploy automatically
   - Agent can work autonomously
   - QA validates everything

---

## Current Blocker: Environment Protection Rules

**The Issue:**
The `github-pages` environment has protection rules blocking `main` branch deployment.

**The Fix:**
1. Go to: https://github.com/Lovable-LDCS/PIT-Project-Implementation-Tracker/settings/environments
2. Click on `github-pages` environment
3. Under "Deployment branches":
   - Select "Selected branches"
   - Add `main` as allowed branch
4. Under "Deployment protection rules":
   - Remove required reviewers
   - Remove wait timers
5. Save

**After This Fix:**
- ✅ Deployments will succeed automatically
- ✅ QA will show GREEN
- ✅ App will be live at GitHub Pages URL
- ✅ No further manual steps needed

---

## Why This Wasn't Automated

**Design Decision:**
Repository settings (Pages, Environments, Security) require explicit admin control because:
- Security risk if automated incorrectly
- Compliance requirements for change tracking
- Protection against malicious code
- GitHub platform design choice

**What We Automated Instead:**
- ✅ Code changes
- ✅ QA validation
- ✅ Deployment workflow
- ✅ Verification checks
- ✅ Documentation

**What Requires Manual Setup:**
- ⏳ GitHub Pages source selection (one-time)
- ⏳ Environment protection rules (one-time)

---

## Summary

| Question | Answer |
|----------|--------|
| **Deploy from Branch or Actions?** | ✅ Choose "GitHub Actions" |
| **Use suggested workflows?** | ❌ No, you already have a custom workflow |
| **Can agent configure settings?** | ❌ No, requires manual setup or PAT |
| **How to give more rights?** | Manual setup (5 min) OR use PAT (security risk) |
| **What's automated?** | Code, commits, deployment workflow, QA |
| **What's manual?** | One-time Pages/Environment configuration |

---

## Next Action Required

**You (Johan) need to:**

1. Go to Settings → Pages
2. Select Source: "GitHub Actions"
3. Go to Settings → Environments → github-pages
4. Allow `main` branch deployment
5. Remove protection rules
6. Save

**Then:**
- Merge this PR or manually trigger workflow
- Deployment will succeed
- QA will show GREEN
- App will be live

**Total Time:** 5 minutes of manual configuration → Fully automated forever

---

## References

- [GitHub Docs: Configuring Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Docs: Using Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub API: Pages](https://docs.github.com/en/rest/pages)
- Our workflow: `.github/workflows/deploy-pages.yml`
- Our deployment checks: `scripts/qa/check-deployment.py`
