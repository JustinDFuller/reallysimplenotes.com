function Editor(element = page.editor()) {
  return {
    setContent(content) {
      element.value = content;
    },
    onChange(fn) {
      element.addEventListener("input", fn);
    },
    focus() {
      element.focus();
    },
    toggle() {
      element.classList.toggle("hide-mobile");
    },
    onKeyDown(fn) {
      element.addEventListener("keydown", fn);
    },
  };
}
