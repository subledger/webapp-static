import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  // helper to create api queries
  criteria: function() {
    var options = {};

    var criterions = {
      active: function() {
        options["state"] = "active";
        return criterions;
      },

      archived: function() {
        options["state"] = "archived";
        return criterions;
      },

      posting: function() {
        options["state"] = "posting";
        return criterions;
      },

      posted: function() {
        options["state"] = "posted";
        return criterions;
      },

      before: function() {
        options["action"] = "before";
        return criterions;
      },

      ending: function() {
        options["action"] = "ending";
        return criterions;
      },

      starting: function() {
        options["action"] = "starting";
        return criterions;
     },

      after: function() {
        options["action"] = "after";
        return criterions;
      },

      preceding: function() {
        options["action"] = "preceding";
        return criterions;
      },

      following: function() {
        options["action"] = "following";
        return criterions;
      },

      id: function(id) {
        options["id"] = id;
        return criterions;
      },

      effectiveAt: function(date) {
        options["effective_at"] = date || new Date().toISOString();
        return criterions;
      },

      description: function(description) {
        options["description"] = description || "0";
        return criterions;
      },

      limit: function(limit) {
        options["limit"] = limit;
        return criterions;
      },

      at: function(date) {
        options["at"] = date || new Date().toISOString();
        return criterions;
      },

      get: function() {
        return options;
      }
    };

    return criterions;
  },

  getAPIClient: function() {  
    var apiClient = new Subledger();
    var credential = this.get('credential');

    apiClient.setCredentials(
      credential.get('key'),
      credential.get('secret')
    );

    return apiClient;
  },

  getOrganization: function() {
    var apiClient = this.getAPIClient();
    var credential = this.get('credential');

    return apiClient.organization(
      credential.get('org')
    );
  },

  getSelectedBook: function() {
    var org = this.getOrganization();
    var credential = this.get('credential');

    return org.book(credential.get('book'));
  }
});