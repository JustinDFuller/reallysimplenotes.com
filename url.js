function navigate (path) {
  history.pushState({}, '', path + window.location.search)
}
