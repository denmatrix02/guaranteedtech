Add-Type -AssemblyName System.Drawing

$path = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794722462828_df0a6fb0.jpg"
$bmp = New-Object System.Drawing.Bitmap($path)

function FindLeftMostPixel($minY, $maxY, $name) {
    for ($x = 0; $x -lt 500; $x++) {
        for ($y = $minY; $y -le $maxY; $y++) {
            $c = $bmp.GetPixel($x, $y)
            # Find non-white/non-light gray pixel
            if ($c.R -lt 150 -or $c.G -lt 150 -or $c.B -lt 150) {
                Write-Host "$($name.PadRight(35)) : Leftmost X = $x (at Y = $y, Color = R:$($c.R) G:$($c.G) B:$($c.B))"
                return
            }
        }
    }
    Write-Host "$($name.PadRight(35)) : NOT FOUND"
}

FindLeftMostPixel 5 25 "Top Bar (Need help?)"
FindLeftMostPixel 35 70 "Navbar Logo"
FindLeftMostPixel 100 240 "Hero Text (Premium Computing)"
FindLeftMostPixel 240 280 "Hero Button (SHOP COLLECTION)"
FindLeftMostPixel 460 520 "Value Props (FREE DELIVERY)"
FindLeftMostPixel 580 620 "Categories (Header)"

$bmp.Dispose()
