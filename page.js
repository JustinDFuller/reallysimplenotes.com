function Page() {
  return {
    sidebarButton() {
      return document.getElementById("sidebar-title")
    },
    addButton() {
      return document.getElementById("add")
    },
    editor() {
      return document.getElementById("editor")
    },
    files() {
      return document.getElementById("files")
    },
    file() {
      return document.createElement("li")
    },
    sidebar() {
      return document.getElementById("sidebar")
    },
  }
}
