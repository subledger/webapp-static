import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findAll: function(store, type, id) {
    var config = this.criteria().after().description();
    var org = this.getOrganization();

    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      org.book().get(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
        }

        resolve(result);
      });      
    }));
  }
});
