
/*global define*/
define([
    'underscore',
    'backbone',
    'models/posted_journal_entryline'
], function (_, Backbone, Posted_Journal_entryline) {
    'use strict';


    var Journal_entrylineCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });


    return Journal_entrylineCollection;
});