import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  find: function(store, type, id) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.getAPIClient().organization(id).get(function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));
  }
});
