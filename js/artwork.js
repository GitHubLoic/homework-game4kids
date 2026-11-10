// Vocabulaire visuel commun à l'accueil, aux exercices et aux récompenses.
function nauticalIcon(name) {
  const shapes = {
    star: '<path d="m12 2 3 6.1 6.7 1-4.8 4.7 1.1 6.7-6-3.2-6 3.2 1.1-6.7L2.3 9.1 9 8.1Z" fill="#ffd55a"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    anchor: '<path d="M12 7v14M4 13c0 10 16 10 16 0M2 15l2-3 3 2m10 0 3-2 2 3M8 10h8"/><circle cx="12" cy="4" r="3" fill="#ffdc71"/>',
    compass: '<circle cx="12" cy="12" r="10" fill="#fff2cb"/><path d="m16 7-2 7-6 3 2-7Z" fill="#28b7c1"/><circle cx="12" cy="12" r="1" fill="#193858"/>',
    settings: '<path d="m9 3 1-1h4l1 3 3 1 3 3-1 3 1 3-3 3-3 1-1 3h-4l-1-3-3-1-3-3 1-3-1-3 3-3 3-1Z" fill="#d7edf2"/><circle cx="12" cy="12" r="3" fill="#fff"/>',
    book: '<path d="M12 5Q6 1 2 4v15q5-2 10 1 5-3 10-1V4q-4-3-10 1Z" fill="#fff2cb"/><path d="M12 5v15M5 7l4 1M5 11l4 1m6-4 4-1m-4 5 4-1"/>',
    sound: '<path d="M3 9h4l5-5v16l-5-5H3Z" fill="#ffdc71"/><path d="M16 8q4 4 0 8m3-11q7 7 0 14"/>',
    check: '<circle cx="12" cy="12" r="10" fill="#d7f4de"/><path d="m7 12 3 3 7-7"/>',
    gem: '<path d="m6 3-4 6 10 13L22 9l-4-6Z" fill="#94e2f2"/><path d="M2 9h20M6 3l6 19 6-19"/>',
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${shapes[name] || shapes.star}</svg>`;
}

// Les pictogrammes sont locaux : même dessin sur téléphone, tablette et ordinateur.
const STORY_PICTURES = {"🏝️": "1f3dd", "🐚": "1f41a", "🐠": "1f420", "🌴": "1f334", "🐬": "1f42c", "🌺": "1f33a", "🏴‍☠️": "1f3f4-200d-2620-fe0f", "💰": "1f4b0", "⚓": "2693", "🗺️": "1f5fa", "🦜": "1f99c", "🧭": "1f9ed", "🧊": "1f9ca", "💎": "1f48e", "❄️": "2744", "🐧": "1f427", "⛄": "26c4", "🐻‍❄️": "1f43b-200d-2744-fe0f", "🏔️": "1f3d4", "🍭": "1f36d", "🧁": "1f9c1", "🍬": "1f36c", "🍩": "1f369", "🍫": "1f36b", "🍓": "1f353", "🌙": "1f319", "🌟": "1f31f", "⭐": "2b50", "✨": "2728", "🌠": "1f320", "🪐": "1fa90", "🦉": "1f989", "🐱": "1f431", "🐶": "1f436", "🐭": "1f42d", "🐰": "1f430", "🐮": "1f42e", "🐷": "1f437", "🐵": "1f435", "🐸": "1f438", "🦁": "1f981", "🐻": "1f43b", "🐥": "1f425", "🐼": "1f43c", "🦊": "1f98a", "🐢": "1f422", "🍎": "1f34e", "🍌": "1f34c", "🥕": "1f955", "🍰": "1f370", "🍦": "1f366", "⚽": "26bd", "📖": "1f4d6", "🛏️": "1f6cf", "🥛": "1f95b", "🎩": "1f3a9", "🚲": "1f6b2", "🌸": "1f338", "🎸": "1f3b8", "🚗": "1f697", "🌧️": "1f327", "🐟": "1f41f", "🏠": "1f3e0", "🐑": "1f411", "🚂": "1f682", "🪶": "1fab6", "🦆": "1f986", "🎁": "1f381", "🎂": "1f382", "⛵": "26f5", "🏰": "1f3f0", "🐪": "1f42a", "🔨": "1f528", "🧥": "1f9e5", "🎃": "1f383", "🌲": "1f332", "🧼": "1f9fc", "🐝": "1f41d", "👂": "1f442", "🐌": "1f40c", "🌹": "1f339", "👗": "1f457", "🐄": "1f404", "☀️": "2600", "🦋": "1f98b", "🔑": "1f511", "🧀": "1f9c0", "🐔": "1f414", "😉": "1f609", "👀": "1f440", "💡": "1f4a1", "👸": "1f478", "😇": "1f607", "👦": "1f466", "👨": "1f468", "👩": "1f469", "🏫": "1f3eb", "⚾": "26be", "🦴": "1f9b4", "🛁": "1f6c1", "👧": "1f467", "😴": "1f634", "🎤": "1f3a4", "😺": "1f63a", "🍞": "1f35e", "🏖️": "1f3d6", "🙏": "1f64f", "👋": "1f44b", "🌳": "1f333", "💪": "1f4aa", "✏️": "270f", "🐦": "1f426", "🌊": "1f30a", "☝️": "261d", "✅": "2705", "❌": "274c", "🔄": "1f504", "👇": "1f447", "🎯": "1f3af", "👆": "1f446", "🔍": "1f50d", "🔢": "1f522", "✋": "270b", "🔵": "1f535", "🟠": "1f7e0", "⬅": "2b05", "📚": "1f4da", "🔊": "1f50a", "🏮": "1f3ee", "🗣️": "1f5e3", "▶️": "25b6", "🎲": "1f3b2", "🔔": "1f514", "🔕": "1f515", "🤫": "1f92b", "ℹ️": "2139", "⚠️": "26a0", "⚙️": "2699", "🔒": "1f512", "🔇": "1f507", "🔥": "1f525", "🤔": "1f914", "👍": "1f44d", "🏅": "1f3c5", "🔓": "1f513", "🏆": "1f3c6"};

function installArtwork() {
  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('fr', { granularity: 'grapheme' })
    : { segment: (text) => Array.from(text, (segment) => ({ segment })) };
  const excluded = 'script,style,svg,canvas,textarea,input,select,option,title,.picture';
  const decorate = (root) => {
    if (!root || !root.isConnected) return;
    const texts = [];
    const collect = (node) => {
      if (node.parentElement && !node.parentElement.closest(excluded) && /\p{Extended_Pictographic}/u.test(node.nodeValue || '')) texts.push(node);
    };
    if (root.nodeType === Node.TEXT_NODE) collect(root);
    else {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) collect(walker.currentNode);
    }
    texts.forEach((node) => {
      const parts = [...segmenter.segment(node.nodeValue)];
      if (!parts.some(({ segment }) => STORY_PICTURES[segment])) return;
      const fragment = document.createDocumentFragment();
      let plain = '';
      const flush = () => { if (plain) { fragment.append(document.createTextNode(plain)); plain = ''; } };
      parts.forEach(({ segment }) => {
        if (!STORY_PICTURES[segment]) { plain += segment; return; }
        flush();
        const image = document.createElement('img');
        image.className = 'picture'; image.src = `assets/pictures/${STORY_PICTURES[segment]}.svg`;
        image.alt = segment; image.draggable = false;
        fragment.append(image);
      });
      flush();
      node.replaceWith(fragment);
    });
  };
  decorate(document.body);
  new MutationObserver((records) => records.forEach((record) => {
    if (record.type === 'characterData') decorate(record.target);
    else record.addedNodes.forEach(decorate);
  })).observe(document.body, { childList: true, subtree: true, characterData: true });
}
