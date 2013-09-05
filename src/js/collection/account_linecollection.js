
/*global define*/
define([
    'underscore',
    'backbone',
    'models/account_line'
], function (_, Backbone, Account_line) {
    'use strict';


    var Account_lineCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });


    return Account_lineCollection;
});