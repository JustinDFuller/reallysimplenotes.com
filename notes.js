function LocalStorageNotes(data = []) {
  return {
    isEmpty() {
      return data.length === 0;
    },
    prefill() {
      const note = Note({
        ID: 1,
        Active: true,
        Data: "This is your first note.\nErase this text and start typing!",
      });
      this.save(note);
      return LocalStorageNotes([note])
    },
    get(note) {
      return data.find((n) => n.ID() === note.ID());
    },
    save(note) {
      localStorage.setItem(note.ID(), note.toJSON());
    },
    set(note) {
      this.save(note);
      return LocalStorageNotes(
        data.map((n) => (n.ID() === note.ID() ? note : n))
      );
    },
    init() {
      ids = JSON.parse(localStorage.getItem("IDS")) || [];

      return LocalStorageNotes(
        ids.map((id) => Note(JSON.parse(localStorage.getItem(id))))
      );
    },
    list() {
      return data;
    },
    nextID() {
      return data.length + 1 || 1;
    },
    add(note) {
      const updated = [...data, note];
      const ids = updated.map((n) => n.ID());
      localStorage.setItem("IDS", JSON.stringify(ids));
      this.save(note);
      return LocalStorageNotes(updated);
    },
    activate(note) {
      const updated = data.map(function (n) {
        if (n.ID() === note.ID()) {
          return n.setActive(true);
        }
        return n.setActive(false);
      });

      updated.forEach((n) => this.save(n));

      return LocalStorageNotes(updated);
    },
    getActive() {
      return data.find((n) => n.isActive());
    },
  };
}
