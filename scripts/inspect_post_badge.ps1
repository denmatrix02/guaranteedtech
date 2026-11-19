Add-Type -AssemblyName System.Drawing

$p = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\post_1.jpg"
$bmp = New-Object System.Drawing.Bitmap($p)

# Save a crop of top-left corner (0,0 to 100,50)
$rect = New-Object System.Drawing.Rectangle(0, 0, 100, 50)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)
$crop.Save("C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\post1_crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()

# What are the bounds of the yellow pixels in the image?
$minX = 999
$maxX = -1
$minY = 999
$maxY = -1
for ($y = 0; $y -lt 50; $y++) {
    for ($x = 0; $x -lt 100; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 220 -and $c.G -gt 150 -and $c.B -lt 60) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Yellow badge in post_1.jpg is at: X=$minX to $maxX, Y=$minY to $maxY"

$bmp.Dispose()
