import Ember from 'ember';
import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  createRecord: function(store, type, record) {
    var data = this.serialize(record, { includeId: true });

    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      if (record.isValid()) {
          this.getSelectedBook().account().create(data, function(e, result) {
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
      var config = this.criteria().limit(query.limit || 100).active();

      if (!Ember.isEmpty(query.pageId)) {
        config = config.following().id(query.pageId);
      } else {
        config = config.starting().description(query.description);
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
