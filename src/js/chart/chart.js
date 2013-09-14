define(['jquery','highcharts','highchartsmodule1'] , function ($, Highcharts) {

    var Chart = {
        init: function(data){
            var type;
            var lines = [];
            $.each(data.lines, function(index, current){

                var datetime = new Date(current.posted_at);
                var year = datetime.getFullYear();
                var month = datetime.getMonth();
                var day = datetime.getDay();
                var hours = datetime.getHours();
                var min = datetime.getMinutes();
                var sec = datetime.getSeconds();

                //console.log(new Date(year,month, day, hours, min, sec ));
                lines.push([Date.UTC(year,month, day, hours, min, sec ), parseFloat(current.value.amount)]);
                type = current.value.type;
            });

            //console.log("lines", lines);

            $('#graph').highcharts({
                chart: {
                    zoomType: 'x',
                    spacingRight: 20
                },
                title: {
                    text: 'Account activities'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' :
                        'Pinch the chart to zoom in'
                },
                xAxis: {
                    type: 'datetime',
                    maxZoom: 3600000,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: type + " values"
                    }
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: type + " value",
                    data: lines
                }]
            });


			//console.log("CHART DATA", data);
        }
    };

    return Chart;
});
