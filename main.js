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

  editor.onKeyDown(function (e) {
    if (e.shiftKey && e.code === "Tab") {
      e.preventDefault();
      const prev = this.selectionStart - 1;
      if (this.value[prev] !== "\t") {
        return
      }

      this.value = this.value.substring(0, prev) + this.value.substring(prev + 1);
      this.selectionStart = this.selectionEnd = prev;
      notes = notes.set(notes.getActive().update(e.target.value));
    } else if (e.code === "Tab") {
      e.preventDefault();
      const start = this.selectionStart;
      this.value = this.value.substring(0, start) + "\t" + this.value.substring(this.selectionEnd);
      this.selectionStart = this.selectionEnd = start + 1;
      notes = notes.set(notes.getActive().update(e.target.value));
    }
  })

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

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
});
