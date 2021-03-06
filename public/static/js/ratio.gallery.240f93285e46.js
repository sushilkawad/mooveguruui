/* global Utils, TypeaheadUtils */

(function () {
  function getRatioGallery () {
    return document.getElementById('ratio-gallery')
  }

  function loadRatioGallery (button) {
    var url = Utils.getUrl('ratioGallery')
    Utils.ajax(url, function (response) {
      var ratioGallery = getRatioGallery()
      ratioGallery.innerHTML = response
      button.textContent = 'Close Gallery'
      button.setAttribute('onclick', 'RatioGallery.closeGallery(this)')

      // select most used group
      var options = ratioGallery.querySelector('.options')
      var option = options.children[0]
      showGroup(option)
    })
  }

  function closeRatioGallery (button) {
    var ratioGallery = getRatioGallery()
    ratioGallery.innerHTML = ''
    button.textContent = 'Show All Ratios'
    button.setAttribute('onclick', 'RatioGallery.loadGallery(this)')
  }

  function showGroup (target) {
    var groupName = target.value
    var old = document.querySelectorAll('[data-group-name]:not(.hidden)')
    old.forEach(function (el) {
      el.classList.add('hidden')
    })
    var visible = '[data-group-name~="' + groupName + '"]'
    visible = document.querySelectorAll(visible)
    visible.forEach(function (el) {
      el.classList.remove('hidden')
    })

    // update options indicator
    var ratioGallery = getRatioGallery()
    var options = ratioGallery.querySelector('.options')
    for (var index = 0; index < options.children.length; index++) {
      var option = options.children[index]
      option.classList.remove('active')
    }
    target.classList.add('active')
  }

  function showSearch (target) {
    var term = new RegExp(target.value, 'i')
    var ratios = document.querySelectorAll('[data-group-name]')
    ratios.forEach(function (ratio) {
      var name = ratio.getAttribute('data-name')
      var description = ratio.getAttribute('data-description')
      var hasTerm = name.search(term) > -1 || description.search(term) > -1
      if (hasTerm) ratio.classList.remove('hidden')
      else ratio.classList.add('hidden')
    })
  }

  function selectRatio (target) {
    var textarea = document.getElementById('query-builder')
    var ratio = {
      name: target.getAttribute('data-name'),
      description: target.getAttribute('data-description'),
      unit: target.getAttribute('data-unit')
    }
    TypeaheadUtils.insertWord(textarea, ratio.name + ' ')
    window.showRatioHelp(ratio)
    textarea.focus()
  }

  function insertOperator (target) {
    var textarea = document.getElementById('query-builder')
    var appendOnly = true
    var content = target.textContent
    if (content === 'AND' || content === 'OR') content += '\n'
    else content += ' '
    TypeaheadUtils.insertWord(textarea, content, appendOnly)
    textarea.focus()
  }

  function setupEverything () {
    window.RatioGallery = {
      'loadGallery': loadRatioGallery,
      'closeGallery': closeRatioGallery,
      'showGroup': showGroup,
      'showSearch': showSearch,
      'selectRatio': selectRatio,
      'insertOperator': insertOperator
    }
  }

  setupEverything()
})()
