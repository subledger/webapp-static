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
  }
});
