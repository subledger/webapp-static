import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

var App = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'subledger-app',
  Resolver: Resolver
});

loadInitializers(App, 'subledger-app');

Ember.Application.initializer({
  name: "authentication",

  initialize: function(container, application) {
  }
});

export default App;