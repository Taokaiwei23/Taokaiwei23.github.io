import { createTimeline, utils, waapi, animate, stagger, svg } from './node_modules/animejs/lib/anime.esm.min.js';

utils.set('.backgroundcolor', {
  '--deg-0': '90deg',
  '--color-1': 'rgb(243, 243, 243)',
  '--color-2': 'rgb(243, 243, 243)',
  '--color-3': 'rgb(7, 19, 31)',
  '--color-4': 'rgb(7, 19, 31)',
  '--color-5': 'rgb(65, 43, 29)',
  '--deg-1': '0deg',
  '--deg-2': '0deg',
  '--deg-3': '180deg',
  '--deg-4': '269deg',
  '--deg-5': '360deg',
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


let homelogoPlayed = false;

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

$hellologo.onmouseenter = () => createTimeline()
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
    // ease: 'outBack(1.70158)',
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
  }, "<<")
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

$hellologo.onmouseup = (e) => animate($logo2, {
  scale: 1,
  duration: 300,
  composition: 'blend',
})

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
}
$zc2.onclick = $zc3.onclick = $zc.onclick;

$al.onclick = () => {
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
}
$al2.onclick = $al3.onclick = $al.onclick;



$lx.onclick = () => {
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
}
$lx2.onclick = $lx3.onclick = $lx.onclick;


const hellologoMouseEnter = $hellologo.onmouseenter;
const hellologoMouseOut = $hellologo.onmouseout;
const hellologoClick = $hellologo.onclick;
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

    ;[$homelogo].forEach(element => {
      if (element) {
        element.onmouseenter = null;
        element.onmouseout = null;
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
  $al.addEventListener('click', playTimeline, { once: true });

}
const homelogoClick = $homelogo.onclick;





//案例页面内容事件

utils.$('.card').forEach($card => {
  $card.onmouseenter = () => animate($card, {
    y: '-62%', duration: 240, composition: 'blend',
  });
  $card.onmouseleave = () => animate($card, {
    y: '-50%', duration: 600, composition: 'blend', delay: 75,
  });
  $card.onmousedown = (e) => animate($card, {
    scale: [1, 0.9, 1],
    duration: 300,
    composition: 'blend',
  })
  $card.onmouseup = (e) => {
    e.preventDefault();
    const href = $card.dataset.href;
    if (href) {
      window.open(href, '_blank')
    }
  };
});

const alcardline = createTimeline({
  autoplay: false,
  loop: false,

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



