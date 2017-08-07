<template>
  <div class="editor-wrap">
    <div ref="editor" class="editor" contenteditable @keydown="keyDown" @keyup="keyUp">
      <mp></mp>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../debris/reset.scss";

  .editor-wrap {
    font-size: 1px;
    width: 100%;
    height: 100%;
    .editor {
      width: 100%;
      height: 100%;
      font-size: 16px;
      box-sizing: border-box;
      padding: 20px 100px;
    }
  }
</style>
<script>
  import Vue from 'vue'
  import mp from '../com/md.e.smart.vue'

  const pConstructor = Vue.extend(mp);

  export default {
    data() {
      return {
        editor: undefined
      }
    },
    components: {mp},
    mounted() {
      this.editor = this.$refs.editor;
    },
    methods: {
      keyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
          let newP = new pConstructor().$mount().$el;
          this.editor.append(newP);
          this.setSelectionRange(newP, 0);
          e.preventDefault();
        }
      },
      keyUp() {
      },

      setSelectionRange(el, start, end) {
        if (document.createRange && window.getSelection) {
          let range = document.createRange();
          range.selectNodeContents(el);
          let textNodes = this.getTextNodesIn(el);
          let foundStart = false;
          let charCount = 0, endCharCount;

          for (let i = 0, textNode; textNode = textNodes[i++];) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount
              && (start < endCharCount ||
                (start === endCharCount && i <= textNodes.length))) {
              range.setStart(textNode, start - charCount);
              foundStart = true;
            }
            if (foundStart && end <= endCharCount) {
              range.setEnd(textNode, end - charCount);
              break;
            }
            charCount = endCharCount;
          }

          let sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (document.selection && document.body.createTextRange) {
          let textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.collapse(true);
          textRange.moveEnd("character", end);
          textRange.moveStart("character", start);
          textRange.select();
        }
      },
      getTextNodesIn(node) {
        let textNodes = [];
        if (node.nodeType === 3) {
          textNodes.push(node);
        } else {
          let children = node.childNodes;
          for (let i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
          }
        }
        return textNodes;
      },
      getCurrentCursorNode() {
        let el = document.getSelection().anchorNode;
        return (el.nodeType === 3 ? el.parentNode : el);
      }
    }
  }
</script>
