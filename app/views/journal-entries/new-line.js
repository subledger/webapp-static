export default Ember.View.extend({
  tagName: 'div',
  classNames: 'line',  
  templateName: 'journal-entries/new-line',

  debitAmount: "",
  creditAmount: "",
  accountId: null,
  accountDescription: null,

  synchInputWithRecordField: function($input, record, field) {
    var self = this;

    var observer = function() {
      $input.val(record.get(field));
    };

    // initially, call the observer function once, and bind it
    observer();
    record.addObserver(field, self, observer);

    // now handle change events on the input field
    $input.on('keydown', function(e) {
      // discard keystrokes that didn't change the actual input value
      if (e.keyCode !== 32 && e.keyCode >= 9 && e.keyCode <= 45) return;

      if (record.hasObserverFor(field)) {
        // remove existing observer
        record.removeObserver(field, self, observer);

        // remove muted class
        $input.removeClass("muted");
      }

    }).on('change', function() {
      // if input content was deleted
      if (Ember.isEmpty($input.val())) {
        // copy back from record
        $input.val(record.get(field));

        // add muted class
        $input.addClass('muted');

        // rebind observer
        record.addObserver(field, self, observer);
      }
    });
  },

  didInsertElement: function() {
    var self = this;

    // mask money fields
    this.$().find(".currency").maskMoney({
      allowNegative: true,
      thousands: ''
    });

    // accounts typeahead
    var accountsDataset = this.get('accountsDataset');

    this.$().find(".account").typeahead({
      hint: true,
      highlight: true,
      minLength: 1

    }, {
      name: 'accountsTypeahead',
      displayKey: 'description',
      source: accountsDataset.ttAdapter()

    }).on("blur", function(e) {
      // clear the account fields if a suggestion was not used
      if (self.get("accountDescription") !== $(this).typeahead('val')) {
        $(this).typeahead('val', '');
        self.set("accountId", null);
        self.set("accountDescription", null);

        self.$(".debit, .credit").removeClass("has-success has-error");
        self.$(".debit input, .credit input").val("").attr("disabled", "disabled");
      }
      
    }).on("typeahead:selected", function(e, suggestion, datasetName) {
      // save selected suggestion
      self.set("accountId", suggestion.id);
      self.set("accountDescription", suggestion.description);
      self.$(".debit input, .credit input").removeAttr("disabled");

      if (suggestion.normalBalance === 'debit') {
        self.$(".debit").removeClass("has-error").addClass("has-success");
        self.$(".credit").removeClass("has-success").addClass("has-error");

        self.$(".debit input").focus();

      } else {
        self.$(".debit").removeClass("has-success").addClass("has-error");
        self.$(".credit").removeClass("has-error").addClass("has-success");

        self.$(".credit input").focus();
      }
    });

    // synch values from journal entry inputs to line inputs
    this.synchInputWithRecordField(this.$(".description"), this.get('journalEntry'), 'description');
    this.synchInputWithRecordField(this.$(".reference"), this.get('journalEntry'), 'reference'); 
  },
});
