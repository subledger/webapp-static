define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Book = Supermodel.Model.extend({
        url : 'whaterver'
    });

    return Book;
});