
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
        journalentryFetch: function(org_id, book_id, last_id, current,  cb){
             var type = "journalentry";
             if(current !== null && current !== undefined){
                 type = "onejournalentry";
             }

            this.journal_entrycollection.fetch({
                type:type,
                org_id: org_id,
                book_id: book_id,
                api: this.api,
                last_id: last_id,
                current: current,
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
        accountLinesFetch: function(org_id, book_id, account_id, cb){
            this.journal_entrylinecollection.fetch({
                type:"accountline",
                org_id: org_id,
                book_id: book_id,
                account_id: account_id,
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    //console.log("journal_accountlinecollection error",error);
                    cb(error);
                }
            });
        },
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
            this.journalentryFetch(this.org_id, book_id, last_id, null, callback);

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
            this.journalentryFetch(this.org_id, book_id, null, current, callback);

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
                    ref: current.reference,
                    balance: balance[0],
                    timeago: timeago + " ago",
                    book_id:bookid
                }
                data.push(partial);

            });

            var result = { journalEntries : data, createBtn:createBtn, layout:"journals"  };

            //console.log("test data", result);

            return result;
        },
        prepareJournalEntryData: function(journalid){

            //console.log("journalid", journalid);
            var book = Utils.parse(Journal_entry.all().get(journalid).book());
            var journalentry = Utils.parse(Journal_entry.all().get(journalid));
            var datetime = new Date(journalentry.effective_at);

            var month = Utils.months[datetime.getMonth()-1];

            var time = Utils.getTime(datetime, false);


            var result = {
                id:journalentry.id,
                desc: journalentry.description,
                date: datetime.getDate()+" "+month+" "+datetime.getFullYear(),
                time: time,
                ref: journalentry.reference,
                accounts: Utils.parse(Book.all().get(book.id).accounts()),
                lines: Utils.parse(Journal_entry.all().get(journalid).lines()),
                book_id:book.id,
                version: journalentry.version
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
                    balance: balance[0]
                }
                data.push(partial);

            });


            var result = { accounts : data,  book_id: bookid, createBtn:createBtn, layout:"accounts" };

            //console.log("test data", result);

            return result;


        },
        prepareAccountData: function(accountid){

            var account = Utils.parse(Account.all().get(accountid));
            var book = Utils.parse(Account.all().get(accountid).book());
            var lines = Utils.parse(Account.all().get(accountid).lines());


            var datedlines = [];
            $.each(lines, function(index, current){
                var datetime = new Date(current.posted_at);

                var month = Utils.months[datetime.getMonth()-1];

                var time = Utils.getTime(datetime, false);

                current.date = datetime.getDate()+" "+month+" "+datetime.getFullYear() + " - " + time;
                datedlines.push(current);
            });


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
                    totalcredit = totalcredit + parseInt(current.value.amount);
                }
                if(current.value.type === 'credit'){
                    totaldebit = totaldebit + parseInt(current.value.amount);
                }
                current.date = datetime.getDate()+" "+month+" "+datetime.getFullYear() + " - " + time;
                datedlines.push(current);
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
        getCurrentJournal: function(options, cb){
            //console.log(Utils.parse(Journal_entry.all().get(options.id)));
            cb([Utils.parse(Journal_entry.all().get(options.id))]);
        },
        getCurrentAccount: function(options, cb){
            //console.log(Utils.parse(Account.all().get(options.id)));
            cb([options.id]);
        },
        loadstatus:false,
        loadMoreJournals: function(book_id, callback, lastid){
            var _this = this;
            var last_id = $("#content").find('article:last').attr('data-id');
            if(lastid !== undefined){
                last_id = lastid;
            }

            window.DataStructure.getNextJournals({book: book_id, following:last_id},function(journals){

                if(journals !== null){
                    if(typeof journals[0] !== 'undefined'){
                        if(journals !== null && journals[0] !== last_id ){
                            if($("#content").find('article[data-id="'+journals[0]+'"]').length === 0 ){
                                window.DataStructure.getJournalsBalance({book: book_id, journals:journals},function(bookid){
                                    if($("#content").find('article[data-id="'+journals[0]+'"]').length === 0 ){
                                        if($("#subledgerapp").hasClass("journals-layout")){
                                            window.Templates.applyTemplate(window.AppView.templateSelector.main, window.AppView.templates._draftJournals, window.DataStructure.prepareJournalsEntryData(book_id, journals), true);
                                        }
                                    }

                                    window.DataStructure.loadstatus = false;
                                    callback(book_id, journals[0]);

                                });
                            } else {
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
                                    callback(book_id, accounts[0]);

                                });


                            } else {
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
                console.log("passed validation");
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