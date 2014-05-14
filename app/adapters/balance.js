import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  find: function(store, type, id) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.getSelectedBook().account(id).balance(function(e, result) {
        if (e !== null) {
          reject(e);
          return;
        }

        result['current_balance'] = result['balance'];
        result['current_balance'].id = id;
        
        delete(result['balance']);

        resolve(result);
      });
    }, this));
  }
});