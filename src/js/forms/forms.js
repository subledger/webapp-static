
define([
    'jquery',
    'utils'
], function ($, Utils) {
    var Forms = {
        setSelector: function(selectors){
            this.formSelector = selectors;
        },
        login: function(cb){
            var key = $(this.formSelector.loginkey).val();
            var secret = $(this.formSelector.loginsecret).val();
            var org = $(this.formSelector.loginorg_id).val();
            var valid = true;

            $(this.formSelector.loginorg_id).removeClass("error").next(".errorMessage").remove();
            $(this.formSelector.loginsecret).removeClass("error").next(".errorMessage").remove();
            $(this.formSelector.loginorg_id).removeClass("error").next(".errorMessage").remove();
            if(!Utils.isNotEmpty(key)){
                valid = false;
                $(this.formSelector.loginkey).addClass("error").after("<div class='errorMessage'>Please enter a valid Key ID</div>");
            }
            if(!Utils.isNotEmpty(secret)){
                valid = false;
                $(this.formSelector.loginsecret).addClass("error").after("<div class='errorMessage'>Please enter a valid Secret</div>");
            }
            if(!Utils.isNotEmpty(org)){
                valid = false;
                $(this.formSelector.loginorg_id).addClass("error").after("<div class='errorMessage'>Please enter a valid Organisation ID</div>");
            }

            if(valid){

                var settings = {
                    key:key,
                    secret:secret,
                    org:org
                };

                cb(settings);
            }
        },
        serialize: function ($currentForm) {

            var fields = [];


            if($currentForm.find(this.formSelector.desc).length > 0){
                fields.push({name:"desc", field: $currentForm.find(this.formSelector.desc), validation: "text", value:$currentForm.find(this.formSelector.desc).val()});
            }

            if($currentForm.find(this.formSelector.ref).length > 0){
                fields.push({name:"ref", field: $currentForm.find(this.formSelector.ref), validation: "url", value:$currentForm.find(this.formSelector.ref).val()});
            }

            if($currentForm.find(this.formSelector.date).length > 0){
                fields.push({name:"date", field: $currentForm.find(this.formSelector.date), validation: "date", value:$currentForm.find(this.formSelector.date).val()});
            }

            if($currentForm.find(this.formSelector.time).length > 0){
                fields.push({name:"time", field: $currentForm.find(this.formSelector.time), validation: "time", value:$currentForm.find(this.formSelector.time).val()});
            }

            if($currentForm.find(this.formSelector.balance).length > 0){
                fields.push({name:"balance", field: $currentForm.find(this.formSelector.balance), validation: "balance", value:$currentForm.find(this.formSelector.balance).val()});
            }
            if($currentForm.find(this.formSelector.version).length > 0){
                fields.push({name:"version", field: $currentForm.find(this.formSelector.version), validation: "none", value:$currentForm.find(this.formSelector.version).val()});
            }

            var entry = [];
            if($currentForm.find(this.formSelector.entry).length > 0){

                var _this = this;
                $currentForm.find(this.formSelector.entry).each(function(){

                    if($(this).hasClass("exist") || $(this).find(_this.formSelector.entryAccount).val() !== "" || $(this).find(_this.formSelector.entryDesc).val() !== "" || $(this).find(_this.formSelector.entryRef).val() !== "" || $(this).find(_this.formSelector.entryDebit).val() !== "" || $(this).find(_this.formSelector.entryCredit).val() !== "" ){


                        var entryfields = [];
                        entryfields.push({name:"entryaccount", field: $(this).find(_this.formSelector.entryAccount), validation: "text", value: $(this).find(_this.formSelector.entryAccount).val()});
                        entryfields.push({name:"entrydesc", field: $(this).find(_this.formSelector.entryDesc), validation: "text", value: $(this).find(_this.formSelector.entryDesc).val()});
                        entryfields.push({name:"entryref", field: $(this).find(_this.formSelector.entryRef), validation: "url", value: $(this).find(_this.formSelector.entryRef).val()});

                        $(this).find(_this.formSelector.entryDebit).val($(this).find(_this.formSelector.entryDebit).val().replace(",","."));
                        $(this).find(_this.formSelector.entryCredit).val($(this).find(_this.formSelector.entryCredit).val().replace(",","."));

                        entryfields.push({name:"entrydebit", field: [$(this).find(_this.formSelector.entryDebit), $(this).find(_this.formSelector.entryCredit)], validation: "onlyonefloat", onlyone: true, value: [$(this).find(_this.formSelector.entryDebit).val(), $(this).find(_this.formSelector.entryCredit).val()]});


                        entry.push({ name: "entry", fields:  entryfields, exist:$(this).hasClass("exist") });
                    }
                });

            }

            return {fields:fields , entryfields:entry};
        },
        jsonify: function (fields) {

            var object = {};
            var date = {};

            $.each(fields.fields, function(index, current){

                if(current.name === "desc"){
                    object["description"] = current.value;
                }
                if(current.name === "ref"){
                    object["reference"] = current.value;
                }
                if(current.name === "date" ){
                    date["date"] = current.value;
                }
                if(current.name === "time" ){
                    date["time"] = current.value;
                }
                if(current.name === "balance" ){
                    object["normal_balance"] = current.value;
                }
                if(current.name === "version" ){
                    object["version"] = current.value;
                }

            });

            if(date["date"] !== undefined){
                object["effective_at"] =  Utils.convertDateTime(date["date"], date["time"]);
            }

            if(fields.entryfields !== undefined){
                var lines = [];
                $.each(fields.entryfields, function(index, current){
                    // entryline
                    var line = {};

                    $.each(current.fields, function(index2, current2){


                        if(current2.name === "entryaccount"){
                            line["account"] = current2.value;
                        }

                        if(current2.name === "entrydesc"){
                            line["description"] = current2.value;
                        }
                        if(current2.name === "entryref"){
                            line["reference"] = current2.value;
                        }


                        if(current2.name === "entrydebit"){
                            var value = {};
                            if( current2.value[0] !== "" && current2.value[0] !== "0" ){
                                value["type"] = "debit";
                                value["amount"] = parseFloat(current2.value[0]);
                            } else {
                                value["type"] = "credit";
                                value["amount"] = parseFloat(current2.value[1]);
                            }
                            line["value"] = value;
                        }
                    });

                    lines.push(line);
                });

                object["lines"] = lines;

            }

            return object;
        },
        validateFields: function (action, fields) {
            var valid = true;

            var validate = function(current){
                switch (current.validation) {
                    case 'text':
                        if(!Utils.isNotEmpty(current.value)){
                            valid = false;
                            $(current.field).addClass("error").after("<div class='errorMessage'>Please enter a valid "+current.name+"</div>");
                        }
                        break;
                    case 'url':
                        if(!Utils.isNotEmpty(current.value)){
                            valid = false;
                            $(current.field).addClass("error").after("<div class='errorMessage'>Please enter a valid "+current.name+"</div>");
                        } else {
                            if(Utils.isUrl(current.value)){
                                valid = false;
                                $(current.field).addClass("error").after("<div class='errorMessage'>This field is invalid, it must be an valid URL</div>");
                            }
                        }
                        break;
                    case 'date':
                        if(!Utils.isNotEmpty(current.value)){
                            valid = false;
                            $(current.field).next(".calendar").addClass("error").after("<div class='errorMessage'>Please enter a valid "+current.name+"</div>");
                        }
                        break;
                    case 'time':
                        if(!Utils.isNotEmpty(current.value)){
                            valid = false;
                            $(current.field).parent(".btn").addClass("error").after("<div class='errorMessage'>Please enter a valid "+current.name+"</div>");
                        }
                        break;
                    case 'balance':
                        if(!Utils.isNotEmpty(current.value) && !( current.value === "debit" || current.value === "credit")){
                            valid = false;
                            $(current.field).next(".DivSelectyze").addClass("error").after("<div class='errorMessage'>Please select a "+current.name+"</div>");
                        }
                        break;
                    case 'onlyonefloat':
                        $(current.field[0]).removeClass("error");
                        $(current.field[0]).next(".errorMessage").remove();
                        $(current.field[1]).removeClass("error");
                        $(current.field[1]).next(".errorMessage").remove();

                        if( !( current.value[0] === "" || current.value[0] === "0") && !( current.value[1] === "" || current.value[1] === "0") ){
                            valid = false;
                            $(current.field[0]).addClass("error").after("<div class='errorMessage'>Only one of the Debit or Credit Fields can be submit on a entry line.</div>");
                        } else if( ( current.value[0] === "" || current.value[0] === "0") && ( current.value[1] === "" || current.value[1] === "0") ){
                            valid = false;
                            $(current.field[0]).addClass("error").after("<div class='errorMessage'>One of the Debit or Credit Fields must be submit on a entry line.</div>");
                        } else {

                            if(current.value[0] !== "" && current.value[0] !== "0" ){
                                if(!Utils.isFloat(current.value[0])){
                                    valid = false;
                                    $(current.field[0]).addClass("error").after("<div class='errorMessage'>This field is invalid, it must be a number</div>");
                                }
                            }

                            if(current.value[1] !== "" && current.value[1] !== "0" ){
                                if(!Utils.isFloat(current.value[1])){
                                    valid = false;
                                    $(current.field[1]).addClass("error").after("<div class='errorMessage'>This field is invalid, it must be a number</div>");
                                }
                            }
                        }
                        break;

                }

            };

            $(".entry").removeClass("error");
            $(".entry").last().next(".errorMessage").remove();
            $(".error").removeClass("error");

            /* To be clarified and enhance */
            $.each(fields.fields, function(index, current){


                $(current.field).next(".errorMessage").remove();
                $(current.field).next().next(".errorMessage").remove();

                validate(current);
            });

            if(fields.entryfields !== undefined){

                var debit = 0;
                var credit = 0;

                $.each(fields.entryfields, function(index, current){

                    $.each(current.fields, function(index2, current2){

                        $(current2.field).removeClass("error");
                        $(current2.field).next(".errorMessage").remove();
                        $(current2.field).next().next(".errorMessage").remove();


                        validate(current2);
                        if(valid && current2.name === "entrydebit"){
                            if(current2.name === "entrydebit"){
                                if(current2.value[0] !== "" && current2.value[0] !== "0"){
                                    debit = debit + parseFloat(current2.value[0]);
                                    console.log("add debit", parseFloat(current2.value[0]), debit);
                                }
                                if(current2.value[1] !== "" && current2.value[1] !== "0"){
                                    credit = credit + parseFloat(current2.value[1]);
                                    console.log("add credit", parseFloat(current2.value[0]), credit);
                                }
                            }
                        }
                    });

                });


                if(debit !== credit && action === "create"){
                    valid = false;
                    $(".entry").addClass("error");
                    $(".entry").last().after("<div class='errorMessage'>Entry lines must balance.</div>");
                } else {
                    $(".entry").removeClass("error");
                    $(".entry").last().next(".errorMessage").remove();
                }

            }

            return valid;
        },

        clearForm: function (fields) {

            $.each(fields, function(index, current){
                $(current.field).val('');
            });

        }


    };

    return Forms;
});