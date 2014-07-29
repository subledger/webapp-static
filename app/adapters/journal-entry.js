import Ember from 'ember';
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
        Ember.run(null, reject, "Record is invalid");
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

        // set state
        if (result['posted_journal_entry']) {
          result['posted_journal_entry'].state = 'POSTED';

        } else if (result['posting_journal_entry']) {
          result['posting_journal_entry'].state = 'POSTING';
        }

        resolve(result);
      });
    }, this));
  },

  findQuery: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var date = query.date ? query.date.toISOString() : new Date().toISOString();

      var resultKey = null;
      var config = this.criteria().limit(query.limit || 25);
      
      if (query.state === "POSTING") {
        config = config.posting();
        resultKey = "posting_journal_entries";

      } else {
        config = config.posted();
        resultKey = "posted_journal_entries";
      }

      if (query.newer) {
        if (query.pageId) {
          config = config.following().id(query.pageId); 
                   
        } else {
          config = config.ending().effectiveAt(date);          
        }

      } else {
        if (query.pageId) {
          config = config.preceding().id(query.pageId); 
                   
        } else {
          config = config.ending().effectiveAt(date);          
        }
      }


      this.getSelectedBook().journalEntry().get(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        // set state on each element
        for (var i = 0; i < result[resultKey].length; i++) {
          result[resultKey][i].state = query.state;
        }

        resolve(result);
      });
    }, this));
  }
});
