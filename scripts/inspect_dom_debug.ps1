$jsScript = @"
const logo = document.querySelector('header img');
const link = document.querySelector('header a');
const row = document.querySelector('header .relative');
const container = document.querySelector('header .max-w-\\[1240px\\]');
const header = document.querySelector('header');
const h1 = document.querySelector('h1');
const topBarText = document.querySelector('.grid-cols-3 > div');

const dump = (el, name) => {
    if (!el) return name + ': null';
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return `${name} -> left: ${rect.left}, paddingLeft: ${style.paddingLeft}, marginLeft: ${style.marginLeft}, width: ${rect.width}`;
};

console.log('--- ELEMENT DUMP ---');
console.log(dump(topBarText, 'TopBarText'));
console.log(dump(header, 'Header'));
console.log(dump(container, 'Container'));
console.log(dump(row, 'Row'));
console.log(dump(link, 'Link'));
console.log(dump(logo, 'LogoImg'));
console.log(dump(h1, 'HeroH1'));
"@

# Write a runner html that embeds an iframe to http://localhost:3000 and prints bounds
$htmlContent = @"
<!DOCTYPE html>
<html>
<body>
<iframe id="f" src="http://localhost:3000" width="1280" height="900"></iframe>
<script>
window.onload = () => {
    setTimeout(() => {
        const doc = document.getElementById('f').contentDocument;
        const logo = doc.querySelector('header img');
        const link = doc.querySelector('header a');
        const row = doc.querySelector('header .relative');
        const container = doc.querySelector('header .max-w-\\[1240px\\]');
        const h1 = doc.querySelector('h1');
        const topBarText = doc.querySelector('.grid-cols-3 > div');

        const dump = (el, name) => {
            if (!el) return name + ': null';
            const rect = el.getBoundingClientRect();
            const style = doc.defaultView.getComputedStyle(el);
            return name + ' -> left: ' + rect.left + ', paddingLeft: ' + style.paddingLeft + ', marginLeft: ' + style.marginLeft + ', width: ' + rect.width;
        };

        console.log('RESULTS_START');
        console.log(dump(topBarText, 'TopBarText'));
        console.log(dump(container, 'Container'));
        console.log(dump(row, 'Row'));
        console.log(dump(link, 'Link'));
        console.log(dump(logo, 'LogoImg'));
        console.log(dump(h1, 'HeroH1'));
        console.log('RESULTS_END');
    }, 1500);
};
</script>
</body>
</html>
"@

Set-Content -Path "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\measure_runner.html" -Value $htmlContent

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) { $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

$args = @(
    "--headless",
    "--disable-gpu",
    "--window-size=1300,1000",
    "--enable-logging",
    "--v=1",
    "C:\Users\DENNIS\.gemini\antigravity\brain\197129bc-6071-4050-b621-79aff7e39734\measure_runner.html"
)

Write-Host "Running edge runner..."
Start-Process -FilePath $edgePath -ArgumentList $args -Wait
