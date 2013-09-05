
/*global define*/
define([
    'underscore',
    'backbone',
    'models/journal_entry'
], function (_, Backbone, Journal_entry) {
    'use strict';


    var Journal_entryCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });


    return Journal_entryCollection;
});