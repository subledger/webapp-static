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

  formatBalance: function(value, normalBalance) {
    if (value === undefined) {
      return "";
    }

    if (value.type === normalBalance) {
      return accounting.formatMoney(value.amount, "");
    } else {
      return "(" + accounting.formatMoney(value.amount, "") + ")";
    }
  }
};