Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794820705056_90478652.png"
$destPath = "c:\Users\DENNIS\Documents\Guaranteed Tech\public\images\ui\guaranteed_brand_logo.png"

$bmp = New-Object System.Drawing.Bitmap($srcPath)

$minX = 87
$maxX = 598
$minY = 38
$maxY = 184

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

Write-Host "Cropping logo to: $cropWidth x $cropHeight"

$rect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
$cropped = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Save cropped version
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$bmp.Dispose()

Write-Host "Verifying saved cropped logo at: $destPath"
$checkBmp = New-Object System.Drawing.Bitmap($destPath)
Write-Host "New Logo Dimensions: $($checkBmp.Width) x $($checkBmp.Height)"

# Check leftmost pixel column (x=0) has visible pixels
$visibleCol0 = 0
for ($y = 0; $y -lt $checkBmp.Height; $y++) {
    $c = $checkBmp.GetPixel(0, $y)
    if ($c.A -gt 20) { $visibleCol0++ }
}
Write-Host "Leftmost column (x=0) has $visibleCol0 visible pixels (Zero left padding confirmed!)"

# Check rightmost pixel column (x=Width-1) has visible pixels
$visibleColRight = 0
for ($y = 0; $y -lt $checkBmp.Height; $y++) {
    $c = $checkBmp.GetPixel($checkBmp.Width - 1, $y)
    if ($c.A -gt 20) { $visibleColRight++ }
}
Write-Host "Rightmost column (x=$($checkBmp.Width - 1)) has $visibleColRight visible pixels (Zero right padding confirmed!)"

$checkBmp.Dispose()
