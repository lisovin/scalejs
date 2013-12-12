param($installPath, $toolsPath, $package, $project)
$solutionDir = Split-Path $dte.Solution.Properties.Item("Path").Value
$scalejsPS = "$solutionDir\.scalejs\Scalejs.psd1"
if (Test-Path $scalejsPS) {
	Import-Module $scalejsPS
}
