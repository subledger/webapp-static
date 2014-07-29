import Credential from 'subledger-app/utils/Credential';

export default {
  name: "credential",

  initialize: function(container) {
    container.register('credential:current', Credential, { singleton: true });

    container.typeInjection('route', 'credential', 'credential:current');
    container.typeInjection('controller', 'credential', 'credential:current');
    container.typeInjection('view', 'credential', 'credential:current');    
    container.typeInjection('adapter', 'credential', 'credential:current');
  }
};