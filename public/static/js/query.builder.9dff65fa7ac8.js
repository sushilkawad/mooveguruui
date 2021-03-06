/* global Utils Typeahead, TypeaheadUtils */

(function () {
  function showRatioHelp (ratio) {
    var el = document.getElementById('query-help-name')
    el.textContent = ratio.name
    el = document.getElementById('query-help-description')
    el.textContent = ratio.description
    el = document.getElementById('query-help-detail')
    el.textContent = 'Value in: ' + ratio.unit
  }

  function updateDropdownPosition (textarea, typeahead) {
    var tillCursor = TypeaheadUtils.getTillCursor(textarea)
    var lines = tillCursor.split(/\n/)
    var lastLine = lines[lines.length - 1]
    var menu = typeahead.menu
    var top = 15 + (lines.length * 20)
    var left = lastLine.length * 8
    var maxHeight = typeahead.input.offsetHeight
    var maxWidth = typeahead.input.offsetWidth
    if (top > maxHeight) top = maxHeight
    if (left > maxWidth) left = maxWidth / 3
    menu.style.top = top + 'px'
    menu.style.left = left + 'px'
  }

  function updateMenuPosDecorator (textarea, typeahead, processOptions) {
    return function (options) {
      processOptions(options)
      updateDropdownPosition(textarea, typeahead)
    }
  }

  function getRatioOptions (textarea, typeahead, name, processOptions) {
    var lastWord = TypeaheadUtils.getLastWordBeforeCursor(textarea).trim()
    if (!isNaN(lastWord)) return processOptions([]) // don't process for numbers or empty string
    if (lastWord.toLowerCase() === 'and') {
      TypeaheadUtils.insertWord(textarea, 'AND\n')
      return processOptions([])
    }
    if (lastWord.toLowerCase() === 'or') {
      TypeaheadUtils.insertWord(textarea, 'OR\n')
      return processOptions([])
    }
    updateDropdownPosition(textarea, typeahead)
    var url = Utils.getUrl('searchRatio', {q: lastWord})
    return Utils.ajax(url, updateMenuPosDecorator(textarea, typeahead, processOptions))
  }

  function handleRatioSelect (textarea, options, selectedIndex) {
    var ratio = options[selectedIndex]
    TypeaheadUtils.insertWord(textarea, ratio.name + ' ')
    showRatioHelp(ratio)
  }

  // Make Show Ratio help global to allow it to be used from ratio.gallery
  window.showRatioHelp = showRatioHelp

  // Bind typeahead
  window.addEventListener('load', function () {
    var textarea = document.getElementById('query-builder')

    function onSearch (name, setOptions) {
      getRatioOptions(textarea, typeahead, name, setOptions)
    }

    function onSelect (options, index) {
      handleRatioSelect(textarea, options, index)
    }
    var typeahead = Typeahead(textarea, onSearch, onSelect)
  })
})()
