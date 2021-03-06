/* global Utils, ShowAsFilter, URLSearchParams */

(function () {
  function getMenuEl () {
    // getElementById returns null if it doesn't exist
    return document.getElementById('industry-filter-menu')
  }

  function parseHTML (str) {
    var tmp = document.implementation.createHTMLDocument()
    tmp.body.innerHTML = str
    return tmp.body
  }

  function replaceContents (html, selectorsToReplace) {
    var parsed = parseHTML(html)
    selectorsToReplace.map(function (selector) {
      var currentEl = document.querySelector(selector)
      var updatedEl = parsed.querySelector(selector)
      if (currentEl && updatedEl) {
        currentEl.parentElement.replaceChild(updatedEl, currentEl)
      }
    })
  }

  function onSelectionChange (selected) {
    if (selected.length === 0) return
    var codes = selected.map(function (object) {
      return object.code
    })

    // Replace industries with the new set of industries in the current query params
    var params = new URLSearchParams(window.location.search)
    params.set('industries', codes.join('-'))
    if (params.has('page')) params.set('page', 1)

    var pathName = window.location.pathname
    var url = pathName + '?' + params.toString()

    Utils.ajax(url, function (html) {
      replaceContents(html, ['[data-page-info]', '[data-page-results]', '[data-paging]', '[data-messages]'])
      if (html.includes('Please upgrade')) {
        var menuEl = getMenuEl()
        menuEl.classList.add('hidden')
      }
    })
  }

  function loadIndustryBoxes (sourceEl) {
    var url = sourceEl.getAttribute('data-api-url')
    Utils.ajax(url, function (html) {
      var objects = JSON.parse(html)
      var checkedObjects = objects.filter(function (obj) {
        return obj.checked
      })
      var options = {
        checkedObjects: checkedObjects
      }
      var menuEl = ShowAsFilter(objects, options, onSelectionChange)
      menuEl.classList.add('visible')
      menuEl.id = 'industry-filter-menu'
      var parentElement = sourceEl.parentElement
      parentElement.replaceChild(menuEl, parentElement.querySelector('.dropdown-content'))
      Utils.addHideOnEscape(menuEl)
      Utils.addHideOnOutsideClick(menuEl)
    })
  }

  function toggleIndustryFilter (event) {
    event.stopPropagation()
    var sourceEl = event.target
    var menuEl = getMenuEl()
    if (!menuEl) {
      loadIndustryBoxes(sourceEl)
    } else {
      Utils.toggleClass(menuEl, 'hidden')
    }
  }

  function setupEverything () {
    window.toggleIndustryFilter = toggleIndustryFilter
  }

  setupEverything()
})()
