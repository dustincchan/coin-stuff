$(function () {
  var majorAltCoinData = JSON.parse(mainCoinData);
  var bitcoinData = convertDataToHighChartFormat(majorAltCoinData.bitcoin);
  var ethereumData = convertDataToHighChartFormat(majorAltCoinData.ethereum);
  var litecoinData = convertDataToHighChartFormat(majorAltCoinData.litecoin);


  function convertDataToHighChartFormat(coinDict) {
    var keys = Object.keys(coinDict);
    var vals = convertValsToStdDevs(Object.values(coinDict));
    var zipped = keys.map(function(time, i) {
      return [time, vals[i]];
    });
    return zipped;
  }

  function arraySum(arr) {
    return arr.reduce(function(prev, curr) {
      return curr += prev;
    });
  }

  function convertValsToStdDevs(vals) {
    var sum = arraySum(vals);
    var avg = sum / vals.length;
    var squared_diffs = vals.map(function(val) {
      var diff = val - avg;
      return diff**2;
    });
    var sum_of_squared_diffs = arraySum(squared_diffs);
    var mean_of_squared_diffs = sum_of_squared_diffs / vals.length;
    standardDeviation = Math.sqrt(mean_of_squared_diffs);

    return vals.map(function(val) {
      return val / standardDeviation;
    });
  }
    var highChart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Standard Deviation of Google Search Volume'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Standard Deviations'
            }
        },
        legend: {
            enabled: true
        },
        // plotOptions: {
        //     area: {
        //         fillColor: {
        //             linearGradient: {
        //                 x1: 0,
        //                 y1: 0,
        //                 x2: 0,
        //                 y2: 1
        //             },
        //             stops: [
        //                 [0, Highcharts.getOptions().colors[0]],
        //                 [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        //             ]
        //         },
        //         marker: {
        //             radius: 2
        //         },
        //         lineWidth: 1,
        //         states: {
        //             hover: {
        //                 lineWidth: 1
        //             }
        //         },
        //         threshold: null
        //     }
        // },
        series: [
          {
            type: 'line',
            name: 'Bitcoin',
            data: bitcoinData,
          },
          {
            type: 'line',
            name: 'Ethereum',
            data: ethereumData,
          },
          {
            type: 'line',
            name: 'Litecoin',
            data: litecoinData
          }
        ]
    });
    // debugger;
    // highChart.legend.render();
});
