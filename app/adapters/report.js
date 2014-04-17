import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findQuery: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var config = this.criteria().limit(query.limit || 25).active();

      if (query.nextPageId === undefined) {
        config = config.after().description();

      } else {
        config = config.following().id(query.nextPageId);
      }

      this.getSelectedBook().report().get(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));
  }
});
