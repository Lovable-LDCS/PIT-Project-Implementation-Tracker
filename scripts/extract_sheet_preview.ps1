Param(
  [string]$Root = ".",
  [string[]]$TargetSheets = @("Actions","Timelines","Progress tracking","Teams & Departments","Team Members","RCA","Plan","Gaborone Day-to-day","Sec Operations","Technical","Site Rollups","Workings"),
  [int]$MaxCols = 20,
  [int]$HeaderScanRows = 20,
  [int]$SampleDataRows = 5
)

function Convert-ColLettersToIndex {
  param([string]$letters)
  $sum = 0
  foreach($ch in $letters.ToUpper().ToCharArray()){
    if($ch -lt 'A' -or $ch -gt 'Z'){ continue }
    $sum = $sum * 26 + ([int][char]$ch - [int][char]'A' + 1)
  }
  return $sum
}
function Convert-IndexToColLetters {
  param([int]$index)
  if($index -le 0){ return '' }
  $letters = ''
  while($index -gt 0){
    $rem = ($index - 1) % 26
    $letters = [char]([int][char]'A' + $rem) + $letters
    $index = [math]::Floor(($index - 1) / 26)
  }
  return $letters
}

function Get-SharedStrings {
  param([string]$SstPath)
  if(-not (Test-Path $SstPath)){ return @() }
  $sstXml = [xml](Get-Content -Raw $SstPath)
  $values = New-Object System.Collections.Generic.List[string]
  foreach($si in $sstXml.sst.si){
    $textParts = @()
    if($si.t){ $textParts += $si.t.'#text' }
    if($si.r){ foreach($r in $si.r){ if($r.t){ $textParts += $r.t.'#text' } } }
    $values.Add(($textParts -join ''))
  }
  return ,$values
}

function Get-CellValue {
  param(
    [System.Xml.XmlElement]$CellNode,
    [System.Collections.Generic.List[string]]$SST
  )
  $t = $CellNode.t
  $v = $CellNode.v
  if(($t -eq 's') -and $v){
    $raw = $v
    $text = if($raw -is [string]){ $raw } else { $raw.'#text' }
    $idx = 0
    if([int]::TryParse($text, [ref]$idx)){
      if($idx -ge 0 -and $idx -lt $SST.Count){ return $SST[$idx] }
    }
    return $text
  }
  if($t -eq 'inlineStr' -and $CellNode.is -and $CellNode.is.t){ return $CellNode.is.t.'#text' }
  if($v){ return $v.'#text' }
  return ''
}

function Read-Sheet {
  param(
    [xml]$Workbook,
    [xml]$Rels,
    [string]$OutDir,
    [string]$SheetName,
    [System.Collections.Generic.List[string]]$SST
  )
  $sheetEntries = @($Workbook.workbook.sheets.sheet)
  $targetEntry = $sheetEntries | Where-Object { $_.name -eq $SheetName }
  if(-not $targetEntry){ return $null }
  $rid = $targetEntry.'r:id'
  $target = $null
  if($Rels){ $target = ($Rels.Relationships.Relationship | Where-Object { $_.Id -eq $rid }).Target }
  $sheetPath = if($target){ Join-Path $OutDir ('xl/' + $target) } else { $null }
  if(-not $sheetPath -or -not (Test-Path $sheetPath)){
    # try index fallback
    $index = [array]::IndexOf($sheetEntries, $targetEntry)
    if($index -ge 0){
      $sheetPath = Join-Path $OutDir ("xl/worksheets/sheet{0}.xml" -f ($index+1))
    }
  }
  if(-not (Test-Path $sheetPath)){ return $null }
  $sxml = [xml](Get-Content -Raw $sheetPath)
  return $sxml
}

function Get-RowMap {
  param(
    [xml]$SheetXml,
    [System.Collections.Generic.List[string]]$SST
  )
  $rowMaps = New-Object System.Collections.Generic.List[hashtable]
  foreach($r in $SheetXml.worksheet.sheetData.row){
    $map = @{}
    foreach($c in $r.c){
      $addr = $c.r
      if(-not $addr){ continue }
      $letters = ($addr -replace '\\d','')
      $val = Get-CellValue -CellNode $c -SST $SST
      $map[$letters] = $val
    }
    $rowMaps.Add($map)
  }
  return ,$rowMaps
}

$xlsxFiles = Get-ChildItem -Path $Root -Filter *.xlsx -File -Recurse:$false | Sort-Object Name
if(-not $xlsxFiles){ Write-Host "No .xlsx files found"; exit 0 }

$baseTmp = Join-Path $Root ".tmp_preview"
if(Test-Path $baseTmp){ Remove-Item -Recurse -Force $baseTmp }
New-Item -ItemType Directory -Path $baseTmp | Out-Null

foreach($f in $xlsxFiles){
  $base = [IO.Path]::GetFileNameWithoutExtension($f.Name)
  $outDir = Join-Path $baseTmp $base
  New-Item -ItemType Directory -Path $outDir | Out-Null
  $zipPath = Join-Path $outDir 'archive.zip'
  Copy-Item -LiteralPath $f.FullName -Destination $zipPath -Force
  try { Expand-Archive -Path $zipPath -DestinationPath $outDir -Force } catch {}
  $wbPath = Join-Path $outDir 'xl/workbook.xml'
  if(-not (Test-Path $wbPath)){
    Write-Host "FILE: $($f.Name) | workbook.xml missing"
    continue
  }
  $relsPath = Join-Path $outDir 'xl/_rels/workbook.xml.rels'
  $rels = if(Test-Path $relsPath){ [xml](Get-Content -Raw $relsPath) } else { $null }
  $wb = [xml](Get-Content -Raw $wbPath)
  $sst = Get-SharedStrings -SstPath (Join-Path $outDir 'xl/sharedStrings.xml')

  Write-Host ("FILE: {0}" -f $f.Name)
  foreach($tSheet in $TargetSheets){
    $sheetXml = Read-Sheet -Workbook $wb -Rels $rels -OutDir $outDir -SheetName $tSheet -SST $sst
    if(-not $sheetXml){ continue }

    $rows = Get-RowMap -SheetXml $sheetXml -SST $sst
    if(-not $rows -or $rows.Count -eq 0){ continue }

    # find header row among first HeaderScanRows
    $headerIdx = -1
    $bestScore = -1
    for($i=0; $i -lt [Math]::Min($HeaderScanRows, $rows.Count); $i++){
      $map = $rows[$i]
      $nonEmpty = ($map.Values | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }).Count
      if($nonEmpty -gt $bestScore){ $bestScore = $nonEmpty; $headerIdx = $i }
    }
    if($headerIdx -lt 0){ continue }

    $headerMap = $rows[$headerIdx]
    # pick first MaxCols columns in order A.. etc. but only those present
    $cols = @()
    for($ci=1; $ci -le $MaxCols; $ci++){
      $colL = Convert-IndexToColLetters $ci
      $cols += $colL
    }
    $headers = $cols | ForEach-Object { $val = if($headerMap.ContainsKey($_)) { $headerMap[$_] } else { '' }; @{ l = $_; v = $val } }

    Write-Host ("  SHEET: {0}" -f $tSheet)
    $headerStrings = @()
    foreach($h in $headers){
      $hv = if([string]::IsNullOrWhiteSpace($h.v)) { '(blank)' } else { $h.v }
      $headerStrings += ("{0}: {1}" -f $h.l, $hv)
      if($headerStrings.Count -ge $MaxCols){ break }
    }
    Write-Host ("    Headers: " + ($headerStrings -join ' | '))

    # sample data rows after header
    $start = $headerIdx + 1
    $end = [Math]::Min($rows.Count - 1, $start + $SampleDataRows - 1)
    for($ri=$start; $ri -le $end; $ri++){
      $rowMap = $rows[$ri]
      $vals = $cols | ForEach-Object { if($rowMap.ContainsKey($_)) { $rowMap[$_] } else { '' } }
      $lineParts = @()
      foreach($v in $vals){ $lineParts += (if([string]::IsNullOrWhiteSpace($v)){ '(blank)' } else { $v }) }
      $line = (($lineParts | Select-Object -First $MaxCols) -join ' | ')
      Write-Host ("    Row {0}: {1}" -f ($ri+1), $line)
    }
  }
  Write-Host ''
}