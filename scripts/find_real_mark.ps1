Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"
$bmp = New-Object System.Drawing.Bitmap($path)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Blue or Orange logo mark
        if (($c.B -gt 150 -and $c.R -lt 150) -or ($c.R -gt 200 -and $c.G -gt 150 -and $c.B -lt 50)) {
            Write-Host "FIRST REAL LOGO MARK PIXEL IS AT X = $x, Y = $y (Color: R=$($c.R) G=$($c.G) B=$($c.B))"
            $bmp.Dispose()
            exit
        }
    }
}
$bmp.Dispose()
