import { ArcTap } from './zc-arc-tap.js';

const STORAGE_KEY = 'zcbox-editor-v11';
const TAP_CONFIG_STORAGE_VERSION = 4;
const TIMELINE_STORAGE_VERSION = 5;
const EPSILON = 0.0001;
const PREVIEW_PROGRESS_POINTS = [0, 0.34, 0.67, 1];
const ICON_ASSETS = {
  plus: 'assets/zc-icons/jia.svg',
  minus: 'assets/zc-icons/jian.svg',
};
const TAP_KEYFRAME_IDS = ['b', 'c', 'a'];
const TAP_DIRECTION_ORDER = ['a', 'b', 'c'];
const TAP_ITEMS = [
  { id: 'a', text: '品牌认知' },
  { id: 'b', text: '开发迭代' },
  { id: 'c', text: '原型设计' },
];
const COPY_LAYOUT_OPTIONS = ['quadrants24', 'quadrants13'];
const COPY_TITLE_OPTIONS = ['形式', '方法', '目标'];
const DEFAULT_TRACK_COPY = [
  {
    copyLayout: 'quadrants24',
    copyAngle: 286,
    copyDistance: 164,
    copyTitle: '形式',
    copyBody: '功能结构\n页面流程\nUI方案\n交互逻辑',
    fixedLabelAngle: 52,
    fixedLabelDistance: 74,
  },
  {
    copyLayout: 'quadrants24',
    copyAngle: 246,
    copyDistance: 190,
    copyTitle: '目标',
    copyBody: '增长指标\n商业结果\n阶段性目标',
    fixedLabelAngle: 12,
    fixedLabelDistance: 84,
  },
  {
    copyLayout: 'quadrants13',
    copyAngle: 96,
    copyDistance: 188,
    copyTitle: '方法',
    copyBody: '业务目标拆解\n需求判断与取舍\n产品路径设计\n版本规划\n风险控制',
    fixedLabelAngle: 268,
    fixedLabelDistance: 86,
  },
];
const DEFAULT_FIXED_LABELS = [
  { text: '品牌设计' },
  { text: 'UI/UX 设计师' },
  { text: '产品经理' },
];
const COPY_CONTENT_PRESETS = [
  [
    { copyTitle: '形式', copyBody: '功能结构\n页面流程\n技术方案\n交互逻辑\n数据结构' },
    { copyTitle: '目标', copyBody: '增长指标\n商业结果\n阶段性目标达成\n系统稳定性' },
    { copyTitle: '方法', copyBody: '业务目标拆解\n需求判断与取舍\n产品路径设计\n版本规划\n风险控制' },
  ],
  [
    { copyTitle: '形式', copyBody: '信息架构\n界面设计\n交互流程\n组件系统\n设计规范' },
    { copyTitle: '目标', copyBody: '易用性\n理解成本低\n转化效率\n体验一致性' },
    { copyTitle: '方法', copyBody: '用户路径拆解\n任务流设计\n可用性验证\n方案权衡\n设计收敛' },
  ],
  [
    { copyTitle: '形式', copyBody: '品牌定位\n品牌语言\n核心叙事\n品牌资产' },
    { copyTitle: '目标', copyBody: '品牌定位清晰\n用户心智占位\n信任建立\n长期一致性' },
    { copyTitle: '方法', copyBody: '用户心智建模\n竞品认知分析\n差异化策略\n品牌一致性设计\n情绪与信任构建' },
  ],
];

const TAP_NUMERIC_FIELDS = [
  'clearance',
  'radiusOffset',
  'trackWidth',
  'startAngle',
  'gapDeg',
  'edgePaddingDeg',
  'fontSize',
  'fontWeight',
  'letterSpacing',
  'textRadiusOffset',
  'textRotateOffset',
  'activeOpacity',
  'inactiveOpacity',
  'activeScale',
  'inactiveScale',
  'hitWidthExtra',
  'strokeWidth',
  'strokeOpacity',
  'indicatorRadius',
  'indicatorGapFromOutline',
  'indicatorProtrusion',
  'indicatorIconViewBoxWidth',
  'indicatorIconViewBoxHeight',
  'indicatorIconWidth',
  'indicatorIconHeight',
  'indicatorIconStrokeWidth',
  'indicatorIconOpacity',
  'indicatorIconRotateOffset',
  'indicatorIconGapFromOutline',
  'indicatorIconScale',
  'indicatorTransitionMs',
];

const TAP_NULLABLE_NUMERIC_FIELDS = [
  'indicatorProtrusion',
  'indicatorIconGapFromOutline',
];

const TAP_BOOLEAN_FIELDS = [
  'indicatorIconEnabled',
];

const DEFAULT_VISUALS = {
  center: false,
  orbitVectors: false,
  solidVectors: false,
  tangents: true,
  labels: false,
};

const DEFAULT_COLLAPSED_SNAPSHOT = {
  label: '收起',
  rootOpacity: 0,
  tangentsOpacity: 0,
  tracks: [
    { orbitAngle: 228, orbitRadius: 34, ringRadius: 44, ringOpacity: 0.12, solidSize: 26, centerDistance: 18, solidOpacity: 0.12, iconVisible: false, iconType: 'plus' },
    { orbitAngle: 104, orbitRadius: 22, ringRadius: 34, ringOpacity: 0.08, solidSize: 18, centerDistance: 10, solidOpacity: 0.08, iconVisible: false, iconType: 'minus' },
    { orbitAngle: 340, orbitRadius: 28, ringRadius: 38, ringOpacity: 0.1, solidSize: 22, centerDistance: 14, solidOpacity: 0.1, iconVisible: false, iconType: 'plus' },
  ],
};

// [迭代-v22] 同步最新调试面板关键帧参数为默认值
const DEFAULT_TIMELINE = {
  duration: 1400,
  keyframes: [
    {
      at: 34,
      label: '关键帧 1',
      rootOpacity: 1,
      tangentsOpacity: 1,
      tracks: [
        { orbitAngle: 320, orbitRadius: 126, ringRadius: 24, ringOpacity: 0, solidSize: 126, centerDistance: 126, solidOpacity: 0.15, iconVisible: true, iconType: 'plus', copyAngle: 295, copyDistance: 145, fixedLabelAngle: 27, fixedLabelDistance: 74, ...COPY_CONTENT_PRESETS[0][0] },
        { orbitAngle: 232, orbitRadius: 134, ringRadius: 24, ringOpacity: 0, solidSize: 180, centerDistance: 134, solidOpacity: 0.4, iconVisible: true, iconType: 'minus', copyAngle: 281, copyDistance: 194, fixedLabelAngle: 12, fixedLabelDistance: 84, ...COPY_CONTENT_PRESETS[0][1] },
        { orbitAngle: 68, orbitRadius: 109, ringRadius: 100, ringOpacity: 0.6, solidSize: 26, centerDistance: 168, solidOpacity: 1, iconVisible: false, iconType: 'plus', copyAngle: 112, copyDistance: 84, fixedLabelAngle: 268, fixedLabelDistance: 86, ...COPY_CONTENT_PRESETS[0][2] },
      ],
    },
    {
      at: 67,
      label: '关键帧 2',
      rootOpacity: 1,
      tangentsOpacity: 1,
      tracks: [
        { orbitAngle: 51, orbitRadius: 114, ringRadius: 24, ringOpacity: 0, solidSize: 180, centerDistance: 114, solidOpacity: 0.4, iconVisible: true, iconType: 'plus', copyLayout: 'quadrants13', copyAngle: 71, copyDistance: 159, fixedLabelAngle: 52, fixedLabelDistance: 74, ...COPY_CONTENT_PRESETS[1][0] },
        { orbitAngle: 287, orbitRadius: 136, ringRadius: 100, ringOpacity: 0.6, solidSize: 26, centerDistance: 95, solidOpacity: 1, iconVisible: false, iconType: 'minus', copyAngle: 270, copyDistance: 153, fixedLabelAngle: -67, fixedLabelDistance: 84, ...COPY_CONTENT_PRESETS[1][1] },
        { orbitAngle: 147, orbitRadius: 134, ringRadius: 24, ringOpacity: 0, solidSize: 126, centerDistance: 134, solidOpacity: 0.15, iconVisible: true, iconType: 'minus', copyLayout: 'quadrants13', copyAngle: 62, copyDistance: 147, fixedLabelAngle: 268, fixedLabelDistance: 86, ...COPY_CONTENT_PRESETS[1][2] },
      ],
    },
    {
      at: 100,
      label: '关键帧 3',
      rootOpacity: 1,
      tangentsOpacity: 1,
      tracks: [
        { orbitAngle: 132, orbitRadius: 139, ringRadius: 100, ringOpacity: 0.6, solidSize: 30, centerDistance: 118, solidOpacity: 1, iconVisible: true, iconType: 'minus', copyLayout: 'quadrants13', copyAngle: 68, copyDistance: 135, fixedLabelAngle: -156, fixedLabelDistance: 44, ...COPY_CONTENT_PRESETS[2][0] },
        { orbitAngle: 42, orbitRadius: 110, ringRadius: 24, ringOpacity: 0, solidSize: 126, centerDistance: 110, solidOpacity: 0.15, iconVisible: true, iconType: 'plus', copyAngle: -68, copyDistance: 157, fixedLabelAngle: 12, fixedLabelDistance: 84, ...COPY_CONTENT_PRESETS[2][1] },
        { orbitAngle: 252, orbitRadius: 125, ringRadius: 24, ringOpacity: 0, solidSize: 180, centerDistance: 125, solidOpacity: 0.4, iconVisible: true, iconType: 'minus', copyAngle: -92, copyDistance: 179, fixedLabelAngle: 240, fixedLabelDistance: 86, ...COPY_CONTENT_PRESETS[2][2] },
      ],
    },
  ],
};

const DEFAULT_TAP_SETTINGS = {
  clearance: 108,
  radiusOffset: -99,
  startAngle: -86,
  trackWidth: 52,
  gapDeg: 2,
  edgePaddingDeg: 0,
  fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif',
  fontSize: 18,
  fontWeight: 400,
  letterSpacing: 0,
  textRadiusOffset: 0,
  textRotateOffset: 90,
  activeOpacity: 1,
  inactiveOpacity: 0.38,
  activeScale: 1,
  inactiveScale: 0.95,
  activeTextColor: '#ffffff',
  inactiveTextColor: '#ffffff',
  hitWidthExtra: 26,
  hitLineCap: 'round',
  stroke: '#ffffff',
  strokeWidth: 1,
  strokeOpacity: 0.3,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  outlineFill: 'none',
  indicatorRadius: 22,
  indicatorSide: 'inner',
  indicatorProtrusion: 14,
  indicatorGapFromOutline: 0,
  indicatorIconEnabled: true,
  indicatorIconPath: 'M0.500186 0.500186L2.62151 2.62151C3.01203 3.01203 3.6452 3.01203 4.03572 2.62151L6.15704 0.500186',
  indicatorIconViewBoxWidth: 7,
  indicatorIconViewBoxHeight: 4,
  indicatorIconWidth: 14,
  indicatorIconHeight: 8,
  indicatorIconStroke: '#ffffff',
  indicatorIconStrokeWidth: 1,
  indicatorIconLinecap: 'round',
  indicatorIconLinejoin: 'round',
  indicatorIconOpacity: 0.3,
  indicatorIconRotateOffset: 0,
  indicatorIconGapFromOutline: 2,
  indicatorIconScale: 0.8,
  indicatorTransitionMs: 240,
  indicatorEasing: 'easeOutCubic',
  activeId: 'b',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value, digits = 2) => Number(value.toFixed(digits));

const cloneValue = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const getDefaultTrackCopy = (index) => DEFAULT_TRACK_COPY[index] || DEFAULT_TRACK_COPY[DEFAULT_TRACK_COPY.length - 1];

const sanitizeCopyLayout = (value, fallback) => {
  if (COPY_LAYOUT_OPTIONS.includes(value)) {
    return value;
  }
  return fallback;
};

const sanitizeCopyTitle = (value, fallback) => {
  if (COPY_TITLE_OPTIONS.includes(value)) {
    return value;
  }
  return fallback;
};

const sanitizeCopyBody = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const normalized = value.replace(/\r\n/g, '\n').trim();
  return normalized || fallback;
};

const sanitizeFixedLabels = (labels = []) => DEFAULT_FIXED_LABELS.map((fallback, index) => ({
  text: typeof labels[index]?.text === 'string' ? labels[index].text : fallback.text,
}));

const normalizeTapItems = (items) => {
  const source = Array.isArray(items) ? items : TAP_ITEMS;
  const byId = new Map(source.map((item) => [item.id, item]));
  return TAP_ITEMS.map((item) => ({
    ...item,
    ...(byId.get(item.id) || {}),
    id: item.id,
  }));
};

const applyCopyContentPresets = (timeline = DEFAULT_TIMELINE) => {
  const sourceFrames = Array.isArray(timeline?.keyframes) ? timeline.keyframes : DEFAULT_TIMELINE.keyframes;
  return {
    ...timeline,
    keyframes: sourceFrames.map((frame, frameIndex) => {
      const frameFallback = DEFAULT_TIMELINE.keyframes[frameIndex] || DEFAULT_TIMELINE.keyframes[DEFAULT_TIMELINE.keyframes.length - 1];
      const sourceTracks = Array.isArray(frame?.tracks) ? frame.tracks : frameFallback.tracks;
      return {
        ...frameFallback,
        ...(frame || {}),
        tracks: sourceTracks.map((track, trackIndex) => ({
          ...track,
          ...(COPY_CONTENT_PRESETS[frameIndex]?.[trackIndex] || {}),
        })),
      };
    }),
  };
};

const sanitizeTapSettings = (settings = {}) => {
  const merged = {
    ...DEFAULT_TAP_SETTINGS,
    ...(settings || {}),
  };

  const output = { ...merged };

  TAP_NUMERIC_FIELDS.forEach((field) => {
    const rawValue = merged[field];
    if (TAP_NULLABLE_NUMERIC_FIELDS.includes(field) && (rawValue === null || rawValue === 'null' || rawValue === '')) {
      output[field] = null;
      return;
    }

    const numeric = Number(rawValue);
    output[field] = Number.isFinite(numeric) ? numeric : DEFAULT_TAP_SETTINGS[field];
  });

  TAP_BOOLEAN_FIELDS.forEach((field) => {
    output[field] = Boolean(merged[field]);
  });

  output.hitLineCap = merged.hitLineCap || DEFAULT_TAP_SETTINGS.hitLineCap;
  output.stroke = merged.stroke || DEFAULT_TAP_SETTINGS.stroke;
  output.strokeLinejoin = merged.strokeLinejoin || DEFAULT_TAP_SETTINGS.strokeLinejoin;
  output.strokeLinecap = merged.strokeLinecap || DEFAULT_TAP_SETTINGS.strokeLinecap;
  output.outlineFill = merged.outlineFill ?? DEFAULT_TAP_SETTINGS.outlineFill;
  output.fontFamily = merged.fontFamily || DEFAULT_TAP_SETTINGS.fontFamily;
  output.activeTextColor = merged.activeTextColor || DEFAULT_TAP_SETTINGS.activeTextColor;
  output.inactiveTextColor = merged.inactiveTextColor || DEFAULT_TAP_SETTINGS.inactiveTextColor;
  output.indicatorSide = merged.indicatorSide === 'outer' ? 'outer' : 'inner';
  output.indicatorIconPath = merged.indicatorIconPath || DEFAULT_TAP_SETTINGS.indicatorIconPath;
  output.indicatorIconStroke = merged.indicatorIconStroke || DEFAULT_TAP_SETTINGS.indicatorIconStroke;
  output.indicatorIconLinecap = merged.indicatorIconLinecap || DEFAULT_TAP_SETTINGS.indicatorIconLinecap;
  output.indicatorIconLinejoin = merged.indicatorIconLinejoin || DEFAULT_TAP_SETTINGS.indicatorIconLinejoin;
  output.indicatorEasing = merged.indicatorEasing || DEFAULT_TAP_SETTINGS.indicatorEasing;
  output.activeId = TAP_KEYFRAME_IDS.includes(merged.activeId) ? merged.activeId : DEFAULT_TAP_SETTINGS.activeId;

  return output;
};

const sortKeyframes = (frames) => frames.sort((a, b) => a.at - b.at);

const normalizeAngle = (value) => {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const getScreenQuadrant = (angle) => {
  const normalized = normalizeAngle(angle);
  if (normalized >= 0 && normalized < 90) {
    return 'q1';
  }
  if (normalized >= 90 && normalized < 180) {
    return 'q4';
  }
  if (normalized >= 180 && normalized < 270) {
    return 'q3';
  }
  return 'q2';
};

// [迭代-v22] 基于角度连续计算偏移，消除象限边界跳跃导致的顿挫感
const getCopyQuadrantNudge = (angle) => {
  const rad = (normalizeAngle(angle) * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(rad) * 22),
    y: Math.round(Math.sin(rad) * 16),
  };
};

const getCopyLayoutPlacement = (layout) => {
  if (layout === 'quadrants13') {
    return {
      tag: { horizontal: 'right', vertical: 'top' },
      body: { horizontal: 'left', vertical: 'bottom' },
    };
  }
  return {
    tag: { horizontal: 'left', vertical: 'top' },
    body: { horizontal: 'right', vertical: 'bottom' },
  };
};

const getCopyTransitionState = (mix = 1) => {
  const folded = clamp(Math.abs(mix - 0.5) * 2, 0, 1);
  const opacity = round(easeInOutSine(folded), 3);
  const direction = mix < 0.5 ? -1 : 1;
  return {
    opacity,
    offsetY: round((1 - opacity) * direction * 8, 2),
    blur: round((1 - opacity) * 6, 2),
  };
};

const interpolateAngleClockwise = (from, to, mix) => {
  const start = normalizeAngle(from);
  const delta = (normalizeAngle(to) - start + 360) % 360;
  return start + delta * mix;
};

const interpolateAngleCounterclockwise = (from, to, mix) => {
  const start = normalizeAngle(from);
  const delta = -((start - normalizeAngle(to) + 360) % 360);
  return start + delta * mix;
};

const interpolateAngleByMode = (from, to, mix, angleMode) => {
  if (angleMode === 'clockwise') {
    return interpolateAngleClockwise(from, to, mix);
  }
  if (angleMode === 'counterclockwise') {
    return interpolateAngleCounterclockwise(from, to, mix);
  }
  return lerp(from, to, mix);
};

const interpolateSnapshot = (from, to, mix, angleMode = 'linear') => ({
  label: mix < 0.5 ? from.label : to.label,
  rootOpacity: round(lerp(from.rootOpacity, to.rootOpacity, mix), 3),
  // [迭代-v23] 切线：入场最后出现（高次幂延迟），收起快速隐退（低次幂加速）
  tangentsOpacity: round(lerp(from.tangentsOpacity, to.tangentsOpacity,
    to.tangentsOpacity > from.tangentsOpacity ? Math.pow(mix, 5) : Math.pow(mix, 0.08)
  ), 3),
  tracks: from.tracks.map((track, index) => sanitizeTrack({
    orbitAngle: interpolateAngleByMode(track.orbitAngle, to.tracks[index].orbitAngle, mix, angleMode),
    orbitRadius: lerp(track.orbitRadius, to.tracks[index].orbitRadius, mix),
    ringRadius: lerp(track.ringRadius, to.tracks[index].ringRadius, mix),
    ringOpacity: lerp(track.ringOpacity, to.tracks[index].ringOpacity, mix),
    solidSize: lerp(track.solidSize, to.tracks[index].solidSize, mix),
    centerDistance: lerp(track.centerDistance, to.tracks[index].centerDistance, mix),
    solidOpacity: lerp(track.solidOpacity, to.tracks[index].solidOpacity, mix),
    iconVisible: interpolateBoolean(track.iconVisible, to.tracks[index].iconVisible, mix),
    iconType: interpolateString(track.iconType, to.tracks[index].iconType, mix),
    copyLayout: interpolateString(track.copyLayout, to.tracks[index].copyLayout, mix),
    // [迭代-v12] 文案角度补间跟随轨道共用方向策略，避免跨象限时走直线导致抽动。
    copyAngle: interpolateAngleByMode(track.copyAngle, to.tracks[index].copyAngle, mix, angleMode),
    copyDistance: lerp(track.copyDistance, to.tracks[index].copyDistance, mix),
    copyTitle: interpolateString(track.copyTitle, to.tracks[index].copyTitle, mix),
    copyBody: interpolateString(track.copyBody, to.tracks[index].copyBody, mix),
    fixedLabelAngle: interpolateAngleByMode(track.fixedLabelAngle, to.tracks[index].fixedLabelAngle, mix, angleMode),
    fixedLabelDistance: lerp(track.fixedLabelDistance, to.tracks[index].fixedLabelDistance, mix),
  }, index)),
});

// [迭代-v09] 实心圆维度改为“总圆心 -> 实心圆中心”的真实距离，并按虚线圆边界约束可达范围
const getTrackConstraints = (track) => {
  const ringRadius = clamp(Number(track.ringRadius) || 0, 24, 160);
  const solidSize = clamp(Number(track.solidSize) || 0, 12, 200);
  const orbitRadius = clamp(Number(track.orbitRadius) || 0, 0, 320);
  const maxOffset = Math.max(0, ringRadius - solidSize / 2 - 8);

  return {
    ringRadius,
    solidSize,
    orbitRadius,
    maxOffset,
    minCenterDistance: round(Math.max(0, orbitRadius - maxOffset), 2),
    maxCenterDistance: round(orbitRadius + maxOffset, 2),
  };
};

const sanitizeTrack = (track, index = 0) => {
  const copyFallback = getDefaultTrackCopy(index);
  const { ringRadius, solidSize, orbitRadius, minCenterDistance, maxCenterDistance } = getTrackConstraints(track);
  const fallbackCenterDistance = orbitRadius;
  const requestedCenterDistance = Number.isFinite(Number(track.centerDistance))
    ? Number(track.centerDistance)
    : fallbackCenterDistance;
  const centerDistance = clamp(requestedCenterDistance, minCenterDistance, maxCenterDistance);

  return {
    orbitAngle: round(Number(track.orbitAngle) || 0, 2),
    orbitRadius: round(orbitRadius, 2),
    ringRadius: round(ringRadius, 2),
    ringOpacity: round(clamp(Number(track.ringOpacity) || 0, 0, 1), 2),
    solidSize: round(solidSize, 2),
    centerDistance: round(centerDistance, 2),
    solidOpacity: round(clamp(Number(track.solidOpacity) || 0, 0, 1), 2),
    iconVisible: Boolean(track.iconVisible),
    iconType: track.iconType === 'minus' ? 'minus' : 'plus',
    copyLayout: sanitizeCopyLayout(track.copyLayout, copyFallback.copyLayout),
    copyAngle: round(Number.isFinite(Number(track.copyAngle)) ? Number(track.copyAngle) : copyFallback.copyAngle, 2),
    copyDistance: round(clamp(Number.isFinite(Number(track.copyDistance)) ? Number(track.copyDistance) : copyFallback.copyDistance, 0, 320), 2),
    copyTitle: sanitizeCopyTitle(track.copyTitle, copyFallback.copyTitle),
    copyBody: sanitizeCopyBody(track.copyBody, copyFallback.copyBody),
    fixedLabelAngle: round(Number.isFinite(Number(track.fixedLabelAngle)) ? Number(track.fixedLabelAngle) : copyFallback.fixedLabelAngle, 2),
    fixedLabelDistance: round(clamp(Number.isFinite(Number(track.fixedLabelDistance)) ? Number(track.fixedLabelDistance) : copyFallback.fixedLabelDistance, 0, 240), 2),
  };
};

const sanitizeKeyframe = (frame) => ({
  at: clamp(Number(frame.at) || 0, 0, 100),
  label: frame.label || `关键帧 ${Math.round(Number(frame.at) || 0)}%`,
  rootOpacity: round(clamp(frame.rootOpacity == null ? 1 : Number(frame.rootOpacity), 0, 1), 2),
  tangentsOpacity: round(clamp(frame.tangentsOpacity == null ? 1 : Number(frame.tangentsOpacity), 0, 1), 2),
  tracks: frame.tracks.map((track, index) => sanitizeTrack(track, index)),
});

const sanitizeTimeline = (timeline) => {
  const sourceFrames = Array.isArray(timeline.keyframes) ? timeline.keyframes : DEFAULT_TIMELINE.keyframes;
  const keyframes = DEFAULT_TIMELINE.keyframes.map((fallbackFrame, index) =>
    sanitizeKeyframe({
      ...fallbackFrame,
      ...(sourceFrames[index] || {}),
      label: sourceFrames[index]?.label || fallbackFrame.label,
      at: PREVIEW_PROGRESS_POINTS[index + 1] * 100,
    })
  );

  return {
    duration: clamp(Number(timeline.duration) || DEFAULT_TIMELINE.duration, 400, 4000),
    keyframes: sortKeyframes(keyframes),
  };
};

const lerp = (from, to, t) => from + (to - from) * t;
const interpolateBoolean = (from, to, t) => (t < 0.5 ? from : to);
const interpolateString = (from, to, t) => (t < 0.5 ? from : to);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
// [迭代-v23] 入场缓动：起势快、末段优雅减速
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

const snapshotFromProgress = (timeline, progress) => {
  const value = clamp(progress, 0, 1) * 100;
  const frames = [
    sanitizeKeyframe({ ...DEFAULT_COLLAPSED_SNAPSHOT, at: PREVIEW_PROGRESS_POINTS[0] * 100 }),
    ...timeline.keyframes.map((frame, index) => sanitizeKeyframe({ ...frame, at: PREVIEW_PROGRESS_POINTS[index + 1] * 100 })),
  ];

  if (value <= frames[0].at) {
    return cloneValue(frames[0]);
  }
  if (value >= frames[frames.length - 1].at) {
    return cloneValue(frames[frames.length - 1]);
  }

  for (let index = 0; index < frames.length - 1; index += 1) {
    const current = frames[index];
    const next = frames[index + 1];
    if (value < current.at || value > next.at) {
      continue;
    }

    const span = Math.max(next.at - current.at, EPSILON);
    const mix = (value - current.at) / span;

    return sanitizeKeyframe({
      ...interpolateSnapshot(current, next, mix),
      at: value,
      label: `插值 ${Math.round(value)}%`,
    });
  }

  return cloneValue(frames[frames.length - 1]);
};

const saveStorage = (payload) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('zcbox debug save failed', error);
  }
};

const loadStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn('zcbox debug restore failed', error);
    return null;
  }
};

let controllerInstance = null;

class ZcboxController {
  constructor() {
    this.root = document.getElementById('zcbox');
    this.stage = document.getElementById('zcbox2');
    this.arcTapWrap = document.getElementById('zc-arc-tap-wrap');
    this.arcTapSvg = document.getElementById('zc-arc-tap');
    this.tapButtons = Array.from(document.querySelectorAll('.zc-arc-tap-button'));
    this.tangentsLayer = document.querySelector('.qiexian-svg-layer');
    this.panel = document.getElementById('zc-debug-panel');

    this.orbits = [1, 2, 3].map((index) => ({
      orbitEl: document.getElementById(`zcyuan${index}`),
      shellEl: document.querySelector(`#zcyuan${index} .zcyuan-shell`),
      solidEl: document.getElementById(`zxyuan${index}`),
      iconEl: document.getElementById(`zcyuan${index}icon`),
      labelEl: document.querySelector(`#zcyuan${index} .zcyuan-label`),
      guideEl: document.getElementById(`zc-orbit-guide-${index}`),
      solidGuideEl: document.getElementById(`zc-solid-guide-${index}`),
      mainCopyEl: document.getElementById(`zc-copy-main-${index}`),
      mainCopyTagEl: document.querySelector(`#zc-copy-main-${index} .zc-copy-main-tag`),
      mainCopyBodyEl: document.querySelector(`#zc-copy-main-${index} .zc-copy-main-body`),
      fixedCopyEl: document.getElementById(`zc-copy-fixed-${index}`),
    }));

    this.controls = {
      toggle: document.getElementById('zc-debug-toggle'),
      content: document.querySelector('#zc-debug-panel .zc-debug-content'),
      sectionToggles: Array.from(document.querySelectorAll('.zc-debug-section-toggle')),
      play: document.getElementById('zc-debug-play'),
      reverse: document.getElementById('zc-debug-reverse'),
      prev: document.getElementById('zc-debug-prev'),
      next: document.getElementById('zc-debug-next'),
      progress: document.getElementById('zc-progress'),
      progressValue: document.getElementById('zc-progress-value'),
      duration: document.getElementById('zc-duration'),
      durationValue: document.getElementById('zc-duration-value'),
      visuals: {
        center: document.getElementById('zc-visual-center'),
        orbitVectors: document.getElementById('zc-visual-orbits'),
        solidVectors: document.getElementById('zc-visual-solid'),
        tangents: document.getElementById('zc-visual-tangents'),
        labels: document.getElementById('zc-visual-labels'),
      },
      orbitButtons: Array.from(document.querySelectorAll('.zc-debug-orbit-button')),
      orbitActiveLabel: document.getElementById('zc-orbit-active-label'),
      orbitControls: {
        orbitAngle: [document.getElementById('zc-control-angle'), document.getElementById('zc-control-angle-value')],
        orbitRadius: [document.getElementById('zc-control-orbit-radius'), document.getElementById('zc-control-orbit-radius-value')],
        ringRadius: [document.getElementById('zc-control-ring-radius'), document.getElementById('zc-control-ring-radius-value')],
        ringOpacity: [document.getElementById('zc-control-ring-opacity'), document.getElementById('zc-control-ring-opacity-value')],
        solidSize: [document.getElementById('zc-control-solid-size'), document.getElementById('zc-control-solid-size-value')],
        centerDistance: [document.getElementById('zc-control-center-distance'), document.getElementById('zc-control-center-distance-value')],
        solidOpacity: [document.getElementById('zc-control-solid-opacity'), document.getElementById('zc-control-solid-opacity-value')],
      },
      copyControls: {
        copyLayout: document.getElementById('zc-copy-layout'),
        copyTitle: document.getElementById('zc-copy-title'),
        copyBody: document.getElementById('zc-copy-body'),
        copyAngle: [document.getElementById('zc-copy-angle'), document.getElementById('zc-copy-angle-value')],
        copyDistance: [document.getElementById('zc-copy-distance'), document.getElementById('zc-copy-distance-value')],
      },
      fixedCopyControls: {
        text: document.getElementById('zc-fixed-copy-text'),
        fixedLabelAngle: [document.getElementById('zc-fixed-copy-angle'), document.getElementById('zc-fixed-copy-angle-value')],
        fixedLabelDistance: [document.getElementById('zc-fixed-copy-distance'), document.getElementById('zc-fixed-copy-distance-value')],
      },
      iconType: document.getElementById('zc-control-icon-type'),
      iconVisible: document.getElementById('zc-control-icon-visible'),
      tapControls: {
        clearance: [document.getElementById('zc-tap-clearance'), document.getElementById('zc-tap-clearance-value')],
        radiusOffset: [document.getElementById('zc-tap-radius-offset'), document.getElementById('zc-tap-radius-offset-value')],
        trackWidth: [document.getElementById('zc-tap-track-width'), document.getElementById('zc-tap-track-width-value')],
        startAngle: [document.getElementById('zc-tap-start-angle'), document.getElementById('zc-tap-start-angle-value')],
      },
      tapComputedRadius: document.getElementById('zc-tap-computed-radius'),
      tapConfigJson: document.getElementById('zc-tap-config-json'),
      tapConfigApply: document.getElementById('zc-tap-config-apply'),
      tapConfigRefresh: document.getElementById('zc-tap-config-refresh'),
      tapConfigReset: document.getElementById('zc-tap-config-reset'),
      tapConfigStatus: document.getElementById('zc-tap-config-status'),
      keyframeList: document.getElementById('zc-keyframe-list'),
      keyframeSave: document.getElementById('zc-keyframe-save'),
      keyframeReset: document.getElementById('zc-keyframe-reset'),
      keyframeJson: document.getElementById('zc-keyframe-json'),
      keyframeCopy: document.getElementById('zc-keyframe-copy'),
    };

    const restored = loadStorage();
    const hasCurrentTimeline = restored?.timelineVersion === TIMELINE_STORAGE_VERSION;
    const hasLegacyTimeline = Number(restored?.timelineVersion) >= 3;
    const rawTimeline = hasCurrentTimeline
      ? restored?.timeline
      : applyCopyContentPresets(hasLegacyTimeline ? restored?.timeline : DEFAULT_TIMELINE);
    const timeline = sanitizeTimeline(rawTimeline);
    const visuals = { ...DEFAULT_VISUALS, ...(restored?.visuals || {}) };
    const hasCurrentTapConfig = restored?.tapConfigVersion === TAP_CONFIG_STORAGE_VERSION;
    const tap = sanitizeTapSettings(hasCurrentTapConfig ? restored?.tap : DEFAULT_TAP_SETTINGS);
    const tapItems = normalizeTapItems(hasCurrentTapConfig ? restored?.tapItems : TAP_ITEMS);
    const fixedLabels = sanitizeFixedLabels(restored?.fixedLabels);

    this.state = {
      activeOrbit: 0,
      activeKeyframeIndex: 0,
      panelCollapsed: true,
      collapsed: true,
      currentSnapshot: sanitizeKeyframe(DEFAULT_COLLAPSED_SNAPSHOT),
      defaultPreset: {
        timeline: cloneValue(timeline),
        fixedLabels: cloneValue(fixedLabels),
        tap: cloneValue(tap),
        tapItems: cloneValue(tapItems),
      },
      copyTransition: null,
      isPlaying: false,
      playToken: 0,
      progress: 0,
      sceneLoopActive: false,
      tapTransitionAngleMode: 'shortest',
      timeline,
      tap,
      tapItems,
      fixedLabels,
      visuals,
    };

    this.syncPanelCollapsedState();
    this.arcTap = this.createArcTap();
    this.bindEvents();
    this.syncVisualToggles();
    this.renderKeyframes();
    this.renderCurrentSnapshot();
    this.syncArcTap();
    this.updateControlValues();
    this.refreshTapConfigEditor();
    this.bindTapConfigGlobals();
  }

  syncActiveOrbitDebugState() {
    this.orbits.forEach((orbit, index) => {
      const active = index === this.state.activeOrbit;
      orbit.orbitEl.classList.toggle('zcyuan--debug-active', active);
      orbit.mainCopyEl.classList.toggle('zc-copy--debug-active', active);
      orbit.fixedCopyEl.classList.toggle('zc-copy--debug-active', active);
    });
  }

  createArcTap() {
    if (!this.arcTapSvg) {
      return null;
    }

    return new ArcTap(this.arcTapSvg, {
      activeId: TAP_KEYFRAME_IDS[0],
      items: this.state.tapItems,
      onChange: (_, id) => {
        this.handleTapChange(id);
      },
    });
  }

  bindEvents() {
    this.controls.toggle.addEventListener('click', () => {
      this.state.panelCollapsed = !this.state.panelCollapsed;
      this.syncPanelCollapsedState();
    });

    this.controls.sectionToggles.forEach((toggle) => {
      const section = toggle.closest('.zc-debug-section');
      if (!section) {
        return;
      }
      const expanded = toggle.getAttribute('aria-expanded') !== 'false';
      section.dataset.collapsed = String(!expanded);
      toggle.addEventListener('click', () => {
        const collapsed = section.dataset.collapsed !== 'true';
        section.dataset.collapsed = String(collapsed);
        toggle.setAttribute('aria-expanded', String(!collapsed));
      });
    });

    this.controls.play.addEventListener('click', () => this.playIn());
    this.controls.reverse.addEventListener('click', () => this.playOut());
    this.controls.prev.addEventListener('click', () => this.stepToKeyframe(-1));
    this.controls.next.addEventListener('click', () => this.stepToKeyframe(1));

    this.controls.progress.addEventListener('input', () => {
      this.stopPlayback();
      this.setProgress(Number(this.controls.progress.value) / 100, true);
    });

    this.controls.duration.addEventListener('input', () => {
      this.state.timeline.duration = clamp(Number(this.controls.duration.value), 400, 4000);
      this.updateControlValues();
      this.persist();
    });

    Object.entries(this.controls.visuals).forEach(([key, element]) => {
      element.addEventListener('change', () => {
        this.state.visuals[key] = element.checked;
        this.syncVisualToggles();
        this.persist();
      });
    });

    this.controls.orbitButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.state.activeOrbit = Number(button.dataset.orbitIndex || 0);
        this.updateControlValues();
      });
    });

    this.bindOrbitRange('orbitAngle', 'orbitAngle', (value) => `${Math.round(value)}deg`);
    this.bindOrbitRange('orbitRadius', 'orbitRadius', (value) => `${Math.round(value)}px`);
    this.bindOrbitRange('ringRadius', 'ringRadius', (value) => `${Math.round(value)}px`);
    this.bindOrbitRange('ringOpacity', 'ringOpacity', (value) => round(value, 2));
    this.bindOrbitRange('solidSize', 'solidSize', (value) => `${Math.round(value)}px`);
    this.bindOrbitRange('centerDistance', 'centerDistance', (value) => `${Math.round(value)}px`);
    this.bindOrbitRange('solidOpacity', 'solidOpacity', (value) => round(value, 2));
    this.bindCopyRange('copyAngle', 'copyAngle', (value) => `${Math.round(value)}deg`);
    this.bindCopyRange('copyDistance', 'copyDistance', (value) => `${Math.round(value)}px`);
    this.bindFixedCopyRange('fixedLabelAngle', 'fixedLabelAngle', (value) => `${Math.round(value)}deg`);
    this.bindFixedCopyRange('fixedLabelDistance', 'fixedLabelDistance', (value) => `${Math.round(value)}px`);

    this.controls.copyControls.copyLayout.addEventListener('change', () => {
      this.updateActiveTrack({ copyLayout: this.controls.copyControls.copyLayout.value });
    });

    this.controls.copyControls.copyTitle.addEventListener('change', () => {
      this.updateActiveTrack({ copyTitle: this.controls.copyControls.copyTitle.value });
    });

    this.controls.copyControls.copyBody.addEventListener('input', () => {
      this.updateActiveTrack({ copyBody: this.controls.copyControls.copyBody.value });
    });

    this.controls.fixedCopyControls.text.addEventListener('input', () => {
      this.updateActiveFixedLabel(this.controls.fixedCopyControls.text.value);
    });

    this.controls.iconType.addEventListener('change', () => {
      this.updateActiveTrack({ iconType: this.controls.iconType.value });
    });

    this.controls.iconVisible.addEventListener('change', () => {
      this.updateActiveTrack({ iconVisible: this.controls.iconVisible.checked });
    });

    this.bindTapRange('clearance', 'clearance', (value) => `${Math.round(value)}px`);
    this.bindTapRange('radiusOffset', 'radiusOffset', (value) => `${Math.round(value)}px`);
    this.bindTapRange('trackWidth', 'trackWidth', (value) => `${Math.round(value)}px`);
    this.bindTapRange('startAngle', 'startAngle', (value) => `${Math.round(value)}deg`);

    this.controls.keyframeList.addEventListener('change', () => {
      const index = Number(this.controls.keyframeList.value);
      if (Number.isNaN(index)) {
        return;
      }
      this.stopPlayback();
      this.state.activeKeyframeIndex = index;
      const frame = this.state.timeline.keyframes[index];
      this.state.progress = PREVIEW_PROGRESS_POINTS[index + 1];
      this.state.collapsed = false;
      this.state.currentSnapshot = cloneValue(frame);
      this.renderCurrentSnapshot();
      this.syncArcTap();
      this.updateControlValues();
    });

    this.controls.keyframeSave.addEventListener('click', () => this.saveCurrentToSelectedKeyframe());
    this.controls.keyframeReset.addEventListener('click', () => this.resetDefaults());
    this.controls.keyframeCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.controls.keyframeJson.value);
      } catch (error) {
        console.warn('zcbox json copy failed', error);
      }
    });

    this.controls.tapConfigApply.addEventListener('click', () => {
      this.applyTapConfigFromEditor();
    });

    this.controls.tapConfigRefresh.addEventListener('click', () => {
      this.refreshTapConfigEditor();
      this.setTapConfigStatus('已回填当前 Tap 配置。');
    });

    this.controls.tapConfigReset.addEventListener('click', () => {
      this.resetTapConfig();
    });

    this.tapButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.handleTapChange(button.dataset.tapId || TAP_KEYFRAME_IDS[0]);
      });
    });
  }

  bindOrbitRange(controlKey, field, formatter) {
    const [input] = this.controls.orbitControls[controlKey];
    input.addEventListener('input', () => {
      this.updateActiveTrack({ [field]: Number(input.value) });
      this.updateOrbitControlDisplay(controlKey, formatter(Number(input.value)));
    });
  }

  syncPanelCollapsedState() {
    this.panel.classList.toggle('zc-debug-panel--collapsed', this.state.panelCollapsed);
    this.controls.toggle.setAttribute('aria-expanded', String(!this.state.panelCollapsed));
    this.controls.content.style.display = this.state.panelCollapsed ? 'none' : 'grid';
  }

  bindTapRange(controlKey, field, formatter) {
    const [input] = this.controls.tapControls[controlKey];
    input.addEventListener('input', () => {
      this.stopPlayback();
      this.state.tap[field] = Number(input.value);
      this.renderCurrentSnapshot();
      this.syncArcTap();
      this.updateTapControlDisplay(controlKey, formatter(Number(input.value)));
      this.persist();
    });
  }

  bindCopyRange(controlKey, field, formatter) {
    const [input] = this.controls.copyControls[controlKey];
    input.addEventListener('input', () => {
      this.updateActiveTrack({ [field]: Number(input.value) });
      this.updateCopyControlDisplay(controlKey, formatter(Number(input.value)));
    });
  }

  bindFixedCopyRange(controlKey, field, formatter) {
    const [input] = this.controls.fixedCopyControls[controlKey];
    input.addEventListener('input', () => {
      this.updateActiveTrack({ [field]: Number(input.value) });
      this.updateFixedCopyControlDisplay(controlKey, formatter(Number(input.value)));
    });
  }

  bindTapConfigGlobals() {
    window.zcArcTap = this.arcTap;
    window.getZcArcTapConfig = () => this.getTapConfigPayload();
    window.applyZcArcTapConfig = (next = {}) => this.applyTapConfig(next, { syncEditor: true, announce: true });
  }

  getTapTransitionAngleMode(fromIndex, toIndex) {
    const fromId = TAP_KEYFRAME_IDS[fromIndex] || TAP_KEYFRAME_IDS[0];
    const toId = TAP_KEYFRAME_IDS[toIndex] || TAP_KEYFRAME_IDS[0];
    const fromOrder = TAP_DIRECTION_ORDER.indexOf(fromId);
    const toOrder = TAP_DIRECTION_ORDER.indexOf(toId);

    if (toOrder > fromOrder) {
      return 'clockwise';
    }
    if (toOrder < fromOrder) {
      return 'counterclockwise';
    }
    return 'linear';
  }

  setTapConfigStatus(message, status = 'success') {
    if (!this.controls.tapConfigStatus) {
      return;
    }
    this.controls.tapConfigStatus.textContent = message;
    this.controls.tapConfigStatus.dataset.status = status;
  }

  clearTapConfigStatus() {
    if (!this.controls.tapConfigStatus) {
      return;
    }
    this.controls.tapConfigStatus.textContent = '';
    this.controls.tapConfigStatus.dataset.status = '';
  }

  getTapConfigPayload() {
    const {
      clearance,
      radiusOffset,
      ...component
    } = this.state.tap;

    return {
      placement: {
        clearance,
        radiusOffset,
      },
      component,
      items: cloneValue(this.state.tapItems),
    };
  }

  refreshTapConfigEditor() {
    if (!this.controls.tapConfigJson) {
      return;
    }
    this.controls.tapConfigJson.value = JSON.stringify(this.getTapConfigPayload(), null, 2);
  }

  applyTapConfigFromEditor() {
    try {
      const parsed = JSON.parse(this.controls.tapConfigJson.value);
      this.applyTapConfig(parsed, { syncEditor: true, announce: true });
    } catch (error) {
      this.setTapConfigStatus(`配置 JSON 解析失败：${error.message}`, 'error');
    }
  }

  applyTapConfig(next = {}, { syncEditor = false, announce = false } = {}) {
    const placement = next?.placement || {};
    const component = next?.component || {};
    const nextTap = sanitizeTapSettings({
      ...this.state.tap,
      ...placement,
      ...component,
    });
    const nextItems = normalizeTapItems(next?.items || this.state.tapItems);

    this.stopPlayback();
    this.state.tap = nextTap;
    this.state.tapItems = nextItems;

    if (component.activeId && TAP_KEYFRAME_IDS.includes(component.activeId)) {
      this.state.activeKeyframeIndex = this.getTapKeyframeIndex(component.activeId);
      this.state.progress = PREVIEW_PROGRESS_POINTS[this.state.activeKeyframeIndex + 1];
      this.state.currentSnapshot = cloneValue(this.state.timeline.keyframes[this.state.activeKeyframeIndex]);
      this.state.collapsed = false;
    }

    this.renderCurrentSnapshot();
    this.syncArcTap();
    this.updateControlValues();
    this.persist();

    if (syncEditor) {
      this.refreshTapConfigEditor();
    }

    if (announce) {
      this.setTapConfigStatus('Tap 配置已应用。');
    } else {
      this.clearTapConfigStatus();
    }
  }

  resetTapConfig() {
    const defaultTap = this.state.defaultPreset?.tap || DEFAULT_TAP_SETTINGS;
    const defaultTapItems = this.state.defaultPreset?.tapItems || TAP_ITEMS;
    this.applyTapConfig({
      placement: {
        clearance: defaultTap.clearance,
        radiusOffset: defaultTap.radiusOffset,
      },
      component: {
        ...defaultTap,
      },
      items: defaultTapItems,
    }, { syncEditor: true, announce: true });
  }

  updateActiveTrack(partialTrack) {
    this.stopPlayback();
    const snapshot = cloneValue(this.state.currentSnapshot);
    snapshot.tracks[this.state.activeOrbit] = sanitizeTrack({
      ...snapshot.tracks[this.state.activeOrbit],
      ...partialTrack,
    }, this.state.activeOrbit);
    this.state.currentSnapshot = snapshot;
    this.renderCurrentSnapshot();
    this.updateControlValues();
  }

  updateActiveFixedLabel(text) {
    this.stopPlayback();
    this.state.fixedLabels[this.state.activeOrbit] = {
      text,
    };
    this.renderCurrentSnapshot();
    this.updateControlValues();
    this.persist();
  }

  polarFromZeroUp(distance, angle) {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: Math.cos(radians) * distance,
      y: Math.sin(radians) * distance,
    };
  }

  setProgress(progress, fromInput = false) {
    this.state.progress = clamp(progress, 0, 1);
    this.state.currentSnapshot = snapshotFromProgress(this.state.timeline, this.state.progress);
    this.state.collapsed = this.state.progress <= EPSILON;
    this.renderCurrentSnapshot();
    this.updateControlValues(fromInput);
  }

  // [迭代-v23] 入场的缓动函数 easeOutExpo 使用独立的 1600ms 时长
  playIn() {
    this.playToKeyframe(this.state.activeKeyframeIndex, { angleMode: 'clockwise', customDuration: 1400 });
  }

  playSceneLoop() {
    this.stopPlayback({ keepSceneLoop: false });
    this.state.sceneLoopActive = true;

    if (this.state.collapsed || this.state.progress <= PREVIEW_PROGRESS_POINTS[1] + EPSILON) {
      this.playToKeyframe(0, {
        angleMode: 'clockwise',
        keepSceneLoop: true,
        onComplete: () => this.loopFromKeyframe(0),
      });
      return;
    }

    this.loopFromKeyframe(this.state.activeKeyframeIndex);
  }

  playOut() {
    this.stopPlayback();
    this.animateBetween({
      fromSnapshot: cloneValue(this.state.currentSnapshot),
      toSnapshot: sanitizeKeyframe(DEFAULT_COLLAPSED_SNAPSHOT),
      fromProgress: this.state.progress,
      toProgress: PREVIEW_PROGRESS_POINTS[0],
      duration: Math.max(360, Math.round(this.state.timeline.duration * 0.62)),
      onComplete: () => {
        this.state.collapsed = true;
        this.state.activeKeyframeIndex = 0;
        this.state.currentSnapshot = sanitizeKeyframe(DEFAULT_COLLAPSED_SNAPSHOT);
        this.state.progress = PREVIEW_PROGRESS_POINTS[0];
        this.renderCurrentSnapshot();
        this.updateControlValues();
      },
    });
  }

  loopFromKeyframe(currentIndex) {
    if (!this.state.sceneLoopActive) {
      return;
    }

    const nextIndex = (currentIndex + 1) % this.state.timeline.keyframes.length;
    this.playToKeyframe(nextIndex, {
      angleMode: 'clockwise',
      keepSceneLoop: true,
      onComplete: () => this.loopFromKeyframe(nextIndex),
    });
  }

  playToKeyframe(targetIndex, options = {}) {
    const {
      angleMode = 'clockwise',
      keepSceneLoop = false,
      customDuration,
      onComplete,
    } = options;
    const safeIndex = clamp(targetIndex, 0, this.state.timeline.keyframes.length - 1);
    const targetFrame = cloneValue(this.state.timeline.keyframes[safeIndex]);
    const targetProgress = PREVIEW_PROGRESS_POINTS[safeIndex + 1];
    this.state.activeKeyframeIndex = safeIndex;
    this.state.tapTransitionAngleMode = angleMode;
    this.syncArcTap();
    this.updateControlValues(true);

    this.stopPlayback({ keepSceneLoop });
    this.animateBetween({
      fromSnapshot: cloneValue(this.state.currentSnapshot),
      toSnapshot: targetFrame,
      fromProgress: this.state.progress,
      toProgress: targetProgress,
      duration: customDuration || Math.max(360, Math.round(this.state.timeline.duration * 0.72)),
      angleMode,
      onComplete: () => {
        this.state.activeKeyframeIndex = safeIndex;
        this.state.currentSnapshot = cloneValue(targetFrame);
        this.state.progress = targetProgress;
        this.state.collapsed = false;
        this.renderCurrentSnapshot();
        this.syncArcTap();
        this.updateControlValues();
        if (typeof onComplete === 'function') {
          onComplete();
        }
      },
    });
  }

  stepToKeyframe(direction) {
    const currentIndex = this.state.activeKeyframeIndex;
    const nextIndex = (this.state.activeKeyframeIndex + direction + this.state.timeline.keyframes.length) % this.state.timeline.keyframes.length;
    this.state.activeKeyframeIndex = nextIndex;
    this.playToKeyframe(nextIndex, {
      angleMode: this.getTapTransitionAngleMode(currentIndex, nextIndex),
    });
  }

  animateBetween({ fromSnapshot, toSnapshot, fromProgress, toProgress, duration, angleMode = 'linear', onComplete }) {
    this.state.isPlaying = true;
    this.state.copyTransition = { mix: 0 };
    const token = ++this.state.playToken;
    const start = performance.now();

    const tick = (now) => {
      if (token !== this.state.playToken) {
        return;
      }
      const elapsed = clamp((now - start) / Math.max(duration, 1), 0, 1);
      const eased = easeOutQuart(elapsed);

      this.state.progress = lerp(fromProgress, toProgress, eased);
      this.state.copyTransition = { mix: eased };
      this.state.currentSnapshot = sanitizeKeyframe({
        ...interpolateSnapshot(fromSnapshot, toSnapshot, eased, angleMode),
        at: this.state.progress * 100,
      });
      this.state.collapsed = this.state.progress <= EPSILON;
      this.renderCurrentSnapshot();
      this.updateControlValues(true);

      if (elapsed < 1) {
        window.requestAnimationFrame(tick);
        return;
      }

      this.state.isPlaying = false;
      this.state.copyTransition = null;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    };

    window.requestAnimationFrame(tick);
  }

  stopPlayback({ keepSceneLoop = false } = {}) {
    this.state.playToken += 1;
    this.state.isPlaying = false;
    this.state.copyTransition = null;
    if (!keepSceneLoop) {
      this.state.sceneLoopActive = false;
    }
  }

  renderCurrentSnapshot() {
    const snapshot = sanitizeKeyframe({
      ...this.state.currentSnapshot,
      at: this.state.progress * 100,
      label: this.state.currentSnapshot.label || '临时预览',
    });
    const isVisible = snapshot.rootOpacity > 0.02;

    // [迭代-v09] 参考 v08 的混合方式，容器层保持不混合，显隐交给外层避免压扁 difference 合成
    this.root.style.opacity = snapshot.rootOpacity;
    this.stage.style.opacity = 1;
    this.root.style.visibility = isVisible ? 'visible' : 'hidden';
    this.stage.style.visibility = isVisible ? 'visible' : 'hidden';
    // [迭代-v11] 参考旧版结构，zcbox 根层只负责显示，不做整屏点击拦截。
    this.root.style.pointerEvents = 'none';
    this.stage.style.pointerEvents = 'none';
    if (this.arcTapWrap) {
      this.arcTapWrap.style.display = isVisible ? 'block' : 'none';
      this.arcTapWrap.style.visibility = isVisible ? 'visible' : 'hidden';
      this.arcTapWrap.style.pointerEvents = isVisible ? 'auto' : 'none';
    }

    const tangentsVisible = this.state.visuals.tangents ? snapshot.tangentsOpacity : 0;
    if (this.tangentsLayer) {
      this.tangentsLayer.style.opacity = tangentsVisible;
    }

    const copyMotion = this.state.copyTransition ? getCopyTransitionState(this.state.copyTransition.mix) : getCopyTransitionState(1);

    snapshot.tracks.forEach((track, trackIndex) => {
      const orbit = this.orbits[trackIndex];
      const ringSize = track.ringRadius * 2;
      // [迭代-v09] 实心圆自旋不再暴露控制项，自动反向补偿轨道旋转以保持图标正向
      const { maxOffset } = getTrackConstraints(track);
      const solidOffset = clamp(track.orbitRadius - track.centerDistance, -maxOffset, maxOffset);
      const autoSolidSpin = -track.orbitAngle;

      orbit.orbitEl.style.setProperty('--orbit-angle', `${track.orbitAngle}deg`);
      orbit.orbitEl.style.setProperty('--orbit-radius', `${track.orbitRadius}px`);
      orbit.shellEl.style.setProperty('--ring-size', `${ringSize}px`);
      orbit.shellEl.style.setProperty('--ring-opacity', `${track.ringOpacity}`);
      orbit.shellEl.style.setProperty('--solid-offset', `${solidOffset}px`);
      orbit.shellEl.style.setProperty('--solid-size', `${track.solidSize}px`);
      orbit.shellEl.style.setProperty('--solid-opacity', `${track.solidOpacity}`);
      orbit.shellEl.style.setProperty('--solid-auto-spin', `${autoSolidSpin}deg`);

      orbit.solidEl.style.width = `${track.solidSize}px`;
      orbit.solidEl.style.height = `${track.solidSize}px`;
      orbit.solidEl.style.opacity = track.solidOpacity;

      orbit.iconEl.textContent = '';
      orbit.iconEl.dataset.iconType = track.iconType;
      orbit.iconEl.style.backgroundImage = `url('${track.iconType === 'minus' ? ICON_ASSETS.minus : ICON_ASSETS.plus}')`;
      orbit.iconEl.style.display = track.iconVisible ? 'block' : 'none';
      orbit.iconEl.style.setProperty('--icon-rotation', `${autoSolidSpin}deg`);

      orbit.labelEl.textContent = `A${trackIndex + 1} 轨道${Math.round(track.orbitRadius)} / 实心${Math.round(track.centerDistance)}`;

      orbit.guideEl.style.width = `${track.orbitRadius}px`;
      orbit.guideEl.style.transform = `translateY(-50%) rotate(${track.orbitAngle - 90}deg)`;
      orbit.solidGuideEl.style.width = `${track.centerDistance}px`;
      orbit.solidGuideEl.style.transform = `translateY(-50%) rotate(${track.orbitAngle - 90}deg)`;

      const solidCenter = this.polarFromZeroUp(track.centerDistance, track.orbitAngle);
      const mainCopyOffset = this.polarFromZeroUp(track.copyDistance, track.copyAngle);
      const fixedCopyOffset = this.polarFromZeroUp(track.fixedLabelDistance, track.fixedLabelAngle);
      const mainCopyX = solidCenter.x + mainCopyOffset.x;
      const mainCopyY = solidCenter.y + mainCopyOffset.y;
      const fixedCopyX = solidCenter.x + fixedCopyOffset.x;
      const fixedCopyY = solidCenter.y + fixedCopyOffset.y;
      const fixedLabel = this.state.fixedLabels[trackIndex]?.text || '';
      const copyQuadrant = getScreenQuadrant(track.copyAngle);
      // [迭代-v22] nudge 改为基于角度连续计算，不再按象限离散切换
      const copyNudge = getCopyQuadrantNudge(track.copyAngle);
      // [迭代-v12] 主文案共用同一锚点，靠 translate 贴紧到对角，不再额外拉开间距。
      const copyPlacement = getCopyLayoutPlacement(track.copyLayout);

      orbit.mainCopyEl.dataset.layout = track.copyLayout;
      orbit.mainCopyEl.dataset.quadrant = copyQuadrant;
      orbit.mainCopyEl.style.left = `${mainCopyX + copyNudge.x}px`;
      orbit.mainCopyEl.style.top = `${mainCopyY + copyNudge.y}px`;
      orbit.mainCopyEl.style.opacity = `${copyMotion.opacity}`;
      orbit.mainCopyEl.style.filter = copyMotion.blur > 0 ? `blur(${copyMotion.blur}px)` : 'none';
      orbit.mainCopyEl.style.transform = `translate3d(0, ${copyMotion.offsetY}px, 0)`;
      orbit.mainCopyTagEl.textContent = track.copyTitle;
      orbit.mainCopyBodyEl.textContent = track.copyBody;
      orbit.mainCopyTagEl.style.left = '0px';
      orbit.mainCopyTagEl.style.top = '0px';
      orbit.mainCopyTagEl.dataset.horizontal = copyPlacement.tag.horizontal;
      orbit.mainCopyTagEl.dataset.vertical = copyPlacement.tag.vertical;
      orbit.mainCopyBodyEl.style.left = '0px';
      orbit.mainCopyBodyEl.style.top = '0px';
      orbit.mainCopyBodyEl.dataset.horizontal = copyPlacement.body.horizontal;
      orbit.mainCopyBodyEl.dataset.vertical = copyPlacement.body.vertical;
      orbit.mainCopyEl.classList.toggle('zc-copy--visible', isVisible && Boolean(track.copyTitle || track.copyBody));

      orbit.fixedCopyEl.style.left = `${fixedCopyX}px`;
      orbit.fixedCopyEl.style.top = `${fixedCopyY}px`;
      orbit.fixedCopyEl.style.opacity = `${copyMotion.opacity}`;
      orbit.fixedCopyEl.style.filter = copyMotion.blur > 0 ? `blur(${copyMotion.blur}px)` : 'none';
      orbit.fixedCopyEl.style.transform = `translate3d(0, ${copyMotion.offsetY}px, 0) translateY(-50%)`;
      orbit.fixedCopyEl.textContent = fixedLabel;
      // [迭代-v15] ringOpacity 阈值从 0.001 提高到 0.35，防止关键帧插值中间帧时非目标轨道固定文案闪现
      orbit.fixedCopyEl.classList.toggle('zc-copy--visible', isVisible && track.ringOpacity > 0.35 && Boolean(fixedLabel));
    });
  }

  syncVisualToggles() {
    document.body.dataset.zcboxShowCenter = String(this.state.visuals.center);
    document.body.dataset.zcboxShowOrbitVectors = String(this.state.visuals.orbitVectors);
    document.body.dataset.zcboxShowSolidVectors = String(this.state.visuals.solidVectors);
    document.body.dataset.zcboxShowLabels = String(this.state.visuals.labels);

    Object.entries(this.controls.visuals).forEach(([key, element]) => {
      element.checked = this.state.visuals[key];
    });

    if (this.tangentsLayer) {
      this.tangentsLayer.style.display = this.state.visuals.tangents ? 'block' : 'none';
    }
  }

  updateOrbitControlDisplay(key, value) {
    const [, output] = this.controls.orbitControls[key];
    output.value = value;
    output.textContent = value;
  }

  updateTapControlDisplay(key, value) {
    const [, output] = this.controls.tapControls[key];
    output.value = value;
    output.textContent = value;
  }

  updateCopyControlDisplay(key, value) {
    const [, output] = this.controls.copyControls[key];
    output.value = value;
    output.textContent = value;
  }

  updateFixedCopyControlDisplay(key, value) {
    const [, output] = this.controls.fixedCopyControls[key];
    output.value = value;
    output.textContent = value;
  }

  getTapKeepoutRadius() {
    const frames = [
      DEFAULT_COLLAPSED_SNAPSHOT,
      ...this.state.timeline.keyframes,
    ];

    return frames.reduce((maxRadius, frame) => {
      const frameMax = frame.tracks.reduce((trackMax, track) => {
        const ringEdge = track.orbitRadius + track.ringRadius;
        const solidEdge = track.centerDistance + track.solidSize / 2;
        return Math.max(trackMax, ringEdge, solidEdge);
      }, 0);
      return Math.max(maxRadius, frameMax);
    }, 0);
  }

  getTapSelectionId() {
    return TAP_KEYFRAME_IDS[this.state.activeKeyframeIndex] || TAP_KEYFRAME_IDS[0];
  }

  getTapKeyframeIndex(id) {
    const index = TAP_KEYFRAME_IDS.indexOf(id);
    return index === -1 ? 0 : index;
  }

  getTapGeometry() {
    const keepoutRadius = this.getTapKeepoutRadius();
    const trackWidth = clamp(Number(this.state.tap.trackWidth) || DEFAULT_TAP_SETTINGS.trackWidth, 24, 120);
    const clearance = Number(this.state.tap.clearance) || 0;
    const radiusOffset = Number(this.state.tap.radiusOffset) || 0;
    const radius = Math.max(48, keepoutRadius + clearance + radiusOffset + trackWidth / 2);
    const outerRadius = radius + trackWidth / 2;
    const padding = 54;
    const size = Math.ceil((outerRadius + padding) * 2);

    return {
      keepoutRadius,
      radius,
      size,
      cx: size / 2,
      cy: size / 2,
      trackWidth,
    };
  }

  syncArcTap() {
    if (!this.arcTap || !this.arcTapWrap) {
      return;
    }

    const geometry = this.getTapGeometry();
    const activeId = this.getTapSelectionId();
    const {
      clearance: _clearance,
      radiusOffset: _radiusOffset,
      activeId: _configuredActiveId,
      ...component
    } = this.state.tap;

    this.arcTapWrap.style.width = `${geometry.size}px`;
    this.arcTapWrap.style.height = `${geometry.size}px`;

    this.arcTap.update({
      ...component,
      viewBoxWidth: geometry.size,
      viewBoxHeight: geometry.size,
      cx: geometry.cx,
      cy: geometry.cy,
      radius: geometry.radius,
      trackWidth: geometry.trackWidth,
      activeId,
      transitionAngleMode: this.state.tapTransitionAngleMode,
      items: this.state.tapItems,
    });

    this.syncTapButtons();
  }

  syncTapButtons() {
    if (!this.arcTap || !this.tapButtons.length) {
      return;
    }

    const layoutMap = new Map(this.arcTap.layout.map((item) => [item.id, item]));
    const { cx, cy, textRotateOffset } = this.arcTap.options;
    const activeId = this.getTapSelectionId();

    this.tapButtons.forEach((button) => {
      const item = layoutMap.get(button.dataset.tapId || '');
      if (!item) {
        button.style.display = 'none';
        return;
      }

      const radians = (item.center * Math.PI) / 180;
      const x = cx + Math.cos(radians) * item.textRadius;
      const y = cy + Math.sin(radians) * item.textRadius;
      const rotate = item.center + textRotateOffset;
      const isActive = item.id === activeId;

      button.style.display = 'block';
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.style.opacity = isActive ? '1' : '0.34';
      button.style.transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${isActive ? 1 : 0.95})`;
    });
  }

  handleTapChange(id) {
    const targetIndex = this.getTapKeyframeIndex(id);
    this.playToKeyframe(targetIndex, {
      angleMode: this.getTapTransitionAngleMode(this.state.activeKeyframeIndex, targetIndex),
    });
  }

  updateControlValues(skipProgress = false) {
    const activeTrack = this.state.currentSnapshot.tracks[this.state.activeOrbit];
    const { minCenterDistance, maxCenterDistance } = getTrackConstraints(activeTrack);
    const tapGeometry = this.getTapGeometry();

    if (!skipProgress) {
      this.controls.progress.value = String(Math.round(this.state.progress * 100));
    }
    this.controls.progressValue.value = `${Math.round(this.state.progress * 100)}%`;
    this.controls.progressValue.textContent = `${Math.round(this.state.progress * 100)}%`;

    this.controls.duration.value = String(this.state.timeline.duration);
    this.controls.durationValue.value = `${this.state.timeline.duration}ms`;
    this.controls.durationValue.textContent = `${this.state.timeline.duration}ms`;

    this.controls.orbitButtons.forEach((button, index) => {
      const active = index === this.state.activeOrbit;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    this.controls.orbitActiveLabel.textContent = `当前编辑：圆 ${String(this.state.activeOrbit + 1).padStart(2, '0')}`;
    this.syncActiveOrbitDebugState();
    this.controls.keyframeList.value = String(this.state.activeKeyframeIndex);

    Object.entries({
      orbitAngle: `${Math.round(activeTrack.orbitAngle)}deg`,
      orbitRadius: `${Math.round(activeTrack.orbitRadius)}px`,
      ringRadius: `${Math.round(activeTrack.ringRadius)}px`,
      ringOpacity: `${activeTrack.ringOpacity}`,
      solidSize: `${Math.round(activeTrack.solidSize)}px`,
      centerDistance: `${Math.round(activeTrack.centerDistance)}px`,
      solidOpacity: `${activeTrack.solidOpacity}`,
    }).forEach(([key, displayValue]) => {
      const [input] = this.controls.orbitControls[key];
      const field = key;
      input.value = String(activeTrack[field]);
      this.updateOrbitControlDisplay(key, displayValue);
    });

    const [centerDistanceInput] = this.controls.orbitControls.centerDistance;
    centerDistanceInput.min = String(Math.round(minCenterDistance));
    centerDistanceInput.max = String(Math.round(maxCenterDistance));
    centerDistanceInput.value = String(activeTrack.centerDistance);
    this.updateOrbitControlDisplay('centerDistance', `${Math.round(activeTrack.centerDistance)}px`);

    this.controls.iconType.value = activeTrack.iconType;
    this.controls.iconVisible.checked = activeTrack.iconVisible;
    this.controls.copyControls.copyLayout.value = activeTrack.copyLayout;
    this.controls.copyControls.copyTitle.value = activeTrack.copyTitle;
    this.controls.copyControls.copyBody.value = activeTrack.copyBody;
    Object.entries({
      copyAngle: `${Math.round(activeTrack.copyAngle)}deg`,
      copyDistance: `${Math.round(activeTrack.copyDistance)}px`,
    }).forEach(([key, displayValue]) => {
      const [input] = this.controls.copyControls[key];
      input.value = String(activeTrack[key]);
      this.updateCopyControlDisplay(key, displayValue);
    });

    this.controls.fixedCopyControls.text.value = this.state.fixedLabels[this.state.activeOrbit]?.text || '';
    Object.entries({
      fixedLabelAngle: `${Math.round(activeTrack.fixedLabelAngle)}deg`,
      fixedLabelDistance: `${Math.round(activeTrack.fixedLabelDistance)}px`,
    }).forEach(([key, displayValue]) => {
      const [input] = this.controls.fixedCopyControls[key];
      input.value = String(activeTrack[key]);
      this.updateFixedCopyControlDisplay(key, displayValue);
    });

    Object.entries({
      clearance: `${Math.round(this.state.tap.clearance)}px`,
      radiusOffset: `${Math.round(this.state.tap.radiusOffset)}px`,
      trackWidth: `${Math.round(this.state.tap.trackWidth)}px`,
      startAngle: `${Math.round(this.state.tap.startAngle)}deg`,
    }).forEach(([key, displayValue]) => {
      const [input] = this.controls.tapControls[key];
      input.value = String(this.state.tap[key]);
      this.updateTapControlDisplay(key, displayValue);
    });
    this.controls.tapComputedRadius.value = `${Math.round(tapGeometry.radius)}px`;
    this.controls.tapComputedRadius.textContent = `${Math.round(tapGeometry.radius)}px`;
    this.controls.keyframeJson.value = this.serializeKeyframes();
  }

  renderKeyframes() {
    const options = this.state.timeline.keyframes.map((frame, index) => {
      const selected = index === this.state.activeKeyframeIndex ? ' selected' : '';
      return `<option value="${index}"${selected}>${frame.label} · ${Math.round(frame.at)}%</option>`;
    });
    this.controls.keyframeList.innerHTML = options.join('');
  }

  saveCurrentToSelectedKeyframe() {
    const selectedIndex = clamp(this.state.activeKeyframeIndex, 0, this.state.timeline.keyframes.length - 1);
    const current = sanitizeKeyframe({
      ...this.state.currentSnapshot,
      at: PREVIEW_PROGRESS_POINTS[selectedIndex + 1] * 100,
      label: this.state.timeline.keyframes[selectedIndex]?.label || `关键帧 ${selectedIndex + 1}`,
    });

    this.state.timeline.keyframes[selectedIndex] = current;
    this.state.activeKeyframeIndex = selectedIndex;
    this.state.currentSnapshot = cloneValue(current);
    this.state.progress = PREVIEW_PROGRESS_POINTS[selectedIndex + 1];
    this.state.collapsed = false;
    this.renderKeyframes();
    this.renderCurrentSnapshot();
    this.syncArcTap();
    this.updateControlValues();
    this.persist();
  }

  resetDefaults() {
    this.stopPlayback();
    const defaultTimeline = this.state.defaultPreset?.timeline || DEFAULT_TIMELINE;
    const defaultFixedLabels = this.state.defaultPreset?.fixedLabels || DEFAULT_FIXED_LABELS;
    // [迭代-v12] 恢复默认改为回到当前已保存的调试基线，而不是最初硬编码参数。
    this.state.timeline = sanitizeTimeline(cloneValue(defaultTimeline));
    this.state.fixedLabels = sanitizeFixedLabels(cloneValue(defaultFixedLabels));
    this.state.tap = sanitizeTapSettings(cloneValue(this.state.defaultPreset?.tap || DEFAULT_TAP_SETTINGS));
    this.state.tapItems = normalizeTapItems(cloneValue(this.state.defaultPreset?.tapItems || TAP_ITEMS));
    this.state.activeKeyframeIndex = 0;
    this.state.progress = 0;
    this.state.currentSnapshot = sanitizeKeyframe(DEFAULT_COLLAPSED_SNAPSHOT);
    this.state.collapsed = true;
    this.renderKeyframes();
    this.renderCurrentSnapshot();
    this.syncArcTap();
    this.updateControlValues();
    this.persist();
  }

  persist() {
    saveStorage({
      timelineVersion: TIMELINE_STORAGE_VERSION,
      tapConfigVersion: TAP_CONFIG_STORAGE_VERSION,
      timeline: this.state.timeline,
      tap: this.state.tap,
      tapItems: this.state.tapItems,
      fixedLabels: this.state.fixedLabels,
      visuals: this.state.visuals,
    });
    this.controls.keyframeJson.value = this.serializeKeyframes();
  }

  serializeKeyframes() {
    return JSON.stringify({
      fixedLabels: this.state.fixedLabels,
      collapsed: sanitizeKeyframe(DEFAULT_COLLAPSED_SNAPSHOT),
      keyframes: this.state.timeline.keyframes.map((frame, index) => ({
        ...frame,
        sequence: index + 1,
      })),
    }, null, 2);
  }
}

export const getZcboxController = () => {
  if (!controllerInstance) {
    controllerInstance = new ZcboxController();
  }
  return controllerInstance;
};
