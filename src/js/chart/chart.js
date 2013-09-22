define(['jquery','highcharts','highchartsmodule1'] , function ($, Highcharts) {

    var Chart = {
        init: function(data){
            console.log(data);
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

            lines.reverse();

            //console.log("lines", lines);

            $('#graph').highcharts({
				colors: ["#1E7C98"],
                chart: {
                    zoomType: 'x',
                    spacingRight: 20
                },
                title: {
                    text: 'Account activities',
					style: {
						color: '#1E7C98'
					}
                },
                subtitle: {

					style: {
						color: '#1E7C98'
					},
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
                        text: type + " values",
						style: {
							color: '#1E7C98'
						}
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
								[0, "#1E7C98"],
								[1, "rgba(30,124,152,0)"]
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
