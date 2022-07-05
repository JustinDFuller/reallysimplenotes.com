function Content(event, element) {
  return {
    isLineBreak() {
      return event.inputType === 'insertLineBreak'
    },
    previousLine() {
      const start = element.selectionStart
      const end = element.selectionEnd


      for (let i = start - 2; i > 0; i--) {
        if (element.value[i] === '\n') {
          return Line(element.value.slice(i + 1, start - 1))
        }      
      }

      // If no previous newline is found, assume the editor is on the first line.
      return Line(element.value)
    },
    unindentCurrentList(line) {
      const start = element.selectionStart
      const list = line.list()

      element.value = element.value.slice(0, start - list.length - 1) + element.value.slice(start)
      element.selectionStart = start - list.length - 1
      element.selectionEnd = start - list.length - 1
    },
    repeatPreviousList(line) {
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
    }
  }
} 
