param($installPath, $toolsPath, $package, $project)

Import-Module (Join-Path $toolsPath Scalejs.psd1)

if (!(Test-Path "$(Get-SolutionDir)\.scalejs")) {
	New-Item -Type Directory "$(Get-SolutionDir)\.scalejs" | Out-Null
}
Copy-Item "$toolsPath\Scalejs.targets" "$(Get-SolutionDir)\.scalejs" | Out-Null

# Add NuGet.targets to solution
if (!(Test-Path "$(Get-SolutionDir)\.nuget")) {
	New-Item -Type Directory "$(Get-SolutionDir)\.nuget" | Out-Null
}
Copy-Item "$toolsPath\NuGet.targets" "$(Get-SolutionDir)\.nuget" | Out-Null

$project | 
	Add-Import '$(SolutionDir)\.nuget\NuGet.targets' |
	Add-Import '$(SolutionDir)\.scalejs\Scalejs.targets' |
	Add-Paths "{'scalejs' : 'Scripts/scalejs-$($package.Version)',
	            'es5-shim' : 'Scripts/es5-shim.min'}" |
	Out-Null