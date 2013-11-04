
/*global define*/
define([
    'underscore',
    'backbone',
    'models/report'
], function (_, Backbone, Report) {
    'use strict';

    var Report_renderingCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return Report_renderingCollection;
});
