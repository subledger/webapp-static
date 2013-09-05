
/*global define*/
define([
    'underscore',
    'backbone',
    'models/book'
], function (_, Backbone, Book) {
    'use strict';

    var BookCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return BookCollection;
});