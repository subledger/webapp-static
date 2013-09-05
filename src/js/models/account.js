define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Acccount = Supermodel.Model.extend({
        url : 'whaterver'
    });

    return Acccount;
});