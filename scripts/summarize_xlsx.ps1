Param(
  [string]$Root = ".",
  [int]$MaxHeaderRows = 1,
  [int]$MaxHeaderCols = 20
)

function Convert-ColLettersToIndex {
  param([string]$letters)
  $sum = 0
  foreach($ch in $letters.ToCharArray()){
    $sum = $sum * 26 + ([int][char]$ch - [int][char]'A' + 1)
  }
  return $sum
}

function Get-SharedStrings {
  param([string]$SstPath)
  if(-not (Test-Path $SstPath)){ return @() }
  $sstXml = [xml](Get-Content -Raw $SstPath)
  $values = New-Object System.Collections.Generic.List[string]
  foreach($si in $sstXml.sst.si){
    # si may contain multiple t nodes (rich text); concatenate
    $textParts = @()
    if($si.t){ $textParts += $si.t.'#text' }
    if($si.r){
      foreach($r in $si.r){ if($r.t){ $textParts += $r.t.'#text' } }
    }
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
  if($t -eq 'inlineStr' -and $CellNode.is -and $CellNode.is.t){
    return $CellNode.is.t.'#text'
  }
  if($v){ return $v.'#text' }
  return ''
}

$xlsxFiles = Get-ChildItem -Path $Root -Filter *.xlsx -File -Recurse:$false | Sort-Object Name
if(-not $xlsxFiles){
  Write-Host "No .xlsx files found in $Root"
  exit 0
}

$baseTmp = Join-Path $Root ".tmp_xlsx"
if(Test-Path $baseTmp){ Remove-Item -Recurse -Force $baseTmp }
New-Item -ItemType Directory -Path $baseTmp | Out-Null

foreach($f in $xlsxFiles){
  $name = $f.Name
  $outDir = Join-Path $baseTmp ([IO.Path]::GetFileNameWithoutExtension($name))
  New-Item -ItemType Directory -Path $outDir | Out-Null
  try {
    $tmpZip = Join-Path $outDir 'archive.zip'
    Copy-Item -LiteralPath $f.FullName -Destination $tmpZip -Force
    Expand-Archive -Path $tmpZip -DestinationPath $outDir -Force
  } catch {
    Write-Host "FILE: $name"
    Write-Host "  Unable to expand archive: $($_.Exception.Message)"
    Write-Host ""
    continue
  }

  $workbookPath = Join-Path $outDir 'xl/workbook.xml'
  if(-not (Test-Path $workbookPath)){
    Write-Host "FILE: $name"
    Write-Host "  Missing xl/workbook.xml"
    Write-Host ""
    continue
  }

  $relsPath = Join-Path $outDir 'xl/_rels/workbook.xml.rels'
  $rels = if(Test-Path $relsPath){ [xml](Get-Content -Raw $relsPath) } else { $null }
  $workbook = [xml](Get-Content -Raw $workbookPath)
  $sst = Get-SharedStrings -SstPath (Join-Path $outDir 'xl/sharedStrings.xml')

  Write-Host "FILE: $name"
  $sheets = @($workbook.workbook.sheets.sheet)
  $sheetNames = @($sheets | ForEach-Object { $_.name })
  for($si = 0; $si -lt $sheetNames.Count; $si++){
    $sheetName = $sheetNames[$si]
    $sheetPath = Join-Path $outDir ("xl/worksheets/sheet{0}.xml" -f ($si+1))
    if(-not (Test-Path $sheetPath)){
      # Fallback: try rels mapping if index-based path missing
      $sheet = $sheets[$si]
      $rid = $sheet.'r:id'
      $target = $null
      if($rels){ $target = ($rels.Relationships.Relationship | Where-Object { $_.Id -eq $rid }).Target }
      if($target){ $sheetPath = Join-Path $outDir ('xl/' + $target) }
    }
    if(-not (Test-Path $sheetPath)){
      Write-Host "  - Sheet: $sheetName | missing sheet xml"
      continue
    }

    $sxml = [xml](Get-Content -Raw $sheetPath)
    $rows = @($sxml.worksheet.sheetData.row)
    $rowCount = if($rows){ $rows.Count } else { 0 }

    $maxCol = 0
    $headers = @()

    foreach($c in $sxml.worksheet.sheetData.row.c){
      $addr = $c.r
      if(-not $addr){ continue }
      $letters = ($addr -replace '\\d', '')
      $idx = Convert-ColLettersToIndex $letters
      if($idx -gt $maxCol){ $maxCol = $idx }
    }

    # Find a likely header row among the first few rows
    $headerRow = $null
    $scanRows = @($rows | Select-Object -First 10)
    foreach($r in $scanRows){
      $cells = @($r.c | Sort-Object { Convert-ColLettersToIndex (($_.r) -replace '\\d','') })
      $nonEmpty = 0
      $tmpHeaders = @()
      $i = 0
      foreach($cell in $cells){
        $i++
        if($i -gt $MaxHeaderCols){ break }
        $addr = $cell.r
        $letters = ($addr -replace '\\d','')
        $val = Get-CellValue -CellNode $cell -SST $sst
        if([string]::IsNullOrWhiteSpace($val)){ $val = '(blank)' } else { $nonEmpty++ }
        $tmpHeaders += ("{0}: {1}" -f $letters, $val)
      }
      if($nonEmpty -ge 3){ $headerRow = $r; $headers = $tmpHeaders; break }
    }

    Write-Host ("  - Sheet: {0} | rows: {1} | approx columns: {2}" -f $sheetName, $rowCount, $maxCol)
    if($headers.Count -gt 0){
      Write-Host ("    Headers: " + ($headers -join ' | '))
    }
  }
  Write-Host ""
}
