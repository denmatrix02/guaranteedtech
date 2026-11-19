Add-Type -AssemblyName System.Drawing

$path = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794722462828_df0a6fb0.jpg"
$bmp = New-Object System.Drawing.Bitmap($path)

Write-Host "Width=$($bmp.Width), Height=$($bmp.Height)"

Write-Host "Checking row Y=15 (Top bar):"
for ($x = 70; $x -le 130; $x += 5) {
    $c = $bmp.GetPixel($x, 15)
    Write-Host " x=$($x) : R=$($c.R) G=$($c.G) B=$($c.B)"
}

Write-Host "Checking row Y=55 (Logo):"
for ($x = 70; $x -le 130; $x += 5) {
    $c = $bmp.GetPixel($x, 55)
    Write-Host " x=$($x) : R=$($c.R) G=$($c.G) B=$($c.B)"
}

Write-Host "Checking row Y=150 (Hero text 'Premium Computing'):"
for ($x = 50; $x -le 130; $x += 5) {
    $c = $bmp.GetPixel($x, 150)
    Write-Host " x=$($x) : R=$($c.R) G=$($c.G) B=$($c.B)"
}

Write-Host "Checking row Y=480 (Value Prop #1 'FREE DELIVERY'):"
for ($x = 70; $x -le 130; $x += 5) {
    $c = $bmp.GetPixel($x, 480)
    Write-Host " x=$($x) : R=$($c.R) G=$($c.G) B=$($c.B)"
}

$bmp.Dispose()
