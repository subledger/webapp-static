export default Ember.View.extend({
  account: Ember.computed.alias('controller.account'),
  $masterChart: null,
  $detailChart: null,

  createMasterChart: function( points) {
    var self = this;

    var firstPoint = points.get('firstObject');
    var lastPoint = points.get('lastObject');    

    var data = [];
    points.every(function(point) {
      data.push({
        x: point.date.getTime(),
        y: point.amount
      });

      return true;
    }, this);

    return this.$('.master').highcharts({
      chart: {
        reflow: false,
        borderWidth: 0,
        backgroundColor: null,
        marginLeft: 50,
        marginRight: 20,
        zoomType: 'x',
        events: {
          // listen to the selection event on the master chart to update the
          // extremes of the detail chart
          selection: function(event) {
            var extremesObject = event.xAxis[0],
              min = extremesObject.min,
              max = extremesObject.max,
              detailData = [],
              xAxis = this.xAxis[0];

            // reverse engineer the last part of the data
            $.each(this.series[0].data, function(i, point) {
              if (point.x > min && point.x < max) {
                detailData.push({
                  x: point.x,
                  y: point.y
                });
              }
            });

            // move the plot bands to reflect the new detail span
            xAxis.removePlotBand('mask-before');
            xAxis.addPlotBand({
              id: 'mask-before',
              from: data[0].x,
              to: min,
              color: 'rgba(0, 0, 0, 0.2)'
            });

            xAxis.removePlotBand('mask-after');
            xAxis.addPlotBand({
              id: 'mask-after',
              from: max,
              to: data[data.length - 1].x,
              color: 'rgba(0, 0, 0, 0.2)'
            });


            self.get('$detailChart').series[0].setData(detailData);

            return false;
          }
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        showLastTickLabel: true,
        plotBands: [{
          id: 'mask-before',
          from: data[0].x,
          to: data[1].x,
          color: 'rgba(0, 0, 0, 0.2)'
        }],
        title: {
          text: null
        }
      },
      yAxis: {
        gridLineWidth: 0,
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        min: 0.6,
        showFirstLabel: false
      },
      tooltip: {
        formatter: function() {
          return false;
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          fillColor: {
            linearGradient: [0, 0, 0, 70],
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, 'rgba(255,255,255,0)']
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
          enableMouseTracking: false
        }
      },

      series: [{
        type: 'area',
        name: 'Account Balance',
        data: data
      }],

      exporting: {
        enabled: false
      }

    }, $.proxy(function(masterChart) {
      this.set('$detailChart', this.createDetailChart(masterChart));

    }, this)).highcharts();
  },

  createDetailChart: function(masterChart) {
    // prepare the detail chart
    var detailData = [],
        detailStart = masterChart.series[0].data[1].x;

    $.each(masterChart.series[0].data, function(i, point) {
      if (point.x >= detailStart) {
        detailData.push({
          x: point.x,
          y: point.y
        });
      }
    });

    var title = this.get('account').get('description');
    title += " balances from ";
    title += Highcharts.dateFormat('%B %e, %Y', detailData[0].x);
    title += " to ";
    title += Highcharts.dateFormat('%B %e, %Y', detailData[detailData.length - 1].x);

    // create a detail chart referenced by a global variable
    return this.$('.detail').highcharts({
      chart: {
        type: 'spline',
        marginBottom: 120,
        reflow: false,
        marginLeft: 50,
        marginRight: 20,
        style: {
          position: 'absolute'
        }
      },
      credits: {
        enabled: false
      },
      title: {
        text: title
      },
      subtitle: {
        text: 'Select an area by dragging across the lower chart'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: null
        },
        maxZoom: 0.1
      },
      tooltip: {
        formatter: function() {
          var point = this.points[0];
          return Highcharts.dateFormat('%A %B %e %Y', this.x) + ':<br/>' +
          '<b>'+ point.series.name +': </b>' +
          Highcharts.numberFormat(point.y, 2);
        },
        shared: true
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          marker: {
            // enabled: false,
            // states: {
            //   hover: {
            //     enabled: true,
            //     radius: 3
            //   }
            // }
          }
        }
      },
      series: [{
        name: 'Balance',
        data: detailData
      }],

      exporting: {
        enabled: false
      }

    }).highcharts();
  },

  didInsertElement: function() {
    var points = this.get('controller').get('content');

    // make the container smaller and add a second container for the master chart
    var $container = this.$('.chart')
        .css('position', 'relative');

    var $detailContainer = $('<div class="detail">')
        .appendTo($container);

    var $masterContainer = $('<div class="master">')
        .css({ position: 'absolute', top: 300, height: 100, width: '100%' })
        .appendTo($container);

    this.set('$masterChart', this.createMasterChart(points));
  }
});