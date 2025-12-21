const svgContainer = document.getElementById('lxbox');
const wrapper = document.querySelector('.scale-wrapper');

// 你的容器初始设计尺寸
const baseWidth = 550;  // 初始设计宽度
const baseHeight = 800; // 初始设计高度

// 计算横竖屏比例阈值，可根据需要调整
const getAspectRatio = () => wrapper.offsetWidth / wrapper.offsetHeight;
const isLandscape = () => getAspectRatio() > 1; // 宽高比大于1视为横屏

function updateScale() {
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
