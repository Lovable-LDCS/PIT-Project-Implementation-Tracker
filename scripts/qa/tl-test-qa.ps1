Param(
  [string]$HtmlPath = "src/frontend/index.html"
)

$errors = New-Object System.Collections.Generic.List[string]
function Fail($m){ $errors.Add($m) }
function Ok($m){ Write-Host "[OK] $m" }

if(-not (Test-Path $HtmlPath)){ Fail "Missing $HtmlPath"; exit 1 }
$html = Get-Content -Raw $HtmlPath
$jsPath = "src/frontend/timelines-test.js"
if(-not (Test-Path $jsPath)){ Fail "Missing test script: $jsPath" }
$js = if(Test-Path $jsPath){ Get-Content -Raw $jsPath } else { '' }

# Presence checks
if($html -notmatch 'data-testid\s*=\s*"TID-TL-TEST-PAGE"'){ Fail 'Missing: TID-TL-TEST-PAGE' } else { Ok 'Found: TID-TL-TEST-PAGE' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-Z-YEAR"'){ Fail 'Missing: TID-TLT-Z-YEAR' } else { Ok 'Found: TID-TLT-Z-YEAR' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-Z-QUARTER"'){ Fail 'Missing: TID-TLT-Z-QUARTER' } else { Ok 'Found: TID-TLT-Z-QUARTER' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-Z-MONTH"'){ Fail 'Missing: TID-TLT-Z-MONTH' } else { Ok 'Found: TID-TLT-Z-MONTH' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-Z-WEEK"'){ Fail 'Missing: TID-TLT-Z-WEEK' } else { Ok 'Found: TID-TLT-Z-WEEK' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-Z-DAY"'){ Fail 'Missing: TID-TLT-Z-DAY' } else { Ok 'Found: TID-TLT-Z-DAY' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-VIEW-START"'){ Fail 'Missing: TID-TLT-VIEW-START' } else { Ok 'Found: TID-TLT-VIEW-START' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-LABELS"'){ Fail 'Missing: TID-TLT-LABELS' } else { Ok 'Found: TID-TLT-LABELS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-PROGRESS"'){ Fail 'Missing: TID-TLT-PROGRESS' } else { Ok 'Found: TID-TLT-PROGRESS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-SCROLL"'){ Fail 'Missing: TID-TLT-SCROLL' } else { Ok 'Found: TID-TLT-SCROLL' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-AXIS-YEARS"'){ Fail 'Missing: TID-TLT-AXIS-YEARS' } else { Ok 'Found: TID-TLT-AXIS-YEARS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-AXIS-QUARTERS"'){ Fail 'Missing: TID-TLT-AXIS-QUARTERS' } else { Ok 'Found: TID-TLT-AXIS-QUARTERS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-AXIS-MONTHS"'){ Fail 'Missing: TID-TLT-AXIS-MONTHS' } else { Ok 'Found: TID-TLT-AXIS-MONTHS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-AXIS-WEEKS"'){ Fail 'Missing: TID-TLT-AXIS-WEEKS' } else { Ok 'Found: TID-TLT-AXIS-WEEKS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-AXIS-DAYS"'){ Fail 'Missing: TID-TLT-AXIS-DAYS' } else { Ok 'Found: TID-TLT-AXIS-DAYS' }
if($html -notmatch 'data-testid\s*=\s*"TID-TLT-CANVAS"'){ Fail 'Missing: TID-TLT-CANVAS' } else { Ok 'Found: TID-TLT-CANVAS' }

# JS sanity checks
if($js -notmatch 'function\s+render\('){ Fail 'Missing: render() in test script' } else { Ok 'Found: render() in test script' }
if($js -notmatch 'function\s+miniQA\('){ Fail 'Missing: miniQA() in test script' } else { Ok 'Found: miniQA() in test script' }
if($js -notmatch 'state\.zoom'){ Fail 'Missing: test state management' } else { Ok 'Found: test state mgmt' }

if($errors.Count -gt 0){ foreach($e in $errors){ Write-Host "[RED X] $e" }; exit 1 }
Ok "Timelines Test mini QA passed basic presence checks"
exit 0
