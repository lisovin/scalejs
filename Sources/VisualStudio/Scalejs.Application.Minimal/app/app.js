/*global define*/
define([
    'scalejs!application',
    'app/main/main'
], function (
    application,
    main
) {
    'use strict';

    application.registerModule(main);

    application.run();
});

