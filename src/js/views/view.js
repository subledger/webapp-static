
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
    'hbs!template/login',
    'hbs!template/source',
    'hbs!template/chart'

], function (Modernizr, $, _, Backbone, async, Utils, DataStructure, AppEvents, Forms, precompile, JSON,
             Templates, headerTemplate, navTemplate, newBookTemplate, booksTemplate, newJournalTemplate, draftsJournalsTemplate, JournalTemplate, accountsTemplate, accountTemplate, newAccountTemplate, settingsTemplate, loginTemplate, sourceTemplate, chartTemplate ) {

    'use strict';

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
            loginorg_id: "#org_id",
            version: ".version"
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
            _login: loginTemplate,
            _source: sourceTemplate,
            _chart: chartTemplate
        },


        startApp: function(settings){
            var _this = this;

            _this.settings = settings;

            localStorage.setItem("subledgerKey", _this.settings.key);
            localStorage.setItem("subledgerSecret", _this.settings.secret);
            localStorage.setItem("subledgerOrg", _this.settings.org);

            DataStructure.initApi(settings);
            DataStructure.clearData();
            DataStructure.setRelations(_this, Templates, Forms);

            $("body").removeClass("login");
            Templates.applyTemplate(_this.templateSelector.nav, null, "");
            Templates.applyTemplate(_this.templateSelector.main, null, "Loading...");

            Templates.applyTemplate(_this.templateSelector.header, _this.templates._header, {});

            AppEvents.bind("ready", function(){
                Templates.applyTemplate(_this.templateSelector.main, null, "");
            });
            AppEvents.bind("navReady", function(){
                Templates.applyTemplate(_this.templateSelector.nav, _this.templates._nav, DataStructure.prepareNavData());
                Templates.bindNav();
            });

            AppEvents.bind("nodata", function(message){
                Templates.applyTemplate(_this.templateSelector.main, null, message);
            });


            DataStructure.getInitialData();
        },
        login: function(){
            var _this = this;

            Forms.login(function(settings){
              //  console.log("start app");
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
            //DataStructure.setRelations(_this, Templates, Forms);

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



        }



    });

    return AppView;
});