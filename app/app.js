import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import Credential from "subledger-app/utils/Credential";

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
  name: "credential",

  initialize: function(container, application) {
    container.register('credential:current', Credential, { singleton: true });

    container.typeInjection('controller', 'credential', 'credential:current');
    container.typeInjection('route', 'credential', 'credential:current');
    container.typeInjection('adapter', 'credential', 'credential:current');
  }
});

export default App;