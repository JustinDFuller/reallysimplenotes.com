function Note (input) {
  const defaults = {
    Data: '',
    ID: crypto.randomUUID(),
    Active: false,
    Deleted: false
  }

  const note = Object.assign({}, defaults, input)

  return {
    title () {
      return note.Data.split('\n')[0].replace('# ', '') || 'New Note'
    },
    ID () {
      return note.ID
    },
    isActive () {
      return note.Active
    },
    content () {
      return note.Data
    },
    toJSON () {
      return JSON.stringify(note)
    },
    update (data) {
      return Note({
        ...note,
        Data: data
      })
    },
    setActive (active) {
      return Note({
        ...note,
        Active: active
      })
    },
    delete () {
      return Note({
        ...note,
        Deleted: true,
        Active: false
      })
    },
    deleted () {
      return note.Deleted
    },
    urlEncodeTitle () {
      return encodeURI(
        this.title()
          .replace(/[^a-zA-Z\s]/g, '')
          .replace(/[\s]/g, '-')
          .slice(0, 30)
      )
    },
    sanitizedTitle () {
      const illegalRe = /[\/\?<>\\:\*\|"]/g
      const controlRe = /[\x00-\x1f\x80-\x9f]/g
      const reservedRe = /^\.+$/
      const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i
      const windowsTrailingRe = /[\. ]+$/
      const spaces = /\s/g
      const replacement = '_'

      return this.title()
        .replace(spaces, replacement)
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement)
        .substring(0, Math.min(this.title().length, 250))
    },
    toObject () {
      return note
    },
    url () {
      return `/${note.ID}/${this.urlEncodeTitle()}`
    }
  }
}
