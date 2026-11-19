Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"
$bmp = New-Object System.Drawing.Bitmap($path)
Write-Host "Logo dimensions: $($bmp.Width) x $($bmp.Height)"

$minX = 9999
$maxX = -1
$minY = 9999
$maxY = -1

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check non-transparent and non-white pixel:
        if ($c.A -gt 20 -and ($c.R -lt 250 -or $c.G -lt 250 -or $c.B -lt 250)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Logo content bounds: X = $minX to $maxX (left padding = $minX, right padding = $($bmp.Width - 1 - $maxX))"
Write-Host "Logo content Y bounds: Y = $minY to $maxY (top padding = $minY, bottom padding = $($bmp.Height - 1 - $maxY))"

$bmp.Dispose()
