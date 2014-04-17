import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  createRecord: function(store, type, record) {
    var data = this.serialize(record, { includeId: true });

    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.getSelectedBook().journalEntry().createAndPost(data, function(e, result) {
        if (e !== null) {
          Ember.run(null, reject, e);
          return;
        }

        Ember.run(null, resolve, result);
      });
    }, this));
  },

  find: function(store, type, id) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.getSelectedBook().journalEntry(id).get(function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));
  },

  // possilble parameters are order, date, nextPageId, perPage
  findQuery: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var config = this.criteria().limit(query.limit || 25).posted();

      // calculate the query criterias
      if (query.order === "desc") {
        if (query.date !== undefined) {
          config = config.ending().effectiveAt();

        } else if (query.pageId !== undefined) {
          config = config.preceding().id(query.pageId);

        } else {
          config = config.ending().effectiveAt();
        }

      } else {
        var date = query.date || new Date(Date.UTC(1970, 0));
        if (query.date !== undefined) {
          config = config.starting().effectiveAt(date);

        } else if (query.pageId !== undefined) {
          config = config.following().id(query.pageId);

        } else {
          config = config.ending().effectiveAt(date);
        }
      }

      this.getSelectedBook().journalEntry().get(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));
  }
});
