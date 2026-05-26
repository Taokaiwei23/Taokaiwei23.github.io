// [迭代-v11] 直接复用 test3 的 ArcTap 布尔路径绘制实现，只保留模块导出。
const EPS = 1e-9;
const KEY_PRECISION = 100000;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function dist2(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function pointKey(p) {
  return `${Math.round(p[0] * KEY_PRECISION)},${Math.round(p[1] * KEY_PRECISION)}`;
}

function cleanPoints(points) {
  const out = [];
  for (const p of points) {
    if (!out.length || dist2(out[out.length - 1], p) > 1e-12) out.push(p);
  }
  if (out.length > 1 && dist2(out[0], out[out.length - 1]) < 1e-12) out.pop();
  return out;
}

function signedArea(points) {
  let a = 0;
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

function ensureCCW(points) {
  const pts = cleanPoints(points);
  return signedArea(pts) < 0 ? pts.slice().reverse() : pts;
}

function sampleArcPoints(cx, cy, r, startAngle, endAngle, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const a = lerp(startAngle, endAngle, t);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function buildStrokeArcPolygon(cx, cy, r, w, startAngle, endAngle) {
  const outerR = r + w / 2;
  const innerR = Math.max(0.5, r - w / 2);
  const capR = w / 2;

  const span = Math.abs(endAngle - startAngle);
  const arcSteps = Math.max(120, Math.ceil((span * 120) / Math.PI));
  const capSteps = Math.max(36, Math.ceil(capR * 2.5));

  const outerArc = sampleArcPoints(cx, cy, outerR, startAngle, endAngle, arcSteps);

  const endCx = cx + r * Math.cos(endAngle);
  const endCy = cy + r * Math.sin(endAngle);
  const endCap = sampleArcPoints(endCx, endCy, capR, endAngle, endAngle + Math.PI, capSteps);

  const innerArc = sampleArcPoints(cx, cy, innerR, endAngle, startAngle, arcSteps);

  const startCx = cx + r * Math.cos(startAngle);
  const startCy = cy + r * Math.sin(startAngle);
  const startCap = sampleArcPoints(startCx, startCy, capR, startAngle + Math.PI, startAngle + Math.PI * 2, capSteps);

  return ensureCCW([
    ...outerArc,
    ...endCap.slice(1),
    ...innerArc.slice(1),
    ...startCap.slice(1),
  ]);
}

function buildCirclePolygon(cx, cy, r) {
  const steps = Math.max(180, Math.ceil(r * 3));
  return ensureCCW(sampleArcPoints(cx, cy, r, 0, Math.PI * 2, steps).slice(0, -1));
}

function pointInPolygon(point, polygon) {
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / ((yj - yi) || EPS) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function segmentIntersection(p1, p2, q1, q2) {
  const x1 = p1[0];
  const y1 = p1[1];
  const x2 = p2[0];
  const y2 = p2[1];
  const x3 = q1[0];
  const y3 = q1[1];
  const x4 = q2[0];
  const y4 = q2[1];

  const dx1 = x2 - x1;
  const dy1 = y2 - y1;
  const dx2 = x4 - x3;
  const dy2 = y4 - y3;

  const denom = dx1 * dy2 - dy1 * dx2;
  if (Math.abs(denom) < EPS) return null;

  const rx = x3 - x1;
  const ry = y3 - y1;
  const t = (rx * dy2 - ry * dx2) / denom;
  const u = (rx * dy1 - ry * dx1) / denom;

  if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null;

  return {
    t: clamp(t, 0, 1),
    u: clamp(u, 0, 1),
    p: [x1 + dx1 * t, y1 + dy1 * t],
  };
}

function buildSplitSegments(polyA, polyB) {
  const nA = polyA.length;
  const nB = polyB.length;

  const cutsA = Array.from({ length: nA }, () => [0, 1]);
  const cutsB = Array.from({ length: nB }, () => [0, 1]);

  for (let i = 0; i < nA; i += 1) {
    const a1 = polyA[i];
    const a2 = polyA[(i + 1) % nA];
    for (let j = 0; j < nB; j += 1) {
      const b1 = polyB[j];
      const b2 = polyB[(j + 1) % nB];
      const inter = segmentIntersection(a1, a2, b1, b2);
      if (!inter) continue;
      if (inter.t > EPS && inter.t < 1 - EPS) cutsA[i].push(inter.t);
      if (inter.u > EPS && inter.u < 1 - EPS) cutsB[j].push(inter.u);
    }
  }

  function splitPoly(poly, otherPoly, cuts) {
    const segs = [];
    const n = poly.length;

    for (let i = 0; i < n; i += 1) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % n];

      const ts = Array.from(new Set(cuts[i].map((v) => Math.round(v * 1e10) / 1e10))).sort((a, b) => a - b);

      for (let k = 0; k < ts.length - 1; k += 1) {
        const t0 = ts[k];
        const t1 = ts[k + 1];
        if (t1 - t0 < 1e-10) continue;

        const a = [lerp(p1[0], p2[0], t0), lerp(p1[1], p2[1], t0)];
        const b = [lerp(p1[0], p2[0], t1), lerp(p1[1], p2[1], t1)];

        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.hypot(dx, dy);
        if (len < 1e-9) continue;

        const nx = dy / len;
        const ny = -dx / len;
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2;
        const probe = [mx + nx * 1e-4, my + ny * 1e-4];

        if (!pointInPolygon(probe, otherPoly)) {
          segs.push({
            p1: a,
            p2: b,
            k1: pointKey(a),
            k2: pointKey(b),
          });
        }
      }
    }

    return segs;
  }

  const segsA = splitPoly(polyA, polyB, cutsA);
  const segsB = splitPoly(polyB, polyA, cutsB);

  return [...segsA, ...segsB];
}

function assembleLoops(segments) {
  const outgoing = new Map();
  const used = new Array(segments.length).fill(false);

  for (let i = 0; i < segments.length; i += 1) {
    const s = segments[i];
    if (!outgoing.has(s.k1)) outgoing.set(s.k1, []);
    outgoing.get(s.k1).push(i);
  }

  const loops = [];

  for (let i = 0; i < segments.length; i += 1) {
    if (used[i]) continue;

    const loop = [];
    let idx = i;
    let guard = 0;

    while (!used[idx] && guard < segments.length + 10) {
      guard += 1;
      used[idx] = true;
      const seg = segments[idx];
      loop.push(seg.p1);

      const nextList = outgoing.get(seg.k2) || [];
      let nextIdx = -1;
      for (const candidate of nextList) {
        if (!used[candidate]) {
          nextIdx = candidate;
          break;
        }
      }
      if (nextIdx === -1) break;
      idx = nextIdx;
    }

    if (loop.length >= 3) loops.push(ensureCCW(loop));
  }

  return loops;
}

function pathD(points) {
  if (!points || !points.length) return '';
  const p = cleanPoints(points);
  if (!p.length) return '';
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length; i += 1) d += ` L ${p[i][0]} ${p[i][1]}`;
  d += ' Z';
  return d;
}

export class ArcTap {
  constructor(svg, options = {}) {
    this.svg = typeof svg === 'string' ? document.querySelector(svg) : svg;
    if (!this.svg) throw new Error('未找到 SVG 容器');

    this.ns = 'http://www.w3.org/2000/svg';
    this.options = {
      viewBoxWidth: 900,
      viewBoxHeight: 620,
      svgAriaLabel: '圆弧 tap 组件',

      cx: 450,
      cy: 445,
      radius: 248,
      trackWidth: 78,
      startAngle: -155,
      gapDeg: 14,
      edgePaddingDeg: 10,

      fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica Neue, sans-serif',
      fontSize: 34,
      fontWeight: 600,
      letterSpacing: 6,
      textRadiusOffset: 0,
      textRotateOffset: 90,

      activeOpacity: 1,
      inactiveOpacity: 0.38,
      activeScale: 1,
      inactiveScale: 0.95,
      activeTextColor: '#161616',
      inactiveTextColor: '#161616',

      hitWidthExtra: 26,
      hitLineCap: 'round',

      stroke: '#191919',
      strokeWidth: 2.5,
      strokeOpacity: 1,
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
      outlineFill: 'none',

      indicatorRadius: 14,
      indicatorSide: 'inner',
      indicatorProtrusion: null,
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
      indicatorIconOpacity: 1,
      indicatorIconRotateOffset: 0,
      indicatorIconGapFromOutline: null,
      indicatorIconScale: 1,

      indicatorTransitionMs: 240,
      indicatorEasing: 'easeOutCubic',

      activeId: 'b',
      items: [
        { id: 'a', text: '品牌认知' },
        { id: 'b', text: '开发迭代' },
        { id: 'c', text: '原型设计' },
      ],
      onChange: null,
      ...options,
    };

    this.activeId = this.options.activeId;
    this.indicatorAngle = null;
    this.itemNodeMap = new Map();
    this.animationRaf = null;
    this.layout = [];
    this.trackStart = 0;
    this.trackEnd = 0;

    this.root = this.createEl('g');
    this.svg.innerHTML = '';
    this.svg.appendChild(this.root);

    this.measureLayer = this.createEl('g');
    this.measureLayer.setAttribute('opacity', '0');
    this.measureLayer.style.pointerEvents = 'none';
    this.svg.appendChild(this.measureLayer);

    this.booleanLayer = this.createEl('g');
    this.root.appendChild(this.booleanLayer);

    this.itemLayer = this.createEl('g');
    this.root.appendChild(this.itemLayer);

    this.build();
  }

  shouldRebuild(nextOptions) {
    const rebuildKeys = [
      'viewBoxWidth',
      'viewBoxHeight',
      'svgAriaLabel',
      'cx',
      'cy',
      'radius',
      'trackWidth',
      'startAngle',
      'gapDeg',
      'edgePaddingDeg',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'letterSpacing',
      'textRadiusOffset',
      'textRotateOffset',
      'hitWidthExtra',
      'hitLineCap',
      'stroke',
      'strokeWidth',
      'strokeOpacity',
      'strokeLinejoin',
      'strokeLinecap',
      'outlineFill',
      'indicatorRadius',
      'indicatorSide',
      'indicatorProtrusion',
      'indicatorGapFromOutline',
      'indicatorIconEnabled',
      'indicatorIconPath',
      'indicatorIconViewBoxWidth',
      'indicatorIconViewBoxHeight',
      'indicatorIconWidth',
      'indicatorIconHeight',
      'indicatorIconStroke',
      'indicatorIconStrokeWidth',
      'indicatorIconLinecap',
      'indicatorIconLinejoin',
      'indicatorIconOpacity',
      'indicatorIconRotateOffset',
      'indicatorIconGapFromOutline',
      'indicatorIconScale',
    ];

    if (JSON.stringify(this.options.items) !== JSON.stringify(nextOptions.items)) {
      return true;
    }

    return rebuildKeys.some((key) => this.options[key] !== nextOptions[key]);
  }

  createEl(tag) {
    return document.createElementNS(this.ns, tag);
  }

  update(patch = {}) {
    const nextOptions = {
      ...this.options,
      ...patch,
      items: patch.items ? patch.items : this.options.items,
    };
    const transitionAngleMode = patch.transitionAngleMode || 'shortest';
    const nextActiveId = patch.activeId !== undefined
      ? patch.activeId
      : (nextOptions.items.some((item) => item.id === this.activeId) ? this.activeId : nextOptions.items[0]?.id || '');
    const shouldRebuild = this.shouldRebuild(nextOptions);

    this.options = nextOptions;
    this.activeId = nextActiveId;

    if (shouldRebuild) {
      this.build();
      return;
    }

    this.applyActiveStyles();
    this.moveIndicatorTo(this.getActiveCenterAngle(), false, transitionAngleMode);
  }

  degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  polarToCartesian(cx, cy, r, deg) {
    const rad = this.degToRad(deg);
    return {
      x: cx + Math.cos(rad) * r,
      y: cy + Math.sin(rad) * r,
    };
  }

  describeArc(cx, cy, r, startAngle, endAngle) {
    const start = this.polarToCartesian(cx, cy, r, startAngle);
    const end = this.polarToCartesian(cx, cy, r, endAngle);
    const delta = ((endAngle - startAngle) % 360 + 360) % 360;
    const largeArcFlag = delta > 180 ? 1 : 0;

    return [
      `M ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    ].join(' ');
  }

  measureCharWidth(char, fontSize, fontWeight, fontFamily) {
    const t = this.createEl('text');
    t.textContent = char;
    t.setAttribute('x', '-9999');
    t.setAttribute('y', '-9999');
    t.setAttribute('font-size', fontSize);
    t.setAttribute('font-weight', fontWeight);
    t.setAttribute('font-family', fontFamily);
    this.measureLayer.appendChild(t);
    const width = t.getBBox().width || fontSize;
    t.remove();
    return width;
  }

  measureTextArcDeg(text, radius, letterSpacing, fontSize, fontWeight, fontFamily) {
    const chars = Array.from(text);
    const totalPx = chars.reduce((sum, ch) => (
      sum + this.measureCharWidth(ch, fontSize, fontWeight, fontFamily) + letterSpacing
    ), 0);
    return (totalPx / radius) * (180 / Math.PI);
  }

  computeLayout() {
    const {
      items,
      radius,
      startAngle,
      gapDeg,
      letterSpacing,
      fontSize,
      fontWeight,
      fontFamily,
      textRadiusOffset,
      activeTextColor,
      inactiveTextColor,
    } = this.options;

    let cursor = startAngle;

    return items.map((item) => {
      const itemFontSize = item.fontSize ?? fontSize;
      const itemFontWeight = item.fontWeight ?? fontWeight;
      const itemLetterSpacing = item.letterSpacing ?? letterSpacing;
      const itemFontFamily = item.fontFamily ?? fontFamily;
      const itemTextRadius = radius + (item.textRadiusOffset ?? textRadiusOffset);

      const spanDeg = this.measureTextArcDeg(
        item.text,
        itemTextRadius,
        itemLetterSpacing,
        itemFontSize,
        itemFontWeight,
        itemFontFamily,
      );

      const layout = {
        ...item,
        fontSize: itemFontSize,
        fontWeight: itemFontWeight,
        letterSpacing: itemLetterSpacing,
        fontFamily: itemFontFamily,
        textRadius: itemTextRadius,
        activeTextColor: item.activeTextColor ?? activeTextColor,
        inactiveTextColor: item.inactiveTextColor ?? inactiveTextColor,
        spanDeg,
        start: cursor,
        end: cursor + spanDeg,
        center: cursor + spanDeg / 2,
      };

      cursor += spanDeg + gapDeg;
      return layout;
    });
  }

  renderTrack(layout) {
    const { edgePaddingDeg } = this.options;
    const startAngle = layout[0].start - edgePaddingDeg;
    const endAngle = layout[layout.length - 1].end + edgePaddingDeg;

    this.trackStart = startAngle;
    this.trackEnd = endAngle;
  }

  renderItems(layout) {
    const {
      cx,
      cy,
      radius,
      textRotateOffset,
      trackWidth,
      hitWidthExtra,
      hitLineCap,
    } = this.options;

    this.itemLayer.innerHTML = '';

    layout.forEach((item) => {
      const group = this.createEl('g');

      const hit = this.createEl('path');
      hit.setAttribute('d', this.describeArc(cx, cy, radius, item.start, item.end));
      hit.setAttribute('class', 'tab-hit');
      hit.setAttribute('stroke-width', String(trackWidth + hitWidthExtra));
      hit.setAttribute('stroke-linecap', hitLineCap);
      hit.addEventListener('click', () => this.setActive(item.id));
      group.appendChild(hit);

      const chars = Array.from(item.text);
      const charWidths = chars.map((ch) => (
        this.measureCharWidth(ch, item.fontSize, item.fontWeight, item.fontFamily)
      ));
      const steps = charWidths.map((w) => (
        ((w + item.letterSpacing) / item.textRadius) * (180 / Math.PI)
      ));

      let currentAngle = item.start;
      const charNodes = [];

      chars.forEach((ch, i) => {
        const half = steps[i] / 2;
        currentAngle += half;

        const pos = this.polarToCartesian(cx, cy, item.textRadius, currentAngle);

        const wrap = this.createEl('g');
        wrap.setAttribute('class', 'tab-char-wrap');

        const text = this.createEl('text');
        text.textContent = ch;
        text.setAttribute('x', '0');
        text.setAttribute('y', '0');
        text.setAttribute('class', 'tab-char');
        text.setAttribute('font-size', item.fontSize);
        text.setAttribute('font-weight', item.fontWeight);
        text.setAttribute('font-family', item.fontFamily);

        const rotate = currentAngle + textRotateOffset;
        const baseTransform = `translate(${pos.x} ${pos.y}) rotate(${rotate})`;
        wrap.setAttribute('transform', baseTransform);
        wrap.appendChild(text);

        charNodes.push({ wrap, text, baseTransform, item });
        group.appendChild(wrap);
        currentAngle += half;
      });

      this.itemNodeMap.set(item.id, { charNodes, centerAngle: item.center, item });
      this.itemLayer.appendChild(group);
    });
  }

  renderBooleanOutline(angle) {
    const {
      cx,
      cy,
      radius,
      trackWidth,
      stroke,
      strokeWidth,
      strokeOpacity,
      strokeLinejoin,
      strokeLinecap,
      outlineFill,
      indicatorRadius,
      indicatorSide,
      indicatorProtrusion,
      indicatorGapFromOutline,
    } = this.options;

    const startRad = this.degToRad(this.trackStart);
    const endRad = this.degToRad(this.trackEnd);
    const arcPoly = buildStrokeArcPolygon(cx, cy, radius, trackWidth, startRad, endRad);

    const innerEdgeR = radius - trackWidth / 2;
    const outerEdgeR = radius + trackWidth / 2;

    const indicatorCenterR = this.computeIndicatorCenterRadius({
      innerEdgeR,
      outerEdgeR,
      indicatorRadius,
      indicatorSide,
      indicatorProtrusion,
      indicatorGapFromOutline,
    });

    const dotPos = this.polarToCartesian(cx, cy, indicatorCenterR, angle);
    const dotPoly = buildCirclePolygon(dotPos.x, dotPos.y, indicatorRadius);

    const segments = buildSplitSegments(arcPoly, dotPoly);
    const loops = assembleLoops(segments);

    this.booleanLayer.innerHTML = '';
    loops.forEach((loop) => {
      const path = this.createEl('path');
      path.setAttribute('d', pathD(loop));
      path.setAttribute('fill', outlineFill);
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', String(strokeWidth));
      path.setAttribute('stroke-opacity', String(strokeOpacity));
      path.setAttribute('stroke-linejoin', strokeLinejoin);
      path.setAttribute('stroke-linecap', strokeLinecap);
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      this.booleanLayer.appendChild(path);
    });

    this.renderIndicatorIcon({
      angle,
      dotPos,
      indicatorCenterR,
      innerEdgeR,
      outerEdgeR,
    });
  }

  computeIndicatorCenterRadius({
    innerEdgeR,
    outerEdgeR,
    indicatorRadius,
    indicatorSide,
    indicatorProtrusion,
    indicatorGapFromOutline,
  }) {
    const d =
      typeof indicatorProtrusion === 'number'
        ? indicatorProtrusion - indicatorRadius
        : indicatorGapFromOutline;

    if (indicatorSide === 'outer') {
      return outerEdgeR + d;
    }
    return innerEdgeR - d;
  }

  computeRadiusBySideFromOutline(side, innerEdgeR, outerEdgeR, gap) {
    if (side === 'outer') return outerEdgeR + gap;
    return innerEdgeR - gap;
  }

  renderIndicatorIcon({ angle, indicatorCenterR, innerEdgeR, outerEdgeR }) {
    const {
      cx,
      cy,
      indicatorIconEnabled,
      indicatorIconPath,
      indicatorIconViewBoxWidth,
      indicatorIconViewBoxHeight,
      indicatorIconWidth,
      indicatorIconHeight,
      indicatorIconStroke,
      indicatorIconStrokeWidth,
      indicatorIconLinecap,
      indicatorIconLinejoin,
      indicatorIconOpacity,
      indicatorIconRotateOffset,
      indicatorIconGapFromOutline,
      indicatorIconScale,
    } = this.options;

    if (!indicatorIconEnabled || !indicatorIconPath) return;

    const iconCenterR =
      typeof indicatorIconGapFromOutline === 'number'
        ? this.computeRadiusBySideFromOutline(
          this.options.indicatorSide,
          innerEdgeR,
          outerEdgeR,
          indicatorIconGapFromOutline,
        )
        : indicatorCenterR;
    const iconPos = this.polarToCartesian(cx, cy, iconCenterR, angle);

    const toCenterDeg = Math.atan2(cy - iconPos.y, cx - iconPos.x) * 180 / Math.PI;
    const rotate = toCenterDeg - 90 + indicatorIconRotateOffset;

    const iconRoot = this.createEl('g');
    iconRoot.setAttribute('class', 'indicator-icon');
    iconRoot.setAttribute(
      'transform',
      `translate(${iconPos.x} ${iconPos.y}) rotate(${rotate}) scale(${indicatorIconScale})`,
    );

    const shapeWrap = this.createEl('g');
    const sx = indicatorIconWidth / indicatorIconViewBoxWidth;
    const sy = indicatorIconHeight / indicatorIconViewBoxHeight;
    shapeWrap.setAttribute(
      'transform',
      `translate(${-indicatorIconWidth / 2} ${-indicatorIconHeight / 2}) scale(${sx} ${sy})`,
    );

    const path = this.createEl('path');
    path.setAttribute('d', indicatorIconPath);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', indicatorIconStroke);
    path.setAttribute('stroke-width', String(indicatorIconStrokeWidth));
    path.setAttribute('stroke-linecap', indicatorIconLinecap);
    path.setAttribute('stroke-linejoin', indicatorIconLinejoin);
    path.setAttribute('opacity', String(indicatorIconOpacity));
    path.setAttribute('vector-effect', 'non-scaling-stroke');

    shapeWrap.appendChild(path);
    iconRoot.appendChild(shapeWrap);
    this.booleanLayer.appendChild(iconRoot);
  }

  getActiveCenterAngle() {
    const node = this.itemNodeMap.get(this.activeId);
    return node ? node.centerAngle : this.computeLayout()[0].center;
  }

  applyActiveStyles() {
    const {
      activeOpacity,
      inactiveOpacity,
      activeScale,
      inactiveScale,
    } = this.options;

    this.itemNodeMap.forEach((node, id) => {
      const active = id === this.activeId;
      const opacity = active ? activeOpacity : inactiveOpacity;
      const scale = active ? activeScale : inactiveScale;
      const color = active ? node.item.activeTextColor : node.item.inactiveTextColor;

      node.charNodes.forEach((charNode) => {
        charNode.text.setAttribute('opacity', String(opacity));
        charNode.text.setAttribute('fill', color);
        charNode.wrap.setAttribute('transform', `${charNode.baseTransform} scale(${scale})`);
      });
    });
  }

  ease(t) {
    const easingMap = {
      linear: (x) => x,
      easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
      easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
      easeInOutQuad: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
    };
    const fn = easingMap[this.options.indicatorEasing] || easingMap.easeOutCubic;
    return fn(t);
  }

  moveIndicatorTo(angle, immediate = false, mode = 'shortest') {
    if (this.animationRaf) {
      cancelAnimationFrame(this.animationRaf);
      this.animationRaf = null;
    }

    const duration = Math.max(0, Number(this.options.indicatorTransitionMs) || 0);
    if (this.indicatorAngle == null || immediate || duration === 0) {
      this.updateIndicator(angle);
      return;
    }

    const from = this.indicatorAngle;
    let delta = ((angle - from + 540) % 360) - 180;
    if (mode === 'clockwise') {
      delta = (angle - from + 360) % 360;
    } else if (mode === 'counterclockwise') {
      delta = -((from - angle + 360) % 360);
    } else if (mode === 'linear') {
      delta = angle - from;
    }
    const startAt = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = this.ease(t);
      this.updateIndicator(from + delta * eased);
      if (t < 1) {
        this.animationRaf = requestAnimationFrame(step);
      } else {
        this.animationRaf = null;
      }
    };

    this.animationRaf = requestAnimationFrame(step);
  }

  updateIndicator(angle) {
    this.indicatorAngle = angle;
    this.renderBooleanOutline(angle);
  }

  build() {
    this.svg.setAttribute('viewBox', `0 0 ${this.options.viewBoxWidth} ${this.options.viewBoxHeight}`);
    this.svg.setAttribute('aria-label', this.options.svgAriaLabel || '圆弧 tap 组件');

    this.itemNodeMap.clear();
    this.layout = this.computeLayout();
    if (!this.layout.length) return;

    this.renderTrack(this.layout);
    this.renderItems(this.layout);

    this.applyActiveStyles();
    this.moveIndicatorTo(this.getActiveCenterAngle(), true);
  }

  setActive(id) {
    if (!this.itemNodeMap.has(id)) return;
    if (id === this.activeId) return;

    this.activeId = id;
    this.applyActiveStyles();
    this.moveIndicatorTo(this.getActiveCenterAngle(), false);

    if (typeof this.options.onChange === 'function') {
      const item = this.options.items.find((x) => x.id === id);
      this.options.onChange(item, id);
    }
  }
}
