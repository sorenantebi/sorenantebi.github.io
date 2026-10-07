(() => {
// ---------- content: edit this block ----------
const SITE = {
  doors: [
    { id: 'mdr', x: 400, lines: ['BRAIN', 'SEGMENTATION'], sub: '', href: 'mdr/index.html', live: true },
    { id: 'wellness', x: 670, lines: ['ABOUT ME'], sub: '', room: 'room-wellness' },
    { id: 'od', x: 940, lines: ['PROJECTS'], sub: '', href: 'gallery/index.html' },
    { id: 'mail', x: 1210, lines: ['CONTACT'], sub: '', room: 'room-mail', phone: true },
  ],
  // Organisations, dates and names are placeholders: fill them in locally.
  resume: [
    {
      title: 'Experience',
      items: [
        {
          when: '06/2024 - present', what: 'Machine Learning Engineer', where: '[Fraunhofer IAIS · Bonn, Germany]',
          points: [
            'Built deep learning solutions with industry clients for automated inspection and quality control, cutting manual inspection time by more than 50% (PyTorch, OpenCV, C++).',
            'Led three or more machine vision projects end to end: system and hardware design, model selection and development, and client collaboration across CNN, ViT and multimodal models.',
            'Engineered a C++/Qt system for reflective-surface analysis with video-to-image reconstruction and custom detection models, coordinated over MQTT across 15+ cameras and 6 edge devices.',
            'Deployed ONNX models for C++ inference with OpenVINO and ONNX Runtime, reducing latency by 20%.',
            'Designed an OpenEvolve-based research agent for evolutionary auto-research on vision tasks.',
            'Part of a four-person team that won €100,000 in funding at an institute-wide hackathon for a computer vision robotics project.',
          ],
        },
        {
          when: '[Dates]', what: 'Research Assistant, Machine Learning', where: '[Organisation · City]',
          points: [
            'Trained and analysed 50+ deep learning models for disease detection on multi-label chest X-ray datasets, reaching up to 92% AUC (DenseNet, ResNet).',
            'Investigated fairness and subgroup bias in multi-task and domain-adversarial (DANN) models, using PCA on embeddings to visualise demographic disparities.',
            'Fine-tuned foundation models on large radiography datasets such as CheXpert and MIMIC-CXR and compared bias across 5+ datasets.',
            'Ran distributed training on HPC clusters with Slurm and PBS.',
          ],
        },
        {
          when: '[Dates]', what: 'Medical Assistant', where: '[Organisation · City]',
          points: [
            'Supported doctor–patient communication, scribing, blood draws and EKGs in a high-volume primary care practice, triaging 30+ patients a day.',
          ],
        },
      ],
    },
    {
      title: 'Education',
      items: [
        {
          when: '[Dates]', what: 'MSc Computer Science', where: '[University]',
          points: [
            '[Grade and thesis result]',
            'Thesis: Bias Analysis in Chest X-ray Disease Detection Models. Probed pre-trained TorchXRayVision classifiers with subgroup performance analysis and PCA / t-SNE feature exploration. Unfrozen models showed no compelling evidence of using sex or race to predict disease, though higher PCA modes revealed some subgroup disparities.',
            'Simulated label-noise bias in targeted subgroups and mitigated it with Domain Adversarial Neural Networks (gradient reversal and confusion-loss variants), recovering the unbiased state of most models at a modest performance cost.',
          ],
          link: { label: 'Thesis code and PDF', href: 'https://github.com/sorenantebi/chex-aIchemy' },
        },
        { when: '[Dates]', what: 'BSc Neuroscience', where: '[University]', points: ['[Grade and honours]', 'Undergraduate research in neural cell imaging analysis (Fiji/ImageJ), plus two summer research internships.'] },
      ],
    },
    {
      title: 'Publications',
      items: [
        {
          when: '2026', what: 'Hybrid Deep Learning for Traceability and Classification of Industrial Slate Tiles', where: 'IEEE IJCNN 2026 (accepted)',
          points: [
            'Lightweight hybrid model that re-identifies individual slate tiles and classifies their extraction site in one framework: an XFeat feature-matching branch alongside a MobileNetV3 classification branch.',
            'XFeat with a LightGlue matching head improves instance matching by +15.4% AUC; fusing features from both backbones raises site-classification accuracy by +10.9% over a standard MobileNetV3.',
            'Evaluated on a new industrial dataset of 2,610 slate-tile images from six extraction sites.',
          ],
          link: { label: 'arXiv 2607.04811', href: 'https://arxiv.org/abs/2607.04811' },
        },
      ],
    },
    {
      title: 'Projects',
      items: [
        {
          when: '[Date]', what: 'Medical claims agent', where: 'LangGraph · Langfuse · OpenTelemetry · Claude SDK',
          points: [
            'Architected a LangGraph agent with deterministic override gates, typed tool schemas and verbatim-excerpt grounding checks, traced with Langfuse and OpenTelemetry.',
            'Built a deterministic evaluation harness on a stratified golden set and designed a shadow-mode rollout workflow.',
          ],
        },
        {
          when: '[Date]', what: 'Brain tumour segmentation', where: 'C++ · LibTorch · JavaScript',
          points: ['Brain-tumour segmentation U-Net written from scratch in C++ and trained on BraTS; runs in the browser on this site.'],
          link: { label: 'Try it live', href: 'mdr/index.html' },
        },
        {
          when: '[Date]', what: 'Otsu and k-means thresholding', where: 'C++ · stb_image · no OpenCV',
          points: [
            "Implemented Otsu's method from scratch, picking the threshold that maximises between-class variance over the intensity histogram, and compared it with k-means intensity clustering and manual thresholds for segmenting dark regions per colour channel.",
            "Detected a bright line in an image by locating each column's peak intensity and fitting a linear regression with outlier filtering.",
          ],
          images: [
            { src: 'assets/otsu/car_input.jpg', caption: 'Input frame' },
            { src: 'assets/otsu/dark_red.jpg', caption: 'Dark regions, red channel' },
            { src: 'assets/otsu/dark_red_light_green.jpg', caption: 'Dark red + light green' },
            { src: 'assets/otsu/line_fit.jpg', caption: 'Bright-line fit' },
          ],
          link: { label: 'github.com/sorenantebi/otsu', href: 'https://github.com/sorenantebi/otsu' },
        },
      ],
    },
    { title: 'Languages', tags: ['C/C++', 'Python', 'JavaScript', 'HTML/CSS'] },
    { title: 'ML & libraries', tags: ['PyTorch', 'Lightning', 'LibTorch', 'Hugging Face Transformers', 'OpenCV', 'ONNX Runtime', 'OpenVINO', 'scikit-learn', 'NumPy', 'pandas', 'SciPy', 'Matplotlib', 'LLMs & agents', 'React', 'Bootstrap'] },
    { title: 'Tools', tags: ['Linux', 'CMake', 'Qt', 'Docker', 'Git', 'Slurm', 'Jupyter', 'MQTT', 'Jira', 'GCP'] },
    { title: 'Spoken', tags: ['English (fluent)', 'German (fluent)'] },
  ],
  // Concise homepage (top of the page). Bracketed text is a placeholder.
  cv: {
    role: 'Machine Learning Engineer · computer vision',
    intro: ["I'm a machine learning engineer and research scientist at the Fraunhofer Institute, specializing in computer vision. I build deep learning systems end to end, taking ideas from early research through proof of concept to production-ready products. What drives me is the chance to keep learning and to apply a broad range of deep learning methods to real-world problems.", "My recent research includes DL-based keypoint detection and feature matching for industrial slate tiles published to IJCNN 2026. Previously, I worked with Dr. Ben Glocker at Imperial College London, investigating bias in chest X-ray models. I also bring an interdisciplinary background, with hands-on clinical experience and research experience in neuroscience and biology."],
    links: [
      { label: 'GitHub', href: 'https://github.com/sorenantebi' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/soren-antebi/' },
      { label: 'CV (PDF)', href: 'assets/resume.pdf' },
      { label: 'Interactive version ↓', href: '#lift' },
    ],
    interests: ['Computer vision, object detection and image matching with DL', 'ML applications in biomedical imaging', 'Efficient inference on edge devices', 'Agentic AI for research and enterprise applications'],
    experience: [
      { org: 'Fraunhofer IAIS, Bonn, Germany', when: '06/2024 - present', role: 'Machine Learning Engineer', note: ['Machine vision for wide range of industry applications using deep learning (working with Daimler, VW, MAN, Henkel, scale-ups and start-ups).', 'Classical computer vision and image processing.', 'Object detection/damage detection, segmentation and classification.', 'Keypoint detection and matching using deep learning.', 'Agentic AI for autoresearch.', 'Deployment of deep learning models on edge devices using OpenVINO and ONNX Runtime.'] },
      { org: 'Imperial College London, London, UK', when: '03/2023 - 10/2023', role: 'Research Assistant, Machine Learning', note: ['Supervisor: Dr. Ben Glocker','Fine tuned chest X-ray disease detection models and studied subgroup bias in medical datasets.', 'Multi-head classification CNNs using PyTorch Lightning.', 'Domain Adversarial Neural Networks for bias mitigation from scratch using PyTorch.'] },
      { org: 'Inova Health, Washington DC, USA', when: '06/2021 - 06/2022', role: 'Medical Assistant', note: 'Scribing, patient triage, blood draws, front desk-duties and EKGs in high volume primary care practice.' },
    ],
    wetlab: [
      { org: 'College of William & Mary, Williamsburg, VA, USA', when: '08/2019 - 05/2021', role: 'Research Assistant', note: ['PI: Dr. Jennifer Bestman', 'Neural tectal cell analysis and imaging (Fiji/ImageJ)', 'Cell segmentation, plasmid design'] },
      { org: 'Rutgers University, New Brunswick, NJ, USA', when: '05/2019 - 06/2019', role: 'Research Intern', note: ['PI: Dr. Monica Driscoll', 'Molecular biology, exopher formation in C. elegans'] },
      { org: 'Max Planck Institute for Biology of Ageing, Cologne, Germany', when: '06/2017 - 08/2017', role: 'Research Intern', note: ['PI: Dr. Bjorn Schumacher', 'Genome stability in ageing, locomotion in C. elegans'] },
    ],
    education: [
      { org: 'Imperial College London, London, UK', when: '10/2022 - 10/2023', role: 'MSc Computer Science', note: 'Thesis: Bias Analysis in Chest X-ray Disease Detection Models', href: 'https://github.com/sorenantebi/chex-aIchemy' },
      { org: 'College of William & Mary, Williamsburg, VA, USA', when: '08/2017 - 05/2021', role: 'BSc Neuroscience' },
    ],
    publications: [
      { title: 'Hybrid Deep Learning for Traceability and Classification of Industrial Slate Tiles', venue: 'IEEE IJCNN 2026 (accepted)', href: 'https://arxiv.org/abs/2607.04811' },
    ],
    projects: [
      { name: 'Brain tumour segmentation', desc: 'U-Net from scratch in C++, BraTS dataset' },
      { name: 'Otsu & k-means thresholding', desc: 'C++ implementation' },
      { name: 'Medical claims agent', desc: 'LangGraph agent with grounding checks and an evaluation harness, OTel, LangFuse' },
    ],
  },
  about: [
    'I\'m a machine learning engineer with a focus on computer vision and deep learning applications in the industry. I love working at the intersection of ML research and software development, and love building things from an idea/theory into a tangible functional product.',
    'I have a multidisciplinary background in medicine, neuroscience, and machine learning.',
    'Outside of work I enjoy pixel art games (due to my pokemon and minecraft addiction as a kid), traveling, reading, league of legends (I hit challenger at last), and anime.',
    'I moved from Berlin to the US when I was 5, returned to Germany at 10, then completed my undergraduate degree in the US and my postgraduate degree in the UK.',
    'Favorite anime: Steins;Gate, Berserk, Neon Genesis Evangelion, Gurren Lagann and Attack on Titan.',
    'Goated pokemon games: Platinum and Emerald.',
    'Favorite movies: Casablanca, Godfather pt II, Whisper of the Heart, LOTR, Shrek 2, Scott Pilgrim vs. the World.'
  ],
  // About me badge (hallway popup). Tile images live in about/img/.
  badge: {
    role: 'Machine learning engineer',
    bio: 'I\'m a machine learning engineer at Fraunhofer IAIS with a focus on computer vision and deep learning applications in the industry. I love building things from an idea into a tangible, functional product. I genuinely enjoy learning about new models and technologies.',
    lived: 'Berlin → US (age 5) → Germany (age 10) → US for undergrad (William & Mary) → UK for my postgrad (Imperial College London).',
    tiles: [
      { id: 'anime', label: 'Anime', text: 'Favorite anime: Steins;Gate, Berserk, Neon Genesis Evangelion, Gurren Lagann and Attack on Titan.' },
      { id: 'games', label: 'Games', text: 'I enjoy making and playing pixel art games, thanks to my Pokemon and Minecraft addiction as a kid. Best Pokemon games: Platinum and Emerald.' },
      { id: 'league', label: 'League', text: 'League of Legends: I hit Challenger at last (top 150 EU).' },
      { id: 'movies', label: 'Movies', text: 'Favorite movies: Casablanca, Godfather pt II, Whisper of the Heart, LOTR, Shrek 2, Scott Pilgrim vs. the World.' },
      { id: 'travel', label: 'Travel', text: 'I love traveling, and I have lived in Germany, the US and the UK.' },
    ],
  },
  mailLead: 'Leave a memo for your outie.',
  contact: [
    { k: 'GitHub', label: 'github.com/sorenantebi', href: 'https://github.com/sorenantebi' },
    { k: 'LinkedIn', label: 'linkedin.com/in/soren-antebi', href: 'https://www.linkedin.com/in/soren-antebi/' },
  ],
};
// ----------------------------------------------


const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const W = 1510, H = 360, WALL_BASE = 280, FEET = 312;
const DOOR_W = 36, DOOR_H = 70, DOOR_Y = WALL_BASE - DOOR_H;
const SPR = 68, SPR_FOOT = 61, SPR_CX = 34;

/* ---------- sprites (PixelLab) ---------- */
const SRC = {
  idle: 'assets/char_idle.png?v=10', front: 'assets/char_front.png?v=10', back: 'assets/char_back.png?v=10',
  walk0: 'assets/char_walk_0.png?v=10', walk1: 'assets/char_walk_1.png?v=10', walk2: 'assets/char_walk_2.png?v=10',
  walk3: 'assets/char_walk_3.png?v=10', walk4: 'assets/char_walk_4.png?v=10', walk5: 'assets/char_walk_5.png?v=10',
  doorFrame: 'assets/door_frame.png', doorPanel: 'assets/door_panel.png',
  phone: 'assets/phone.png?v=1',
  cooler: 'assets/cooler.png', plant: 'assets/plant.png', bench: 'assets/bench.png',
  painting: 'assets/painting.png', crest: 'assets/crest_imperial.png?v=1', wm: 'assets/painting_wm.png?v=1',
};
const IMG = {};
const loadAll = () => Promise.all(Object.entries(SRC).map(([k, src]) => new Promise(res => {
  const im = new Image();
  im.onload = () => { IMG[k] = im; res(); };
  im.onerror = res;
  im.src = src;
})));

/* ---------- static world ---------- */
const world = document.createElement('canvas'); world.width = W; world.height = H;
function paint() {
  const g = world.getContext('2d');
  g.imageSmoothingEnabled = false;
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const dither = (x0, y0, w, h, c, step = 4) => {
    g.fillStyle = c;
    for (let y = y0; y < y0 + h; y += 2) for (let x = x0 + ((y >> 1) & 1) * (step >> 1); x < x0 + w; x += step) g.fillRect(x, y, 1, 1);
  };
  const put = (k, x, y) => { if (IMG[k]) g.drawImage(IMG[k], x, y); };
  const onFloor = (k, x, base = WALL_BASE + 2) => { if (IMG[k]) g.drawImage(IMG[k], x, base - IMG[k].height); };

  // ceiling
  R(0, 0, W, 62, '#f3f3ee');
  for (let x = 0; x < W; x += 80) R(x, 0, 1, 62, '#ebebe5');
  for (let x = 30; x < W; x += 160) { R(x, 20, 100, 12, '#d6d6cd'); R(x + 2, 22, 96, 8, '#fffff7'); R(x + 2, 22, 96, 1, '#ffffff'); }
  R(0, 62, W, 2, '#d4d3ca'); R(0, 64, W, 2, '#f7f7f2');
  // wall
  R(0, 66, W, 206, '#ebeae3');
  R(0, 66, W, 10, '#f0efe9');
  R(0, 236, W, 36, '#e6e5dd'); dither(0, 236, W, 36, '#e1e0d8', 6);
  R(0, 272, W, 8, '#cfcdc3'); R(0, 272, W, 1, '#dcdad1');
  // carpet
  R(0, WALL_BASE, W, H - WALL_BASE, '#4d7c63'); dither(0, WALL_BASE, W, H - WALL_BASE, '#477459');
  R(0, WALL_BASE, W, 3, '#3f6a53');
  // corridor ends
  R(0, 66, 20, 214, '#dedcd4'); R(20, 66, 2, 214, '#cfcdc3');
  R(W - 20, 66, 20, 214, '#dedcd4'); R(W - 22, 66, 2, 214, '#cfcdc3');
  // ceiling vents, fire alarm
  for (const x of [220, 790, 1350]) { R(x, 36, 24, 12, '#dcdcd4'); for (let i = 0; i < 3; i++) R(x + 2, 38 + i * 4, 20, 2, '#c7c7be'); }
  R(610, 88, 12, 16, '#c94b3e'); R(612, 90, 8, 4, '#e6806f'); R(614, 98, 4, 4, '#f0d8d2');
  // directory board post
  R(20, 104, 4, 148, '#c3c1b8');

  // doors
  for (const d of SITE.doors) {
    if (d.phone) {
      const tx = d.x + DOOR_W / 2 - 28;
      R(tx + 2, WALL_BASE, 52, 2, '#3c6650');
      R(tx + 4, 252, 3, 28, '#5b4330'); R(tx + 49, 252, 3, 28, '#5b4330');
      R(tx, 246, 56, 6, '#8a6a4a'); R(tx, 246, 56, 1, '#a88664'); R(tx, 252, 56, 1, '#4c3826');
      continue;
    }
    R(d.x - 2, WALL_BASE, DOOR_W + 4, 2, '#3c6650');
    drawDoor(g, d, 0);
  }
  // props
  onFloor('cooler', 352);
  // Imperial College London shield on a wooden plaque
  R(531, 106, 50, 58, '#2b2018'); R(532, 107, 48, 56, '#6b4b33'); R(532, 107, 48, 1, '#8a6446'); R(532, 107, 1, 56, '#8a6446');
  put('crest', 537, 112);
  onFloor('bench', 531, WALL_BASE + 8);
  put('painting', 785, 122);
  put('wm', 1048, 120);
  onFloor('plant', 1115);
  onFloor('plant', 1350);
  onFloor('cooler', 1430);
}

function drawDoor(g, d, open) {
  const x = d.x, y = DOOR_Y;
  if (open > 0) {
    g.fillStyle = d.live ? '#0b2a26' : '#1d2420'; g.fillRect(x + 2, y + 2, 32, 68);
    if (d.live) { g.fillStyle = 'rgba(127,224,184,.3)'; g.fillRect(x + 6, y + 10, 24, 56); }
  }
  if (IMG.doorPanel) {
    const w = Math.max(4, Math.round(32 * (1 - open * 0.84)));
    g.drawImage(IMG.doorPanel, x + 2, y + 2, w, 68);
    if (open > 0) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 2 + w - 2, y + 2, 2, 68); }
  }
  if (d.live && open === 0) {
    g.fillStyle = '#163b30'; g.fillRect(x + 9, y + 9, 18, 12);
    g.fillStyle = '#7fe0b8'; g.fillRect(x + 10, y + 10, 16, 10);
    g.fillStyle = '#c8f7e2'; g.fillRect(x + 10, y + 10, 16, 1);
  }
  if (IMG.doorFrame) g.drawImage(IMG.doorFrame, x, y);
}

function drawPlayer(g, ox) {
  const x = Math.round(player.x + ox), y = FEET;
  g.globalAlpha = player.alpha;
  g.fillStyle = 'rgba(0,0,0,.16)';
  g.fillRect(x - 9, y - 1, 18, 3); g.fillRect(x - 6, y - 2, 12, 5);
  let im, flip = false;
  if (player.dir === 'up') im = IMG.back;
  else if (player.dir === 'down') im = IMG.front;
  else {
    im = player.walking ? IMG['walk' + (player.step % 6)] : IMG.idle;
    flip = player.dir === 'left';
  }
  if (im) {
    const dy = y - SPR_FOOT - Math.round(player.lift);
    if (flip) { g.save(); g.translate(x, 0); g.scale(-1, 1); g.drawImage(im, -SPR_CX, dy); g.restore(); }
    else g.drawImage(im, x - SPR_CX, dy);
  }
  g.globalAlpha = 1;
}

/* ---------- DOM ---------- */
const cv = $('#cv'), ctx = cv.getContext('2d'), labels = $('#labels'), help = $('#help'), whiteout = $('#whiteout');
const directory = $('#directory');
const doorEls = SITE.doors.map(d => {
  const el = document.createElement('div');
  el.className = 'plaque' + (d.live ? ' live' : '');
  el.innerHTML = d.lines.map(() => '<b></b>').join('') + '<small></small>';
  el.querySelectorAll('b').forEach((b, i) => { b.textContent = d.lines[i]; });
  if (d.sub) el.querySelector('small').textContent = d.sub; else el.querySelector('small').remove();
  labels.appendChild(el);
  return el;
});
const prompt = document.createElement('div'); prompt.className = 'prompt'; prompt.hidden = true; labels.appendChild(prompt);
const hoverTag = document.createElement('div'); hoverTag.className = 'prompt hovertag'; hoverTag.hidden = true; labels.appendChild(hoverTag);
let hoverDoor = -1, phoneRingUntil = 0;
SITE.doors.forEach((d, i) => {
  const li = document.createElement('li'), db = document.createElement('button');
  db.innerHTML = '<span class="n"></span><span class="t"></span><span class="m"></span>';
  db.querySelector('.n').textContent = String(i + 1).padStart(2, '0');
  db.querySelector('.t').textContent = d.lines.join(' ');
  db.lastChild.textContent = '→';
  db.addEventListener('click', () => { db.blur(); goTo(d); });
  li.appendChild(db);
  $('#dirlist').appendChild(li);
});
$('#dirHow').innerHTML = coarse
  ? 'OR TAP THE FLOOR TO WALK YOURSELF'
  : 'OR WALK YOURSELF: <kbd>&larr;</kbd><kbd>&rarr;</kbd> MOVE &nbsp; <kbd>&uarr;</kbd> ENTER';
help.innerHTML = coarse ? 'Tap a door to enter · tap the floor to walk' : '&larr; &rarr; walk &nbsp;·&nbsp; &uarr; enter &nbsp;·&nbsp; &darr; face front';

// rooms
const CONTACT_ROWS = [...SITE.contact, { k: 'Email', label: 'soren.antebi@proton.me', href: '#' }, { k: 'CV', label: 'Download PDF', href: 'assets/resume.pdf' }].map(c => (c.href === '#' && /@/.test(c.label)) ? { ...c, href: 'mailto:' + c.label } : c);
(function badge() {
  const B = SITE.badge;
  $('#badgeRole').textContent = B.role; $('#badgeBio').textContent = B.bio; $('#badgeLived').textContent = B.lived;
  // ID photo: assets/id_photo.png if present (made by tools/pixelate_photo.sh), else the walking sprite's head
  const pcv = $('#badgePortrait'), pc = pcv.getContext('2d'); pc.imageSmoothingEnabled = false;
  const photo = new Image();
  photo.onload = () => { pcv.width = photo.naturalWidth; pcv.height = photo.naturalHeight; pc.drawImage(photo, 0, 0); };
  photo.onerror = () => {
    const face = new Image(); face.onload = () => {
      const g = pc.createLinearGradient(0, 0, 0, 52); g.addColorStop(0, '#cfe3d6'); g.addColorStop(1, '#9fc4ae');
      pc.fillStyle = g; pc.fillRect(0, 0, 44, 52); pc.drawImage(face, 18, 4, 32, 40, 6, 10, 32, 40);
    };
    face.src = SRC.front;
  };
  photo.src = 'assets/id_photo.png?v=4';
  // every text sits in the same grid cell, so the box is always as tall as the longest one
  const detail = $('#tileDetail'), tiles = $('#badgeTiles');
  const hint = document.createElement('span'); hint.textContent = 'Click a tile to see more.'; hint.className = 'shown hint';
  detail.replaceChildren(hint);
  B.tiles.forEach(t => {
    const txt = document.createElement('span'); txt.textContent = t.text; detail.appendChild(txt);
    const b = document.createElement('button'); b.className = 'tile'; b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<img alt="" width="60" height="44"><span></span>';
    b.querySelector('img').src = 'about/img/' + t.id + '.png?v=3';
    b.querySelector('span').textContent = t.label;
    b.addEventListener('click', () => {
      tiles.querySelectorAll('.tile').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      detail.querySelectorAll('span').forEach(x => x.classList.toggle('shown', x === txt));
    });
    tiles.appendChild(b);
  });
})();
function renderResume(rList) {
for (const sec of SITE.resume) {
  const el = document.createElement('section'); el.className = 'r-sec';
  const h = document.createElement('h3'); h.textContent = sec.title; el.appendChild(h);
  if (sec.tags) {
    const ul = document.createElement('ul'); ul.className = 'r-tags';
    sec.tags.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    el.appendChild(ul);
  } else {
    const ul = document.createElement('ul'); ul.className = 'r-items';
    for (const it of sec.items) {
      const li = document.createElement('li'); li.className = 'r-item';
      li.innerHTML = '<div class="r-when"></div><div><div class="r-what"></div><div class="r-where"></div></div>';
      li.querySelector('.r-when').textContent = it.when || '';
      li.querySelector('.r-what').textContent = it.what || '';
      li.querySelector('.r-where').textContent = it.where || '';
      if (it.points && it.points.length) {
        const pl = document.createElement('ul');
        it.points.forEach(p => { const pi = document.createElement('li'); pi.textContent = p; pl.appendChild(pi); });
        li.appendChild(pl);
      }
      if (it.images && it.images.length) {
        const g = document.createElement('div'); g.className = 'r-gallery';
        for (const im of it.images) {
          const fig = document.createElement('figure'), a = document.createElement('a'), img = document.createElement('img'), cap = document.createElement('figcaption');
          a.href = im.src; a.target = '_blank'; a.rel = 'noopener';
          img.src = im.src; img.alt = im.caption; img.loading = 'lazy';
          cap.textContent = im.caption;
          a.appendChild(img); fig.append(a, cap); g.appendChild(fig);
        }
        li.appendChild(g);
      }
      if (it.link) {
        const a = document.createElement('a'); a.className = 'r-link';
        a.textContent = it.link.label + (/^https?:/.test(it.link.href) ? ' ↗' : ' →');
        a.href = it.link.href;
        if (/^https?:/.test(it.link.href)) { a.target = '_blank'; a.rel = 'noopener'; }
        else a.addEventListener('click', e => { e.preventDefault(); leaveTo(it.link.href); });
        li.appendChild(a);
      }
      ul.appendChild(li);
    }
    el.appendChild(ul);
  }
  rList.appendChild(el);
}
}
renderResume($('#r-list'));
(function renderHome() {
  const cv = SITE.cv, el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const link = (text, href) => { const a = el('a', null, text); a.href = href; if (/^https?:|\.pdf$/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } return a; };
  $('#cv-role').textContent = cv.role;
  cv.links.forEach(l => { const li = el('li'); li.appendChild(link(l.label, l.href)); $('#cv-links').appendChild(li); });
  const home = $('#cv-home');
  const block = title => { const s = el('section', 'block'); s.appendChild(el('h2', null, title)); home.appendChild(s); return s; };
  // intro without a heading, so it doesn't repeat the About me tab
  const intro = el('section', 'block'); [].concat(cv.intro).forEach(t => intro.appendChild(el('p', null, t))); home.appendChild(intro);
  const ints = el('ul', 'dots'); cv.interests.forEach(t => ints.appendChild(el('li', null, t))); block('Interests').appendChild(ints);
  const lines = (title, items, fmt) => { const ul = el('ul', 'cv-lines'); items.forEach(it => { const li = el('li'); fmt(li, it); ul.appendChild(li); }); block(title).appendChild(ul); };
  const posLine = (li, it) => {
    li.appendChild(el('b', null, it.org)); li.append(' '); li.appendChild(el('span', 'when', '(' + it.when + ')')); li.append(' '); li.appendChild(el('span', null, it.role));
    [].concat(it.note || []).forEach((t, i) => { li.appendChild(el('br')); const n = el('span', 'sub'); n.appendChild(it.href && i === 0 ? link(t, it.href) : document.createTextNode(t)); li.appendChild(n); });
  };
  lines('Professional Experience', cv.experience, posLine);
  lines('Biological Research Experience', cv.wetlab, posLine);
  lines('Education', cv.education, posLine);
  lines('Publications', cv.publications, (li, it) => { li.appendChild(link(it.title, it.href)); li.appendChild(el('br')); li.appendChild(el('span', 'sub', it.venue)); });
  lines('Projects', cv.projects, (li, it) => { li.appendChild(it.href ? link(it.name, it.href) : el('b', null, it.name)); li.append(' · ' + it.desc); });
})();
SITE.about.forEach(t => { const p = document.createElement('p'); p.textContent = t; $('#site-about').appendChild(p); });
CONTACT_ROWS.forEach(c => {
  const li = document.createElement('li'); const b = document.createElement('b'); b.textContent = c.k + ': ';
  const a = document.createElement('a'); a.textContent = c.label; a.href = c.href; if (/^https?:|\.pdf$/.test(c.href)) { a.target = '_blank'; a.rel = 'noopener'; }
  li.append(b, a); $('#site-contact').appendChild(li);
});
document.querySelectorAll('.tabs [role="tab"]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tabs [role="tab"]').forEach(t => {
    const on = t === tab; t.setAttribute('aria-selected', String(on));
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}));
$('#pdfToggle').addEventListener('click', e => {
  const btn = e.currentTarget, pane = $('#r-pdf'), open = pane.hidden;
  pane.hidden = !open;
  $('#r-layout').classList.toggle('split', open);
  $('#r-wrap').classList.toggle('split', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'Hide PDF' : 'Show PDF';
  const f = pane.querySelector('iframe');
  if (open && f.src === 'about:blank') f.src = 'assets/resume.pdf';
});

for (const c of CONTACT_ROWS) {
  const row = document.createElement('div'); row.className = 'row';
  row.innerHTML = '<span class="k"></span><a></a>';
  row.querySelector('.k').textContent = c.k;
  const a = row.querySelector('a'); a.textContent = c.label; a.href = c.href;
  if (/^https?:|\.pdf$/.test(c.href)) { a.target = '_blank'; a.rel = 'noopener'; }
  $('#m-rows').appendChild(row);
}

/* ---------- state ---------- */
const player = { x: 210, dir: 'down', step: 0, acc: 0, alpha: 1, lift: 0, target: null, pending: null, walking: false };
const doorOpen = SITE.doors.map(() => 0);
const keys = { left: false, right: false };
let s = 2, viewW = 720, top = 0, camX = 0, busy = false, openRoom = null, moved = false, ready = false;

const hall = $('#hall');
function layout() {
  const vw = hall.clientWidth, vh = hall.clientHeight;
  const v = Math.min(vh / H, Math.max(vw / 720, 1.2));
  s = v >= 2 ? Math.floor(v) : v;
  viewW = Math.ceil(vw / s);
  top = Math.round((vh - H * s) / 2);
  cv.width = viewW; cv.height = H;
  Object.assign(cv.style, { width: viewW * s + 'px', height: H * s + 'px', top: top + 'px' });
  ctx.imageSmoothingEnabled = false;
  doorEls.forEach(el => { el.style.fontSize = (7 * s) + 'px'; el.style.padding = (1.8 * s) + 'px ' + (3.2 * s) + 'px'; });
  directory.style.fontSize = Math.round(7.8 * s) + 'px';
  prompt.style.fontSize = Math.max(10, 5.6 * s) + 'px';
}
addEventListener('resize', layout);

function updateCam() {
  const px = Math.round(player.x);
  camX = viewW >= W ? Math.round((W - viewW) / 2) : Math.max(0, Math.min(W - viewW, px - Math.floor(viewW / 2)));
}
const sx = wx => (wx - camX) * s, sy = wy => top + wy * s;
const doorCenter = d => d.x + DOOR_W / 2;
const nearDoor = () => SITE.doors.findIndex(d => Math.abs(doorCenter(d) - player.x) < 22);
function noteMoved() { moved = true; }

/* ---------- loop ---------- */
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(50, now - last); last = now;
  if (!ready) return;
  let vx = 0;
  if (!busy && !openRoom) {
    if (keys.left) vx -= 1;
    if (keys.right) vx += 1;
    if (vx) { player.target = null; player.pending = null; }
    else if (player.target != null) {
      const dx = player.target - player.x;
      if (Math.abs(dx) < 2) {
        player.x = player.target; player.target = null;
        if (player.pending != null) { const d = SITE.doors[player.pending]; player.pending = null; enter(d); }
      } else vx = Math.sign(dx);
    }
    if (vx) {
      const nx = Math.max(30, Math.min(W - 30, player.x + vx * dt * 0.19));
      player.acc += Math.abs(nx - player.x);
      player.x = nx;
      player.dir = vx > 0 ? 'right' : 'left';
      player.step = Math.floor(player.acc / 16);
      noteMoved();
    }
  }
  player.walking = !!vx;
  updateCam();
  render(now);
}

function render(now) {
  const ox = -camX;
  ctx.clearRect(0, 0, viewW, H);
  ctx.drawImage(world, ox, 0);
  SITE.doors.forEach((d, i) => {
    if (doorOpen[i] <= 0) return;
    ctx.save(); ctx.translate(ox, 0); drawDoor(ctx, d, doorOpen[i]); ctx.restore();
  });
  for (const d of SITE.doors) {
    if (!d.phone || !IMG.phone) continue;
    const ringing = performance.now() < phoneRingUntil;
    const jx = ringing ? Math.round(Math.sin(performance.now() / 22) * 1.5) : 0, jy = ringing ? -1 : 0;
    ctx.drawImage(IMG.phone, Math.round(d.x + DOOR_W / 2 - 26 + ox + jx), 213 + jy);
    if (ringing && Math.floor(performance.now() / 160) % 2 === 0) {
      ctx.fillStyle = '#1f2b24'; const cx = d.x + DOOR_W / 2 + ox;
      ctx.fillRect(cx - 36, 214, 2, 6); ctx.fillRect(cx - 40, 212, 2, 10); ctx.fillRect(cx + 34, 214, 2, 6); ctx.fillRect(cx + 38, 212, 2, 10);
    }
  }
  if (hoverDoor >= 0 && !busy && !openRoom) {
    const d = SITE.doors[hoverDoor];
    const b = d.phone ? [d.x + DOOR_W / 2 - 32, 206, 64, 76] : [d.x - 4, DOOR_Y - 4, DOOR_W + 8, DOOR_H + 4];
    ctx.fillStyle = 'rgba(125,255,178,.16)'; ctx.fillRect(b[0] + ox, b[1], b[2], b[3]);
    ctx.strokeStyle = '#3ee07a'; ctx.lineWidth = 2; ctx.strokeRect(b[0] + ox + 1, b[1] + 1, b[2] - 2, b[3] - 1);
  }
  drawPlayer(ctx, ox);

  SITE.doors.forEach((d, i) => {
    doorEls[i].style.left = sx(doorCenter(d)) + 'px';
    doorEls[i].style.top = sy(170) + 'px';
  });
  // centred between the left wall and the first door
  directory.style.left = Math.max(sx(22), sx((22 + SITE.doors[0].x) / 2) - directory.offsetWidth / 2) + 'px';
  directory.style.top = sy(68) + 'px';
  const n = busy || openRoom ? -1 : nearDoor();
  if (n >= 0) {
    const d = SITE.doors[n];
    prompt.hidden = false;
    prompt.textContent = d.phone ? (coarse ? 'Tap to call' : '↑ Use the phone') : (coarse ? 'Tap to enter ' : '↑ Enter ') + d.lines.join(' ').toLowerCase();
    prompt.style.left = sx(doorCenter(d)) + 'px';
    prompt.style.top = sy(FEET - 64) + 'px';
  } else prompt.hidden = true;
  doorEls.forEach((el, i) => el.classList.toggle('hover', i === hoverDoor && !busy && !openRoom));
  if (hoverDoor >= 0 && !busy && !openRoom && hoverDoor !== n) {
    const d = SITE.doors[hoverDoor];
    hoverTag.hidden = false; hoverTag.textContent = d.phone ? 'Click to call' : 'Click to enter ' + d.lines.join(' ').toLowerCase();
    hoverTag.style.left = sx(doorCenter(d)) + 'px'; hoverTag.style.top = sy(160) + 'px';
  } else hoverTag.hidden = true;
}

/* ---------- transitions ---------- */
function tween(ms, fn) {
  if (reduced) { fn(1); return Promise.resolve(); }
  return new Promise(res => {
    const t0 = performance.now();
    (function step(t) { const k = Math.min(1, (t - t0) / ms); fn(k); k < 1 ? requestAnimationFrame(step) : res(); })(t0);
  });
}
function white(on, ms = 600) {
  whiteout.style.transitionDuration = (reduced ? 0 : ms) + 'ms';
  whiteout.style.opacity = on ? 1 : 0;
  return sleep(reduced ? 0 : ms);
}

async function enter(d) {
  if (busy) return;
  busy = true;
  const i = SITE.doors.indexOf(d);
  player.x = doorCenter(d); player.dir = 'up';
  if (d.phone) {
    phoneRingUntil = performance.now() + (reduced ? 0 : 750);
    await sleep(reduced ? 0 : 750);
    showRoom(d); player.dir = 'down'; busy = false;
    return;
  }
  await tween(320, k => { doorOpen[i] = k; });
  if (d.room && $('#' + d.room).classList.contains('modal')) {
    showRoom(d); player.dir = 'down';
    tween(300, k => { doorOpen[i] = 1 - k; });
    busy = false; return;
  }
  await tween(420, k => { player.alpha = 1 - k; player.lift = k * 6; });
  if (d.href) { await white(true, 550); location.href = d.href; return; }
  await white(true, 350);
  showRoom(d);
  doorOpen[i] = 0; player.alpha = 1; player.lift = 0; player.dir = 'down';
  await white(false, 450);
  busy = false;
}
async function leaveTo(href) { busy = true; await white(true, 450); location.href = href; }

function showRoom(d) {
  openRoom = $('#' + d.room);
  openRoom.hidden = false;
  openRoom.scrollTop = 0;
  openRoom.querySelectorAll('iframe[data-src]').forEach(f => { if (f.src === 'about:blank') f.src = f.dataset.src; });
  history.replaceState(null, '', '#' + d.id);
  openRoom.querySelector('[data-back]').focus({ preventScroll: true });
}
async function closeRoom() {
  if (!openRoom || busy) return;
  if (openRoom.classList.contains('modal')) {
    openRoom.hidden = true; openRoom = null;
    history.replaceState(null, '', location.pathname);
    return;
  }
  busy = true;
  await white(true, 280);
  openRoom.hidden = true; openRoom = null;
  history.replaceState(null, '', location.pathname);
  player.dir = 'down';
  await white(false, 420);
  busy = false;
}
document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', closeRoom));
document.querySelectorAll('.room.modal').forEach(r => r.addEventListener('click', e => { if (e.target === e.currentTarget) closeRoom(); }));

const START_X = 210;
async function toStart() {
  if (busy || openRoom) return;
  busy = true;
  player.target = null; player.pending = null; keys.left = keys.right = false;
  await white(true, 220);
  player.x = START_X; player.dir = 'down'; player.acc = 0; player.step = 0;
  await white(false, 320);
  busy = false;
}
$('#tostart').addEventListener('click', e => { e.currentTarget.blur(); toStart(); });

function goTo(d) {
  if (busy || openRoom) return;
  player.target = doorCenter(d);
  player.pending = SITE.doors.indexOf(d);
  noteMoved();
}

/* ---------- elevator ride (scroll-driven, with a moving shaft) ---------- */
(function lift() {
  const sec = $('#lift'); if (!sec) return;
  const floorEl = $('#liftFloor'), cap = $('#liftCaption'), hint = $('#downHint'), track = $('#shaftTrack');
  const dots = [...document.querySelectorAll('#liftDots i')];
  const FLOORS = ['LOBBY', 'B1', 'B2', 'SEVERED FLOOR'];
  const LABELS = ['L', 'B1', 'B2', 'SF'];
  LABELS.forEach(t => { const f = document.createElement('div'); f.className = 'shaft-floor'; const sp = document.createElement('span'); sp.textContent = t; f.appendChild(sp); track.appendChild(f); });
  const CLOSE_END = 0.14, RIDE_END = 0.8, OPEN_END = 0.95;
  let ticking = false;
  function update() {
    ticking = false;
    const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, -r.top / span));
    let close;
    if (p < CLOSE_END) close = p / CLOSE_END;
    else if (p < RIDE_END) close = 1;
    else close = Math.max(0, 1 - (p - RIDE_END) / (OPEN_END - RIDE_END));
    const ride = Math.max(0, Math.min(1, (p - CLOSE_END) / (RIDE_END - CLOSE_END)));
    const moving = p > CLOSE_END && p < RIDE_END;
    const fpos = ride * (FLOORS.length - 1);
    const idx = Math.min(FLOORS.length - 1, Math.round(fpos));
    const seam = moving ? Math.max(0, 1 - Math.abs((fpos % 1) - 0.5) * 5) * 0.9 : 0;
    sec.style.setProperty('--close', close.toFixed(3));
    sec.style.setProperty('--seam', seam.toFixed(3));
    sec.style.setProperty('--ride', ride.toFixed(4));
    sec.style.setProperty('--span', ((FLOORS.length - 1) * innerHeight) + 'px');
    sec.classList.toggle('moving', moving);
    sec.classList.toggle('arrived', p >= RIDE_END);
    floorEl.textContent = FLOORS[idx];
    dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    cap.textContent = p < CLOSE_END * 0.5 ? 'Scroll to take the elevator down to the interactive version'
      : moving ? 'Going down…' : p >= RIDE_END ? 'Doors opening. Keep scrolling to step out.' : 'Doors closing…';
    hint.classList.toggle('gone', r.top < innerHeight * 0.8);
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  // links to #lift take the whole ride: auto-scroll through the elevator into the hallway
  let autoRaf = 0;
  const stopAuto = () => { if (autoRaf) { cancelAnimationFrame(autoRaf); autoRaf = 0; document.documentElement.style.scrollBehavior = ''; } };
  function rideDown() {
    stopAuto();
    const start = scrollY, end = hall.getBoundingClientRect().top + scrollY, dist = end - start;
    if (dist <= 0 || reduced) { hall.scrollIntoView({ block: 'start' }); return; }
    const dur = Math.max(1800, Math.min(5200, dist / innerHeight * 1100));
    const t0 = performance.now();
    document.documentElement.style.scrollBehavior = 'auto';
    const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      scrollTo(0, start + dist * ease(k));
      if (k < 1) autoRaf = requestAnimationFrame(step); else stopAuto();
    })(t0);
  }
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(ev => addEventListener(ev, e => {
    if (ev === 'mousedown' && e.target.closest('a[href="#lift"]')) return;
    stopAuto();
  }, { passive: true }));
  document.querySelectorAll('a[href="#lift"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); rideDown(); }));
  update();
})();

/* ---------- input ---------- */
let hallActive = false;
new IntersectionObserver(es => { hallActive = es[0].intersectionRatio >= 0.6; if (!hallActive) keys.left = keys.right = false; }, { threshold: [0, 0.6, 1] }).observe(hall);
addEventListener('keydown', e => {
  if (openRoom) { if (e.key === 'Escape') closeRoom(); return; }
  if (!hallActive) return;
  const k = e.key;
  const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'a', 'A', 'd', 'D', 'w', 'W', 's', 'S'];
  const inDirectory = document.activeElement && document.activeElement.closest('#directory');
  if (GAME_KEYS.includes(k) && !inDirectory) {
    e.preventDefault();
    if (Math.abs(hall.getBoundingClientRect().top) > 2) hall.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  if (k === 'Home') { e.preventDefault(); toStart(); return; }
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; e.preventDefault(); }
  else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; e.preventDefault(); }
  else if ((k === 'ArrowDown' || k === 's' || k === 'S') && !busy) { e.preventDefault(); player.target = null; player.pending = null; player.dir = 'down'; }
  else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === 'Enter' || k === ' ') {
    if (document.activeElement && document.activeElement.closest('#directory')) return;
    const n = nearDoor();
    if (n >= 0 && !busy) { e.preventDefault(); enter(SITE.doors[n]); }
  }
});
addEventListener('keyup', e => {
  const k = e.key;
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
  if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
});
addEventListener('blur', () => { keys.left = keys.right = false; });

function local(e) { const r = hall.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function doorAt(clientX, clientY) {
  const wx = camX + clientX / s, wy = (clientY - top) / s;
  return SITE.doors.find(d => wx >= d.x - 6 && wx <= d.x + DOOR_W + 6 && wy >= 160 && wy <= WALL_BASE + 6);
}
cv.addEventListener('click', e => {
  if (busy || openRoom) return;
  const [lx, ly] = local(e);
  const d = doorAt(lx, ly);
  if (d) { goTo(d); return; }
  player.pending = null;
  player.target = Math.max(30, Math.min(W - 30, camX + lx / s));
  noteMoved();
});
cv.addEventListener('mousemove', e => { const [lx, ly] = local(e); const d = doorAt(lx, ly); hoverDoor = d ? SITE.doors.indexOf(d) : -1; cv.style.cursor = d ? 'pointer' : 'default'; });
cv.addEventListener('mouseleave', () => { hoverDoor = -1; });

/* ---------- start ---------- */
function arrive() {
  const d = SITE.doors.find(x => x.id === location.hash.slice(1));
  if (!d) return;
  hall.scrollIntoView({ behavior: 'instant', block: 'start' });
  player.x = doorCenter(d); player.dir = 'down';
  if (d.room) { showRoom(d); return; }
  const i = SITE.doors.indexOf(d);
  doorOpen[i] = 1;
  tween(500, k => { doorOpen[i] = 1 - k; }).then(() => history.replaceState(null, '', location.pathname));
}
layout();
requestAnimationFrame(frame);
loadAll().then(() => {
  paint();
  arrive();
  ready = true;
  requestAnimationFrame(() => white(false, 700));
});
addEventListener('pageshow', e => {
  if (!e.persisted) return;
  busy = false; player.alpha = 1; player.lift = 0; player.dir = 'down';
  doorOpen.fill(0);
  white(false, 500);
});
})();
