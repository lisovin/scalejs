param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.navigation-yui' |
	Remove-ScalejsExtension 'scalejs.navigation-yui'