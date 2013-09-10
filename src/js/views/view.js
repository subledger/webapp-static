
//Author : Etienne Dion <dionetienne@gmail.com> September 2013

define([
    'modernizr',
    'jquery',
    'underscore',
    'backbone',
    'async',
    'utils',
    'dataStructure',
    'events',
    'forms',
    'i18nprecompile',
    'json2',

    'applytemplates',
    'hbs!template/layout/header',
    'hbs!template/layout/nav',
    'hbs!template/newbook',
    'hbs!template/books',
    'hbs!template/newjournal',
    'hbs!template/draftsjournal',
    'hbs!template/journal',
    'hbs!template/accounts',
    'hbs!template/account',
    'hbs!template/newaccount',
    'hbs!template/settings',
    'hbs!template/login'

], function (Modernizr, $, _, Backbone, async, Utils, DataStructure, AppEvents, Forms, precompile, JSON,
             Templates, headerTemplate, navTemplate, newBookTemplate, booksTemplate, newJournalTemplate, draftsJournalsTemplate, JournalTemplate, accountsTemplate, accountTemplate, newAccountTemplate, settingsTemplate, loginTemplate ) {

    'use strict';

    var fakedata = {
        username:'Dan Murphy',
        picture:'img/tmp/profile.jpg',
        id:'12345678',
        key: "q94AwWLKow837L2AidxX15",
        secret: "gbw1tb0KTvGTYmqnWUbF01",
        org_id: "TnmilrLvIQvIk6FaI0Ldb2",
        book_id: "bXVL7VqEfub7ihoGZDe017"
    };

    var AppView = Backbone.View.extend({

        el: '#subledgerapp',

        templateSelector: {
            header:"#header",
            nav:"#sidebar",
            main: "#subledgerapp"
        },
        formSelector:{
            form: ".form",
            book: ".book",
            date: ".date",
            time: ".time",
            desc: ".desc",
            ref: ".ref",
            balance: ".bal",
            entry: ".entry",
            entryAccount: ".entryAccount",
            entryDesc: ".entryDesc",
            entryRef: ".entryRef",
            entryDebit: ".entryDebit",
            entryCredit: ".entryCredit",
            cancel: ".cancel",
            savenew: ".savenew",
            close: ".close",
            loginkey: "#key_id",
            loginsecret: "#secret",
            loginorg_id: "#org_id"
        },
        // Compile our stats template
        templates:{
            _header: headerTemplate,
            _nav: navTemplate,
            _newBook: newBookTemplate,
            _books: booksTemplate,
            _newJournal: newJournalTemplate,
            _draftJournals: draftsJournalsTemplate,
            _journal: JournalTemplate,
            _accounts: accountsTemplate,
            _account: accountTemplate,
            _newAccount: newAccountTemplate,
            _settings: settingsTemplate,
            _login: loginTemplate
        },

        events: {
            'click .savenew':	'createOnSubmit'
        },
        startApp: function(settings){
            var _this = this;

            _this.settings = settings;

            localStorage.setItem("subledgerKey", _this.settings.key);
            localStorage.setItem("subledgerSecret", _this.settings.secret);
            localStorage.setItem("subledgerOrg", _this.settings.org);

            DataStructure.initApi(settings);
            DataStructure.clearData();
            DataStructure.setRelations(_this, Templates);

            $("body").removeClass("login");
            Templates.applyTemplate(_this.templateSelector.nav, null, "");
            Templates.applyTemplate(_this.templateSelector.main, null, "Loading...");

            Templates.applyTemplate(_this.templateSelector.header, _this.templates._header, {});

            AppEvents.bind("ready", function(){
                Templates.applyTemplate(_this.templateSelector.main, null, "");
            });
            AppEvents.bind("navReady", function(){
                Templates.applyTemplate(_this.templateSelector.nav, _this.templates._nav, DataStructure.prepareNavData());
                _this.bindNav();
            });

            AppEvents.bind("nodata", function(message){
                Templates.applyTemplate(_this.templateSelector.main, null, message);
            });


            DataStructure.getInitialData();
        },
        login: function(){
            var _this = this;

            Forms.login(function(settings){
                console.log("start app");
                _this.startApp(settings);
            });
        },
        logout: function(){
            var _this = this;
            localStorage.clear();
            window.location.href = window.location;
        },
        initialize: function (options) {

            var _this = this;
            var settings;
            DataStructure.setRelations(_this, Templates);

            Templates.prepareTemplate(_this, DataStructure);

            Forms.setSelector(this.formSelector);


            if (Modernizr.localstorage) {
                if (localStorage.subledgerKey && localStorage.subledgerSecret && localStorage.subledgerOrg){
                    settings = {
                        key: localStorage.subledgerKey,
                        secret: localStorage.subledgerSecret,
                        org: localStorage.subledgerOrg
                    };
                    _this.startApp(settings);

                } else {
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._login, {});
                }

            } else {
               alert("Your browser is too old. You will need to upgrade.");
            }



        },

        bindNav: function(){
            var _this = this;



            $('.btn, .action').on('click', function(e){
                e.preventDefault();

                var resetNav = function(current){
                    $(current).parents("ul").find(".active").removeClass("active");
                    $(current).parent("li").addClass("active");
                }

                var action = $(this).data('action');
                if(action == 'newbook'){
                    $(_this.templateSelector.main).removeClass("accounts-layout").removeClass("journals-layout");
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._newBook, {});
                    resetNav(e.currentTarget);
                } else if(action == 'books'){
                    $(_this.templateSelector.main).removeClass("accounts-layout").removeClass("journals-layout");
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._books, DataStructure.prepareBooksData());
                    resetNav(e.currentTarget);
                } else if (action == 'newjournal'){
                    $(_this.templateSelector.main).removeClass("accounts-layout").removeClass("journals-layout");
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._newJournal, DataStructure.prepareNewJournalOrAccount(fakedata.book_id));
                    resetNav(e.currentTarget);
                } else if(action == 'activity-stream'){

                    $(_this.templateSelector.main).removeClass("accounts-layout").addClass("journals-layout");
                    var book_id = $(_this.templateSelector.nav).find("select.book").val();
                    DataStructure.getNextJournals({book: book_id},function(journals){
                        DataStructure.getJournalsBalance({book: book_id, journals: journals},function(bookid){
                            Templates.applyTemplate(_this.templateSelector.main, _this.templates._draftJournals, DataStructure.prepareJournalsEntryData(journals, true), false, true);
                            resetNav(e.currentTarget);
                        });
                    });


                } else if(action == 'newaccount'){
                    $(_this.templateSelector.main).removeClass("accounts-layout").removeClass("journals-layout");
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._newAccount, DataStructure.prepareNewJournalOrAccount(fakedata.book_id));
                    resetNav(e.currentTarget);
                } else if(action == 'accounts'){

                    $(_this.templateSelector.main).removeClass("journals-layout").addClass("accounts-layout");
                    var book_id = $(_this.templateSelector.nav).find("select.book").val();
                    DataStructure.getNextAccounts({book: book_id},function(accounts){
                        DataStructure.getAccountsBalance({book: book_id, accounts: accounts},function(bookid){
                            Templates.applyTemplate(_this.templateSelector.main, _this.templates._accounts, DataStructure.prepareAccountsData(bookid, accounts, true), false, true);
                            resetNav(e.currentTarget);
                        });
                    });

                } else if(action == 'settings'){
                    $(_this.templateSelector.main).removeClass("accounts-layout").removeClass("journals-layout");
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._settings,  DataStructure.prepareSettingsData(_this.settings) );
                    resetNav();
                }
            });
        },

        createOnSubmit: function (el) {
            console.log("click",el, el.currentTarget);
            var $currentForm = $(el.currentTarget).parents(this.formSelector.form);

            DataStructure.createOrUpdate(Forms, $currentForm);

        }

    });

    return AppView;
});