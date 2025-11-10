# Deploy Custom Agent to All Repositories
# This script automatically deploys the "One Time Build Agent" to all repositories
# in your GitHub account (or specified organization).
#
# Prerequisites:
# 1. GitHub CLI installed: winget install GitHub.cli
# 2. Authenticated: gh auth login
#
# Usage:
#   .\deploy-agent-to-all-repos.ps1
#   .\deploy-agent-to-all-repos.ps1 -OrgName "your-org-name"
#   .\deploy-agent-to-all-repos.ps1 -DryRun  # Test without making changes

param(
    [string]$OrgName = "",           # Optional: Deploy to org repos instead of personal
    [switch]$DryRun = $false,        # Test mode - show what would happen
    [string]$BranchName = "add-custom-agent",  # Branch name for the changes
    [switch]$SkipPR = $false         # If true, push directly to default branch (use with caution)
)

# Colors for output
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }

# Check prerequisites
Write-Info "Checking prerequisites..."

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI is not installed!"
    Write-Info "Install it with: winget install GitHub.cli"
    Write-Info "Or download from: https://cli.github.com/"
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Not authenticated with GitHub CLI!"
    Write-Info "Run: gh auth login"
    exit 1
}

Write-Success "GitHub CLI is installed and authenticated"

# Get the agent file path
$agentFilePath = Join-Path $PSScriptRoot ".github\agents\my-agent.agent.md"
if (-not (Test-Path $agentFilePath)) {
    Write-Error "Agent file not found at: $agentFilePath"
    Write-Info "Make sure you're running this from the repository root"
    exit 1
}

Write-Success "Found agent file: $agentFilePath"

# Read the agent file content
$agentContent = Get-Content $agentFilePath -Raw

# Get list of repositories
Write-Info "Fetching repository list..."
if ($OrgName) {
    Write-Info "Fetching repositories for organization: $OrgName"
    $repos = gh repo list $OrgName --json name,defaultBranchRef,isArchived --limit 1000 | ConvertFrom-Json
} else {
    Write-Info "Fetching your personal repositories"
    $repos = gh repo list --json name,defaultBranchRef,isArchived --limit 1000 | ConvertFrom-Json
}

# Filter out archived repositories
$repos = $repos | Where-Object { -not $_.isArchived }

Write-Success "Found $($repos.Count) active repositories"

if ($DryRun) {
    Write-Warning "DRY RUN MODE - No changes will be made"
    Write-Info "`nWould deploy agent to these repositories:"
    $repos | ForEach-Object { Write-Host "  - $($_.name)" }
    Write-Info "`nRun without -DryRun to actually deploy"
    exit 0
}

# Confirm with user
Write-Warning "`nThis will deploy the custom agent to $($repos.Count) repositories."
$confirmation = Read-Host "Continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Info "Cancelled by user"
    exit 0
}

# Process each repository
$successCount = 0
$failCount = 0
$skippedCount = 0
$results = @()

foreach ($repo in $repos) {
    $repoName = if ($OrgName) { "$OrgName/$($repo.name)" } else { $repo.name }
    Write-Info "`nProcessing: $repoName"
    
    try {
        # Create a temporary directory for cloning
        $tempDir = Join-Path $env:TEMP "agent-deploy-$([Guid]::NewGuid())"
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        
        # Clone the repository
        Write-Info "  Cloning repository..."
        gh repo clone $repoName $tempDir -- --depth 1 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to clone repository"
        }
        
        Push-Location $tempDir
        
        try {
            # Check if agent already exists
            $existingAgent = Join-Path $tempDir ".github\agents\my-agent.agent.md"
            if (Test-Path $existingAgent) {
                Write-Warning "  Agent already exists, skipping"
                $skippedCount++
                $results += [PSCustomObject]@{
                    Repository = $repoName
                    Status = "Skipped"
                    Reason = "Agent already exists"
                }
                continue
            }
            
            # Create branch or use default
            if (-not $SkipPR) {
                Write-Info "  Creating branch: $BranchName"
                git checkout -b $BranchName 2>&1 | Out-Null
                if ($LASTEXITCODE -ne 0) {
                    # Branch might already exist, try to switch to it
                    git checkout $BranchName 2>&1 | Out-Null
                }
            }
            
            # Create .github/agents directory
            $agentsDir = Join-Path $tempDir ".github\agents"
            New-Item -ItemType Directory -Path $agentsDir -Force | Out-Null
            
            # Copy the agent file
            Write-Info "  Copying agent file..."
            $agentContent | Out-File -FilePath $existingAgent -Encoding UTF8 -NoNewline
            
            # Add and commit
            Write-Info "  Committing changes..."
            git add .github/agents/my-agent.agent.md 2>&1 | Out-Null
            git commit -m "Add One Time Build Agent custom agent" 2>&1 | Out-Null
            
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to commit changes"
            }
            
            # Push changes
            Write-Info "  Pushing changes..."
            if ($SkipPR) {
                git push origin HEAD 2>&1 | Out-Null
            } else {
                git push -u origin $BranchName 2>&1 | Out-Null
            }
            
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to push changes"
            }
            
            # Create pull request if not skipping
            if (-not $SkipPR) {
                Write-Info "  Creating pull request..."
                $prUrl = gh pr create --title "Add One Time Build Agent" --body "Adds the custom GitHub Copilot agent for architecture-first development following the True North philosophy." 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Success "  PR created: $prUrl"
                    $results += [PSCustomObject]@{
                        Repository = $repoName
                        Status = "Success"
                        PR = $prUrl
                    }
                } else {
                    Write-Warning "  Changes pushed but PR creation failed"
                    $results += [PSCustomObject]@{
                        Repository = $repoName
                        Status = "Partial"
                        Reason = "Changes pushed, PR creation failed"
                    }
                }
            } else {
                Write-Success "  Changes pushed to default branch"
                $results += [PSCustomObject]@{
                    Repository = $repoName
                    Status = "Success"
                    Note = "Pushed to default branch"
                }
            }
            
            $successCount++
            
        } finally {
            Pop-Location
        }
        
    } catch {
        Write-Error "  Failed: $_"
        $failCount++
        $results += [PSCustomObject]@{
            Repository = $repoName
            Status = "Failed"
            Error = $_.Exception.Message
        }
    } finally {
        # Clean up temp directory
        if (Test-Path $tempDir) {
            Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# Summary
Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "="*80 -ForegroundColor Cyan

Write-Success "Successfully deployed to: $successCount repositories"
if ($skippedCount -gt 0) {
    Write-Warning "Skipped (already exists): $skippedCount repositories"
}
if ($failCount -gt 0) {
    Write-Error "Failed: $failCount repositories"
}

Write-Host "`nDetailed Results:" -ForegroundColor Cyan
$results | Format-Table -AutoSize

# Save results to file
$resultFile = "agent-deployment-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$results | ConvertTo-Json | Out-File $resultFile
Write-Info "`nDetailed results saved to: $resultFile"

Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Success "Deployment complete!"
Write-Host "="*80 -ForegroundColor Cyan

if (-not $SkipPR) {
    Write-Info "`nNext steps:"
    Write-Info "1. Review and merge the pull requests in each repository"
    Write-Info "2. The agent will become active once merged to the default branch"
}
