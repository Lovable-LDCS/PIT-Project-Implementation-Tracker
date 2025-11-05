Param(
  [int]$IntervalMinutes = 10
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg){ Write-Host "[ChatBackup] $msg" }

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $root '..' '..')).Path
$logFile = Join-Path $repoRoot 'logs/chat/current.md'
$backupDir = Join-Path $repoRoot 'backups/chat'
$pidDir = Join-Path $root '.pids'
$pidFile = Join-Path $pidDir 'chat-backup.pid'

if(-not (Test-Path $backupDir)){ New-Item -ItemType Directory -Force -Path $backupDir | Out-Null }
if(-not (Test-Path $pidDir)){ New-Item -ItemType Directory -Force -Path $pidDir | Out-Null }

$PID | Out-File -FilePath $pidFile -Encoding ascii -Force
Write-Info "Started (PID $PID). Interval = $IntervalMinutes min. Backing up $logFile → $backupDir"

while($true){
  try {
    if(Test-Path $logFile){
      $ts = Get-Date -Format 'yyyyMMdd-HHmmss'
      $dest = Join-Path $backupDir ("chat-" + $ts + '.md')
      Copy-Item -LiteralPath $logFile -Destination $dest -Force
      Write-Info "Snapshot: $dest"
    } else {
      Write-Info "Log file missing: $logFile"
    }
  } catch {
    Write-Info "Error: $($_.Exception.Message)"
  }
  Start-Sleep -Seconds (60 * $IntervalMinutes)
}
