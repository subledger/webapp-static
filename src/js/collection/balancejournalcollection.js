/*global define*/
define([
    'underscore',
    'backbone',
    'models/balancejournal'
], function (_, Backbone,  Balance) {
    'use strict';

    var BalanceJournalCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return BalanceJournalCollection;
});