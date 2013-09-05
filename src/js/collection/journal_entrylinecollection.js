
/*global define*/
define([
    'underscore',
    'backbone',
    'models/journal_entryline'
], function (_, Backbone, Journal_entryline) {
    'use strict';


    var Journal_entrylineCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });


    return Journal_entrylineCollection;
});