$html = (Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing).Content

Write-Host "Length of HTML: $($html.Length)"

# Let's extract the header tag and top bar
if ($html -match '(<div class="bg-white border-b border-slate-100.*?)(<section)') {
    Write-Host "Found Top Bar and Header:"
    Write-Host $matches[1].Substring(0, [Math]::Min(1000, $matches[1].Length))
}
