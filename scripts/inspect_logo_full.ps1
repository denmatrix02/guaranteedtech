Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo_backup.png"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Original Logo dimensions: $($bmp.Width) x $($bmp.Height)"

# Let's inspect where ALL dark/colored pixels are in the original image:
for ($x = 0; $x -lt $bmp.Width; $x += 5) {
    $found = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Any color that is not white (R < 240, G < 240, B < 240)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $found++
        }
    }
    if ($found -gt 0) {
        Write-Host "X=$x has $found non-white pixels"
    }
}

$bmp.Dispose()
