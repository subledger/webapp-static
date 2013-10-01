define(['jquery','highcharts','highchartsmodule1'] , function ($, Highcharts) {

    var Chart = {
        bindInterval: function(book_id, account_id, DataStructure, AppView, series, balance){

            var balanceupdated = parseFloat(balance);
            DataStructure.journalInterval = window.setInterval(function(){

                var last_id = $('#graph').attr("data-last-id");

                DataStructure.getAccountNewLines(account_id,function(account_id){
                     //console.log(DataStructure.prepareNewAccountLineData(account_id));

                    var lines = DataStructure.prepareNewAccountLineData(account_id);
                    //console.log("new lines", lines, account_id, balanceupdated);
                    $.each(lines, function(index, value){
                        lines[index].balance = balanceupdated.toFixed(2);
                        console.log(balanceupdated);

                        if(current.value.type === 'credit'){
                            balanceupdated = balanceupdated + parseFloat(value.value.amount);
                        } else {
                            balanceupdated = balanceupdated - parseFloat(value.value.amount);
                        }


                        console.log(balanceupdated, value.value.amount);



                        var datetime = new Date(value.posted_at);
                        var year = datetime.getFullYear();
                        var month = datetime.getMonth();
                        var day = datetime.getDate();
                        var hours = datetime.getHours();
                        var min = datetime.getMinutes();
                        var sec = datetime.getSeconds();

                        $('#graph').attr("data-last-id", value.id);
                        //console.log("balance:", year,month, day, hours, min, sec, Date.UTC(year,month, day, hours, min, sec ), value.posted_at, parseFloat(balanceupdated), parseFloat(balance));
                        series.addPoint([Date.UTC(year,month, day, hours, min, sec ), parseFloat(balanceupdated.toFixed(2))], true, true);
                    });



                }, last_id);

            }, 3000);

        },
        init: function(data, book_id, account_id, DataStructure, AppView){


             var _this = this;
            //window.clearInterval(DataStructure.journalInterval);
            //console.log(DataStructure, Template, AppView);



            var type;
            var lines = [];
            var balance = parseFloat(data.balance);


            $.each(data.lines, function(index, current){

                var datetime = new Date(current.posted_at);
                var year = datetime.getFullYear();
                var month = datetime.getMonth();
                var day = datetime.getDate();
                var hours = datetime.getHours();
                var min = datetime.getMinutes();
                var sec = datetime.getSeconds();
                //console.log(datetime, year,month, day, hours, min, sec );
                //console.log(new Date(year,month, day, hours, min, sec ));
                lines.push([Date.UTC(year,month, day, hours, min, sec ), parseFloat(current.balance)]);
                type = current.value.type;
            });

            lines.reverse();


            //console.log("lines", lines);

            $('#graph').attr("data-last-id", data.lines[0].id);

            $('#graph').highcharts({
				colors: ["#1E7C98"],
                chart: {
                    zoomType: 'x',
                    spacingRight: 20,
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function() {

                            // set up the updating of the chart each second
                            var series = this.series[0];
                            _this.bindInterval(book_id, account_id, DataStructure, AppView, series, parseFloat(data.balance));
                        }
                    }
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
                    maxZoom: 36000,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: "Balance values",
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
                    name: "Balance",
                    data: lines
                }]
            });


			//console.log("CHART DATA", data);
        }
    };

    return Chart;
});
