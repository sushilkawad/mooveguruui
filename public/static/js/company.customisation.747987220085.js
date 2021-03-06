/* global Utils, Typeahead, ShowAsFilter */

(function () {
  function getInfo () {
    var infoEl = document.getElementById('company-info')
    return {
      companyId: infoEl.getAttribute('data-company-id'),
      warehouseId: infoEl.getAttribute('data-warehouse-id'),
      isConsolidated: infoEl.hasAttribute('data-consolidated'),
      userIsRegistered: infoEl.hasAttribute('data-user-is-registered')
    }
  }

  // handle show more sections
  function handleShowMore (event) {
    var box = event.target.closest('.show-more-box')
    box.style.flexBasis = 'auto'
    box.classList.add('highlight')
    event.target.classList.add('hidden')
  }

  function getCommentary () {
    var info = getInfo()
    if (!info.userIsRegistered) {
      window.location.href = '/login/'
      return
    }
    var showMoreUrl = Utils.getUrl('getCommentary', { companyId: info.companyId })
    Utils.ajaxPost(showMoreUrl, {}, function (response) {
      var commentaryBox = document.getElementById('commentary')
      commentaryBox.innerHTML = response
      commentaryBox.style.flexBasis = 'auto'
      commentaryBox.classList.add('highlight')
    })
  }

  function checkAndAddShowMoreButton (boxEl) {
    var isOverflowing = boxEl.scrollHeight > boxEl.clientHeight

    if (isOverflowing) {
      // add show more button if needs scrolling after flex-basis
      var showMoreButton = document.createElement('button')
      showMoreButton.classList.add('a')
      showMoreButton.classList.add('show-more-button')
      showMoreButton.addEventListener('click', handleShowMore)
      showMoreButton.setAttribute('aria-label', 'show more')

      var icon = document.createElement('i')
      icon.classList.add('icon-down')
      icon.classList.add('ink-600')
      showMoreButton.appendChild(icon)

      boxEl.appendChild(showMoreButton)
    } else {
      // remove flex-basis and grow if needs no scroll
      boxEl.style.flexBasis = 'auto'
      boxEl.style.flexGrow = '0'
    }
  }

  function setupShowMoreBoxes () {
    var aboutBox = document.querySelector('.show-more-box')
    checkAndAddShowMoreButton(aboutBox)
  }

  // scroll tables to right
  function scrollTablesToRight () {
    var tables = document.querySelectorAll('.responsive-holder')
    tables.forEach(function (table) {
      table.scrollLeft = table.scrollWidth
    })
  }

  function getQuickRatiosUrl (warehouseId) {
    var url = Utils.getUrl('quickRatios', {
      warehouseId: warehouseId
    })
    return url
  }

  function loadQuickRatios (userIsRegistered, warehouseId) {
    if (!userIsRegistered) {
      setupShowMoreBoxes()
      return
    }

    var quickRatiosUrl = getQuickRatiosUrl(warehouseId)

    Utils.ajax(quickRatiosUrl, function (response) {
      var topRatios = document.getElementById('top-ratios')
      var quickRatios = topRatios.querySelectorAll('[data-source="quick-ratio"]')
      for (var i = quickRatios.length - 1; i >= 0; --i) {
        quickRatios[i].remove()
      }
      topRatios.insertAdjacentHTML('beforeend', response)
      setupShowMoreBoxes()
    })
  }

  // Handle quick ratios typeahead
  function addQuickRatio (userIsRegistered, searchEl, warehouseId, options, index) {
    if (!userIsRegistered) {
      window.location.href = '/login/'
      return
    }
    var name = options[index].name
    searchEl.value = ''
    var quickRatiosUrl = getQuickRatiosUrl(warehouseId)
    Utils.ajaxPost(quickRatiosUrl, {ratio_name: name}, function () {
      loadQuickRatios(userIsRegistered, warehouseId)
    })
  }

  function getRatioOptions (term, processOptions) {
    var url = Utils.getUrl('searchRatio', {q: term})
    return Utils.ajax(url, processOptions)
  }

  function setupQuickRatiosSearch (userIsRegistered, warehouseId) {
    var searchEl = document.getElementById('quick-ratio-search')
    if (!searchEl) return
    Typeahead(searchEl, getRatioOptions, function (options, index) {
      addQuickRatio(userIsRegistered, searchEl, warehouseId, options, index)
    })
  }

  // Peers table and search
  function loadPeersTable (warehouseId) {
    if (!warehouseId) return
    var peersTableUrl = Utils.getUrl('peers', {
      warehouseId: warehouseId
    })
    Utils.ajax(peersTableUrl, function (response) {
      var el = document.getElementById('peers-table-placeholder')
      el.innerHTML = response
    })
  }

  function addPeersComparison (options, selected) {
    var peer = options[selected]
    var infoEl = document.getElementById('company-info')
    var companyId = infoEl.getAttribute('data-company-id')
    var url = '/company/compare/'
    var codes = '?codes=' + companyId + ',' + peer.id
    window.location.href = url + codes
  }

  function setupPeersSearch () {
    var searchPeerComparison = document.getElementById('search-peer-comparison')
    if (searchPeerComparison) {
      Typeahead(searchPeerComparison, Utils.searchCompanies, addPeersComparison)
    }
  }

  // click and expand for schedules
  function _insertRows (data, target) {
    var table = target.closest('table')
    var parentRow = target.closest('tr')
    var rowIndex = parentRow.rowIndex
    parentRow.classList.add('highlight')
    parentRow.classList.add('strong')
    // Get table dates
    var dateElements = table.tHead.querySelectorAll('th:not(.text)')
    var dates = []
    dateElements.forEach(function (element) {
      dates.push(element.textContent)
    })
    // Add Rows

    var rowsAdded = []
    for (var key in data) {
      var row = table.insertRow(++rowIndex)
      // Same highlight of schedules as the parent
      row.className = parentRow.classList.contains('stripe') ? 'stripe' : ''
      // Add ratio name cell
      var cell = row.insertCell()
      if (key.length < 100) {
        cell.innerText = key
      } else {
        cell.innerText = key.substr(0, 75) + '...'
        cell.title = key
      }
      cell.className = 'text'
      cell.style.paddingLeft = '2.5rem'
      var values = data[key]
      dates.map(function (dt) {
        var cellContent = values[dt]
        if (cellContent === undefined || cellContent === null) cellContent = ''
        var cell = row.insertCell()
        cell.innerText = cellContent
      })

      // handle extra data
      if (values.setAttributes) {
        for (var key in values.setAttributes) {
          var value = values.setAttributes[key]
          if (key === 'class') row.classList.add(value)
          else row.setAttribute(key, value)
        }
      }

      rowsAdded.push(row)
    }
    // add info about children to target
    target.setAttribute('data-child-count', rowsAdded.length)
    return rowsAdded
  }

  function _addCollapseListeners (target) {
    target.removeAttribute('disabled')
    target.querySelector('span').textContent = '-'
    var closeCommand = target.getAttribute('onclick').replace('show', 'hide')
    target.setAttribute('onclick', closeCommand)
  }

  function _collapse (target) {
    var childCount = parseInt(target.getAttribute('data-child-count'))
    target.querySelector('span').textContent = '+'
    var table = target.closest('table')
    var parentRow = target.closest('tr')
    parentRow.classList.remove('strong')
    var rowIndex = parentRow.rowIndex
    for (var i = 0; i < childCount; i++) {
      table.deleteRow(rowIndex + 1)
    }
    var openCommand = target.getAttribute('onclick').replace('hide', 'show')
    target.setAttribute('onclick', openCommand)
  }

  function hideSchedule (parent, section, target) {
    _collapse(target)
  }

  function showSchedule (parent, section, target) {
    target.setAttribute('disabled', true)
    var info = getInfo()
    var context = {
      companyId: info.companyId,
      parent: parent,
      section: section
    }
    if (info.isConsolidated) context.consolidated = ''
    var url = Utils.getUrl('schedules', context)
    Utils.ajax(url, function (response) {
      var data = JSON.parse(response)
      _insertRows(data, target)
      _addCollapseListeners(target)
    })
  }

  function hideShareholders (classification, target) {
    _collapse(target)
  }

  function _insertShareholderLinks (rows) {
    rows.map(function (row) {
      var cell = row.querySelector('td')
      var shareholderName = cell.innerText
      cell.innerText = ''

      var a = document.createElement('a')
      var fingerprints = row.getAttribute('data-fingerprints')
      a.href = Utils.getUrl('viewFingerprints', {fingerprints: fingerprints})
      a.classList.add('ink-900', 'hover-link')

      var span = document.createElement('span')
      span.innerText = shareholderName
      a.appendChild(span)

      var i = document.createElement('i')
      i.classList.add('icon-right', 'a')
      a.appendChild(i)

      cell.appendChild(a)
    })
  }

  function showShareholders (classification, target) {
    target.setAttribute('disabled', true)
    var info = getInfo()
    var context = {
      companyId: info.companyId,
      classification: classification
    }
    var url = Utils.getUrl('getShareholders', context)
    Utils.ajax(url, function (response) {
      var data = JSON.parse(response)
      var rows = _insertRows(data, target)
      _insertShareholderLinks(rows)
      _addCollapseListeners(target)
    })
  }

  function setWatchlistListLabel (idx, prefix, suffix) {
    var labelEl = document.querySelector('[data-idx="' + idx + '"]  span')
    labelEl.innerText = prefix
    var suffixEl = document.createElement('span')
    suffixEl.classList.add('ink-700', 'strong', 'smaller', 'highlight')
    suffixEl.style.paddingLeft = '1rem'
    suffixEl.innerText = suffix
    labelEl.appendChild(suffixEl)
  }

  function handleSublistSelect (initialSublists, checkedSublists) {
    var updatedSublistIds = checkedSublists.map(function (sublist) {
      return sublist.id
    })

    var info = getInfo()
    initialSublists.map(function (sublist, idx) {
      var url, suffix
      var data = {
        'companyId': info.companyId,
        'listId': sublist.id
      }
      var hasNow = updatedSublistIds.indexOf(sublist.id) >= 0 ? 1 : 0
      if (sublist.has_company === hasNow) {
        return
      } else if (hasNow) {
        url = Utils.getUrl('addCompany', data)
        suffix = 'added'
      } else {
        url = Utils.getUrl('removeCompany', data)
        suffix = 'removed'
      }
      Utils.ajaxPost(url, {}, function (response) {
        setWatchlistListLabel(idx, sublist.name, suffix)
      })
      sublist.has_company = hasNow
    })
  }

  function loadSublistsBoxes (sublistsEl, companyId) {
    var url = Utils.getUrl('companyInSublists', {companyId: companyId})
    Utils.ajax(url, function (response) {
      var sublists = JSON.parse(response)
      if (!sublists) return
      var checkedObjects = sublists.filter(function (sublist) {
        return sublist.has_company
      })
      var options = {
        checkedObjects: checkedObjects,
        noCheckAll: true
      }
      var menuEl = ShowAsFilter(sublists, options, function (checkedObjects) {
        handleSublistSelect(sublists, checkedObjects)
      })
      menuEl.classList.add('visible')
      menuEl.style.width = '100%'
      menuEl.style.right = '0'
      sublistsEl.appendChild(menuEl)
    })
  }

  function setupSublistsAddition (userIsRegistered, companyId) {
    if (!userIsRegistered) return
    var loaderEl = document.getElementById('add-to-sublists')
    var sublistsEl = document.getElementById('company-in-sublists')
    var sublistsLoaded = false
    loaderEl.addEventListener('mouseenter', function () {
      sublistsEl.classList.remove('hidden')
      if (sublistsLoaded) return
      sublistsLoaded = true
      loadSublistsBoxes(sublistsEl, companyId)
    })

    loaderEl.addEventListener('mouseleave', function () {
      sublistsEl.classList.add('hidden')
    })
  }

  function setup () {
    var info = getInfo()
    scrollTablesToRight()
    loadQuickRatios(info.userIsRegistered, info.warehouseId)
    setupQuickRatiosSearch(info.userIsRegistered, info.warehouseId)
    loadPeersTable(info.warehouseId)
    setupPeersSearch()
    setupSublistsAddition(info.userIsRegistered, info.companyId)

    window.Company = {
      info: info,
      hideSchedule: hideSchedule,
      showSchedule: showSchedule,
      hideShareholders: hideShareholders,
      showShareholders: showShareholders,
      getCommentary: getCommentary
    }
  }

  setup()
})()
