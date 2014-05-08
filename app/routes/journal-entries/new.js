import AuthenticatedRoute from "subledger-app/routes/authenticated";
import notFoundHandler from 'subledger-app/utils/not-found-handler';

export default AuthenticatedRoute.extend({
  model: function() {
    return this.store.createRecord('journal-entry');
  },

  setupController: function(controller, model) {
    controller.set('model', model);

    controller.get("lines").clear();
    controller.get("accounts").clear();
    controller.set("loadingAccounts", true);
    controller.set("hasNextAccountsPage", true);
    controller.set("loadingAccountPage", false);

    controller.loadAllAccounts();
  }

});
