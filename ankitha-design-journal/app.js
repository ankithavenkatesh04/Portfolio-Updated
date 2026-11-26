const { useState, useEffect, useRef } = React;
const h = React.createElement;

/* Web Audio Sound Effects */
let AC = null;
function getAC() {
  if (!AC) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) AC = new Ctx();
  }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}

function pageSound() {
  try {
    const c = getAC();
    if (!c) return;
    const n = c.currentTime;
    const b = c.createBuffer(1, Math.ceil(c.sampleRate * 0.12), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI);
    const s = c.createBufferSource();
    const f = c.createBiquadFilter();
    const g = c.createGain();
    f.type = 'bandpass';
    f.frequency.value = 1400;
    g.gain.setValueAtTime(0.14, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + 0.12);
    s.buffer = b;
    s.connect(f);
    f.connect(g);
    g.connect(c.destination);
    s.start(n);
  } catch (e) {}
}

function dtmfNote(freq, dur = 0.14, type = 'sine') {
  try {
    const c = getAC();
    if (!c) return;
    const n = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, n);
    g.gain.setValueAtTime(0.12, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(n);
    o.stop(n + dur + 0.02);
  } catch (e) {}
}

function playDrumSound(t) {
  try {
    const c = getAC();
    if (!c) return;
    const n = c.currentTime;
    const g = c.createGain();
    g.connect(c.destination);

    const tone = (f0, f1, len, v) => {
      const o = c.createOscillator();
      o.frequency.setValueAtTime(f0, n);
      o.frequency.exponentialRampToValueAtTime(f1, n + len * 0.7);
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + len);
      o.connect(g);
      o.start(n);
      o.stop(n + len + 0.02);
    };

    const noise = (hp, len, v) => {
      const b = c.createBuffer(1, Math.ceil(c.sampleRate * len), c.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const s = c.createBufferSource();
      const f = c.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = hp;
      s.buffer = b;
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + len);
      s.connect(f);
      f.connect(g);
      s.start(n);
    };

    const kit = {
      Bass: () => tone(150, 42, 0.32, 0.75),
      'High tom': () => tone(260, 155, 0.25, 0.55),
      'Mid tom': () => tone(200, 118, 0.28, 0.55),
      'Low tom': () => tone(145, 78, 0.34, 0.6),
      Snare: () => { noise(1500, 0.18, 0.42); tone(210, 145, 0.1, 0.2); },
      'Hi-hat': () => noise(7000, 0.06, 0.32),
      Ride: () => noise(5500, 0.65, 0.25),
      Crash: () => noise(3400, 1.0, 0.32)
    };
    if (kit[t]) kit[t]();
  } catch (e) {}
}

/* Portfolio Data */
const NAV_GROUPS = [
  ['about', 'About', '#a9c9bd'],
  ['experience', 'Experience', '#e6cf92'],
  ['work', 'Projects', '#e9b8aa'],
  ['skills', 'Skills', '#c9bfe0'],
  ['contact', 'Let’s Talk', '#a9c9bd']
];

const CHAPTER_GROUP = {
  about: 'about',
  experience: 'experience',
  work: 'work',
  skills: 'skills',
  'kind-words': 'work',
  contact: 'contact',
  drums: 'contact'
};

const PROJECTS = [
  {
    n: 'Credity – Credit Card Management Application',
    sub: 'Credit Card Management Application',
    c: '#e9b8aa',
    d: 'A unified credit card management application designed to simplify tracking multiple cards, monitoring spending patterns, and managing due dates in one clear interface.',
    t: ['Fintech', 'UX / UI Design'],
    u: '#',
    l: 'Visit Site ↗'
  },
  {
    n: 'Human Firewall',
    sub: 'Cybersecurity Awareness & Phishing Protection',
    c: '#a9c9bd',
    d: 'A human-centred cybersecurity awareness experience focused on helping everyday users recognise phishing attempts, build safer digital habits, and strengthen organisational security.',
    t: ['Cybersecurity', 'Product Design'],
    u: '#',
    l: 'Visit Site ↗'
  },
  {
    n: 'Context AI',
    sub: 'Contextual Intelligence & Smart AI Assistance',
    c: '#c9bfe0',
    d: 'An intelligent contextual AI workspace designed to understand user intent across ongoing tasks and deliver timely, relevant assistance without disrupting workflow focus.',
    t: ['AI Interface', 'UX / UI Design'],
    u: '#',
    l: 'Visit Site ↗'
  }
];

const SKILLS_LIST = [
  { n: 'Figma', k: 'Design', d: 'Primary tool for UI systems, wireframes, and interactive UX flows.' },
  { n: 'React', k: 'Front-end', d: 'React 18 prototypes, from executive dashboards to full Maker approval workflows.' },
  { n: 'Vibe coding', k: 'Vibe coding', d: 'Turning raw product ideas into working, clickable software at speed.' },
  { n: 'Webflow', k: 'Websites', d: 'Responsive, custom-built marketing and brand websites.' },
  { n: 'Banking & lending', k: 'Domain', d: 'Customer approval and loan processing flows for enterprise banking.' },
  { n: 'UX research', k: 'Design', d: 'User interviews, problem framing, and usability validation behind every screen.' },
  { n: 'HTML / CSS / JS', k: 'Front-end', d: 'Clean semantic code prototypes and tactile custom micro-interactions.' },
  { n: 'Rapid prototyping', k: 'Vibe coding', d: 'Single-file React and HTML builds ready for stakeholder testing.' },
  { n: 'Framer', k: 'Websites', d: 'Interactive, polished web experiences with fluid motion.' },
  { n: 'Analytics dashboards', k: 'Domain', d: 'Executive summary, sourcing, collections, and performance views.' },
  { n: 'UI design', k: 'Design', d: 'Clean, accessible, human-centered digital interfaces.' },
  { n: 'Tailwind CSS', k: 'Front-end', d: 'Consistent utility-first styling for fast UI iteration.' },
  { n: 'Design to code', k: 'Vibe coding', d: 'Bridging engineering and design so handoffs are effortless.' },
  { n: 'WordPress', k: 'Websites', d: 'Flexible, content-driven websites tailored to client teams.' },
  { n: 'Workflow tools', k: 'Domain', d: 'Internal operations tools built to reduce friction and errors.' },
  { n: 'Prototyping', k: 'Design', d: 'Clickable end-to-end flows for complex enterprise journeys.' },
  { n: 'Problem-solving', k: 'Design', d: 'Breaking tangled multi-step workflows into clear, calm steps.' },
  { n: 'Responsive design', k: 'Websites', d: 'Adaptive layouts crafted for desktop, tablet, and mobile screens.' }
];

const WORDS = [
  ['Praveen Kumbakonam', 'CEO, KVR Infinity', '“Ankitha has been a strong contributor to our product, taking ownership of both UX thinking and UI design. She is proactive, detail-oriented, and delivers designs that balance user needs with business goals.”', 48, 'https://www.linkedin.com/in/praveenkumbhakonam/'],
  ['Hannah Ramamurthy', 'Senior Graphic Designer, CMR University', '“During her internship, Ankitha showed strong UX fundamentals and a great willingness to learn and iterate. She quickly adapted to feedback and delivered thoughtful, user-centric designs.”', 31, 'https://www.linkedin.com/in/hannah-ramamurthy-1b1a371b1/'],
  ['Akhil S Prabhu', 'Senior Graphic Designer, CMR University', '“Ankitha was very reliable and always ready to take on more responsibility during her internship. She approaches design problems thoughtfully and delivers consistent, confident work.”', 27, 'https://www.linkedin.com/in/akhilsprabhu/'],
  ['Aswathi Rajesh', 'Senior UI/UX Designer, Atyati Technologies', '“Ankitha brings a thoughtful approach to design and is always eager to learn and improve. She takes feedback positively, pays attention to detail, and puts genuine effort into understanding problems before working towards solutions. It’s been great guiding her and seeing her grow as a designer.”', 34, 'https://www.linkedin.com/in/aswathi-rajesh-026232215']
];

const NavCtx = React.createContext(() => {});

/* Shinchan Sticker Component */
function ShinchanSticker() {
  const canvasRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [wob, setWob] = useState(false);
  const timerRef = useRef(null);

  const HOVER_MSG = 'Scroll to know more about my friend 😊';

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cvs.width = img.naturalWidth || 320;
      cvs.height = img.naturalHeight || 280;
      ctx.drawImage(img, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 236 && d[i + 1] > 236 && d[i + 2] > 236) {
            d[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {}
    };
    img.src = 'shinchan.jpg';
  }, []);

  const triggerSticker = e => {
    e.stopPropagation();
    setOpen(true);
    setWob(true);
    setTimeout(() => setWob(false), 450);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 3200);
  };

  return h('div', {
    className: 'shinchan-sticker' + (wob ? ' wobble' : ''),
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onClick: triggerSticker,
    role: 'button',
    tabIndex: 0,
    'aria-label': 'Shinchan sticker buddy',
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') triggerSticker(e);
    }
  },
    h('div', { className: 'speech-bub' + (open ? ' show' : '') }, HOVER_MSG),
    h('svg', { className: 'shinchan-canvas', viewBox: '0 0 120 105', 'aria-hidden': true },
      h('path', {
        d: 'M26 52 C14 55 12 72 24 78 L34 80 L34 98 L96 98 L98 52 C104 42 94 32 86 38 C82 22 68 16 54 18 C40 16 30 22 26 36 Z',
        fill: '#ffffff',
        stroke: '#e2e2e2',
        strokeWidth: 2
      }),
      h('path', {
        d: 'M36 74 L92 64 L96 96 L36 96 Z',
        fill: '#e63b2e',
        stroke: '#111111',
        strokeWidth: 2.5,
        strokeLinejoin: 'round'
      }),
      h('path', {
        d: 'M32 34 C34 18 76 16 84 36 C90 42 90 56 80 64 C66 74 42 78 28 72 C16 67 16 52 28 48 C28 42 30 37 32 34 Z',
        fill: '#f4c7a1',
        stroke: '#111111',
        strokeWidth: 2.5
      }),
      h('path', {
        d: 'M31 35 C34 19 74 17 83 36 C76 28 64 25 52 27 C42 25 35 29 31 35 Z',
        fill: '#111111'
      }),
      h('path', {
        d: 'M34 31 Q41 21 48 31',
        fill: 'none',
        stroke: '#111111',
        strokeWidth: 5.5,
        strokeLinecap: 'round'
      }),
      h('path', {
        d: 'M56 29 Q64 20 72 29',
        fill: 'none',
        stroke: '#111111',
        strokeWidth: 5.5,
        strokeLinecap: 'round'
      }),
      h('line', { x1: 35, y1: 41, x2: 47, y2: 39, stroke: '#111111', strokeWidth: 2.2, strokeLinecap: 'round' }),
      h('line', { x1: 57, y1: 39, x2: 69, y2: 39, stroke: '#111111', strokeWidth: 2.2, strokeLinecap: 'round' }),
      h('path', { d: 'M37 64 Q41 61 45 64', fill: 'none', stroke: '#111111', strokeWidth: 2, strokeLinecap: 'round' }),
      h('path', {
        d: 'M78 44 L66 38 L74 46 L65 50 L78 50 C83 50 86 45 82 41 Z',
        fill: '#f4c7a1',
        stroke: '#111111',
        strokeWidth: 2,
        strokeLinejoin: 'round'
      }),
      h('path', {
        d: 'M82 42 L98 50 L94 74 L78 68 L82 48 Z',
        fill: '#e63b2e',
        stroke: '#111111',
        strokeWidth: 2.4,
        strokeLinejoin: 'round'
      })
    ),
    h('canvas', { ref: canvasRef, style: { display: 'none' } })
  );
}

/* Closed Black Book Cover */
function ClosedBookCover({ isOpen, photoTossed, onTossPhoto, onResetPhoto, onOpenJournal, onOpenCrashCourse }) {
  const PHOTO_PATHS = ['IMG-20261125-WA0001_2.jpg', './IMG-20261125-WA0001_2.jpg', 'IMG-20261125-WA0001.jpg', './IMG-20261125-WA0001.jpg'];
  const [photoStep, setPhotoStep] = useState(0);

  const handlePhotoError = () => {
    if (photoStep < PHOTO_PATHS.length - 1) {
      setPhotoStep(s => s + 1);
    } else {
      setPhotoStep(-1);
    }
  };

  return h('div', {
    className: 'closed-cover' + (isOpen ? ' is-open' : ''),
    onClick: () => {
      if (!photoTossed) onTossPhoto();
      else onOpenJournal();
    },
    role: 'button',
    tabIndex: isOpen ? -1 : 0,
    'aria-label': 'The Design Journal black hardcover — scroll or click to toss the photo and reveal options',
    onKeyDown: e => {
      if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (!photoTossed) onTossPhoto();
        else onOpenJournal();
      }
    }
  },
    h('div', { className: 'cover-front-face' },
      h('div', { className: 'cover-band', 'aria-hidden': true }),
      h('div', { className: 'cover-editorial-wrap' },
        h('div', { className: 'cover-kicker-tag' }, 'ANKITHA VENKATESH · PORTFOLIO'),
        h('h1', { className: 'cover-stacked-title' }, 'The ', h('span', null, 'Design'), ' Journal'),
        h('svg', { className: 'cover-squiggle', viewBox: '0 0 60 34', 'aria-hidden': true },
          h('path', {
            d: 'M6 12 C22 4, 34 8, 20 18 C8 26, 36 22, 54 26',
            fill: 'none',
            stroke: '#fffdf8',
            strokeWidth: 3.2,
            strokeLinecap: 'round'
          })
        ),
        h('p', { className: 'cover-sub-caption' }, 'Trying to build products for those who believe prioritising people will lead to profits.')
      ),
      h('div', { className: 'cover-reveal-stage', onClick: e => e.stopPropagation() },
        h('div', {
          className: 'scrappy-paper' + (photoTossed ? ' revealed' : ''),
          'aria-hidden': !photoTossed
        },
          h('div', { className: 'scrappy-tape', 'aria-hidden': true }),
          h('div', { className: 'hand', style: { fontSize: 22, color: '#3f556b', lineHeight: 1.1 } }, 'Psst… you found the note underneath!'),
          h('p', { style: { fontSize: 12.2, color: '#2b3440', margin: '4px 0 0', lineHeight: 1.4 } },
            'How would you like to explore my work?'
          ),
          h('div', { className: 'scrappy-choices' },
            h('button', {
              type: 'button',
              className: 'btn scrappy-opt-btn primary',
              onClick: e => {
                e.stopPropagation();
                onOpenJournal();
              }
            }, 'Go Through the Journal →'),
            h('button', {
              type: 'button',
              className: 'btn alt scrappy-opt-btn',
              onClick: e => {
                e.stopPropagation();
                onOpenCrashCourse();
              }
            }, 'See the 2-Minute Crash Course About Me')
          ),
          h('button', {
            type: 'button',
            onClick: e => {
              e.stopPropagation();
              onResetPhoto();
            },
            style: {
              marginTop: 9,
              background: 'transparent',
              border: 0,
              color: '#5b7083',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }
          }, '↺ Put photograph back')
        ),
        h('div', {
          className: 'cover-photo-card' + (photoTossed ? ' tossed' : ''),
          onClick: e => {
            e.stopPropagation();
            onTossPhoto();
          },
          title: 'Scroll or click to toss the photograph aside'
        },
          h(ShinchanSticker),
          h('div', { className: 'cover-portrait-frame' },
            photoStep >= 0
              ? h('img', {
                  src: PHOTO_PATHS[photoStep],
                  alt: 'Ankitha Venkatesh',
                  onError: handlePhotoError
                })
              : h('div', {
                  style: {
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, #e9b8aa, #c9bfe0 55%, #a9c9bd)',
                    font: '800 54px Fraunces, serif',
                    color: '#ffffff',
                    textShadow: '2px 2px 0 #111111'
                  }
                }, 'AV')
          ),
          h('div', { className: 'hand', style: { fontSize: 19, marginTop: 7, color: '#111111', fontWeight: 700, lineHeight: 1.1 } }, 'Ankitha Venkatesh'),
          h('div', { style: { fontSize: 11, fontWeight: 600, color: '#5b564e', letterSpacing: '0.04em', marginTop: 2 } }, 'UI/UX Designer')
        )
      ),
      h('div', { className: 'cover-bottom-hint' },
        h('span', null, photoTossed ? 'Pick an option on the paper above ↑' : 'Scroll down or tap the photo to toss it aside ↻')
      )
    ),
    h('div', { className: 'cover-inside-face', 'aria-hidden': true })
  );
}

/* Chapter 1 — About */
function AboutSpread() {
  return h('div', { className: 'open-spread' },
    h('div', { className: 'leaf-col about-copy' },
      h('div', { className: 'leaf-header' },
        h('span', { className: 'chapter-kicker' }, 'Chapter 01'),
        h('h2', { className: 'chapter-title' }, 'The Designer'),
        h('p', { className: 'chapter-sub' }, 'a little about me')
      ),
      h('p', null, 'I’m a 23-year-old designer who grew up watching ', h('em', null, 'MAD on Pogo'), ', probably where my fascination with making things first took shape.'),
      h('p', null, 'It started with little science projects, handmade models, and art and craft competitions at school. Somewhere along the way, that childhood curiosity turned into a genuine interest in design.'),
      h('p', null, 'I have 1.5 years of professional experience, backed by a year of self-directed learning and experimentation. I’ve previously designed experiences for students in EdTech and currently work on products for banking professionals and business consultants.'),
      h('p', null, 'Outside of design, I spend my time playing the drums, sketching, and reading books to expand my vocabulary (and occasionally escape boredom). I also create content for Instagram whenever inspiration strikes, which, admittedly, happens once in a blue moon.'),
      h('p', { style: { marginBottom: 14 } }, 'Still curious, still experimenting, and always finding something new to make.'),
      h('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap' } },
        h('a', {
          className: 'btn alt',
          href: './Ankitha_Venkatesh_Resume.pdf',
          target: '_blank',
          rel: 'noopener'
        }, 'Download CV ↗')
      )
    ),
    h('div', { className: 'leaf-col' },
      h('div', { className: 'stats-row' },
        [
          ['1.5 yrs', 'professional experience', '#e9b8aa'],
          ['1 yr', 'self-learning', '#a9c9bd']
        ].map(([num, label, col]) =>
          h('div', { key: label, className: 'stat-badge', style: { '--c': col } },
            h('b', null, num),
            h('span', null, label)
          )
        )
      ),
      h('div', { className: 'journal-note-box' },
        h('div', { className: 'hand', style: { fontSize: 23, color: 'var(--coral)', marginBottom: 6 } }, 'Design Philosophy & Craft'),
        h('p', { style: { fontSize: 13.5, color: 'var(--mute)', margin: '0 0 14px', lineHeight: 1.55 } },
          'With a background in Computer Science Engineering, I design with development in mind—bridging user research and clean Figma systems with clickable React prototypes.'
        ),
        h('div', { style: { marginBottom: 14 } },
          [
            ['Figma', '#e9b8aa'],
            ['React', '#a9c9bd'],
            ['Vibe Coding', '#c9bfe0'],
            ['UX Research', '#e6cf92'],
            ['Adobe Photoshop', '#a9c9bd'],
            ['Adobe Illustrator', '#e6cf92'],
            ['Adobe XD', '#c9bfe0'],
            ['HTML / CSS / JS', '#a9c9bd'],
            ['Webflow', '#e9b8aa'],
            ['Framer', '#c9bfe0']
          ].map(([tag, col]) =>
            h('span', { key: tag, className: 'sticker-pill', style: { '--c': col } }, tag)
          )
        ),
        h('div', { className: 'hand', style: { fontSize: 19, color: 'var(--mute)' } }, '✎ B.E. in Computer Science Engineering')
      )
    )
  );
}

/* Chapter 2 — Experience */
function ExperienceSpread() {
  return h('div', { className: 'exp-spread' },
    h('div', { className: 'leaf-col' },
      h('div', { className: 'leaf-header' },
        h('span', { className: 'chapter-kicker' }, 'Chapter 02'),
        h('h2', { className: 'chapter-title' }, 'Experience'),
        h('p', { className: 'chapter-sub' }, 'the story so far, newest first')
      ),
      h('div', { className: 'exp-timeline' },
        h('div', { className: 'job-card', style: { '--c': '#e9b8aa' } },
          h('div', { className: 'hand', style: { fontSize: 18, color: 'var(--mute)' } }, 'Current', h('span', { className: 'now-badge' }, 'NOW')),
          h('h3', null, 'UI/UX Designer & Front-end Prototyper'),
          h('div', { style: { fontWeight: 600, fontSize: 13.5 } }, 'Atyati Technologies'),
          h('div', { style: { fontSize: 11.5, fontWeight: 600, color: 'var(--mute)', marginTop: 1, marginBottom: 4 } }, 'Feb 2026 – Present'),
          h('p', null, 'Designing and prototyping internal workflow tools for enterprise fintech, banking and lending.'),
          h('ul', null,
            h('li', null, 'Lending intelligence dashboard: executive summary, sourcing, collections, customer analytics, employee performance and target management'),
            h('li', null, 'South Indian Bank: customer approval and loan processing redesign, including the full Maker workflow in React'),
            h('li', null, 'Fed Mitra: loan processing platform prototype for a Central Operations Team')
          ),
          h('div', null,
            ['React', 'Figma', 'Enterprise UX'].map(t =>
              h('span', { key: t, className: 'sticker-pill', style: { '--c': '#e9b8aa', fontSize: 11.5 } }, t)
            )
          )
        )
      )
    ),
    h('div', { className: 'leaf-col' },
      h('div', { className: 'exp-timeline' },
        h('div', { className: 'job-card', style: { '--c': '#e6cf92' } },
          h('div', { className: 'hand', style: { fontSize: 18, color: 'var(--mute)' } }, 'Product design'),
          h('h3', null, 'UX & UI Designer'),
          h('div', { style: { fontWeight: 600, fontSize: 13.5 } }, 'KVR Infinity'),
          h('div', { style: { fontSize: 11.5, fontWeight: 600, color: 'var(--mute)', marginTop: 1, marginBottom: 4 } }, 'Aug 2025 – Jan 2026'),
          h('p', null, 'Took ownership of both UX thinking and UI design for the product, balancing user needs with business goals.'),
          h('div', null,
            ['UX thinking', 'UI design'].map(t =>
              h('span', { key: t, className: 'sticker-pill', style: { '--c': '#e6cf92', fontSize: 11.5 } }, t)
            )
          )
        ),
        h('div', { className: 'job-card', style: { '--c': '#c9bfe0' } },
          h('div', { className: 'hand', style: { fontSize: 18, color: 'var(--mute)' } }, 'Internship'),
          h('h3', null, 'Design Intern'),
          h('div', { style: { fontWeight: 600, fontSize: 13.5 } }, 'CMR University'),
          h('div', { style: { fontSize: 11.5, fontWeight: 600, color: 'var(--mute)', marginTop: 1, marginBottom: 4 } }, 'Jun – Jul 2025'),
          h('p', null, 'Showed strong UX fundamentals and a willingness to learn and iterate, adapting quickly to feedback and delivering thoughtful, user-centric designs. Reliable, and always ready to take on more responsibility.'),
          h('div', null,
            ['UX fundamentals', 'User-centric design'].map(t =>
              h('span', { key: t, className: 'sticker-pill', style: { '--c': '#c9bfe0', fontSize: 11.5 } }, t)
            )
          )
        )
      )
    )
  );
}

/* Custom Clean Animated Visual Preview for Each Project */
function ProjectPreviewGraphic({ project }) {
  const { n: name } = project;
  if (name === 'Credity – Credit Card Management Application') {
    return h('svg', { viewBox: '0 0 360 198', 'aria-hidden': true },
      h('rect', { width: 360, height: 198, fill: '#f3d2c8' }),
      h('g', { className: 'proj-anim-float-delay' },
        h('rect', { x: 46, y: 24, width: 176, height: 106, rx: 12, fill: '#e6cf92', stroke: '#111111', strokeWidth: 2, transform: 'rotate(-5 134 77)' }),
        h('rect', { x: 58, y: 42, width: 152, height: 14, fill: '#111111', opacity: 0.85, transform: 'rotate(-5 134 77)' })
      ),
      h('g', { className: 'proj-anim-float' },
        h('rect', { x: 74, y: 42, width: 192, height: 114, rx: 14, fill: '#ffffff', stroke: '#111111', strokeWidth: 2.2 }),
        h('rect', { x: 92, y: 60, width: 32, height: 22, rx: 5, fill: '#e6cf92', stroke: '#111111', strokeWidth: 1.6 }),
        h('line', { x1: 102, y1: 60, x2: 102, y2: 82, stroke: '#111111', strokeWidth: 1.2 }),
        h('line', { x1: 92, y1: 71, x2: 124, y2: 71, stroke: '#111111', strokeWidth: 1.2 }),
        h('circle', { cx: 234, cy: 71, r: 9, fill: '#e63b2e', opacity: 0.85 }),
        h('circle', { cx: 245, cy: 71, r: 9, fill: '#e6cf92', opacity: 0.9 }),
        h('rect', { x: 92, y: 98, width: 118, height: 8, rx: 4, fill: '#111111' }),
        h('rect', { x: 92, y: 114, width: 72, height: 7, rx: 3.5, fill: '#8a8275' }),
        h('rect', { x: 92, y: 132, width: 156, height: 10, rx: 5, fill: '#f3eee4', stroke: '#111111', strokeWidth: 1.3 }),
        h('rect', { x: 92, y: 132, width: 102, height: 10, rx: 5, fill: '#a9c9bd', stroke: '#111111', strokeWidth: 1.3 })
      ),
      h('g', { className: 'proj-anim-pulse' },
        h('rect', { x: 234, y: 118, width: 92, height: 34, rx: 17, fill: '#ffffff', stroke: '#111111', strokeWidth: 1.8 }),
        h('circle', { cx: 250, cy: 135, r: 6, fill: '#a9c9bd', stroke: '#111111', strokeWidth: 1.3 }),
        h('text', { x: 286, y: 139, textAnchor: 'middle', style: { font: '700 10px Inter, sans-serif', fill: '#111111' } }, 'Tracked ✓')
      )
    );
  }
  if (name === 'Human Firewall') {
    return h('svg', { viewBox: '0 0 360 198', 'aria-hidden': true },
      h('rect', { width: 360, height: 198, fill: '#cbe2d9' }),
      h('circle', { cx: 180, cy: 99, r: 72, fill: 'none', stroke: '#111111', strokeWidth: 1.4, opacity: 0.22, className: 'proj-anim-pulse' }),
      h('circle', { cx: 180, cy: 99, r: 54, fill: 'none', stroke: '#111111', strokeWidth: 1.5, className: 'proj-anim-dash' }),
      h('g', { className: 'proj-anim-float' },
        h('path', {
          d: 'M180 30 L236 52 V98 C236 134 211 157 180 170 C149 157 124 134 124 98 V52 Z',
          fill: '#ffffff',
          stroke: '#111111',
          strokeWidth: 2.2,
          strokeLinejoin: 'round'
        }),
        h('path', {
          d: 'M180 42 L224 59 V96 C224 126 204 145 180 156 C156 145 136 126 136 96 V59 Z',
          fill: '#a9c9bd',
          stroke: '#111111',
          strokeWidth: 1.6,
          strokeLinejoin: 'round'
        }),
        h('circle', { cx: 180, cy: 84, r: 12, fill: '#ffffff', stroke: '#111111', strokeWidth: 1.8 }),
        h('path', { d: 'M160 120 C160 106 200 106 200 120', fill: '#ffffff', stroke: '#111111', strokeWidth: 1.8, strokeLinecap: 'round' })
      ),
      h('line', { x1: 132, y1: 99, x2: 228, y2: 99, stroke: '#e63b2e', strokeWidth: 2.2, strokeLinecap: 'round', className: 'proj-anim-scan' }),
      h('g', { className: 'proj-anim-float-delay' },
        h('rect', { x: 40, y: 46, width: 64, height: 26, rx: 13, fill: '#ffffff', stroke: '#111111', strokeWidth: 1.7 }),
        h('text', { x: 72, y: 63, textAnchor: 'middle', style: { font: '700 9.5px Inter, sans-serif', fill: '#111111' } }, 'Phish Block'),
        h('rect', { x: 256, y: 126, width: 64, height: 26, rx: 13, fill: '#e6cf92', stroke: '#111111', strokeWidth: 1.7 }),
        h('text', { x: 288, y: 143, textAnchor: 'middle', style: { font: '700 9.5px Inter, sans-serif', fill: '#111111' } }, 'Verified ✓')
      )
    );
  }
  return h('svg', { viewBox: '0 0 360 198', 'aria-hidden': true },
    h('rect', { width: 360, height: 198, fill: '#dfd8f0' }),
    h('line', { x1: 96, y1: 58, x2: 180, y2: 99, stroke: '#111111', strokeWidth: 1.8, className: 'proj-anim-dash' }),
    h('line', { x1: 264, y1: 58, x2: 180, y2: 99, stroke: '#111111', strokeWidth: 1.8, className: 'proj-anim-dash' }),
    h('line', { x1: 96, y1: 142, x2: 180, y2: 99, stroke: '#111111', strokeWidth: 1.8, className: 'proj-anim-dash' }),
    h('line', { x1: 264, y1: 142, x2: 180, y2: 99, stroke: '#111111', strokeWidth: 1.8, className: 'proj-anim-dash' }),
    h('g', { className: 'proj-anim-float-delay' },
      h('rect', { x: 52, y: 42, width: 76, height: 28, rx: 14, fill: '#ffffff', stroke: '#111111', strokeWidth: 1.7 }),
      h('text', { x: 90, y: 60, textAnchor: 'middle', style: { font: '700 10px Inter, sans-serif', fill: '#111111' } }, 'Context'),
      h('rect', { x: 232, y: 42, width: 76, height: 28, rx: 14, fill: '#e6cf92', stroke: '#111111', strokeWidth: 1.7 }),
      h('text', { x: 270, y: 60, textAnchor: 'middle', style: { font: '700 10px Inter, sans-serif', fill: '#111111' } }, 'Memory'),
      h('rect', { x: 52, y: 128, width: 76, height: 28, rx: 14, fill: '#a9c9bd', stroke: '#111111', strokeWidth: 1.7 }),
      h('text', { x: 90, y: 146, textAnchor: 'middle', style: { font: '700 10px Inter, sans-serif', fill: '#111111' } }, 'Intent'),
      h('rect', { x: 232, y: 128, width: 76, height: 28, rx: 14, fill: '#e9b8aa', stroke: '#111111', strokeWidth: 1.7 }),
      h('text', { x: 270, y: 146, textAnchor: 'middle', style: { font: '700 10px Inter, sans-serif', fill: '#111111' } }, 'Assist')
    ),
    h('g', { className: 'proj-anim-float' },
      h('circle', { cx: 180, cy: 99, r: 34, fill: '#ffffff', stroke: '#111111', strokeWidth: 2.2 }),
      h('circle', { cx: 180, cy: 99, r: 25, fill: '#c9bfe0', stroke: '#111111', strokeWidth: 1.5 }),
      h('path', {
        d: 'M180 82 L184 94 L196 99 L184 104 L180 116 L176 104 L164 99 L176 94 Z',
        fill: '#ffffff',
        stroke: '#111111',
        strokeWidth: 1.6,
        strokeLinejoin: 'round'
      })
    )
  );
}

/* Chapter 3 — My Work */
function WorkSpread() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = PROJECTS[activeIdx];

  return h('div', { className: 'work-spread' },
    h('div', { className: 'work-left' },
      h('div', { className: 'leaf-header' },
        h('span', { className: 'chapter-kicker' }, 'Chapter 03'),
        h('h2', { className: 'chapter-title' }, 'My Work'),
        h('p', { className: 'chapter-sub' }, 'selected case studies & shipped builds')
      ),
      h('div', { className: 'work-index', role: 'tablist', 'aria-label': 'Select a project' },
        PROJECTS.map((p, idx) =>
          h('button', {
            key: p.n,
            type: 'button',
            role: 'tab',
            'aria-selected': idx === activeIdx,
            className: 'work-item-btn' + (idx === activeIdx ? ' active' : ''),
            style: { '--c': p.c },
            onClick: () => setActiveIdx(idx)
          },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 } },
              h('span', { className: 'work-item-dot', style: { '--c': p.c } }),
              h('div', { style: { minWidth: 0 } },
                h('div', { style: { fontFamily: 'Fraunces, serif', fontSize: 15.5, fontWeight: 700, lineHeight: 1.25 } }, p.n),
                h('div', { style: { fontSize: 11.5, color: 'var(--mute)' } }, p.sub)
              )
            ),
            h('span', { style: { fontWeight: 700, fontSize: 15 } }, idx === activeIdx ? '→' : '↗')
          )
        )
      )
    ),
    h('div', { className: 'work-right' },
      h('article', { key: current.n, className: 'work-showcase-card', style: { '--c': current.c } },
        h('div', { className: 'work-preview-frame', style: { '--c': current.c } },
          h(ProjectPreviewGraphic, { project: current })
        ),
        h('div', null,
          h('h3', { style: { fontSize: 21, marginBottom: 4, lineHeight: 1.2 } }, current.n),
          current.t && current.t.length > 0 && h('div', null, current.t.map(tag =>
            h('span', { key: tag, className: 'sticker-pill', style: { '--c': current.c, fontSize: 11 } }, tag)
          ))
        ),
        current.d && h('p', { className: 'work-showcase-desc' }, current.d),
        h('div', { style: { marginTop: 2 } },
          h('a', {
            className: 'btn',
            href: current.u || '#',
            target: current.u && current.u !== '#' ? '_blank' : undefined,
            rel: current.u && current.u !== '#' ? 'noopener' : undefined,
            onClick: e => {
              if (!current.u || current.u === '#') e.preventDefault();
            }
          }, current.l || 'Visit Site ↗')
        )
      )
    )
  );
}

/* Isometric Physical Jenga Tower Component */
const TL = [0, 4, 8, 12, 16, 1, 5, 9, 13, 17, 2, 6, 10, 14, 3, 7, 11, 15].map(i => SKILLS_LIST[i]);
const CAT = {
  Design: '#e9b8aa',
  'Front-end': '#a9c9bd',
  'Vibe coding': '#c9bfe0',
  Websites: '#e6cf92',
  Domain: '#b7cbe0'
};
const CAT_SHADE = {
  Design: { top: '#f2cbc0', left: '#e9b8aa', right: '#cfa092' },
  'Front-end': { top: '#bdd8ce', left: '#a9c9bd', right: '#8ab0a2' },
  'Vibe coding': { top: '#d8d0ea', left: '#c9bfe0', right: '#aba0c7' },
  Websites: { top: '#efe0b2', left: '#e6cf92', right: '#ccb372' },
  Domain: { top: '#cbd9e8', left: '#b7cbe0', right: '#96aec7' }
};

const SHORT_BLOCK_NAMES = {
  'Figma': 'Figma',
  'React': 'React',
  'Vibe coding': 'Vibe Code',
  'Webflow': 'Webflow',
  'Banking & lending': 'Banking',
  'UX research': 'UX Research',
  'HTML / CSS / JS': 'HTML/JS',
  'Rapid prototyping': 'Prototype',
  'Framer': 'Framer',
  'Analytics dashboards': 'Analytics',
  'UI design': 'UI Design',
  'Tailwind CSS': 'Tailwind',
  'Design to code': 'UI → Code',
  'WordPress': 'WordPress',
  'Workflow tools': 'Workflows',
  'Prototyping': 'Flows',
  'Problem-solving': 'Strategy',
  'Responsive design': 'Responsive'
};

function IsometricJenga() {
  const [sel, setSel] = useState(null);
  const [pulledCount, setPulledCount] = useState(0);
  const [offsets, setOffsets] = useState(() => Array(18).fill([0, 0]));
  const curRef = useRef(Array.from({ length: 18 }, () => [0, 0]));
  const tgtRef = useRef(Array.from({ length: 18 }, () => [0, 0]));
  const rafRef = useRef(null);

  const startGlide = () => {
    if (rafRef.current) return;
    const step = () => {
      let moving = false;
      for (let i = 0; i < 18; i++) {
        const [cx, cy] = curRef.current[i];
        const [tx, ty] = tgtRef.current[i];
        const dx = tx - cx;
        const dy = ty - cy;
        if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
          curRef.current[i] = [cx + dx * 0.11, cy + dy * 0.11];
          moving = true;
        } else if (cx !== tx || cy !== ty) {
          curRef.current[i] = [tx, ty];
          moving = true;
        }
      }
      setOffsets(curRef.current.map(p => [p[0], p[1]]));
      if (moving) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getPullVector = idx => {
    const l = Math.floor(idx / 3);
    const j = idx % 3;
    if (l % 2 === 0) {
      return j === 0 ? [-34, 17] : j === 1 ? [32, -16] : [36, -18];
    }
    const k = 2 - j;
    return k === 2 ? [34, 17] : k === 1 ? [-32, -16] : [-36, -18];
  };

  const pullBlock = (i, e) => {
    if (e) e.stopPropagation();
    const nextSel = sel === i ? null : i;
    for (let b = 0; b < 18; b++) {
      tgtRef.current[b] = b === nextSel ? getPullVector(b) : [0, 0];
    }
    setSel(nextSel);
    if (nextSel !== null) {
      setPulledCount(c => c + 1);
    }
    startGlide();
  };

  const ox = 166;
  const oy = 326;
  const dxX = 27;
  const dyX = 13.5;
  const dxY = 27;
  const dyY = -13.5;
  const dz = 22;

  const isoXY = (x, y, z) => [ox + x * dxX + y * dxY, oy + x * dyX + y * dyY - z * dz];
  const isoPt = (x, y, z) => {
    const [px, py] = isoXY(x, y, z);
    return `${px},${py}`;
  };

  const renderBlock = (x0, x1, y0, y1, z0, z1, colors, key, interactiveIdx, extraClass, labelCfg) => {
    const [tx, ty] = interactiveIdx !== null ? offsets[interactiveIdx] : [0, 0];

    const pTop = [isoPt(x0, y0, z1), isoPt(x1, y0, z1), isoPt(x1, y1, z1), isoPt(x0, y1, z1)].join(' ');
    const pLeft = [isoPt(x0, y0, z0), isoPt(x1, y0, z0), isoPt(x1, y0, z1), isoPt(x0, y0, z1)].join(' ');
    const pRight = [isoPt(x1, y0, z0), isoPt(x1, y1, z0), isoPt(x1, y1, z1), isoPt(x1, y0, z1)].join(' ');

    let textEl = null;
    if (labelCfg) {
      const [lx, ly] = isoXY(labelCfg.x, labelCfg.y, labelCfg.z);
      textEl = h('text', {
        x: lx,
        y: ly,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        className: 'blk-label',
        transform: `translate(${lx}, ${ly}) rotate(${labelCfg.angle}) skewX(${labelCfg.skew}) translate(${-lx}, ${-ly})`
      }, labelCfg.text);
    }

    return h('g', {
      key,
      className: extraClass || 'iso-blk',
      transform: tx !== 0 || ty !== 0 ? `translate(${tx.toFixed(2)}, ${ty.toFixed(2)})` : undefined,
      onClick: interactiveIdx !== null ? e => pullBlock(interactiveIdx, e) : undefined,
      role: interactiveIdx !== null ? 'button' : undefined,
      'aria-label': interactiveIdx !== null ? `${TL[interactiveIdx].n} (${TL[interactiveIdx].k})` : undefined
    },
      h('polygon', { points: pLeft, fill: colors.left, stroke: '#111111', strokeWidth: 1.75, strokeLinejoin: 'round' }),
      h('polygon', { points: pRight, fill: colors.right, stroke: '#111111', strokeWidth: 1.75, strokeLinejoin: 'round' }),
      h('polygon', { points: pTop, fill: colors.top, stroke: '#111111', strokeWidth: 1.75, strokeLinejoin: 'round' }),
      textEl
    );
  };

  const towerNodes = [];
  for (let l = 0; l < 6; l++) {
    const z0 = l;
    const z1 = l + 1;
    if (l % 2 === 0) {
      for (let j = 0; j < 3; j++) {
        const idx = l * 3 + j;
        const skill = TL[idx];
        const cols = CAT_SHADE[skill.k];
        let labelCfg = null;
        if (j === 2) {
          labelCfg = { x: 3, y: 1.5, z: z0 + 0.5, angle: -26.5, skew: -26.5, text: SHORT_BLOCK_NAMES[skill.n] || skill.n };
        } else if (l === 5) {
          labelCfg = { x: j + 0.5, y: 1.5, z: z1, angle: -26.5, skew: 26.5, text: SHORT_BLOCK_NAMES[skill.n] || skill.n };
        }
        towerNodes.push(renderBlock(j, j + 1, 0, 3, z0, z1, cols, `blk-${idx}`, idx, 'iso-blk', labelCfg));
      }
    } else {
      for (let k = 2; k >= 0; k--) {
        const j = 2 - k;
        const idx = l * 3 + j;
        const skill = TL[idx];
        const cols = CAT_SHADE[skill.k];
        let labelCfg = null;
        if (k === 0) {
          labelCfg = { x: 1.5, y: 0, z: z0 + 0.5, angle: 26.5, skew: 26.5, text: SHORT_BLOCK_NAMES[skill.n] || skill.n };
        } else if (l === 5) {
          labelCfg = { x: 1.5, y: k + 0.5, z: z1, angle: 26.5, skew: -26.5, text: SHORT_BLOCK_NAMES[skill.n] || skill.n };
        }
        towerNodes.push(renderBlock(0, 3, k, k + 1, z0, z1, cols, `blk-${idx}`, idx, 'iso-blk', labelCfg));
      }
    }
  }

  const looseBlocks = [
    renderBlock(-2.3, -1.3, -1.8, 0.8, 0, 0.85, CAT_SHADE.Design, 'loose-1', null, 'loose-blk', null),
    renderBlock(-1.6, -2.5, 1.4, 2.4, 0, 0.85, CAT_SHADE.Websites, 'loose-2', null, 'loose-blk', null),
    renderBlock(3.8, 4.8, -1.2, 1.5, 0, 0.85, CAT_SHADE.Domain, 'loose-3', null, 'loose-blk', null),
    renderBlock(4.1, 5.1, 1.8, 4.4, 0, 0.85, CAT_SHADE['Front-end'], 'loose-4', null, 'loose-blk', null),
    renderBlock(1.4, 4.1, -2.4, -1.4, 0, 0.85, CAT_SHADE['Vibe coding'], 'loose-5', null, 'loose-blk', null)
  ];

  const S = sel !== null ? TL[sel] : null;

  return h('div', { className: 'jenga-spread' },
    h('div', { className: 'iso-stage' },
      h('svg', {
        className: 'iso-svg',
        viewBox: '20 140 460 295',
        'aria-label': 'Interactive isometric Jenga skill tower'
      },
        h('ellipse', { cx: 248, cy: 326, rx: 120, ry: 48, fill: 'rgba(17, 17, 17, 0.08)' }),
        looseBlocks[0],
        looseBlocks[2],
        looseBlocks[3],
        towerNodes,
        looseBlocks[1],
        looseBlocks[4]
      ),
      h('div', { className: 'jenga-legend' },
        Object.keys(CAT).map(k =>
          h('span', { key: k }, h('i', { style: { background: CAT[k] } }), k)
        )
      )
    ),
    h('div', { className: 'skill-inspector-wrap' },
      h('div', { className: 'skill-inspector', style: { borderTopColor: S ? CAT[S.k] : '#e6cf92' } },
        S ? h('div', null,
          h('span', { className: 'cat-chip', style: { background: CAT[S.k] } }, S.k),
          h('h3', { style: { fontSize: 28, margin: '10px 0 6px' } }, S.n),
          h('p', { style: { color: 'var(--mute)', margin: 0, fontSize: 14.5, lineHeight: 1.55 } }, S.d)
        ) : h('div', null,
          h('h3', { style: { fontSize: 28, marginBottom: 8 } }, 'Your move'),
          h('p', { style: { color: 'var(--mute)', margin: 0, fontSize: 14.5, lineHeight: 1.55 } },
            'Each isometric block represents one of my skills. Click any block in the stack to slide it out and inspect how I use it.'
          )
        ),
        h('div', { className: 'hand', style: { fontSize: 20, color: 'var(--ink)', marginTop: 14 } },
          `blocks pulled: ${pulledCount} · tower still standing ✓`
        )
      )
    )
  );
}

/* Tool Brand SVG Icons for the Jar */
function ToolMark({ n }) {
  const icons = {
    Figma: h('svg', { viewBox: '0 0 24 36' },
      h('path', { d: 'M0 6a6 6 0 0 1 6-6h6v12H6a6 6 0 0 1-6-6z', fill: '#f24e1e' }),
      h('path', { d: 'M12 0h6a6 6 0 0 1 0 12h-6z', fill: '#ff7262' }),
      h('path', { d: 'M0 18a6 6 0 0 1 6-6h6v12H6a6 6 0 0 1-6-6z', fill: '#a259ff' }),
      h('circle', { cx: 18, cy: 18, r: 6, fill: '#1abcfe' }),
      h('path', { d: 'M0 30a6 6 0 0 1 6-6h6v6a6 6 0 1 1-12 0z', fill: '#0acf83' })
    ),
    Claude: h('svg', { viewBox: '0 0 24 24' },
      Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        const l = [10.5, 8, 10, 7.5, 9.5, 8][i % 6];
        return h('line', {
          key: i,
          x1: 12 + 2.2 * Math.cos(a),
          y1: 12 + 2.2 * Math.sin(a),
          x2: 12 + l * Math.cos(a),
          y2: 12 + l * Math.sin(a),
          stroke: '#d97757',
          strokeWidth: 2.4,
          strokeLinecap: 'round'
        });
      })
    ),
    Miro: h('svg', { viewBox: '0 0 24 24' },
      h('rect', { x: 1, y: 1, width: 22, height: 22, rx: 6, fill: '#ffd02f' }),
      h('path', { d: 'M6 17l3-9 3 7 2-8 4 10', stroke: '#050038', strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    Canva: h('svg', { viewBox: '0 0 24 24' },
      h('defs', null,
        h('linearGradient', { id: 'cvg', x1: 0, y1: 0, x2: 1, y2: 1 },
          h('stop', { offset: 0, stopColor: '#00c4cc' }),
          h('stop', { offset: 1, stopColor: '#7d2ae8' })
        )
      ),
      h('circle', { cx: 12, cy: 12, r: 11, fill: 'url(#cvg)' }),
      h('path', { d: 'M16 8.6a5 5 0 1 0 0 6.8', stroke: '#fff', strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round' })
    ),
    Lovable: h('svg', { viewBox: '0 0 24 24' },
      h('defs', null,
        h('linearGradient', { id: 'lvg', x1: 0, y1: 1, x2: 1, y2: 0 },
          h('stop', { offset: 0, stopColor: '#4f7cff' }),
          h('stop', { offset: 0.55, stopColor: '#e63b9a' }),
          h('stop', { offset: 1, stopColor: '#ff6a3d' })
        )
      ),
      h('path', { d: 'M12 22S2 15.5 2 9.5a5.2 5.2 0 0 1 10-2 5.2 5.2 0 0 1 10 2C22 15.5 12 22 12 22z', fill: 'url(#lvg)' })
    ),
    Framer: h('svg', { viewBox: '0 0 24 24' },
      h('path', { d: 'M4 1h16v8h-8zM4 9h8l8 8H4zM4 17h8v7z', fill: '#111' })
    ),
    Webflow: h('svg', { viewBox: '0 0 24 24' },
      h('path', { d: 'M2 6l4 12 6-9 6 9 4-12', stroke: '#146ef5', strokeWidth: 3, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    React: h('svg', { viewBox: '0 0 24 24' },
      [0, 60, 120].map(r =>
        h('ellipse', { key: r, cx: 12, cy: 12, rx: 10.5, ry: 4, fill: 'none', stroke: '#61dafb', strokeWidth: 1.5, transform: `rotate(${r} 12 12)` })
      ),
      h('circle', { cx: 12, cy: 12, r: 2, fill: '#61dafb' })
    )
  };
  return icons[n] || null;
}

/* Tools in a Jar View */
function SkillsInJar() {
  const TOOLS = ['Figma', 'Claude', 'Miro', 'Canva', 'Lovable', 'Framer', 'Webflow', 'React'];
  const [hovered, setHovered] = useState(false);

  const IN = [[30, 84], [50, 84], [70, 84], [38, 66], [62, 66], [30, 48], [50, 48], [70, 48]];
  const UP = [
    [24, 6],
    [42, -6],
    [60, -6],
    [78, 6],
    [82, 24],
    [18, 24],
    [38, 16],
    [62, 16]
  ];
  const RT = [-8, 5, -5, 8, -6, 5, 6, -5];

  return h('div', { className: 'jar-spread' },
    h('div', { className: 'jar-stage' },
      h('div', {
        className: 'jarwrap' + (hovered ? ' lo pop' : ''),
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onClick: () => setHovered(v => !v),
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Tools jar: hover over the jar to reveal the tools inside',
        onKeyDown: e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setHovered(v => !v);
          }
        }
      },
        h('svg', { className: 'jar-svg', viewBox: '0 0 200 250', 'aria-hidden': true },
          h('path', { d: 'M62 36h76v8q26 8 26 40v130q0 26-26 26H62q-26 0-26-26V84q0-32 26-40z', fill: '#dfeee8', fillOpacity: 0.58, stroke: 'var(--ink)', strokeWidth: 3 }),
          h('path', { d: 'M50 90v110', stroke: '#ffffff', strokeOpacity: 0.72, strokeWidth: 5, strokeLinecap: 'round' }),
          h('g', { className: 'jar-lid' },
            h('rect', { x: 56, y: 8, width: 88, height: 26, rx: 6, fill: '#d49a8a', stroke: 'var(--ink)', strokeWidth: 3 }),
            h('rect', { x: 62, y: 13, width: 76, height: 4, rx: 2, fill: '#ffffff', opacity: 0.45 })
          )
        ),
        TOOLS.map((n, i) => {
          const P = (hovered ? UP : IN)[i];
          return h('div', {
            key: n,
            className: 'tok',
            style: {
              left: P[0] + '%',
              top: P[1] + '%',
              transform: `translate(-50%, -50%) rotate(${hovered ? RT[i] : 0}deg)`,
              transitionDelay: (hovered ? i * 75 : (7 - i) * 55) + 'ms',
              zIndex: hovered ? 4 : 1
            }
          },
            h('div', { className: 'tin', style: { '--i': i } }, h(ToolMark, { n })),
            h('em', null, n)
          );
        })
      ),
      h('p', { className: 'hand', style: { fontSize: 19, color: 'var(--mute)', margin: '8px 0 0' } },
        hovered ? 'tools inside the jar ✨' : 'hover over the jar to reveal the tools'
      )
    ),
    h('div', { className: 'leaf-col' },
      h('div', { className: 'journal-note-box' },
        h('span', { className: 'chapter-kicker' }, 'The toolbox'),
        h('h3', { style: { fontSize: 26, marginBottom: 10 } }, 'Tools inside the jar'),
        h('p', { style: { fontSize: 14, color: 'var(--mute)', margin: '0 0 14px', lineHeight: 1.55 } },
          'From early ideation in Miro and UI systems in Figma, to rapid vibe-coding with Claude, Lovable, and React, plus responsive launches on Framer and Webflow.'
        ),
        h('div', null,
          TOOLS.map((tool, i) =>
            h('span', {
              key: tool,
              className: 'sticker-pill',
              style: { '--c': ['#e9b8aa', '#a9c9bd', '#c9bfe0', '#e6cf92'][i % 4] }
            }, tool)
          )
        )
      )
    )
  );
}

/* Chapter 4 — Skills */
function SkillsSpread() {
  const [view, setView] = useState('jenga');

  return h('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } },
    h('div', { className: 'skills-header-row' },
      h('div', null,
        h('span', { className: 'chapter-kicker' }, 'Chapter 04'),
        h('h2', { className: 'chapter-title' }, 'Skills')
      ),
      h('div', { className: 'seg-toggle', role: 'tablist', 'aria-label': 'Switch skills view' },
        h('button', {
          role: 'tab',
          'aria-selected': view === 'jenga',
          className: 'seg-btn' + (view === 'jenga' ? ' on' : ''),
          onClick: () => setView('jenga')
        }, 'Technical & Design Skills'),
        h('button', {
          role: 'tab',
          'aria-selected': view === 'jar',
          className: 'seg-btn' + (view === 'jar' ? ' on' : ''),
          onClick: () => setView('jar')
        }, 'Tools')
      )
    ),
    view === 'jenga' ? h(IsometricJenga) : h(SkillsInJar)
  );
}

/* UNO Reverse Front Graphic */
function UnoFrontSvg({ c }) {
  const A = 'M0 20L0-4-9-4 6-26 21-4 12-4 12 20z';
  const D = `color-mix(in srgb, ${c} 72%, #000)`;
  return h('svg', { viewBox: '0 0 120 168', 'aria-hidden': true },
    h('rect', { x: 0.5, y: 0.5, width: 119, height: 167, rx: 13, fill: '#fff' }),
    h('rect', { x: 8, y: 8, width: 104, height: 152, rx: 8, fill: c }),
    h('ellipse', { cx: 60, cy: 84, rx: 36, ry: 62, fill: '#fff', transform: 'rotate(28 60 84)' }),
    h('path', { d: A, style: { fill: c }, transform: 'translate(40 92) rotate(10)' }),
    h('path', { d: A, style: { fill: D }, transform: 'translate(80 76) rotate(190)' }),
    h('path', { d: A, fill: '#fff', transform: 'translate(21 34) scale(.45) rotate(10)' }),
    h('path', { d: A, fill: '#fff', transform: 'translate(99 134) scale(.45) rotate(190)' }),
    h('path', { d: 'M8 16Q8 8 16 8h88q8 0 8 8v40C80 50 40 36 8 26z', fill: '#fff', opacity: 0.09 })
  );
}

/* Chapter 5 — Kind Words */
function WordsSpread() {
  const [fl, setFl] = useState([false, false, false, false]);
  const C = ['#d98c85', '#e8cf8f', '#9cc3a8', '#9db8d6'];
  const tog = (i, e) => {
    if (e) e.stopPropagation();
    pageSound();
    setFl(f => f.map((x, j) => (j === i ? !x : x)));
  };

  return h('div', { className: 'words-wrap' },
    h('div', { className: 'leaf-header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8 } },
      h('div', null,
        h('span', { className: 'chapter-kicker' }, 'Chapter 05'),
        h('h2', { className: 'chapter-title' }, 'Kind words')
      ),
      h('p', { className: 'chapter-sub' }, 'tap any UNO card to flip it over')
    ),
    h('div', { className: 'uno-grid' },
      WORDS.map((w, i) =>
        h('div', {
          key: w[0],
          className: 'uno-card' + (fl[i] ? ' on' : ''),
          role: 'button',
          tabIndex: 0,
          'aria-pressed': fl[i],
          'aria-label': `Flip card to read the testimonial from ${w[0]}`,
          style: { '--c': C[i], '--r': [-2, 1.5, -1, 2][i] + 'deg' },
          onClick: e => tog(i, e),
          onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(i, e); } }
        },
          h('div', { className: 'uno-inner' },
            h('div', { className: 'uno-front' }, h(UnoFrontSvg, { c: C[i] })),
            h('div', { className: 'uno-back' },
              h('div', null,
                h('div', { className: 'uno-role' }, w[1]),
                h('div', { className: 'uno-name' }, w[0]),
                h('p', { className: 'uno-quote' }, w[2])
              ),
              h('a', {
                className: 'uno-link',
                href: w[4],
                target: '_blank',
                rel: 'noopener',
                onClick: e => e.stopPropagation()
              }, 'Know more ↗')
            )
          )
        )
      )
    )
  );
}

/* Retro Flip Phone Component */
const DIAL_ITEMS = [
  ['LinkedIn', '/in/ankitha-venkatesh', 'https://www.linkedin.com/in/ankitha-venkatesh-96b547289/'],
  ['GitHub', '/ankithavenkatesh04', 'https://github.com/ankithavenkatesh04'],
  ['Behance', '/ankithavenkatesh', 'https://www.behance.net/ankithavenkatesh'],
  ['Resume', 'Download my CV', './Ankitha_Venkatesh_Resume.pdf']
];

function FlipPhone() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const [st, setSt] = useState('idle');

  const F = [697, 770, 852, 941];
  const G = [1209, 1336, 1477];
  const pos = {
    1: [0, 0], 2: [0, 1], 3: [0, 2],
    4: [1, 0], 5: [1, 1], 6: [1, 2],
    7: [2, 0], 8: [2, 1], 9: [2, 2],
    '*': [3, 0], 0: [3, 1], '#': [3, 2]
  };

  const key = d => {
    const p = pos[d];
    dtmfNote(F[p[0]], 0.14, 'sine');
    dtmfNote(G[p[1]], 0.14, 'sine');
    if (typeof d === 'number' && d >= 1 && d <= DIAL_ITEMS.length) {
      setSel(d - 1);
      setSt('idle');
    }
  };

  const call = () => {
    dtmfNote(880, 0.22, 'square');
    setSt('calling');
    setTimeout(() => setSt('on'), 900);
  };

  const end = () => {
    dtmfNote(330, 0.22, 'square');
    setSt('idle');
    setOpen(false);
  };

  return h('div', { className: 'phone' + (open ? ' open' : '') },
    h('div', { className: 'phone-top' },
      open ? h('div', { className: 'lcd' },
        st === 'idle' && [
          h('div', { key: 'h', className: 'lh' }, 'PRESS 1-4, THEN ☎ DIAL'),
          DIAL_ITEMS.map(([n], i) =>
            h('div', {
              key: n,
              className: 'li' + (i === sel ? ' on' : ''),
              onClick: () => { setSel(i); setSt('idle'); dtmfNote(600, 0.1, 'square'); }
            }, `${i + 1} ${n}`)
          )
        ],
        st === 'calling' && h('div', { className: 'blink' }, `DIALLING ${DIAL_ITEMS[sel][0].toUpperCase()}…`),
        st === 'on' && [
          h('div', { key: 'a' }, 'CONNECTED ✓'),
          h('div', { key: 'b', style: { margin: '5px 0' } }, `${DIAL_ITEMS[sel][0]} ${DIAL_ITEMS[sel][1]}`),
          h('a', { key: 'c', href: DIAL_ITEMS[sel][2], target: '_blank', rel: 'noopener' }, 'OPEN ↗')
        ]
      ) : h('button', {
        className: 'cover-btn',
        onClick: () => { dtmfNote(520, 0.18, 'square'); setOpen(true); },
        'aria-label': 'Open the flip phone and dial'
      },
        h('b', { className: 'blink' }, 'DIAL'),
        h('small', null, '☎ tap to flip open')
      )
    ),
    h('div', { className: 'phone-bot' },
      h('div', { className: 'keys' },
        [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(d =>
          h('button', { key: d, className: 'k', onClick: () => key(d) }, d)
        )
      ),
      h('div', { className: 'cr' },
        h('button', { className: 'call-btn', onClick: call }, '☎ DIAL'),
        h('button', { className: 'end-btn', onClick: end }, 'END')
      )
    )
  );
}

/* Chapter 6 — Let's Talk */
function ContactSpread() {
  const go = React.useContext(NavCtx);
  return h('div', { className: 'contact-spread' },
    h('div', { className: 'phone-wrap' }, h(FlipPhone)),
    h('div', { className: 'leaf-col' },
      h('div', { className: 'leaf-header' },
        h('span', { className: 'chapter-kicker' }, 'Chapter 06'),
        h('h2', { className: 'chapter-title' }, 'Let’s talk'),
        h('p', { className: 'chapter-sub' }, 'the quickest way to reach me: pick up the phone and dial.')
      ),
      h('ol', { className: 'steps' },
        h('li', null, h('b', null, 'Tap'), ' the phone to flip it open'),
        h('li', null, h('b', null, 'Press 1–4'), ' to choose who to call'),
        h('li', null, h('b', null, 'Hit ☎ DIAL'), ' and open the link')
      ),
      h('div', { className: 'encore-teaser' },
        h('div', null,
          h('div', { className: 'hand', style: { fontSize: 20, color: 'var(--coral)' } }, 'One last page before you go…'),
          h('div', { style: { fontSize: 13, color: 'var(--mute)' } }, 'Turn the page for a quick drum solo break.')
        ),
        h('button', { className: 'btn alt', onClick: () => go('drums') }, 'Play Drums →')
      )
    )
  );
}

/* Interactive Acoustic Drum Set SVG */
function DrumKit({ hitN, play }) {
  const on = n => (hitN === n ? ' hit' : '');
  const P = n => ({
    className: 'dr' + on(n),
    onClick: () => play(n),
    tabIndex: 0,
    role: 'button',
    'aria-label': n,
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        play(n);
      }
    }
  });
  const S = { stroke: 'var(--ink)', strokeWidth: 3 };

  const cym = (n, x, y, rx, c, twin) =>
    h('g', { key: n, ...P(n) },
      h('line', { x1: x, y1: y, x2: x, y2: 310, ...S }),
      twin && h('ellipse', { cx: x, cy: y + 9, rx, ry: rx / 6, fill: '#8f8f8a', ...S }),
      h('ellipse', { cx: x, cy: y, rx, ry: rx / 5, fill: c, ...S }),
      h('circle', { cx: x, cy: y, r: 4, fill: 'var(--ink)' }),
      h('text', { x, y: y - rx / 5 - 8, textAnchor: 'middle', className: 'dl' }, n)
    );

  const drum = (n, x, y, rx, ry, ht, c) =>
    h('g', { key: n, ...P(n) },
      h('path', { d: `M${x - rx} ${y} v${ht} a${rx} ${ry} 0 0 0 ${rx * 2} 0 v${-ht} z`, fill: c, ...S }),
      h('ellipse', { cx: x, cy: y, rx, ry, fill: '#fffdf7', ...S }),
      h('text', { x, y: y - ry - 6, textAnchor: 'middle', className: 'dl' }, n)
    );

  return h('svg', { className: 'kit', viewBox: '0 0 520 340', 'aria-label': 'Interactive drum set' },
    cym('Crash', 95, 62, 58, '#e6cf92', false),
    cym('Ride', 430, 78, 66, '#efdca4', false),
    cym('Hi-hat', 44, 168, 40, '#e6cf92', true),
    h('g', { key: 'Bass', ...P('Bass') },
      h('circle', { cx: 265, cy: 258, r: 72, fill: '#e9b8aa', ...S }),
      h('circle', { cx: 265, cy: 258, r: 50, fill: '#fffdf7', ...S }),
      h('text', { x: 265, y: 268, textAnchor: 'middle', style: { font: '800 30px Fraunces,serif', fill: '#111111' } }, '♪'),
      h('text', { x: 265, y: 200, textAnchor: 'middle', className: 'dl' }, 'Bass')
    ),
    drum('High tom', 205, 128, 42, 14, 34, '#a9c9bd'),
    drum('Mid tom', 325, 128, 42, 14, 34, '#c9bfe0'),
    drum('Low tom', 448, 205, 50, 16, 62, '#a9c9bd'),
    drum('Snare', 125, 228, 52, 15, 34, '#e9b8aa')
  );
}

/* Final Page — Before You Leave */
function DrumEncoreSpread() {
  const go = React.useContext(NavCtx);
  const [hitN, setHitN] = useState('');
  const play = n => {
    playDrumSound(n);
    setHitN(n);
    setTimeout(() => setHitN(''), 120);
  };

  return h('div', { className: 'drum-spread' },
    h('div', { className: 'leaf-col' },
      h('span', { className: 'chapter-kicker' }, 'Before You Leave'),
      h('h2', { className: 'chapter-title', style: { marginBottom: 10 } }, 'Take a Rhythm Break'),
      h('p', { style: { color: 'var(--mute)', fontSize: 14.5, lineHeight: 1.55, margin: '0 0 18px' } },
        'You made it to the back cover of my Design Journal! Tap any cymbal, tom, snare, or bass drum to play a quick beat before you head out.'
      ),
      h('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 } },
        h('button', {
          type: 'button',
          className: 'btn alt',
          onClick: e => {
            e.stopPropagation();
            go('cover');
          }
        }, '↺ Back to Cover')
      ),
      h('div', { className: 'hand', style: { fontSize: 20, color: 'var(--mute)' } },
        'Made with care by Ankitha Venkatesh ✎'
      )
    ),
    h('div', { className: 'drum-right-leaf' },
      h('div', { className: 'drum-box' },
        h('div', { className: 'hand', style: { fontSize: 20, color: 'var(--ink)' } }, 'tap the drums to play ♪'),
        h(DrumKit, { hitN, play })
      )
    )
  );
}

/* Old-School Crumpled Paper Modal (2-Minute Crash Course) */
function CrashCourseModal({ open, onClose }) {
  const [showEmailPop, setShowEmailPop] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowEmailPop(false);
      setCopied(false);
      return;
    }
    const onEsc = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const copyEmail = () => {
    const email = 'ankithavenkatesh05@gmail.com';
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {}
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return h('div', {
    className: 'modal-backdrop',
    onClick: onClose,
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'quick-profile-title'
  },
    h('div', { className: 'old-paper-modal', onClick: e => e.stopPropagation() },
      h('button', { className: 'modal-close', onClick: onClose, 'aria-label': 'Close 2-minute crash course' }, '×'),
      h('div', { style: { position: 'relative', zIndex: 2 } },
        h('span', { className: 'hand', style: { fontSize: 22, color: '#3f556b', fontWeight: 700 } }, '2-Minute Crash Course'),
        h('h2', { id: 'quick-profile-title', style: { fontSize: 27, margin: '2px 0 3px', color: '#1c2229' } }, 'Ankitha Venkatesh'),
        h('p', { style: { color: '#47525e', fontSize: 13.5, margin: 0, fontWeight: 600 } },
          'UI/UX Designer & Front-End Prototyper · B.E. in Computer Science Engineering'
        )
      ),
      h('div', { className: 'paper-note-grid' },
        h('div', { className: 'modal-section' },
          h('h4', null, 'About Me'),
          h('p', null,
            'I’m a 23-year-old UX Designer and UI Developer who grew up making things inspired by MAD on Pogo. With a Computer Science Engineering background, I design human-centered interfaces and bring them to life with interactive React prototypes.'
          )
        ),
        h('div', { className: 'modal-section' },
          h('h4', null, 'Experience & Domains'),
          h('div', { className: 'modal-exp-pills' },
            h('span', { className: 'sticker-pill', style: { '--c': '#dce5ee' } }, '1.5 yrs professional experience'),
            h('span', { className: 'sticker-pill', style: { '--c': '#e4ece8' } }, '1 yr self-directed learning')
          ),
          h('p', null,
            'Previously designed learning experiences for students in EdTech (KVR Infinity & CMR University), and currently designing enterprise workflows for banking professionals and business consultants at Atyati Technologies.'
          )
        ),
        h('div', { className: 'modal-section' },
          h('h4', null, 'Skills & Approach'),
          h('p', null,
            'UX research, UI design systems in Figma, rapid vibe-coding, and front-end prototyping in React, HTML/CSS/JS, Webflow, and Framer—bridging design and engineering.'
          )
        ),
        h('div', { className: 'modal-section' },
          h('h4', null, 'Creative Side & Interests'),
          h('p', null,
            'Outside of work, I play the drums, sketch, read books to expand my vocabulary, and occasionally create content for Instagram.'
          )
        )
      ),
      h('div', { className: 'modal-actions' },
        h('a', {
          className: 'btn',
          style: { boxShadow: '3px 3px 0 #5b7083' },
          href: './Ankitha_Venkatesh_Resume.pdf',
          target: '_blank',
          rel: 'noopener',
          download: 'Ankitha_Venkatesh_Resume.pdf'
        }, 'Download CV ↗'),
        h('div', { className: 'social-icon-row' },
          h('button', {
            type: 'button',
            className: 'social-icon-btn',
            onClick: () => setShowEmailPop(v => !v),
            'aria-label': 'Show Email address'
          },
            h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2 },
              h('rect', { x: 2, y: 4, width: 20, height: 16, rx: 3 }),
              h('path', { d: 'M22 6l-10 7L2 6' })
            ),
            'Email'
          ),
          h('a', {
            className: 'social-icon-btn',
            href: 'https://www.linkedin.com/in/ankitha-venkatesh-96b547289/',
            target: '_blank',
            rel: 'noopener',
            'aria-label': 'LinkedIn Profile'
          },
            h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'currentColor' },
              h('path', { d: 'M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z' })
            ),
            'LinkedIn'
          ),
          h('a', {
            className: 'social-icon-btn',
            href: 'https://www.behance.net/ankithavenkatesh',
            target: '_blank',
            rel: 'noopener',
            'aria-label': 'Behance Profile'
          },
            h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'currentColor' },
              h('path', { d: 'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z' })
            ),
            'Behance'
          )
        )
      ),
      showEmailPop && h('div', { className: 'email-copy-popup' },
        h('span', { className: 'email-copy-address' }, 'ankithavenkatesh05@gmail.com'),
        h('button', {
          type: 'button',
          className: 'email-copy-btn',
          onClick: copyEmail
        }, copied ? 'Copied ✓' : 'Copy Email')
      )
    )
  );
}

const PAGES = [
  ['about', 'Chapter 1 · About', AboutSpread],
  ['experience', 'Chapter 2 · Experience', ExperienceSpread],
  ['work', 'Chapter 3 · My Work', WorkSpread],
  ['skills', 'Chapter 4 · Skills', SkillsSpread],
  ['kind-words', 'Chapter 5 · Kind Words', WordsSpread],
  ['contact', 'Chapter 6 · Let’s Talk', ContactSpread],
  ['drums', 'Before You Leave', DrumEncoreSpread]
];

function App() {
  const total = PAGES.length;
  const [bookOpen, setBookOpen] = useState(false);
  const [photoTossed, setPhotoTossed] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipDir, setFlipDir] = useState(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const lockRef = useRef(0);
  const wheelAccRef = useRef(0);
  const lastWheelRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const idxRef = useRef(0);
  const openRef = useRef(false);
  const tossedRef = useRef(false);
  const modalRef = useRef(false);

  useEffect(() => {
    modalRef.current = quickOpen;
  }, [quickOpen]);

  const tossPhoto = () => {
    if (tossedRef.current) return;
    tossedRef.current = true;
    lockRef.current = Date.now() + 650;
    wheelAccRef.current = 0;
    pageSound();
    setPhotoTossed(true);
  };

  const resetPhoto = () => {
    tossedRef.current = false;
    setPhotoTossed(false);
  };

  const openJournal = (targetIdx = 0) => {
    const nextIdx = Math.max(0, Math.min(total - 1, targetIdx));
    if (!openRef.current) {
      openRef.current = true;
      lockRef.current = Date.now() + 950;
      wheelAccRef.current = 0;
      pageSound();
      setBookOpen(true);
      idxRef.current = nextIdx;
      setIdx(nextIdx);
      return;
    }
    if (nextIdx !== idxRef.current) {
      goTo(nextIdx);
    }
  };

  const closeJournal = () => {
    openRef.current = false;
    tossedRef.current = false;
    idxRef.current = 0;
    lockRef.current = Date.now() + 950;
    wheelAccRef.current = 0;
    pageSound();
    setQuickOpen(false);
    setFlipDir(null);
    setPhotoTossed(false);
    setIdx(0);
    setBookOpen(false);
  };

  const goTo = target => {
    if (target < 0) {
      closeJournal();
      return;
    }
    const next = Math.max(0, Math.min(total - 1, target));
    if (!openRef.current) {
      openJournal(next);
      return;
    }
    if (next === idxRef.current) return;
    const dir = next > idxRef.current ? 'fwd' : 'bwd';
    idxRef.current = next;
    lockRef.current = Date.now() + 580;
    wheelAccRef.current = 0;
    pageSound();
    setFlipDir(dir);
    setIdx(next);
    setTimeout(() => setFlipDir(null), 580);
  };

  const goById = id => {
    if (id === 'cover') {
      closeJournal();
      return;
    }
    const found = PAGES.findIndex(p => p[0] === id);
    if (found >= 0) goTo(found);
  };

  useEffect(() => {
    const onWheel = e => {
      if (modalRef.current) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelRef.current > 180) {
        wheelAccRef.current = 0;
      }
      lastWheelRef.current = now;
      if (now < lockRef.current) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      wheelAccRef.current += delta;
      if (Math.abs(wheelAccRef.current) >= 45) {
        const step = wheelAccRef.current > 0 ? 1 : -1;
        wheelAccRef.current = 0;
        if (!openRef.current) {
          if (step > 0 && !tossedRef.current) {
            tossPhoto();
          }
        } else {
          goTo(idxRef.current + step);
        }
      }
    };

    /* Mobile: only an intentional horizontal swipe flips a page. */
    const mobileMQ = window.matchMedia('(max-width: 900px)');
    const SWIPE_MIN_X = 60;        // minimum horizontal travel (px)
    const SWIPE_AXIS_RATIO = 1.6;  // horizontal travel must clearly beat vertical travel
    const AXIS_LOCK_PX = 10;       // movement needed before the gesture direction is decided
    let gestureAxis = null;        // null | 'h' | 'v'
    let multiTouch = false;

    const onTouchStart = e => {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      gestureAxis = null;
      multiTouch = e.touches.length > 1;
    };

    const onTouchMove = e => {
      if (e.touches.length > 1) multiTouch = true;
      if (gestureAxis) return;
      const t = e.touches[0];
      const mx = Math.abs(t.clientX - touchStartRef.current.x);
      const my = Math.abs(t.clientY - touchStartRef.current.y);
      if (mx < AXIS_LOCK_PX && my < AXIS_LOCK_PX) return;
      // Only call it horizontal if it is clearly horizontal; vertical or diagonal = scrolling
      gestureAxis = mx > my * SWIPE_AXIS_RATIO ? 'h' : 'v';
    };

    const onTouchCancel = () => {
      gestureAxis = null;
    };

    const onTouchEnd = e => {
      if (modalRef.current) return;
      const t = e.changedTouches[0];
      const dx = touchStartRef.current.x - t.clientX;
      const dy = touchStartRef.current.y - t.clientY;

      if (mobileMQ.matches && openRef.current) {
        const axis = gestureAxis;
        gestureAxis = null;
        if (multiTouch || axis !== 'h') return;
        if (Math.abs(dx) < SWIPE_MIN_X || Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO) return;
        goTo(idxRef.current + (dx > 0 ? 1 : -1));
        return;
      }

      if (Math.abs(dx) > 48 || Math.abs(dy) > 48) {
        const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        const step = primary > 0 ? 1 : -1;
        if (!openRef.current) {
          if (step > 0 && !tossedRef.current) {
            tossPhoto();
          }
        } else {
          goTo(idxRef.current + step);
        }
      }
    };

    const onKeyDown = e => {
      if (modalRef.current) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (!openRef.current) {
          if (!tossedRef.current) tossPhoto();
          else openJournal(0);
        } else {
          goTo(idxRef.current + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (openRef.current) goTo(idxRef.current - 1);
        else if (tossedRef.current) resetPhoto();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const activeGroup = !bookOpen ? '' : CHAPTER_GROUP[PAGES[idx][0]];
  const ActivePageComponent = PAGES[idx][2];
  const ribbonPercent = 24 + (idx / (total - 1)) * 52;

  return h(NavCtx.Provider, { value: goById },
    h('header', { className: 'topbar' },
      NAV_GROUPS.map(([id, label, color]) =>
        h('button', {
          key: id,
          className: 'nav-tab' + (activeGroup === id ? ' on' : ''),
          style: { '--c': color },
          onClick: () => goById(id)
        }, label)
      )
    ),

    h('main', { className: 'desk-stage' },
      h('div', { className: 'journal-assembly' + (!bookOpen ? ' is-closed' : '') },
        h(ClosedBookCover, {
          isOpen: bookOpen,
          photoTossed,
          onTossPhoto: tossPhoto,
          onResetPhoto: resetPhoto,
          onOpenJournal: () => openJournal(0),
          onOpenCrashCourse: () => {
            if (!openRef.current && tossedRef.current) {
              setQuickOpen(true);
            }
          }
        }),
        h('div', { className: 'hardcover' }),
        h('div', { className: 'ribbon', style: { left: `${ribbonPercent}%` } }),
        h('div', { className: 'paper-block' }),
        h('div', { className: 'spread-surface' },
          h('div', { className: 'spine-stitches', 'aria-hidden': true },
            [0, 1, 2, 3, 4].map(n => h('span', { key: n }))
          ),
          flipDir && h('div', { key: idx + flipDir, className: `flip-leaf ${flipDir}` }),
          h('div', { key: PAGES[idx][0], className: 'chapter-body' },
            h(ActivePageComponent)
          )
        )
      )
    ),

    h('footer', { className: 'pager' },
      h('button', {
        className: 'pg-btn',
        onClick: () => goTo(idx - 1),
        disabled: !bookOpen,
        'aria-label': 'Previous page'
      }, '‹'),
      h('div', { className: 'dots' },
        h('button', {
          className: 'dot' + (!bookOpen ? ' on' : ''),
          onClick: closeJournal,
          'aria-label': 'Close book cover',
          'aria-current': !bookOpen ? 'page' : undefined
        }),
        PAGES.map(([id, title], i) =>
          h('button', {
            key: id,
            className: 'dot' + (bookOpen && i === idx ? ' on' : ''),
            onClick: () => goTo(i),
            'aria-label': `Go to ${title}`,
            'aria-current': bookOpen && i === idx ? 'page' : undefined
          })
        )
      ),
      h('button', {
        className: 'pg-btn',
        onClick: () => (!bookOpen ? openJournal(0) : goTo(idx + 1)),
        disabled: bookOpen && idx === total - 1,
        'aria-label': 'Next page'
      }, '›'),
      h('span', { className: 'pgl hand' },
        !bookOpen ? 'Front Cover · Closed' : `${PAGES[idx][1]} · ${idx + 1} / ${total}`
      ),
      h('span', { className: 'hint hand' },
        !bookOpen
          ? (photoTossed ? 'choose an option on the cover paper' : 'scroll down to toss photo & reveal options')
          : 'scroll, swipe, or use ← → to turn pages'
      )
    ),

    h(CrashCourseModal, { open: quickOpen, onClose: () => setQuickOpen(false) })
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));