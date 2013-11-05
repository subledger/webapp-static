define('template/helpers/formatAmount', ['handlebars'], function ( Handlebars ) {
    function formatAmount(account, value) {
      var amount = parseFloat(value.amount).toFixed(2)

      if (account.normal_balance === value.type) {
        return amount + ""
      } else {
        return "(" + amount + ")"
      }
    }

    Handlebars.registerHelper('formatAmount', formatAmount);
    return formatAmount;
});


