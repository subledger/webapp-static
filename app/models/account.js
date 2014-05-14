export default DS.Model.extend({
  book:          DS.attr(),
  state:         DS.attr('string'),
  description:   DS.attr('string'),
  reference:     DS.attr('string'),
  normalBalance: DS.attr('string'),
  version:       DS.attr('number'),
  balance:       DS.attr(),

  loadLines: function(query) {
    var self = this;

    // prepare query
    query = query || {};
    $.extend(query, { account: self });

    return self.store.find('line', query);
  },
});