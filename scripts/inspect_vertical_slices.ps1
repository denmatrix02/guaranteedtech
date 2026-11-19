Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

# Let's inspect Y from 0 to 1400 in steps of 50 to see where each section starts:
for ($y = 0; $y -lt 1400; $y += 50) {
    $leftNonWhite = -1
    $rightNonWhite = -1
    for ($x = 0; $x -lt 600; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) {
            $leftNonWhite = $x
            break
        }
    }
    for ($x = 1279; $x -ge 600; $x--) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) {
            $rightNonWhite = $x
            break
        }
    }
    Write-Host "Y = $y : Left = $leftNonWhite, Right = $rightNonWhite"
}

$bmp.Dispose()
