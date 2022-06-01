async function tests() {
  function fail(reason) {
    console.log(
      "%c FAILURE: %s",
      "background: black; color: red; padding: 10px 20px;",
      reason
    );
  }

  localStorage.clear();
  await init();

  const files = page.files();
  if (files.children.length < 1) {
    return fail(`Expected 1 file but found ${files.children.length}`);
  }

  const file = files.children[0]
  if (file.textContent !== "Welcome to Really Simple Notes!") {
    return fail(`Got unexpected text content: ${file.textContent}`);
  }

  const pos = file.getBoundingClientRect();
  if (pos.top < 0 || pos.left < 0 || pos.bottom > window.innerHeight || pos.right > window.innerWidth) {
    return fail(`File not visible ${pos.top}, ${pos.left}, ${pos.bottom}, ${pos.right}`)
  }

  const editor = page.editor();
  if (!editor.value.includes("Welcome to Really Simple Notes!")) {
    return fail(`Got unexpected text content: ${editor.value}`);
  }

  if (document.activeElement !== editor) {
    return fail(`Expected element to hae focus, #${document.activeElement.id}`)
  }

  const style = window.getComputedStyle(editor);
  const width = editor.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  if (width > 750 || width < Math.min(700, window.clientWidth)) {
    return fail(`Width greater than expected ${width}`)
  }

  let ids = localStorage.getItem("IDS");
  if (!ids || typeof ids !== "string" || ids.length === 0) {
    return fail(`Expected IDs to be saved in local storage, got ${ids}`);
  }

  ids = JSON.parse(ids);
  if (typeof ids !== "object" || !Array.isArray(ids)) {
    return fail(`Expected an array of ids but got ${typeof ids}`);
  }

  if (ids.length !== 1) {
    return fail(`Expected 1 ID but found ${ids.length}, ${JSON.stringify(ids)}`)
  }

  if (typeof ids[0] !== "string" || ids[0].length !== 36) {
    return fail(`Found invalid id ${ids[0]}`)
  }

  let note = localStorage.getItem(ids[0]);
  if (!note || typeof note !== "string") {
    return fail(`Found invalid note ${note}`)
  }

  note = JSON.parse(note)
  if (!note || typeof note !== "object") {
    return fail(`Found unparseable JSON note ${note}`)
  }

  if (note.ID !== ids[0]) {
    return fail(`ID mismatch \n${note.ID}\n${ids[0]}`)
  }

  if (!note.Active) {
    return fail(`Expected note to initialize Active, ${note.Active}`)
  }

  if (note.Deleted) {
    return fail(`Epected note to initialize not Deleted, ${note.Deleted}`)
  }

  if (!window.location.pathname.includes(note.ID)) {
    return fail(`Expected URL to contain note ID, ${window.location.pathname}`)
  }

  const paths = window.location.pathname.split("/")
  if (paths.length !== 3) {
    return fail(`Expected URL to contain 2 path separators, ${paths.length}`)
  }

  if (paths[0] !== "" || paths[1] !== note.ID) {
    return fail(`Expected first URL path to be the ID, "${paths[0]}", "${paths[1]}"`)
  }

  if (typeof paths[2] !== "string" || paths[2] !== Note(note).urlEncodeTitle() || paths[2].length > 30) {
    return fail(`Found invalid name in path, ${paths[2]}`)
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

