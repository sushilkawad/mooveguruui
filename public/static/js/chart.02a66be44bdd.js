/* global Chart, Utils, localStorage */

(function () {
  function ScreenerException (message) {
    this.message = message
    this.name = 'ScreenerException'
  }

  // Functions for rendering tooltip
  function volumeInK (value) {
    return value > 1000 ? Math.round(value / 1000) + 'k' : value
  }

  function getTooltipElements () {
    return {
      tooltipEl: document.getElementById('chart-tooltip'),
      titleEl: document.getElementById('chart-tooltip-title'),
      infoEl: document.getElementById('chart-tooltip-info'),
      metaEl: document.getElementById('chart-tooltip-meta'),

      crossHair: document.getElementById('chart-crosshair'),
      customInfo: document.getElementById('chart-info'),
      dateFormatter: Utils.dateFormatter({
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      chart: null
    }
  }

  function getLastValue (chart, metric, asOnDate) {
    var metricDataset = chart.data.datasets.filter(function (dataset) {
      return dataset.metric === metric
    })

    if (metricDataset.length === 0) return
    else metricDataset = metricDataset[0]

    var lastValue
    for (var index = 0; index < metricDataset.data.length; index++) {
      var point = metricDataset.data[index]
      if (point.x > asOnDate) break
      lastValue = point.y
    }

    return lastValue
  }

  function updateTooltipText (chart, tooltipElements, tooltipModel) {
    var titleHTML, infoHTML
    var metaHTML = tooltipModel.dataPoints[0].label

    var metricPoints = {}
    tooltipModel.dataPoints.map(function (dataPoint) {
      var dataset = chart.data.datasets[dataPoint.datasetIndex]
      var point = dataset.data[dataPoint.index]
      var metric = dataset.metric
      metricPoints[metric] = point
    })

    if (metricPoints['Price'] && metricPoints['Volume']) {
      titleHTML = '₹ ' + metricPoints['Price'].y
      var volumePoint = metricPoints['Volume']
      infoHTML = 'Vol: ' + volumeInK(volumePoint.y)
      if (volumePoint.meta.delivery) {
        infoHTML += '<span class="ink-700"> D: ' + volumePoint.meta.delivery + '%</span>'
      }
    } else if (metricPoints['Quarter Sales'] && metricPoints['GPM'] && metricPoints['OPM'] && metricPoints['NPM']) {
      titleHTML = 'Sales: ' + metricPoints['Quarter Sales'].y
      infoHTML = 'GPM: ' + metricPoints['GPM'].y + '%'
      infoHTML += '<br>OPM: ' + metricPoints['OPM'].y + '%'
      infoHTML += '<br>NPM: ' + metricPoints['NPM'].y + '%'
    } else if (metricPoints['Price to Earning']) {
      titleHTML = 'PE: ' + metricPoints['Price to Earning'].y
      var asOnDate = metricPoints['Price to Earning'].x
      var epsValue = getLastValue(chart, 'EPS', asOnDate)
      infoHTML = epsValue ? 'EPS: ' + epsValue : ''
    } else {
      var primaryDataPoint = tooltipModel.dataPoints[0]
      var otherDataPoints = tooltipModel.dataPoints.slice(1)
      var activeDataset = chart.data.datasets[primaryDataPoint.datasetIndex]
      titleHTML = activeDataset.metric + ': ' + activeDataset.data[primaryDataPoint.index].y

      var infoLines = otherDataPoints.map(function (element) {
        var dataset = chart.data.datasets[element.datasetIndex]
        var point = dataset.data[element.index]
        return dataset.metric + ': ' + point.y
      })
      infoHTML = infoLines.filter(function (line) {
        return line
      }).join('<br>')
    }

    tooltipElements.titleEl.innerHTML = titleHTML
    tooltipElements.infoEl.innerHTML = infoHTML
    tooltipElements.metaEl.innerHTML = metaHTML
  }

  function updateTooltip (tooltipElements, tooltipModel) {
    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipElements.customInfo.classList.add('invisible')
      return
    }
    tooltipElements.customInfo.classList.remove('invisible')

    var primaryDataPoint = tooltipModel.dataPoints[0]
    var chart = tooltipElements.chart

    // prepare text to be shown
    updateTooltipText(chart, tooltipElements, tooltipModel)

    // Update positions
    var tooltipEl = tooltipElements.tooltipEl
    var crossHair = tooltipElements.crossHair
    // Get tooltip size
    var tipWidth = tooltipEl.offsetWidth
    var tipHeight = tooltipEl.offsetHeight
    var top = 10
    // Shift tooltip down if price line is on top
    var verticalHalf = (chart.chartArea.bottom - chart.chartArea.top) / 2
    if (primaryDataPoint.y < verticalHalf) top = chart.chartArea.bottom - (tipHeight + 20)
    // Keep tooltip inside chart area
    var left = primaryDataPoint.x - (tipWidth / 2)
    left = primaryDataPoint.x - (tipWidth / 2)
    if (left < chart.chartArea.left) left = chart.chartArea.left
    var totalWidth = left + tipWidth
    if (totalWidth > chart.chartArea.right) left = chart.chartArea.right - tipWidth
    // Set tooltip pos
    tooltipEl.style.top = top + 'px'
    tooltipEl.style.left = left + 'px'
    // Update position of crosshair
    crossHair.style.left = primaryDataPoint.x + 'px'
  }

  function getStorageKey (text) {
    return text.toLowerCase().replace(' ', '')
  }

  // functions for drawing chart legend
  function legendClickCallback (chart, label, dataset) {
    dataset.hidden = !dataset.hidden
    chart.update()

    // save DMA settings
    var rememberMetric = ['SMA50', 'SMA200', 'GPM', 'NPM', 'OPM']
    if (rememberMetric.indexOf(dataset.metric) >= 0) {
      var key = getStorageKey('show' + dataset.metric)
      var value = dataset.hidden ? 0 : 1
      Utils.localStorageSet(key, value)
    }
  }

  function drawLegend (chart) {
    // draw left and right legend labels
    var leftLabels = []
    var rightLabels = []
    chart.data.datasets.map(function (dataset) {
      if (dataset.hidden) return
      if (dataset.yAxisID === 'y-axis-left') leftLabels.push(dataset.metric)
      else if (dataset.yAxisID === 'y-axis-right') rightLabels.push(dataset.metric)
      else console.log(dataset.metric, 'axis not found')
    })
    var el = document.getElementById('chart-label-left')
    el.innerText = leftLabels[0]
    el = document.getElementById('chart-label-right')
    var rightLabel = rightLabels[0]
    if (rightLabel === 'GPM') rightLabel = 'Margin %'
    el.innerText = rightLabel

    // draw legend below chart
    var datasets = chart.data.datasets
    var legendsEl = document.createElement('div')
    legendsEl.classList.add('flex')
    legendsEl.style.justifyContent = 'center'
    chart.legend.legendItems.forEach(function (legendItem) {
      var dataset = datasets[legendItem.datasetIndex]

      var checkBox = document.createElement('input')
      checkBox.classList.add('chart-checkbox')
      checkBox.type = 'checkbox'
      checkBox.style.background = legendItem.fillStyle
      checkBox.addEventListener('change', function (event) {
        legendClickCallback(chart, label, dataset)
      })
      if (!legendItem.hidden) {
        checkBox.checked = true
      }

      var label = document.createElement('label')
      label.style.boxSizing = 'border-box'
      label.style.padding = '6px 8px'
      label.style.marginRight = '16px'
      label.style.fontSize = '14px'
      label.style.fontWeight = '500'
      label.style.cursor = 'pointer'

      var span = document.createElement('span')
      span.innerText = legendItem.text

      label.append(checkBox)
      label.appendChild(span)
      legendsEl.appendChild(label)
    })

    var oldLegendEl = document.getElementById('chart-legend')
    oldLegendEl.parentNode.replaceChild(legendsEl, oldLegendEl)
    legendsEl.id = 'chart-legend'
    legendsEl.style.marginTop = '2rem'
  }

  // Functions for rendering chart
  function updateSizes (chart, tooltipElements) {
    var crossHair = tooltipElements.crossHair
    crossHair.style.top = chart.chartArea.top + 'px'
    var height = chart.chartArea.bottom - chart.chartArea.top
    crossHair.style.height = height + 'px'
  }

  function getChartOptions (tooltipElements) {
    var options = {
      hover: {
        animationDuration: 0 // disable animation on hover
      },
      maintainAspectRatio: false,
      onResize: function (chart) { updateSizes(chart, tooltipElements) },
      legend: {
        position: 'bottom',
        display: false
      },
      legendCallback: drawLegend,
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            tooltipFormat: 'DD MMM YY',
            displayFormats: {
              year: 'MMM YYYY',
              day: 'D MMM'
            }
          },
          ticks: {
            autoSkip: true,
            autoSkipPadding: 100,
            display: true,
            maxRotation: 0
          },
          gridLines: {
            display: true,
            drawOnChartArea: false,
            drawTicks: true
          }
        }]
      },
      tooltips: {
        enabled: false,
        custom: function (tooltipModel) {
          updateTooltip(tooltipElements, tooltipModel)
        }
      }
    }
    setInteraction(options, 'index')
    return options
  }

  function drawChart (target, chartData) {
    var tooltipElements = getTooltipElements()
    target.style.height = '375px'
    var canvas = document.createElement('canvas')
    target.appendChild(canvas)
    var ctx = canvas.getContext('2d')
    var options = getChartOptions(tooltipElements)
    options.scales.yAxes = chartData.yAxes
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: chartData.datasets
      },
      options: options
    })
    chart.generateLegend()
    updateSizes(chart, tooltipElements)
    tooltipElements.chart = chart
    return chart
  }

  function inPercent (x) {
    return Number.parseFloat(x).toFixed(1)
  }

  function getDataPoints (values, isNormalized) {
    var base = null
    if (isNormalized && values.length) {
      base = values[0][1]
    }
    var data = values.map(function (dateVal) {
      var dt = dateVal[0]
      var y = dateVal[1]
      var meta = dateVal[2]
      if (base) {
        y = inPercent(y / base * 100)
      }
      return {
        x: dt,
        y: y,
        meta: meta
      }
    })
    return data
  }

  function getMinimumY (data) {
    if (data.length === 0) return 0
    var minimum = data.reduce(function (prevMin, current) {
      return current.y < prevMin ? current.y : prevMin
    }, data[0].y)
    return minimum
  }

  function getYAxes (id, datasets) {
    if (id !== 'y-axis-right' && id !== 'y-axis-left') {
      throw new ScreenerException('Y-axis id should either be y-axis-right or y-axis-left')
    }

    var yAxes = {
      type: 'linear',
      display: true,
      position: 'right',
      id: id,
      gridLines: {
        drawBorder: false,
        drawOnChartArea: true
      }
    }

    if (id === 'y-axis-left') {
      yAxes.position = 'left'
      yAxes.gridLines.drawOnChartArea = false
    }

    // label specific configs
    datasets.map(function (dataset) {
      if (dataset.metric === 'Volume') {
        yAxes.ticks = {
          callback: volumeInK
        }
      }

      if (dataset.metric === 'NPM') {
        var minimumNPM = getMinimumY(dataset.data)
        if (minimumNPM < -25) {
          yAxes.ticks = {
            min: 0
          }
        }
      }

      if (dataset.metric === 'EPS') {
        var minimumEPS = getMinimumY(dataset.data)
        if (minimumEPS >= 0) {
          yAxes.ticks = {
            min: minimumEPS * 0.9
          }
        }
      }
    })

    return yAxes
  }

  function getFromLocalStorage (metric, defaultVal) {
    var key = getStorageKey('show' + metric)
    var value = Utils.localStorageGet(key)
    if (value === null) return defaultVal
    var isHidden = value === '0'
    return isHidden
  }

  function getChartDataset (dataset, idx, state) {
    var isNormalized = false
    var data = getDataPoints(dataset.values, isNormalized)

    var macros = ['chartType']
    // Default config
    var chartDataset = {
      metric: dataset.metric,
      label: dataset.label,
      data: data,
      chartType: 'line',
      yAxisID: 'y-axis-right',
      borderColor: Utils.chartColors['price'],
      backgroundColor: Utils.chartColors['price']
    }

    // Label specific overrides
    var metricConfig
    var storageKey
    switch (dataset.metric) {
      case 'SMA50':
        metricConfig = {
          hidden: getFromLocalStorage(dataset.metric, true),
          borderWidth: 1.5,
          borderColor: 'hsl(38, 85%, 65%)',
          backgroundColor: 'hsl(38, 85%, 65%)'
        }
        break

      case 'SMA200':
        storageKey = getStorageKey('show' + dataset.metric)
        metricConfig = {
          hidden: getFromLocalStorage(dataset.metric, true),
          borderWidth: 1.5,
          borderColor: 'hsl(207, 12%, 50%)',
          backgroundColor: 'hsl(207, 12%, 50%)'
        }
        break

      case 'Quarter Sales':
        metricConfig = {
          yAxisID: 'y-axis-left',
          chartType: 'bar',
          // maxBarThickness: 8,
          borderColor: 'hsl(244, 92%, 80%)',
          backgroundColor: 'hsl(244, 92%, 80%)'
        }
        break

      case 'GPM':
        metricConfig = {
          hidden: getFromLocalStorage(dataset.metric, false),
          borderColor: 'hsl(338, 92%, 65%)',
          backgroundColor: 'hsl(338, 92%, 65%)'
        }
        break

      case 'OPM':
        metricConfig = {
          hidden: getFromLocalStorage(dataset.metric, false),
          borderColor: 'hsl(66, 100%, 45%)',
          backgroundColor: 'hsl(66, 100%, 45%)'
        }
        break

      case 'NPM':
        metricConfig = {
          hidden: getFromLocalStorage(dataset.metric, false),
          borderColor: 'hsl(158, 100%, 28%)',
          backgroundColor: 'hsl(158, 100%, 28%)'
        }
        break

      case 'Volume':
        metricConfig = {
          yAxisID: 'y-axis-left',
          chartType: 'bar',
          maxBarThickness: 5,
          borderColor: Utils.chartColors['volume'],
          backgroundColor: Utils.chartColors['volume']
        }
        break

      case 'EPS':
        metricConfig = {
          yAxisID: 'y-axis-left',
          chartType: 'bar',
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderColor: Utils.chartColors['light'],
          backgroundColor: Utils.chartColors['light']
        }
        break

      case 'Median PE':
        metricConfig = {
          borderDash: ([5, 5]),
          borderWidth: 1.5,
          borderColor: Utils.chartColors['grey500'],
          backgroundColor: Utils.chartColors['grey500']
        }
        break

      default:
        metricConfig = {}
        break
    }

    // handle macros
    var chartType = metricConfig.chartType || chartDataset.chartType
    if (chartType === 'line') {
      chartDataset.type = 'line'
      chartDataset.fill = false
      chartDataset.borderWidth = 2
      chartDataset.pointRadius = 0
      chartDataset.pointHoverRadius = 4
    } else if (chartType === 'step-line') {
      chartDataset.type = 'line'
      chartDataset.steppedLine = 'before'
      chartDataset.fill = true
      chartDataset.borderWidth = 0
      chartDataset.pointRadius = 0
      chartDataset.pointHoverRadius = 0
    } else if (chartType === 'bar') {
      chartDataset.type = 'bar'
      chartDataset.barThickness = 'flex'
    }

    // merge metric config
    for (var prop in metricConfig) {
      if (metricConfig.hasOwnProperty(prop)) {
        chartDataset[prop] = metricConfig[prop]
      }
    }

    // remove macros
    for (var index = 0; index < macros.length; index++) {
      var macro = macros[index]
      delete chartDataset[macro]
    }

    return chartDataset
  }

  function getDataForChart (state) {
    var activeMetrics = state.metrics
    // select working datasets based on active metrics
    var rawDatasets = state.rawDatasets.filter(function (dataset) {
      return activeMetrics.indexOf(dataset.metric) >= 0
    })

    // sort data sets by order
    rawDatasets.sort(function (a, b) {
      return activeMetrics.indexOf(a.metric) - activeMetrics.indexOf(b.metric)
    })

    var datasets = rawDatasets.map(function (dataset, idx) {
      return getChartDataset(dataset, idx, state)
    })

    // Prepare yAxes based on yAxisID of datasets
    // group datasets by yAxisID
    var yAxisIDs = {}
    datasets.forEach(function (dataset) {
      if (!yAxisIDs.hasOwnProperty(dataset.yAxisID)) {
        yAxisIDs[dataset.yAxisID] = []
      }
      yAxisIDs[dataset.yAxisID].push(dataset)
    })

    // Axes is plural of axis
    var yAxes = []
    for (var yAxisId in yAxisIDs) {
      if (yAxisIDs.hasOwnProperty(yAxisId)) {
        var axesDatasets = yAxisIDs[yAxisId]
        var yAxis = getYAxes(yAxisId, axesDatasets)
        yAxes.push(yAxis)
      }
    }

    return {
      yAxes: yAxes,
      datasets: datasets
    }
  }

  function setInteraction (options, mode) {
    var interaction = {
      // pick nearest value for datasets on x axis
      mode: mode,
      axis: 'x',
      // intersection of mouse is not required. Always show hover points and tooltips
      intersect: false
    }
    Object.keys(interaction).map(function (key) {
      var value = interaction[key]
      options.hover[key] = value
      options.tooltips[key] = value
    })
  }

  function areSameLength (datasets) {
    if (!datasets) {
      return false
    }

    if (datasets.length < 2) {
      return true
    }

    var len = datasets[0].data.length
    for (var i = 1; i < datasets.length; i++) {
      if (datasets[i].data.length !== len) {
        return false
      }
    }
    return true
  }

  function updateChart (chart, state) {
    if (state.rawDatasets.length === 0 || state.metrics.length === 0) return

    var chartData = getDataForChart(state)
    chart.data.datasets = chartData.datasets
    chart.options.scales.yAxes = chartData.yAxes

    // Set interaction mode
    var mode = areSameLength(chartData.datasets) ? 'index' : 'nearest'
    setInteraction(chart.options, mode)

    chart.update()
    chart.generateLegend()
  }

  // Functions for selecting elements
  function getCompanyInfo () {
    var infoEl = document.getElementById('company-info')
    var companyId = infoEl.getAttribute('data-company-id')
    var isConsolidated = infoEl.getAttribute('data-consolidated')
    return {
      companyId: companyId,
      isConsolidated: isConsolidated
    }
  }

  function getRawDatasets (days, metrics, callback) {
    var info = getCompanyInfo()
    var params = {
      companyId: info.companyId,
      q: metrics.join('-'),
      days: days
    }
    if (info.isConsolidated) {
      params['consolidated'] = 'true'
    }
    var url = Utils.getUrl('getChartMetric', params)
    Utils.ajax(url, function (response) {
      response = JSON.parse(response)
      callback(response.datasets)
    })
  }

  // functions for setting periods
  function updatePeriodIndicator (activeDays) {
    var options = document.querySelectorAll('[data-set-chart-days]')
    options.forEach(function (option) {
      var optionDays = option.getAttribute('data-set-chart-days')
      if (optionDays === activeDays) option.classList.add('active')
      else option.classList.remove('active')
    })
  }

  function handleActiveDays (chart, state, newDays) {
    getRawDatasets(newDays, state.metrics, function (rawDatasets) {
      state.rawDatasets = rawDatasets
      state.days = newDays
      updateChart(chart, state)
      updatePeriodIndicator(newDays)
    })
  }

  function activateSetPeriodButtons (chart, state) {
    var options = document.querySelectorAll('[data-set-chart-days]')
    options.forEach(function (option) {
      var optionDays = option.getAttribute('data-set-chart-days')
      option.addEventListener('click', function (event) {
        handleActiveDays(chart, state, optionDays)
      })
    })
  }

  // Functions for plotting metrics
  function updateMeticsIndicator (metrics) {
    var options = document.querySelectorAll('[data-set-chart-metrics]')
    options.forEach(function (option) {
      var optionMetics = option.getAttribute('data-set-chart-metrics')
      if (optionMetics === metrics) option.classList.add('active')
      else option.classList.remove('active')
    })
  }

  function handleActiveMetrics (chart, state, optionMetrics) {
    var metrics = optionMetrics.split('-')
    var days = state.days
    // open all charts except price for max period
    if (metrics.indexOf('Quarter Sales') >= 0 && days < 500) {
      days = '10000'
    } else if (metrics.indexOf('Price to Earning') >= 0 && days < 500) {
      days = '1825'
    }
    getRawDatasets(days, metrics, function (rawDatasets) {
      state.rawDatasets = rawDatasets
      state.metrics = metrics
      updateChart(chart, state)
      updateMeticsIndicator(optionMetrics)
      updatePeriodIndicator(days)
    })
  }

  function activateSetMetrics (chart, state) {
    var options = document.querySelectorAll('[data-set-chart-metrics]')
    options.forEach(function (option) {
      var metrics = option.getAttribute('data-set-chart-metrics')
      option.addEventListener('click', function (event) {
        handleActiveMetrics(chart, state, metrics)
      })
    })
  }

  function setUpEverything () {
    // set and load data for last 365 days
    var state = {
      days: '365',
      metrics: ['Price', 'SMA50', 'SMA200', 'Volume'],
      rawDatasets: []
    }
    getRawDatasets(state.days, state.metrics, function (rawDatasets) {
      state.rawDatasets = rawDatasets
      // render first chart
      var target = document.getElementById('canvas-chart-holder')
      var chart = drawChart(target, getDataForChart(state))

      // add listeners for buttons periods and adding new metrics
      activateSetPeriodButtons(chart, state)
      activateSetMetrics(chart, state)
    })
  }

  setUpEverything()
})()
