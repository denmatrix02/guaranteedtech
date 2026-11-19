Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794722462828_df0a6fb0.jpg"
$bmp = New-Object System.Drawing.Bitmap($imgPath)
Write-Host "Image Dimensions: $($bmp.Width) x $($bmp.Height)"

# Let's inspect the vertical lines and text starting positions across different sections:
# Top Bar: Y around 5 to 25
# Header (Logo & Nav): Y around 30 to 80
# Hero text ("Premium Computing"): Y around 130 to 220
# Value props ("FREE DELIVERY", "QUALITY GUARANTEE", etc.): Y around 460 to 520
# Categories: Y around 580 to 650

function FindDarkPixelsInRowRange($minY, $maxY) {
    $minX = 999999
    $maxX = -1
    for ($y = $minY; $y -le $maxY; $y += 2) {
        for ($x = 0; $x -lt $bmp.Width; $x += 2) {
            $pixel = $bmp.GetPixel($x, $y)
            # If pixel is significantly non-white (R < 220 or G < 220 or B < 220)
            if ($pixel.R -lt 220 -or $pixel.G -lt 220 -or $pixel.B -lt 220) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    return [PSCustomObject]@{ MinX = $minX; MaxX = $maxX }
}

Write-Host "Analyzing bounding X for each visual band:"
$topBar = FindDarkPixelsInRowRange 5 25
Write-Host "Top Bar text range: X = $($topBar.MinX) to $($topBar.MaxX)"

$navbar = FindDarkPixelsInRowRange 35 75
Write-Host "Navbar (Logo & Icons) range: X = $($navbar.MinX) to $($navbar.MaxX)"

# For Hero, let's find the left text block ("Premium Computing")
# Note that keyboard image is on the right, so we look for text from x = 0 to 450
$heroMinX = 999999
$heroMaxX = -1
for ($y = 120; $y -le 240; $y += 2) {
    for ($x = 0; $x -lt 400; $x += 2) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -lt 200 -or $pixel.G -lt 200 -or $pixel.B -lt 200) {
            if ($x -lt $heroMinX) { $heroMinX = $x }
            if ($x -gt $heroMaxX) { $heroMaxX = $x }
        }
    }
}
Write-Host "Hero Headline Left range: X = $heroMinX to $heroMaxX"

$valueProps = FindDarkPixelsInRowRange 460 520
Write-Host "Value Props range: X = $($valueProps.MinX) to $($valueProps.MaxX)"

$categories = FindDarkPixelsInRowRange 580 620
Write-Host "Categories title range: X = $($categories.MinX) to $($categories.MaxX)"

$bmp.Dispose()
