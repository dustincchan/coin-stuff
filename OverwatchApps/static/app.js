$(function () {
  var coinDataDay = JSON.parse(mainCoinDataDay);
  var coinDataWeek = JSON.parse(mainCoinDataWeek);
  var coinDataMonth = JSON.parse(mainCoinDataMonth);

  var bitcoinDataDay = convertDataToHighChartFormat(coinDataDay.bitcoin);
  var ethereumDataDay = convertDataToHighChartFormat(coinDataDay.ethereum);
  var litecoinDataDay = convertDataToHighChartFormat(coinDataDay.litecoin);

  var bitcoinDataWeek = convertDataToHighChartFormat(coinDataWeek.bitcoin);
  var ethereumDataWeek = convertDataToHighChartFormat(coinDataWeek.ethereum);
  var litecoinDataWeek = convertDataToHighChartFormat(coinDataWeek.litecoin);

  var bitcoinDataMonth = convertDataToHighChartFormat(coinDataMonth.bitcoin);
  var ethereumDataMonth = convertDataToHighChartFormat(coinDataMonth.ethereum);
  var litecoinDataMonth = convertDataToHighChartFormat(coinDataMonth.litecoin);

  makeHighChart(bitcoinDataDay, litecoinDataDay, ethereumDataDay, 'day-container', 'Past Day');
  makeHighChart(bitcoinDataWeek, litecoinDataWeek, ethereumDataWeek, 'week-container', 'Past Week');
  makeHighChart(bitcoinDataMonth, litecoinDataMonth, ethereumDataMonth, 'month-container', 'Past Month');

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


  function makeHighChart(btcData, ltcData, ethData, elementName, timeframe) {
    Highcharts.chart(elementName, {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Standard Deviation of Google Search Volume ' + timeframe
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
      series: [
        {
          type: 'line',
          name: 'Bitcoin',
          data: btcData,
        },
        {
          type: 'line',
          name: 'Ethereum',
          data: ethData,
        },
        {
          type: 'line',
          name: 'Litecoin',
          data: ltcData
        }
      ]
    });
  }

});
