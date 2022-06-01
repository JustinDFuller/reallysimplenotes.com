function LocalStorage() {
  return {
    get(id) {
      return new Promise(function(resolve) {
        resolve(JSON.parse(localStorage.getItem(id))); 
      })
    },
    save(note) {
      return new Promise(function(resolve) {
        localStorage.setItem(note.ID(), note.toJSON());
        resolve(note);
      });
    },
    saveAll(notes) {
      return new Promise(function(resolve) {
        const ids = notes.map((n) => n.ID());
        notes.forEach(note => localStorage.setItem(note.ID(), note.toJSON()));
        localStorage.setItem("IDS", JSON.stringify(ids));
        resolve(notes);
      });
    },
    list() {
      return new Promise(function(resolve) {
        const ids = JSON.parse(localStorage.getItem("IDS")) || [];
        const notes = ids.map((id) => JSON.parse(localStorage.getItem(id))).filter(n => typeof n === "object" && n != null);
        const updated = notes.map((note) => {
          if (typeof note.ID === "number") {
            const old = note.ID;
            note.ID = crypto.randomUUID();
            localStorage.setItem(note.ID, JSON.stringify(note));
            localStorage.setItem(old, JSON.stringify({ ...note, Deleted: true }));
          }
          return note
        })
        localStorage.setItem("IDS", JSON.stringify(updated.map(n => n.ID)));
        resolve(notes);
      });
    },
  };
}
