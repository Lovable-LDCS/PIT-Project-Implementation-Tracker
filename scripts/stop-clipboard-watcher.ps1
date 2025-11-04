$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $scriptRoot ".pids/clipboard-watcher.pid"
$stopFile = Join-Path $scriptRoot ".pids/clipboard-watcher.stop"

if(Test-Path $stopFile){ Remove-Item $stopFile -Force }
New-Item -ItemType File -Path $stopFile -Force | Out-Null

if(Test-Path $pidFile){
  $pid = Get-Content -Raw $pidFile
  Write-Host "Signaled stop for PID $pid; watcher will exit shortly."
}else{
  Write-Host "Stop signal created. If watcher is running without PID file, it will exit on next poll."
}
