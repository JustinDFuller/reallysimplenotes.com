function render() {
  files.reset();

  for (const note of notes.list()) {
    const file = File();
    file.setTitle(note.title());

    if (note.isActive()) {
      file.setActive();
      editor.setContent(note.content());
      document.title = note.title()  + " | Really Simple Notes";
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
