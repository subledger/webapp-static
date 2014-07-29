import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('reportRendering', { id: params.id }).then(function(reportRenderings) {
      return reportRenderings.get('firstObject');
    });
  }
});