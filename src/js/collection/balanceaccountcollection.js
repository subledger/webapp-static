/*global define*/
define([
    'underscore',
    'backbone',
    'models/balanceaccount'
], function (_, Backbone,  Balance) {
    'use strict';

    var BalanceAccountCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return BalanceAccountCollection;
});