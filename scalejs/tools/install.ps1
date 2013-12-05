param($installPath, $toolsPath, $package, $project)

$solutionDir = Split-Path $dte.Solution.Properties.Item("Path").Value

if (-not (Test-Path "$solutionDir\.scalejs")) {
	New-Item -Type Directory "$solutionDir\.scalejs" | Out-Null
}

Copy-Item -Force "$toolsPath\Scalejs.targets" "$solutionDir\.scalejs" | Out-Null
Copy-Item -Force "$toolsPath\Scalejs.psd1" "$solutionDir\.scalejs" | Out-Null
Copy-Item -Force "$toolsPath\Scalejs.psm1" "$solutionDir\.scalejs" | Out-Null

# Add NuGet.targets to solution
if (-not (Test-Path "$solutionDir\.nuget")) {
	New-Item -Type Directory "$solutionDir\.nuget" | Out-Null
}
Copy-Item -Force "$toolsPath\NuGet.targets" "$solutionDir\.nuget" | Out-Null

Import-Module "$solutionDir\.scalejs\Scalejs.psd1"

$project | 
	Add-Import '$(SolutionDir)\.nuget\NuGet.targets' |
	Add-Import '$(SolutionDir)\.scalejs\Scalejs.targets' |
	Add-Paths "{
		'scalejs'		: 'Scripts/scalejs-$($package.Version)',
		'appModule'		: 'Scripts/scalejs.module',
		'sandbox'		: 'Scripts/scalejs.sandbox'
	}" |
	Out-Null