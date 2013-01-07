param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths '$projectname$' $project.Name |
	Remove-ScalejsExtension '$projectname$' |
	Out-Null
