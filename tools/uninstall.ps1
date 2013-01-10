param($installPath, $toolsPath, $package, $project)

$project | 
	Remove-Import '$(SolutionDir)\.scalejs\Scalejs.targets' |
	Remove-Paths 'scalejs'

if (Test-Path "$(Get-SolutionDir)\.scalejs") {
	Remove-Item -Path "$(Get-SolutionDir)\.scalejs" -Force -Recurse
}

Remove-Module -Name Scalejs