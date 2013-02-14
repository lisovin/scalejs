/*global require,define,describe,expect,it*/
/// <reference path="../Scripts/jasmine.js"/>
define(['scalejs!core'], function (core) {
    'use strict';

    var state = core.state;

    describe('core.state', function () {
        it('`state` is defined.', function () {
            expect(state).toBeDefined();
        });

        it('microwave example', function () {
            var door, oven, microwave;

            door = {
                id: 'door',
                initial: 'closed',
                states: [{
                    id: 'closed',
                    transitions: [{
                        target: 'open',
                        event: 'door.open'
                    }]
                }, {
                    id: 'open',
                    transitions: [{
                        target: 'closed',
                        event: 'door.close'
                    }]
                }]
            };

            oven = {
                id: 'oven',
                initial: 'off',
                states: [{
                    id: 'off',
                    transitions: [{
                        target: 'on',
                        event: 'turn.on'
                    }]
                }, {
                    id: 'on',
                    initial: 'idle',
                    onEntry: function () {
                    },
                    transitions: [{
                        target: 'off',
                        event: 'turn.off'
                    }, {
                        target: 'off',
                        condition: function (context) {
                            return context.get('timer') >= context.get('cookTime');
                        }
                    }],
                    states: [{
                        id: 'idle',
                        transitions: [{
                            target: 'cooking',
                            condition: function (context)  {
                                return this.in('closed');
                            }
                        }]
                    }, {
                        id: 'cooking',
                        transitions: [{
                            target: 'idle',
                            condition: function (context) {
                                return !this.in('closed');
                            }
                        }, {
                            target: 'cooking',
                            event: 'time',
                            action: function (context) {
                                context.set('timer', context.get('timer') + 1);
                            }
                        }]
                    }]
                }]
            };

            microwave = {
                id: 'microwave',
                parallel: true,
                states: [oven, door]
            };
        });
    });
});