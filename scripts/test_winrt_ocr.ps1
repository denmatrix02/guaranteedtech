Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($t, $r) {
    $task = $asTaskGeneric.MakeGenericMethod($r).Invoke($null, @($t))
    $task.Wait(-1) | Out-Null
    return $task.Result
}

[Windows.Storage.StorageFile, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$lang = New-Object Windows.Globalization.Language('en-US')
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)

$crops = Get-ChildItem -Path "c:\Users\DENNIS\Documents\Guaranteed Tech\ui\crops" -Filter *.jpg
foreach ($crop in $crops) {
    Write-Host "========================================="
    Write-Host "FILE: $($crop.Name)"
    Write-Host "========================================="
    try {
        $f = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($crop.FullName)) ([Windows.Storage.StorageFile])
        $stream = Await ($f.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
        $softBmp = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
        $res = Await ($engine.RecognizeAsync($softBmp)) ([Windows.Media.Ocr.OcrResult])
        Write-Host $res.Text
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
        if ($_.Exception.InnerException) {
            Write-Host "Inner: $($_.Exception.InnerException.Message)"
        }
    }
}

