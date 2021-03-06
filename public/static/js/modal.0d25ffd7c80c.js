/* global Utils, dialogPolyfill */

(function () {
  function openModal (modalDialogEl) {
    window.document.body.classList.add('noScroll')
    modalDialogEl.showModal()
  }

  function copyInModal (modalDialogEl, targetEl) {
    var copyEl = targetEl.cloneNode(true)
    copyEl.id = 'modal-content-copied'
    var modalContent = modalDialogEl.querySelector('#modal-content')
    modalContent.innerHTML = ''
    modalContent.appendChild(copyEl)
    openModal(modalDialogEl)
  }

  function showModal (modalDialogEl, title, innerHTML) {
    var modalTitle = modalDialogEl.querySelector('#modal-title')
    var modalContent = modalDialogEl.querySelector('#modal-content')
    modalContent.innerHTML = innerHTML
    modalTitle.innerText = title || ''
    openModal(modalDialogEl)
  }

  function addAnchorListeners (modalDialogEl) {
    var modalLinks = document.querySelectorAll('a[data-open-in-modal]')
    modalLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault()
        var target = event.currentTarget
        var url = target.href
        var title = target.getAttribute('data-title')
        var xhr = Utils.ajax(url, function (html) {
          // No Modal content in case of redirect
          if (!xhr.responseURL || xhr.responseURL !== url) {
            window.location = url
            return
          }
          showModal(modalDialogEl, title, html)
        })
      })
    })
  }

  function showInModal (modalDialogEl, selector) {
    var targetEl = document.querySelector(selector)
    copyInModal(modalDialogEl, targetEl)
  }

  function handleClose (modalDialogEl) {
    var modalTitle = modalDialogEl.querySelector('#modal-title')
    modalTitle.innerHTML = ''
    window.document.body.classList.remove('noScroll')
  }

  function addOutsideClickListener (modalDialogEl) {
    modalDialogEl.addEventListener('click', function (event) {
      if (event.target === modalDialogEl) {
        modalDialogEl.close()
      }
    })
  }

  function setupEverything () {
    var modalDialogEl = document.getElementById('modal')
    dialogPolyfill.registerDialog(modalDialogEl)
    modalDialogEl.addEventListener('close', function () {
      handleClose(modalDialogEl)
    })

    addOutsideClickListener(modalDialogEl)

    addAnchorListeners(modalDialogEl)
    window.Modal = {
      close: function () {
        modalDialogEl.close()
      },
      showInModal: function (selector) { showInModal(modalDialogEl, selector) }
    }
  }

  setupEverything()
})()
