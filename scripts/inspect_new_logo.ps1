Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794820705056_90478652.png"
$bmp = New-Object System.Drawing.Bitmap($srcPath)

Write-Host "Source Image Dimensions: $($bmp.Width) x $($bmp.Height)"

# Check pixel at (0,0)
$c0 = $bmp.GetPixel(0, 0)
Write-Host "Top-left pixel (0,0): A=$($c0.A), R=$($c0.R), G=$($c0.G), B=$($c0.B)"

# Find the exact bounding box of non-white / non-transparent pixels
$minX = 999999
$maxX = -1
$minY = 999999
$maxY = -1

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if visible non-white pixel
        # If transparent or pure white: ignore
        $isBackground = ($c.A -lt 10) -or ($c.R -gt 250 -and $c.G -gt 250 -and $c.B -gt 250)
        if (-not $isBackground) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Tight Content Bounds:"
Write-Host "X: $minX to $maxX (width: $($maxX - $minX + 1))"
Write-Host "Y: $minY to $maxY (height: $($maxY - $minY + 1))"
Write-Host "Left padding in source: $minX px"
Write-Host "Right padding in source: $($bmp.Width - 1 - $maxX) px"
Write-Host "Top padding in source: $minY px"
Write-Host "Bottom padding in source: $($bmp.Height - 1 - $maxY) px"

$bmp.Dispose()
