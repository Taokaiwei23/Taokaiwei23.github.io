/* [迭代-v14] 路由模块 - hash-based SPA 路由，为站点增加 URL 路由支持 */
/* [迭代-v20] 新增镜花子路由 /cases/case-01 ~ /cases/case-07，展开卡片时同步 hash */

// ── 路由定义 ──────────────────────────────────────────────────────
// ids: 按优先级排列，首个会在 navigate() 中被点击；
// 首页主元素 onclick 被清除后，自动尝试次级元素
const ROUTE_MAP = {
  '/home':      { ids: ['homelogo'] },
  '/expertise': { ids: ['zc', 'zc-title2', 'zc-title3'] },
  '/cases':     { ids: ['al', 'al-title2', 'al-title3'] },
  '/contact':   { ids: ['lx', 'lx-title2', 'lx-title3'] },
};

// [迭代-v20] 镜花子路由：/cases/case-01 ~ /cases/case-07
const CASE_IDS = ['case-01', 'case-02', 'case-03', 'case-04', 'case-05', 'case-06', 'case-07'];
CASE_IDS.forEach((cid) => {
  ROUTE_MAP['/cases/' + cid] = { ids: ['al', 'al-title2', 'al-title3'], caseId: cid };
});

// ── 反向映射：DOM id → 路由路径 ────────────────────────────────────
const ID_TO_PATH = {};
Object.entries(ROUTE_MAP).forEach(([path, cfg]) => {
  // [迭代-v20] 镜花子路由不加入点击反向映射（只在 navigate 中按 hash 触发）
  if (cfg.caseId) return;
  cfg.ids.forEach((id) => { ID_TO_PATH[id] = path; });
});

let isRouting = false;

// ── 核心导航 ──────────────────────────────────────────────────────
function navigate(path) {
  if (isRouting) return;
  const route = ROUTE_MAP[path];
  if (!route) return;

  isRouting = true;

  // 更新 URL hash
  if (window.location.hash !== '#' + path) {
    window.location.hash = '#' + path;
  }

  // [迭代-v20] 镜花子路由：先导航到 /cases，再分发 case-open 事件
  if (route.caseId) {
    // 先确保在 cases 页（触发卡片入场动画）
    const casesRoute = ROUTE_MAP['/cases'];
    for (const id of casesRoute.ids) {
      const el = document.getElementById(id);
      if (el && typeof el.click === 'function') {
        el.click();
        break;
      }
    }
    // 延迟分发 case-open 事件，等 cases 页入场动画完成
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('case-open', { detail: { caseId: route.caseId } }));
      isRouting = false;
    }, 900);
    return;
  }

  // 按优先级依次尝试点击，命中即止
  //（首页用 zc，进入页面后 zc.onclick 被清除，自动尝试 zc-title2）
  for (const id of route.ids) {
    const el = document.getElementById(id);
    if (el && typeof el.click === 'function') {
      el.click();
      break;
    }
  }

  // [迭代-v14] 延迟释放路由锁，防止 hashchange 同步事件循环重入
  setTimeout(() => { isRouting = false; }, 300);
}

// ── 为所有导航元素添加 hash 同步 ───────────────────────────────────
function wireExistingClicks() {
  const ALL_NAV_IDS = [
    'zc', 'zc-title2', 'zc-title3',
    'al', 'al-title2', 'al-title3',
    'lx', 'lx-title2', 'lx-title3',
    'homelogo',
  ];
  ALL_NAV_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      if (isRouting) return;
      const path = ID_TO_PATH[id];
      if (path && window.location.hash !== '#' + path) {
        window.location.hash = '#' + path;
      }
    });
  });
}

// ── 初始化 ────────────────────────────────────────────────────────
function initRouter() {
  wireExistingClicks();

  window.addEventListener('hashchange', () => {
    // [迭代-v20] 跳过由卡片弹窗触发的程序化 hash 更新
    if (window.__skipHashRoute) return;
    const path = location.hash.slice(1) || '/home';
    if (!isRouting) {
      navigate(path);
    }
  });

  const initialPath = location.hash.slice(1) || '/home';
  if (initialPath !== '/home') {
    setTimeout(() => navigate(initialPath), 600);
  }
}

// 入口
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}
