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
        applyTemplate: function(selector, template, data){
            var _this = this;

            console.log("applyTemplate",selector, data);


            // TODO : Clean this ...
            $(selector).html(template(data));

            $(selector).find(".prettySelect").each(function(){
                $(this).Selectyze();
            });

            var now = new Date();


            var roundedTime = Utils.getTime(now, true);
            if($(selector).find('.btn.clock .time').val() === ""){
                $(selector).find('.btn.clock .time').attr("value", roundedTime );
                $(selector).find('.btn.clock span').text(roundedTime);
            }

            $(selector).find('.btn.clock').timepicker({
                'timeFormat': 'h : i A',
                'scrollDefaultNow': true //Set the scroll position to local time if no value selected.
            });

            $("body").on('click','.ui-timepicker-wrapper li', function(){
                $(selector).find('.btn.clock span').text($(this).text());
                $(selector).find('.btn.clock .time').attr("value", $(this).text() );
            });


            // Date picker
            $(selector).find(".date").datepicker({
                dateFormat: "d MM y",
                gotoCurrent: true,
                onSelect: function () {

                    $(selector).find(".btn.calendar span").text($(selector).find(".date").val());
                }
            });
            if( $(selector).find(".date").val() === ""){
                $(selector).find(".date").datepicker( "setDate", now );

                $(selector).find(".btn.calendar span").text($(selector).find(".date").val());
            }
            $(selector).find(".btn.calendar").click(function (e) {
                e.preventDefault();
                $(selector).find(".date").datepicker("show");
            });

            // Events
            $(selector).find('.btn, .action').on('click', function(e){
                e.preventDefault();


                var action = $(this).data('action'),
                    parent = $(this).parents('article');
                if(action == 'expand'){
                    //parent.toggleClass('close').toggleClass('open');
                    $('.model1', parent).slideUp();
                    $('.model2', parent).slideDown();
                } else if (action == 'delete'){
                    parent.remove();
                } else if (action == 'save'){
                    //parent.toggleClass('close').toggleClass('open');

                    _this.AppView.createOnSubmit(e);

                    $('.model1', parent).slideDown();
                    $('.model2', parent).slideUp();
                } else if (action == 'savenew'){

                    _this.AppView.createOnSubmit(e);

                } else if (action == 'close'){
                    //parent.toggleClass('close').toggleClass('open');
                    $('.model1', parent).slideDown();
                    $('.model2', parent).slideUp();
                } else if(action == 'journal'){

                    var journal_id = $(e.currentTarget).attr("data-id");

                    _this.DataStructure.getJournalLines(journal_id,function(journalid){
                        _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._journal, _this.DataStructure.prepareJournalEntryData(journalid));
                    });
                } else if(action == 'account') {
                    var account_id = $(e.currentTarget).attr("data-id");
                    _this.DataStructure.getAccountLines(account_id,function(account_id){
                        _this.applyTemplate(_this.AppView.templateSelector.main, _this.AppView.templates._account, _this.DataStructure.prepareAccountData(account_id));
                    });
                }
            });


            // Radio button
            $(selector).find('.radio').on('click', function(e){
                var myElm = $(this),
                    parent = myElm.parents('form');
                parent.find('.radio').removeClass('active');
                myElm.addClass('active');
            });


            //Add journal Entry
            $(selector).find('.addentry').on('click', function(e){
                var $template = $(selector).find('.entry.template').clone();
                $template.removeClass("template").addClass("newentry").css("border-top","1px solid #d4d4d4");
                $template.find(".DivSelectyze").remove();
                $(selector).find('.entry').last().after($template);
                $(selector).find(".newentry").find(".prettySelect").each(function(){
                    $(this).Selectyze();
                });
                $(selector).find(".newentry").removeClass("newentry");
            });



        }
    };



    return Template;
});