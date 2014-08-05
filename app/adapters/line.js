import Ember from 'ember';
import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findQuery: function(store, type, query) {
    if (query.journalEntry !== undefined) {
      return this.findQueryByJournalEntry(store, type, query);

    } else if (query.account !== undefined) {
      if (query.operation === 'first_and_last_line') {
        return this.findQueryFirstAndLastLineByAccount(store, type, query);   

      } else {
        return this.findQueryByAccount(store, type, query);  
      }      
    }
  },

  findQueryByJournalEntry: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var config = this.criteria().limit(query.limit || 100).posted();

      if (query.pageId) {
        config = config.following().id(query.pageId);

      } else {
        config = config.after();
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
  },

  findQueryByAccount: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var date = query.date ? query.date.toISOString() : new Date().toISOString() ;
      var config = this.criteria().limit(query.limit || 100);

      if (query.newer) {
        if (query.pageId) {
          config = config.following().id(query.pageId);

        } else {
          config.ending().effectiveAt(date);
        }

      } else {
        if (query.pageId) {
          config = config.preceding().id(query.pageId);

        } else {
          config = config.ending().effectiveAt(date);
        }
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
  },

  findQueryFirstAndLastLineByAccount: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.getSelectedBook().account(query.account.id).firstAndLastLine( function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        resolve(result);
      });
    }, this));    
  }

});
