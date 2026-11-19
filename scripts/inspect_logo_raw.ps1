Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Inspecting guaranteed_brand_logo.png pixel columns X=0 to 30:"
for ($x = 0; $x -le 30; $x++) {
    $nonWhite = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 30 -and ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230)) {
            $nonWhite++
        }
    }
    if ($nonWhite -gt 0) {
        Write-Host "X=$x has $nonWhite non-white pixels"
    }
}

$bmp.Dispose()
