Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

# Let's crop out the header region and save it to an image so we can inspect it!
$headerRect = New-Object System.Drawing.Rectangle(0, 0, 400, 150)
$headerCrop = $bmp.Clone($headerRect, $bmp.PixelFormat)
$cropPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\header_crop.png"
$headerCrop.Save($cropPath, [System.Drawing.Imaging.ImageFormat]::Png)
$headerCrop.Dispose()
Write-Host "Saved header crop to: $cropPath"

# Let's find every single colored pixel in header_crop:
Write-Host "Scanning Y=40 to 110 in header_crop:"
$minX = 9999
$maxX = -1
$minY = 9999
$maxY = -1

for ($y = 40; $y -lt 110; $y++) {
    for ($x = 0; $x -lt 400; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Any non-white pixel
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Header elements found: X = $minX to $maxX, Y = $minY to $maxY"

$bmp.Dispose()
