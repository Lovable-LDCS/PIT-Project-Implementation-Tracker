# Setting Up PAT_TOKEN for Enhanced Workflow Permissions

## Overview

The deployment and QA workflows now use a Personal Access Token (`PAT_TOKEN`) instead of the default `GITHUB_TOKEN` for enhanced permissions. This allows the workflows to:

- ✅ Configure GitHub Pages settings programmatically
- ✅ Manage environment protection rules
- ✅ Perform administrative operations during deployment
- ✅ Comment on pull requests with proper permissions

## Why PAT_TOKEN?

The default `GITHUB_TOKEN` has limited permissions and cannot:
- ❌ Modify repository settings (Pages, Environments)
- ❌ Change branch protection rules
- ❌ Perform certain administrative operations

Using `PAT_TOKEN` provides elevated permissions needed for autonomous deployment configuration.

## Setup Steps

### 1. Create a Personal Access Token

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or navigate: Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token:**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Give it a descriptive name: `PIT-Project-Deployment-Token`
   - Set expiration: Choose based on your needs (90 days, 1 year, or no expiration)

3. **Select Required Scopes:**
   
   **Essential Scopes:**
   - ✅ `repo` - Full control of private repositories (includes public repos)
   - ✅ `workflow` - Update GitHub Actions workflows
   - ✅ `write:packages` - Upload packages to GitHub Package Registry (if needed)
   
   **Optional but Recommended:**
   - ✅ `admin:repo_hook` - Full control of repository hooks (for deployment events)
   - ✅ `admin:org` - Full control of orgs and teams (if org-level deployment)

4. **Generate and Copy Token:**
   - Click **"Generate token"** at the bottom
   - **⚠️ IMPORTANT:** Copy the token immediately - you won't be able to see it again!
   - Store it securely (password manager recommended)

### 2. Add Token as Repository Secret

1. **Navigate to Repository Settings:**
   - Go to: https://github.com/Lovable-LDCS/PIT-Project-Implementation-Tracker/settings/secrets/actions
   - Or: Repository → Settings → Secrets and variables → Actions

2. **Create New Secret:**
   - Click **"New repository secret"**
   - Name: `PAT_TOKEN` (must match exactly)
   - Value: Paste the token you copied in Step 1
   - Click **"Add secret"**

3. **Verify Secret Exists:**
   - You should see `PAT_TOKEN` in the list of repository secrets
   - The value will be hidden (shown as `***`)

### 3. Verify Workflows

The following workflows now use `PAT_TOKEN`:

**`.github/workflows/deploy-pages.yml`**
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4
    with:
      token: ${{ secrets.PAT_TOKEN }}
```

**`.github/workflows/comment-qa-status.yml`**
```yaml
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    github-token: ${{ secrets.PAT_TOKEN }}

- name: Find associated PR
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.PAT_TOKEN }}

- name: Comment QA status on PR
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.PAT_TOKEN }}
```

### 4. Test the Configuration

1. **Trigger a Workflow:**
   - Make a small commit and push to main, OR
   - Go to Actions → "Deploy to GitHub Pages" → "Run workflow"

2. **Monitor the Run:**
   - Check that the workflow completes without authentication errors
   - Look for any errors related to token permissions

3. **Verify Deployment:**
   - Check that GitHub Pages deploys successfully
   - Verify the live URL is accessible

## Security Best Practices

### Token Management

- 🔒 **Rotate tokens regularly** - Set expiration dates and regenerate before expiry
- 🔒 **Use minimal scopes** - Only grant permissions actually needed
- 🔒 **Never commit tokens** - Always use GitHub Secrets, never hardcode
- 🔒 **Monitor token usage** - Check Settings → Developer settings → Personal access tokens for activity

### Token Scopes Explained

| Scope | Why Needed | Risk Level |
|-------|------------|------------|
| `repo` | Access repository code, settings, deployments | High - Full repo access |
| `workflow` | Update workflow files | Medium - Can modify CI/CD |
| `admin:repo_hook` | Manage deployment webhooks | Medium - Can intercept events |
| `admin:org` | Organization-level operations | High - Org-wide access |

### If Token is Compromised

1. **Immediately revoke the token:**
   - Go to: https://github.com/settings/tokens
   - Find the token and click **"Delete"**

2. **Generate a new token:**
   - Follow steps 1-2 above with a new token

3. **Update the repository secret:**
   - Replace `PAT_TOKEN` value in repository secrets

4. **Audit repository activity:**
   - Check Actions logs for unauthorized runs
   - Review recent commits for unexpected changes

## Troubleshooting

### Workflow Fails with "Bad credentials"

**Solution:** The PAT_TOKEN secret is missing or invalid.
- Verify the secret exists in repository settings
- Check that the token hasn't expired
- Regenerate token if needed

### Workflow Fails with "Resource not accessible by integration"

**Solution:** Token doesn't have required scopes.
- Go to token settings: https://github.com/settings/tokens
- Click the token name to edit
- Enable missing scopes (see Step 1.3 above)
- Update repository secret with new token

### Deployment Still Fails

**Solution:** Environment protection rules may still be blocking.
- Go to: Settings → Environments → github-pages
- Ensure `main` branch is allowed
- Remove required reviewers/wait timers
- See `GITHUB-PAGES-CONFIGURATION-GUIDE.md` for details

## Alternative: GitHub App (More Secure)

For production environments, consider using a GitHub App instead of PAT:

### Advantages of GitHub Apps:
- ✅ Fine-grained permissions per repository
- ✅ Automatic token rotation
- ✅ Better audit logging
- ✅ Not tied to a personal account
- ✅ More secure for team environments

### Setup Steps (Brief):
1. Create GitHub App: https://github.com/settings/apps
2. Grant repository-specific permissions
3. Install app on repository
4. Use app authentication in workflows

See GitHub's documentation for detailed setup: https://docs.github.com/en/apps/creating-github-apps

## Fallback: Use GITHUB_TOKEN (Limited)

If you don't want to use PAT_TOKEN, workflows can fall back to `GITHUB_TOKEN`:

**Limitations:**
- ❌ Cannot modify repository settings
- ❌ Cannot configure environments
- ❌ Limited to basic CI/CD operations

**To Revert:**
1. Replace `secrets.PAT_TOKEN` with `secrets.GITHUB_TOKEN` in workflow files
2. Accept manual environment configuration requirement

## Summary

| Step | Status | Action |
|------|--------|--------|
| 1. Create PAT | ⏳ Required | https://github.com/settings/tokens |
| 2. Add Secret | ⏳ Required | Repo Settings → Secrets → Add `PAT_TOKEN` |
| 3. Test Workflows | ⏳ Verify | Run deployment workflow |
| 4. Monitor | ✅ Ongoing | Check workflow runs for errors |

Once `PAT_TOKEN` is configured, workflows can autonomously:
- ✅ Deploy to GitHub Pages
- ✅ Configure environment settings (if scope granted)
- ✅ Comment on PRs
- ✅ Manage deployment status

**Total Setup Time:** 5-10 minutes

## References

- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Apps vs PAT](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps)
- [Token Security Best Practices](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation)
