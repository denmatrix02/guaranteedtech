Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Scanning Value Props right edge in row Y = 390 to 420:"
$rightX = -1
for ($x = 1250; $x -ge 1100; $x--) {
    for ($y = 390; $y -le 420; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
            Write-Host "Found Value Prop 4 text at X = $x, Y = $y (R:$($c.R) G:$($c.G) B:$($c.B))"
            $rightX = $x
            break
        }
    }
    if ($rightX -gt 0) { break }
}

$bmp.Dispose()
