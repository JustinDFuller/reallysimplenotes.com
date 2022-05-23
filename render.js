function render() {
  files.reset();

  for (const note of notes.list()) {
    const file = File();
    file.setTitle(note.title());

    if (note.isActive()) {
      file.setActive();
      editor.setContent(note.content());
    }

    file.onClick((e) => {
      notes = notes.activate(note);
      sidebar.toggle();
      editor.toggle();
      render();
    });

    files.add(file);
  }

  editor.focus();
}
