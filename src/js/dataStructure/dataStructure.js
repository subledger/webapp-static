
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

    'models/identity',
    'models/org',
    'models/book',
    'models/account',
    'models/journal_entry',
    'models/balanceaccount',
    'models/balancejournal',
    'models/journal_entryline',
    'models/account_line',

    'subledger'


], function ($, _, Backbone, async, Utils, AppEvents,
             IdentityCollection, OrgCollection, BookCollection, AccountCollection, Journal_entryCollection, BalanceAccountCollection, BalanceJournalCollection, Journal_entrylineCollection, Account_lineCollection,
             Identity, Org, Book, Account, Journal_entry, BalanceAccount, BalanceJournal, Journal_entryline, Account_line){

    'use strict';


    var fakedata = {
        username:'Dan Murphy',
        picture:'img/tmp/profile.jpg',
        id:'12345678',
        key: "q94AwWLKow837L2AidxX15",
        secret: "gbw1tb0KTvGTYmqnWUbF01",
        org_id: "TnmilrLvIQvIk6FaI0Ldb2"
    };


    var DataStructure = {
        initApi: function(settings){
            this.api = new Subledger("https://fakt.api.boocx.com/v1/");
            this.api.setCredentials(settings.key,settings.secret);
            this.org_id = settings.org;
        },
        setRelations: function(AppView, Templates){

            this.DataStructure = this;
            this.AppView = AppView;
            this.Templates = Templates;

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

            Journal_entryline.has().one('journal_id', {
                model: Journal_entry,
                inverse: 'lines'
            });


            this.identitycollection = new IdentityCollection;
            this.orgcollection = new OrgCollection;
            this.bookcollection = new BookCollection;
            this.accountcollection = new AccountCollection;
            this.journal_entrycollection = new Journal_entryCollection;
            this.balanceaccountcollection = new BalanceAccountCollection;
            this.balancejournalcollection = new BalanceJournalCollection;
            this.journal_entrylinecollection = new Journal_entrylineCollection;
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
        },
        nodata: function(message){
            AppEvents.trigger("nodata", message)
            console.log(message);
        },
        identityFetch: function(cb){

            this.identitycollection.fetch({
                type:"identity",
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    console.log("orgcollection error",error);
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
                    console.log("orgcollection error",error);
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
                    console.log("bookcollection error",error);
                    cb(error, null);
                }
            });
        },
        accountFetch: function(org_id, book_id, last_id, cb){
            this.accountcollection.fetch({
                type:"account",
                org_id: org_id,
                book_id: book_id,
                api: this.api,
                last_id: last_id,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    console.log("accountcollection error",error);
                    cb(error);
                }
            });
        },
        journalentryFetch: function(org_id, book_id, last_id, cb){
            this.journal_entrycollection.fetch({
                type:"journalentry",
                org_id: org_id,
                book_id: book_id,
                api: this.api,
                last_id: last_id,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    console.log("journal_entrycollection error",error);
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
                    console.log("accountbalancecollection error",error);
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
                    console.log("journalbalancecollection error",error);
                    cb(error);
                }
            });
        },
        entryLinesFetch: function(org_id, book_id, journal_id, cb){
            this.journal_entrylinecollection.fetch({
                type:"entryline",
                org_id: org_id,
                book_id: book_id,
                journal_id: journal_id,
                api: this.api,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    console.log("journal_entrylinecollection error",error);
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
                    console.log("journal_accountlinecollection error",error);
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
                            console.log("*********************************");
                            console.log("********** GET ORG **************");
                            console.log("*********************************");


                            _this.orgFetch(callback);
                        }
                    },function(err, results) {
                            console.log("err", err);
                            cb(err, results);

                    });


                },
                function(cb){

                    _this.org_id = _this.orgcollection.models[0].id;

                    console.log("*********************************");
                    console.log("********** GET BOOKS **************");
                    console.log("*********************************");

                    _this.bookFetch(_this.org_id, cb);

                }

            ], function (err, result) {


                if(err !== null){
                    console.log("Error", err);
                } else {


                    AppEvents.trigger("navReady", {});

                    AppEvents.trigger("ready", {});
                }


            });


        },
        getNextAccounts: function(options, cb){
            var book_id = options.book;
            var last_id = options.following;

            console.log(last_id);
            var callback = function(err, data){

                if(err === null){
                    cb(data);
                } else {
                    cb(null);
                }

            };
            this.accountFetch(this.org_id, book_id, last_id, callback);
        },
        getNextJournals: function(options, cb){
            var book_id = options.book;
            var last_id = options.following;

            console.log(last_id);
            var callback = function(err, data){

                if(err === null){
                    cb(data);
                } else {
                    cb(null);
                }

            };
            this.journalentryFetch(this.org_id, book_id, last_id, callback);

        },
        getAccountsBalance: function(options, cb){

            var _this = this;
            var count = 0;
            var book_id = options.book;
            var accounts = Utils.parse(options.accounts);

            console.log("*********************************");
            console.log("********** GET ACCOUNTS BALANCE **************");
            console.log("*********************************");


            async.whilst(
                function () { return count < accounts.length; },
                function (itcallback) {


                    var index = count;

                    _this.balanceAccountsFetch(_this.org_id, book_id, accounts[index].id, itcallback);

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
            var journal_entries = Utils.parse(options.journals);

            console.log("*********************************");
            console.log("********** GET JOURNALS BALANCE **************");
            console.log("*********************************");


            async.whilst(
                function () { return count < journal_entries.length; },
                function (itcallback) {


                    var index = count;

                    _this.balanceJournalsFetch(_this.org_id, book_id, journal_entries[index].id, itcallback);

                    count++;

                }, function (err, result) {
                    cb(book_id);
                }
            );


        },
        getJournalLines: function(journal_id, cb){
            var count = 0;

            console.log("*********************************");
            console.log("********** GET JOURNALS LINES **************");
            console.log("*********************************");

            var book_id = Utils.parse(Journal_entry.all().get(journal_id).book()).id;


            var callback = function(){
                 cb(journal_id);
            };

            this.entryLinesFetch(this.org_id, book_id, journal_id, callback);

        },
        getAccountLines: function(account_id, cb){
            var count = 0;

            console.log("*********************************");
            console.log("********** GET ACCOUNT LINES **************");
            console.log("*********************************");


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
                //console.log(current, book[index]);
            });

            var result = { books : data };

            //console.log("test data", result);

            return result;

        },
        prepareJournalsEntryData: function(journals, createBtn){

            var data = [];
            var journalentry = Utils.parse(journals);
            var _this = this;
            var createBtn = createBtn || false;
            journalentry.reverse();


            $.each(journalentry, function(index, current){
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
                    accounts: _this.prepareAccountsData(current.book).accounts,
                    timeago: timeago + " ago"
                }
                data.push(partial);

            });

            var result = { journalEntries : data, createBtn:createBtn, layout:"journals"  };

            //console.log("test data", result);

            return result;
        },
        prepareJournalEntryData: function(journalid){

            var journalentry = Utils.parse(Journal_entry.all().get(journalid));
            var book = Utils.parse(Journal_entry.all().get(journalid).book());
            var datetime = new Date(journalentry.effective_at);

            var month = Utils.months[datetime.getMonth()-1];

            var time = Utils.getTime(datetime, false);

            var result = {
                id:journalentry.id,
                desc: journalentry.description,
                date: datetime.getDate()+" "+month+" "+datetime.getFullYear(),
                time: time,
                ref: journalentry.reference,
                accounts: this.prepareAccountsData(Journal_entry.all().get(journalid).book()).accounts,
                lines: Utils.parse(Journal_entry.all().get(journalid).lines()),
                book_id:book.id
            };

            //console.log("test data", result);

            return result;

        },
        prepareAccountsData: function(bookid, accounts, createBtn){

            var data = [];
            var accountsArray = Utils.parse(accounts);
            var _this = this;

            var createBtn = createBtn || false;
            //accountsArray.reverse();


            $.each(accountsArray, function(index, current){
                var balance = Utils.parse(Account.all().get(current.id).balance());


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
        getOneJournal: function(options, cb){
            console.log(Utils.parse(Journal_entry.all().get(options.id)));
            cb([Utils.parse(Journal_entry.all().get(options.id))]);
        },
        getOneAccount: function(options, cb){
            console.log(Utils.parse(Account.all().get(options.id)));
            cb([Utils.parse(Account.all().get(options.id))]);
        },
        loadnum:0,
        loadstatus:false,
        loadMoreJournals: function(book_id, $loadIcon, callback, lastid){
            var _this = this;
            var last_id = $("#content").find('article:last').attr('data-id');
            if(lastid !== undefined){
                last_id = lastid;
            }
            try{
                _this.DataStructure.getNextJournals({book: book_id, following:last_id},function(journals){
                    var parsedJournals = Utils.parse(journals);
                    if(parsedJournals !== null){
                        if(typeof parsedJournals[0] !== 'undefined'){
                            if(journals !== null && parsedJournals[0].id !== last_id ){
                                if($("#content").find('article[data-id="'+parsedJournals[0].id+'"]').length === 0 ){
                                    _this.DataStructure.getJournalsBalance({book: book_id, journals:journals},function(bookid){
                                        if($("#content").find('article[data-id="'+parsedJournals[0].id+'"]').length === 0 ){
                                            _this.Templates.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._draftJournals, _this.DataStructure.prepareJournalsEntryData(journals), true);
                                            //resetNav(e.currentTarget);
                                        }

                                        _this.DataStructure.loadnum++;
                                        if(_this.DataStructure.loadnum < 3){

                                            try{ _this.DataStructure.loadMoreJournals(book_id, $loadIcon, callback, parsedJournals[0].id ); } catch(err){ }

                                        } else {
                                            _this.DataStructure.loadnum = 0;
                                            _this.DataStructure.loadstatus = false;
                                            //$loadIcon.fadeOut(500);
                                        }
                                        try{ callback(book_id, Utils.parse(journals)[0].id); } catch(err){ }

                                    });
                                } else {
                                    try{ _this.DataStructure.loadMoreJournals(book_id, $loadIcon, callback, parsedJournals[0].id ); } catch(err){ }
                                }
                            }
                        }
                    }
                });
            } catch(e){}
        },
        loadMoreAccounts: function(book_id, $loadIcon, callback, lastid){
            var _this = this;
            var last_id = $("#content").find('article:last a').attr('data-id');
            if(lastid !== undefined){
                last_id = lastid;
            }
            try{
                _this.DataStructure.getNextAccounts({book: book_id, following:last_id},function(accounts){
                    var parsedAccounts = Utils.parse(accounts);
                    if(parsedAccounts !== null){
                        if(typeof parsedAccounts[0] !== 'undefined'){
                            if(accounts !== null && parsedAccounts[0].id !== last_id ){
                                if($("#content").find('article a[data-id="'+parsedAccounts[0].id+'"]').length === 0 ){
                                    _this.DataStructure.getAccountsBalance({book: book_id, accounts:accounts},function(bookid){
                                        if($("#content").find('article a[data-id="'+parsedAccounts[0].id+'"]').length === 0 ){
                                            _this.Templates.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._accounts, _this.DataStructure.prepareAccountsData(bookid, accounts), true);
                                            //resetNav(e.currentTarget);
                                        }

                                        _this.DataStructure.loadnum++;
                                        if(_this.DataStructure.loadnum < 3){

                                            try{ _this.DataStructure.loadMoreAccounts(book_id, $loadIcon, callback, parsedAccounts.id ); } catch(err){ }

                                        } else {
                                            _this.DataStructure.loadnum = 0;
                                            _this.DataStructure.loadstatus = false;
                                            //$loadIcon.fadeOut(500);
                                        }
                                        try{ callback(book_id, parsedAccounts[0].id); } catch(err){ }

                                    });
                                } else {
                                    try{ _this.DataStructure.loadMoreAccounts(book_id, $loadIcon, callback, parsedAccounts[0].id ); } catch(err){ }
                                }
                            }
                        }
                    }
                });
            } catch(e){}
        },
        fillJournals: function(book_id, journal){
            var _this = this;

                var offset = $("#content").find('article:last').offset();

                if($("#content").height() > offset.top){
                    _this.DataStructure.loadstatus = true;

                    _this.DataStructure.loadMoreJournals(book_id, $('.loadmore'), _this.DataStructure.fillJournals, journal);
                }

        },
        fillAccounts: function(book_id, account){
            var _this = this;

                var offset = $("#content").find('article:last').offset();

                if($("#content").height() > offset.top){
                    _this.DataStructure.loadstatus = true;

                    _this.DataStructure.loadMoreAccounts(book_id, $('.loadmore'), _this.DataStructure.fillJournals, account);
                }

        },
        createOrUpdate: function(Forms, $currentForm){
            var _this = this;
            var type = $currentForm.attr("data-type");
            var bookid = $currentForm.attr("data-book-id");
            var fields = Forms.serialize($currentForm);

            var valid = Forms.validateFields(fields);

            console.log("jsonify",Forms.jsonify(fields));

            console.log("is valid" , valid);
            if(valid){
                var data = Forms.jsonify(fields);
                var type = $currentForm.attr("data-type");

                var success = function(data){
                    console.log(type+" saved :", data);
                };

                //console.log("bookid",bookid, $currentForm);
                switch (type) {
                    case 'book':
                        console.log("*********************************");
                        console.log("********** SUBMIT BOOK **************");
                        console.log("*********************************");

                        _this.bookcollection.create(data, {wait:true, type:type, org_id:_this.org_id, api: _this.api, success: function(){ success(data); } });
                        break;
                    case 'account':
                        console.log("*********************************");
                        console.log("********** SUBMIT ACCOUNT **************");
                        console.log("*********************************");

                        _this.accountcollection.create(data, {wait:true, type:type, org_id:_this.org_id, book_id:bookid, api: _this.api, success: function(){ success(data); } });
                        break;
                    case 'journalentry':
                        console.log("*********************************");
                        console.log("********** SUBMIT JOURNAL **************");
                        console.log("*********************************");

                        _this.journal_entrycollection.create(data, {wait:true, type:type, org_id:_this.org_id, book_id:bookid, api: _this.api, success: function(){ success(data); } });
                        break;
                }

            }


            //console.log("created", Forms.serialize($currentForm, draft), options);

            //Forms.clearForm($currentForm, draft);

        }
    };

    return DataStructure;
});