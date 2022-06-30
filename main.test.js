async function tests () {
  function suite (name, cb) {
    console.log(name)
  }

  function todo (name) {
    console.log(
      '%c TODO: %s',
      'background: black; color: yellow; padding: 5px 10px;',
      name
    )
  }

  function test (name) {
    console.log(`  ${name}`)
  }

  function fail (reason) {
    console.log(
      '%c FAILURE: %s',
      'background: black; color: red; padding: 10px 20px;',
      reason
    )
  }

  localStorage.clear()
  await init()

  suite('Local storage')

  test('Local storage has IDs stored')
  let ids = localStorage.getItem('IDS')
  if (!ids || typeof ids !== 'string' || ids.length === 0) {
    return fail(`Expected IDs to be saved in local storage, got ${ids}`)
  }

  test('IDs is stored as a JSON array')
  ids = JSON.parse(ids)
  if (typeof ids !== 'object' || !Array.isArray(ids)) {
    return fail(`Expected an array of ids but got ${typeof ids}`)
  }

  test('there is at least one ID')
  if (ids.length !== 1) {
    return fail(`Expected 1 ID but found ${ids.length}, ${JSON.stringify(ids)}`)
  }

  test('The first ID is a UUID string of 36 chars')
  if (typeof ids[0] !== 'string' || ids[0].length !== 36) {
    return fail(`Found invalid id ${ids[0]}`)
  }

  test('The first ID is associated with a note stored in local storage')
  let note = localStorage.getItem(ids[0])
  if (!note || typeof note !== 'string') {
    return fail(`Found invalid note ${note}`)
  }

  test('The note is stored as JSON')
  note = JSON.parse(note)
  if (!note || typeof note !== 'object') {
    return fail(`Found unparseable JSON note ${note}`)
  }

  test('The note has the correct ID')
  if (note.ID !== ids[0]) {
    return fail(`ID mismatch \n${note.ID}\n${ids[0]}`)
  }

  test('The note is active')
  if (!note.Active) {
    return fail(`Expected note to initialize Active, ${note.Active}`)
  }

  test('The note is not deleted')
  if (note.Deleted) {
    return fail(`Epected note to initialize not Deleted, ${note.Deleted}`)
  }

  suite('Navigation')

  test("The URL contains the note's ID")
  if (!window.location.pathname.includes(note.ID)) {
    return fail(`Expected URL to contain note ID, ${window.location.pathname}`)
  }

  test('The URL contains 2 paths')
  const paths = window.location.pathname.split('/')
  if (paths.length !== 3) {
    return fail(`Expected URL to contain 2 path separators, ${paths.length}`)
  }

  test("The first path is the note's ID")
  if (paths[0] !== '' || paths[1] !== note.ID) {
    return fail(
      `Expected first URL path to be the ID, "${paths[0]}", "${paths[1]}"`
    )
  }

  test('The second path is the encoded title')
  if (
    typeof paths[2] !== 'string' ||
    paths[2] !== Note(note).urlEncodeTitle() ||
    paths[2].length > 30
  ) {
    return fail(`Found invalid name in path, ${paths[2]}`)
  }

  test('the page title contains the note title')
  if (document.title !== Note(note).title() + ' | Really Simple Notes') {
    return fail(`Found unexpected document title "${document.title}"`)
  }

  suite('Editor')

  test('The editor contains the welcome note')
  const editor = page.editor()
  if (!editor.value.includes('Welcome to Really Simple Notes!')) {
    return fail(`Got unexpected text content: ${editor.value}`)
  }

  test('The editor is the active element')
  if (document.activeElement !== editor) {
    return fail(`Expected element to have focus, #${document.activeElement.id}`)
  }

  test('The editor content is the correct width')
  const style = window.getComputedStyle(editor)
  const width =
    editor.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight)
  if (width > 750 || width < Math.min(700, window.clientWidth)) {
    return fail(`Width greater than expected ${width}`)
  }

  test('Editor has the last position selected (start)')
  if (editor.selectionStart !== note.Data.length) {
    return fail(
      `Got unexpected selectionStart ${editor.selectionStart}, ${note.Data.length}`
    )
  }

  test('Editor has the last position selected (end)')
  if (editor.selectionEnd !== note.Data.length) {
    return fail(
      `Got unexpected selectionEnd ${editor.selectionEnd}, ${note.Data.length}`
    )
  }

  test('Updating editor value is saved in local storage')
  const oldNoteLength = note.Data.length

  editor.value += 't'
  editor.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText'
    })
  )

  note = localStorage.getItem(ids[0])
  if (!note || typeof note !== 'string') {
    return fail(`Found invalid note ${note}`)
  }

  note = JSON.parse(note)
  if (!note || typeof note !== 'object') {
    return fail(`Found unparseable JSON note ${note}`)
  }

  if (note.Data.length !== oldNoteLength + 1) {
    return fail(
      `Expected note length ${oldNoteLength + 1}, got ${note.Data.length}`
    )
  }

  test('Pressing enter on a row with an unordered list continues the list')
  editor.value = editor.value.slice(0, 419) + '\n' + editor.value.slice(419)
  editor.selectionStart = editor.selectionEnd = 419
  editor.dispatchEvent(
    new InputEvent('input', {
      data: null,
      inputType: 'insertLineBreak'
    })
  )

  if (!editor.value.includes('\n* Use an asterisk.\n* \n- Or a hyphen.')) {
    return fail(
      `Found unexpected list value ${JSON.stringify(
        editor.value.slice(400, 433)
      )}`
    )
  }

  if (editor.selectionStart !== 421) {
    return fail(`Found unexpected selectionStart ${editor.selectionStart}`)
  }

  if (editor.selectionEnd !== 421) {
    return fail(`Found unexpected selectionEnd ${editor.selectionEnd}`)
  }

  test('Pressing enter on a row with an dashed list continues the list')
  editor.value = editor.value.slice(0, 437) + '\n' + editor.value.slice(437)
  editor.selectionStart = editor.selectionEnd = 437
  editor.dispatchEvent(
    new InputEvent('input', {
      data: null,
      inputType: 'insertLineBreak'
    })
  )

  if (!editor.value.includes('\n- Or a hyphen.\n- \n')) {
    return fail(
      `Found unexpected list value ${JSON.stringify(
        editor.value.slice(400, 440)
      )}`
    )
  }

  if (editor.selectionStart !== 439) {
    return fail(`Found unexpected selectionStart ${editor.selectionStart}`)
  }

  if (editor.selectionEnd !== 439) {
    return fail(`Found unexpected selectionEnd ${editor.selectionEnd}`)
  }

  test('It repeats valid list newlines')
  const repeatableNewlines = [
    ['* regular list', '* '],
    ['- dashed list', '- '],
    ['1 numerical list', '2 '],
    ['1) numerical list', '2) '],
    ['1- numerical dash', '2- '],
    ['1. numerical dot', '2. '],
    ['** double asterisk', '** '],
    ['*** triple asterisk', '*** '],
    ['\t* tabbed list', '\t* '],
    ['\t\t* double tabbed list', '\t\t* '],
    ['  * spaced list', '  * '],
    ['    * more spaces list', '    * '],
    ['    *** more spaces more asterisks', '    *** '],
    ['#1 should this match?', '#2 '],
    ['#2 should this match?', '#3 '],
    ['(1) what about this?', '(2) '],
    ['(2) this too', '(3) '],
    ['> should quotes be included?', '> '],
    ['\t> What about tabbed quotes?', '\t> '],
    ['  > what about spaced quotes?', '> '],
    ['5 what happens here?', '6 ']
  ]

  for (const [l, next] of repeatableNewlines) {
    editor.value += `\n${l}\n`
    editor.selectionStart = editor.selectionEnd = editor.value.length
    editor.dispatchEvent(
      new InputEvent('input', {
        data: null,
        inputType: 'insertLineBreak'
      })
    )

    if (!editor.value.endsWith(next)) {
      return fail(
        `Expected new line to be created with "${next}" got "${
          editor.value.split('\n')[editor.value.split('\n').length - 1]
        }"`
      )
    }
  }

  test('It does not repeat invalid list newlines')
  const nonRepeatableNewlines = [
    'regular text',
    '*not a space list',
    '-not a space dashed list',
    '1not a space numerical list',
    '1)not a space numerical list',
    '1-numerical dash no space',
    '1.numerical dot no space',
    '**double asterisk no space',
    '***Triple asterisk no space',
    '*tabbed list no space',
    '*double tabbed list no space',
    '*spaced list no space',
    '*more spaces list no space',
    '***more spaces more asterisks no space',
    '(this should not be matched) but is it?',
    'f) huh?',
    'this should not be matched* but is it?',
    '? what about this',
    'gee 5 hey',
    'a. here is thing one',
    'b. here is thing two',
    'i. here is sub thing one',
    'ii. here is sub-thing two',
    'a) here is another type',
    'b) here is another type',
    'a)here is not another type',
    '(here is not another type)',
    '(a) (b)',
    '(b)',
    '# markdown title',
    '## markdown title also',
    '# should not match',
    '## should not match',
    'What if I say > is greater than 5 is < less than 3',
    '55555555'
  ]
  for (const l of nonRepeatableNewlines) {
    editor.value += `\n${l}\n`
    editor.selectionStart = editor.selectionEnd = editor.value.length
    editor.dispatchEvent(
      new InputEvent('input', {
        data: null,
        inputType: 'insertLineBreak'
      })
    )

    if (!editor.value.endsWith('\n')) {
      return fail(
        `Expected new line to be created with "\n" got "${
          editor.value.split('\n')[editor.value.split('\n').length - 1]
        }"`
      )
    }
  }

  test(
    'When reverse-tabbing a line that begins with a tab, it removes one tab character'
  )
  const tabLines = [
    ['\t* untab this', '* untab this'],
    ['\t\t* untab this', '\t* untab this'],
    ['\t\t\t* untab this', '\t\t* untab this']
  ]
  for (const [l, after] of tabLines) {
    editor.value += `\n${l}`
    editor.selectionStart = editor.selectionEnd = editor.value.length
    editor.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        shiftKey: true
      })
    )
    if (!editor.value.endsWith(after)) {
      return fail(
        `Expected shift-tab to create "${after}" got "${
          editor.value.split('\n')[editor.value.split('\n').length - 1]
        }"`
      )
    }
  }

  suite('File navigator')

  test('There is one file')
  const files = page.files()
  if (files.children.length < 1) {
    return fail(`Expected 1 file but found ${files.children.length}`)
  }

  test('You cannot delete a file when there is only one left')
  if (page.deleteButton().style.display !== 'none') {
    return fail(
      `Found unexpected deleteButton style ${page.deleteButton().style.display}`
    )
  }

  test('The first file is the welcome note')
  let file = files.children[0]
  if (file.textContent !== 'Welcome to Really Simple Notes!') {
    return fail(`Got unexpected text content: ${file.textContent}`)
  }

  test('The file is visible on the screen')
  const pos = file.getBoundingClientRect()
  if (
    pos.top < 0 ||
    pos.left < 0 ||
    pos.bottom > window.innerHeight ||
    pos.right > window.innerWidth
  ) {
    return fail(
      `File not visible ${pos.top}, ${pos.left}, ${pos.bottom}, ${pos.right}`
    )
  }

  suite('Adding a new file')

  test('The add button adds a new note')
  page.addButton().dispatchEvent(new Event('click'))
  if (files.children.length !== 2) {
    return fail(`Expected 2 files, got ${files.children.length}`)
  }

  test('You can delete a file when there is more than one')
  if (page.deleteButton().style.display === 'none') {
    return fail(
      `Found unexpected deleteButton style ${page.deleteButton().style.display}`
    )
  }

  test('The empty file says New Note')
  file = files.children[1]
  if (file.textContent !== 'New Note') {
    return fail(`Got unexpected file name, ${file.textContent}`)
  }

  test('The new file is active')
  if (!file.classList.contains('active')) {
    return fail('Expected new file to be active')
  }

  test('The other file is not active')
  if (files.children[0].classList.contains('active')) {
    return fail('Expected the other file to not be active')
  }

  test('The editor is now empty')
  if (editor.value !== '') {
    return fail('Expected the editor to be empty')
  }

  test('The editor is still selected')
  if (document.activeElement !== editor) {
    return fail(`Expected element to have focus, #${document.activeElement.id}`)
  }

  test('The new note is saved to the list in local storage')
  ids = JSON.parse(localStorage.getItem('IDS'))
  if (ids.length !== 2) {
    return fail(`Expected IDs length 2, got ${ids.length}`)
  }

  test('The new note is saved in local storage')
  note = JSON.parse(localStorage.getItem(ids[1]))
  if (note.ID !== ids[1]) {
    return fail(`Found the wrong ID ${note.ID}, ${ids[1]}`)
  }

  test('The path is updated with the ID')
  if (window.location.pathname.split('/')[1] !== note.ID) {
    return fail(
      `Expected the ID to be in the path, got ${window.location.pathname}`
    )
  }

  test('The path is updated with New Note')
  if (window.location.pathname.split('/')[2] !== 'New-Note') {
    return fail(
      `Expected the ID to be in the path, got ${window.location.pathname}`
    )
  }

  suite('Editing a new note')

  test('The correct updated note is saved in local storage')
  editor.value += 'This is a test note'
  editor.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText'
    })
  )

  note = JSON.parse(localStorage.getItem(ids[1]))
  if (note.Data !== editor.value) {
    return fail(
      `Expected the note to be updated with the editor value, got ${note.Data}`
    )
  }

  test('The other note is not updated')
  let firstNote = JSON.parse(localStorage.getItem(ids[0]))
  if (firstNote.Data.includes(editor.value)) {
    return fail(
      `Expected the first note to NOT be updated with the editor value, got ${firstNote.Data}`
    )
  }

  test('The correct file is updated in the sidebar')
  if (files.children[1].textContent !== editor.value) {
    return fail(
      `Expected the new file to be updated, got ${files.children[1].textContent}`
    )
  }

  suite('Switching between notes')

  test('Clicking a note switches the active file in the sidebar')
  page.files().children[0].dispatchEvent(new Event('click'))
  if (!page.files().children[0].classList.contains('active')) {
    return fail('Expected the first file to be active')
  }

  test('Clicking a note switches the content in the editor')
  if (editor.value !== firstNote.Data) {
    return fail(`Found unexpected editor value ${editor.value}`)
  }

  test('Clicking a note switches the URL')
  if (window.location.pathname !== Note(firstNote).url()) {
    return fail(`Found unexpected path ${window.location.pathname}`)
  }

  test('Clicking a note switches the page title')
  if (!document.title.includes(Note(firstNote).title())) {
    return fail(`Found unexpected document title ${document.title}`)
  }

  test('the correct note is saved after switching notes')
  editor.value += 'Adding more text'
  editor.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText'
    })
  )

  firstNote = JSON.parse(localStorage.getItem(ids[0]))
  if (
    firstNote.Data !== editor.value ||
    !firstNote.Data.includes('Adding more text')
  ) {
    return fail(
      `Expected the note to be updated with the editor value, got ${note.Data}`
    )
  }

  // go back to the second file for the rest of tests
  page.files().children[1].dispatchEvent(new Event('click'))

  suite('Deleting a note')

  page.deleteButton().dispatchEvent(new Event('click'))

  test('The button is deleted from the file navigator')
  if (files.children.length !== 1) {
    return fail(`Expected 1 file, got ${files.children.length}`)
  }

  test('The note is not actually deleted from the IDS list')
  ids = JSON.parse(localStorage.getItem('IDS'))
  if (ids.length !== 2) {
    return fail('Found unexpected number of IDS')
  }

  test('The note is not actually deleted from local storage')
  const deletedNote = JSON.parse(localStorage.getItem(ids[1]))
  if (!deletedNote || typeof deletedNote !== 'object') {
    return fail(`Expected to find note in local storage ${deletedNote}`)
  }
  if (!deletedNote.Deleted) {
    return fail(`Expected not to be deleted ${deletedNote.Deleted}`)
  }

  test('The first note is now active')
  if (!files.children[0].classList.contains('active')) {
    return fail('Expected first file to be active')
  }

  test('The editor contains the first note')
  if (editor.value !== firstNote.Data) {
    return fail(
      `Expected editor to contain first note data, got ${editor.value}`
    )
  }

  test('The editor is the active element')
  if (document.activeElement !== editor) {
    return fail(`Expected element to have focus, #${document.activeElement.id}`)
  }

  test("The URL contains the first note's ID")
  if (!window.location.pathname.includes(firstNote.ID)) {
    return fail(`Expected URL to contain note ID, ${window.location.pathname}`)
  }

  suite('Data integrity')

  // add a numerical ID to local storage
  ids.push(1)
  localStorage.setItem('IDS', JSON.stringify(ids))
  localStorage.setItem(
    1,
    JSON.stringify({
      Data: 'Numerical ID note',
      ID: 1,
      Active: false,
      Deleted: false
    })
  )

  await init()

  test('A numerical ID is converted to a UUID in the IDs list')
  ids = JSON.parse(localStorage.getItem('IDS'))
  if (ids.length !== 3) {
    return fail(`Found unexpected number of ids ${ids.length}`)
  }
  for (const id of ids) {
    if (typeof id !== 'string' || id.length !== 36) {
      return fail(`Found unexpected id ${id}`)
    }
  }

  test('The corresponding numerical ID is converted to a UUID in local storage')
  for (const id of ids) {
    if (!localStorage.getItem(id)) {
      return fail(
        `Expected to find new ID in local storage ${localStorage.getItem(id)}`
      )
    }
  }

  test('The ID in the data is updated to the UUID')
  for (const note of notes.list()) {
    if (typeof note.ID() !== 'string') {
      return fail(`Found unexpected ID type ${typeof note.ID()}`)
    }
    if (note.ID().length !== 36) {
      return fail(`Found unexpected ID length ${note.ID().length}`)
    }
  }

  test('The old note ID is saved as a backup')
  if (!localStorage.getItem(1)) {
    return fail(`Expected old note ID to be saved ${localStorage.getItem(1)}`)
  }

  console.log(
    '%c All tests passed',
    'background: black; color: green; padding: 10px 20px;'
  )
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.href.includes('localhost:9000')) {
    tests()
  }
})
