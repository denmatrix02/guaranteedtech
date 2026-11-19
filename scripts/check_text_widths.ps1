Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300319_19829193.jpg"
$bmp = New-Object System.Drawing.Bitmap($p)

# Find the end of "Computing" (y = 90 to 115)
$endX = -1
for ($x = 450; $x -ge 200; $x--) {
    for ($y = 90; $y -le 115; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 150 -and $c.G -lt 150 -and $c.B -lt 150) {
            $endX = $x
            break
        }
    }
    if ($endX -gt 0) { break }
}
Write-Host "'Premium Computing' ends at X = $endX"

# Find the end of "for a Smarter You" (y = 125 to 150)
$endBlueX = -1
for ($x = 450; $x -ge 200; $x--) {
    for ($y = 125; $y -le 150; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.B -gt 150 -and $c.R -lt 120) {
            $endBlueX = $x
            break
        }
    }
    if ($endBlueX -gt 0) { break }
}
Write-Host "'for a Smarter You' ends at X = $endBlueX"

# Find the end of subtext (y = 160 to 180)
$endSubX = -1
for ($x = 450; $x -ge 200; $x--) {
    for ($y = 160; $y -le 180; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 180 -and $c.G -lt 180 -and $c.B -lt 180) {
            $endSubX = $x
            break
        }
    }
    if ($endSubX -gt 0) { break }
}
Write-Host "Subtext ends at X = $endSubX"

# Find button X bounds (y = 200 to 230)
$btnLeft = -1
$btnRight = -1
for ($x = 50; $x -lt 400; $x++) {
    for ($y = 200; $y -le 230; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 220 -and $c.G -gt 150 -and $c.B -lt 50) {
            if ($btnLeft -lt 0) { $btnLeft = $x }
            $btnRight = $x
        }
    }
}
Write-Host "Button bounds: X = $btnLeft to $btnRight (width = $($btnRight - $btnLeft + 1))"

$bmp.Dispose()
