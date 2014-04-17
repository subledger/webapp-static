import AuthenticatedRoute from "subledger-app/routes/authenticated";

export default AuthenticatedRoute.extend({
  beforeModel: function() {
    this.transitionTo('journal-entries');
  }
});