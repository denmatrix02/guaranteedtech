Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794722462828_df0a6fb0.jpg"
$b = New-Object System.Drawing.Bitmap($p)

Write-Host "Width=$($b.Width), Height=$($b.Height)"

# Let's inspect rows around:
# Y = 10 to 20: Top bar
# Y = 40 to 60: Navbar
# Y = 100 to 200: Hero
# Y = 380 to 450: Value Props
# Y = 500 to 550: Categories

function GetRowBounds($startY, $endY, $minXLimit = 0, $maxXLimit = 1024) {
    $minX = 9999
    $maxX = -1
    for ($y = $startY; $y -le $endY; $y++) {
        for ($x = $minXLimit; $x -lt $maxXLimit; $x++) {
            $c = $b.GetPixel($x, $y)
            if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    return [PSCustomObject]@{ MinX = $minX; MaxX = $maxX }
}

$tb = GetRowBounds 5 25
Write-Host "Top bar (y=5-25): X = $($tb.MinX) to $($tb.MaxX)"

$logo = GetRowBounds 35 70 0 300
Write-Host "Logo (y=35-70, x<300): X = $($logo.MinX) to $($logo.MaxX)"

$navLinks = GetRowBounds 40 65 300 700
Write-Host "Nav links (y=40-65, 300<=x<700): X = $($navLinks.MinX) to $($navLinks.MaxX)"

$navIcons = GetRowBounds 40 65 700 1024
Write-Host "Nav icons (y=40-65, x>=700): X = $($navIcons.MinX) to $($navIcons.MaxX)"

$heroText = GetRowBounds 120 220 0 450
Write-Host "Hero text (y=120-220, x<450): X = $($heroText.MinX) to $($heroText.MaxX)"

$heroBtn = GetRowBounds 225 270 0 300
Write-Host "Hero button (y=225-270, x<300): X = $($heroBtn.MinX) to $($heroBtn.MaxX)"

$valProps = GetRowBounds 460 520 0 1024
Write-Host "Value props (y=460-520): X = $($valProps.MinX) to $($valProps.MaxX)"

$catHdr = GetRowBounds 580 620 0 300
Write-Host "Categories title (y=580-620, x<300): X = $($catHdr.MinX) to $($catHdr.MaxX)"

$b.Dispose()
