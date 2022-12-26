function Content (event, element) {
  function previousNewLinePosition () {
    const start = element.selectionStart

    for (let i = start - 2; i > 0; i--) {
      if (element.value[i] === '\n') {
        return i
      }
    }
    return -1
  }

  return {
    isLineBreak () {
      return event.inputType === 'insertLineBreak'
    },
    previousLine () {
      const start = element.selectionStart
      const end = element.selectionEnd

      let found = false
      for (let i = start - 1; i > 0; i--) {
        if (element.value[i] !== '\n') {
          continue
        }

        if (!found) {
          found = true
          continue
        }

        return Line(element.value.slice(i + 1, start - 1))
      }

      // If no previous newline is found, assume the editor is on the first line.
      return Line(element.value)
    },
    currentLine () {
      const start = element.selectionStart
      const end = element.selectionEnd

      for (let i = start - 1; i > 0; i--) {
        if (element.value[i] === '\n') {
          return Line(element.value.slice(i + 1, start))
        }
      }

      // If no previous newline is found, assume the editor is on the first line.
      return Line(element.value)
    },
    unindentCurrentList (line) {
      const start = element.selectionStart
      const list = line.list()

      element.value =
        element.value.slice(0, start - list.length - 1) +
        element.value.slice(start)
      element.selectionStart = start - list.length - 1
      element.selectionEnd = start - list.length - 1
    },
    repeatPreviousList (line) {
      const start = element.selectionStart
      const end = element.selectionEnd

      let list = line.list()

      const n = new RegExp(/\d+/)
      const num = n.exec(list)

      if (num && num[0]) {
        list = list.replace(num[0], Number(num[0]) + 1)
      }

      let str = element.value.slice(0, start)
      str += list
      str += element.value.slice(start)
      element.value = str
      element.selectionStart = start + list.length
      element.selectionEnd = end + list.length
    },
    isForwardTabbing () {
      return !event.shiftKey && event.code === 'Tab'
    },
    isReverseTabbing () {
      return event.shiftKey && event.code === 'Tab'
    },
    unindentCurrentLine () {
      const start = element.selectionStart
      const pos = previousNewLinePosition()

      element.value =
        element.value.slice(0, pos + 1) + element.value.slice(pos + 2)
      element.selectionStart = element.selectionEnd = start - 1
    },
    value () {
      return element.value
    },
    indentCurrentPosition () {
      const start = element.selectionStart
      element.value =
        element.value.substring(0, start) +
        '    ' +
        element.value.substring(element.selectionEnd)
      element.selectionStart = element.selectionEnd = start + 4
    },
    indentCurrentLine () {
      const start = element.selectionStart
      const pos = previousNewLinePosition()

      element.value =
        element.value.slice(0, pos + 1) + '\t' + element.value.slice(pos + 1)
      element.selectionStart = element.selectionEnd = start + 1
    }
  }
}
