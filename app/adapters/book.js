import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findAll: function(store, type, id) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var config = this.criteria().after().description();

      this.getOrganization().book().get(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));
  }
});
