Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Globalization.Language, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$lang = New-Object Windows.Globalization.Language("en-US")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
Write-Host "Max dimension: $($engine.MaxImageDimension)"

# Function to crop an image into vertical chunks <= 2000px height and OCR them
function OCR-Image($imagePath) {
    Write-Host "`n========================================================"
    Write-Host "ANALYZING: $(Split-Path $imagePath -Leaf)"
    Write-Host "========================================================"
    $bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
    $w = $bmp.Width
    $h = $bmp.Height
    $targetW = [Math]::Min($w, 1920)
    $scale = $targetW / $w
    $targetH = [int]($h * $scale)
    
    # Rescale if needed
    $resized = New-Object System.Drawing.Bitmap $targetW, $targetH
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bmp, 0, 0, $targetW, $targetH)
    $g.Dispose()
    $bmp.Dispose()
    
    $chunkH = 1500
    $numChunks = [Math]::Ceiling($targetH / $chunkH)
    $tempDir = Join-Path $PSScriptRoot "temp_ocr"
    if (!(Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir | Out-Null }
    
    for ($i = 0; $i -lt $numChunks; $i++) {
        $y = $i * $chunkH
        $actualH = [Math]::Min($chunkH, $targetH - $y)
        $rect = New-Object System.Drawing.Rectangle 0, $y, $targetW, $actualH
        $chunk = $resized.Clone($rect, $resized.PixelFormat)
        $chunkFile = Join-Path $tempDir "chunk_${i}.png"
        $chunk.Save($chunkFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $chunk.Dispose()
        
        # OCR chunk
        $storageFile = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($chunkFile)) ([Windows.Storage.StorageFile])
        $stream = Await ($storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
        $softBmp = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
        $ocrResult = Await ($engine.RecognizeAsync($softBmp)) ([Windows.Media.Ocr.OcrResult])
        
        Write-Host "--- CHUNK $i (Y: $y to $($y + $actualH)) ---"
        Write-Host $ocrResult.Text
        
        Remove-Item $chunkFile -Force
    }
    $resized.Dispose()
}

$images = @(
    "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\01 Home.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\02 Shop.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\02_About.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\03 Category.jpg",
    "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\04_Product-Page.jpg"
)

foreach ($img in $images) {
    OCR-Image $img
}

