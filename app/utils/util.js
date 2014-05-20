export default {
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

  formatValue: function(value, onlyForType) {
    if (value === undefined || value.type !== onlyForType) {
      return "";
    }

    return accounting.formatMoney(value.amount, "");
  },

  formatAmount: function(amount) {
    return accounting.formatMoney(amount, "");
  },

  formatBalance: function(balance, normalBalance) {
    if (balance === undefined || (balance.get && !balance.get('value')) && !balance.value) {
      return "";
    }

    var value = balance.get ? balance.get('value') : balance.value;

    if (value.type === 'zero' || value.type === normalBalance) {
      return new Ember.Handlebars.SafeString(accounting.formatMoney(value.amount, "") + "&nbsp;");
    } else {
      return "(" + accounting.formatMoney(value.amount, "") + ")";
    }
  }
};