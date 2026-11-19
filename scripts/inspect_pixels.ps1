Add-Type -AssemblyName System.Drawing

$p1 = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300141_433d6e5a.png"
$b1 = New-Object System.Drawing.Bitmap($p1)

Write-Host "Top-left pixel (0,0): $($b1.GetPixel(0,0))"
Write-Host "Pixel (50, 45): $($b1.GetPixel(50,45))"
Write-Host "Pixel (100, 45): $($b1.GetPixel(100,45))"
Write-Host "Pixel (150, 45): $($b1.GetPixel(150,45))"

# Check horizontal row at y=15 (Top bar text):
$row15Text = @()
for ($x = 0; $x -lt $b1.Width; $x += 10) {
    $c = $b1.GetPixel($x, 15)
    if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
        $row15Text += $x
    }
}
Write-Host "Row 15 non-white Xs: $($row15Text -join ', ')"

# Check horizontal row at y=45 (Main nav row):
$row45Text = @()
for ($x = 0; $x -lt $b1.Width; $x += 5) {
    $c = $b1.GetPixel($x, 45)
    if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
        $row45Text += $x
    }
}
Write-Host "Row 45 non-white Xs: $($row45Text -join ', ')"

$b1.Dispose()
