Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"
$bmp = New-Object System.Drawing.Bitmap($path)

$minX = 9999
$maxX = -1
$minY = 9999
$maxY = -1

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if pixel is part of the logo (not pure white / not near-white background)
        # Background is white (R > 240, G > 240, B > 240)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            # Exclude very faint border artifacts if any
            if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
}

Write-Host "Tight Logo Bounds: X = $minX to $maxX (width = $($maxX - $minX + 1)), Y = $minY to $maxY (height = $($maxY - $minY + 1))"

# Create a tight cropped bitmap with transparent background
$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1
$cropped = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($cropped)
$graphics.Clear([System.Drawing.Color]::Transparent)

for ($x = 0; $x -lt $cropWidth; $x++) {
    for ($y = 0; $y -lt $cropHeight; $y++) {
        $srcColor = $bmp.GetPixel($minX + $x, $minY + $y)
        # Make white background transparent
        if ($srcColor.R -gt 245 -and $srcColor.G -gt 245 -and $srcColor.B -gt 245) {
            $cropped.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $cropped.SetPixel($x, $y, $srcColor)
        }
    }
}

$graphics.Dispose()
$bmp.Dispose()

# Backup old logo and save tightly cropped logo
Copy-Item $path "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo_backup.png" -Force
$cropped.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

Write-Host "Tight cropped logo saved successfully with ZERO left/right padding!"
