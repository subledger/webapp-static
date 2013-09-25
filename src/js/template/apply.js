define([
    'jquery',
    'handlebars',
    'template/helpers/ifCond',
    'utils',
    'chart/chart',
    'selectyze',
    'jqueryui',
    'timepicker'
], function ($, Handlebars, ifCond, Utils, Chart) {
    var Template = {

        prepareTemplate: function(AppView, DataStructure){
            this.AppView = AppView;
            this.DataStructure = DataStructure;
        },
        bindTimePicker: function($selector){
            var now = new Date();

            var roundedTime = Utils.getTime(now, true);
            if($selector.find('.btn.clock .time').val() === ""){
                $selector.find('.btn.clock .time').attr("value", roundedTime );
                $selector.find('.btn.clock span').text(roundedTime);
            }

            $selector.find('.btn.clock').timepicker({
                'timeFormat': 'h : i A',
                'scrollDefaultNow': true //Set the scroll position to local time if no value selected.
            });

            $("body").on('click','.ui-timepicker-wrapper li', function(){
                $selector.find('.btn.clock span').text($(this).text());
                $selector.find('.btn.clock .time').attr("value", $(this).text() );
            });
        },
        bindDatePicker: function($selector){

            var now = new Date();

            // Date picker
            $selector.find(".date").datepicker({
                dateFormat: "d MM y",
                gotoCurrent: true,
                onSelect: function () {

                    $selector.find(".btn.calendar span").text($selector.find(".date").val());
                }
            });
            if( $selector.find(".date").val() === ""){
                $selector.find(".date").datepicker( "setDate", now );

                $selector.find(".btn.calendar span").text($selector.find(".date").val());
            }
            $selector.find(".btn.calendar").click(function (e) {
                e.preventDefault();
                $selector.find(".date").datepicker("show");
            });

        },
        bindPrettySelect: function($selector){
            var _this = this;

            $selector.find(".prettySelect").each(function(){
                $(this).Selectyze();
            });

            $selector.find(".book.prettySelect").change(function(){
                var book_id = $("select.book.prettySelect option:selected").attr("value");;

                switch(_this.AppView.currentPage){
                    case 'activity-stream':

                        _this.DataStructure.loadActivityStream(book_id);
                        break;
                    case 'accounts':

                        _this.DataStructure.loadAccounts(book_id);
                        break;
                    default:

                        _this.DataStructure.loadActivityStream(book_id);
                        break;
                }
            });



        },
        bindInfiniteScroll: function(firstLoad){
            var _this = this;

            var book_id = $("#sidebar").find("select.book").val();
            var type = $("#content").find('article:last').attr("data-action") || $("#content").find('article:last a').attr("data-action");

            if(type === "journal" || type === "account" ){

                if(firstLoad){
                    if(type === "journal"){
                        _this.DataStructure.fillJournals(book_id);
                    }
                    if(type === "account"){
                        _this.DataStructure.fillAccounts(book_id);
                    }

                    $("#content").unbind("scroll");
                    $("#content").scroll(function(){ // On surveille l'évènement scroll

                        //console.log("scroll");
                        var $last = $("#content").find('article:last');
                        if($last.length > 0){

                            var offset = $last.offset();
                            //console.log("scroll 2", offset, _this.DataStructure.loadstatus, offset.top-$("#content").height(),"<=", $("#content").scrollTop());
                            /* Si l'élément offset est en bas de scroll, si aucun chargement
                             n'est en cours, si le nombre de commentaire affiché est supérieur
                             à 5 et si tout les commentaires ne sont pas affichés, alors on
                             lance la fonction. */
                            if((offset.top-$("#content").height() <= $("#content").scrollTop())
                                && ($('article').size()>=4) ){

                                //console.log("scroll 3", _this.DataStructure.loadstatus, offset.top-$("#content").height(),"<=", $("#content").scrollTop());

                                _this.DataStructure.loadstatus = true;



                                if(type === "journal"){
                                    _this.DataStructure.fillJournals(book_id);
                                }
                                if(type === "account"){
                                    _this.DataStructure.fillAccounts(book_id);
                                }
                            }
                        }

                    });
                }

            }

        },
        bindTemplate: function($selector, fl){
            var _this = this;
            var firstLoad = false;
            if(fl !== undefined ){ firstLoad = fl; }

            _this.bindPrettySelect($selector);

            _this.bindTimePicker($selector);

            _this.bindDatePicker($selector);

            _this.bindEvents($selector);

            if($selector.selector === "#subledgerapp"){
                _this.bindInfiniteScroll(firstLoad);
            }


            //Add journal Entry
            /*
            $selector.find('.addentry').on('click', function(e){
                var $template = $selector.find('.entry.template').clone();
                $template.removeClass("template").addClass("newentry").css("border-top","1px solid #d4d4d4");
                $template.find(".DivSelectyze").remove();
                $selector.find('.entry').last().after($template);
                $selector.find(".newentry").find(".prettySelect").each(function(){
                    $(this).Selectyze();
                });
                $selector.find(".newentry").removeClass("newentry");
            });
              */

        },
        applyTemplate: function(selector, template, data, add, fl, unwrap, addOntop){
            var _this = this;

            //console.log("applyTemplate", selector, data, add, fl);
            var addToTemplate = false;
            if(add !== undefined ){ addToTemplate = add; }
            var firstLoad = false ;
            if(fl !== undefined && fl !== null ){ firstLoad = fl; }

            if(template !== null){
                if(addToTemplate){

                    var $partial = $("<div class='notbinded' style='display:none;'></div>").html(template(data));

                    if(addOntop !== undefined && addOntop !== null ){
                        $(selector +"."+data.layout+"-layout").find("article:not(.form):first").before($partial);
                    } else {
                        $(selector +"."+data.layout+"-layout").find("article:last").after($partial);
                    }

                    _this.bindTemplate($(selector+"."+data.layout+"-layout").find(".notbinded"));

                    $(selector+"."+data.layout+"-layout").find(".notbinded article[data-id]").each(function(){
                        var id = $(this).attr("data-id");
                        if($(selector+"."+data.layout+"-layout").find("article[data-id="+id+"]").length > 1){
                           // console.log("duplicate", id);
                            $(this).remove();
                        }

                    });

                    $(selector+"."+data.layout+"-layout").find(".notbinded article").css("display", "none");

                    $(selector+"."+data.layout+"-layout").find(".notbinded").css("display", "block");
                    $(selector+"."+data.layout+"-layout").find(".notbinded article").slideDown(400, function(){
                        $(selector+"."+data.layout+"-layout").find(".notbinded article").unwrap();
                    });
                    //$(selector+"."+data.layout+"-layout").find(".notbinded").remove();


                } else {
                    $(selector).html(template(data));
                    _this.bindTemplate($(selector), firstLoad);
                }

            } else {
                $(selector).html(data);
            }

            if(unwrap !== undefined && unwrap !== null){
                $(selector).find("article").unwrap(unwrap);
            }



        },
        bindEvents: function($selector){
            var _this = this;
            // Events
            $selector.find('.btn, .action').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();


                var id = $(e.currentTarget).parents("article").attr("data-id");
                var book_id = $(e.currentTarget).parents("article").attr("data-book-id") || $(e.currentTarget).attr("data-book-id");

                var journal_id = $(e.currentTarget).attr("data-id");
                var account_id = $(e.currentTarget).attr("data-id");
                var action = $(e.currentTarget).data('action');
                var $parent = $(e.currentTarget).parents('article');
                var type =  $parent.attr("data-type");

                //console.log("clicked", $(e.currentTarget), action);

                switch (action) {
                    case 'expand':
                        $('.model1', $parent).slideUp();
                        $('.model2', $parent).slideDown();
                        break;
                    case 'collapse':
                        $('.model2', $parent).slideUp();
                        $('.model1', $parent).slideDown();
                        break;
                    case 'save':
                        if(type === "settings"){
                            _this.AppView.login();
                        } else {
                            _this.DataStructure.createOrUpdate(e);
                            $('.model1', $parent).slideDown();
                            $('.model2', $parent).slideUp();
                        }
                        break;
                    case 'create':
                        _this.DataStructure.createOrUpdate(e);
                        break;
                    case 'close':
                        //parent.toggleClass('close').toggleClass('open');

                         if($(e.currentTarget).parents(".openJournal").length > 0){
                            // console.log("book_id", book_id, "id", journal_id, id);
                             DataStructure.getCurrentJournal({book: book_id, id:id},function(journals){
                                 //console.log("journals", journals);
                                 DataStructure.getJournalsBalance({book: book_id, journals: journals},function(bookid){
                                    _this.applyTemplate($(e.currentTarget).parents(".openJournal"), _this.AppView.templates._draftJournals, DataStructure.prepareJournalsEntryData(bookid, journals), false, false, ".openJournal");

                                 });
                             });
                         }


                         if($(e.currentTarget).parents(".openAccount").length > 0){
                             _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){
                                 _this.DataStructure.getAccountsBalance({book: book_id, accounts: accounts},function(bookid){
                                    _this.applyTemplate($(e.currentTarget).parents(".openAccount"), _this.AppView.templates._accounts, DataStructure.prepareAccountsData(bookid, accounts), false, false, ".openAccount");

                                 });
                             });
                         }

                        break;
                    case 'journal':

                         $(e.currentTarget).wrap("<div class='openJournal'></div>");
                         //console.log("book_id",book_id);

                         _this.DataStructure.getPostedJournalLines(book_id, journal_id,function(linesId){
                             _this.DataStructure.addAccountDataToJeLines(book_id, linesId, function(detailedlines){
                                 _this.applyTemplate($(e.currentTarget).parent(".openJournal"), _this.AppView.templates._journal, _this.DataStructure.prepareJournalEntryData(book_id, journal_id, detailedlines));

                             });
                         });

                        break;
                    case 'account':
                        $(e.currentTarget).parent("article").wrap("<div class='openAccount'></div>");

                        $(_this.AppView.templateSelector.loading).show();
                        _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){
                            _this.DataStructure.getAccountLines(book_id, account_id,function(account_id){
                                $(_this.AppView.templateSelector.loading).hide();
                                _this.applyTemplate($(e.currentTarget).parents(".openAccount"), _this.AppView.templates._account, _this.DataStructure.prepareAccountData(account_id));
                            });
                        });
                        break;
                    case 'accountfromjeline':
                        window.clearInterval(_this.DataStructure.journalInterval);
                        _this.applyTemplate(_this.AppView.templateSelector.main, null, "");
                        $(_this.AppView.templateSelector.loading).show();
                        book_id = $(e.currentTarget).attr("data-book-id");
                        account_id = $(e.currentTarget).attr("data-account-id");
                        _this.DataStructure.getAccountsBalance({book: book_id, accounts: [account_id]},function(bookid){
                            _this.DataStructure.getAccountLines(book_id, account_id,function(accountid){
                                $(_this.AppView.templateSelector.loading).hide();
                                _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._account, _this.DataStructure.prepareAccountData(account_id));
                            });
                        });

                        break;
                    case 'source':

                        window.clearInterval(_this.DataStructure.journalInterval);

                        _this.applyTemplate(_this.AppView.templateSelector.main, null, "");
                        $(_this.AppView.templateSelector.loading).show();
                        _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accountId){

                            journal_id = $(e.currentTarget).parents("tr").attr("data-journal-id");

                            _this.DataStructure.getOneJournal({book: book_id, current:journal_id},function(journalId){

                                _this.DataStructure.getJournalsBalance({book: book_id, journals:journalId},function(bookid){
                                    _this.DataStructure.getPostedJournalLines(book_id, journal_id,function(linesId){
                                        $(_this.AppView.templateSelector.loading).hide();
                                        _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._source, _this.DataStructure.prepareSourceData(book_id, accountId, journalId, linesId));
                                    });
                                });
                            });
                        });
                        break;
                    case 'chart':

                        window.clearInterval(_this.DataStructure.journalInterval);

                        account_id = $(e.currentTarget).attr("data-account-id");
                        _this.applyTemplate(_this.AppView.templateSelector.main, null, "");
                        $(_this.AppView.templateSelector.loading).show();
                        _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){
                            _this.DataStructure.getAccountLines(book_id, account_id,function(account_id){
                                $(_this.AppView.templateSelector.loading).hide();
                                _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._chart, _this.DataStructure.prepareAccountData(account_id));
                                Chart.init(_this.DataStructure.prepareAccountData(account_id), book_id, account_id, _this.DataStructure, _this.AppView);
                            });
                        });
                        break;
                    case 'sourcefromchart':

                        window.clearInterval(_this.DataStructure.journalInterval);

                        account_id = $(e.currentTarget).attr("data-account-id");
                        _this.applyTemplate(_this.AppView.templateSelector.main, null, "");
                        $(_this.AppView.templateSelector.loading).show();
                        _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){
                            _this.DataStructure.getAccountLines(book_id, account_id,function(account_id){
                                $(_this.AppView.templateSelector.loading).hide();
                                _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._account, _this.DataStructure.prepareAccountData(account_id));
                            });
                        });
                        break;
                    case 'login':
                        window.clearInterval(_this.DataStructure.journalInterval);

                        _this.AppView.login();
                        break;
                    case 'logout':
                        window.clearInterval(_this.DataStructure.journalInterval);

                        _this.AppView.logout();
                        break;
                }

            });
        },
        setNavActiveItem: function(action){
            var _this = this;
            $(_this.AppView.templateSelector.nav).find(".active").removeClass("active");
            if(action !== undefined){
                $(_this.AppView.templateSelector.nav).find("a[data-action="+action+"]").parent("li").addClass("active");
            }
            _this.AppView.currentPage = action;
        },
        bindNav: function(){
            var _this = this;

            $('.btn, .action').on('click', function(e){
                e.preventDefault();

                var action = $(this).data('action');
                var book_id = $(_this.AppView.templateSelector.nav).find("select.book").val();
                switch (action) {
                    case 'activity-stream':
                        window.clearInterval(_this.DataStructure.journalInterval);
                        _this.DataStructure.loadActivityStream(book_id);
                        break;
                    case 'accounts':
                        window.clearInterval(_this.DataStructure.journalInterval);
                        _this.DataStructure.loadAccounts(book_id);
                        break;
                    case 'settings':
                        window.clearInterval(_this.DataStructure.journalInterval);
                        _this.DataStructure.showSettings();
                        break;
                }
            });
        }
    };



    return Template;
});