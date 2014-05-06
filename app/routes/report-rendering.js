import AuthenticatedRoute from "subledger-app/routes/authenticated";

export default AuthenticatedRoute.extend({
  model: function(params) {
    return this.store.find('reportRendering', { id: params.id }).then(function(reportRenderings) {
      return reportRenderings.get('firstObject');
    });
  }
});