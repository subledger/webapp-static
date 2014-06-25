var Util = {
  timeAgo: function(date) {
    return moment(date).fromNow();
  },

  formatDate: function(date, size, compact) {
    var formatString = 'LLLL';

    if (size === 'small') {
      formatString = 'L';

    } else if (size === 'medium') {
      formatString = 'LL';

    } else if (size === 'big') {
      formatString = 'LLL';

    } else {
      formatString = 'LLLL';
    }

    if (compact === true) {
      formatString = formatString.toLowerCase();
    }

    return moment(date).format(formatString);
  },

  formatDecimal: function(value, decimalPlaces) {
    var number = new BigNumber(value);

    var integerStr = accounting.formatMoney(number.floor().toString(), "", 0);

    if (decimalPlaces > 0) {
      var decimalStr = number.toFixed(decimalPlaces).split(".")[1];

      return integerStr + "." + decimalStr;

    } else {
      return integerStr;
    }
  },

  formatValue: function(value, onlyForType) {
    if (value === undefined || value.type !== onlyForType) {
      return "";
    }

    var decimalPlaces = this.get('credential').get('decimalPlaces');
    return Util.formatDecimal(value.amount, decimalPlaces);
  },

  formatAmount: function(amount) {
    var decimalPlaces = this.get('credential').get('decimalPlaces');
    return Util.formatDecimal(amount, decimalPlaces);
  },

  formatBalance: function(balance, normalBalance) {
    if (balance === undefined || (balance.get && !balance.get('value')) && !balance.value) {
      return "";
    }

    var value = balance.get ? balance.get('value') : balance.value;
    var decimalPlaces = this.get('credential').get('decimalPlaces');

    if (value.type === 'zero' || value.type === normalBalance) {
      return new Ember.Handlebars.SafeString(Util.formatDecimal(value.amount, decimalPlaces) + "&nbsp;");

    } else {
      return "(" + Util.formatDecimal(value.amount, decimalPlaces) + ")";
    }
  }
};

export default Util;