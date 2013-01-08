/*global define*/
define([
    'scalejs!application',
    'app/main/mainModule'
], function (
    application,
    main
) {
    'use strict';

    application.registerModule(main);

    application.run();
});

