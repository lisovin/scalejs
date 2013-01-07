param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.linq, linq' |
	Remove-Shims 'linq' |
	Remove-ScalejsExtension 'scalejs.linq'