const svgContainer = document.getElementById('lxbox');
const wrapper = document.querySelector('.scale-wrapper');

// 你的容器初始设计尺寸
const baseWidth = 550;  // 初始设计宽度
const baseHeight = 800; // 初始设计高度

// 计算横竖屏比例阈值，可根据需要调整
const getAspectRatio = () => wrapper.offsetWidth / wrapper.offsetHeight;
const isLandscape = () => getAspectRatio() > 1; // 宽高比大于1视为横屏

// [迭代-v13] 标记 lxbox 是否正在播放入场动画，避免 resize 时 transform 跳动
let lxboxAnimating = false;
window.__lxboxAnimating = {
  get: () => lxboxAnimating,
  set: (v) => { lxboxAnimating = v; }
};

function updateScale() {
    // [迭代-v13] lxbox 动画播放期间跳过 transform 更新，防止与 animejs 动画冲突导致卡顿
    if (lxboxAnimating) return;

    const wrapperWidth = wrapper.offsetWidth;
    const wrapperHeight = wrapper.offsetHeight;

    let scale;

    if (isLandscape()) {
        // 横屏模式：基于高度计算缩放比例
        scale = wrapperHeight / baseHeight;
    } else {
        // 竖屏模式：基于宽度计算缩放比例
        scale = wrapperWidth / baseWidth;
    }

    // 应用缩放变换
    svgContainer.style.transform = `scale(${scale})`;
    // 设置变换原点在顶部中心
    svgContainer.style.transformOrigin = 'top center';
}

// 使用ResizeObserver监听容器大小变化
const resizeObserver = new ResizeObserver(() => {
    updateScale();
});

// 开始监听包装元素
resizeObserver.observe(wrapper);

// 初始缩放
updateScale();
