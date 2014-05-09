export default DS.RESTSerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.decamelize(attr);
  },

  typeForRoot: function(root) {
    var parts = root.split("_");
    var state = parts[0];
    var type = parts.slice(1).join("_");

    type = Ember.String.camelize(type);
    type = Ember.String.singularize(type);

    return type;
  },

  serializeHasMany: function(record, json, relationship) {
    json[relationship.key] = [];

    record.get(relationship.key).forEach(function(item, index, enumerable) {
      json[relationship.key].push(this.serialize(item, { includeId: false }));
    }, this);
  }  
});
