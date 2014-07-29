import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.decamelize(attr);
  },

  typeForRoot: function(root) {
    var parts = root.split("_");
    var type = parts.slice(1).join("_");

    type = Ember.String.camelize(type);
    type = Ember.String.singularize(type);

    return type;
  },

  serializeAttribute: function(record, json, key, attribute) {
    if (!Ember.isEmpty(record.get(key))) {
      this._super(record, json, key, attribute);
    }
  },  

  serializeHasMany: function(record, json, relationship) {
    json[relationship.key] = [];

    record.get(relationship.key).forEach(function(item) {
      json[relationship.key].push(this.serialize(item, { includeId: false }));
    }, this);
  }  
});
