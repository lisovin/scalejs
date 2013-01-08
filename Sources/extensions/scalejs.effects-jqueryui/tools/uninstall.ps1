param($installPath, $toolsPath, $package, $project)

$project | 
	Remove-Paths 'scalejs.effects-jqueryui, jQuery-ui-effects' | 
	Remove-Shims 'jQuery-ui-effects' | 
	Remove-ScalejsExtension 'scalejs.effects-jqueryui'