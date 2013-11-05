define('template/helpers/formatBalance', ['handlebars'], function ( Handlebars ) {
    function formatBalance(account, value) {
      var amount = parseFloat(value.amount).toFixed(2)

      if (account.normal_balance === value.type) {
        return amount + ""
      } else {
        return "(" + amount + ")"
      }
    }

    Handlebars.registerHelper('formatBalance', formatBalance);
    return formatBalance;
});


