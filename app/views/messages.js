export default Ember.View.extend({
	templateName: 'messages',

	messages: Ember.A(),

	Message: Ember.Object.extend({
		init: function() {
			this._super();			
		}
	}),

	notifySuccess: function(title, message, timeout) {
		var msg = this.Message.create({
			state: 'alert-success',
			title: title,
			text: message,
		});

		this.get('messages').addObject(msg);

		if (timeout) {
			Ember.run.later(this, function() {
				this.get('messages').removeObject(msg);
			}, timeout);
		}
	}
});