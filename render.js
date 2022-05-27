function render() {
  files.reset();

  if (notes.list().length < 2) {
    page.deleteButton().style.display = "none";
  } else {
    page.deleteButton().style.display = "inline-block";
  }

  for (const note of notes.list()) {
    const file = File();
    file.setTitle(note.title());

    if (note.isActive()) {
      file.setActive();
      editor.setContent(note.content());
      document.title = note.title() + " | Really Simple Notes";
    }

    file.onClick((e) => {
      history.pushState({}, "", `/${note.ID()}/${note.urlEncodeTitle()}`);
      notes = notes.refresh();
      sidebar.toggle();
      editor.toggle();
      render();
    });

    files.add(file);
  }

  editor.focus();
}
