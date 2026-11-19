Add-Type -AssemblyName System.Drawing

$files = @(
    "media_1794763300141_433d6e5a.png",
    "media_1794763300319_19829193.jpg",
    "media_1794718401765_35b6c059.jpg"
)

foreach ($f in $files) {
    $path = Join-Path "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded" $f
    $bmp = New-Object System.Drawing.Bitmap($path)
    Write-Host "File: $f ($($bmp.Width) x $($bmp.Height))"
    $bmp.Dispose()
}
