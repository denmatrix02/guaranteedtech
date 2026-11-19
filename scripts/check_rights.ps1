Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

function FindRightMostContent($minY, $maxY, $name) {
    for ($x = 1260; $x -ge 1100; $x--) {
        for ($y = $minY; $y -le $maxY; $y++) {
            $c = $bmp.GetPixel($x, $y)
            # Find non-white pixel
            if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
                Write-Host "$($name.PadRight(35)) : Right X = $x (at Y=$y)"
                return $x
            }
        }
    }
    Write-Host "$($name.PadRight(35)) : NOT FOUND"
    return $null
}

Write-Host "=== VERIFYING RIGHT EDGE ALIGNMENT (Ignoring Scrollbar) ==="
FindRightMostContent 10 30 "1. Top Bar Col 3"
FindRightMostContent 55 95 "2. Navbar Cart Icon"
FindRightMostContent 380 430 "3. Value Prop 4"

$bmp.Dispose()
