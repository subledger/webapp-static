
//Author : Etienne Dion <dionetienne@gmail.com> September 2013

define([
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
    'hbs!template/settings'



], function ($, _, Backbone, async, Utils, DataStructure, AppEvents, Forms, precompile, JSON,
             Templates, headerTemplate, navTemplate, newBookTemplate, booksTemplate, newJournalTemplate, draftsJournalsTemplate, JournalTemplate, accountsTemplate, accountTemplate, newAccountTemplate, settingsTemplate ) {

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
            close: ".close"
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
            _settings: settingsTemplate
        },

        events: {
            'click .savenew':	'createOnSubmit'
        },

        initialize: function (options) {

            var _this = this;

            Forms.setSelector(this.formSelector);

            DataStructure.setRelations();
            Templates.prepareTemplate(_this, DataStructure);

            Templates.applyTemplate(_this.templateSelector.header, _this.templates._header, {username:fakedata.username, picture:fakedata.picture, id:fakedata.id});

            AppEvents.bind("ready", function(data){
                Templates.applyTemplate(_this.templateSelector.main, _this.templates._newJournal, data);
            });
            AppEvents.bind("navReady", function(nbOfJournals){
                Templates.applyTemplate(_this.templateSelector.nav, _this.templates._nav, {});
                _this.bindNav();
            } );

            AppEvents.trigger("navReady", {});

            AppEvents.trigger("ready", {});

            DataStructure.getInitialData();

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
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._newBook, {});
                    resetNav(e.currentTarget);
                } else if(action == 'books'){
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._books, DataStructure.prepareBooksData());
                    resetNav(e.currentTarget);
                } else if(action == 'newjournal'){
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._newJournal, DataStructure.prepareNewJournalOrAccount(fakedata.book_id));
                    resetNav(e.currentTarget);
                } else if(action == 'draftsjournals'){
                    // TODO remove fakedata
                    console.log(fakedata.book_id);
                    DataStructure.getJournalsBalance(fakedata.book_id,function(bookid){
                        Templates.applyTemplate(_this.templateSelector.main, _this.templates._draftJournals, DataStructure.prepareJournalsEntryData(bookid));
                        resetNav(e.currentTarget);
                    });
                } else if(action == 'newaccount'){
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._newAccount, DataStructure.prepareNewJournalOrAccount(fakedata.book_id));
                    resetNav(e.currentTarget);
                } else if(action == 'accounts'){
                    // TODO remove fakedata
                    DataStructure.getAccountsBalance(fakedata.book_id,function(bookid){
                        Templates.applyTemplate(_this.templateSelector.main, _this.templates._accounts, DataStructure.prepareAccountsData(bookid));
                        resetNav(e.currentTarget);
                    });

                } else if(action == 'settings'){
                    Templates.applyTemplate(_this.templateSelector.main, _this.templates._settings,  DataStructure.prepareSettingsData() );
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