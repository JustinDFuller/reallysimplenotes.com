function File(element = page.file()) {
  return {
    setActive() {
      element.classList.add("active");
    },
    setTitle(title) {
      element.innerHTML = title;
    },
    onClick(fn) {
      element.addEventListener("click", fn);
    },
    element() {
      return element;
    },
  };
}
