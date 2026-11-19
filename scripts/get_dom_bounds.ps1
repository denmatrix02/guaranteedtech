$js = @"
const res = {};
const logo = document.querySelector('header img');
if (logo) res.logo = logo.getBoundingClientRect();
const topBarCol1 = document.querySelector('.grid-cols-3 > div:first-child');
if (topBarCol1) res.topBar = topBarCol1.getBoundingClientRect();
const heroH1 = document.querySelector('h1');
if (heroH1) res.heroH1 = heroH1.getBoundingClientRect();
const valProp1 = document.querySelector('section:nth-of-type(2) .grid > div:first-child');
if (valProp1) res.valProp1 = valProp1.getBoundingClientRect();
console.log(JSON.stringify(res, null, 2));
"@

# We can run edge headless with a data URI or small runner
$script = "
var res = {
  topBarContainer: document.querySelector('.grid-cols-3').getBoundingClientRect(),
  headerContainer: document.querySelector('header .max-w-\\[1240px\\] > div').getBoundingClientRect(),
  logo: document.querySelector('header a').getBoundingClientRect(),
  logoImg: document.querySelector('header img').getBoundingClientRect(),
  heroContainer: document.querySelector('section:first-of-type .max-w-\\[1240px\\]').getBoundingClientRect(),
  heroH1: document.querySelector('h1').getBoundingClientRect(),
  valuePropsContainer: document.querySelector('section:nth-of-type(2) .max-w-\\[1240px\\]').getBoundingClientRect(),
  valueProp1: document.querySelector('section:nth-of-type(2) .grid > div:first-child').getBoundingClientRect()
};
console.log('DOM_BOUNDS:' + JSON.stringify(res));
"
$encoded = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($script))

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) { $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

$args = @(
    "--headless",
    "--disable-gpu",
    "--window-size=1280,1000",
    "--dump-dom",
    "http://localhost:3000"
)

Write-Host "Checking DOM via msedge..."
$out = & $edgePath @args
Write-Host "DOM length: $($out.Length)"
