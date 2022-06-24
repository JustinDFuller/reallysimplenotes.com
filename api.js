function API() {
  return {
    async get(id) {
      const res = await fetch(`/v1/user`);
      const user = await res.json();
      return user?.Notes?.find((note) => note.ID === id);
    },
    async save(note) {
      let res = await fetch("/v1/user");
      let user = await res.json();

      if (user.Notes) {
        user.Notes = user?.Notes?.map((n) =>
          n.ID === note.ID() ? note.toObject() : n
        );
      } else {
        user.Notes = [note.toObject()];
      }

      res = await fetch(`/v1/user`, {
        method: "POST",
        body: JSON.stringify(user),
      });
      user = await res.json();
      return user.Notes || [];
    },
    async saveAll(notes) {
      let res = await fetch("/v1/user");
      let user = await res.json();

      res = await fetch("/v1/user", {
        method: "POST",
        body: JSON.stringify({
          ...user,
          Notes: notes?.map((n) => n.toObject()),
        }),
      });
      user = await res.json();
      return user.Notes || [];
    },
    async list() {
      const res = await fetch("/v1/user");
      const user = await res.json();
      return user.Notes || [];
    },
  };
}
