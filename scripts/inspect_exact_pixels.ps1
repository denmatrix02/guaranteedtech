Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Inspecting Header row by row from X = 35 to 80:"
for ($y = 60; $y -le 90; $y += 2) {
    $line = ""
    for ($x = 40; $x -le 75; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $line += "$x "
        }
    }
    if ($line.Length -gt 0) {
        Write-Host "Y=$y has non-white at: $line"
    }
}

# Also let's inspect the Top Bar row Y=10 to 25:
Write-Host "`nInspecting Top Bar row by row from X = 35 to 60:"
for ($y = 10; $y -le 25; $y += 2) {
    $line = ""
    for ($x = 35; $x -le 60; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
            $line += "$x "
        }
    }
    if ($line.Length -gt 0) {
        Write-Host "Y=$y has text at: $line"
    }
}

# Also let's inspect the Hero row Y=260 to 300:
Write-Host "`nInspecting Hero Headline row by row from X = 35 to 60:"
for ($y = 260; $y -le 300; $y += 5) {
    $line = ""
    for ($x = 35; $x -le 60; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 100 -and $c.G -lt 100 -and $c.B -lt 100) {
            $line += "$x "
        }
    }
    if ($line.Length -gt 0) {
        Write-Host "Y=$y has text at: $line"
    }
}

$bmp.Dispose()
