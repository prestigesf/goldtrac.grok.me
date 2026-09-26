function goldWords(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest("pre, textarea, script, style, video")) return NodeFilter.FILTER_REJECT;
      if (parent.classList.contains("w")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let count = 0;
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    for (const part of node.nodeValue.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const word = document.createElement("span");
      word.className = "w";
      word.textContent = part;
      word.style.setProperty("--i", String(count % 14));
      count += 1;
      frag.append(word);
    }
    node.parentNode.replaceChild(frag, node);
  }
}
goldWords(document.body);

