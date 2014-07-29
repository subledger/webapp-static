import Ember from 'ember';
import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  find: function(store, type, id) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var date = new Date().toISOString();      
      var config = this.criteria().at(date);

      this.getSelectedBook().account(id).balance(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        result['current_balance'] = result['balance'];
        result['current_balance'].id = id;
        result['current_balance'].at = date;
        
        delete(result['balance']);

        resolve(result);
      });
    }, this));
  },

  findQuery: function(store, type, query) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var id = query.account.id;
      var date = query.date ? query.date.toISOString() : new Date().toISOString();      
      var config = this.criteria().at(date);

      this.getSelectedBook().account(id).balance(config.get(), function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        result['current_balance'] = result['balance'];
        result['current_balance'].id = "" + id + "_" + date;
        result['current_balance'].at = date;
        
        delete(result['balance']);

        resolve({ 'current_balances': [ result['current_balance'] ] });
      });
    }, this));
  }
});