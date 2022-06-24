function Editor (element = page.editor()) {
  return {
    setContent (content) {
      element.value = content
    },
    onChange (fn) {
      element.oninput = fn
    },
    focus () {
      element.focus()
    },
    toggle () {
      element.classList.toggle('hide-mobile')
    },
    onKeyDown (fn) {
      element.onkeydown = fn
    }
  }
}
