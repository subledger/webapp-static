import JournalEntriesRoute from "subledger-app/routes/journal-entries";
import notFoundHandler from 'subledger-app/utils/not-found-handler';

export default JournalEntriesRoute.extend({
	model: function() {
		var query = { date: new Date(), limit: 25 };

		return this.store.find('journal-entry', query).then(function(journalEntries) {
			return journalEntries.toArray();
		});
	}
});