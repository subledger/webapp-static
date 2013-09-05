
/*global define*/
define([
    'underscore',
    'backbone',
    'models/org'
], function (_, Backbone,  Org) {
    'use strict';

    var OrgCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return OrgCollection;
});