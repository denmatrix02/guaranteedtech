Add-Type -AssemblyName System.Drawing

$paths = @(
    "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\post_1.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\post_2.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\post_3.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\post_4.jpg"
)

foreach ($p in $paths) {
    if (Test-Path $p) {
        $bmp = New-Object System.Drawing.Bitmap($p)
        Write-Host "File: $p ($($bmp.Width) x $($bmp.Height))"
        # Check top-left region for yellow pixels:
        $yellowCount = 0
        for ($y = 0; $y -lt 30; $y++) {
            for ($x = 0; $x -lt 80; $x++) {
                $c = $bmp.GetPixel($x, $y)
                if ($c.R -gt 220 -and $c.G -gt 150 -and $c.B -lt 60) {
                    $yellowCount++
                }
            }
        }
        Write-Host "  Top-left (x<80, y<30) yellow pixels in image: $yellowCount"
        $bmp.Dispose()
    } else {
        Write-Host "File not found: $p"
    }
}
