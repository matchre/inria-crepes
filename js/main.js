/*global require: false */
require.config({
    paths: {
        jquery: 'vendor/jquery-1.8.3.min',
        paperjs: 'vendor/paper-core.min'
    },
    shim: {
        'paperjs': {
            deps: [],
            exports: 'paper'
        }
    }
});

require(['pancake'],
    function (pancake) {
        'use strict';
        var app = new pancake.PancakeApp();
        app.start("app-canvas");
    });