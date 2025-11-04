Param(
  [int]$IntervalMinutes = 10
)
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupScript = Join-Path $scriptRoot 'chat-backup.ps1'
Start-Process -WindowStyle Minimized powershell -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',"$backupScript",'-IntervalMinutes',"$IntervalMinutes")
Write-Host "Chat backup started (interval: $IntervalMinutes min)."
