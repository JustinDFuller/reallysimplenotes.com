function Editor (element = page.editor()) {
  return {
    setContent (content) {
      element.value = content
    },
    onChange (fn) {
      element.oninput = function (e) {
        const c = Content(e, this)

        if (c.isLineBreak()) {
          const prev = c.previousLine()
          if (prev.endsWithList()) {
            c.unindentCurrentList(prev)
          } else if (prev.isValidList()) {
            c.repeatPreviousList(prev)
          }
        }

        fn(e)
      }
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
