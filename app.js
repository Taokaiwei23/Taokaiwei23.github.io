import { createTimeline, utils, animate, stagger, svg } from './node_modules/animejs/lib/anime.esm.min.js';

// 设置初始样式变量
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

const zc = document.getElementById('zc');
const al = document.getElementById('al');
const lx = document.getElementById('lx');
const al2Title = document.getElementById('al-title2');
const lx2Title = document.getElementById('lx-title2');
const zc2Title = document.getElementById('zc-title2');
const al3Title = document.getElementById('al-title3');
const lx3Title = document.getElementById('lx-title3');
const zc3Title = document.getElementById('zc-title3');
const zcTitle = '#zc-title';
const alTitle = '#al-title';
const lxTitle = '#lx-title';
let isLocked = false;



// 鼠标进入处理函数
function handleMouseEnter(event) {
  const target = event.target;
  console.log(`Mouse enter on ${target.id}`);

  // 如果目标是新元素，直接执行动画
  if (target.id === 'al-title2' || target.id === 'lx-title2' || target.id === 'zc-title2' || target.id === 'zc-title3' || target.id === 'al-title3' || target.id === 'lx-title3') {

    if (target.id === 'al-title2') {
      createTimeline().add("#al-title2", {
        '--weight-0': '160',
        scale: 1.2,
        opacity: 0.6,
        duration: 350, composition: 'blend',
      });
    } else if (target.id === 'lx-title2') {
      createTimeline().add("#lx-title2", {
        '--weight-0': '160',
        scale: 1.2,
        opacity: 0.6,
        duration: 400,
      });
    } else if (target.id === 'zc-title2') {
      createTimeline().add("#zc-title2", {
        '--weight-0': '160',
        scale: 1.2,
        opacity: 0.6,
        duration: 400,
      });
    } else if (target.id === 'lx-title3') {
      createTimeline().add("#lx-title3", {
        '--weight-0': '160',
        scale: 1.2,
        opacity: 0.6,
        duration: 400,
      });
    } else if (target.id === 'al-title3') {
      createTimeline().add("#al-title3", {
        '--weight-0': '160',
        scale: 1.2,
        opacity: 0.6,
        duration: 400,
      });
    }
    else if (target.id === 'zc-title3') {
      createTimeline().add("#zc-title3", {
        '--weight-0': '160',
        scale: 1.2,
        opacity: 0.6,
        duration: 400,
      });
    }

    return;
  }

  // 如果不是新元素且 isLocked 为 true，忽略事件
  if (isLocked) {
    console.log(`Mouse enter on ${target.id} ignored`);
    return;
  }

  if (target.id === 'zc') {
    createTimeline().add(zcTitle, {
      '--weight-0': '160',
      x: 10,
      y: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 400,
    });
  } else if (target.id === 'al') {
    createTimeline().add(alTitle, {
      '--weight-0': '160',
      x: 10,
      y: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 400,
    });
  } else if (target.id === 'lx') {
    createTimeline().add(lxTitle, {
      '--weight-0': '160',
      x: 10,
      y: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 400,
    });
  }
}

// 鼠标离开处理函数
function handleMouseLeave(event) {
  const target = event.target;
  console.log(`Mouse leave on ${target.id}`);

  // 如果目标是新元素，直接执行动画
  if (target.id === 'al-title2' || target.id === 'lx-title2' || target.id === 'zc-title2' || target.id === 'zc-title3' || target.id === 'al-title3' || target.id === 'lx-title3') {
    if (target.id === 'al-title2') {
      createTimeline().add('#al-title2', {
        '--weight-0': '300',
        scale: 1,
        opacity: 1,
        duration: 450, composition: 'blend',
      });
    } else if (target.id === 'lx-title2') {
      createTimeline().add('#lx-title2', {
        '--weight-0': '300',
        scale: 1,
        opacity: 1,
        duration: 400,
      });
    } else if (target.id === 'zc-title2') {
      createTimeline().add('#zc-title2', {
        '--weight-0': '300',
        scale: 1,
        opacity: 1,
        duration: 400,
      });
    } else if (target.id === 'lx-title3') {
      createTimeline().add('#lx-title3', {
        '--weight-0': '300',
        scale: 1,
        opacity: 1,
        duration: 400,
      });
    } else if (target.id === 'al-title3') {
      createTimeline().add('#al-title3', {
        '--weight-0': '300',
        scale: 1,
        opacity: 1,
        duration: 400,
      });
    } else if (target.id === 'zc-title3') {
      createTimeline().add('#zc-title3', {
        '--weight-0': '300',
        scale: 1,
        opacity: 1,
        duration: 400,
      });
    }

    return;
  }

  // 如果不是新元素且 isLocked 为 true，忽略事件
  if (isLocked) {
    console.log(`Mouse leave on ${target.id} ignored`);
    return;
  }

  if (target.id === 'zc') {
    createTimeline().add(zcTitle, {
      '--weight-0': '300',
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 400,
    });
  } else if (target.id === 'al') {
    createTimeline().add(alTitle, {
      '--weight-0': '300',
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 400,
    });
  } else if (target.id === 'lx') {
    createTimeline().add(lxTitle, {
      '--weight-0': '300',
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 400,
    });
  }
}

// 点击处理函数
function handleClick(event) {
  const target = event.target;
  console.log(`Clicked on ${target.id}`);

  // 播放背景动画
  let bgAnimation;
  if (target.id === 'zc' || target.id === 'zc-title2' || target.id === 'zc-title3') {
    bgAnimation = createTimeline()
      .add('.backgroundcolor', {
        '--deg-0': '180deg',
        '--deg-2': '29deg',
        '--color-5': 'rgb(65, 43, 29)',
        ease: 'outQuart',
        duration: 1300,
      })
      .add('.backgroundcolor', {
        '--deg-3': '57deg',
        '--deg-4': '182deg',
        '--color-3': 'rgb(7, 19, 31)',
        ease: 'outQuart',
        duration: 1600,
      }, '<<')
      .add(zcTitle, {
        filter: 'blur(0px)',
        opacity: 0.6,
        scale: 1.2,
        duration: 600,
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
      .add('#zc3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#al3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#zc2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#lx3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

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
      .add('#hellologo', {
        'pointer-events': 'none'
      }, '<<')
      .add('#homelogo', {
        'pointer-events': 'auto'
      }, '<<')

  } else if (target.id === 'al' || target.id === 'al-title2' || target.id === 'al-title3') {
    bgAnimation = createTimeline()
      .add('.backgroundcolor', {
        '--deg-0': '270deg',
        '--deg-2': '12deg',
        '--color-3': 'rgb(65, 43, 29)',
        ease: 'outQuart',
        duration: 1300,
      })
      .add('.backgroundcolor', {
        '--deg-3': '31deg',
        '--deg-4': '93deg',
        '--color-5': 'rgb(7, 19, 31)',
        ease: 'outQuart',
        duration: 1600,
      }, '<<')
      .add(alTitle, {
        filter: 'blur(0px)',
        opacity: 0.6,
        scale: 1.2,
        duration: 600,
      }, '<<')
      .add('#zc2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'


      }, '<<')
      .add('#lx3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#al2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#lx2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#al3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#zc3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

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
      .add('.cardbox', {
        opacity: [0, 1],
        rotate: ['-90deg', '0deg'],
        ease: 'outQuart',
        'pointer-events': 'auto'
      }, '<<')
      .add('.card', {
        rotate: 0,
        rotateZ: { to: stagger([10, 260], { from: 'last' }), ease: 'inOut(2)' },
        y: { to: '-50%', duration: 400 },
        transformOrigin: '50% 100%',
        delay: stagger(1, { from: 'first' }),

      }, '<<')
      .add('#hellologo', {
        'pointer-events': 'none'
      }, '<<')
      .add('#homelogo', {
        'pointer-events': 'auto'
      }, '<<')

  } else if (target.id === 'lx' || target.id === 'lx-title2' || target.id === 'lx-title3') {
    bgAnimation = createTimeline()
      .add('.backgroundcolor', {
        '--deg-0': '90deg',
        '--deg-2': '325deg',
        '--color-5': 'rgb(65, 43, 29)',
        ease: 'outQuart',
        duration: 1300,
      })
      .add('.backgroundcolor', {
        '--deg-3': '341deg',
        '--deg-4': '341deg',
        '--color-3': 'rgb(7, 19, 31)',
        ease: 'outQuart',
        duration: 1600,
      }, '<<')
      .add(lxTitle, {
        filter: 'blur(0px)',
        opacity: 0.6,
        scale: 1.2,
        duration: 600,
      }, '<<')
      .add('#al2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#lx2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#zc2', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'

      }, '<<')
      .add('#lx3', {
        opacity: 0,
        rotate: '+6deg',
        ease: 'outQuart',
        'pointer-events': 'none'
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
      .add('#hellologo', {
        'pointer-events': 'none'
      }, '<<')
      .add('#homelogo', {
        'pointer-events': 'auto'
      }, '<<')
      
  }

  if (bgAnimation) {
    bgAnimation
      .add(target.id === 'zc' ? '#al-title' :
        target.id === 'al' ? '#zc-title' :
          target.id === 'al-title2' ? '#zc-title' :
            target.id === 'al-title3' ? '#lx-title' :
              target.id === 'zc-title3' ? '#lx-title' :
                target.id === 'zc-title2' ? '#lx-title' :

                  '#zc-title',
        {
          filter: 'blur(5px)',
          opacity: 0,
          duration: 600,
        }, '<<')
      .add(target.id === 'zc' ? '#lx-title' :
        target.id === 'al' ? '#lx-title' :
          target.id === 'al-title2' ? '#lx-title' :
            target.id === 'al-title3' ? '#zc-title' :
              '#al-title',
        {
          filter: 'blur(5px)',
          opacity: 0,
          duration: 600,
        }, '<<')
      .add('#logo1', {
        marginLeft: '-42vw',
        marginTop: '-42vh',
        opacity: 0.5,
        scale: 0.26,
        ease: 'outQuart',
        duration: 720,
      }, '<<')
      .add('#homelogo', {
        marginLeft: '-42vw',
        marginTop: '-42vh',
        opacity: 0.6,
        scale: 0.26,
        ease: 'outQuart',
        duration: 720,
      }, '<<');


    // 播放 hover 动画
    handleMouseEnter(event);

    // 锁定状态，取消 hover 和 click 效果
    isLocked = true;

    // 获取所有元素
    const elements = [zc, al, lx];
    elements.forEach(element => {
      // 如果元素不是目标元素，移除它的事件监听器
      if (element !== target) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('click', handleClick);
        console.log(`Removed event listeners from ${element.id}`);
      }
    });
  }
}

// 注册事件监听
const elements = [zc, al, lx];
elements.forEach(element => {
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('click', handleClick);
});

// 为新元素单独注册事件监听
const newElements = [al2Title, lx2Title, zc2Title, al3Title, lx3Title, zc3Title];
newElements.forEach(element => {
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('click', handleClick);
});


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
})


const [$hellologo] = utils.$('#hellologo');
const [$homelogo] = utils.$('#homelogo');
const [$logo2] = utils.$('#logo2');
$hellologo.onmouseenter = () => createTimeline()
  .add("#logo1", {
    scale: [1, 0],
    opacity: [1, 0],
    duration: 200,
    easing: 'inExpo',
  })
  .add("#logo2", {
    scale: [0, 1],
    opacity: [0, 1],
    duration: 300,
    easing: 'outExpo',
  }, "<<")
  .add(svg.createDrawable('.line1'), {
    draw: ['0 0', '0 1'],
    // ease: 'outBack(1.70158)',
    duration: 600,
    loop: 0,
  }, "<<")
  .add(svg.createDrawable('.line2'), {
    draw: ['0 0', '0 1'],
    duration: 1000,
    easing: 'inExpo',
    loop: 0,
  }, "<<")
$hellologo.onmouseleave = () => createTimeline()
  .add("#logo2", {
    scale: [1, 0],
    opacity: [1, 0],
    duration: 200,
    easing: 'outExpo',
  })
  .add("#logo1", {
    scale: [0, 1.2, 1],
    opacity: [0, 1],
    duration: 200,
    easing: 'createSpring(1, 100, 10, 0)',
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
$homelogo.onmouseenter = () => createTimeline()
  .add("#logo1", {
    scale: [0.26,0.3],
    opacity:[0.6 ,1],
    duration: 200,
    easing: 'inExpo',
  })
// $homelogo.onmouseleave = () => createTimeline()
//   .add("#logo1", {
//     scale: [0.3,0.26],
//     opacity:[1,0.6 ],
//     duration: 200,
//     easing: 'inExpo',    
//   })
// $homelogo.onmousedown = () => createTimeline()
// .set('.logo1svg2', {
//     'pointer-events': 'none',       
//   })
$homelogo.onclick = () => createTimeline()

// .set('.logo1svg2', {
//     'pointer-events': 'none',
//   })
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
  .add('#zc2', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'
  }, '<<')
  .add('#lx2', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'
  }, '<<')
  .add('#al2', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'

  }, '<<')
  .add('#zc3', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'

  }, '<<')
  .add('#lx3', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'

  }, '<<')
  .add('#al3', {
    opacity: 0,
    rotate: '+6deg',
    ease: 'outQuart',
    'pointer-events': 'none'

  }, '<<')
  .add('#zc-title', {
    filter: 'blur(0px)',
    '--weight-0': '300',
    scale: 1,
    opacity: 1,
    duration: 400,
    'pointer-events': 'auto'

  }, '<<')
  .add('#al-title', {
    filter: 'blur(0px)',
    '--weight-0': '300',
    scale: 1,
    opacity: 1,
    duration: 400,
    'pointer-events': 'auto'

  }, '<<')
  .add('#lx-title', {
    filter: 'blur(0px)',
    '--weight-0': '300',
    scale: 1,
    opacity: 1,
    duration: 400,
    'pointer-events': 'auto'
  }, '<<')
.add('#zc,#al,#lx', {
    
    'pointer-events': 'auto'
  }, '<<')


.add('#hellologo', {
    'pointer-events': 'auto',
    duration: 0,
  }, '<')
.add('#homelogo', {
    'pointer-events': 'none',
    duration: 0,
  }, '<')
  
  