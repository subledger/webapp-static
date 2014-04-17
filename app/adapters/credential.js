import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  updateRecord: function(store, type, record) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var json = JSON.stringify(record.serialize({ includeId: true }));
      localStorage.setItem("credential_" + record.id, json);

      resolve();
    });
  },

  find: function(store, type, id) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var record = localStorage.getItem("credential_" + id);

      if (record === null) {
        resolve({ active_credential: {
          id: id,
          key: '',
          secret: '',
          org: '',
          book: ''
        }});

      } else {
        resolve({ active_credential: JSON.parse(record) });
      }
    });
  }
});
