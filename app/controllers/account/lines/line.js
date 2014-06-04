export default Ember.ObjectController.extend({
  needs: ['account/lines/index'],
  normalBalance: Ember.computed.alias('controllers.account/lines/index.account.normalBalance')
});