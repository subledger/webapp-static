
//Author : Etienne Dion <dionetienne@gmail.com> September 2013

define([
    'jquery',
    'underscore',
    'backbone',
    'async',
    'utils',
    'events',

    'collection/identitycollection',
    'collection/orgcollection',
    'collection/bookcollection',
    'collection/accountcollection',
    'collection/journal_entrycollection',
    'collection/balanceaccountcollection',
    'collection/balancejournalcollection',
    'collection/journal_entrylinecollection',
    'collection/account_linecollection',
    'collection/posted_journal_entrylinecollection',

    'models/identity',
    'models/org',
    'models/book',
    'models/account',
    'models/journal_entry',
    'models/balanceaccount',
    'models/balancejournal',
    'models/journal_entryline',
    'models/account_line',
    'models/posted_journal_entryline',

    'subledger'


], function ($, _, Backbone, async, Utils, AppEvents,
             IdentityCollection, OrgCollection, BookCollection, AccountCollection, Journal_entryCollection, BalanceAccountCollection, BalanceJournalCollection, Journal_entrylineCollection, Account_lineCollection, Posted_Journal_entrylineCollection,
             Identity, Org, Book, Account, Journal_entry, BalanceAccount, BalanceJournal, Journal_entryline, Account_line, Posted_Journal_entryline){

    'use strict';


    var DataStructure = {


        /**********************************************/
        /********** INIT AND STRUCTURE ****************/
        /**********************************************/

        initApi: function(settings){
            this.api = new Subledger("https://fakt.api.boocx.com/v1/");
            this.api.setCredentials(settings.key,settings.secret);
            this.org_id = settings.org;
        },
        setRelations: function(AppView, Templates, Forms){

            this.DataStructure = this;
            this.AppView = AppView;
            this.Templates = Templates;
            this.Forms = Forms;

            window.Templates = this.Templates;
            window.AppView = this.AppView;
            window.DataStructure = this.DataStructure;

            window.loadMoreJournals = this.loadMoreJournals;
            window.loadMoreAccounts = this.loadMoreAccounts;
            window.fillJournals = this.fillJournals;
            window.fillAccounts = this.fillAccounts;

            window.applyTemplate = this.applyTemplate;
            window.bindTemplate = this.bindTemplate;
            window.bindPrettySelect = this.bindPrettySelect;
            window.bindTimePicker = this.bindTimePicker;
            window.bindDatePicker = this.bindDatePicker;
            window.bindEvents = this.bindEvents;
            window.loadstatus = this.loadstatus;
            window.loadnum = this.loadnum;

            Org.has().many('book', {
                collection: BookCollection,
                inverse: 'org'
            });

            Book.has().many('accounts', {
                collection: AccountCollection,
                inverse: 'book'
            });

            Book.has().many('journal_entries', {
                collection: Journal_entryCollection,
                inverse: 'book'
            });

            Journal_entry.has().one('book', {
                model: Book,
                inverse: 'journal_entries'
            });

            Account.has().one('book', {
                model: Book,
                inverse: 'accounts'
            });

            Account.has().many('balance', {
                collection: BalanceAccountCollection,
                inverse: 'account'
            });

            BalanceAccount.has().one('account', {
                model: Account,
                inverse: 'balance'
            });

            Account.has().many('lines', {
                collection: Account_lineCollection,
                inverse: 'account'
            });

            Account_line.has().one('account', {
                model: Account,
                inverse: 'lines'
            });

            Journal_entry.has().many('balance', {
                collection: BalanceJournalCollection,
                inverse: 'journal'
            });

            BalanceJournal.has().one('journal', {
                model: Journal_entry,
                inverse: 'balance'
            });

            Journal_entry.has().many('lines', {
                collection: Journal_entrylineCollection,
                inverse: 'journal'
            });

            Journal_entryline.has().one('journal', {
                model: Journal_entry,
                inverse: 'lines'
            });

            Journal_entry.has().many('posted_lines', {
                collection: Posted_Journal_entrylineCollection,
                inverse: 'journal'
            });

            Posted_Journal_entryline.has().one('journal', {
                model: Journal_entry,
                inverse: 'posted_lines'
            });


            this.identitycollection = new IdentityCollection;
            this.orgcollection = new OrgCollection;
            this.bookcollection = new BookCollection;
            this.accountcollection = new AccountCollection;
            this.journal_entrycollection = new Journal_entryCollection;
            this.balanceaccountcollection = new BalanceAccountCollection;
            this.balancejournalcollection = new BalanceJournalCollection;
            this.journal_entrylinecollection = new Journal_entrylineCollection;
            this.posted_journal_entrylinecollection = new Posted_Journal_entrylineCollection;
        },
        clearData: function(){
            Identity.reset();
            Org.reset();
            Book.reset();
            Account.reset();
            BalanceAccount.reset();
            Account_line.reset();
            Journal_entry.reset();
            BalanceJournal.reset();
            Journal_entryline.reset();
            Posted_Journal_entryline.reset();
        },
        nodata: function(message){
            AppEvents.trigger("nodata", message)
            //console.log(message);
        },



        /**********************************************/
        /***************** FETCHING *******************/
        /**********************************************/

        identityFetch: function(cb){

            this.identitycollection.fetch({
                type:"identity",
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("orgcollection error",error);
                    cb(error, null);
                }
            });
        },
        orgFetch: function(cb){
            this.orgcollection.fetch({
                type:"org",
                api: this.api,
                org_id: this.org_id,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("orgcollection error",error);
                    cb(error, null);
                }
            });
        },
        bookFetch: function(org_id,cb){
            this.bookcollection.fetch({
                type:"book",
                org_id: org_id,
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("bookcollection error",error);
                    cb(error, null);
                }
            });
        },
        accountFetch: function(org_id, book_id, last_id, current, cb){
            var type = "account";
            if(current !== null && current !== undefined){
                type = "oneaccount";
            }
            this.accountcollection.fetch({
                type: type,
                org_id: org_id,
                book_id: book_id,
                api: this.api,
                last_id: last_id,
                current: current,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("accountcollection error",error);
                    cb(error);
                }
            });
        },
        journalentryFetch: function(org_id, book_id, first_id, last_id, current,  cb){
             var type = "journalentry";
             if(current !== null && current !== undefined){
                 type = "onejournalentry";
             }

            this.journal_entrycollection.fetch({
                type:type,
                org_id: org_id,
                book_id: book_id,
                api: this.api,
                first_id: first_id,
                last_id: last_id,
                current: current,
                state: "posted",
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("journal_entrycollection error",error);
                    cb(error);
                }
            });
        },
        balanceAccountsFetch: function(org_id, book_id, account_id, cb){
            this.balanceaccountcollection.fetch({
                type:"accountbalance",
                org_id: org_id,
                book_id: book_id,
                account_id: account_id,
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("accountbalancecollection error",error);
                    cb(error);
                }
            });
        },
        balanceJournalsFetch: function(org_id, book_id, journal_id, cb){
            this.balancejournalcollection.fetch({
                type:"journalbalance",
                org_id: org_id,
                book_id: book_id,
                journal_id: journal_id,
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("journalbalancecollection error",error);
                    cb(error);
                }
            });
        },
        entryLinesFetch: function(org_id, book_id, journal_id, posted, cb){
            var state = "active";
            var action = "starting";
            if(posted !== null && posted !== undefined){

            }

            this.journal_entrylinecollection.fetch({
                type:"postedentryline",
                org_id: org_id,
                book_id: book_id,
                journal_id: journal_id,
                api: this.api,
                state:state,
                action:action,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("journal_entrylinecollection error",error);
                    cb(error);
                }
            });

        },
        posted_entryLinesFetch: function(org_id, book_id, journal_id,  cb){
            var state = "posted";
            var action = "starting";

            this.posted_journal_entrylinecollection.fetch({
                type:"postedentryline",
                org_id: org_id,
                book_id: book_id,
                journal_id: journal_id,
                api: this.api,
                state:state,
                action:action,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("posted_journal_entrylinecollection error",error);
                    cb(error);
                }
            });

        },
        accountNewLinesFetch: function(org_id, book_id, account_id, last_id, cb){
            var _this = this;
            _this.journal_entrylinecollection.fetch({
                type: "newaccountline",
                org_id: org_id,
                book_id: book_id,
                account_id: account_id,
                api: this.api,
                after: last_id,
                success: function(resp) {

                    cb(null, resp);

                },
                error: function(error) {
                    //console.log("journal_accountlinecollection error",error);
                    cb(error);
                }
            });
        },
        accountLinesFetch: function(org_id, book_id, account_id, cb, precedingLines){
            var _this = this;

            var last = null;
            var type = "accountline";
            if(precedingLines !== undefined){
                last = precedingLines[0].id;
                type = "moreaccountline";
            }
            _this.journal_entrylinecollection.fetch({
                type: type,
                org_id: org_id,
                book_id: book_id,
                account_id: account_id,
                api: this.api,
                following: last,
                success: function(resp) {


                    var mergeResp = [];
                    if(precedingLines !== undefined){
                        mergeResp = precedingLines;

                        $.each(Utils.parse(resp), function(index, value){
                            mergeResp.push(value);
                        });

                    } else {
                        mergeResp = Utils.parse(resp);
                    }

                    if(resp.length === 25 && mergeResp.length < 50){
                        _this.accountLinesFetch(org_id, book_id, account_id, cb, mergeResp);
                    } else {
                        cb(null, mergeResp);
                    }

                },
                error: function(error) {
                    //console.log("journal_accountlinecollection error",error);
                    cb(error);
                }
            });
        },

        /**********************************************/
        /****************** GETTER ********************/
        /**********************************************/


        getInitialData: function(){

            var _this = this;

            async.series([
                function(cb){
                    async.parallel({
                        identity: function(callback){
                            //TODO
                            //_this.identityFetch(callback);
                            callback();
                        },
                        organisation: function(callback){
                            //console.log("*********************************");
                            //console.log("********** GET ORG **************");
                            //console.log("*********************************");


                            _this.orgFetch(callback);
                        }
                    },function(err, results) {
                            //console.log("err", err);
                            cb(err, results);

                    });


                },
                function(cb){

                    _this.org_id = _this.orgcollection.models[0].id;

                    //console.log("*********************************");
                    //console.log("********** GET BOOKS **************");
                    //console.log("*********************************");

                    _this.bookFetch(_this.org_id, cb);

                }

            ], function (err, result) {


                if(err !== null){
                    //console.log("Error", err);
                } else {


                    AppEvents.trigger("navReady", {});

                    AppEvents.trigger("ready", {});
                }


            });


        },
        getNextAccounts: function(options, cb){
            var book_id = options.book;
            var last_id = options.following;

            //console.log("*********************************");
            //console.log("********** GET NEXT ACCOUNTS "+last_id+"  **************");
            //console.log("*********************************");

            //console.log(last_id);
            var callback = function(err, data){

                if(err === null){
                    var accounts = [];
                    $.each(Utils.parse(data), function(index, value){
                        accounts.push(value.id);
                    });
                    cb(accounts);
                } else {
                    cb(null);
                }

            };
            this.accountFetch(this.org_id, book_id, last_id, null, callback);
        },
        getAllAccounts: function(options, cb){
            var book_id = options.book;

            //console.log("*********************************");
            //console.log("********** GET ALL ACCOUNTS **************");
            //console.log("*********************************");

            var callback = function(err, data){

                if(err === null){
                    cb(data);
                } else {
                    cb(null);
                }

            };
            this.accountFetch(this.org_id, book_id, "all", null, callback);
        },
        getNextJournals: function(options, cb){
            var book_id = options.book;
            var last_id = options.following;

            //console.log("*********************************");
            //console.log("********** GET NEXT JOURNAL "+last_id+"  **************");
            //console.log("*********************************");

            //console.log(last_id);
            var callback = function(err, data){

                if(err === null){
                    var journals = [];
                    $.each(Utils.parse(data), function(index, value){
                        journals.push(value.id);
                    });
                    cb(journals);
                } else {
                    cb(null);
                }

            };
            this.journalentryFetch(this.org_id, book_id, null, last_id, null, callback);

        },
        getPreviousJournals: function(options, cb){
            var book_id = options.book;
            var first_id = options.following;

            //console.log("*********************************");
            //console.log("********** GET NEXT JOURNAL "+last_id+"  **************");
            //console.log("*********************************");

            //console.log(last_id);
            var callback = function(err, data){

                if(err === null){
                    var journals = [];
                    $.each(Utils.parse(data), function(index, value){
                        journals.push(value.id);
                    });
                    cb(journals);
                } else {
                    cb(null);
                }

            };
            this.journalentryFetch(this.org_id, book_id, first_id, null, null, callback);
        },
        getOneJournal: function(options, cb){
            var book_id = options.book;
            var current = options.current;

            //console.log("*********************************");
            //console.log("********** GET ONE JOURNAL "+current+"  **************");
            //console.log("*********************************");

            var callback = function(err, data){

                if(err === null){
                    var journals = [];
                    $.each(Utils.parse(data), function(index, value){
                        journals.push(value.id);
                    });
                    cb(journals);
                } else {
                    cb(null);
                }

            };
            this.journalentryFetch(this.org_id, book_id, null, null, current, callback);

        },
        getOneAccount: function(options, cb){
            var book_id = options.book;
            var current = options.current;

            //console.log("*********************************");
            //console.log("********** GET ONE ACCOUNT "+current+"  **************");
            //console.log("*********************************");

            var callback = function(err, data){

                if(err === null){
                    var account = [];
                    $.each(Utils.parse(data), function(index, value){
                        account.push(value.id);
                    });
                    cb(account);
                } else {
                    cb(null);
                }

            };
            this.accountFetch(this.org_id, book_id, null, current, callback);

        },
        getAccountsBalance: function(options, cb){

            var _this = this;
            var count = 0;
            var book_id = options.book;
            var accounts_ids = options.accounts;

            //console.log("*********************************");
            //console.log("********** GET ACCOUNTS BALANCE **************");
            //console.log("*********************************");


            async.whilst(
                function () { return count < accounts_ids.length; },
                function (itcallback) {


                    var index = count;

                    _this.balanceAccountsFetch(_this.org_id, book_id, accounts_ids[index], itcallback);

                    count++;

                }, function (err, result) {
                    cb(book_id);
                }
            );

            //_this.nodata("No Account in this book.");



        },
        getJournalsBalance: function(options, cb){
            var _this = this;
            var count = 0;
            var book_id = options.book;
            var journal_entries_ids = options.journals;

            //console.log("*********************************");
            //console.log("********** GET JOURNALS BALANCE **************");
            //console.log("*********************************");


            async.whilst(
                function () { return count < journal_entries_ids.length; },
                function (itcallback) {


                    var index = count;

                    _this.balanceJournalsFetch(_this.org_id, book_id, journal_entries_ids[index], itcallback);

                    count++;

                }, function (err, result) {
                    cb(book_id);
                }
            );


        },
        getJournalLines: function(journal_id, cb){
            var count = 0;

            //console.log("*********************************");
            //console.log("********** GET JOURNALS LINES **************");
            //console.log("*********************************");

            var book_id = Utils.parse(Journal_entry.all().get(journal_id).book()).id;


            var callback = function(){
                 cb(journal_id);
            };

            this.entryLinesFetch(this.org_id, book_id, journal_id, callback);

        },
        getPostedJournalLines: function(book_id, journal_id, cb){
            var count = 0;

            //console.log("*********************************");
            //console.log("********** GET POSTED JOURNAL LINES **************");
            //console.log("*********************************");


            var callback = function(err, data){
                var lines = [];
                $.each(Utils.parse(data), function(index, value){
                    lines.push(value.id);
                });
                cb(lines);
            };

            this.posted_entryLinesFetch(this.org_id, book_id, journal_id, callback);

        },
        getAccountLines: function(account_id, cb){
            var count = 0;

            //console.log("*********************************");
           // console.log("********** GET ACCOUNT LINES **************");
           // console.log("*********************************");


            var book_id = Utils.parse(Account.all().get(account_id).book()).id;

            var callback = function(){
                cb(account_id);
            };

            this.accountLinesFetch(this.org_id, book_id, account_id, callback);

        },
        getAccountNewLines: function(account_id, cb, last_id){
            var count = 0;

            //console.log("*********************************");
            // console.log("********** GET ACCOUNT LINES **************");
            // console.log("*********************************");


            var book_id = Utils.parse(Account.all().get(account_id).book()).id;

            var callback = function(err, resp){
                cb(resp);
            };

            this.accountNewLinesFetch(this.org_id, book_id, account_id, last_id, callback);

        },
        getCurrentJournal: function(options, cb){
            //console.log(Utils.parse(Journal_entry.all().get(options.id)));
            cb([options.id]);
        },
        getCurrentAccount: function(options, cb){
            //console.log(Utils.parse(Account.all().get(options.id)));
            cb([options.id]);
        },


        /**********************************************/
        /****************** PREPARE *******************/
        /**********************************************/


        prepareSettingsData: function(settings){
            return settings;

        },
        prepareNewJournalOrAccount: function(bookid){
            var data = [];
            var book = Utils.parse(Book.all());
            var _this = this;

            $.each(book, function(index, current){

                var partial = {
                    desc: current.description,
                    id: current.id
                }
                data.push(partial);
                //console.log(current, book[index]);
            });

            var result = { books : data, accounts: _this.prepareAccountsData(bookid).accounts };

            return result;
        },
        prepareNavData: function(bookid){
            var data = this.prepareBooksData();

            if(bookid === undefined){
                bookid = data.books[0].id;

            }
            data.selectedbook = bookid;

            return data;
        },
        prepareBooksData: function(bookid){
            var data = [];
            var book;


            if(bookid === undefined){
                book = Utils.parse(Book.all());
            } else {
                book = Utils.parse(Book.all.get(bookid));
            }

            $.each(book, function(index, current){

                var partial = {
                    desc: current.description,
                    id: current.id
                }
                data.push(partial);

            });

            var result = { books : data };

            //console.log("test data", result);

            return result;

        },
        prepareJournalsEntryData: function(bookid, journals, createBtn){

            //console.log("&&&& bookid",bookid, Utils.parse(journals)[0].id, Utils.parse(Journal_entry.all().get(Utils.parse(journals)[0].id)), Utils.parse(journals)[0]);


            var data = [];
            var journalentryIdsArray = journals;
            var _this = this;
            var createBtn = createBtn || false;
            journalentryIdsArray.reverse();


            $.each(journalentryIdsArray, function(index, value){
                var current = Utils.parse(Journal_entry.all().get(value));

                var datetime = new Date(current.effective_at);

                var month = Utils.months[datetime.getMonth()-1];

                var time = Utils.getTime(datetime, false);

                var balance = Utils.parse(Journal_entry.all().get(current.id).balance());
                var timeago = Utils.timeago(datetime);
                var partial = {
                    id:current.id,
                    desc: current.description,
                    date: datetime.getDate()+" "+month+" "+datetime.getFullYear(),
                    time: time,
                    rawdate: datetime,
                    ref: current.reference,
                    balance: balance[0],
                    timeago: timeago + " ago",
                    book_id:bookid
                }
                data.push(partial);

            });

            data.sort(function(a, b) {
                return b.rawdate.getTime() - a.rawdate.getTime();
            });


            var result = { journalEntries : data, createBtn:createBtn, layout:"journals"  };

            //console.log("test data", result);

            return result;
        },
        prepareJournalEntryData: function(bookid, journalid, linesId){

            //console.log("journalid", journalid);

            var journalentry = Utils.parse(Journal_entry.all().get(journalid));
            var datetime = new Date(journalentry.effective_at);

            var month = Utils.months[datetime.getMonth()-1];

            var time = Utils.getTime(datetime, false);



            var totalcredit = 0;
            var totaldebit = 0
            var datedlines = [];
            $.each(linesId, function(index, value){

                var current = Utils.parse(Posted_Journal_entryline.all().get(value));
                var rawdate = current.posted_at;
                var datetime = new Date(current.posted_at);

                var month = Utils.months[datetime.getMonth()-1];

                var time = Utils.getTime(datetime, false);

                if(current.value.type === 'debit'){
                    totalcredit = totalcredit + parseFloat(current.value.amount);
                }
                if(current.value.type === 'credit'){
                    totaldebit = totaldebit + parseFloat(current.value.amount);
                }
                current.date = datetime.getDate()+" "+month+" "+datetime.getFullYear() + " - " + time;
                datedlines.push(current);
            });

            var result = {
                id: journalid,
                bookid: bookid,
                journalid: journalid,
                desc: journalentry.description,
                date: datedlines[0].date,
                lines: datedlines,
                totalcredit: totalcredit,
                totaldebit: totaldebit
            };


            //console.log("test data", result);

            return result;

        },
        prepareAccountsData: function(bookid, accounts, createBtn){

            var data = [];
            var accountsIdsArray = accounts;
            var _this = this;

            var createBtn = createBtn || false;
            //accountsIdsArray.reverse();


            $.each(accountsIdsArray, function(index, value){
                var current = Utils.parse(Account.all().get(value));
                var balance = Utils.parse(Account.all().get(value).balance());


                var partial = {
                    id: current.id,
                    desc: current.description,
                    normal_balance: current.normal_balance,
                    balance: balance[0],
                    balanceamount: parseFloat(balance[0].value.amount).toFixed(2)
                }
                data.push(partial);

            });


            var result = { accounts : data,  book_id: bookid, createBtn:createBtn, layout:"accounts" };

            //console.log("test data", result);

            return result;


        },
        prepareNewAccountLineData: function(lines){
            //console.log("lines", Utils.parse(lines));
            return Utils.parse(lines);
        },
        prepareAccountData: function(accountid){

            var account = Utils.parse(Account.all().get(accountid));
            var book = Utils.parse(Account.all().get(accountid).book());
            var lines = Utils.parse(Account.all().get(accountid).lines());

            lines.sort(function(a, b) {
                return new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime();
            });

            var balance = parseFloat(Utils.parse(Account.all().get(accountid).balance())[0].value.amount);
            var datedlines = [];
            $.each(lines, function(index, current){
                var datetime = new Date(current.posted_at);

                var month = Utils.months[datetime.getMonth()-1];

                var time = Utils.getTime(datetime, false);

                current.balance = balance.toFixed(2);
                balance = balance - parseFloat(current.value.amount);
                current.amount = parseFloat(current.value.amount).toFixed(2);
                current.date = datetime.getDate()+" "+month+" "+datetime.getFullYear() + " - " + time;
                datedlines.push(current);
            });
            datedlines.reverse();

            var result = {
                id:accountid,
                desc: account.description,
                ref: account.reference,
                lines: datedlines,
                book_id:book.id
            };

            //console.log("test data", result);

            return result;

        },
        prepareSourceData: function(bookid, account, journal, lines){

            var accountsId = account[0];
            var journalId = journal[0];

            var account = Utils.parse(Account.all().get(accountsId));
            var journal = Utils.parse(Journal_entry.all().get(journalId));

            var balance = Utils.parse(Journal_entry.all().get(journalId).balance());

            var totalcredit = 0;
            var totaldebit = 0;
            var datedlines = [];
            $.each(lines, function(index, value){

                var current = Utils.parse(Posted_Journal_entryline.all().get(value));
                var rawdate = current.posted_at;
                var datetime = new Date(current.posted_at);

                var month = Utils.months[datetime.getMonth()-1];

                var time = Utils.getTime(datetime, false);

                if(current.value.type === 'debit'){
                    totalcredit = totalcredit + parseFloat(current.value.amount);
                }
                if(current.value.type === 'credit'){
                    totaldebit = totaldebit + parseFloat(current.value.amount);
                }
                current.date = datetime.getDate()+" "+month+" "+datetime.getFullYear() + " - " + time;
                datedlines.push(current);
            });

            datedlines.sort(function(a, b) {
                return new Date(b.rawdate).getTime() - new Date(a.rawdate).getTime();
            });

            var result = {
                bookid: bookid,
                accountid: accountsId,
                journalid: journalId,
                accountdesc:account.description,
                desc: journal.description,
                date: datedlines[0].date,
                balance: balance[0],
                lines: datedlines,
                totalcredit: totalcredit,
                totaldebit: totaldebit
            };
            return result;
        },


        /**********************************************/
        /******************* ACTIONS ******************/
        /**********************************************/
        showSettings: function(){


            var _this = this;

            window.clearInterval(_this.journalInterval);

            $(_this.AppView.templateSelector.main).removeClass("accounts-layout").removeClass("journals-layout");
            _this.Templates.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._settings,  _this.prepareSettingsData(_this.AppView.settings) );
            _this.Templates.setNavActiveItem();
            $(_this.AppView.templateSelector.loading).hide();
        },
        bindLoadNewActivityStream: function(book_id, $first){
            var _this = this;
            $(_this.AppView.templateSelector.main).find(".noticePreviousJournals").click(function(){
                var $cloneLoading = $(window.AppView.templateSelector.loading).clone();
                $cloneLoading.appendTo($(_this.AppView.templateSelector.main).find(".noticePreviousJournals"));
                $(_this.AppView.templateSelector.main).find(".noticePreviousJournals "+window.AppView.templateSelector.loading).css("margin-top", "15px");
                $(_this.AppView.templateSelector.main).find(".noticePreviousJournals "+window.AppView.templateSelector.loading).css("padding-bottom", "35px");
                $(_this.AppView.templateSelector.main).find(".noticePreviousJournals "+window.AppView.templateSelector.loading).show();

                window.clearInterval(_this.journalInterval);

                _this.getPreviousJournals({book: book_id, following: $first.attr("data-id")}, function(journalsId){
                    //console.log("preceding journals", journalsId);

                    _this.getJournalsBalance({book: book_id, journals:journalsId},function(bookid){
                        if($("#content").find('article[data-id="'+journalsId[0]+'"]').length === 0 ){
                            if($("#subledgerapp").hasClass("journals-layout")){

                                setTimeout(function(){
                                    $(_this.AppView.templateSelector.main).find(".noticePreviousJournals").slideUp(400, function(){
                                        $(_this.AppView.templateSelector.main).find(".noticePreviousJournals").remove();
                                    });
                                }, 500);


                                _this.Templates.applyTemplate(window.AppView.templateSelector.main, window.AppView.templates._draftJournals, window.DataStructure.prepareJournalsEntryData(book_id, journalsId), true, null, null, true);
                                _this.bindActivityStreamNotice(book_id);
                            }
                        }

                        $(window.AppView.templateSelector.loading).hide();

                    });
                });

            });
        },
        bindActivityStreamNotice: function(book_id){
            var _this = this;
            window.clearInterval(_this.journalInterval);
            _this.journalInterval = window.setInterval(function(){
                _this.DataStructure.loadstatus==false;
                var $first = $(_this.AppView.templateSelector.main).find("article[data-action=journal]").first();
                //console.log("interval", $first.attr("data-id"));


                _this.getPreviousJournals({book: book_id, following: $first.attr("data-id")}, function(journalsId){
                    //console.log("preceding journals", journalsId);
                    if(typeof journalsId[0] !== 'undefined'){
                        if(journalsId.length > 0){
                            if($(_this.AppView.templateSelector.main).find(".noticePreviousJournals").length > 0){
                                $(_this.AppView.templateSelector.main).find(".noticePreviousJournals").text(journalsId.length+" new Journals Entries");
                            } else {
                                $first.before("<div class='noticePreviousJournals' style='display:none;'>"+journalsId.length+" new Journals Entries</div>");
                                $(_this.AppView.templateSelector.main).find(".noticePreviousJournals").slideDown();
                                _this.bindLoadNewActivityStream(book_id, $first);
                            }

                        }
                    }

                });

                $("article").each(function(){

                       var datetime = $(this).attr("data-timestamp");
                       var timeago = Utils.timeago(new Date(datetime));
                       $(this).find(".timeago").text(timeago + " ago");
                });

            },7000);
        },
        loadActivityStream: function(book_id){

            //console.log("loadActivityStream")
            var _this = this;

            window.clearInterval(_this.journalInterval);
            window.DataStructure.loadstatus = false;

            $(_this.AppView.templateSelector.main).removeClass("accounts-layout").addClass("journals-layout");

            _this.Templates.applyTemplate(_this.AppView.templateSelector.main, null, "");
            $(_this.AppView.templateSelector.loading).show();
            _this.getNextJournals({book: book_id},function(journals){
                // console.log("journals", journals);
                _this.getJournalsBalance({book: book_id, journals: journals},function(bookid){
                    $(_this.AppView.templateSelector.loading).hide();
                    _this.Templates.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._draftJournals, _this.prepareJournalsEntryData(book_id, journals, true), false, true);
                    _this.Templates.setNavActiveItem("activity-stream");

                    _this.bindActivityStreamNotice(book_id);

                });
            });
        },
        loadAccounts: function(book_id){

            var _this = this;
            window.clearInterval(_this.journalInterval);
            window.DataStructure.loadstatus = false;

            $(_this.AppView.templateSelector.main).removeClass("journals-layout").addClass("accounts-layout");

            _this.Templates.applyTemplate(_this.AppView.templateSelector.main, null, "");
            $(_this.AppView.templateSelector.loading).show();
            _this.getNextAccounts({book: book_id},function(accounts){
                _this.getAccountsBalance({book: book_id, accounts: accounts},function(bookid){
                    $(_this.AppView.templateSelector.loading).hide();
                    _this.Templates.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._accounts, _this.prepareAccountsData(bookid, accounts, true), false, true);
                    _this.Templates.setNavActiveItem("accounts");
                });
            });
        },
        loadstatus:false,
        loadMoreJournals: function(book_id, callback, lastid){

            var _this = this;
            var last_id = $("#content").find('article:last').attr('data-id');
            if(lastid !== undefined){
                last_id = lastid;
            }
            $(window.AppView.templateSelector.loading).show();
            window.DataStructure.getNextJournals({book: book_id, following:last_id},function(journals){

                if(journals !== null){
                    if(typeof journals[0] !== 'undefined'){
                        if(journals !== null && journals[0] !== last_id ){
                            if($("#content").find('article[data-id="'+journals[0]+'"]').length === 0 ){
                                window.DataStructure.getJournalsBalance({book: book_id, journals:journals},function(bookid){
                                    if($("#content").find('article[data-id="'+journals[0]+'"]').length === 0 ){
                                        if($("#subledgerapp").hasClass("journals-layout") && $("#content").find('article').first().attr("data-book-id") === book_id){
                                            window.Templates.applyTemplate(window.AppView.templateSelector.main, window.AppView.templates._draftJournals, window.DataStructure.prepareJournalsEntryData(book_id, journals), true);
                                        }
                                    }

                                    window.DataStructure.loadstatus = false;
                                    $(window.AppView.templateSelector.loading).hide();
                                    callback(book_id, journals[0]);

                                });
                            } else {
                                _this.DataStructure.loadstatus==false;
                                window.DataStructure.loadMoreJournals(book_id, callback, journals[0] );
                            }
                        }
                    }
                }
            });

        },
        loadMoreAccounts: function(book_id, callback, lastid){
            var _this = this;
            var last_id = $("#content").find('article:last a').attr('data-id');
            if(lastid !== undefined){
                last_id = lastid;
            }
            $(window.AppView.templateSelector.loading).show();
            window.DataStructure.getNextAccounts({book: book_id, following:last_id},function(accounts){

                if(accounts !== null){
                    if(typeof accounts[0] !== 'undefined'){
                        if(accounts !== null && accounts[0] !== last_id ){
                            if($("#content").find('article a[data-id="'+accounts[0]+'"]').length === 0 ){

                                window.DataStructure.getAccountsBalance({book: book_id, accounts:accounts},function(bookid){
                                    if($("#content").find('article a[data-id="'+accounts[0]+'"]').length === 0 ){
                                        if($("#subledgerapp").hasClass("accounts-layout")){
                                            window.Templates.applyTemplate(window.AppView.templateSelector.main, window.AppView.templates._accounts, window.DataStructure.prepareAccountsData(bookid, accounts), true);
                                        }
                                    }

                                    window.DataStructure.loadstatus = false;
                                    $(window.AppView.templateSelector.loading).hide();
                                    callback(book_id, accounts[0]);

                                });


                            } else {
                                _this.DataStructure.loadstatus==false;
                                window.DataStructure.loadMoreAccounts(book_id, callback, accounts[0] );
                            }
                        }
                    }
                }
            });

        },
        fillJournals: function(book_id, journal){

            if($("#content").find('article:last').length > 0){
                var offset = $("#content").find('article:last').offset();

                //console.log("fillJournals",$("#content").height() +100, offset.top, book_id, journal);
                if(($("#content").height() +200) > offset.top){
                    window.DataStructure.loadstatus = true;

                    window.DataStructure.loadMoreJournals(book_id, window.DataStructure.fillJournals, journal);
                }
            }

        },
        fillAccounts: function(book_id, account){

            if($("#content").find('article:last').length > 0){
                var offset = $("#content").find('article:last').offset();
                //console.log("fillAccounts",$("#content").height() +100, offset.top, book_id, account);
                if(($("#content").height() +200)  > offset.top){
                    window.DataStructure.loadstatus = true;

                    window.DataStructure.loadMoreAccounts(book_id, window.DataStructure.fillAccounts, account);
                }
            }

        },
        createOrUpdate: function(el){
            var _this = this;
            var $currentForm = $(el.currentTarget).parents(_this.AppView.formSelector.form);

            var action = $(el.currentTarget).attr("data-action");
            var type = 'book';
            if($("#subledgerapp").hasClass("journals-layout")){
                type='journalentry';
            } else if ($("#subledgerapp").hasClass("accounts-layout")){
                type='account';
            }


            var bookid = $currentForm.attr("data-book-id") || $currentForm.parents("article").attr("data-book-id");
            var fields = _this.Forms.serialize($currentForm);
            //console.log("fields", fields);
            var valid = _this.Forms.validateFields(action, fields);

            //console.log("jsonify",_this.Forms.jsonify(fields));
           // console.log("type", type, action, "bookid", bookid);
           // console.log("is valid" , valid);
            if(valid){
                //console.log("passed validation");
                var data = _this.Forms.jsonify(fields);

                var success = function(data){
                 //   console.log(type+" saved :", Utils.parse(data));
                    switch (type) {
                        case 'account':
                            var account = Utils.parse(data).active_account;
                            _this.DataStructure.getOneAccount({book: bookid, current:account.id},function(accounts){
                              //  console.log([accounts]);
                                _this.DataStructure.getAccountsBalance({book: bookid, accounts:[accounts]},function(bookid){
                                    window.Templates.applyTemplate(window.AppView.templateSelector.main, window.AppView.templates._accounts, window.DataStructure.prepareAccountsData(bookid, accounts), true, null, null, true);
                              //       console.log($(".form.new").find(".model1"), $(".form.new").find(".model2"));
                                    $(".form.new").find(".model1").slideDown();
                                    $(".form.new").find(".model2").slideUp();

                                    $(".form.new").find("input, select").each(function(){
                                        $(this).val("");
                                    });

                                });
                            });

                            break;
                    }
                };

                //console.log("bookid",bookid, $currentForm);
                switch (type) {
                    case 'book':
                      //  console.log("*********************************");
                      //  console.log("********** SUBMIT BOOK **************");
                      //  console.log("*********************************");

                        _this.bookcollection.create(data, {wait:true, type:type, org_id:_this.org_id, api: _this.api, success: function(){ success(data); } });
                        break;
                    case 'account':
                      //  console.log("*********************************");
                     //   console.log("********** SUBMIT ACCOUNT **************");
                      //  console.log("*********************************");

                        _this.accountcollection.create(data, {wait:true, type:type, org_id:_this.org_id, book_id:bookid, api: _this.api, success: function(data){ success(data); } });
                        break;
                    case 'journalentry':
                      //  console.log("*********************************");
                      //  console.log("********** SUBMIT JOURNAL **************");
                      //  console.log("*********************************");

                        if(action === "create"){
                            _this.journal_entrycollection.create(data, {wait:true, type:type, org_id:_this.org_id, book_id:bookid, api: _this.api, success: function(){ success(data); } });
                        } else if (action === "save"){

                            var id = $currentForm.parents("article").attr("data-id");

                            var successjournal = function(data){
                           //     console.log(type+" saved :", data);
                            };

                             data.id = id;
                          //  console.log('update', id, data);
                            var cleanedData = Utils.parse(data);
                            var lines = cleanedData.lines;

                            delete cleanedData['lines'];
                          //  console.log("lines", lines);
                            _this.journal_entrycollection.create(cleanedData, {action:"update", merge:true, wait:true, type:type, org_id:_this.org_id, book_id:bookid, journal_id:id,  api: _this.api, success: function(){ successjournal(data); } });
                                    /*
                            $.each(lines, function(){

                            });
                                       */

                        }

                        break;
                }

            }


            //console.log("created", Forms.serialize($currentForm, draft), options);

            //Forms.clearForm($currentForm, draft);

        }
    };

    return DataStructure;
});