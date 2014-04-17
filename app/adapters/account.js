import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  find: function(store, type, id) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.getSelectedBook().account(id).get(function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));
  },

  findQuery: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var config = this.criteria().limit(query.limit || 25).active();

      if (query.pageId !== undefined) {
        config = config.following().id(query.pageId);
      } else {
        config = config.after().description();
      }

      this.getSelectedBook().account().get(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });

    }, this));
  }
});
