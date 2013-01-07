param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.mvvm'					: 'Scripts/scalejs.mvvm-$($package.Version)',
		'text'							: 'Scripts/text',
		'knockout'						: 'Scripts/knockout-2.2.0',
		'knockout.mapping'				: 'Scripts/knockout.mapping-latest',
		'knockout-classBindingProvider' : 'Scripts/knockout-classBindingProvider.min'
	}" |
	Add-ScalejsExtension 'scalejs.mvvm' |
	Out-Null
