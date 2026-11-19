Add-Type -AssemblyName System.Drawing

$paths = @("post_1.jpg", "post_2.jpg", "post_3.jpg", "post_4.jpg")
foreach ($f in $paths) {
    $p = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\$f"
    $bmp = New-Object System.Drawing.Bitmap($p)
    Write-Host "$f background at (10, 5): $($bmp.GetPixel(10, 5))"
    Write-Host "$f background at (5, 5): $($bmp.GetPixel(5, 5))"
    $bmp.Dispose()
}
