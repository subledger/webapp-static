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
    'models/posted_journal_entryline'
], function ($, Backbone, Utils, Book, Account, Journal_entry, BalanceAccount, BalanceJournal, Journal_entryline, Account_line, Posted_Journal_entryline) {


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

        var params = {limit: 1, action:"preceding", id: options.last_id};
        //console.log("sync",method, options.type, model, Utils.parse(model),  options );
        if(options.last_id === null || options.last_id === undefined){

            params = {limit: 3, action:"before"};
        } else if(options.last_id === "all"){
            params = {limit: 100, action:"before"};
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
                        options.api.organization(options.org_id).book(options.book_id).account(options.current).get(function(e,d){ cb(e, d.active_account); });
                        break;

                    case 'accountbalance':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).balance(function(e,d){ cb(e, d.balance); });
                        break;
                    case 'accountline':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).line().get(function(e,d){ cb(e, d.posted_lines); });
                        break;
                    case 'journalentry':
                     //   console.log(options, params);
                        options.api.organization(options.org_id).book(options.book_id).journalEntry().get(params, function(e,d){ cb(e, d.active_journal_entries); });
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
                }
                break;
        }
    };



});