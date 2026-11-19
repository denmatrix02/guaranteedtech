Add-Type -AssemblyName System.Drawing

$files = @("post_1.jpg", "post_2.jpg", "post_3.jpg", "post_4.jpg")

foreach ($f in $files) {
    $path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\$f"
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $bmp = [System.Drawing.Bitmap]::FromStream($ms)
    
    $cleanBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
    $g = [System.Drawing.Graphics]::FromImage($cleanBmp)
    $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
    $g.Dispose()
    
    $bmp.Dispose()
    $ms.Dispose()

    # In cleanBmp, replace the yellow badge in X < 85, Y < 32 with white
    for ($y = 0; $y -lt 32; $y++) {
        for ($x = 0; $x -lt 85; $x++) {
            $c = $cleanBmp.GetPixel($x, $y)
            if ($c.R -lt 245 -or $c.G -lt 245 -or $c.B -lt 245) {
                $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::White)
            }
        }
    }
    
    $cleanBmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cleanBmp.Dispose()
    Write-Host "Cleaned yellow badge from $f successfully!"
}
