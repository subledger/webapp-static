import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'div',
  classNames: 'report-rendering',

  click: function(e) {
    e.preventDefault();

    // get clicked element
    var $el = $(e.target);

    // find category element
    var $category = $el;
    if (!$el.hasClass("report-rendering-category")) {
      $category = $el.parents(".report-rendering-category").first();
    }

    // toggle icon
    var $icon = $category.find(".glyphicon");
    if ($icon.hasClass("glyphicon-collapse-up")) {
      $icon.removeClass("glyphicon-collapse-up").addClass("glyphicon-collapse-down");
    } else {
      $icon.removeClass("glyphicon-collapse-down").addClass("glyphicon-collapse-up");
    }

    // toggle accounts table visibility
    var $accounts = $category.find("> .accounts");
    $accounts.slideToggle('fast');
  }

});