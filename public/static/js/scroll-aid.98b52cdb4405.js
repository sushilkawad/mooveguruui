/* global IntersectionObserver */

(function () {
  function updateActive (idNavLinks, activeNavLinks, entries, observer) {
    var removals = []
    entries.forEach(function (entry) {
      var navLink = idNavLinks[entry.target.id]
      if (entry.isIntersecting) {
        activeNavLinks.push(navLink)
      } else {
        navLink.classList.remove('active')
        removals.push(navLink)
      }
    })

    activeNavLinks = activeNavLinks.filter(function (navLink) {
      return removals.indexOf(navLink) === -1
    })

    // highlight first one
    activeNavLinks.forEach(function (navLink, idx) {
      if (idx === 0) {
        navLink.classList.add('active')
      } else {
        navLink.classList.remove('active')
      }
    })
    return activeNavLinks
  }

  function setupScrollAid () {
    // no scroll aid on small screens
    if (window.innerWidth < 768) { return }

    var options = {
      root: null,
      rootMargin: '-100px 0px 0px 0px',
      threshold: 0.5
    }

    // dictionary of target ids and corresponding indicator element
    var navLinks = document.querySelectorAll('.sub-nav a')
    var idNavLinks = {}
    var targets = []
    navLinks.forEach(function (navLink) {
      var targetId = navLink.getAttribute('href').replace('#', '')
      var target = document.getElementById(targetId)
      if (target) {
        targets.push(target)
        idNavLinks[targetId] = navLink
      }
    })

    var activeNavLinks = []
    var observer = new IntersectionObserver(function (targets, observer) {
      activeNavLinks = updateActive(idNavLinks, activeNavLinks, targets, observer)
    }, options)

    targets.forEach(function (target) {
      observer.observe(target)
    })
  }

  setupScrollAid()
})()
