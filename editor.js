function Editor (element = page.editor()) {
  return {
    setContent (content) {
      element.value = content
    },
    onChange (fn) {
      element.oninput = function (e) {
        if (e.inputType === "insertLineBreak") {
          const start = this.selectionStart;
          const end = this.selectionEnd;

          for (let i = start - 2; i > 0; i--) {
            if (this.value[i] === "\n") {
              const lastLine = this.value.slice(i + 1, start - 1)

              let pattern;
              if (lastLine.startsWith("* ")) {
                pattern = "* ";
              } else if (lastLine.startsWith("- ")) {
                pattern = "- "
              }

              if (pattern) {
                let str = this.value.slice(0, start);
                str += pattern;
                str += this.value.slice(start);
                this.value = str;
                this.selectionStart = start + 2;
                this.selectionEnd = end + 2;
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
