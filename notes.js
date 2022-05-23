
function LocalStorageNotes(data = []) {
  const DEFAULT_DATA = `Welcome to Really Simple Notes!

This notes app is a little different than some you might have used before.

First, you may notice there are no styling options. That's because styling tends to get in the way. You won't find bold, italics, or any other styles. This helps you focus on what matters: writing notes.

But, don't worry, there's a lot you can do with plain text.

What if you want a list?
* Use an asterisk.
- Or a hyphen.

What if you have a quote?
> Use a "greater than" symbol.

When you make changes, it will automatically save in your browser.

Now, go ahead, erase this text and start writing some notes!`;

  return {
    isEmpty() {
      console.log(data, data.length)
      return data.length === 0;
    },
    prefill() {
      const note = Note({
        ID: 1,
        Active: true,
        Data: DEFAULT_DATA,
      });
      this.add(note);
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
