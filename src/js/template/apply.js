define([
    'jquery',
    'handlebars',
    'template/helpers/ifCond',
    'utils',
    'selectyze',
    'jqueryui',
    'timepicker'
], function ($, Handlebars, ifCond, Utils) {
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
            $selector.find(".prettySelect").each(function(){
                $(this).Selectyze();
            });
        },
        bindInfiniteScroll: function(firstLoad){
            var _this = this;

            var book_id = $("#sidebar").find("select.book").val();
            var load = false;


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

                        var $last = $("#content").find('article:last');
                        if($last.length > 0){
                            var offset = $last.offset();
                            /* Si l'élément offset est en bas de scroll, si aucun chargement
                             n'est en cours, si le nombre de commentaire affiché est supérieur
                             à 5 et si tout les commentaires ne sont pas affichés, alors on
                             lance la fonction. */
                            if((offset.top-$("#content").height() <= $("#content").scrollTop())
                                && _this.DataStructure.loadstatus==false && ($('article').size()>=4) ){

                                // la valeur passe à vrai, on va charger
                                _this.DataStructure.loadstatus = true;

                                //On affiche un loader
                                $('.loadmore').show();

                                if(type === "journal"){
                                    _this.DataStructure.fillJournals(book_id);
                                }
                                if(type === "account"){
                                    _this.DataStructure.fillAccounts(book_id);
                                }

                            }
                        } else {

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
            if($selector.selector === "#subledgerapp"){
                _this.bindInfiniteScroll(firstLoad);
            }

        },
        applyTemplate: function(selector, template, data, add, fl, unwrap){
            var _this = this;

            console.log("applyTemplate", selector, data, add, fl);
            var addToTemplate = false;
            if(add !== undefined ){ addToTemplate = add; }
            var firstLoad = false ;
            if(fl !== undefined ){ firstLoad = fl; }

            if(template !== null){
                if(addToTemplate){

                    var $partial = $("<div class='notbinded'></div>").html(template(data));

                    $(selector +"."+data.layout+"-layout").find("article:last").after($partial);

                    _this.bindTemplate($(selector+"."+data.layout+"-layout").find(".notbinded"));
                    $(selector+"."+data.layout+"-layout").find(".notbinded article").unwrap();

                } else {
                    $(selector).html(template(data));
                    _this.bindTemplate($(selector), firstLoad);
                }

            } else {
                $(selector).html(data);
            }

            if(unwrap !== undefined){
                $(selector).find("article").unwrap(unwrap);
            }



        },
        bindEvents: function($selector){
            var _this = this;
            // Events
            $selector.find('.btn, .action').on('click', function(e){
                e.preventDefault();

                var id = $(e.currentTarget).parents("article").attr("data-id");
                var book_id = $(e.currentTarget).parents("article").attr("data-book-id") || $(e.currentTarget).attr("data-book-id");

                var journal_id = $(e.currentTarget).attr("data-id");
                var account_id = $(e.currentTarget).attr("data-id");
                var action = $(e.currentTarget).data('action');
                var $parent = $(e.currentTarget).parents('article');
                var type =  $parent.attr("data-type");

                if(action == 'expand'){
                    //parent.toggleClass('close').toggleClass('open');
                    $('.model1', $parent).slideUp();
                    $('.model2', $parent).slideDown();

                } else if (action == 'collapse'){
                    $('.model2', $parent).slideUp();
                    $('.model1', $parent).slideDown();
                } else if (action == 'save'){

                    if(type === "settings"){
                        _this.AppView.login();
                    } else {
                        _this.DataStructure.createOrUpdate(e);
                        $('.model1', $parent).slideDown();
                        $('.model2', $parent).slideUp();
                    }

                } else if (action == 'create'){
                    console.log($parent);
                    _this.DataStructure.createOrUpdate(e);

                } else if (action == 'close'){
                    //parent.toggleClass('close').toggleClass('open');

                    /*
                    console.log("close", id, book_id);

                    if($(e.currentTarget).parents(".openJournal").length > 0){
                        DataStructure.getCurrentJournal({book: book_id, id:id},function(journals){
                            DataStructure.getJournalsBalance({book: book_id, journals: journals},function(bookid){
                                _this.applyTemplate($(e.currentTarget).parents(".openJournal"), _this.AppView.templates._draftJournals, DataStructure.prepareJournalsEntryData(book_id, journals), false, false, ".openJournal");

                            });
                        });
                    }
                     */
                    if($(e.currentTarget).parents(".openAccount").length > 0){
                        _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){
                            _this.DataStructure.getAccountsBalance({book: book_id, accounts: accounts},function(bookid){
                                _this.applyTemplate($(e.currentTarget).parents(".openAccount"), _this.AppView.templates._accounts, DataStructure.prepareAccountsData(bookid, accounts), false, false, ".openAccount");

                            });
                        });
                    }




                } else if(action == 'journal'){

                    /*
                    $(e.currentTarget).wrap("<div class='openJournal'></div>");
                    console.log("book_id",book_id);
                    _this.DataStructure.getAllAccounts({book: book_id},function(accounts){
                        _this.DataStructure.getJournalLines(journal_id,function(journalid){
                            _this.applyTemplate($(e.currentTarget).parent(".openJournal"), _this.AppView.templates._journal, _this.DataStructure.prepareJournalEntryData(journalid, accounts));
                        });
                    });
                    */

                } else if(action == 'account') {

                    $(e.currentTarget).parent("article").wrap("<div class='openAccount'></div>");
                    _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){
                        _this.DataStructure.getAccountLines(account_id,function(account_id){
                            _this.applyTemplate($(e.currentTarget).parents(".openAccount"), _this.AppView.templates._account, _this.DataStructure.prepareAccountData(account_id));
                        });
                    });
                } else if(action == 'source') {
                    console.log({book: book_id, id:id});
                    _this.DataStructure.getCurrentAccount({book: book_id, id:id},function(accounts){

                        journal_id = $(e.currentTarget).parents("tr").attr("data-journal-id");

                        _this.DataStructure.getOneJournal({book: book_id, current:journal_id},function(journal){

                            _this.DataStructure.getJournalsBalance({book: book_id, journals:journal},function(bookid){
                                _this.DataStructure.getPostedJournalLines(book_id, journal_id,function(lines){

                                    _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._source, _this.DataStructure.prepareSourceData(accounts, journal, lines));
                                });
                            });
                        });
                    });
                } else if(action == 'login') {
                    _this.AppView.login();
                } else if(action == 'logout') {
                    _this.AppView.logout();
                }
            });
        }
    };



    return Template;
});