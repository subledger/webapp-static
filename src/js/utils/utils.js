define(['jquery'] , function ($) {

    var Utils = {
        parse: function(data){
            console.log(data);
            var result = {};
            if(data !== undefined){
               result = JSON.parse(JSON.stringify(data));
            }
            return result; //.toJSON
        },
        months: Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
        isUrl: function(url) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return !regexp.test(url);
        },
        isNotEmpty: function(value){
            var valid = false;
            if(value !== '' && value !== undefined && value !== null){
                valid = true;
            }
            return valid;
        },
        isFloat: function(value){

            return parseFloat(value.match(/^-?\d*(\.\d+)?$/))>0;

        },
        getTime: function(date, rounded){
            // Time picker
            var hours = date.getHours();
            var min = date.getMinutes();
            var roundedmin = "00";
            var ampm = "AM";


            if(min > 15 && min < 45){
                roundedmin = "30";
            }
            if(min >= 45){
                hours = hours+1;
            }
            if(hours > 11){
                ampm = "PM";
            }
            if(hours > 12){
                hours = hours-12;
            }
            if(hours === 0){
                hours = 12;
            }
            if(rounded){
                min = roundedmin;
            }
            return hours+" : "+min+" "+ampm;
        },

        convertDateTime: function(date, time){

            var ampm;
            if(time.indexOf("AM") > 0){
                ampm = "AM";
                time = time.replace("AM","");
            } else {
                ampm = "PM";
                time = time.replace("PM","");
            }

            var time = $.trim(time);
            var array = time.split(":");
            var hours = parseInt(array[0]);

            if(hours === 12){
                hours = 0;
            }
            if(ampm === "PM"){
                hours = hours + 12;
            }

            var minute = parseInt(array[1]);

            var datetime = new Date(Date.parse(date));
            datetime.setHours(hours);
            datetime.setMinutes(minute);



            return datetime;
        }
    };

    return Utils;
});
