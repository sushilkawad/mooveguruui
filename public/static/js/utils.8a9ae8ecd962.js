/* global XMLHttpRequest, URLSearchParams, localStorage, getComputedStyle */

(function () {
  function handleResponse (xhr, onSuccess, onError) {
    if (xhr.status === 200) onSuccess(xhr.responseText)
    else onError(xhr.statusText)
  }

  function ajax (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = function () {
      handleResponse(xhr, onSuccess, onError)
    }
    xhr.onerror = function () { onError(xhr.statusText) }
    // for is_ajax to work in Django
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send()
    return xhr
  }

  function setCookie (name, value, days) {
    var expires = ''
    if (days) {
      var date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/'
  }

  function eraseCookie (name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }

  function getCsrf () { // eslint-disable-line no-unused-vars
    return document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/, '$1')
  }

  function encodePostData (data) {
    return Object.keys(data).map(function (key) {
      var value = data[key]
      if (value === undefined) value = ''
      return key + '=' + encodeURIComponent(value)
    }).join('&')
  }

  function ajaxPost (url, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.setRequestHeader('X-CSRFToken', getCsrf())
    xhr.onreadystatechange = function () {
      if (this.readyState !== XMLHttpRequest.DONE) return
      handleResponse(xhr, onSuccess, onError)
    }
    // for is_ajax to work in Django
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send(encodePostData(data))
  }

  function resizeIframe (obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px'
  }

  function dateDelta (period, days) {
    period = new Date(period)
    period.setDate(period.getDate() + days)
    return period
  }

  function dateFormatter (options) {
    try {
      // Available only on IE11+ and Safari 10+
      return new Intl.DateTimeFormat('en-IN', options)
    } catch (error) {
      return {
        format: function (date) {
          return date.toDateString()
        }
      }
    }
  }

  function isDesktop () {
    return window.screen.width > 992
  }

  function formatUrl (url, data) {
    // Clone data
    var context = {}
    if (data === undefined) data = {}
    Object.keys(data).forEach(function (key) {
      context[key] = data[key]
    })

    // Replace curls
    var parsed = url
    var curls = parsed.match(/{[^}]+}/g)
    if (curls === null) curls = []
    for (var i = 0; i < curls.length; i++) {
      var curlyKey = curls[i]
      var key = curlyKey.replace(/{|}/g, '')
      var value = context[key]
      delete context[key]
      if (value === undefined || value === null) {
        parsed = parsed.replace(curlyKey + '/', '')
      } else {
        parsed = parsed.replace(curlyKey, value)
      }
    }

    // Remaining context goes into get params
    if (Object.keys(context).length > 0) {
      var params = new URLSearchParams(context)
      parsed = parsed + '?' + params.toString()
    }
    return parsed
  }

  function getUrls () {
    var urls = {
      searchCompany: '/api/company/search/',
      addCompany: '/api/company/{companyId}/add/{listId}/',
      removeCompany: '/api/company/{companyId}/remove/{listId}/',
      quickRatios: '/api/company/{warehouseId}/quick_ratios/',
      peers: '/api/company/{warehouseId}/peers/',
      schedules: '/api/company/{companyId}/schedules/',
      searchRatio: '/api/ratio/search/',
      getChartMetric: '/api/company/{companyId}/chart/',
      searchHsCode: '/api/hs/search/',
      tradeData: '/api/hs/{hsCode}/data/',
      feed: '/dash/',
      updateFeedPos: '/api/user/read_feed/',
      ratioGallery: '/ratios/gallery/',
      getIndustries: '/api/get/industries/',
      getSegments: '/api/segments/{companyId}/{section}/{segtype}/',
      addPushSubscription: '/api/notifications/add_push_subscription/',
      companyInSublists: '/api/company/sublists/{companyId}/',
      getUserNotes: '/notes/company/{companyId}/',
      getShareholders: '/api/{companyId}/investors/{classification}/',
      viewFingerprints: '/shareholders/view/{fingerprints}/',
      getCommentary: '/wiki/company/{companyId}/commentary/'
    }
    return urls
  }

  function getUrl (name, data) {
    var urls = getUrls()
    var url = urls[name]
    return formatUrl(url, data)
  }

  function searchCompanies (name, processOptions) {
    var url = getUrl('searchCompany', {q: name})
    return ajax(url, processOptions)
  }

  function getChartColors () {
    var bodyColors = getComputedStyle(document.body)
    var chartColors = {
      red: bodyColors.getPropertyValue('--red').trim() || 'red',
      price: bodyColors.getPropertyValue('--chart-price').trim() || 'purple',
      volume: bodyColors.getPropertyValue('--chart-volume').trim() || 'lightblue',
      ink700: bodyColors.getPropertyValue('--ink-700').trim() || 'grey',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey500: 'hsl(0, 0%, 75%)',
      grey300: 'hsl(0, 0%, 85%)',
      dark: 'hsl(202, 59%, 23%)',
      light: 'hsl(202, 86%, 80%)',
      lightRed: '#f3aeaa',
      lightBlue: '#5cdbf3',
      white: 'rgba(255, 255, 255, 0.95)',
      default: 'rgba(0, 0, 0, 0.1)'
    }
    chartColors.lightRedBlueGradient = [
      chartColors.lightRed,
      '#5CE6F3',
      chartColors.lightBlue
    ]
    return chartColors
  }

  function hideElement (element, hideClass) {
    hideClass = hideClass || 'hidden'
    if (element.classList.contains(hideClass)) return
    setTimeout(function () {
      element.classList.add(hideClass)
    }, 100)
  }

  function addHideOnEscape (element, hideClass, callback) {
    document.addEventListener('keydown', function (event) {
      if (event.which === 27) {
        hideElement(element, hideClass)
        if (callback) callback(event)
      }
    })
  }

  function addHideOnOutsideClick (element, hideClass) {
    document.addEventListener('click', function () {
      hideElement(element, hideClass)
    })

    // Prevent bubbling when clicked on element
    element.addEventListener('click', function (event) {
      event.stopPropagation()
    })
  }

  function toggleClass (element, klass) {
    if (element.classList.contains(klass)) {
      element.classList.remove(klass)
    } else {
      element.classList.add(klass)
    }
  }

  function localStorageSet (key, value) {
    // user can disable localStorage
    try {
      localStorage.setItem(key, value)
    } catch (exception) {}
  }

  function localStorageGet (key) {
    // some versions of safari disable localStorage in private mode
    try {
      return localStorage.getItem(key)
    } catch (exception) {
      return null
    }
  }

  function setupUtils () {
    window.Utils = {
      ajax: ajax,
      ajaxPost: ajaxPost,
      setCookie: setCookie,
      eraseCookie: eraseCookie,
      getUrl: getUrl,
      getCsrf: getCsrf,
      searchCompanies: searchCompanies,
      chartColors: getChartColors(),
      resizeIframe: resizeIframe,
      dateDelta: dateDelta,
      dateFormatter: dateFormatter,
      isDesktop: isDesktop,
      addHideOnEscape: addHideOnEscape,
      addHideOnOutsideClick: addHideOnOutsideClick,
      toggleClass: toggleClass,
      localStorageGet: localStorageGet,
      localStorageSet: localStorageSet
    }
  }

  setupUtils()
})()
