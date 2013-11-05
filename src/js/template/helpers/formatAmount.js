define('template/helpers/formatAmount', ['handlebars'], function ( Handlebars ) {
    function formatAmount(account, value) {
      var amount = parseFloat(value.amount).toFixed(2)
      return amount + ""
    }

    Handlebars.registerHelper('formatAmount', formatAmount);
    return formatAmount;
});


