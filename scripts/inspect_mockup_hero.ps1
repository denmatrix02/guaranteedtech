Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300319_19829193.jpg"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Mockup Hero Dimensions: $($bmp.Width) x $($bmp.Height)"

# Let's inspect the text lines in media_1794763300319_19829193.jpg
# Line 1: "Premium Computing" (dark/black)
# Line 2: "for a Smarter You" (blue)
# Line 3: "Get your computing products — all in one place." (gray)
# Line 4: Button "SHOP COLLECTION" (yellow)

function AnalyzeTextBand($startY, $endY, $name) {
    $minX = 9999
    $maxX = -1
    $minY = 9999
    $maxY = -1
    for ($y = $startY; $y -le $endY; $y++) {
        for ($x = 0; $x -lt 450; $x++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 210 -or $c.G -lt 210 -or $c.B -lt 210) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    Write-Host "$name :"
    Write-Host "  X = $minX to $maxX (width = $($maxX - $minX + 1))"
    Write-Host "  Y = $minY to $maxY (height = $($maxY - $minY + 1))"
    return [PSCustomObject]@{ MinX = $minX; MaxX = $maxX; MinY = $minY; MaxY = $maxY }
}

$line1 = AnalyzeTextBand 60 115 "Line 1: 'Premium Computing'"
$line2 = AnalyzeTextBand 116 165 "Line 2: 'for a Smarter You'"
$line3 = AnalyzeTextBand 166 210 "Line 3: 'Get your computing...'"
$btn = AnalyzeTextBand 215 270 "Button: 'SHOP COLLECTION'"

Write-Host "`nSpacing Measurements:"
Write-Host "Line 1 bottom to Line 2 top gap: $($line2.MinY - $line1.MaxY) px"
Write-Host "Line 2 bottom to Line 3 top gap: $($line3.MinY - $line2.MaxY) px"
Write-Host "Line 3 bottom to Button top gap: $($btn.MinY - $line3.MaxY) px"

# Compare Left alignment:
Write-Host "`nLeft Alignments in Mockup:"
Write-Host "Line 1 Left X: $($line1.MinX)"
Write-Host "Line 2 Left X: $($line2.MinX)"
Write-Host "Line 3 Left X: $($line3.MinX)"
Write-Host "Button Left X: $($btn.MinX)"

$bmp.Dispose()
