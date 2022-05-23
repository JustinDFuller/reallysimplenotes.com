function Note(note = {}) {
  return {
    title() {
      return note.Data.split("\n")[0].replace("# ", "") || "New Note";
    },
    ID() {
      return note.ID;
    },
    isActive() {
      return note.Active;
    },
    content() {
      return note.Data;
    },
    toJSON() {
      return JSON.stringify(note);
    },
    update(data) {
      return Note({
        ...note,
        Data: data,
      });
    },
    setActive(active) {
      return Note({
        ...note,
        Active: active,
      });
    },
  };
}
