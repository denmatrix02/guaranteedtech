Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

# Find the border-b of the hero section:
# It's border-slate-100 (R ~ 241, G ~ 245, B ~ 249)
for ($y = 350; $y -lt 600; $y++) {
    $c = $bmp.GetPixel(100, $y)
    # Check if this row is a border line (slightly grayish #F1F5F9 across the screen)
    if ($c.R -ge 235 -and $c.R -le 248 -and $c.G -ge 235 -and $c.G -le 248) {
        # Check if row is consistent across X=100, 200, 300
        $c2 = $bmp.GetPixel(200, $y)
        $c3 = $bmp.GetPixel(300, $y)
        if ($c2.R -eq $c.R -and $c3.R -eq $c.R) {
            Write-Host "Hero border-b found at Y = $y (Color: $($c.R),$($c.G),$($c.B))"
            break
        }
    }
}

$bmp.Dispose()
