param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.navigation-yui' : 'Scripts/scalejs.navigation-yui-$($package.Version)',
		'yui'					 : 'Scripts/yui'
	}" |
	Add-ScalejsExtension 'scalejs.navigation-yui' |
	Out-Null