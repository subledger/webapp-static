import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  createRecord: function(store, type, record) {
    var data = this.serialize(record, { includeId: true });

    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      if (record.isValid()) {
          this.getSelectedBook().journalEntry().createAndPost(data, function(e, result) {
            if (e !== null) {
              Ember.run(null, reject, e);
              return;
            }

            Ember.run(null, resolve, result);
          });

      } else {
        reject(new DS.InvalidError());
      }
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
      var date = query.date;
      var config = this.criteria().limit(query.limit || 25).posted();

      // calculate the query criterias
      if (query.order === "desc") {
        date = date || new Date().toISOString();

        if (query.pageId) {
          config = config.preceding().id(query.pageId); 
                   
        } else {
          config = config.ending().effectiveAt(date);          
        }

      } else {
        date = date || new Date(Date.UTC(1970, 0)).toISOString();

        if (query.pageId) {
          config = config.following().id(query.pageId);

        } else {
          config = config.starting().effectiveAt(date);
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
