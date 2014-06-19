export default Ember.View.extend({
  tagName: 'section',
  classNames: 'account-chart',

  layoutName: 'layouts/panel-with-body-only',
  
  $masterChart: null,
  $detailChart: null,

  detailFrom: null,
  detailTo: null,

  masterData: Ember.A(),
  detailData: Ember.A(),
  account: Ember.computed.alias('controller.account'),

  detailDataLoaded: function() {
    if (this.get('detailFrom') && this.get('detailTo')) {
      this.get('masterData').clear();
      this.get('detailData').clear();

      this.get('controller').every(function(point) {
        var time = point.get('date').getTime();

        this.get('masterData').addObject({
          x: time,
          y: point.amount
        });

        if (time >= this.get('detailFrom') && time <= this.get('detailTo')) {
          this.get('detailData').addObject({
            x: time,
            y: point.get('amount')
          });
        }

        return true;
      }, this);

      this.get('$masterChart').series[0].setData(this.get('masterData').toArray());
      this.get('$masterChart').hideLoading();

      this.get('$detailChart').series[0].setData(this.get('detailData').toArray());
      this.get('$detailChart').hideLoading();

      // change title
      this.get('$detailChart').setTitle({text: this.getTitle()});
    }
  }.observes('controller.@each'),

  intervalSelected: function(event) {
    this.get('$detailChart').showLoading();
    this.get('$masterChart').showLoading();

    var extremesObject = event.xAxis[0];

    this.setProperties({
      detailFrom: extremesObject.min,
      detailTo: extremesObject.max
    });

    var xAxis = this.get('$masterChart').xAxis[0];

    // move the plot bands to reflect the new detail span
    xAxis.removePlotBand('mask-before');
    xAxis.addPlotBand({
      id: 'mask-before',
      from: this.get('masterData').get('firstObject').x,
      to: this.get('detailFrom'),
      color: 'rgba(0, 0, 0, 0.2)'
    });

    xAxis.removePlotBand('mask-after');
    xAxis.addPlotBand({
      id: 'mask-after',
      from: this.get('detailTo'),
      to: this.get('masterData').get('lastObject').x,
      color: 'rgba(0, 0, 0, 0.2)'
    });

    // load balances for selected interval
    this.get('controller').send('loadBalances', this.get('detailFrom'), this.get('detailTo'));

    return false;
  },

  createMasterChart: function() {
    return this.$('.master').highcharts({
      chart: {
        reflow: false,
        borderWidth: 0,
        backgroundColor: null,
        marginLeft: 50,
        marginRight: 20,
        zoomType: 'x',
        events: {
          selection: $.proxy(this.intervalSelected, this)
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%b %e',
          week: '%b %e',
          month: '%b \'%y',
          year: '%Y'
        },        
        showLastTickLabel: true,
        plotBands: [{
          id: 'mask-before',
          from: this.get('masterData').get('firstObject').x,
          to: this.get('masterData').objectAt(1).x,
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
        data: this.get('masterData').toArray()
      }],

      exporting: {
        enabled: false
      }

    }, $.proxy(function(masterChart) {
      this.set('$detailChart', this.createDetailChart(masterChart));

    }, this)).highcharts();
  },

  createDetailChart: function(masterChart) {
    this.get('detailData').clear();
    var detailStart = this.get('masterData').objectAt(1).x;

    var decimalPlaces = this.get('credential').get('decimalPlaces');

    this.get('masterData').every(function(point) {
      if (point.x >= detailStart) {
        this.get('detailData').addObject({
          x: point.x,
          y: point.y
        });
      }

      return true;
    }, this);

    var title = this.getTitle();

    // create a detail chart referenced by a global variable
    return this.$('.detail').highcharts({
      chart: {
        marginBottom: 150,
        reflow: false,
        marginLeft: 70,
        marginRight: 30,
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
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%b %e',
          week: '%b %e',
          month: '%b \'%y',
          year: '%Y'
        }
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
          return Highcharts.dateFormat('%A, %B %e %Y %H:%M:%S', this.x) + '<br/>' +
          '<b>'+ point.series.name +': </b>' +
          Highcharts.numberFormat(point.y, decimalPlaces);
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
        data: this.get('detailData').toArray()
      }],

      exporting: {
        buttons: {
          contextButton: {
            menuItems: [{
              text: 'Print',
              onclick: function() {
                  this.print();
              },
            }, {
              separator: true
            }, {
              text: 'Save as PNG',
              onclick: function() {
                  this.clientSideExportPNG();
              },
              separator: false
            }, {
              text: 'Save as SVG',
              onclick: function() {
                  this.clientSideExportSVG();
              },
              separator: false
            }]
          }
        }
      }

    }).highcharts();
  },

  getTitle: function() {
    var title = this.get('account').get('description');
    title += " balances from ";
    title += Highcharts.dateFormat('%B %e, %Y', this.get('detailData').get('firstObject').x);
    title += " to ";
    title += Highcharts.dateFormat('%B %e, %Y', this.get('detailData').get('lastObject').x);

    return title;
  },

  didInsertElement: function() {
    var points = this.get('controller').get('content');

    points.every(function(point) {
      this.get('masterData').addObject({
        x: point.date.getTime(),
        y: point.amount
      });

      return true;
    }, this);

    // set global HighCharts configuration
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    // make the container smaller and add a second container for the master chart
    var $container = this.$('.chart-container').css('position', 'relative');

    var $detailContainer = $('<div class="detail">')
        .css({ height: 700 })
        .appendTo($container);

    var $masterContainer = $('<div class="master">')
        .css({ position: 'absolute', top: 600, height: 100, width: '100%' })
        .appendTo($container);

    this.set('$masterChart', this.createMasterChart());
  }
});