function File(element = page.file()) {
  return {
    setActive() {
      element.classList.add("active");
      element.scrollIntoView({ block: "center", behavior: "smooth"  });
    },
    setTitle(title) {
      element.innerHTML = title;
    },
    onClick(fn) {
      element.onclick = fn;
    },
    element() {
      return element;
    },
  };
}
