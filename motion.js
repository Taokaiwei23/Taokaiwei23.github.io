import { createTimeline, utils, waapi, animate, stagger, svg } from './node_modules/animejs/lib/anime.esm.min.js';
import { getZcboxController } from './zcbox-editor.js';

// [迭代-v16] 首页入场动画初始状态：背景全灰
// [迭代-v26] 预设初始值让浏览器在合成器线程准备好图层，消除首次导航点击的图层创建开销
const bgEl = document.querySelector('.backgroundcolor');
if (bgEl) {
  // 强制读取一次 computed style 触发图层创建（配合 CSS will-change: contents）
  void bgEl.offsetWidth;
}
utils.set('.backgroundcolor', {
  '--deg-0': '90deg',
  '--color-1': 'rgb(243, 243, 243)',
  '--color-2': 'rgb(243, 243, 243)',
  '--color-3': 'rgb(243, 243, 243)',
  '--color-4': 'rgb(243, 243, 243)',
  '--color-5': 'rgb(243, 243, 243)',
  '--deg-1': '0deg',
  '--deg-2': '0deg',
  '--deg-3': '0deg',
  '--deg-4': '0deg',
  '--deg-5': '0deg',
});

const [$zc] = utils.$('#zc');
const [$al] = utils.$('#al');
const [$lx] = utils.$('#lx');
const [$zc2] = utils.$('#zc-title2');
const [$al2] = utils.$('#al-title2');
const [$lx2] = utils.$('#lx-title2');
const [$zc3] = utils.$('#zc-title3');
const [$al3] = utils.$('#al-title3');
const [$lx3] = utils.$('#lx-title3');
const [$hellologo] = utils.$('#hellologo');//欢迎logo事件
const [$homelogo] = utils.$('#homelogo');//重载logo事件
const [$logo2] = utils.$('#logo2');//“陶”字logo点击事件
const [$cardDialog] = utils.$('#card-layout-dialog');
const [$cardModalBackdrop] = utils.$('#card-modal-backdrop');
const [$cardModalPanel] = utils.$('#card-modal-panel');
const [$cardModalHeader] = utils.$('#card-modal-header');
const [$cardModalTitle] = utils.$('#card-modal-title');
const [$cardModalGallery] = utils.$('#card-modal-gallery');
const [$cardModalScroll] = utils.$('#card-modal-scroll');
const [$cardModalClose] = utils.$('#card-modal-close');
const [$cardModalThumbGhost] = utils.$('#card-modal-thumb-ghost');
const [$cardModalScrollbar] = utils.$('#card-modal-scrollbar');
const [$cardModalScrollbarThumb] = utils.$('#card-modal-scrollbar-thumb');
// [迭代-v28] 卡片标题气泡 DOM 引用
const [$cardTooltip] = utils.$('#card-tooltip');


let homelogoPlayed = false;
const zcboxController = getZcboxController();

const homelogoline = createTimeline({
  autoplay: false
})
  .add('#logo1,#homelogo', {
    marginLeft: '-42vw',
    marginTop: '-42vh',
    opacity: 0.5,
    scale: [1, 0.26],
    ease: 'outQuart',

    duration: 720,
    composition: 'replace',

  })

  .add('#homelogo', {
    'pointer-events': 'auto',
    duration: 0,
  }, '<<')


$homelogo.onmouseenter = () => createTimeline()
  .add("#logo1", {
    scale: [0.26, 0.3],
    opacity: [0.6, 1],
    duration: 200,
    easing: 'inExpo',
    composition: 'blend',
  })
$homelogo.onmouseout = () => createTimeline()
  .add("#logo1", {
    scale: [0.3, 0.26],
    opacity: [1, 0.6],
    duration: 200,
    easing: 'inExpo',
    composition: 'blend',
  })

let hoverTimer;

// [迭代-v23] 导航点击前终止 hover 定时器及运行中的动画，仅在 logo 尚未缩小时复位初始态
const resetLogoForNav = () => {
  if (hoverTimer) clearTimeout(hoverTimer);
  if (!homelogoPlayed) {
    utils.remove('#logo1');
    utils.remove('#logo2');
    utils.set('#logo1', { scale: 1, opacity: 1, marginLeft: '0', marginTop: '0' });
    utils.set('#logo2', { scale: 0, opacity: 0 });
  }
};

$hellologo.onmouseenter = () => {
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => {
    createTimeline()
      .add("#logo1", {
        scale: [1, 0],
        opacity: [1, 0],
        duration: 200,
        easing: 'inExpo',
        composition: 'blend',
      })
      .add("#logo2", {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'outExpo',
        composition: 'blend',
      }, "<<")
      .add(svg.createDrawable('.line1'), {
        draw: ['0 0', '0 1'],
        duration: 600,
        loop: 0,
        composition: 'blend',
      }, "<<")
      .add(svg.createDrawable('.line2'), {
        draw: ['0 0', '0 1'],
        duration: 1000,
        easing: 'inExpo',
        loop: 0,
        composition: 'blend',
      }, "<<");
  }, 300); 
};
$hellologo.onmouseleave = () => {
  if (hoverTimer) clearTimeout(hoverTimer);
};
$hellologo.onmouseout = () => createTimeline()
  .add("#logo2", {
    scale: [1, 0],
    opacity: [1, 0],
    duration: 200,
    easing: 'outExpo',
    composition: 'blend',
  })
  .add("#logo1", {
    scale: [0, 1.2, 1],
    opacity: [0, 1],
    duration: 200,
    easing: 'createSpring(1, 100, 10, 0)',
    composition: 'blend',
  }, "<<")
$hellologo.onmousedown = (e) => animate($logo2, {
  scale: 0.9,
  duration: 300,
  composition: 'blend',
})

// [迭代-v17] 敲木鱼效果：点击 logo 后右上角浮出"功德+1"
const spawnMeritText = (e) => {
  const rect = $hellologo.getBoundingClientRect();
  const el = document.createElement('span');
  el.textContent = '功德 +1';
  el.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    font-family: 'NotoSansSC-VariableFont_wght', sans-serif;
    font-optical-sizing: auto; font-weight: 300; font-style: normal;
    font-size: 14px; letter-spacing: 0.2rem; color: #fff;
    mix-blend-mode: difference; white-space: nowrap;
    left: ${rect.right -  99}px; top: ${rect.top + 24}px;
    opacity: 0; transform: scale(0.5);
  `;
  document.body.appendChild(el);

  createTimeline()
    .add(el, {
      opacity: [0, 1],
      scale: [0.6, 1],
      translateY: ['32px', '0px'],
      duration: 400,
      ease: 'outExpo',
    })
    .add(el, {
      opacity: [1, 0],
      duration: 600,
      ease: 'outQuart',
    }, '+=200')
    .finished.then(() => el.remove());
};

$hellologo.onmouseup = (e) => {
  animate($logo2, {
    scale: 1,
    duration: 300,
    composition: 'blend',
  });
  spawnMeritText(e);
};

$zc.onmouseenter = () => createTimeline()
  .add('#zc-title', {
    '--weight-0': '160',
    x: 10,
    y: 10,
    scale: 1.2,
    opacity: 0.6,
    duration: 400,
    composition: 'blend',
  })
$zc.onmouseout = () => createTimeline()
  .add('#zc-title', {
    '--weight-0': '300',
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 450,
    composition: 'blend',
  })
$al.onmouseenter = () => createTimeline()
  .add('#al-title', {
    '--weight-0': '160',
    x: 10,
    y: 10,
    scale: 1.2,
    opacity: 0.6,
    duration: 400,
    composition: 'blend',
  })
$al.onmouseout = () => createTimeline()
  .add('#al-title', {
    '--weight-0': '300',
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 450,
    composition: 'blend',
  })
$lx.onmouseenter = () => createTimeline()
  .add('#lx-title', {
    '--weight-0': '160',
    x: 10,
    y: 10,
    scale: 1.2,
    opacity: 0.6,
    duration: 400,
    composition: 'blend',
  })
$lx.onmouseout = () => createTimeline()
  .add('#lx-title', {
    '--weight-0': '300',
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 450,
    composition: 'blend',
  })

const selectors = ['#zc-title2', '#al-title2', '#lx-title2', '#zc-title3', '#al-title3', '#lx-title3'];

// 二次导航通用动画
selectors.forEach(selector => {
  const [element] = utils.$(selector);
  element.onmouseenter = () => {
    createTimeline()
      .add(selector, {
        '--weight-0': '160',

        scale: 1.2,
        opacity: 0.6,
        duration: 400,
        composition: 'blend',
      });
  };
  element.onmouseout = () => {
    createTimeline()
      .add(selector, {
        '--weight-0': '300',

        scale: 1,
        opacity: 1,
        duration: 450,
        composition: 'blend',
      });
  };
});


//点击事件

$zc.onclick = () => {
  // [迭代-v23] 先复位 logo 状态，避免与 hover 动画冲突
  resetLogoForNav();
  // [迭代-v26] 中断入场动画，避免两套背景动画竞争掉帧
  stopEntranceIfRunning();
  createTimeline()
    // .sync(homelogoline)
    .add('#zc-title', {
      '--weight-0': '160',
      filter: 'blur(0px)',
      x: 10,
      y: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 400,
    }, '<<')
    .add('.backgroundcolor', {
      '--deg-0': '180deg',
      '--deg-2': '29deg',
      '--color-5': 'rgb(65, 43, 29)',
      ease: 'outQuart',
      duration: 1300,
    }, '<<')
    .add('.backgroundcolor', {
      '--deg-3': '57deg',
      '--deg-4': '182deg',
      '--color-3': 'rgb(7, 19, 31)',
      ease: 'outQuart',
      duration: 1600,
    }, '<<')
    .add('#al2', {
      opacity: 0.6,
      rotate: ['-90deg', '-28deg'],
      ease: 'outQuart',
      'pointer-events': 'auto'
    }, '<<')
    .add('#lx2', {
      opacity: 0.6,
      rotate: ['-90deg', '-57deg'],
      ease: 'outQuart',
      'pointer-events': 'auto'
    }, '<<')
    .add('#zc3,#al3,#zc2,#lx3', {
      opacity: 0,
      rotate: '+6deg',
      ease: 'outQuart',
      'pointer-events': 'none'
    }, '<<')
    .add('#al-title,#lx-title', {
      filter: 'blur(5px)',
      opacity: 0,
      duration: 600,
    }, '<<');








  ;[$zc, $al, $lx, $hellologo].forEach(element => {
    if (element) {
      element.onmouseenter = null;
      element.onmouseout = null;
      element.onmouseup = null;
element.onclick = null;
    }

  });
  if (!homelogoPlayed) {
    createTimeline()
      .sync(homelogoline)
    homelogoPlayed = true;
  };
  $homelogo.onclick = homelogoClick;
  $homelogo.onmouseenter = homelogoMouseEnter;
  $homelogo.onmouseout = homelogoMouseOut;
  // 移除另外两个监听，另外两个下面也要写，记得检查 timeline 命名
  $al.removeEventListener('click', playTimeline);
  $lx.removeEventListener('click', playlxTimeline);
}
$zc2.onclick = $zc3.onclick = $zc.onclick;

$al.onclick = () => {
  // [迭代-v23] 先复位 logo 状态，避免与 hover 动画冲突
  resetLogoForNav();
  // [迭代-v26] 中断入场动画，避免两套背景动画竞争掉帧
  stopEntranceIfRunning();
  createTimeline()
    // .sync(homelogoline)
    .add('#al-title', {
      '--weight-0': '160',
      filter: 'blur(0px)',
      x: 10,
      y: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 400,
    }, '<<')
    .add('.backgroundcolor', {
      '--deg-0': '270deg',
      '--deg-2': '12deg',
      '--color-3': 'rgb(65, 43, 29)',
      ease: 'outQuart',
      duration: 1300,
    }, '<<')
    .add('.backgroundcolor', {
      '--deg-3': '31deg',
      '--deg-4': '93deg',
      '--color-5': 'rgb(7, 19, 31)',
      ease: 'outQuart',
      duration: 1600,
    }, '<<')
    .add('#zc2', {
      opacity: 0.6,
      rotate: ['0deg', '15deg'],
      ease: 'outQuart',
      'pointer-events': 'auto'
    }, '<<')
    .add('#lx3', {
      opacity: 0.6,
      rotate: ['0deg', '35deg'],
      ease: 'outQuart',
      'pointer-events': 'auto'
    }, '<<')
    .add('#al2,#lx2,#al3,#zc3', {
      opacity: 0,
      rotate: '+6deg',
      ease: 'outQuart',
      'pointer-events': 'none'
    }, '<<')
    .add('#zc-title,#lx-title', {
      filter: 'blur(5px)',
      opacity: 0,
      duration: 600,
    }, '<<')








    ;[$zc, $al, $lx, $hellologo].forEach(element => {
      if (element) {
        element.onmouseenter = null;
        element.onmouseout = null;
        element.onmouseup = null;
element.onclick = null;
      }

    });
  if (!homelogoPlayed) {
    createTimeline()
      .sync(homelogoline)
    homelogoPlayed = true;
  };
  $homelogo.onclick = homelogoClick;
  $homelogo.onmouseenter = homelogoMouseEnter;
  $homelogo.onmouseout = homelogoMouseOut;
  $zc.removeEventListener('click', playzcTimeline);
  $lx.removeEventListener('click', playlxTimeline);
}
$al2.onclick = $al3.onclick = $al.onclick;



$lx.onclick = () => {
  // [迭代-v23] 先复位 logo 状态，避免与 hover 动画冲突
  resetLogoForNav();
  // [迭代-v26] 中断入场动画，避免两套背景动画竞争掉帧
  stopEntranceIfRunning();
  createTimeline()
    // .sync(homelogoline)
    .add('#lx-title', {
      '--weight-0': '160',
      filter: 'blur(0px)',
      x: 10,
      y: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 400,
    }, '<<')
    .add('.backgroundcolor', {
      '--deg-0': '90deg',
      '--deg-2': '325deg',
      '--color-5': 'rgb(65, 43, 29)',
      ease: 'outQuart',
      duration: 1300,
    }, '<<')
    .add('.backgroundcolor', {
      '--deg-3': '341deg',
      '--deg-4': '341deg',
      '--color-3': 'rgb(7, 19, 31)',
      ease: 'outQuart',
      duration: 1600,
    }, '<<')
    .add('#al3', {
      opacity: 0.6,
      rotate: ['-90deg', '-15deg'],
      ease: 'outQuart',
      'pointer-events': 'auto'
    }, '<<')
    .add('#zc3', {
      opacity: 0.6,
      rotate: ['-90deg', '-35deg'],
      ease: 'outQuart',
      'pointer-events': 'auto'
    }, '<<')
    .add('#al2,#lx2,#zc2,#lx3', {
      opacity: 0,
      rotate: '+6deg',
      ease: 'outQuart',
      'pointer-events': 'none'
    }, '<<')
    .add('#zc-title,#al-title', {
      filter: 'blur(5px)',
      opacity: 0,
      duration: 600,
    }, '<<')








    ;[$zc, $al, $lx, $hellologo].forEach(element => {
      if (element) {
        element.onmouseenter = null;
        element.onmouseout = null;
        element.onmouseup = null;
element.onclick = null;
      }

    });
  if (!homelogoPlayed) {
    createTimeline()
      .sync(homelogoline)
    homelogoPlayed = true;
  };
  $homelogo.onclick = homelogoClick;
  $homelogo.onmouseenter = homelogoMouseEnter;
  $homelogo.onmouseout = homelogoMouseOut;
  $al.removeEventListener('click', playTimeline);
  $zc.removeEventListener('click', playzcTimeline);
  
}
$lx2.onclick = $lx3.onclick = $lx.onclick;


const hellologoMouseEnter = $hellologo.onmouseenter;
const hellologoMouseOut = $hellologo.onmouseout;
const hellologoClick = $hellologo.onclick;
const hellologoMouseUp = $hellologo.onmouseup;
const homelogoMouseEnter = $homelogo.onmouseenter;
const homelogoMouseOut = $homelogo.onmouseout;

const zcMouseEnter = $zc.onmouseenter;
const zcMouseOut = $zc.onmouseout;
const zcClick = $zc.onclick;
const alMouseEnter = $al.onmouseenter;
const alMouseOut = $al.onmouseout;
const alClick = $al.onclick;
const lxMouseEnter = $lx.onmouseenter;
const lxMouseOut = $lx.onmouseout;
const lxClick = $lx.onclick;
$homelogo.onclick = () => {
  homelogoPlayed = false;
  createTimeline()
    .add('.backgroundcolor', {
      '--deg-0': '90deg',
      '--deg-2': '0deg',
      '--color-3': 'rgb(7, 19, 31)',
      ease: 'outQuart',
      duration: 1300,
    })
    .add('.backgroundcolor', {
      '--deg-3': '180deg',
      '--deg-4': '269deg',
      '--color-5': 'rgb(65, 43, 29)',
      ease: 'outQuart',
      duration: 1600,
    }, '<<')
  .add('.cardbox', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'

    }, '<<')
    .add('.card', {
      rotate: 0,
      rotateZ: { to: stagger(0, { from: 'first' }), ease: 'inOut(2)' },
      y: { to: '-50%', duration: 400 },
      transformOrigin: '50% 100%',
      delay: stagger(1, { from: 'last' }),

    }, '<<')
    // [迭代-v25] 尾圆 logo 复位
    .add('#cap-logo-tail', {
      rotateZ: 0,
      duration: 400,
    }, '<<')
    .add('#logo1', {
      opacity: 1,
      scale: 1,
      marginLeft: 0,
      marginTop: 0,

      ease: 'outQuart',
      duration: 720,
    }, '<<')


    .add('#zc2, #lx2,#al2,#zc3,#lx3,#al3', {
      opacity: 0,
      rotate: '+6deg',
      ease: 'outQuart',
      'pointer-events': 'none'

    }, '<<')

    .add('#zc-title, #al-title, #lx-title', {
      filter: 'blur(0px)',
      '--weight-0': '300',
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration: 400,
      'pointer-events': 'auto'

    }, '<<')
    .add('.cardbox', {
      visibility: 'hidden',
      duration: 0,
    }, '<<+=800')

    ;[$homelogo].forEach(element => {
      if (element) {
        element.onmouseenter = null;
        element.onmouseout = null;
        element.onmouseup = null;
element.onclick = null;
      }

    });



  $zc.onmouseenter = zcMouseEnter;
  $zc.onmouseout = zcMouseOut;
  $zc.onclick = zcClick;
  $al.onmouseenter = alMouseEnter;
  $al.onmouseout = alMouseOut;
  $al.onclick = alClick;
  $lx.onmouseenter = lxMouseEnter;
  $lx.onmouseout = lxMouseOut;
  $lx.onclick = lxClick;
  $hellologo.onmouseenter = hellologoMouseEnter;
  $hellologo.onmouseout = hellologoMouseOut;
  $hellologo.onclick = hellologoClick;
  $hellologo.onmouseup = hellologoMouseUp;
  $al.addEventListener('click', playTimeline, { once: true });
  $lx.addEventListener('click', playlxTimeline, { once: true });
  $zc.addEventListener('click', playzcTimeline, { once: true });
}
const homelogoClick = $homelogo.onclick;




//余白页面内容事件

const lxcardline = createTimeline({
  autoplay: false,
  loop: false,

})
  .add('#lxbox', {

    rotate: [-90, 0],
    opacity: [0, 1],
    duration: 400,
    ease: 'outBack',
    'pointer-events': 'auto',
  },)
  .add('.huanzx', {
    opacity: [0, 1],
    duration: 400,
  }, '<<')
  .add('#lx_ys', {
    opacity: [0, 1],
    rotate: [0, 50],
    duration: 400,
  }, '<<')
  .add('#lx_mp', {
    opacity: [0, 1],
    rotate: [0, 0],
    duration: 400,
  }, '<<')
  .add('#lx_yk', {
    opacity: [0, 1],
    rotate: [-90, -72],
    duration: 400,
  }, '<<')
  .add('#lx_yk_tao', {
    opacity: [0, 1],
    rotate: 30,
    duration: 400,
  }, '<<')
  .add('#lx_mp_fk', {
    opacity: [0, 1],
    rotate: 15,
    duration: 400,
  }, '<<')
  .add('#lx_ys_1', {
    opacity: [0, 1],
    rotate: -15,
    duration: 400,
  }, '<<')


// [迭代-v13] 入场时关闭 lxbox 的 CSS transition，避免与 animejs 动画冲突导致卡顿
const $lxboxEl = utils.$('#lxbox')[0];
const lxboxTransition = $lxboxEl.style.transition;

const disableLxboxTransition = () => { $lxboxEl.style.transition = 'none'; };
const restoreLxboxTransition = () => { $lxboxEl.style.transition = lxboxTransition; };

const playlxTimeline = () => {
  disableLxboxTransition();
  // [迭代-v13] 通知 layout.js 暂停 resize 缩放更新，避免入场时 transform 冲突导致卡顿
  if (window.__lxboxAnimating) window.__lxboxAnimating.set(true);
  lxcardline.play();
  lxcardline.finished.then(() => {
    restoreLxboxTransition();
    if (window.__lxboxAnimating) window.__lxboxAnimating.set(false);
  });
};
const reverselxTimeline = () => {
  disableLxboxTransition();
  if (window.__lxboxAnimating) window.__lxboxAnimating.set(true);
  lxcardline.reverse();
  lxcardline.finished.then(() => {
    restoreLxboxTransition();
    if (window.__lxboxAnimating) window.__lxboxAnimating.set(false);
  });
};

$lx.addEventListener('click', playlxTimeline, { once: true });
$lx2.addEventListener('click', playlxTimeline);
$lx3.addEventListener('click', playlxTimeline);
$zc2.addEventListener('click', reverselxTimeline);
$zc3.addEventListener('click', reverselxTimeline);
$al2.addEventListener('click', reverselxTimeline);
$al3.addEventListener('click', reverselxTimeline);
$homelogo.addEventListener('click', reverselxTimeline);


//镜花页面内容事件
// [迭代-v06] 预览图与弹窗图集使用程序化 SVG，便于后续快速替换成真实素材
const escapeSvgText = (text) => String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const createCasePoster = ({ title, subtitle, colors, width = 1200, height = 1680 }) => {
  const [colorA, colorB, colorC] = colors;
  const safeTitle = escapeSvgText(title);
  const safeSubtitle = escapeSvgText(subtitle);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colorA}" />
      <stop offset="58%" stop-color="${colorB}" />
      <stop offset="100%" stop-color="${colorC}" />
    </linearGradient>
    <filter id="blur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="${Math.max(12, Math.round(width * 0.015))}" />
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${Math.round(width * 0.2)}" cy="${Math.round(height * 0.2)}" r="${Math.round(width * 0.24)}" fill="rgba(255,255,255,0.22)" filter="url(#blur)"/>
  <circle cx="${Math.round(width * 0.82)}" cy="${Math.round(height * 0.78)}" r="${Math.round(width * 0.32)}" fill="rgba(0,0,0,0.16)" filter="url(#blur)"/>
  <path d="M0 ${Math.round(height * 0.72)} C ${Math.round(width * 0.22)} ${Math.round(height * 0.61)}, ${Math.round(width * 0.58)} ${Math.round(height * 0.9)}, ${width} ${Math.round(height * 0.78)} L ${width} ${height} L 0 ${height} Z" fill="rgba(8,12,20,0.26)"/>
  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.12)}" fill="rgba(255,255,255,0.94)" font-size="${Math.round(width * 0.052)}" font-family="Noto Sans SC, Arial, sans-serif" letter-spacing="3">${safeTitle}</text>
  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.18)}" fill="rgba(255,255,255,0.72)" font-size="${Math.round(width * 0.022)}" font-family="Noto Sans SC, Arial, sans-serif" letter-spacing="2">${safeSubtitle}</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const buildCaseEntry = ({ id, title, subtitle, href = '', palettes = [] }) => {
  const thumb = createCasePoster({
    title,
    subtitle: `${subtitle} / THUMB`,
    colors: palettes[0],
    width: 540,
    height: 810,
  });

  const gallery = palettes.map((palette, idx) => createCasePoster({
    title,
    subtitle: `${subtitle} / FRAME ${idx + 1}`,
    colors: palette,
  }));

  return { id, title, href, thumb, gallery };
};

const CARD_CASES = [
  // [迭代-v28] case-01 无真实内容图片，标记为占位状态，标题改为"作者努力中..."
  (() => {
    const entry = buildCaseEntry({
      id: 'case-01',
      title: '作者努力中...',
      subtitle: 'COMING SOON',
      palettes: [['#24243e', '#302b63', '#0f0c29'], ['#283e51', '#4b79a1', '#1b3047'], ['#485563', '#29323c', '#1f2833'], ['#314755', '#26a0da', '#2f3e46']],
    });
    entry.hasContent = false;
    // gallery 清空，无内容可展示
    entry.gallery = [];
    return entry;
  })(),
  // [迭代-v27] 案例图片替换：2.png 补充缩略图，gallery 分段切图（6段）
  (() => {
    const entry = buildCaseEntry({
      id: 'case-02',
      title: '关于本站',
      subtitle: 'WIND ECHO',
      palettes: [['#1e3c72', '#2a5298', '#1f2933'], ['#355c7d', '#6c5b7b', '#355c7d'], ['#5f2c82', '#49a09d', '#30475e'], ['#16222a', '#3a6073', '#0f2027']],
    });
    entry.thumb = 'assets/cases/2.png';
    // [迭代-v27] 2000px 分段切图，6段
    entry.gallery = ['assets/cases/2_1_s01.png', 'assets/cases/2_1_s02.png', 'assets/cases/2_1_s03.png', 'assets/cases/2_1_s04.png', 'assets/cases/2_1_s05.png', 'assets/cases/2_1_s06.png'];
    return entry;
  })(),
  // [迭代-v27] 案例图片替换：3.png 替换 thumb，3_1.png 替换 gallery
  (() => {
    const entry = buildCaseEntry({
      id: 'case-03',
      title: 'Skill-H5转纸媒排版',
      subtitle: 'PRISM SHARDS',
      palettes: [['#4e4376', '#2b5876', '#141e30'], ['#355c7d', '#c06c84', '#6c5b7b'], ['#2c3e50', '#4ca1af', '#1f2a36'], ['#654ea3', '#eaafc8', '#4a3f72']],
    });
    entry.thumb = 'assets/cases/3.png';
    // [迭代-v27] 2000px 分段切图，8段
    entry.gallery = ['assets/cases/3_1_s01.png', 'assets/cases/3_1_s02.png', 'assets/cases/3_1_s03.png', 'assets/cases/3_1_s04.png', 'assets/cases/3_1_s05.png', 'assets/cases/3_1_s06.png', 'assets/cases/3_1_s07.png', 'assets/cases/3_1_s08.png'];
    return entry;
  })(),
  // [迭代-v27] 案例图片替换：4.png 替换 thumb，4_1.png 替换 gallery
  (() => {
    const entry = buildCaseEntry({
      id: 'case-04',
      title: '工作流-AI赋能PRD',
      subtitle: 'URBAN GRID',
      palettes: [['#0f2027', '#203a43', '#2c5364'], ['#1f4037', '#99f2c8', '#22577a'], ['#28313b', '#485461', '#2d4059'], ['#16222a', '#3a6073', '#263238']],
    });
    entry.thumb = 'assets/cases/4.png';
    // [迭代-v27] 2000px 分段切图，8段
    entry.gallery = ['assets/cases/4_1_s01.png', 'assets/cases/4_1_s02.png', 'assets/cases/4_1_s03.png', 'assets/cases/4_1_s04.png', 'assets/cases/4_1_s05.png', 'assets/cases/4_1_s06.png', 'assets/cases/4_1_s07.png', 'assets/cases/4_1_s08.png'];
    return entry;
  })(),
  // [迭代-v27] 案例图片替换：5.png 替换 thumb，5_1.png 替换 gallery
  (() => {
    const entry = buildCaseEntry({
      id: 'case-05',
      title: '脚本-H5图片提取器',
      subtitle: 'TIDE TRACE',
      palettes: [['#0f0c29', '#302b63', '#24243e'], ['#1d4350', '#a43931', '#2f4858'], ['#2c3e50', '#3498db', '#1f2937'], ['#373b44', '#4286f4', '#1b3a4b']],
    });
    entry.thumb = 'assets/cases/5.png';
    // [迭代-v27] 2000px 分段切图，6段
    entry.gallery = ['assets/cases/5_1_s01.png', 'assets/cases/5_1_s02.png', 'assets/cases/5_1_s03.png', 'assets/cases/5_1_s04.png', 'assets/cases/5_1_s05.png', 'assets/cases/5_1_s06.png'];
    return entry;
  })(),
  // [迭代-v27] 案例图片替换：6.png 替换 thumb，6_1.png 替换 gallery
  (() => {
    const entry = buildCaseEntry({
      id: 'case-06',
      title: 'UIKit-Tiantale阅读',
      subtitle: 'MASS COMPOSE',
      palettes: [['#536976', '#292e49', '#1c1f2a'], ['#232526', '#414345', '#2f3640'], ['#2c3e50', '#bdc3c7', '#1b1d2a'], ['#606c88', '#3f4c6b', '#2d3142']],
    });
    entry.thumb = 'assets/cases/6.png';
    // [迭代-v27] 2000px 分段切图，6段
    entry.gallery = ['assets/cases/6_1_s01.png', 'assets/cases/6_1_s02.png', 'assets/cases/6_1_s03.png', 'assets/cases/6_1_s04.png', 'assets/cases/6_1_s05.png', 'assets/cases/6_1_s06.png'];
    return entry;
  })(),
  // [迭代-v27] 案例图片替换：7.png 替换 thumb，7_1.png 分段切图（5段）
  (() => {
    const entry = buildCaseEntry({
      id: 'case-07',
      title: 'UIKit-画涯漫画',
      subtitle: 'LIGHT WELL',
      palettes: [['#2c3e50', '#4ca1af', '#203a43'], ['#1f1c2c', '#928dab', '#2b2d42'], ['#3e5151', '#decba4', '#2f3e46'], ['#232526', '#0f2027', '#314755']],
    });
    entry.thumb = 'assets/cases/7.png';
    // [迭代-v27] 2000px 分段切图，5段
    entry.gallery = ['assets/cases/7_1_s01.png', 'assets/cases/7_1_s02.png', 'assets/cases/7_1_s03.png', 'assets/cases/7_1_s04.png', 'assets/cases/7_1_s05.png'];
    return entry;
  })(),
];

const caseById = new Map(CARD_CASES.map((entry) => [entry.id, entry]));

let activeModalCard = null;
let activeModalCase = null;
let isCardModalAnimating = false;
let isScrollbarDragging = false;
let scrollbarDragStartY = 0;
let scrollbarDragStartScrollTop = 0;
// [迭代-v19] iOS 风格滚动条自动隐藏计时器
let scrollbarAutoHideTimer = null;
const SCROLLBAR_AUTO_HIDE_DELAY = 1500;
// [迭代-v21] 标题栏背景渐显：滚动超过此阈值后毛玻璃完全显现
const HEADER_BG_FADE_DISTANCE = 32;

const updateModalScrollbar = () => {
  if (!$cardModalScroll || !$cardModalScrollbar || !$cardModalScrollbarThumb) return;

  const scrollRange = $cardModalScroll.scrollHeight - $cardModalScroll.clientHeight;
  if (scrollRange <= 1) {
    $cardModalScrollbar.classList.add('is-hidden');
    return;
  }

  // [迭代-v19] iOS 风格：内容可滚动时显示轨道，滚动时通过 is-visible 控制淡入淡出
  $cardModalScrollbar.classList.remove('is-hidden');
  const trackHeight = $cardModalScrollbar.clientHeight;
  const thumbHeight = Math.max(44, Math.round(trackHeight * ($cardModalScroll.clientHeight / $cardModalScroll.scrollHeight)));
  const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
  const thumbTop = ($cardModalScroll.scrollTop / scrollRange) * maxThumbTop;

  $cardModalScrollbarThumb.style.height = `${thumbHeight}px`;
  $cardModalScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
};

// [迭代-v19] iOS 风格：显示滚动条并重置自动隐藏计时器
const showScrollbarAndResetTimer = () => {
  if (!$cardModalScrollbar || $cardModalScrollbar.classList.contains('is-hidden')) return;
  $cardModalScrollbar.classList.add('is-visible');
  clearTimeout(scrollbarAutoHideTimer);
  scrollbarAutoHideTimer = setTimeout(() => {
    $cardModalScrollbar?.classList.remove('is-visible');
  }, SCROLLBAR_AUTO_HIDE_DELAY);
};

const getElementRotation = ($el) => {
  const transform = getComputedStyle($el).transform;
  if (!transform || transform === 'none') return 0;

  const MatrixCtor = window.DOMMatrixReadOnly || window.DOMMatrix || window.WebKitCSSMatrix;
  if (!MatrixCtor) return 0;

  const matrix = new MatrixCtor(transform);
  const a = typeof matrix.a === 'number' ? matrix.a : matrix.m11;
  const b = typeof matrix.b === 'number' ? matrix.b : matrix.m12;
  return Math.atan2(b, a) * (180 / Math.PI);
};

const getCardToModalState = ($card) => {
  const cardRect = $card.getBoundingClientRect();
  const panelRect = $cardModalPanel.getBoundingClientRect();
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;
  const panelCenterX = panelRect.left + panelRect.width / 2;
  const panelCenterY = panelRect.top + panelRect.height / 2;

  return {
    x: cardCenterX - panelCenterX,
    y: cardCenterY - panelCenterY,
    scaleX: Math.max(cardRect.width / panelRect.width, 0.14),
    scaleY: Math.max(cardRect.height / panelRect.height, 0.14),
    rotate: getElementRotation($card),
    radius: getComputedStyle($card).borderRadius || '0.8rem',
  };
};

const getRectToRectState = (fromRect, toRect) => {
  const fromCenterX = fromRect.left + fromRect.width / 2;
  const fromCenterY = fromRect.top + fromRect.height / 2;
  const toCenterX = toRect.left + toRect.width / 2;
  const toCenterY = toRect.top + toRect.height / 2;
  return {
    x: toCenterX - fromCenterX,
    y: toCenterY - fromCenterY,
    scaleX: Math.max(toRect.width / fromRect.width, 0.02),
    scaleY: Math.max(toRect.height / fromRect.height, 0.02),
  };
};

const normalizeRoundedRadius = (radius, minPx = 14) => {
  if (!radius) return `${minPx}px`;
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const token = String(radius).trim().split(/\s+/)[0];
  const value = parseFloat(token);
  if (!Number.isFinite(value)) return `${minPx}px`;
  if (token.endsWith('rem')) return `${Math.max(value * rootFontSize, minPx)}px`;
  if (token.endsWith('px')) return `${Math.max(value, minPx)}px`;
  return `${minPx}px`;
};

// [迭代-v06] 同步缩略图过渡层与原卡片的圆角/背景参数，避免收起时比例和切角错位
const syncThumbGhostFromCard = ($card, radiusFallback = '0.8rem') => {
  if (!$cardModalThumbGhost || !$card) return;
  const cardStyle = getComputedStyle($card);
  const ghostRadius = cardStyle.borderRadius || radiusFallback;
  $cardModalThumbGhost.style.borderRadius = ghostRadius;
  $cardModalThumbGhost.style.setProperty('--thumb-ghost-radius', ghostRadius);
  $cardModalThumbGhost.style.backgroundSize = cardStyle.backgroundSize || 'cover';
  $cardModalThumbGhost.style.backgroundPosition = cardStyle.backgroundPosition || 'center';
  $cardModalThumbGhost.style.backgroundRepeat = cardStyle.backgroundRepeat || 'no-repeat';
};

const renderModalGallery = (caseData) => {
  if (!$cardModalGallery) return;
  $cardModalGallery.innerHTML = '';

  caseData.gallery.forEach((src, index) => {
    const item = document.createElement('figure');
    item.className = 'card-modal-gallery-item';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${caseData.title}-${index + 1}`;
    img.decoding = 'async';
    img.loading = index === 0 ? 'eager' : 'lazy';
    img.addEventListener('load', updateModalScrollbar, { once: true });
    item.appendChild(img);
    $cardModalGallery.appendChild(item);
  });

  requestAnimationFrame(updateModalScrollbar);
};

const openCardModal = ($card, caseData) => {
  if (!$cardDialog || !$cardModalPanel || !$cardModalBackdrop || !$cardDialog.showModal || isCardModalAnimating) {
    return;
  }

  // [迭代-v28] 无内容图片的 case 不展开弹窗
  if (caseData.hasContent === false) {
    return;
  }

  // [迭代-v20] 展开卡片时同步 hash，使每个镜花卡片拥有独立 URL
  const casePath = '/cases/' + caseData.id;
  if (window.location.hash !== '#' + casePath) {
    window.__skipHashRoute = true;
    window.location.hash = '#' + casePath;
    setTimeout(() => { window.__skipHashRoute = false; }, 300);
  }

  $cardModalTitle.textContent = caseData.title;
  renderModalGallery(caseData);

  if (!$cardDialog.open) {
    $cardDialog.showModal();
  }
  if ($cardModalScrollbar) {
    $cardModalScrollbar.style.display = '';
  }

  if ($cardModalScroll) {
    $cardModalScroll.scrollTop = 0;
  }
  // [迭代-v21] 重置标题栏背景为初始透明态
  if ($cardModalHeader) {
    $cardModalHeader.style.background = '';
    $cardModalHeader.style.backdropFilter = '';
    $cardModalHeader.style.webkitBackdropFilter = '';
  }

  const fromState = getCardToModalState($card);
  activeModalCard = $card;
  activeModalCase = caseData;
  isCardModalAnimating = true;
  $card.classList.add('card--is-open');

  utils.set($cardModalBackdrop, { opacity: 0 });
  if ($cardModalThumbGhost) {
    $cardModalThumbGhost.style.backgroundImage = `url("${caseData.thumb}")`;
    syncThumbGhostFromCard($card, fromState.radius);
  }
  utils.set($cardModalPanel, {
    x: fromState.x,
    y: fromState.y,
    scaleX: fromState.scaleX,
    scaleY: fromState.scaleY,
    rotate: fromState.rotate,
    borderRadius: fromState.radius,
    opacity: 1,
    filter: 'blur(0px)',
  });
  utils.set([$cardModalHeader, $cardModalGallery, $cardModalThumbGhost], { opacity: 0, filter: 'blur(0px)' });
  updateModalScrollbar();

  // [迭代-v19] iOS 风格：弹窗打开后短暂显示滚动条，提示内容可滚动
  showScrollbarAndResetTimer();

  createTimeline({
    // [迭代-v08] 展开曲线改为更平滑的四次缓出，减少冲得太猛的速度感
    defaults: { ease: 'outQuart' },
    onComplete: () => {
      isCardModalAnimating = false;
      // [迭代-v21] 焦点移到内容区而非关闭按钮，避免 showModal 自动聚焦产生的 focus-visible 外框
      if ($cardModalScroll) {
        $cardModalScroll.setAttribute('tabindex', '-1');
        $cardModalScroll.focus({ preventScroll: true });
      }
    },
  })
    .add($cardModalBackdrop, {
      opacity: [0, 1],
      duration: 390,
      ease: 'outCubic',
    }, 0)
    .add($cardModalPanel, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      borderRadius: '1.75rem',
      duration: 580,
      ease: 'outQuart',
    }, 0)
    // [迭代-v06] 弹窗展开过程中内容就开始渐显
    .add([$cardModalHeader, $cardModalGallery], {
      opacity: [0, 1],
      duration: 390,
      ease: 'outSine',
    }, 20);

  setTimeout(updateModalScrollbar, 120);
  setTimeout(updateModalScrollbar, 320);
};

const closeCardModal = () => {
  if (!$cardDialog || !$cardModalPanel || !$cardModalBackdrop || !$cardDialog.open || isCardModalAnimating) {
    return;
  }

  // [迭代-v20] 关闭弹窗时 hash 回退到 /cases
  if (window.location.hash.startsWith('#/cases/case-')) {
    window.__skipHashRoute = true;
    window.location.hash = '#/cases';
    setTimeout(() => { window.__skipHashRoute = false; }, 300);
  }

  const originCard = activeModalCard;
  // [迭代-v08] 收起时提前切到原卡片并压低透明度，给末段交接留出无缝混合窗口
  if (originCard) {
    originCard.classList.remove('card--is-open');
    utils.set(originCard, {
      y: '-50%',
      pointerEvents: 'none',
      opacity: 0,
    });
  }

  const toState = originCard ? getCardToModalState(originCard) : null;
  const roundedTargetRadius = normalizeRoundedRadius(toState?.radius || '0.8rem', 14);

  isCardModalAnimating = true;

  // [迭代-v19] 关闭阶段立即隐藏自定义滚动条，清除自动隐藏计时器
  clearTimeout(scrollbarAutoHideTimer);
  isScrollbarDragging = false;
  $cardModalScrollbar?.classList.add('is-hidden');
  $cardModalScrollbar?.classList.remove('is-visible');
  if ($cardModalScrollbar) {
    $cardModalScrollbar.style.display = 'none';
  }

  // [迭代-v08] 关闭阶段启用缩略图过渡层，先遮掉内容再收束到原卡位置
  if ($cardModalThumbGhost) {
    if (activeModalCase?.thumb) {
      $cardModalThumbGhost.style.backgroundImage = `url("${activeModalCase.thumb}")`;
    }
    syncThumbGhostFromCard(originCard, roundedTargetRadius);
    utils.set($cardModalThumbGhost, { opacity: 0, filter: 'blur(0px)' });
  }
  utils.set($cardModalPanel, { filter: 'blur(0px)' });

  const closeTimeline = createTimeline({
    // [迭代-v08] 收起默认曲线改为更平缓的 S 曲线，减少末段加速感
    defaults: { ease: 'inOutSine' },
    onComplete: () => {
      activeModalCard = null;
      activeModalCase = null;
      isCardModalAnimating = false;
      if ($cardDialog.open) {
        $cardDialog.close();
      }
      if (originCard) {
        originCard.classList.remove('card--is-open');
        originCard.style.pointerEvents = '';
        originCard.style.opacity = '';
      }
      utils.set($cardModalPanel, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        borderRadius: '1.75rem',
        opacity: 1,
        filter: 'blur(0px)',
      });
      utils.set($cardModalThumbGhost, {
        opacity: 0,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        borderRadius: '1.75rem',
        filter: 'blur(0px)',
      });
      $cardModalThumbGhost?.style.removeProperty('position');
      $cardModalThumbGhost?.style.removeProperty('left');
      $cardModalThumbGhost?.style.removeProperty('top');
      $cardModalThumbGhost?.style.removeProperty('width');
      $cardModalThumbGhost?.style.removeProperty('height');
      $cardModalThumbGhost?.style.removeProperty('transform-origin');
      $cardModalThumbGhost?.style.removeProperty('inset');
      $cardModalThumbGhost?.style.setProperty('--thumb-ghost-radius', '1.75rem');
      if ($cardModalScrollbar) {
        $cardModalScrollbar.style.display = '';
      }
      /* [迭代-v29] 关闭卡片时强制隐藏悬停气泡，防止 mouseleave 漏触发导致残留 */
      if ($cardTooltip) {
        $cardTooltip.classList.remove('is-visible');
        $cardTooltip.classList.add('is-hiding');
      }
    },
  })
    .add($cardModalHeader, {
      opacity: [1, 0],
      duration: 390,
      ease: 'inOutSine',
    }, 0)
    .add($cardModalGallery, {
      opacity: [1, 0],
      duration: 390,
      ease: 'inOutSine',
    }, 0)
    .add($cardModalThumbGhost, {
      opacity: [0, 1],
      duration: 190,
      ease: 'outSine',
    }, 0)
    .add($cardModalBackdrop, {
      opacity: [1, 0],
      duration: 390,
      ease: 'inOutSine',
    }, 0)
    // [迭代-v08] 收起主轨迹改为前快后稳，终点改低透明度，避免最后一帧突变
    .add($cardModalPanel, {
      x: toState ? toState.x : 0,
      y: toState ? toState.y : 0,
      scaleX: toState ? toState.scaleX : 0.24,
      scaleY: toState ? toState.scaleY : 0.24,
      rotate: toState ? toState.rotate : 0,
      borderRadius: roundedTargetRadius,
      opacity: [1, 0.06],
      duration: 580,
      ease: 'inOutCubic',
    }, 0)
    // [迭代-v08] 收起后期叠加轻微高斯模糊，让末段更有“消散”质感
    .add([$cardModalPanel, $cardModalThumbGhost], {
      filter: ['blur(0px)', 'blur(1.8px)'],
      duration: 190,
      ease: 'inOutSine',
    }, 390)
    .add($cardModalThumbGhost, {
      opacity: [1, 0],
      duration: 180,
      ease: 'inOutSine',
    }, 390);

  // [迭代-v08] 末段与原卡片做短交叉淡入，实现“落点即原卡”的无缝衔接
  if (originCard) {
    closeTimeline.add(originCard, {
      opacity: [0, 1],
      duration: 180,
      ease: 'outSine',
    }, 390);
  }
};

$cardModalScroll?.addEventListener('scroll', () => {
  updateModalScrollbar();
  // [迭代-v19] iOS 风格：滚动时显示滚动条，停止后自动隐藏
  showScrollbarAndResetTimer();
  // [迭代-v21] 滚动离开顶部时标题栏背景渐显
  updateHeaderBackground();
}, { passive: true });

// [迭代-v21] 标题栏毛玻璃背景随滚动进度渐显
const updateHeaderBackground = () => {
  if (!$cardModalScroll || !$cardModalHeader) return;
  const t = Math.min(1, $cardModalScroll.scrollTop / HEADER_BG_FADE_DISTANCE);
  // [迭代-v24] 标题栏背景改为深蓝主题色半透明
  $cardModalHeader.style.background = `rgba(15, 25, 60, ${0.35 * t})`;
  if (t > 0.01) {
    $cardModalHeader.style.backdropFilter = `blur(${16 * t}px) saturate(${100 + 40 * t}%)`;
    $cardModalHeader.style.webkitBackdropFilter = `blur(${16 * t}px) saturate(${100 + 40 * t}%)`;
  } else {
    $cardModalHeader.style.backdropFilter = 'none';
    $cardModalHeader.style.webkitBackdropFilter = 'none';
  }
};
window.addEventListener('resize', updateModalScrollbar);

$cardModalScrollbarThumb?.addEventListener('pointerdown', (event) => {
  if (!$cardModalScroll || !$cardModalScrollbar || !$cardModalScrollbarThumb) return;
  event.preventDefault();
  isScrollbarDragging = true;
  scrollbarDragStartY = event.clientY;
  scrollbarDragStartScrollTop = $cardModalScroll.scrollTop;
  // [迭代-v19] 拖拽时保持滚动条可见
  showScrollbarAndResetTimer();
  $cardModalScrollbarThumb.setPointerCapture?.(event.pointerId);
});

window.addEventListener('pointermove', (event) => {
  if (!isScrollbarDragging || !$cardModalScroll || !$cardModalScrollbar || !$cardModalScrollbarThumb) return;

  const deltaY = event.clientY - scrollbarDragStartY;
  const scrollRange = $cardModalScroll.scrollHeight - $cardModalScroll.clientHeight;
  const trackHeight = $cardModalScrollbar.clientHeight;
  const thumbHeight = $cardModalScrollbarThumb.clientHeight;
  const maxThumbTop = Math.max(1, trackHeight - thumbHeight);
  const scrollDelta = (deltaY / maxThumbTop) * scrollRange;
  $cardModalScroll.scrollTop = scrollbarDragStartScrollTop + scrollDelta;
});

window.addEventListener('pointerup', () => {
  isScrollbarDragging = false;
  // [迭代-v19] 拖拽结束后重启自动隐藏计时器
  if ($cardModalScrollbar && !$cardModalScrollbar.classList.contains('is-hidden')) {
    clearTimeout(scrollbarAutoHideTimer);
    scrollbarAutoHideTimer = setTimeout(() => {
      $cardModalScrollbar?.classList.remove('is-visible');
    }, SCROLLBAR_AUTO_HIDE_DELAY);
  }
});

$cardModalScrollbar?.addEventListener('pointerdown', (event) => {
  if (!$cardModalScroll || !$cardModalScrollbar || !$cardModalScrollbarThumb) return;
  if (event.target === $cardModalScrollbarThumb) return;
  event.preventDefault();

  const rect = $cardModalScrollbar.getBoundingClientRect();
  const trackHeight = rect.height;
  const thumbHeight = $cardModalScrollbarThumb.clientHeight;
  const maxThumbTop = Math.max(1, trackHeight - thumbHeight);
  const clickTop = event.clientY - rect.top - thumbHeight / 2;
  const nextThumbTop = Math.max(0, Math.min(maxThumbTop, clickTop));
  const scrollRange = $cardModalScroll.scrollHeight - $cardModalScroll.clientHeight;
  $cardModalScroll.scrollTop = (nextThumbTop / maxThumbTop) * scrollRange;
});

$cardModalClose?.addEventListener('click', closeCardModal);
$cardModalBackdrop?.addEventListener('click', closeCardModal);
$cardDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeCardModal();
});
$cardDialog?.addEventListener('click', (event) => {
  if (event.target === $cardDialog) {
    closeCardModal();
  }
});

const caseCards = utils.$('.card[data-case-id]');
caseCards.forEach(($card, index) => {
  const caseData = caseById.get($card.dataset.caseId) || CARD_CASES[index % CARD_CASES.length];
  $card.style.backgroundImage = `url("${caseData.thumb}")`;

  // [迭代-v28] 无内容图片的 case：保留悬停动画，仅点击无反应
  if (caseData.hasContent === false) {
    $card.setAttribute('role', 'presentation');
    $card.setAttribute('aria-label', `${caseData.title}，暂无内容`);
    $card.removeAttribute('tabindex');
    $card.style.cursor = 'default';

    $card.onmouseenter = () => {
      if (isCardModalAnimating || activeModalCard === $card) return;
      animate($card, {
        y: '-62%',
        duration: 240,
        composition: 'blend',
      });
      if ($cardTooltip) {
        $cardTooltip.textContent = caseData.title;
        $cardTooltip.classList.remove('is-hiding');
        $cardTooltip.classList.add('is-visible');
        $cardTooltip.setAttribute('aria-hidden', 'false');
      }
    };
    $card.onmouseleave = () => {
      if (activeModalCard === $card) return;
      animate($card, {
        y: '-50%',
        duration: 600,
        composition: 'blend',
        delay: 75,
      });
      if ($cardTooltip) {
        $cardTooltip.classList.remove('is-visible');
        $cardTooltip.classList.add('is-hiding');
        $cardTooltip.setAttribute('aria-hidden', 'true');
      }
    };
    $card.onmousemove = (event) => {
      if (!$cardTooltip || !$cardTooltip.classList.contains('is-visible')) return;
      const tooltipW = $cardTooltip.offsetWidth || 80;
      const offset = 14;
      if (event.clientX > window.innerWidth / 2) {
        $cardTooltip.style.left = `${event.clientX + offset}px`;
        $cardTooltip.style.top = `${event.clientY + offset}px`;
      } else {
        $cardTooltip.style.left = `${event.clientX - tooltipW - offset}px`;
        $cardTooltip.style.top = `${event.clientY + offset}px`;
      }
    };
    return;
  }

  $card.setAttribute('role', 'button');
  $card.setAttribute('aria-label', `${caseData.title}，打开图集弹窗`);
  $card.tabIndex = 0;
  if (caseData.href) {
    $card.dataset.href = caseData.href;
  }

  $card.onmouseenter = () => {
    if (isCardModalAnimating || activeModalCard === $card) return;
    animate($card, {
      y: '-62%',
      duration: 240,
      composition: 'blend',
    });

    // [迭代-v28] 鼠标进入卡片时显示标题气泡，渐显 + 模糊清
    if ($cardTooltip) {
      $cardTooltip.textContent = caseData.title;
      $cardTooltip.classList.remove('is-hiding');
      $cardTooltip.classList.add('is-visible');
      $cardTooltip.setAttribute('aria-hidden', 'false');
    }
  };

  $card.onmouseleave = () => {
    if (activeModalCard === $card) return;
    animate($card, {
      y: '-50%',
      duration: 600,
      composition: 'blend',
      delay: 75,
    });

    // [迭代-v28] 鼠标离开卡片时隐藏标题气泡，渐隐 + 模糊起
    if ($cardTooltip) {
      $cardTooltip.classList.remove('is-visible');
      $cardTooltip.classList.add('is-hiding');
      $cardTooltip.setAttribute('aria-hidden', 'true');
    }
  };

  // [迭代-v28] 鼠标在卡片上移动时，气泡跟随鼠标位置
  $card.onmousemove = (event) => {
    if (!$cardTooltip || !$cardTooltip.classList.contains('is-visible')) return;
    const tooltipRect = $cardTooltip.getBoundingClientRect();
    const tooltipW = tooltipRect.width || $cardTooltip.offsetWidth || 80;
    const tooltipH = tooltipRect.height || $cardTooltip.offsetHeight || 30;
    const offset = 14;
    const viewportW = window.innerWidth;

    // 视口右半边：气泡在鼠标右下角；左半边：气泡在鼠标左下角
    if (event.clientX > viewportW / 2) {
      // 右半：气泡左边缘在鼠标右侧
      $cardTooltip.style.left = `${event.clientX + offset}px`;
      $cardTooltip.style.top = `${event.clientY + offset}px`;
    } else {
      // 左半：气泡右边缘在鼠标左侧
      $cardTooltip.style.left = `${event.clientX - tooltipW - offset}px`;
      $cardTooltip.style.top = `${event.clientY + offset}px`;
    }
  };

  $card.onmousedown = () => {
    if (activeModalCard === $card) return;
    animate($card, {
      scale: [1, 0.9, 1],
      duration: 300,
      composition: 'blend',
    });
  };

  $card.onmouseup = (event) => {
    event.preventDefault();
    openCardModal($card, caseData);
  };

  $card.onclick = (event) => {
    event.preventDefault();
    openCardModal($card, caseData);
  };

  $card.onkeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCardModal($card, caseData);
    }
  };
});

// [迭代-v20] 监听 case-open 事件（来自路由直接 URL 访问），打开对应卡片弹窗
window.addEventListener('case-open', (event) => {
  const { caseId } = event.detail || {};
  if (!caseId) return;
  const caseData = caseById.get(caseId);
  if (!caseData) return;
  // 找到对应的卡片 DOM 元素
  const $targetCard = caseCards.find(($c) => $c.dataset.caseId === caseId);
  if (!$targetCard) return;
  // 如果弹窗已经打开或者是动画中，跳过
  if ($cardDialog?.open || isCardModalAnimating) return;
  openCardModal($targetCard, caseData);
});

// [迭代-v20] 监听 hashchange：前进/后退时，hash 回到 /cases 则关闭弹窗
window.addEventListener('hashchange', () => {
  if (window.__skipHashRoute) return;
  const path = window.location.hash.slice(1);
  if (path === '/cases' && $cardDialog?.open && !isCardModalAnimating) {
    closeCardModal();
  }
});

const alcardline = createTimeline({
  autoplay: false,
  loop: false,

})
  .add('.cardbox', {
    visibility: 'visible',
    duration: 0,
  })
  .add('.cardbox', {
    opacity: [0, 1],
    rotate: ['-90deg', '0deg'],
    ease: 'outQuart',
    'pointer-events': 'auto',
    duration: 800,
  })
  .add('.card', {
    rotate: 0,
    rotateZ: { to: stagger([10, 260], { from: 'last' }), ease: 'inOut(2)' },
    y: { to: '-50%', duration: 300 },
    transformOrigin: '50% 100%',
    delay: stagger(1, { from: 'first' }),
    duration: 800,
  }, '<<')
  // [迭代-v25] 尾圆 logo 反向旋转抵消卡片倾斜，保持正向
  .add('#cap-logo-tail', {
    rotateZ: { to: stagger([-10, -260], { from: 'last' }), ease: 'inOut(2)' },
    transformOrigin: '50% 50%',
    duration: 800,
  }, '<<')

const playTimeline = () => alcardline.play();
const reverseTimeline = () => alcardline.reverse();

$al.addEventListener('click', playTimeline, { once: true });
$al2.addEventListener('click', playTimeline);
$al3.addEventListener('click', playTimeline);
$zc2.addEventListener('click', reverseTimeline);
$zc3.addEventListener('click', reverseTimeline);
$lx2.addEventListener('click', reverseTimeline);
$lx3.addEventListener('click', reverseTimeline);
$homelogo.addEventListener('click', reverseTimeline);


//脉络页面内容事件

// [迭代-v10] 脉络页三圆恢复手动关键帧播放，入场仍沿顺时针方向补间
const playzcTimeline = () => zcboxController.playIn();
const reversezcTimeline = () => zcboxController.playOut();

$zc.addEventListener('click', playzcTimeline, { once: true });
$zc2.addEventListener('click', playzcTimeline);
$zc3.addEventListener('click', playzcTimeline);
$lx2.addEventListener('click', reversezcTimeline);
$lx3.addEventListener('click', reversezcTimeline);
$al2.addEventListener('click', reversezcTimeline);
$al3.addEventListener('click', reversezcTimeline);
$homelogo.addEventListener('click', reversezcTimeline);

// [迭代-v16] 首页入场动画：仅扇形背景从 rgb(243,243,243) 展开至完全体，元素不动保持原始 mix-blend-mode
// [迭代-v26] 记录入场 timeline 引用，导航点击时可中断避免两套背景动画互相竞争导致掉帧
let entranceTimeline = null;
const createEntrance = () => createTimeline({
  autoplay: false,
})
  .add('.backgroundcolor', {
    '--color-3': ['rgb(243, 243, 243)', 'rgb(7, 19, 31)'],
    '--color-4': ['rgb(243, 243, 243)', 'rgb(7, 19, 31)'],
    '--color-5': ['rgb(243, 243, 243)', 'rgb(65, 43, 29)'],
    '--deg-3': ['0deg', '180deg'],
    '--deg-4': ['0deg', '269deg'],
    '--deg-5': ['0deg', '360deg'],
    ease: 'outQuart',
    duration: 2000,
  });

entranceTimeline = createEntrance();

// [迭代-v26] 安全停止入场动画，供导航点击时调用
const stopEntranceIfRunning = () => {
  if (entranceTimeline) {
    try { entranceTimeline.pause(); } catch (_) { /* 已结束 */ }
    // 直接设到终态值，避免半途切换导致背景颜色错乱
    utils.set('.backgroundcolor', {
      '--color-3': 'rgb(7, 19, 31)',
      '--color-4': 'rgb(7, 19, 31)',
      '--color-5': 'rgb(65, 43, 29)',
      '--deg-3': '180deg',
      '--deg-4': '269deg',
      '--deg-5': '360deg',
    });
    entranceTimeline = null;
  }
};

// 页面加载后播放入场动画
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => entranceTimeline.play());
} else {
  entranceTimeline.play();
}
// [迭代-v26] 入场完成后清理引用，释放 timeline 内存
entranceTimeline.finished.then(() => { entranceTimeline = null; });
