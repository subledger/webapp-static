define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var BalanceAccount = Supermodel.Model.extend({
        url : 'whaterver'
    });

    return BalanceAccount;
});