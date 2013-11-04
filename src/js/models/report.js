define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Report = Supermodel.Model.extend({
        url : 'whaterver'
    });

    return Report;
});
