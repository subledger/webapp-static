import JournalEntriesRoute from "subledger-app/routes/journal-entries";
import notFoundHandler from 'subledger-app/utils/not-found-handler';

export default JournalEntriesRoute.extend({
  setupController: function(controller, model) {
    if (controller.get('content').length === 0) {
      controller.loadPage();
    }
  },
});