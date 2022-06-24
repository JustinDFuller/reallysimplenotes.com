function Notes(storage) {
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

  function New(input = []) {
    function init(notes) {
      const active = notes.find((n) => n.isActive());

      const paths = window.location.pathname.split("/");
      if (paths.length > 1) {
        const fromPath = notes.find((n) => n.ID() === paths[1]);
        if (fromPath) {
          if (active) {
            storage.save(active.setActive(false));
          }
          storage.save(fromPath.setActive(true));
          return notes.map((n) => n.setActive(n.ID() === fromPath.ID()));
        }
      }

      if (active) {
        return notes;
      }

      let found = false;
      return notes.map((n) => {
        if (!n.deleted() && !found) {
          found = true;
          return n.setActive(true);
        }
        return n;
      });
    }

    const data = init(input);

    return {
      isEmpty() {
        return data.length === 0;
      },
      prefill() {
        const note = Note({
          ID: crypto.randomUUID(),
          Active: true,
          Data: DEFAULT_DATA,
        });
        this.add(note);
        return New([note]);
      },
      get(note) {
        return data.find((n) => n.ID() === note.ID());
      },
      set(note) {
        storage.save(note);
        return New(data.map((n) => (n.ID() === note.ID() ? note : n)));
      },
      list() {
        return data.filter((n) => !n.deleted());
      },
      nextID() {
        return crypto.randomUUID();
      },
      add(note) {
        const updated = [
          ...data.map((n) => n.setActive(false)),
          note.setActive(true),
        ];
        storage.saveAll(updated);
        return New(updated);
      },
      refresh() {
        return New(data);
      },
      getActive() {
        return data.find((n) => n.isActive());
      },
    };
  }

  return {
    async init() {
      const notes = await storage.list();
      return New(notes.map(Note));
    },
  };
}
