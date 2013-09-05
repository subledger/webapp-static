
/*global define*/
define([
    'underscore',
    'backbone',
    'models/identity'
], function (_, Backbone,  Org) {
    'use strict';

    var IdentityCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return IdentityCollection;
});