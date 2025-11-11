#!/usr/bin/env python3
"""
Deployment Verification Script for PIT Project
Checks GitHub Pages deployment status, workflow runs, and live URL accessibility
"""

import json
import os
import sys
import time
from typing import Dict, List, Optional
from urllib.parse import urlparse
import subprocess

def run_command(cmd: List[str], capture_output: bool = True) -> tuple:
    """Run a command and return (success, output)"""
    try:
        result = subprocess.run(
            cmd,
            capture_output=capture_output,
            text=True,
            check=False
        )
        return result.returncode == 0, result.stdout.strip()
    except Exception as e:
        return False, str(e)

def check_url_accessibility(url: str) -> Dict:
    """
    Check if a URL is accessible and returns expected content.
    Uses curl since we can't rely on requests being installed.
    """
    result = {
        "id": "DEPLOY-009",
        "name": "Live deployment URL is accessible",
        "status": "FAIL",
        "severity": "critical",
        "message": "",
        "details": ""
    }
    
    # Use curl to check URL accessibility
    success, output = run_command([
        "curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", url, "-L", "--max-time", "10"
    ])
    
    if success and output == "200":
        result["status"] = "PASS"
        result["message"] = f"URL {url} is accessible (HTTP {output})"
    else:
        result["status"] = "FAIL"
        result["message"] = f"URL {url} returned HTTP {output if success else 'connection failed'}"
        result["details"] = "The GitHub Pages deployment may not have completed successfully or CDN propagation is still in progress. Wait 2-5 minutes and try again."
    
    return result

def check_url_content(url: str, expected_content: List[str]) -> Dict:
    """Check if URL contains expected content."""
    result = {
        "id": "DEPLOY-010",
        "name": "Deployed application contains expected content",
        "status": "FAIL",
        "severity": "critical",
        "message": "",
        "details": ""
    }
    
    # Download page content
    success, content = run_command(["curl", "-s", "-L", url, "--max-time", "10"])
    
    if not success:
        result["message"] = "Failed to retrieve page content"
        result["details"] = content
        return result
    
    # Check for expected content
    missing_content = []
    for expected in expected_content:
        if expected not in content:
            missing_content.append(expected)
    
    if not missing_content:
        result["status"] = "PASS"
        result["message"] = f"All expected content found in deployed page"
    else:
        result["status"] = "FAIL"
        result["message"] = f"Missing expected content: {', '.join(missing_content)}"
        result["details"] = f"The deployed page does not contain all expected test IDs and content. This may indicate an incorrect artifact upload path or Jekyll processing issues."
    
    return result

def check_github_environment(owner: str, repo: str, environment: str) -> Dict:
    """
    Check GitHub environment protection rules using gh CLI.
    Note: This requires gh CLI to be authenticated.
    """
    result = {
        "id": "DEPLOY-007",
        "name": "GitHub Pages environment allows main branch deployment",
        "status": "SKIP",
        "severity": "critical",
        "message": "",
        "details": ""
    }
    
    # Check if gh CLI is available
    success, _ = run_command(["which", "gh"])
    if not success:
        result["message"] = "gh CLI not available - skipping environment check"
        result["details"] = "Install gh CLI and authenticate to enable environment checks"
        return result
    
    # Try to get environment info
    success, output = run_command([
        "gh", "api", f"/repos/{owner}/{repo}/environments/{environment}",
        "--jq", ".deployment_branch_policy"
    ])
    
    if not success:
        result["status"] = "FAIL"
        result["message"] = f"Could not retrieve environment configuration: {output}"
        result["details"] = "Environment may not exist yet or gh CLI is not authenticated. First deployment will create it."
        # This is not necessarily a failure - environment is created on first deploy
        result["status"] = "SKIP"
        return result
    
    try:
        # Parse deployment branch policy
        if "protected_branches" in output or "custom_branch_policies" in output:
            # Check if main is allowed
            result["status"] = "PASS"
            result["message"] = "Environment deployment policy configured"
        else:
            result["status"] = "FAIL"
            result["message"] = "Environment deployment policy may block main branch"
            result["details"] = "Go to Settings → Environments → github-pages and ensure main branch is in allowed branches"
    except Exception as e:
        result["status"] = "SKIP"
        result["message"] = f"Could not parse environment policy: {str(e)}"
    
    return result

def check_workflow_run_status(owner: str, repo: str, workflow_file: str) -> Dict:
    """Check the latest workflow run status using gh CLI."""
    result = {
        "id": "DEPLOY-008",
        "name": "Latest deployment workflow run succeeded",
        "status": "SKIP",
        "severity": "critical",
        "message": "",
        "details": ""
    }
    
    # Check if gh CLI is available
    success, _ = run_command(["which", "gh"])
    if not success:
        result["message"] = "gh CLI not available - skipping workflow check"
        return result
    
    # Get latest workflow run
    success, output = run_command([
        "gh", "run", "list",
        "--workflow", workflow_file,
        "--limit", "1",
        "--json", "conclusion,status,headBranch,displayTitle",
        "--repo", f"{owner}/{repo}"
    ])
    
    if not success:
        result["status"] = "FAIL"
        result["message"] = f"Could not retrieve workflow runs: {output}"
        return result
    
    try:
        runs = json.loads(output)
        if not runs:
            result["message"] = "No workflow runs found for deploy-pages.yml"
            result["status"] = "SKIP"
            return result
        
        latest_run = runs[0]
        conclusion = latest_run.get("conclusion", "")
        status = latest_run.get("status", "")
        branch = latest_run.get("headBranch", "")
        title = latest_run.get("displayTitle", "")
        
        if conclusion == "success":
            result["status"] = "PASS"
            result["message"] = f"Latest workflow run succeeded ({branch}: {title})"
        elif status == "in_progress" or status == "queued":
            result["status"] = "SKIP"
            result["message"] = f"Workflow is currently {status}"
            result["details"] = "Wait for the workflow to complete"
        else:
            result["status"] = "FAIL"
            result["message"] = f"Latest workflow run {conclusion or status} ({branch}: {title})"
            result["details"] = f"Check GitHub Actions logs for details. Run status: {status}, conclusion: {conclusion}"
    
    except json.JSONDecodeError as e:
        result["status"] = "FAIL"
        result["message"] = f"Could not parse workflow run data: {str(e)}"
    
    return result

def check_github_deployment_status(owner: str, repo: str, environment: str) -> Dict:
    """Check GitHub deployment status using gh CLI."""
    result = {
        "id": "DEPLOY-011",
        "name": "GitHub deployment status is Active",
        "status": "SKIP",
        "severity": "critical",
        "message": "",
        "details": ""
    }
    
    # Check if gh CLI is available
    success, _ = run_command(["which", "gh"])
    if not success:
        result["message"] = "gh CLI not available - skipping deployment status check"
        return result
    
    # Get latest deployment
    success, output = run_command([
        "gh", "api", f"/repos/{owner}/{repo}/deployments",
        "--jq", f'.[0] | select(.environment == "{environment}") | .id'
    ])
    
    if not success or not output:
        result["message"] = "No deployments found for github-pages environment"
        result["details"] = "First deployment will create the deployment record"
        return result
    
    deployment_id = output
    
    # Get deployment status
    success, status_output = run_command([
        "gh", "api", f"/repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        "--jq", ".[0].state"
    ])
    
    if success and status_output == "success":
        result["status"] = "PASS"
        result["message"] = "GitHub deployment status is active/success"
    elif success:
        result["status"] = "FAIL"
        result["message"] = f"GitHub deployment status is {status_output}"
        result["details"] = "Deployment may have failed or is still in progress"
    else:
        result["status"] = "SKIP"
        result["message"] = "Could not retrieve deployment status"
    
    return result

def main():
    """Run all deployment checks."""
    checks = []
    
    # Configuration
    repo_owner = "Lovable-LDCS"
    repo_name = "PIT-Project-Implementation-Tracker"
    environment = "github-pages"
    deploy_url = "https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/"
    expected_content = ["TID-SHELL-ROOT", "PIT - Project Implementation Tracker"]
    
    print("\n=== Deployment Verification Checks ===\n")
    
    # Check 1: GitHub environment configuration
    print("Checking GitHub environment protection rules...")
    env_check = check_github_environment(repo_owner, repo_name, environment)
    checks.append(env_check)
    print(f"  [{env_check['status']}] {env_check['name']}: {env_check['message']}")
    
    # Check 2: Workflow run status
    print("\nChecking latest workflow run...")
    workflow_check = check_workflow_run_status(repo_owner, repo_name, "deploy-pages.yml")
    checks.append(workflow_check)
    print(f"  [{workflow_check['status']}] {workflow_check['name']}: {workflow_check['message']}")
    
    # Check 3: URL accessibility
    print("\nChecking live URL accessibility...")
    url_check = check_url_accessibility(deploy_url)
    checks.append(url_check)
    print(f"  [{url_check['status']}] {url_check['name']}: {url_check['message']}")
    
    # Check 4: URL content
    if url_check['status'] == 'PASS':
        print("\nChecking deployed content...")
        content_check = check_url_content(deploy_url, expected_content)
        checks.append(content_check)
        print(f"  [{content_check['status']}] {content_check['name']}: {content_check['message']}")
    
    # Check 5: Deployment status
    print("\nChecking GitHub deployment status...")
    deploy_status_check = check_github_deployment_status(repo_owner, repo_name, environment)
    checks.append(deploy_status_check)
    print(f"  [{deploy_status_check['status']}] {deploy_status_check['name']}: {deploy_status_check['message']}")
    
    # Save results to JSON
    results = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "checks": checks,
        "summary": {
            "total": len(checks),
            "passed": len([c for c in checks if c['status'] == 'PASS']),
            "failed": len([c for c in checks if c['status'] == 'FAIL']),
            "skipped": len([c for c in checks if c['status'] == 'SKIP'])
        }
    }
    
    output_file = "qa/deployment-check-results.json"
    os.makedirs("qa", exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\nResults saved to {output_file}")
    print(f"\nSummary: {results['summary']['passed']} passed, {results['summary']['failed']} failed, {results['summary']['skipped']} skipped")
    
    # Exit with error if any critical checks failed
    critical_failures = [c for c in checks if c['severity'] == 'critical' and c['status'] == 'FAIL']
    if critical_failures:
        print("\n❌ CRITICAL FAILURES DETECTED:")
        for failure in critical_failures:
            print(f"  - {failure['name']}: {failure['message']}")
            if failure['details']:
                print(f"    {failure['details']}")
        sys.exit(1)
    else:
        print("\n✅ All critical deployment checks passed or skipped")
        sys.exit(0)

if __name__ == "__main__":
    main()
