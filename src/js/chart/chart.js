define(['jquery'] , function ($) {

    var Chart = {
        init: function(data){
             $("#chartoutputdata").text(JSON.stringify(data));
             console.log("CHART DATA", data);
        }
    };

    return Chart;
});
