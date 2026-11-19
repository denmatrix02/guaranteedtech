Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\header_crop.png"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Analyzing pixels around X=68, Y=70-90:"
for ($y = 70; $y -le 90; $y++) {
    for ($x = 65; $x -le 75; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 250 -or $c.G -lt 250 -or $c.B -lt 250) {
            Write-Host "  ($x, $y) -> R:$($c.R) G:$($c.G) B:$($c.B)"
        }
    }
}

$bmp.Dispose()
