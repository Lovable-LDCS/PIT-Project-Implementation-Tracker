Param(
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$PollMs = 1000,
  [int]$DedupSeconds = 2
)

function Write-Info($msg){ Write-Host "[ClipboardWatcher] $msg" }
function Ensure-STA {
  $apartment = [System.Threading.Thread]::CurrentThread.ApartmentState
  if($apartment -ne 'STA'){
    Write-Host "[RED X] Clipboard requires STA. Please run: powershell -STA -File scripts/clipboard-watch.ps1 -OutDir '<dir>'"
    exit 1
  }
}

Ensure-STA

# Prepare paths
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidDir = Join-Path $scriptRoot ".pids"
$pidFile = Join-Path $pidDir "clipboard-watcher.pid"

if(-not (Test-Path $OutDir)){
  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
}
if(-not (Test-Path $pidDir)){
  New-Item -ItemType Directory -Force -Path $pidDir | Out-Null
}

# Write PID file
$PID | Out-File -Encoding ascii -FilePath $pidFile -Force
Write-Info "Started. PID $PID. Saving to '$OutDir'. Poll=$PollMs ms, Dedup=${DedupSeconds}s"

# Load required assemblies
Add-Type -AssemblyName System.Windows.Forms | Out-Null
Add-Type -AssemblyName System.Drawing | Out-Null

# Dedup state
$recentHashes = New-Object System.Collections.Generic.Queue[string]
$recentWindow = [TimeSpan]::FromSeconds($DedupSeconds)
$recentTimes = New-Object System.Collections.Generic.Queue[datetime]
# Track last seen image hash to avoid saving the same content repeatedly while it remains on the clipboard
$script:lastHash = $null

function Get-ClipboardPngBytes {
  if([System.Windows.Forms.Clipboard]::ContainsImage()){
    $img = [System.Windows.Forms.Clipboard]::GetImage()
    if($null -ne $img){
      $ms = New-Object System.IO.MemoryStream
      $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
      $bytes = $ms.ToArray()
      $ms.Dispose()
      return ,$bytes
    }
  }
  return $null
}

function Get-HashHex([byte[]]$bytes){
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    $hash = $sha.ComputeHash($bytes)
  } finally { $sha.Dispose() }
  return ([System.BitConverter]::ToString($hash)).Replace('-', '').ToLowerInvariant()
}

try {
  while($true){
    # Optional stop file (failsafe)
    $stopFile = Join-Path $pidDir "clipboard-watcher.stop"
    if(Test-Path $stopFile){ Write-Info "Stop file detected. Exiting."; Remove-Item $stopFile -Force; break }

    $bytes = Get-ClipboardPngBytes
    if($bytes){
      $hash = Get-HashHex $bytes
      $now = Get-Date
      # If clipboard content hasn't changed since last capture, skip saving
      if($script:lastHash -ne $hash){
        # Purge old dedup entries (still useful to suppress bursts)
        while($recentTimes.Count -gt 0 -and ($now - $recentTimes.Peek()) -gt $recentWindow){
          $null = $recentTimes.Dequeue(); $null = $recentHashes.Dequeue()
        }
        $isDup = $false
        foreach($h in $recentHashes){ if($h -eq $hash){ $isDup = $true; break } }
        if(-not $isDup){
          $recentTimes.Enqueue($now); $recentHashes.Enqueue($hash)
          $ts = $now.ToString('yyyyMMdd-HHmmss-fff')
          $file = Join-Path $OutDir ("screenshot-" + $ts + ".png")
          [System.IO.File]::WriteAllBytes($file, $bytes)
          Write-Info "Saved $file"
          $script:lastHash = $hash
        }
      }
    }
    Start-Sleep -Milliseconds $PollMs
  }
}
finally {
  if(Test-Path $pidFile){ Remove-Item $pidFile -Force }
  Write-Info "Stopped."
}
