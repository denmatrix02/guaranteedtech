$html = (Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing).Content

if ($html -match '(<header.*?</header>)') {
    Write-Host "Found Header:"
    Write-Host $matches[1]
}
