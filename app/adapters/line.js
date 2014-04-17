import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findQuery: function(store, type, query) {
    if (query.journalEntry !== undefined) {
      return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
        var config = this.criteria().limit(query.limit || 25).posted();

        if (query.pageId === undefined) {
          config = config.after();

        } else {
          config = config.following().id(query.pageId);
        }

        var apiLine = this.getSelectedBook().journalEntry(query.journalEntry.id).line();

        apiLine.get(config.get(), function(e, result) {
          if (e !== null) {
            reject(e);
            return;
          }

          resolve(result);
        });
      }, this));

    } else if (query.account !== undefined) {
      return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
        var config = this.criteria().limit(query.limit || 25);

        if (query.pageId === undefined) {
          config = config.before().effectiveAt();

        } else {
          config = config.preceding().id(query.pageId);
        }

        var apiLine = this.getSelectedBook().account(query.account.id).line();

        apiLine.get(config.get(), function(e, result) {
          if (e !== null) {
            reject(e);
            return;
          }

          resolve(result);
        });
      }, this));
    }
  },
});
