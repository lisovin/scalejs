# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
	collections:
        pages: ->
            @getCollection("html").findAllLive({isPage:true}).on "add", (model) ->
                model.setMetaDefaults({layout:"default", styles:[]})
}

# Export the DocPad Configuration
module.exports = docpadConfig