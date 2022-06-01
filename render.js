function render() {
  const files = Files();
  files.reset();

  if (notes.list().length < 2) {
    page.deleteButton().style.display = "none";
  } else {
    page.deleteButton().style.display = "inline-block";
  }

  for (const note of notes.list()) {
    const file = File();
    files.add(file);
    file.setTitle(note.title());

    if (note.isActive()) {
      editor.setContent(note.content());
      file.setActive();
      document.title = note.title() + " | Really Simple Notes";
    }

    file.onClick((e) => {
      history.pushState({}, "", note.url());
      notes = notes.refresh();
      sidebar.toggle();
      editor.toggle();
      render();
    });
  }

  editor.focus();
}
