let notes
let editor
let files
let sidebar
let page

function init() {
  page = Page()
  editor = Editor();
  files = Files();
  sidebar = Sidebar();
  notes = LocalStorageNotes().init();

  if (notes.isEmpty()) {
    notes = notes.prefill();
  }

  editor.onChange(function (e) {
    notes = notes.set(notes.getActive().update(e.target.value));
    render();
  });

  page.sidebarButton()
    .addEventListener("click", function (e) {
      sidebar.toggle();
      editor.toggle();
    });

  page.addButton().addEventListener("click", function (e) {
    const note = Note({
      ID: notes.nextID(),
      Name: "New Note",
      Data: "",
      Active: false,
    });
    notes = notes.add(note);

    render();
  });

  render();
}

init();

