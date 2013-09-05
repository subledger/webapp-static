define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Identity = Supermodel.Model.extend({
        url : 'whaterver'
    });

    return Identity;
});