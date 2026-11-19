Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300319_19829193.jpg"
$b = New-Object System.Drawing.Bitmap($p)

# Find blue pixels in the left text area (for a Smarter You)
for ($y = 100; $y -lt 150; $y += 5) {
    for ($x = 60; $x -lt 250; $x += 5) {
        $c = $b.GetPixel($x, $y)
        if ($c.B -gt 150 -and $c.B -gt ($c.R + 40)) {
            Write-Host "Blue text pixel at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B) Hex: #$($c.R.ToString('X2'))$($c.G.ToString('X2'))$($c.B.ToString('X2'))"
        }
    }
}

$b.Dispose()
