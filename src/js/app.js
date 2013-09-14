
//Author : Etienne Dion <dionetienne@gmail.com> September 2013

require.config({

    paths : {
        modernizr             : 'libs/modernizr.custom.19922.min',
        jquery                : 'libs/jquery/jquery',
        underscore            : 'libs/underscore/underscore',
        backbone              : 'libs/backbone/backbone',
        supermodel            : 'libs/supermodel/supermodel',
        async                 : 'libs/async/lib/async',
        subledger             : 'subledger/subledger',
        handlebars            : 'libs/handlebars.js/dist/handlebars',
        i18nprecompile        : 'libs/hbs/hbs/i18nprecompile',
        json2                 : 'libs/hbs/hbs/json2',
        hbs                   : 'libs/hbs/hbs',
        applytemplates        : 'template/apply',
        utils                 : 'utils/utils',
        sync                  : 'sync/sync',
        dataStructure         : 'dataStructure/dataStructure',
        events                : 'events/events',
        forms                 : 'forms/forms',
        selectyze             : 'libs/selectyze/jquery/Selectyze.jquery',
        timepicker            : 'libs/jt.timepicker/jquery.timepicker',
		highcharts            : 'libs/highcharts/js/highcharts',
		highchartsmodule1     : 'libs/highcharts/js/modules/exporting',
        jqueryui              : 'libs/jquery-ui-1.10.3.custom'
    },
    shim : {
        underscore : {
            exports : '_'
        },
        utils:{
            deps    : ['jquery'],
            exports : 'Utils'
        },
        modernizr  :{
            exports : 'Modernizr'
        },
        backbone   : {
            deps    : ['underscore', 'jquery'],
            exports : 'Backbone'
        },
        'dataStructure' : {
            exports :  'DataStructure'
        },
        'handlebars': {
            exports :  'Handlebars'
        },
        'applytemplates' : {
            exports :  'Templates'
        },
        events : {
            exports :  'AppEvents'
        },
        forms : {
            exports :  'Forms'
        },
        'supermodel' : {
            deps: ['backbone'],
            exports :  'Supermodel'
        },
        'highcharts' : {
            exports :  'Supermodel'
        },
        'highchartsmodule1' : {
            exports :  'Supermodel'
        }
    }

});

require([
    'backbone',
    'views/view',
    'sync'

], function (Backbone, AppView) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()

    Backbone.history.start();

    // Initialize the application view
    new AppView();
});

