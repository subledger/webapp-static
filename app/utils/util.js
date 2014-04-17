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

    var amount = parseFloat(value.amount).toFixed(2);
    return amount + "";
  },

  formatAmount: function(amount) {
    amount = parseFloat(amount).toFixed(2);
    return amount + "";
  },

  formatBalance: function(value, normalBalance) {
    if (value === undefined) {
      return "";
    }

    var amount = parseFloat(value.amount).toFixed(2);

    if (normalBalance === value.type) {
      return amount + "";

    } else {
      return "(" + amount + ")";
    }
  }
};