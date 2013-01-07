param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'$projectname$' : 'Scripts/$projectname$-$($package.Version)'
	}" |
	Add-ScalejsExtension '$projectname$' |
	Out-Null