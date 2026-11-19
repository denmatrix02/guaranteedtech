Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300319_19829193.jpg"
$b = New-Object System.Drawing.Bitmap($p)

# Find yellow pixels in button area (y = 200 to 250, x = 60 to 180)
for ($y = 200; $y -lt 250; $y += 5) {
    for ($x = 70; $x -lt 160; $x += 10) {
        $c = $b.GetPixel($x, $y)
        if ($c.R -gt 200 -and $c.G -gt 140 -and $c.B -lt 50) {
            Write-Host "Button pixel at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B) Hex: #$($c.R.ToString('X2'))$($c.G.ToString('X2'))$($c.B.ToString('X2'))"
        }
    }
}

$b.Dispose()
