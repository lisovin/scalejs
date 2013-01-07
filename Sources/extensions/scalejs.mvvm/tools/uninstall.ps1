param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.mvvm, knockout, knockout.mapping, knockout-classBindingProvider' |
	Remove-ScalejsExtension 'scalejs.mvvm' |
	Out-Null
