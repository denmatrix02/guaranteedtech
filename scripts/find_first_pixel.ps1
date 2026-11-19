Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Width=$($bmp.Width), Height=$($bmp.Height)"
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 20 -and ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240)) {
            Write-Host "FIRST VISIBLE PIXEL IS AT X = $x, Y = $y (Color: A=$($c.A) R=$($c.R) G=$($c.G) B=$($c.B))"
            $bmp.Dispose()
            exit
        }
    }
}
$bmp.Dispose()
