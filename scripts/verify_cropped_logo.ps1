Add-Type -AssemblyName System.Drawing

$path = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Cropped Logo: $($bmp.Width) x $($bmp.Height)"
Write-Host "Pixel (0, 8): $($bmp.GetPixel(0, 8))"
Write-Host "Pixel (1, 8): $($bmp.GetPixel(1, 8))"
Write-Host "Pixel ($($bmp.Width - 1), 8): $($bmp.GetPixel($bmp.Width - 1, 8))"

$bmp.Dispose()
