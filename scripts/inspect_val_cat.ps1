Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Scanning Value Props right edge (Y = 580 to 680):"
$valRight = -1
for ($x = 1250; $x -ge 1100; $x--) {
    for ($y = 590; $y -le 660; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Any text/icon color in Value Prop 4
        if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
            Write-Host "Value Prop #4 ('PAYMENT ON DELIVERY') Rightmost X = $x at Y = $y (Color: R:$($c.R) G:$($c.G) B:$($c.B))"
            $valRight = $x
            break
        }
    }
    if ($valRight -gt 0) { break }
}

# Also let's measure Categories section (Y = 690 to 900)
Write-Host "`nScanning Categories section (Y = 690 to 900):"
$catHdrRight = -1
for ($x = 1250; $x -ge 1100; $x--) {
    for ($y = 700; $y -le 740; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Hatched line or element
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            Write-Host "Categories Hatched Line Rightmost X = $x at Y = $y"
            $catHdrRight = $x
            break
        }
    }
    if ($catHdrRight -gt 0) { break }
}

$catCardRight = -1
for ($x = 1250; $x -ge 1100; $x--) {
    for ($y = 750; $y -le 880; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            Write-Host "Category Card 6 (Laptops) Rightmost X = $x at Y = $y"
            $catCardRight = $x
            break
        }
    }
    if ($catCardRight -gt 0) { break }
}

$bmp.Dispose()
