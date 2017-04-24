$(function () {
  var coinDataDay = JSON.parse(mainCoinDataDay);
  var coinDataWeek = JSON.parse(mainCoinDataWeek);
  var coinDataMonth = JSON.parse(mainCoinDataMonth);

  var bitcoinDataDay = convertDataToHighChartFormat(coinDataDay.bitcoin, 'Bitcoin', true);
  var ethereumDataDay = convertDataToHighChartFormat(coinDataDay.ethereum, 'Ethereum', true);
  var litecoinDataDay = convertDataToHighChartFormat(coinDataDay.litecoin, 'Litecoin', true);

  var bitcoinDataWeek = convertDataToHighChartFormat(coinDataWeek.bitcoin, 'Bitcoin', false);
  var ethereumDataWeek = convertDataToHighChartFormat(coinDataWeek.ethereum, 'Ethereum', false);
  var litecoinDataWeek = convertDataToHighChartFormat(coinDataWeek.litecoin, 'Litecoin', false);

  var bitcoinDataMonth = convertDataToHighChartFormat(coinDataMonth.bitcoin, 'Bitcoin', false);
  var ethereumDataMonth = convertDataToHighChartFormat(coinDataMonth.ethereum, 'Ethereum', false);
  var litecoinDataMonth = convertDataToHighChartFormat(coinDataMonth.litecoin, 'Litecoin', false);

  makeHighChart(bitcoinDataDay, litecoinDataDay, ethereumDataDay, 'day-container', 'Past 24 Hours');
  makeHighChart(bitcoinDataWeek, litecoinDataWeek, ethereumDataWeek, 'week-container', 'Past Week');
  makeHighChart(bitcoinDataMonth, litecoinDataMonth, ethereumDataMonth, 'month-container', 'Past Month');

  var slackUrl = "https://hooks.slack.com/services/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";// Webhook URL

  setInterval(function() {
      window.location.reload();
    }, 10000); 

  function convertDataToHighChartFormat(coinDict, coinName, isHourly) {
    var keys = Object.keys(coinDict);
    var vals = convertValsToStdDevs(Object.values(coinDict));
    var zipped = keys.map(function(time, i) {
      return [parseInt(time) - 25200000, vals[i]];
    });

    if (isHourly) {
      var latestStdDevVal = zipped[zipped.length - 1][1];
      if (latestStdDevVal >= 2.5) {
        var text = coinName + ' is experiencing an unusually high vol. of searches (' + latestStdDevVal + ')'; // Text to post
        $.ajax({
            data: 'payload=' + JSON.stringify({
                "text": text
            }),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: slackUrl
        });
      }
    }

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
      return (val - avg) / standardDeviation;
    });
  }


  function makeHighChart(btcData, ltcData, ethData, elementName, timeframe) {
    Highcharts.chart(elementName, {
      global: {
        useUTC: false
      },
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
