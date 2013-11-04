define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Report_rendering = Supermodel.Model.extend({
        url : 'whaterver',
        default: {
        }
    });

    return Report_rendering;
});
