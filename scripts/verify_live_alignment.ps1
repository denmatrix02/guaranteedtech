Add-Type -AssemblyName System.Drawing

$screenshotPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"

# Use headless Edge to capture screenshot at standard 1280x900 viewport
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

Write-Host "Capturing headless screenshot from http://localhost:3000..."
$process = Start-Process -FilePath $edgePath -ArgumentList "--headless --disable-gpu --window-size=1280,1400 --screenshot=`"$screenshotPath`" http://localhost:3000" -Wait -PassThru

if (Test-Path $screenshotPath) {
    Write-Host "Screenshot captured successfully: $screenshotPath"
    $bmp = New-Object System.Drawing.Bitmap($screenshotPath)
    Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"

    function FindLeftEdge($minY, $maxY, $name) {
        for ($x = 0; $x -lt 600; $x++) {
            for ($y = $minY; $y -le $maxY; $y++) {
                $c = $bmp.GetPixel($x, $y)
                # Find non-white/non-light gray pixel (text or icon)
                if ($c.R -lt 160 -or $c.G -lt 160 -or $c.B -lt 160) {
                    Write-Host "$($name.PadRight(35)) : Leftmost X = $x (at Y = $y, Color = R:$($c.R) G:$($c.G) B:$($c.B))"
                    return $x
                }
            }
        }
        Write-Host "$($name.PadRight(35)) : NOT FOUND"
        return $null
    }

    Write-Host "`n=== MEASURING VERTICAL GRID ALIGNMENT AT 1280px VIEWPORT ==="
    $tbX = FindLeftEdge 5 35 "1. Top Bar ('Need help?...')"
    $logoX = FindLeftEdge 40 100 "2. Navbar Logo (Guaranteed mark)"
    $heroX = FindLeftEdge 120 250 "3. Hero Headline ('Premium Computing')"
    $valX = FindLeftEdge 380 480 "4. Value Prop #1 ('FREE DELIVERY')"
    $catX = FindLeftEdge 500 580 "5. Categories Title ('CATEGORIES')"

    $bmp.Dispose()
} else {
    Write-Host "Failed to capture screenshot."
}
