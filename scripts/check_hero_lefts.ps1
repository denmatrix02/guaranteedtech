Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_fixed_hero.png")

for ($y = 200; $y -le 315; $y += 5) {
    for ($x = 0; $x -lt 100; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 180 -and $c.G -lt 180 -and $c.B -lt 180) {
            Write-Host "Y=$y has content starting at X = $x (Color: R:$($c.R) G:$($c.G) B:$($c.B))"
            break
        }
    }
}
$bmp.Dispose()
