
/*global define*/
define([
    'underscore',
    'backbone',
    'models/account'
], function (_, Backbone,  Account) {
    'use strict';

    var AccountCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return AccountCollection;
});