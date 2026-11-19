Add-Type -AssemblyName System.Drawing

$path = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794722462828_df0a6fb0.jpg"
$bmp = New-Object System.Drawing.Bitmap($path)

function FindRightMostPixel($minY, $maxY, $name) {
    for ($x = $bmp.Width - 1; $x -ge 500; $x--) {
        for ($y = $minY; $y -le $maxY; $y++) {
            $c = $bmp.GetPixel($x, $y)
            # Find non-white/non-light gray pixel
            if ($c.R -lt 150 -or $c.G -lt 150 -or $c.B -lt 150) {
                Write-Host "$($name.PadRight(35)) : Rightmost X = $x (at Y = $y, Color = R:$($c.R) G:$($c.G) B:$($c.B))"
                return
            }
        }
    }
    Write-Host "$($name.PadRight(35)) : NOT FOUND"
}

FindRightMostPixel 5 25 "Top Bar (Delivery)"
FindRightMostPixel 35 70 "Navbar Cart Icon"
FindRightMostPixel 460 540 "Value Props (PAYMENT ON DELIVERY)"

$bmp.Dispose()
