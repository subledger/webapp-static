define(['jquery'] , function ($) {

    var Utils = {
        parse: function(data){

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

            if(rounded){
                if(min > 15 && min < 45){
                    roundedmin = "30";
                }
                if(min >= 45){
                    hours = hours+1;
                }
                min = roundedmin;
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
            if(min !== "00" && min < 10){
                min = "0"+min;
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
        },
        timeago: function (date) {
            var seconds = Math.floor(( ((new Date().getTime()) -date) /1000 )),
                interval = Math.floor(seconds / 31556926);

            if (interval >= 1) {
                if(interval > 1){
                    return interval + " years";
                } else {
                    return interval + " year";
                }
            }


            interval = Math.floor(seconds / 2629743);
            if (interval >= 1) {
                if(interval > 1){
                    return interval + " months";
                } else {
                    return interval + " month";
                }
            }
            interval = Math.floor(seconds / 604800);
            if (interval >= 1) {
                if(interval > 1){
                    return interval + " weeks";
                } else {
                    return interval + " week";
                }
            }


            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                if(interval > 1){
                    return interval + " days";
                } else {
                    return interval + " day";
                }
            }

            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                if(interval > 1){
                    return interval + " hours";
                } else {
                    return interval + " hour";
                }
            }

            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return interval + " min";
            }

            return Math.floor(seconds) + " sec";


        }

    };

    return Utils;
});
