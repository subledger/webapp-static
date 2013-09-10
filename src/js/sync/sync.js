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
    'models/account_line'
], function ($, Backbone, Utils, Book, Account, Journal_entry, BalanceAccount, BalanceJournal, Journal_entryline, Account_line) {


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
                                        Book.create(Utils.parse(current));
                                    });
                                    break;

                                case 'account':

                                    $.each(Utils.parse(data), function(index, current){
                                        Account.create(Utils.parse(current));
                                    });
                                    break;

                                case 'accountbalance':
                                    data.account = options.account_id;
                                    BalanceAccount.create(Utils.parse(data));
                                    break;

                                case 'accountline':

                                    $.each(Utils.parse(data), function(index, current){
                                        Account_line.create(Utils.parse(current));
                                    });
                                    break;

                                case 'journalentry':

                                    $.each(Utils.parse(data), function(index, current){
                                        Journal_entry.create(Utils.parse(current));
                                    });
                                    break;

                                case 'journalbalance':
                                    data.journal = options.journal_id;
                                    BalanceJournal.create(Utils.parse(data));
                                    break;

                                case 'entryline':

                                    $.each(Utils.parse(data), function(index, current){
                                        Journal_entryline.create(Utils.parse(current));
                                    });
                                    break;

                            }
                            break;

                    }
                }
                console.log("success", error, data);
                options.success(data);
            } else {
                console.log("error", error, data);
                options.error(error);
            }

            model.trigger('sync', method, model, data, options);


        }

        var params = {limit: 1, action:"preceding", id: options.last_id};
        //console.log("sync",method, options.type, model, Utils.parse(model),  options );
        if(options.last_id === null || options.last_id === undefined){

            params = {limit: 4, action:"before"};
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
                console.log('sync update');

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
                                options.api.organization(options.org_id).book( options.book_id ).journalEntry().update( Utils.parse(model), function(e,d){ cb(e,d) });
                                break;
                            case 'activate':
                                options.api.organization(options.org_id).book( options.book_id ).journalEntry().activate( function(e,d){ cb(e,d) });
                                break;
                            case 'archive':
                                options.api.organization(options.org_id).book( options.book_id ).journalEntry().archive( function(e,d){ cb(e,d) });
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
                    case 'accountbalance':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).balance(function(e,d){ cb(e, d.balance); });
                        break;
                    case 'accountline':
                        options.api.organization(options.org_id).book(options.book_id).account(options.account_id).line().get(function(e,d){ cb(e, d.posted_lines); });
                        break;
                    case 'journalentry':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry().get(params, function(e,d){ cb(e, d.active_journal_entries); });
                        break;
                    case 'journalbalance':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry(options.journal_id).balance(function(e,d){ cb(e, d.balance); });
                        break;
                    case 'entryline':
                        options.api.organization(options.org_id).book(options.book_id).journalEntry(options.journal_id).line().get(function(e,d){ cb(e, d.active_lines); });
                        break;

                }
                break;
        }
    };



});