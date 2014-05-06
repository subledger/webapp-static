import ApplicationAdapter from "subledger-app/adapters/application";

export default ApplicationAdapter.extend({
  findQuery: function(store, type, query) {
    // first, create the report rendering
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      var id = query.id; // report rendering id
      var reportId = query.reportId;

      if (id) {
        // if a report rendering id is present, then the rendering was already
        // requested
        this.getSelectedBook().report_rendering(id).get(function(e, result) {
          if (e !== null) {
            reject(e);
            return;
          }

          // findQuery must return an array
          result = {
            building_report_rendering: [
              result.building_report_rendering || result.completed_report_rendering
            ]
          };

          resolve(result);
        });

      } else {
        // need to request the report rendering
        var config = this.criteria().at(query.at.toISOString());

        this.getSelectedBook().report(reportId).render(config.get(), function(e, result) {
          if (e !== null) {
            reject(e);
            return;
          }

          // findQuery must return an array
          result = {
            building_report_rendering: [
              result.building_report_rendering
            ]
          };

          resolve(result);
        });

      }
    }, this));
  }
});
