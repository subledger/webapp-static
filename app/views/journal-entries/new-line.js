export default Ember.View.extend({
  tagName: 'div',
  classNames: 'line',

  templateName: 'journal-entries/new-line',

  isZeroLine: false,
  isRemoving: false,
  isDescriptionSynch: true,
  isReferenceSynch: true,
  isDebitNormalBalance: true,
  accountDescription: null,

  zeroToogleButtonText: function() {
    return this.get("isZeroLine") ? "Debit / Credit" : "Zero";
  }.property('isZeroLine'),

  debitClasses: function() {
    var classes = ['form-group', 'currency-container'];

    if (!this.get('noAccountSelected')) {
      if (this.get('isDebitNormalBalance')) {
        classes.push('match');
      } else {
        classes.push('no-match');
      }
    }

    if (this.get('isZeroLine')) {
      classes.push('hidden');
    }

    if (this.get('model').get('errors').get('value')) {
      classes.push('has-error');
    }

    return classes.join(" ");

  }.property(
    'model.errors.@each.description', 
    'isDebitNormalBalance',
    'isZeroLine',
    'noAccountSelected'
  ),

  creditClasses: function() {
    var classes = ['form-group', 'currency-container'];

    if (!this.get('noAccountSelected')) {
      if (this.get('isDebitNormalBalance')) {
        classes.push('no-match');
      } else {
        classes.push('match');
      }
    }

    if (this.get('isZeroLine')) {
      classes.push('hidden');
    }

    if (this.get('model').get('errors').get('value')) {
      classes.push('has-error');
    }

    return classes.join(" ");
    
  }.property(
    'model.errors.@each.description', 
    'isDebitNormalBalance',
    'isZeroLine',
    'noAccountSelected'
  ),  

  journalEntryDescriptionChanged: function() {
    if (this.get('isDescriptionSynch')) {
      this.get('model').set('description', this.get('journalEntry').get('description'));
    }
  }.observes('journalEntry.description'),

  journalEntryReferenceChanged: function() {
    if (this.get('isReferenceSynch')) {
      this.get('model').set('reference', this.get('journalEntry').get('reference'));
    }
  }.observes('journalEntry.reference'),

  descriptionTabindex: function() {
    return this.get('isDescriptionSynch') ? "-1" : this.get('tabIndex');
  }.property('isDescriptionSynch'),

  descriptionClasses: function() {
    var classes = ['form-control', 'description'];

    if (this.get('isDescriptionSynch')) {
      classes.push('synch');
    }

    return classes.join(" ");
  }.property('isDescriptionSynch'),

  referenceTabindex: function() {
    return this.get('isReferenceSynch') ? "-1" : this.get('tabIndex');
  }.property('isReferenceSynch'),

  referenceClasses: function() {
    var classes = ['form-control', 'reference'];

    if (this.get('isReferenceSynch')) {
      classes.push('synch');
    }

    return classes.join(" ");
  }.property('isReferenceSynch'),  

  noAccountSelected: function() {
    return Ember.isEmpty(this.get('model').get('account'));
  }.property('model.account'),

  isLastLine: function() {
    return this.get('parentView').get('lastObject') === this;
  }.property('parentView.@each'),

  debitAmount: function(key, value, previousValue) {
    if (arguments.length > 1) {
      this.get('model').set('debitAmount', value);
    }

    return this.get('model').get('debitAmount');
  }.property('model.debitAmount'),

  creditAmount: function(key, value, previousValue) {
    if (arguments.length > 1) {
      this.get('model').set('creditAmount', value);
    }

    return this.get('model').get('creditAmount');
  }.property('model.creditAmount'),

  addNewLineObserver: function() {
    if (Ember.isEmpty(this.get('model').get('account'))) return;

    var parentView = this.get('parentView');

    if (parentView.get('lastObject') === this) {
      // add new line
      this.get('parentView').get('parentView').addLine();
    }   

  }.observes('model.account'),

  synchInputWithRecordField: function($input, record, field) {
    var self = this;

    self.get('model').set(field, record.get(field));

    // now handle change events on the input field
    $input.on('keydown', function(e) {
      // discard keystrokes that didn't change the actual input value
      if (e.keyCode !== 32 && e.keyCode >= 9 && e.keyCode <= 45) return;
      self.set('is' + Ember.String.capitalize(field) + 'Synch', false);

    }).on('change', function() {
      // if input content was deleted
      if (Ember.isEmpty($input.val())) {
        // copy back from record
        self.get('model').set(field, record.get(field));

        // set view as synched
        self.set('is' + Ember.String.capitalize(field) + 'Synch', true);
      }
    });
  },

  accountSelected: function(accountId, description, normalBalance) {
    // save selected suggestion
    this.get("model").set("account", accountId);
    this.set("accountDescription", description);
    this.set("isDebitNormalBalance", normalBalance === 'debit');

    // mask currency fields
    this.$("input.currency").maskMoney({
      allowNegative: false
    }); 
  },

  actions: {
    removeLine: function() {
      this.set('isRemoving', true);
    },

    confirmRemoveLine: function() {
      this.get('parentView').get('parentView').removeLine(this);
    },

    cancelRemoveLine: function() {
      this.set('isRemoving', false);      
    },

    toogleZeroLine: function() {
      this.get('parentView').get('parentView').get('controller').send('toogleZeroLine', this.get('model'));
      this.set('isZeroLine', !this.get('isZeroLine'));
    }
  },

  didInsertElement: function() {
    // accounts typeahead engine
    var accountsDataset = this.get('accountsDataset');

    // typeahead element reference
    var $typeAhead = this.$(".line-account");    

    // configure accounts typeahdead
    $typeAhead.typeahead({
      hint: true,
      highlight: true,
      minLength: 1

    }, {
      name: 'accountsTypeahead',
      displayKey: 'description',
      source: accountsDataset.ttAdapter()

    }).on("blur", $.proxy(function(e) {
      // clear the fields if no suggestion was found
      if (this.get("accountDescription") !== $typeAhead.typeahead('val')) {

        $typeAhead.typeahead('val', '');
        this.get("model").set("account", null);
        this.set("accountDescription", null);
        this.set("isDebitNormalBalance", true);

        this.$("input.currency").val("");
      }
      
    }, this)).on("typeahead:selected", $.proxy(function(e, suggestion, datasetName) {
      this.accountSelected(suggestion.id, suggestion.description, suggestion.normalBalance);

    }, this)).on("typeahead:autocompleted", $.proxy(function(e, suggestion, datasetName) {
      this.accountSelected(suggestion.id, suggestion.description, suggestion.normalBalance);

    }, this));

    // synch values from journal entry inputs to line inputs
    this.synchInputWithRecordField(this.$(".description"), this.get('journalEntry'), 'description');
    this.synchInputWithRecordField(this.$(".reference"), this.get('journalEntry'), 'reference'); 
  },
});
