Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

# Let's measure the right edge of the 4 Value Props (Y = 575 to 695):
Write-Host "Scanning Value Props right edge:"
$valRight = -1
for ($x = 1279; $x -ge 1100; $x--) {
    for ($y = 480; $y -le 570; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Find non-white pixel in the 4th value prop
        if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
            Write-Host "Value Prop #4 Rightmost X = $x (at Y=$y)"
            $valRight = $x
            break
        }
    }
    if ($valRight -gt 0) { break }
}

$bmp.Dispose()
