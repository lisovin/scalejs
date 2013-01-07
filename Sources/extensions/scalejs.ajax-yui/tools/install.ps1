param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.ajax-yui' : 'Scripts/scalejs.ajax-yui-$($package.Version)',
		'yui'			   : 'Scripts/yui'
	}" |
	Add-ScalejsExtension 'scalejs.ajax-yui' |
	Out-Null
    


