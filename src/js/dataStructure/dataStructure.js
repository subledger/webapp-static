
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

    'models/org',
    'models/book',
    'models/account',
    'models/journal_entry',
    'models/balanceaccount',
    'models/balancejournal',
    'models/journal_entryline',
    'models/account_line'

], function ($, _, Backbone, async, Utils, AppEvents,
             IdentityCollection, OrgCollection, BookCollection, AccountCollection, Journal_entryCollection, BalanceAccountCollection, BalanceJournalCollection, Journal_entrylineCollection, Account_lineCollection,
             Org, Book, Account, Journal_entry, BalanceAccount, BalanceJournal, Journal_entryline, Account_line){

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

        setRelations: function(){
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
        identityFetch: function(cb){
            this.identitycollection.fetch({
                type:"identity",
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
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    console.log("bookcollection error",error);
                    cb(error, null);
                }
            });
        },
        accountFetch: function(org_id, book_id, cb){
            this.accountcollection.fetch({
                type:"account",
                org_id: org_id,
                book_id: book_id,
                success: function(resp) {

                    cb(null, resp);
                },
                error: function(error) {
                    console.log("accountcollection error",error);
                    cb(error);
                }
            });
        },
        journalentryFetch: function(org_id, book_id, cb){
            this.journal_entrycollection.fetch({
                type:"journalentry",
                org_id: org_id,
                book_id: book_id,
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
                    console.log("*********************************");

                    _this.bookFetch(_this.org_id, cb);

                },
                function(cb){

                    async.parallel({
                        account: function(callback){
                            var count = 0;

                            console.log("*********************************");
                            console.log("********** GET ACCOUNTS **************");
                            console.log("*********************************");
                            console.log("*********************************");

                            async.whilst(
                                function () { return count < _this.bookcollection.models.length; },
                                function (iteratorcallback) {

                                    var index = count;

                                    _this.accountFetch(_this.org_id, _this.bookcollection.models[index].id, iteratorcallback);

                                    count++;
                                },
                                function (err) {
                                    console.log("err", err);
                                    callback(err, null);
                                }
                            );
                        },
                        journalentry: function(callback2){
                            var count = 0;

                            console.log("*********************************");
                            console.log("********** GET JOURNAL ENTRIES **************");
                            console.log("*********************************");
                            console.log("*********************************");

                            async.whilst(
                                function () { return count < _this.bookcollection.models.length; },
                                function (iteratorcallback) {

                                    var index = count;

                                    _this.journalentryFetch(_this.org_id, _this.bookcollection.models[index].id, iteratorcallback);

                                    count++;
                                },
                                function (err) {

                                    callback2(err, null);
                                }
                            );
                        }
                    },
                    function(err, results) {
                        console.log("err", err);
                        cb(err, results);


                    });

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
        getAccountsBalance: function(book_id, cb){
            var _this = this;
            var count = 0;

            console.log("*********************************");
            console.log("********** GET ACCOUNTS BALANCE **************");
            console.log("*********************************");
            console.log("*********************************");

            var accounts;

            if(book_id === undefined){
                accounts = Utils.parse(Account.all());
            } else {
                accounts = Utils.parse(Book.all().get(book_id).accounts());
            }

            async.whilst(
                function () { return count < accounts.length; },
                function (itcallback) {

                    console.log("Fetch Account balance");
                    var index = count;

                    _this.balanceAccountsFetch(_this.org_id, book_id, accounts[index].id, itcallback);

                    count++;

                }, function (err, result) {
                    cb(book_id);
                }
            );
        },
        getJournalsBalance: function(book_id, cb){
            var _this = this;
            var count = 0;

            console.log("*********************************");
            console.log("********** GET JOURNALS BALANCE **************");
            console.log("*********************************");
            console.log("*********************************");

            var journal_entries;

            if(book_id === undefined){
                journal_entries = Utils.parse(Journal_entry.all());
            } else {
                journal_entries = Utils.parse(Book.all().get(book_id).journal_entries());
            }

            console.log("journal_entries",journal_entries);

            async.whilst(
                function () { return count < journal_entries.length; },
                function (itcallback) {

                    console.log("Fetch Journal balance");
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
            console.log("*********************************");

            var book_id = Utils.parse(Journal_entry.all().get(journal_id).book()).id;

            console.log("GET JOURNALS LINES ",  book_id, journal_id);
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
            console.log("*********************************");

            var book_id = Utils.parse(Account.all().get(account_id).book()).id;

            console.log("GET ACCOUNT LINES ",  book_id, account_id);
            var callback = function(){
                cb(account_id);
            };

            this.accountLinesFetch(this.org_id, book_id, account_id, callback);

        },
        prepareSettingsData: function(){
            return fakedata;

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
                console.log(current, book[index]);
            });

            var result = { books : data, accounts: _this.prepareAccountsData(bookid).accounts };

            return result;
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
                console.log(current, book[index]);
            });

            var result = { books : data };

            console.log("test data", result);

            return result;

        },
        prepareJournalsEntryData: function(bookid){

            var data = [];
            var journalentry;
            var _this = this;

            if(bookid === undefined){
                journalentry = Utils.parse(Journal_entry.all());
            } else {
                journalentry = Utils.parse(Book.all().get(bookid).journal_entries());
            }

            $.each(journalentry, function(index, current){
                var datetime = new Date(current.effective_at);

                var month = Utils.months[datetime.getMonth()-1];

                var time = Utils.getTime(datetime, false);

                var balance = Utils.parse(Journal_entry.all().get(current.id).balance());

                var partial = {
                    id:current.id,
                    desc: current.description,
                    date: datetime.getDate()+" "+month+" "+datetime.getFullYear(),
                    time: time,
                    ref: current.reference,
                    balance: balance[0],
                    accounts: _this.prepareAccountsData(bookid).accounts
                }
                data.push(partial);
                console.log(current, journalentry[index]);
            });

            var result = { journalEntries : data };

            console.log("test data", result);

            return result;
        },
        prepareJournalEntryData: function(journalid){

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
                accounts: this.prepareAccountsData(Journal_entry.all().get(journalid).book()).accounts,
                lines: Utils.parse(Journal_entry.all().get(journalid).lines())
            };

            console.log("test data", result);

            return result;

        },
        prepareAccountsData: function(bookid){
            var data = [];
            var accounts;

            if(bookid === undefined){
                accounts = Utils.parse(Account.all());
            } else {
                accounts = Utils.parse(Book.all().get(bookid).accounts());
            }

            $.each(accounts, function(index, current){
                var balance = Utils.parse(Account.all().get(current.id).balance());
                var partial = {
                    id: current.id,
                    desc: current.description,
                    normal_balance: current.normal_balance,
                    balance: balance[0]
                }
                data.push(partial);

            });


            var result = { accounts : data };
            console.log("ACCOUNTS ",result);
            return result;
        },
        prepareAccountData: function(accountid){

            var account = Utils.parse(Account.all().get(accountid));

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
                lines: datedlines
            };

            console.log("test data", result);

            return result;

        },
        createOrUpdate: function(Forms, $currentForm){
            var _this = this;
            var type = $currentForm.attr("data-type");


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

                switch (type) {
                    case 'book':
                        console.log("*********************************");
                        console.log("********** SUBMIT BOOK **************");
                        console.log("*********************************");
                        console.log("*********************************");

                        _this.bookcollection.create(data, {wait:true, type:type, org_id:_this.org_id, success: function(){ success(data); } });
                        break;
                    case 'account':
                        console.log("*********************************");
                        console.log("********** SUBMIT ACCOUNT **************");
                        console.log("*********************************");
                        console.log("*********************************");

                        _this.accountcollection.create(data, {wait:true, type:type, org_id:_this.org_id, book_id:data.book, success: function(){ success(data); } });
                        break;
                    case 'journalentry':
                        console.log("*********************************");
                        console.log("********** SUBMIT JOURNAL **************");
                        console.log("*********************************");
                        console.log("*********************************");

                        _this.journal_entrycollection.create(data, {wait:true, type:type, org_id:_this.org_id, book_id:data.book, success: function(){ success(data); } });
                        break;
                }



            }




            //console.log("created", Forms.serialize($currentForm, draft), options);

            //Forms.clearForm($currentForm, draft);

        }
    };

    return DataStructure;
});