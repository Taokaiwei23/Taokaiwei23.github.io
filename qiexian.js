// ========== 不用动的：TrapezoidConnector 核心模块 ==========

const TrapezoidConnector = {
    /**
     * 创建单个连接器
     */
    create(options) {
        const { from, to, layer = 'canvas', container = document.body, style = {}, showWaist = 'both' } = options;
        const renderer = this._createRenderer(layer, container, style, showWaist);
        
        const connector = {
            from,
            to,
            layer,
            renderer,
            path: null,
            showWaist,
            
            update() {
                this.path = TrapezoidConnector.toPoints(from, to);
                this.renderer.render(this.path, this.showWaist);
                return this;
            },
            
            track() {
                const loop = () => {
                    if (!this._destroyed) {
                        this.update();
                        requestAnimationFrame(loop);
                    }
                };
                loop();
                return this;
            },
            
            destroy() {
                this._destroyed = true;
                this.renderer.destroy();
            },
            
            _destroyed: false
        };
        
        connector.update();
        return connector;
    },
    
    /**
     * 批量创建多个连接器（共享同一个 canvas/svg 层）
     */
    batchCreate(options) {
        const { pairs, layer = 'canvas', container = document.body, style = {} } = options;
        const s = { 
            fill: 'rgba(233, 69, 96, 0.4)', 
            stroke: '#e94560', 
            strokeWidth: 2,
            ...style 
        };
        
        // 创建共享的渲染层
        const renderer = this._createBatchRenderer(layer, container, s);
        
        // 创建连接器对象数组
        const connectors = pairs.map(({ from, to, showWaist = 'both' }) => ({
            from,
            to,
            showWaist,
            update() {
                return TrapezoidConnector.toPoints(from, to);
            }
        }));
        
        // 统一渲染循环
        const track = () => {
            const loop = () => {
                // 收集所有点和配置
                const allData = connectors.map(c => ({
                    points: c.update(),
                    showWaist: c.showWaist
                }));
                // 一次性渲染
                renderer.render(allData);
                requestAnimationFrame(loop);
            };
            loop();
        };
        
        // 初始渲染
        renderer.render(connectors.map(c => ({
            points: c.update(),
            showWaist: c.showWaist
        })));
        
        return {
            connectors,
            track,
            updateAll: () => renderer.render(connectors.map(c => ({
                points: c.update(),
                showWaist: c.showWaist
            }))),
            destroy: () => renderer.destroy()
        };
    },
    
    /**
     * 批量渲染层（共享 canvas）- 整个层应用混合模式
     */
    _createBatchRenderer(type, container, style) {
        if (type === 'canvas') {
            const canvas = document.createElement('canvas');
            // 添加混合模式类 + 基础样式
            canvas.className = 'trapezoid-layer';
            canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0;';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            container.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            
            return {
                render(allData) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    allData.forEach(({ points, showWaist }) => {
                        // 绘制填充区域
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        ctx.lineTo(points[1].x, points[1].y);
                        ctx.lineTo(points[2].x, points[2].y);
                        ctx.lineTo(points[3].x, points[3].y);
                        ctx.closePath();
                        ctx.fillStyle = style.fill;
                        ctx.fill();
                        
                        // 绘制腰线
                        ctx.beginPath();
                        ctx.strokeStyle = style.stroke;
                        ctx.lineWidth = style.strokeWidth;
                        
                        if (showWaist === 'left' || showWaist === 'both') {
                            ctx.moveTo(points[0].x, points[0].y);
                            ctx.lineTo(points[3].x, points[3].y);
                        }
                        if (showWaist === 'right' || showWaist === 'both') {
                            ctx.moveTo(points[1].x, points[1].y);
                            ctx.lineTo(points[2].x, points[2].y);
                        }
                        
                        ctx.stroke();
                    });
                },
                destroy() {
                    canvas.remove();
                }
            };
        }
        
        if (type === 'svg') {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // [迭代-v02] SVG 需用 setAttribute/classList 设置类名，避免 className 赋值导致类失效
            svg.setAttribute('class', 'trapezoid-layer qiexian-svg-layer');
            svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0;';
            container.appendChild(svg);
            
            return {
                render(allData) {
                    svg.innerHTML = '';
                    
                    allData.forEach(({ points, showWaist }) => {
                        // 填充路径
                        const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        fillPath.setAttribute('fill', style.fill);
                        fillPath.setAttribute('d', `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`);
                        svg.appendChild(fillPath);
                        
                        // 腰线路径
                        const strokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        strokePath.setAttribute('fill', 'none');
                        strokePath.setAttribute('stroke', style.stroke);
                        strokePath.setAttribute('stroke-width', style.strokeWidth);
                        
                        let d = '';
                        if (showWaist === 'left' || showWaist === 'both') {
                            d += `M ${points[0].x} ${points[0].y} L ${points[3].x} ${points[3].y} `;
                        }
                        if (showWaist === 'right' || showWaist === 'both') {
                            d += `M ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y}`;
                        }
                        strokePath.setAttribute('d', d.trim());
                        svg.appendChild(strokePath);
                    });
                },
                destroy() {
                    svg.remove();
                }
            };
        }
    },
    
    /**
     * 单个渲染层 - 整个层应用混合模式
     */
    _createRenderer(type, container, style, showWaist = 'both') {
        const s = { 
            fill: 'rgba(233, 69, 96, 0.4)', 
            stroke: '#e94560', 
            strokeWidth: 2,
            ...style 
        };
        
        if (type === 'canvas') {
            const canvas = document.createElement('canvas');
            canvas.className = 'trapezoid-layer';
            canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:0;';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            container.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            
            return {
                render(p, waist = showWaist) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // 绘制填充区域
                    ctx.beginPath();
                    ctx.moveTo(p[0].x, p[0].y);
                    ctx.lineTo(p[1].x, p[1].y);
                    ctx.lineTo(p[2].x, p[2].y);
                    ctx.lineTo(p[3].x, p[3].y);
                    ctx.closePath();
                    ctx.fillStyle = s.fill;
                    ctx.fill();
                    
                    // 绘制腰线
                    ctx.beginPath();
                    ctx.strokeStyle = s.stroke;
                    ctx.lineWidth = s.strokeWidth;
                    
                    if (waist === 'left' || waist === 'both') {
                        ctx.moveTo(p[0].x, p[0].y);
                        ctx.lineTo(p[3].x, p[3].y);
                    }
                    if (waist === 'right' || waist === 'both') {
                        ctx.moveTo(p[1].x, p[1].y);
                        ctx.lineTo(p[2].x, p[2].y);
                    }
                    
                    ctx.stroke();
                },
                destroy() { canvas.remove(); }
            };
        }
        
        if (type === 'svg') {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // [迭代-v02] 统一 SVG 类名设置方式，避免未来切换到单体 SVG 渲染器时同类问题
            svg.setAttribute('class', 'trapezoid-layer');
            svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
            
            const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            fillPath.setAttribute('fill', s.fill);
            svg.appendChild(fillPath);
            
            const strokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            strokePath.setAttribute('fill', 'none');
            strokePath.setAttribute('stroke', s.stroke);
            strokePath.setAttribute('stroke-width', s.strokeWidth);
            svg.appendChild(strokePath);
            
            container.appendChild(svg);
            
            return {
                render(p, waist = showWaist) {
                    fillPath.setAttribute('d', `M ${p[0].x} ${p[0].y} L ${p[1].x} ${p[1].y} L ${p[2].x} ${p[2].y} L ${p[3].x} ${p[3].y} Z`);
                    
                    let d = '';
                    if (waist === 'left' || waist === 'both') {
                        d += `M ${p[0].x} ${p[0].y} L ${p[3].x} ${p[3].y} `;
                    }
                    if (waist === 'right' || waist === 'both') {
                        d += `M ${p[1].x} ${p[1].y} L ${p[2].x} ${p[2].y}`;
                    }
                    strokePath.setAttribute('d', d.trim());
                },
                destroy() { svg.remove(); }
            };
        }
    },
    
    // [迭代-v10] 不同半径圆之间改用真实外公切线，避免切线侵入边界
    toPoints(el1, el2) {
        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();
        
        // 计算两个元素的中心点和半径
        const c1 = { 
            x: r1.left + r1.width/2, 
            y: r1.top + r1.height/2, 
            r: Math.max(r1.width, r1.height) / 2 
        };
        const c2 = { 
            x: r2.left + r2.width/2, 
            y: r2.top + r2.height/2, 
            r: Math.max(r2.width, r2.height) / 2 
        };
        
        // 计算两点之间的向量和角度
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // 避免除以零（两点重合时）
        if (dist < 1) {
            return [
                { x: c1.x - 10, y: c1.y - 10 },
                { x: c1.x + 10, y: c1.y - 10 },
                { x: c2.x + 10, y: c2.y + 10 },
                { x: c2.x - 10, y: c2.y + 10 }
            ];
        }
        
        const radiusDelta = c1.r - c2.r;

        if (Math.abs(radiusDelta) >= dist) {
            const ux = dx / dist;
            const uy = dy / dist;
            const nx = -uy;
            const ny = ux;

            return [
                { x: c1.x + nx * c1.r, y: c1.y + ny * c1.r },
                { x: c1.x - nx * c1.r, y: c1.y - ny * c1.r },
                { x: c2.x - nx * c2.r, y: c2.y - ny * c2.r },
                { x: c2.x + nx * c2.r, y: c2.y + ny * c2.r }
            ];
        }

        const baseAngle = Math.atan2(dy, dx);
        const tangentOffset = Math.acos(radiusDelta / dist);

        const buildTangentPair = (signedOffset) => {
            const tangentAngle = baseAngle + signedOffset;
            const from = {
                x: c1.x + Math.cos(tangentAngle) * c1.r,
                y: c1.y + Math.sin(tangentAngle) * c1.r
            };
            const to = {
                x: c2.x + Math.cos(tangentAngle) * c2.r,
                y: c2.y + Math.sin(tangentAngle) * c2.r
            };
            const cross = dx * (from.y - c1.y) - dy * (from.x - c1.x);

            return { from, to, cross };
        };

        const tangentA = buildTangentPair(tangentOffset);
        const tangentB = buildTangentPair(-tangentOffset);
        const leftTangent = tangentA.cross >= tangentB.cross ? tangentA : tangentB;
        const rightTangent = leftTangent === tangentA ? tangentB : tangentA;

        return [
            leftTangent.from,
            rightTangent.from,
            rightTangent.to,
            leftTangent.to
        ];
    }
};


// ========== 业务代码 ==========

const divA = document.getElementById('zxyuan1');
const divB = document.getElementById('zxyuan2');
const divC = document.getElementById('zxyuan3');

const { track, updateAll } = TrapezoidConnector.batchCreate({
    pairs: [
        { from: divA, to: divB, showWaist: 'left' },    // A-B 只显示左腰
        { from: divB, to: divC, showWaist: 'left' },   // B-C 只显示右腰
        { from: divC, to: divA, showWaist: 'left' }     // C-A 显示双腰（默认）
    ],
    // [迭代-v01] 切线渲染层改为 SVG，便于在 motion.js 里直接做透明度动画
    layer: 'svg',
    style: {
        fill: 'rgba(233, 69, 96, 0)',
        stroke: '#ffffff75',
        strokeWidth: 1,
        
        
    }
});

track();
