function Sidebar (element = page.sidebar()) {
  return {
    toggle () {
      element.classList.toggle('show-mobile')
    }
  }
}
