import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findQuery: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var config = this.criteria().limit(query.limit || 25).active();

      if (!Ember.isEmpty(query.pageId)) {
        config = config.following().id(query.pageId);
      } else {
        config = config.starting().description(query.description);
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
