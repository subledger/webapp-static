import AuthenticatedRoute from "subledger-app/routes/authenticated";
import notFoundHandler from 'subledger-app/utils/not-found-handler';

export default AuthenticatedRoute.extend({
  model: function(params) {
    return this.store.find('account', params.account_id);
  }
});