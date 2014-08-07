import Ember from 'ember';
import LocalCredential from "subledger-app/utils/LocalCredential";

export default Ember.ArrayProxy.extend(Ember.SortableMixin, {
  content: Ember.A(),
  sortProperties: ['lastUsed', 'desc'],
  sortAscending: false,

  init: function() {
    this._super();
  },

  addCredential: function(org, credential) {
    // check if it is lemonade stand demo
    if ("8bDALFFz8q7uvFNskbW9Kq" === credential.get('key') &&
      "flWncmVODPlEUktLahThhW" === credential.get('secret') &&
      "Mx88KmjlVja1i4EMXoBjs1" === credential.get('org')) { return; }

    // check if it already exists
    var localCredential = this.find(function(localCredential) {
      return localCredential.get('key') === credential.get('key') &&
        localCredential.get('secret') === credential.get('secret') &&
        localCredential.get('org') === credential.get('org');
    }, this);

    if (localCredential) {
      // if it does, update fields
      localCredential.setProperties({
        desc: org.get('description'),
        decimalPlaces: credential.get('decimalPlaces'),
        lastUsed: new Date()
      });

    } else {
      // if it doesn't create it
      localCredential = LocalCredential.create({
        desc: org.get('description'),
        key: credential.get('key'),
        secret: credential.get('secret'),
        org: credential.get('org'),
        decimalPlaces: credential.get('decimalPlaces'),
        lastUsed: new Date()
      });

      this.addObject(localCredential);
    }

    return localCredential;
  },

  update: function() {
    if (!localStorage) { return; }

    var parts = [];

    this.every(function(localCredential) {
      parts.push(localCredential.toJSON());
      return true;
    }, this);

    var fullJSON = parts.join("|||");
    localStorage.setItem("credentials_history", fullJSON);
  },

  load: function() {
    if (!localStorage) { return; }

    // clear array first
    this.get('content').clear();

    // load from local storage
    var fullJSON = localStorage.getItem("credentials_history");

    if (fullJSON) {
      $.each(fullJSON.split("|||"), $.proxy(function(i, localCredentialStr) {
        var localCredentialJSON = JSON.parse(localCredentialStr);
        localCredentialJSON.lastUsed = new Date(localCredentialJSON.lastUsed);

        var localCredential = LocalCredential.create(localCredentialJSON);

        this.addObject(localCredential);
      }, this));
    }
  }
});