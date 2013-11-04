
/*global define*/
define([
    'underscore',
    'backbone',
    'models/report'
], function (_, Backbone, Report) {
    'use strict';

    var ReportCollection = Backbone.Collection.extend({
        url : 'whaterver'

    });

    return ReportCollection;
});
