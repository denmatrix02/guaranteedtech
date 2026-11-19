$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) { $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

$screenshotPath = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_fixed_hero.png"

Write-Host "Capturing headless screenshot..."
Start-Process -FilePath $edgePath -ArgumentList "--headless --disable-gpu --window-size=1280,1000 --screenshot=`"$screenshotPath`" http://localhost:3000" -Wait

Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap($screenshotPath)
Write-Host "Screenshot: $($bmp.Width) x $($bmp.Height)"

function FindLeftEdge($minY, $maxY, $name) {
    for ($x = 0; $x -lt 500; $x++) {
        for ($y = $minY; $y -le $maxY; $y++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 160 -or $c.G -lt 160 -or $c.B -lt 160) {
                Write-Host "$($name.PadRight(40)) : Left X = $x (Y = $y)"
                return $x
            }
        }
    }
    Write-Host "$($name.PadRight(40)) : NOT FOUND"
    return $null
}

Write-Host "`n=== MEASURING HERO & NAVBAR ALIGNMENT ==="
FindLeftEdge 5 30 "Top Bar Text"
FindLeftEdge 45 105 "Navbar Logo Mark"
FindLeftEdge 120 220 "Hero Headline ('Premium Computing')"
FindLeftEdge 220 270 "Hero Subtext"
FindLeftEdge 270 340 "Hero Button ('SHOP COLLECTION')"
FindLeftEdge 380 440 "Value Prop #1 ('FREE DELIVERY')"

$bmp.Dispose()
