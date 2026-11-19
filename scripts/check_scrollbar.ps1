Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Pixel at (1277, 0): $($bmp.GetPixel(1277, 0))"
Write-Host "Pixel at (1277, 50): $($bmp.GetPixel(1277, 50))"
Write-Host "Pixel at (1279, 50): $($bmp.GetPixel(1279, 50))"

# Is it a scrollbar?!
# In headless edge, if the window is 1280 wide and the page is scrollable,
# the scrollbar is on the right from x = 1264 to 1279!
Write-Host "Checking for scrollbar (X=1265 to 1279 at Y=100):"
for ($x = 1260; $x -lt 1280; $x += 2) {
    $c = $bmp.GetPixel($x, 100)
    Write-Host "X=$x -> R:$($c.R) G:$($c.G) B:$($c.B)"
}

$bmp.Dispose()
