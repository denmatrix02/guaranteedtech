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

function Run-OcrOnFile($filePath) {
    try {
        $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath)) ([Windows.Storage.StorageFile])
        $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
        $softBmp = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
        $ocrResult = Await ($engine.RecognizeAsync($softBmp)) ([Windows.Media.Ocr.OcrResult])
        return $ocrResult.Text
    } catch {
        return "Error running OCR: $_"
    }
}

Write-Output "=== 02 Shop.jpg ==="
Run-OcrOnFile "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\02 Shop.jpg"

Write-Output "`n=== 02_About.jpg ==="
Run-OcrOnFile "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\02_About.jpg"

Write-Output "`n=== 03 Category.jpg ==="
Run-OcrOnFile "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\03 Category.jpg"

Write-Output "`n=== 04_Product-Page.jpg ==="
Run-OcrOnFile "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\04_Product-Page.jpg"
