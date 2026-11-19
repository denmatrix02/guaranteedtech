Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794763300319_19829193.jpg"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Mockup Hero Dimensions: $($bmp.Width) x $($bmp.Height)"

# Capital 'P' in Premium
$pMinY = 9999
$pMaxY = -1
for ($y = 70; $y -le 115; $y++) {
    for ($x = 60; $x -le 75; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 150 -and $c.G -lt 150 -and $c.B -lt 150) {
            if ($y -lt $pMinY) { $pMinY = $y }
            if ($y -gt $pMaxY) { $pMaxY = $y }
        }
    }
}
$pHeight = $pMaxY - $pMinY + 1
Write-Host "Capital 'P' height: $pHeight px (from Y=$pMinY to Y=$pMaxY)"

# Line 2 blue text: "for a Smarter You"
$sMinY = 9999
$sMaxY = -1
for ($y = 115; $y -le 160; $y++) {
    for ($x = 60; $x -le 250; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.B -gt 150 -and $c.R -lt 120) {
            if ($y -lt $sMinY) { $sMinY = $y }
            if ($y -gt $sMaxY) { $sMaxY = $y }
        }
    }
}
$sHeight = $sMaxY - $sMinY + 1
Write-Host "Line 2 blue text height: $sHeight px (from Y=$sMinY to Y=$sMaxY)"

# Subtext "Get your computing products — all in one place."
$subMinY = 9999
$subMaxY = -1
for ($y = 160; $y -le 205; $y++) {
    for ($x = 60; $x -le 350; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 180 -and $c.G -lt 180 -and $c.B -lt 180) {
            if ($y -lt $subMinY) { $subMinY = $y }
            if ($y -gt $subMaxY) { $subMaxY = $y }
        }
    }
}
$subHeight = $subMaxY - $subMinY + 1
Write-Host "Subtext height: $subHeight px (from Y=$subMinY to Y=$subMaxY)"

# Yellow button "SHOP COLLECTION"
$btnMinY = 9999
$btnMaxY = -1
for ($y = 200; $y -le 240; $y++) {
    for ($x = 60; $x -le 200; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 220 -and $c.G -gt 150 -and $c.B -lt 50) {
            if ($y -lt $btnMinY) { $btnMinY = $y }
            if ($y -gt $btnMaxY) { $btnMaxY = $y }
        }
    }
}
$btnHeight = $btnMaxY - $btnMinY + 1
Write-Host "Button height: $btnHeight px (from Y=$btnMinY to Y=$btnMaxY)"

$bmp.Dispose()
