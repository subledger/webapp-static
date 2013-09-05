define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Org = Supermodel.Model.extend({
        url : 'whaterver'
    });

    return Org;
});