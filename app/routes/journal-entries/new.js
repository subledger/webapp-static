export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('journal-entry');
  },

  setupController: function(controller, model) {
    controller.set('model', model);

    controller.get("accounts").clear();
    controller.set("loadingAccounts", true);
    controller.set("hasNextAccountsPage", true);
    controller.set("loadingAccountPage", false);

    controller.loadAllAccounts();
  }

});
