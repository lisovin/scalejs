param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.linq'	: 'Scripts/scalejs.linq-$($package.Version)',
		'linq'			: 'Scripts/linq'
	}" |
	Add-Shims "{
		'linq'			: {
			exports : 'Enumerable'
		}
	}" |
	Add-ScalejsExtension 'scalejs.linq' |
	Out-Null
