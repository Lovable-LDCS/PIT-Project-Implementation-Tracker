$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $scriptRoot '.pids/chat-backup.pid'
if(Test-Path $pidFile){
  $backupPid = Get-Content -Raw $pidFile
  try { Stop-Process -Id $backupPid -Force -ErrorAction Stop; Write-Host "Stopped chat backup PID $backupPid" } catch { Write-Host "Could not stop PID $backupPid: $($_.Exception.Message)" }
  Remove-Item $pidFile -Force
} else { Write-Host "No PID file found. Backup may not be running." }
