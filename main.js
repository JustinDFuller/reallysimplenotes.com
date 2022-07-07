let notes
let editor
let sidebar
let page

async function init () {
  page = Page()
  editor = Editor()
  sidebar = Sidebar()
  notes = await Notes(LocalStorage()).init()

  if (notes.isEmpty()) {
    notes = notes.prefill()
  }

  navigate(notes.getActive().url())

  editor.onChange(function (e) {
    const c = Content(e, this)

    if (c.isLineBreak()) {
      const line = c.previousLine()
      if (line.endsWithList()) {
        c.unindentCurrentList(line)
      } else if (line.isValidList()) {
        c.repeatPreviousList(line)
      }
    }

    notes = notes.set(notes.getActive().update(e.target.value))
    render()
  })

  editor.onKeyDown(function (e) {
    const c = Content(e, this)

    if (c.isReverseTabbing()) {
      e.preventDefault()

      const line = c.currentLine()
      if (!line.startsWithTab()) {
        return
      }

      c.unindentCurrentLine()
    } else if (c.isForwardTabbing()) {
      e.preventDefault()

      const line = c.currentLine()
      if (line.isValidList()) {
        c.indentCurrentLine()
      } else {
        c.indentCurrentPosition()
      }
    }

    notes = notes.set(notes.getActive().update(c.value()))
  })

  page.sidebarButton().onclick = function (e) {
    sidebar.toggle()
    editor.toggle()
  }

  page.addButton().onclick = function (e) {
    const note = Note({
      ID: notes.nextID(),
      Data: '',
      Active: true,
      Deleted: false
    })
    navigate(note.url())
    notes = notes.add(note)

    render()
  }

  page.deleteButton().onclick = function (e) {
    navigate('/')
    notes = notes.set(notes.getActive().delete())
    navigate(notes.getActive().url())

    render()
  }

  page.downloadButton().onclick = function (e) {
    const note = notes.getActive()

    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(note.content())
    )
    element.setAttribute('download', note.sanitizedTitle())

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  render()
}

init()

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
})
