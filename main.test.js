async function tests() {
  function suite(name, cb) {
    console.log(name)
  }

  function test(name) {
    console.log(`  ${name}`)
  }

  function fail(reason) {
    console.log(
      "%c FAILURE: %s",
      "background: black; color: red; padding: 10px 20px;",
      reason
    );
  }

  localStorage.clear();
  await init();

  

  suite("Local storage")

  test("Local storage has IDs stored")
  let ids = localStorage.getItem("IDS");
  if (!ids || typeof ids !== "string" || ids.length === 0) {
    return fail(`Expected IDs to be saved in local storage, got ${ids}`);
  }

  test("IDs is stored as a JSON array")
  ids = JSON.parse(ids);
  if (typeof ids !== "object" || !Array.isArray(ids)) {
    return fail(`Expected an array of ids but got ${typeof ids}`);
  }

  test("there is at least one ID")
  if (ids.length !== 1) {
    return fail(`Expected 1 ID but found ${ids.length}, ${JSON.stringify(ids)}`)
  }

  test("The first ID is a UUID string of 36 chars")
  if (typeof ids[0] !== "string" || ids[0].length !== 36) {
    return fail(`Found invalid id ${ids[0]}`)
  }

  test("The first ID is associated with a note stored in local storage")
  let note = localStorage.getItem(ids[0]);
  if (!note || typeof note !== "string") {
    return fail(`Found invalid note ${note}`)
  }

  test("The note is stored as JSON")
  note = JSON.parse(note)
  if (!note || typeof note !== "object") {
    return fail(`Found unparseable JSON note ${note}`)
  }

  test("The note has the correct ID")
  if (note.ID !== ids[0]) {
    return fail(`ID mismatch \n${note.ID}\n${ids[0]}`)
  }

  test("The note is active")
  if (!note.Active) {
    return fail(`Expected note to initialize Active, ${note.Active}`)
  }

  test("The note is not deleted")
  if (note.Deleted) {
    return fail(`Epected note to initialize not Deleted, ${note.Deleted}`)
  }

  suite("Navigation")

  test("The URL contains the note's ID")
  if (!window.location.pathname.includes(note.ID)) {
    return fail(`Expected URL to contain note ID, ${window.location.pathname}`)
  }

  test("The URL contains 2 paths")
  const paths = window.location.pathname.split("/")
  if (paths.length !== 3) {
    return fail(`Expected URL to contain 2 path separators, ${paths.length}`)
  }

  test("The first path is the note's ID")
  if (paths[0] !== "" || paths[1] !== note.ID) {
    return fail(`Expected first URL path to be the ID, "${paths[0]}", "${paths[1]}"`)
  }

  test("The second path is the encoded title")
  if (typeof paths[2] !== "string" || paths[2] !== Note(note).urlEncodeTitle() || paths[2].length > 30) {
    return fail(`Found invalid name in path, ${paths[2]}`)
  }

  suite("Editor")

  test("The editor contains the welcome note")
  const editor = page.editor();
  if (!editor.value.includes("Welcome to Really Simple Notes!")) {
    return fail(`Got unexpected text content: ${editor.value}`);
  }

  test("The editor is the active element")
  if (document.activeElement !== editor) {
    return fail(`Expected element to have focus, #${document.activeElement.id}`)
  }

  test("The editor content is the correct width")
  const style = window.getComputedStyle(editor);
  const width = editor.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  if (width > 750 || width < Math.min(700, window.clientWidth)) {
    return fail(`Width greater than expected ${width}`)
  }

  test("Editor has the last position selected (start)")
  if (editor.selectionStart !== note.Data.length) {
    return fail(`Got unexpected selectionStart ${editor.selectionStart}, ${note.Data.length}`)
  }

  test("Editor has the last position selected (end)")
  if (editor.selectionEnd !== note.Data.length) {
    return fail(`Got unexpected selectionEnd ${editor.selectionEnd}, ${note.Data.length}`)
  }

  test("Updating editor value is saved in local storage")
  const oldNoteLength = note.Data.length;

  editor.value += "t";
  editor.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    inputType: "insertText",
  }))

  note = localStorage.getItem(ids[0]);
  if (!note || typeof note !== "string") {
    return fail(`Found invalid note ${note}`)
  }

  note = JSON.parse(note)
  if (!note || typeof note !== "object") {
    return fail(`Found unparseable JSON note ${note}`)
  }

  if (note.Data.length !== oldNoteLength + 1) {
    return fail(`Expected note length ${oldNoteLength + 1}, got ${note.Data.length}`);
  }

  suite("File navigator")

  test("There is one file")
  const files = page.files();
  if (files.children.length < 1) {
    return fail(`Expected 1 file but found ${files.children.length}`);
  }

  test("The first file is the welcome note")
  let file = files.children[0]
  if (file.textContent !== "Welcome to Really Simple Notes!") {
    return fail(`Got unexpected text content: ${file.textContent}`);
  }

  test("The file is visible on the screen")
  const pos = file.getBoundingClientRect();
  if (pos.top < 0 || pos.left < 0 || pos.bottom > window.innerHeight || pos.right > window.innerWidth) {
    return fail(`File not visible ${pos.top}, ${pos.left}, ${pos.bottom}, ${pos.right}`)
  }

  suite("Adding a new file")

  test("The add button adds a new note");
  page.addButton().dispatchEvent(new Event("click"));
  if (files.children.length !== 2) {
    return fail(`Expected 2 files, got ${files.children.length}`)
  }

  test("The empty file says New Note")
  file = files.children[1];
  if (file.textContent !== "New Note") {
    return fail(`Got unexpected file name, ${file.textContent}`)
  }

  test("The new file is active")
  if (!file.classList.contains("active")) {
    return fail("Expected new file to be active")
  }

  test("The other file is not active")
  if (files.children[0].classList.contains("active")) {
    return fail("Expected the other file to not be active")
  }

  test("The editor is now empty")
  if (editor.value !== "") {
    return fail("Expected the editor to be empty")
  }

  test("The editor is still selected")
  if (document.activeElement !== editor) {
    return fail(`Expected element to have focus, #${document.activeElement.id}`)
  }

  test("The new note is saved to the list in local storage")
  ids = JSON.parse(localStorage.getItem("IDS"));
  if (ids.length !== 2) {
    return fail(`Expected IDs length 2, got ${ids.length}`)
  }

  test("The new note is saved in local storage")
  note = JSON.parse(localStorage.getItem(ids[1]));
  if (note.ID !== ids[1]) {
    return fail(`Found the wrong ID ${note.ID}, ${ids[1]}`)
  }

  test("The path is updated with the ID")
  if (window.location.pathname.split("/")[1] !== note.ID) {
    return fail(`Expected the ID to be in the path, got ${window.location.pathname}`)
  }

  test("The path is updated with New Note")
  if (window.location.pathname.split("/")[2] !== "New-Note") {
    return fail(`Expected the ID to be in the path, got ${window.location.pathname}`)
  }

  suite("Editing a new note")

  test("The correct updated note is saved in local storage")
  editor.value += "This is a test note";
  editor.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    inputType: "insertText",
  }))

  note = JSON.parse(localStorage.getItem(ids[1]));
  if (note.Data !== editor.value) {
    return fail(`Expected the note to be updated with the editor value, got ${note.Data}`)
  }

  test("The other note is not updated") 
  const firstNote = JSON.parse(localStorage.getItem(ids[0]));
  if (firstNote.Data.includes(editor.value)) {
    return fail(`Expected the first note to NOT be updated with the editor value, got ${firstNote.Data}`)
  }

  console.log(
    "%c All tests passed",
    "background: black; color: green; padding: 10px 20px;"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.href.includes("localhost:9000")) {
    tests()
  }
});

