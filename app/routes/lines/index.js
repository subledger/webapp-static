import AuthenticatedRoute from "subledger-app/routes/authenticated";

export default AuthenticatedRoute.extend({
	setupController: function(controller, model) {
		controller.clear();
	},
});