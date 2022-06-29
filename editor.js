function Editor (element = page.editor()) {
  return {
    setContent (content) {
      element.value = content
    },
    onChange (fn) {
      element.oninput = function (e) {
        if (e.inputType === 'insertLineBreak') {
          const start = this.selectionStart
          const end = this.selectionEnd

          for (let i = start - 2; i > 0; i--) {
            if (this.value[i] === '\n') {
              const lastLine = this.value.slice(i + 1, start - 1)

              const r = new RegExp(/^[\W|\d]*[\*\-\d\)\.>]\s/)
              const res = r.exec(lastLine)

              let pattern
              if (res && res[0]) {
                pattern = res[0]
              }

              if (lastLine.endsWith(pattern)) {
                // TODO: If the last line also beings with spaces or tabs, remove those first.

                this.value =
                  this.value.slice(0, start - pattern.length - 1) +
                  this.value.slice(start)
                this.selectionStart = start - pattern.length - 1
                this.selectionEnd = start - pattern.length - 1
                break
              }

              if (pattern) {
                const n = new RegExp(/\d+/)
                const num = n.exec(pattern)

                if (num && num[0]) {
                  pattern = pattern.replace(num[0], Number(num[0]) + 1)
                }

                let str = this.value.slice(0, start)
                str += pattern
                str += this.value.slice(start)
                this.value = str
                this.selectionStart = start + pattern.length
                this.selectionEnd = end + pattern.length
              }

              break
            }
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
