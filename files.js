function Files (element = page.files()) {
  return {
    reset () {
      while (element.firstChild) {
        element.removeChild(element.firstChild)
      }
    },
    add (file) {
      element.appendChild(file.element())
    }
  }
}
