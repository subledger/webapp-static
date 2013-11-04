define([
    'jquery',
    'backbone',
    'utils',
    'models/book',
    'models/account',
    'models/journal_entry',
    'models/balanceaccount',
    'models/balancejournal',
    'models/journal_entryline',
    'models/account_line',
    'models/posted_journal_entryline',
    'models/report',
    'models/report_rendering'
], function ($, Backbone, Utils, Book, Account, Journal_entry, BalanceAccount, BalanceJournal, Journal_entryline, Account_line, Posted_Journal_entryline, Report, ReportRendering) {


    Backbone.sync = function(method, model, options) {

        function cb(error, data){

            //console.log("sync callback", method, error, data, options.type);
            if(error === null){
                //console.log("1", method);

                if(data !== null && data !== undefined){

                    switch (method) {
                        case 'create':
                        case 'read':
                        case 'update':
                            //console.log("2", options.type);
                            switch (options.type) {
                                case 'book':

                                    $.each(Utils.parse(data), function(index, current){
                                        Book.create(current);
                                    });
                                    break;

                                case 'account':

                                    $.each(Utils.parse(data), function(index, current){
                                        Account.create(current);
                                    });
                                    break;
                                case 'oneaccount':

                                    Account.create(data);
                                    break;

                                case 'accountbalance':
                                    data.account = options.account_id;
                                    BalanceAccount.create(Utils.parse(data));
                                    break;

                                case 'accountline':

                                    $.each(Utils.parse(data), function(index, current){
                                        Account_line.create(current);
                                    });
                                    break;
                                case 'moreaccountline':

                                    $.each(Utils.parse(data), function(index, current){
                                        Account_line.create(current);
                                    });
                                    break;
                                case 'newaccountline':

                                    $.each(Utils.parse(data), function(index, current){
                                        Account_line.create(current);
                                    });
                                    break;
                                case 'journalentry':

                                    $.each(Utils.parse(data), function(index, current){
                                        Journal_entry.create(current);
                                    });
                                    break;
                                case 'onejournalentry':

                                    Journal_entry.create(Utils.parse(data));
                                    break;
                                case 'journalbalance':
                                    data.journal = options.journal_id;
                                    BalanceJournal.create(Utils.parse(data));
                                    break;

                                case 'entryline':

                                    $.each(Utils.parse(data), function(index, current){
                                        Journal_entryline.create(current);
                                    });
                                    break;
                                case 'postedentryline':
                                   // console.log("postedentryline", data);
                                    $.each(Utils.parse(data), function(index, current){
                                        Posted_Journal_entryline.create(current);
                                    });

                                case 'report':
                                    switch(options.action) {
                                      case 'render':
                                        ReportRendering.create(Utils.parse(data));
                                        break;

                                      default:
                                        $.each(Utils.parse(data), function(index, current){
                                          Report.create(current);
                                        });
                                        break;
                                    }
                                case 'reportrendering':
                                    ReportRendering.create(Utils.parse(data));
                                    break;
                              }
                            break;

                    }
                }
               // console.log("success", error, data);
                options.success(data);
            } else {
               // console.log("error", error, data);
                options.error(error);
            }

            model.trigger('sync', method, model, data, options);


        }
        var state = "active";
        if(options.state !== undefined){
            state = options.state;
        }
        var params = {limit: 5, action:"preceding", id: options.last_id, state: state};
        //console.log("sync",method, options.type, model, Utils.parse(model),  options );
        if(options.last_id === null || options.last_id === undefined){
            if(options.first_id === null || options.first_id === undefined){
                params = {limit: 5, action:"before", state: state};
            } else {
                params = {limit: 100, action:"following", state: state, id: options.first_id};
            }

        } else if(options.last_id === "all"){
            params = {limit: 100, action:"before", state: state};
        }

        if(options.type === "moreaccountline"){
            params = {limit: 25, action:"preceding", id: options.following};
        }
        if(options.type === "newaccountline"){
            params = {limit: 25, action:"following", id: options.after};
        }

        //console.log("last id ", options.last_id);



        switch (method) {
            case 'create':

                switch (options.type) {
                    case 'book':
                        options.api.organization(options.org_id).book().create( Utils.parse(model), function(e,d){ cb(e,d) });
                        break;
                    case 'account':
                        options.api.organization(options.org_id).book( options.book_id ).account().create( Utils.parse(model), function(e,d){ cb(e,d) });
                        break;
                    case 'journalentry':
                        options.api.organization(options.org_id).book( options.book_id ).journalEntry().createAndPost( Utils.parse(model), function(e,d){ cb(e,d) });
                        break;
                    case 'report':
                        switch (options.action) {
                            case 'render':
                                options.api.organization(options.org_id).book( options.book_id ).report( options.report_id ).render({at: options.at}, function(e,d){
                                  if (d.completed_report_rendering) {
                                    cb(e, d.completed_report_rendering);
                                  } else {
                                    cb(e, d.building_report_rendering);
                                  }
                                });
                                break;
                        }

                        break;
                }

                break;

            case 'update':
               // console.log('sync update', options.type, options.action, Utils.parse(model));

                switch (options.type) {
                    case 'book':
                        switch (options.action) {
                            case 'update':
                                options.api.organization(options.org_id).book( options.book_id ).update( Utils.parse(model), function(e,d){ cb(e,d) });
                                break;
                            case 'activate':
                                options.api.organization(options.org_id).book( options.book_id ).activate( function(e,d){ cb(e,d) });
                                break;
                            case 'archive':
                                options.api.organization(options.org_id).book( options.book_id ).archive( function(e,d){ cb(e,d) });
                                break;
                        }

                        break;
                    case 'account':
                        switch (options.action) {
                            case 'update':
                                options.api.organization(options.org_id).book( options.book_id ).account().update( Utils.parse(model), function(e,d){ cb(e,d) });
                                break;
                            case 'activate':
                                options.api.organization(options.org_id).book( options.book_id ).account().activate( function(e,d){ cb(e,d) });
                                break;
                            case 'archive':
                                options.api.organization(options.org_id).book( options.book_id ).account().archive(function(e,d){ cb(e,d) });
                                break;
                        }

                        break;
                    case 'journalentry':
                        switch (options.action) {
                            case 'update':
                                var cleanModel = Utils.parse(model);
                                var version = parseInt(cleanModel.version)+1;
                                cleanModel.version = version.toString();

                                options.api.organization(options.org_id).book( options.book_id ).journalEntry(options.journal_id).update( cleanModel, function(e,d){ cb(e,d) });
                                break;
                            case 'activate':
                                options.api.organization(options.org_id).book( options.book_id ).journalEntry(options.journal_id).activate( function(e,d){ cb(e,d) });
                                break;
                            case 'archive':
                                options.api.organization(options.org_id).book( options.book_id ).journalEntry(options.journal_id).archive( function(e,d){ cb(e,d) });
                                break;
                        }

                        break;
                }
                break;


            case 'read':
                switch (options.type) {
                    case 'identity':
                        // TODO remove fakedata
                        //api.identity(fakedata.key).get(function(e,d){ cb(e, d.active_org); });
                        alert("no identity for now");
                        break;
                    case 'org':
                        options.api.organization(options.org_id).get(function(e,d){ cb(e, d.active_org); });
                        break;
                    case 'book':
                        options.api.organization(options.org_id).book().get(function(e,d){ cb(e, d.active_books); });
                        break;
                    case 'account':
                        options.api.organization(options.org_id).book(options.book_id).account().get(params, function(e,d){ cb(e, d.active_accounts); });
                        break;
                    case 'oneaccount':
                        console.log("options.current", options.current);
                        options.api.organization(options.org_id).book(options.book_id).account(options.current).get( function(e,d){ cb(e, d.active_account); });
                        break;

                    case 'accountbalance':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).balance(function(e,d){ cb(e, d.balance); });
                        break;
                    case 'accountline':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).line().get(function(e,d){ cb(e, d.posted_lines); });
                        break;
                    case 'moreaccountline':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).line().get(params, function(e,d){ cb(e, d.posted_lines); });
                        break;
                    case 'newaccountline':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).line().get(params, function(e,d){ cb(e, d.posted_lines); });
                        break;
                    case 'journalentry':
                     //   console.log(options, params);
                        options.api.organization(options.org_id).book(options.book_id).journalEntry().get(params, function(e,d){ cb(e, d.posted_journal_entries); });
                        break;
                    case 'onejournalentry':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry(options.current).get(function(e,d){ cb(e, d.posted_journal_entry); });
                        break;
                    case 'journalbalance':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry(options.journal_id).balance(function(e,d){ cb(e, d.balance); });
                        break;
                    case 'entryline':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry(options.journal_id).line().get(function(e,d){ cb(e, d.active_lines); });
                        break;
                    case 'postedentryline':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry(options.journal_id).line().get({action:options.action, state:options.state},function(e,d){ cb(e, d.posted_lines); });
                        break;
                    case 'report':
                        options.api.organization(options.org_id).book(options.book_id).report().get(function(e,d){ cb(e, d.active_reports); });
                        break;

                    case 'reportrendering':
                        options.api.organization(options.org_id).book(options.book_id).report_rendering(options.report_rendering_id).get(function(e,d){
                          if (d.completed_report_rendering) {
                            cb(e, d.completed_report_rendering);
                          } else {
                            cb(e, d.building_report_rendering);
                          }
                        });
                        break;
                }
                break;
        }
    };



});
