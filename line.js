function Line (str) {
  return {
    endsWithList () {
      const r = new RegExp(/^[\W|\d]*[\*\-\d\)\.>]\s/)
      const res = r.exec(str)

      let list
      if (res && res[0]) {
        list = res[0]
      }

      return str.endsWith(list)
    },
    isValidList () {
      const r = new RegExp(/^[\W|\d]*[\*\-\d\)\.>]\s/)
      return r.test(str)
    },
    list () {
      const r = new RegExp(/^[\W|\d]*[\*\-\d\)\.>]\s/)
      const res = r.exec(str)

      let list
      if (res && res[0]) {
        list = res[0]
      }

      return list
    },
    startsWithTab () {
      return str.startsWith('\t')
    }
  }
}
