Add-Type -AssemblyName System.Drawing

$p1 = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300141_433d6e5a.png"
$b1 = New-Object System.Drawing.Bitmap($p1)

Write-Host "--- Analyzing media_1794763300141_433d6e5a.png (Header, 1024x69) ---"

# Let's inspect rows to find Top Bar vs Main Nav
# In 69px height:
# Is there a top bar in media_1794763300141_433d6e5a.png?
# Let's check non-white pixels by Y:
for ($y = 0; $y -lt $b1.Height; $y += 5) {
    $count = 0
    for ($x = 0; $x -lt $b1.Width; $x++) {
        $c = $b1.GetPixel($x, $y)
        if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) { $count++ }
    }
    if ($count -gt 0) {
        Write-Host "Y=$y has $count dark pixels"
    }
}

# Let's find logo X bounds in media_1794763300141_433d6e5a.png
$logoMinX = 9999
$logoMaxX = -1
$navMinX = 9999
$navMaxX = -1
$iconsMinX = 9999
$iconsMaxX = -1

for ($y = 0; $y -lt $b1.Height; $y++) {
    for ($x = 0; $x -lt $b1.Width; $x++) {
        $c = $b1.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            # Logo is on the left: x < 300
            if ($x -lt 300) {
                if ($x -lt $logoMinX) { $logoMinX = $x }
                if ($x -gt $logoMaxX) { $logoMaxX = $x }
            }
            # Nav is in middle: 300 <= x < 750
            if ($x -ge 300 -and $x -lt 750) {
                if ($x -lt $navMinX) { $navMinX = $x }
                if ($x -gt $navMaxX) { $navMaxX = $x }
            }
            # Icons on right: x >= 750
            if ($x -ge 750) {
                if ($x -lt $iconsMinX) { $iconsMinX = $x }
                if ($x -gt $iconsMaxX) { $iconsMaxX = $x }
            }
        }
    }
}

Write-Host "Logo X range: $logoMinX to $logoMaxX"
Write-Host "Nav X range: $navMinX to $navMaxX (center = $(($navMinX + $navMaxX)/2))"
Write-Host "Icons X range: $iconsMinX to $iconsMaxX (margin right = $(1024 - $iconsMaxX))"

$b1.Dispose()
