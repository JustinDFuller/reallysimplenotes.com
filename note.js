function Note(input) {
  const defaults = {
    Data: "",
    ID: 0,
    Active: false,
    Deleted: false,
  };

  const note = Object.assign({}, defaults, input);

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
    delete() {
      return Note({
        ...note,
        Deleted: true,
        Active: false,
      });
    },
    deleted() {
      return note.Deleted;
    },
  };
}
