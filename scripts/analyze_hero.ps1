Add-Type -AssemblyName System.Drawing

$p2 = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300319_19829193.jpg"
$b2 = New-Object System.Drawing.Bitmap($p2)

Write-Host "--- Analyzing media_1794763300319_19829193.jpg (Hero, $($b2.Width) x $($b2.Height)) ---"

# Let's find the left text "Premium Computing" bounds
# Find non-white pixels in left half (x < 400)
$textXs = @()
for ($y = 50; $y -lt 300; $y += 5) {
    for ($x = 0; $x -lt 400; $x += 2) {
        $c = $b2.GetPixel($x, $y)
        if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
            $textXs += $x
        }
    }
}
$minTextX = ($textXs | Measure-Object -Minimum).Minimum
$maxTextX = ($textXs | Measure-Object -Maximum).Maximum
Write-Host "Hero text left bounds: X = $minTextX to $maxTextX"

# Let's inspect where the button "SHOP COLLECTION" is:
$buttonXs = @()
for ($y = 200; $y -lt 320; $y += 2) {
    for ($x = 0; $x -lt 300; $x += 2) {
        $c = $b2.GetPixel($x, $y)
        # Yellow button: high R, moderate G, low B (e.g., R > 200, G > 140, B < 50)
        if ($c.R -gt 220 -and $c.G -gt 150 -and $c.B -lt 50) {
            $buttonXs += $x
        }
    }
}
if ($buttonXs.Count -gt 0) {
    $btnMin = ($buttonXs | Measure-Object -Minimum).Minimum
    $btnMax = ($buttonXs | Measure-Object -Maximum).Maximum
    Write-Host "Hero button range: X = $btnMin to $btnMax"
}

# Let's check the right image edge (is the keyboard filled to the right edge x=1023?)
$rightPixels = @()
for ($y = 0; $y -lt $b2.Height; $y += 10) {
    $c = $b2.GetPixel(1023, $y)
    $rightPixels += "$($c.R),$($c.G),$($c.B)"
}
Write-Host "Right edge (x=1023) sample colors: $($rightPixels[0..4] -join ' | ')"

# Where does the keyboard image start on the left?
$kbStarts = @()
for ($y = 50; $y -lt 300; $y += 20) {
    for ($x = 300; $x -lt 700; $x += 5) {
        $c = $b2.GetPixel($x, $y)
        # Blue button or dark keyboard keys:
        if ($c.B -gt 180 -and $c.R -lt 50) {
            $kbStarts += $x
            break
        }
    }
}
Write-Host "Blue button starting X: $($kbStarts -join ', ')"

$b2.Dispose()
