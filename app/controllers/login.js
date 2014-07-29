import Ember from 'ember';

export default Ember.ObjectController.extend({
  key: null,
  secret: null,
  org: null,
  decimalPlaces: 2,

  localCredentials: null,

  error: null,

  actions: {
    setDecimalPlaces: function(newDecimalPlaces) {
      this.set('decimalPlaces', newDecimalPlaces);
    },

    login: function() {
      this.set('error', null);      
      var credential = this.get('model');

      credential.setProperties({
        key: this.get('key'),
        secret: this.get('secret'),
        org: this.get('org'),
        decimalPlaces: this.get('decimalPlaces')
      });

      credential.authenticate(this.store).then(
        $.proxy(function() {
          // update current credential on local storage
          credential.update();

          // add credential to local storage in parallel
          this.store.find('org', this.get('org')).then(
            $.proxy(function(orgObj) {
              // add to list of local credentials
              this.get('localCredentials').addCredential(orgObj, credential);

              // update local credentials on local storage
              this.get('localCredentials').update();
            }, this)
          );

          Ember.run.next(this, function() {
            this.transitionToRoute('journal-entries');
          });        
        }, this),

        $.proxy(function(reason) {
          this.set('error', reason);
        }, this)
      );
    },

    lemonade: function() {
      this.setProperties({
        key: '8bDALFFz8q7uvFNskbW9Kq',
        secret: 'flWncmVODPlEUktLahThhW',
        org: 'Mx88KmjlVja1i4EMXoBjs1',
        decimalPlaces: 2
      });
    },

    useCredential: function(credential) {
      this.setProperties({
        key: credential.get('key'),
        secret: credential.get('secret'),
        org: credential.get('org'),
        decimalPlaces: credential.get('decimalPlaces')
      });
    },

    removeCredential: function(credential) {
      this.get('localCredentials').removeObject(credential);
      this.get('localCredentials').update();
    }
  }
});
