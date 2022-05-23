function tests() {
  function fail(reason) {
    console.log("%c FAILURE: %s.", "background: black; color: red; padding: 10px 20px;", reason)
  }

  localStorage.clear();
  init();

  const files = page.files();
  if (files.children.length < 1) {
    return fail(`Expected 1 file but found ${files.children.length}`)
  }

  console.log("%c All tests passed.", "background: black; color: green; padding: 10px 20px;")
}

