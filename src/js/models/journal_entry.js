define([
    'backbone',
    'supermodel'
], function (Backbone, Supermodel) {
    'use strict';

    var Journal_entry = Supermodel.Model.extend({
        url : 'whaterver',
        default:{

        }

    });


    return Journal_entry;
});

