Param(
  [int]$Port = [int]($env:PM_LOCAL_PORT -as [int])
)
if(-not $Port){ $Port = 8080 }
try{
  $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  if(-not $conns){ Write-Host "No process found listening on port $Port"; exit 0 }
  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
  foreach($procId in $pids){
    try{ Stop-Process -Id $procId -Force -ErrorAction Stop; Write-Host ("Stopped PID {0} on port {1}" -f $procId,$Port) }catch{ Write-Host ("Could not stop PID {0}: {1}" -f $procId,$_.Exception.Message) }
  }
  exit 0
}catch{
  Write-Host ("Error stopping by port {0}: {1}" -f $Port,$_.Exception.Message); exit 1
}

