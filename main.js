let notes;
let editor;
let files;
let sidebar;
let page;

function init() {
  page = Page();
  editor = Editor();
  files = Files();
  sidebar = Sidebar();
  notes = LocalStorageNotes().init();

  if (notes.isEmpty()) {
    notes = notes.prefill();
  }

  history.pushState(
    {},
    "",
    `/${notes.getActive().ID()}/${notes.getActive().urlEncodeTitle()}`
  );

  editor.onChange(function (e) {
    notes = notes.set(notes.getActive().update(e.target.value));
    render();
  });

  editor.onKeyDown(function (e) {
    if (e.shiftKey && e.code === "Tab") {
      e.preventDefault();
      const prev = this.selectionStart - 1;
      if (this.value[prev] !== "\t") {
        return;
      }

      this.value =
        this.value.substring(0, prev) + this.value.substring(prev + 1);
      this.selectionStart = this.selectionEnd = prev;
      notes = notes.set(notes.getActive().update(e.target.value));
    } else if (e.code === "Tab") {
      e.preventDefault();
      const start = this.selectionStart;
      this.value =
        this.value.substring(0, start) +
        "\t" +
        this.value.substring(this.selectionEnd);
      this.selectionStart = this.selectionEnd = start + 1;
      notes = notes.set(notes.getActive().update(e.target.value));
    }
  });

  page.sidebarButton().addEventListener("click", function (e) {
    sidebar.toggle();
    editor.toggle();
  });

  page.addButton().addEventListener("click", function (e) {
    const note = Note({
      ID: notes.nextID(),
      Name: "New Note",
      Data: "",
      Active: false,
      Deleted: false,
    });
    notes = notes.add(note);

    render();
  });

  page.deleteButton().addEventListener("click", function (e) {
    notes = notes.set(notes.getActive().delete());

    render();
  });

  page.downloadButton().addEventListener("click", function (e) {
    const note = notes.getActive();

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(note.content())
    );
    element.setAttribute("download", note.sanitizedTitle());

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  });

  render();
}

init();

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
});
