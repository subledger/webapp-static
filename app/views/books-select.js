export default Ember.View.extend({
	templateName: "books-select",

	allBooks: function() {
		return window.App.get('credentials').allBooks;

	}.property("books")
});