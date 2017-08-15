module.exports = {
  getCurrentCursorNode() {
    let el = document.getSelection().anchorNode;
    return (el.nodeType === 3 ? el.parentNode : el);
  }
};
