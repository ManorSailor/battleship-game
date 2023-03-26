/**
 * Convert HTML string literal into DOM Node or DocumentFragment
 * @param {String} htmlStr
 * @param {Boolean} firstElementChild
 * @returns {Node|DocumentFragment}
 */
function createElement(htmlStr, firstElementChild = true) {
  const range = document.createRange();
  const docFrag = range.createContextualFragment(htmlStr);
  return firstElementChild ? docFrag.firstElementChild : docFrag;
}

export { createElement };
