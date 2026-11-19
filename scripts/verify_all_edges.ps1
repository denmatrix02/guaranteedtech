Add-Type -AssemblyName System.Drawing

$screenshotPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($screenshotPath)
Write-Host "Screenshot: $($bmp.Width) x $($bmp.Height)"

function FindLeftEdge($minY, $maxY, $name) {
    for ($x = 0; $x -lt 600; $x++) {
        for ($y = $minY; $y -le $maxY; $y++) {
            $c = $bmp.GetPixel($x, $y)
            # Find non-white / non-light-gray pixel (text or icon)
            if ($c.R -lt 160 -or $c.G -lt 160 -or $c.B -lt 160) {
                Write-Host "$($name.PadRight(40)) : Left X = $x (Y = $y, Color = R:$($c.R) G:$($c.G) B:$($c.B))"
                return $x
            }
        }
    }
    Write-Host "$($name.PadRight(40)) : NOT FOUND"
    return $null
}

function FindRightEdge($minY, $maxY, $name) {
    for ($x = $bmp.Width - 1; $x -ge 680; $x--) {
        for ($y = $minY; $y -le $maxY; $y++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 160 -or $c.G -lt 160 -or $c.B -lt 160) {
                Write-Host "$($name.PadRight(40)) : Right X = $x (Y = $y, Color = R:$($c.R) G:$($c.G) B:$($c.B))"
                return $x
            }
        }
    }
    Write-Host "$($name.PadRight(40)) : NOT FOUND"
    return $null
}

Write-Host "`n=== COMPREHENSIVE LEFT GRID ALIGNMENT AT 1280px VIEWPORT ==="
FindLeftEdge 5 30 "1. Top Bar Text"
FindLeftEdge 45 105 "2. Navbar Logo Mark"
FindLeftEdge 250 330 "3. Hero Headline ('Premium Computing')"
FindLeftEdge 380 430 "4. Value Prop #1 ('FREE DELIVERY')"
FindLeftEdge 480 540 "5. Categories Heading ('CATEGORIES')"
FindLeftEdge 540 680 "6. Category Card 1 (Printers)"
FindLeftEdge 700 760 "7. Best Selling Heading"
FindLeftEdge 760 950 "8. Best Selling Card 1 (MacBook)"

Write-Host "`n=== COMPREHENSIVE RIGHT GRID ALIGNMENT AT 1280px VIEWPORT ==="
FindRightEdge 5 30 "1. Top Bar Delivery Text"
FindRightEdge 45 105 "2. Navbar Cart Icon"
FindRightEdge 480 540 "3. Categories Hatched Line Right"
FindRightEdge 540 680 "4. Category Card 6 (Laptops)"
FindRightEdge 700 760 "5. Best Selling Carousel Next Button"
FindRightEdge 760 950 "6. Best Selling Card 5 (Tower)"

$bmp.Dispose()
