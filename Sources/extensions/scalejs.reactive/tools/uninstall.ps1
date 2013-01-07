param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.reactive, rx, rx.binding, rx.time' |
	Remove-ScalejsExtension 'scalejs.reactive'
