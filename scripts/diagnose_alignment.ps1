Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\rendered_home_alignment.png"
$bmp = New-Object System.Drawing.Bitmap($p)

Write-Host "Screenshot size: $($bmp.Width) x $($bmp.Height)"

# In 1280px viewport:
# Container is max-w-[1240px] px-4 sm:px-6.
# 1280 - 1240 = 40px leftover -> 20px margin on each side.
# Plus sm:px-6 (24px padding on each side).
# So 20px margin + 24px padding = 44px!
# Value Prop 1 is at X = 40! Top Bar is at X = 41!
# That matches the 44px container edge perfectly!
# BUT WHY WAS LOGO AT X = 69?
# Let's inspect rows Y = 40 to 110 (the navbar header area) from X = 20 to 150:

Write-Host "`nScanning Logo area (Y=40 to 110, X=30 to 100):"
for ($y = 40; $y -lt 110; $y += 5) {
    for ($x = 35; $x -lt 100; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            Write-Host "  Found non-white at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
            break
        }
    }
}

# Now let's find the Hero Headline "Premium Computing" (what Y is it located at?)
Write-Host "`nScanning for Hero Headline (Y=100 to 400):"
for ($y = 100; $y -lt 400; $y += 10) {
    for ($x = 35; $x -lt 100; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        # Bold text #222222: R < 80, G < 80, B < 80
        if ($c.R -lt 80 -and $c.G -lt 80 -and $c.B -lt 80) {
            Write-Host "  Found dark text at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
            break
        }
    }
}

$bmp.Dispose()
