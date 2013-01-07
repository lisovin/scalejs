param($installPath, $toolsPath, $package, $project)

$project | 
	Remove-Paths 'scalejs.ajax-yui' |
	Remove-ScalejsExtension 'scalejs.ajax-yui'



