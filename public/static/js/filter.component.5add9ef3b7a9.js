(function () {
  function createCheckbox (i, label, isChecked, onChange) {
    var labelEl = document.createElement('label')
    labelEl.classList.add('label-body')

    var checkbox = document.createElement('input')
    checkbox.type = 'checkbox'

    if (isChecked) checkbox.checked = true

    checkbox.onchange = onChange

    labelEl.appendChild(checkbox)
    var text = document.createTextNode(label)
    var span = document.createElement('span')
    span.appendChild(text)
    labelEl.appendChild(span)

    var lineEl = document.createElement('li')
    lineEl.setAttribute('data-idx', i)
    lineEl.appendChild(labelEl)
    return {el: lineEl, checkbox: checkbox}
  }

  function updateCheckedObjects (event, currentObject, checkedObjects) {
    var current = event.target
    if (current.checked) {
      if (checkedObjects.includes(currentObject)) return
      checkedObjects.push(currentObject)
    } else {
      var pos = checkedObjects.indexOf(currentObject)
      if (pos >= 0) {
        checkedObjects.splice(pos, 1)
      }
    }
  }

  function toggleCheckAll (event, objects, checkedObjects, objectBoxes) {
    var current = event.target
    if (current.checked) {
      objects.map(function (obj) {
        if (checkedObjects.includes(obj)) return
        checkedObjects.push(obj)
      })
    } else {
      checkedObjects.splice(0)
    }

    // Changing an element's checked attribute from javascript
    // doesn't fire it's onChange event
    objectBoxes.map(function (objectBox) {
      objectBox.checkbox.checked = current.checked
    })
  }

  function ShowAsFilter (objects, options, onChange) {
    var checkedObjects = options['checkedObjects'] || []
    var nameAttribute = options['nameAttribute'] || 'name'

    // Boxes to append
    var checkAllBox
    var objectBoxes = []

    // Creating checkbox for checkAll
    var allChecked = (checkedObjects.length === objects.length)
    var _toggleCheckAll = function (event) {
      toggleCheckAll(event, objects, checkedObjects, objectBoxes)
      onChange(checkedObjects)
    }
    checkAllBox = createCheckbox('all', 'Check All', allChecked, _toggleCheckAll)

    // Creating checkboxes for objects
    for (var i = 0; i < objects.length; i++) {
      var current = objects[i]
      var isChecked = checkedObjects.includes(current)
      var _onChange = (function (current) {
        return function (event) {
          updateCheckedObjects(event, current, checkedObjects)
          checkAllBox.checkbox.checked = (objects.length === checkedObjects.length)
          onChange(checkedObjects)
        }
      })(current)
      var label = current[nameAttribute]
      var objectBox = createCheckbox(i, label, isChecked, _onChange)
      objectBoxes.push(objectBox)
    }

    // Append the boxes into a menu
    var menu = document.createElement('ul')
    menu.classList.add('dropdown-content')
    if (!options['noCheckAll']) menu.appendChild(checkAllBox.el)
    objectBoxes.map(function (objectBox) {
      menu.appendChild(objectBox.el)
    })
    return menu
  }

  window.ShowAsFilter = ShowAsFilter
})()
