Add-Type -AssemblyName System.Drawing

$p = "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\.user_uploaded\media_1794718401765_35b6c059.jpg"
$b = New-Object System.Drawing.Bitmap($p)

Write-Host "--- Full Reference Mockup: $($b.Width) x $($b.Height) ---"

# Let's check the left margin across various vertical sections in media_1794718401765_35b6c059.jpg
# Sections:
# Top Bar: y = 0 to 15
# Header: y = 15 to 35
# Hero: y = 35 to 135
# Value Props: y = 145 to 175
# Categories: y = 185 to 255
# Best Selling: y = 265 to 345
# 30% Promo: y = 365 to 480
# 4-Col Matrix: y = 515 to 615
# Reviews: y = 625 to 695
# Latest Posts: y = 705 to 800
# Brands: y = 825 to 845
# Instagram: y = 870 to 930
# Footer: y = 940 to 1020

$sections = @(
    @{ Name = "Top Bar"; MinY = 3; MaxY = 12 },
    @{ Name = "Header (Logo)"; MinY = 16; MaxY = 30 },
    @{ Name = "Hero Text"; MinY = 45; MaxY = 95 },
    @{ Name = "Value Props"; MinY = 148; MaxY = 170 },
    @{ Name = "Categories Title & Grid"; MinY = 190; MaxY = 245 },
    @{ Name = "Best Selling Title & Grid"; MinY = 270; MaxY = 340 },
    @{ Name = "4-Col Matrix"; MinY = 520; MaxY = 600 },
    @{ Name = "Reviews"; MinY = 630; MaxY = 685 },
    @{ Name = "Latest Posts"; MinY = 710; MaxY = 790 },
    @{ Name = "Instagram"; MinY = 875; MaxY = 925 },
    @{ Name = "Footer"; MinY = 945; MaxY = 1000 }
)

foreach ($s in $sections) {
    $minX = 9999
    $maxX = -1
    for ($y = $s.MinY; $y -le $s.MaxY; $y++) {
        for ($x = 0; $x -lt $b.Width; $x++) {
            $c = $b.GetPixel($x, $y)
            # detect elements that are not pure/near-white (R < 235 or G < 235 or B < 235)
            # In Hero, only look at left half (x < 150) so keyboard doesn't skew minX
            if ($s.Name -eq "Hero Text" -and $x -gt 130) { continue }
            if ($c.R -lt 235 -or $c.G -lt 235 -or $c.B -lt 235) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    Write-Host "$($s.Name.PadRight(28)): Left X = $($minX.ToString().PadLeft(4)), Right X = $($maxX.ToString().PadLeft(4))"
}

$b.Dispose()
