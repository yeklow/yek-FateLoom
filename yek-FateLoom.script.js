/* ═══════════════════════════════════════════════════════════
 * yek命运织机 v0.18.1 —— 酒馆助手（Tavern Helper）单文件版
 *
 * 用法：酒馆助手 → 脚本库 → 新建脚本 → 粘贴本文件全部内容 → 保存
 * 依赖：JS-Slash-Runner（酒馆助手）4.x
 *
 * 本文件由 build-script.mjs 自动生成，不要手改。
 * 改完 index.js / style.css 后跑一次：node build-script.mjs
 * ═══════════════════════════════════════════════════════════ */
(function () {
    "use strict";

    // ── 沙箱适配：把父窗口的 document / jQuery / fetch 借过来 ──
    const W = (typeof window !== "undefined" && window.parent && window.parent !== window) ? window.parent : window;
    const DOC = (W && W.document) ? W.document : document;
    const JQ = (W && W.jQuery) ? W.jQuery : (typeof jQuery !== "undefined" ? jQuery : null);
    const document = DOC;
    const jQuery = JQ;
    const fetch = function (url, opt) { return (W && W.fetch ? W.fetch : window.fetch)(url, opt); };
    const getContext = function () {
        try { if (typeof SillyTavern !== "undefined" && SillyTavern.getContext) return SillyTavern.getContext(); } catch (e) {}
        try { if (W.SillyTavern && W.SillyTavern.getContext) return W.SillyTavern.getContext(); } catch (e) {}
        throw new Error("yek命运织机：找不到酒馆上下文，请确认已装酒馆助手（JS-Slash-Runner）");
    };

    // ── 注入样式 ──
    const CSS = "/* AUTO 角色制作 —— 全屏面板样式 */\n#ac-overlay {\n  position: fixed; inset: 0; z-index: 9999;\n  background: rgba(0,0,0,0.55);\n  display: flex; align-items: center; justify-content: center;\n  backdrop-filter: blur(2px);\n}\n#ac-panel {\n  width: min(1440px, 94vw); height: min(900px, 92vh);\n  background: var(--ac-bg); color: var(--ac-text);\n  border: 1px solid var(--ac-border); border-radius: 12px;\n  display: flex; flex-direction: column; overflow: hidden;\n  box-shadow: 0 24px 80px var(--ac-shadow-panel);\n  font-size: 14px;\n}\n#ac-head {\n  display: flex; align-items: center; gap: 12px;\n  padding: 0 18px; height: 56px; flex: 0 0 56px;\n  border-bottom: 1px solid var(--ac-border); background: var(--ac-bg2);\n}\n#ac-head .logo {\n  width: 30px; height: 30px; border-radius: 8px;\n  background: var(--ac-accent); color: var(--ac-accent-ink);\n  display: flex; align-items: center; justify-content: center;\n  font-weight: 700; font-size: 13px;\n}\n#ac-head .title { font-size: 17px; font-weight: 600; flex: 1 1 auto; }\n#ac-head .hbtn {\n  min-width: 32px; height: 32px; padding: 0 10px; border-radius: 8px; cursor: pointer;\n  display: flex; align-items: center; justify-content: center;\n  color: var(--ac-sub); background: transparent; border: 0;\n}\n#ac-head .hbtn:hover { background: var(--ac-hover); color: var(--ac-text); }\n#ac-body { display: flex; flex: 1 1 auto; min-height: 0; }\n#ac-side {\n  width: 240px; flex: 0 0 240px; background: var(--ac-bg2);\n  border-right: 1px solid var(--ac-border); padding: 14px 12px; overflow: auto;\n}\n#ac-side .g { font-size: 11px; color: var(--ac-sub2); padding: 10px 12px 6px; letter-spacing: .5px; }\n#ac-side .it {\n  padding: 10px 14px; border-radius: 8px; cursor: pointer;\n  color: var(--ac-text2); margin-bottom: 2px; user-select: none;\n}\n#ac-side .it:hover { background: var(--ac-card); }\n#ac-side .it.on { background: var(--ac-accent); color: var(--ac-accent-ink); font-weight: 600; }\n#ac-main { flex: 1 1 auto; overflow: auto; padding: 22px 26px 40px; }\n#ac-main h2 { font-size: 22px; margin: 0 0 18px; font-weight: 600; }\n.ac-card {\n  background: var(--ac-card); border: 1px solid var(--ac-border); border-radius: 10px;\n  padding: 18px 20px; margin-bottom: 16px;\n}\n.ac-card > .h {\n  display: flex; align-items: center; gap: 8px;\n  font-size: 15px; font-weight: 600; margin-bottom: 14px;\n}\n.ac-card > .h .i { margin-left: auto; color: var(--ac-sub2); font-size: 13px; }\n.ac-f { margin-bottom: 14px; }\n.ac-f:last-child { margin-bottom: 0; }\n.ac-f > label { display: block; font-size: 12px; color: var(--ac-sub3); margin-bottom: 6px; }\n.ac-f .hint { font-size: 12px; color: var(--ac-sub2); margin-top: 6px; line-height: 1.5; }\n#ac-panel input[type=text], #ac-panel select, #ac-panel textarea {\n  width: 100%; box-sizing: border-box;\n  background: var(--ac-input); border: 1px solid var(--ac-border); border-radius: 6px;\n  padding: 9px 11px; color: var(--ac-text); font-size: 13px; font-family: inherit;\n}\n#ac-panel textarea { resize: vertical; min-height: 78px; line-height: 1.55; }\n#ac-panel input:focus, #ac-panel select:focus, #ac-panel textarea:focus {\n  outline: none; border-color: var(--ac-accent);\n}\n.ac-seg { display: flex; gap: 4px; background: var(--ac-input); border-radius: 8px; padding: 4px; border: 1px solid var(--ac-border); }\n.ac-seg > div {\n  flex: 1 1 0; text-align: center; padding: 8px 10px; border-radius: 6px;\n  cursor: pointer; font-size: 13px; color: var(--ac-sub);\n}\n.ac-seg > div.on { background: var(--ac-accent); color: var(--ac-accent-ink); font-weight: 600; }\n.ac-btn {\n  display: inline-flex; align-items: center; gap: 7px;\n  padding: 9px 16px; border-radius: 8px; cursor: pointer;\n  border: 1px solid var(--ac-border); background: var(--ac-hover); color: var(--ac-text);\n  font-size: 13px; font-family: inherit;\n}\n.ac-btn:hover { background: var(--ac-hover2); }\n.ac-btn.pri { background: var(--ac-accent); color: var(--ac-accent-ink); border-color: var(--ac-accent); font-weight: 600; }\n.ac-btn.pri:hover { background: var(--ac-accent-hover); }\n.ac-btn:disabled { opacity: 0.45; cursor: not-allowed; }\n.ac-btn.big { width: 100%; justify-content: center; padding: 12px; font-size: 14px; }\n.ac-msg { min-height: 20px; font-size: 13px; color: var(--ac-sub); margin-top: 10px; }\n.ac-msg.err { color: var(--ac-err); }\n.ac-msg.ok { color: var(--ac-ok); }\n.ac-pos { font-size: 13px; line-height: 1.9; color: var(--ac-text2); }\n.ac-pos b { color: var(--ac-accent); font-weight: 600; }\n.ac-ec { border: 1px solid var(--ac-border); border-radius: 8px; padding: 12px 14px; margin-top: 10px; background: var(--ac-bg2); }\n.ac-ec .h { display: flex; align-items: center; gap: 9px; font-size: 14px; font-weight: 600; }\n.ac-ec .h .len { margin-left: auto; color: var(--ac-sub2); font-size: 12px; font-weight: 400; }\n.ac-ec textarea { margin-top: 10px; min-height: 120px; font-size: 12.5px; }\n.ac-ec .kw { font-size: 12px; color: var(--ac-sub2); margin-top: 6px; }\n.ac-warn { font-size: 13px; color: var(--ac-warncolor); line-height: 1.6; margin: 4px 0; }\n.ac-list { max-height: 320px; overflow: auto; border: 1px solid var(--ac-border); border-radius: 8px; }\n.ac-row {\n  display: flex; gap: 10px; align-items: center; padding: 8px 12px;\n  border-bottom: 1px solid var(--ac-border-soft); cursor: pointer; font-size: 13px;\n}\n.ac-row:last-child { border-bottom: 0; }\n.ac-row:hover { background: var(--ac-card); }\n.ac-row .c { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.ac-row .dot { color: var(--ac-accent); }\n.ac-row .n { color: var(--ac-sub2); font-size: 12px; }\n.ac-view {\n  margin-top: 12px; max-height: 300px; overflow: auto;\n  white-space: pre-wrap; font-size: 12.5px; line-height: 1.65;\n  border: 1px solid var(--ac-border); border-radius: 8px; padding: 12px; background: var(--ac-input);\n}\n.ac-stat { display: flex; gap: 12px; flex-wrap: wrap; }\n.ac-stat > div {\n  flex: 1 1 150px; background: var(--ac-bg2); border: 1px solid var(--ac-border);\n  border-radius: 8px; padding: 14px 16px;\n}\n.ac-stat .k { font-size: 12px; color: var(--ac-sub2); margin-bottom: 6px; }\n.ac-stat .v { font-size: 20px; font-weight: 600; color: var(--ac-accent); }\n.ac-bk { display: flex; gap: 10px; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--ac-border-soft); font-size: 13px; }\n.ac-bk .t { flex: 1 1 auto; color: var(--ac-text2); }\n.ac-empty { color: var(--ac-sub2); font-size: 13px; padding: 10px 0; }\n/* 专门的关闭按钮 */\n#ac-close {\n  border: 1px solid var(--ac-border);\n  background: var(--ac-card);\n  width: auto;\n  padding: 0 12px;\n  gap: 6px;\n  font-size: 13px;\n}\n#ac-close span { font-size: 13px; }\n#ac-close:hover {\n  background: var(--ac-accent);\n  color: var(--ac-accent-ink);\n  border-color: var(--ac-accent);\n}\n/* 遮罩不再响应点击关闭 */\n#ac-overlay { cursor: default; }\n/* 结构化编辑器的分组卡片 */\n.ac-sub { border: 1px solid var(--ac-border); border-radius: 8px; padding: 12px 14px; margin: 10px 0; background: var(--ac-bg2); }\n.ac-sub-h { font-size: 13px; font-weight: 600; color: var(--ac-accent); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }\n.ac-sub-h .i { margin-left: auto; color: var(--ac-sub2); font-size: 12px; font-weight: 400; }\n.ac-row2 { display: flex; gap: 12px; }\n.ac-row2 > .ac-f { flex: 1 1 0; min-width: 0; }\n.ac-draft { display: flex; align-items: center; gap: 8px; padding: 7px 0; border-bottom: 1px solid var(--ac-border-soft); font-size: 13px; }\n.ac-draft .nm { flex: 1 1 auto; }\n.ac-draft .tag { font-size: 11px; color: var(--ac-accent-ink); background: var(--ac-accent); border-radius: 4px; padding: 1px 6px; }\n/* 右上角浮动提示（对齐数据库的样式） */\n#ac-toasts {\n  position: fixed; top: 64px; right: 16px; z-index: 9998;\n  display: flex; flex-direction: column; gap: 8px;\n  pointer-events: none;\n}\n.ac-toast {\n  pointer-events: auto;\n  display: flex; align-items: center; gap: 10px;\n  background: #f4f6f6; color: var(--ac-bg2);\n  border-radius: 10px; padding: 12px 14px;\n  min-width: 300px; max-width: 390px;\n  box-shadow: 0 8px 28px rgba(0,0,0,0.35);\n  animation: ac-toast-in .22s ease-out;\n}\n.ac-toast.out { opacity: 0; transform: translateY(-6px); transition: all .2s; }\n.ac-toast .ico {\n  width: 34px; height: 34px; border-radius: 8px; flex: 0 0 auto;\n  background: var(--ac-accent); color: var(--ac-accent-ink);\n  display: flex; align-items: center; justify-content: center;\n  font-weight: 700; font-size: 12px;\n}\n.ac-toast .tx { flex: 1 1 auto; min-width: 0; }\n.ac-toast .t { font-size: 13px; font-weight: 600; }\n.ac-toast .d { font-size: 12px; color: var(--ac-sub2); margin-top: 2px; line-height: 1.45; }\n.ac-toast .go {\n  flex: 0 0 auto; border: 1px solid #cfd8d8; background: #fff; color: var(--ac-bg2);\n  border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer;\n}\n.ac-toast .go:hover { background: var(--ac-accent); border-color: var(--ac-accent); }\n.ac-toast .x {\n  flex: 0 0 auto; border: 0; background: transparent; color: #8a9797;\n  font-size: 17px; line-height: 1; cursor: pointer; padding: 0 2px;\n}\n@keyframes ac-toast-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }\n/* 开关行 */\n.ac-sw {\n  display: flex; align-items: center; gap: 9px;\n  cursor: pointer; font-size: 13.5px; color: var(--ac-text);\n  padding: 4px 0; user-select: none;\n}\n.ac-sw input[type=checkbox] {\n  width: 16px; height: 16px; flex: 0 0 auto;\n  accent-color: var(--ac-accent); cursor: pointer;\n}\n/* 字数检查行 */\n.ac-len { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--ac-border-soft); font-size: 13px; }\n.ac-len:last-child { border-bottom: 0; }\n.ac-len .nm { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.ac-len .v { color: var(--ac-accent); font-weight: 600; }\n.ac-len .t { color: var(--ac-sub2); font-size: 12px; }\n.ac-len .s { min-width: 34px; text-align: right; color: var(--ac-ok); font-size: 12px; }\n.ac-len.bad .v { color: var(--ac-warncolor); }\n.ac-len.bad .s { color: var(--ac-warncolor); }\n/* 性癖池 */\n.ac-xp { border: 1px solid var(--ac-border); border-radius: 8px; background: var(--ac-bg2); padding: 10px 12px; margin-top: 12px; }\n.ac-xp > summary {\n  cursor: pointer; font-size: 13px; font-weight: 600; color: var(--ac-accent);\n  list-style: none; display: flex; align-items: center; gap: 8px;\n}\n.ac-xp > summary::-webkit-details-marker { display: none; }\n.ac-xp > summary:before { content: '▸'; }\n.ac-xp[open] > summary:before { content: '▾'; }\n.ac-xp .cnt { font-weight: 400; color: var(--ac-sub2); font-size: 12px; }\n.ac-xpg { margin-top: 10px; }\n.ac-xpg-h { font-size: 12px; color: var(--ac-sub3); margin-bottom: 6px; }\n.ac-xpi { display: flex; flex-wrap: wrap; gap: 6px 12px; }\n.ac-xpc {\n  display: flex; align-items: center; gap: 5px;\n  font-size: 12.5px; color: var(--ac-text2); cursor: pointer; user-select: none;\n}\n.ac-xpc input { width: 14px; height: 14px; accent-color: var(--ac-accent); cursor: pointer; }\n/* 世界书选择行 */\n.ac-bookrow { display: flex; gap: 8px; align-items: center; }\n.ac-bookrow > select { flex: 1 1 auto; min-width: 0; }\n.ac-bookrow > .ac-btn { flex: 0 0 auto; padding: 9px 14px; }\n.ac-f .cnt { font-weight: 400; color: var(--ac-sub2); font-size: 12px; }\n#ac-bookstate b { color: var(--ac-accent); }\n/* 未命名标签 */\n.ac-row .tag, .ac-draft .tag {\n  font-size: 11px; border-radius: 4px; padding: 1px 6px;\n  background: var(--ac-tag); color: var(--ac-tag-ink); font-weight: 600;\n}\n.ac-draft .tag { background: var(--ac-accent); color: var(--ac-accent-ink); }\n/* 蓝色：出场时机 */\n.ac-blue { border-color: #4a90d9; }\n.ac-blue > .h { color: #7fb7ea; }\n.ac-blue .bdot {\n  width: 9px; height: 9px; border-radius: 50%;\n  background: #4a90d9; display: inline-block; margin-right: 8px;\n  box-shadow: 0 0 8px rgba(74,144,217,0.7);\n}\n/* 进行中 / 完成状态 */\n.ac-toast.working { border-left: 3px solid var(--ac-accent); }\n.ac-toast .ico.spin { animation: ac-pulse 1.1s ease-in-out infinite; }\n@keyframes ac-pulse { 0%,100% { opacity: .4; } 50% { opacity: 1; } }\n.ac-toast.done { background: #eaf7f0; border-left: 3px solid var(--ac-ok); }\n.ac-toast.done .ico { background: var(--ac-ok); }\n/* ── 表单修正 ─────────────────────────────────── */\n/* 数字输入框：之前完全没样式，退化成浏览器默认小方块 */\n#ac-panel input[type=number] {\n  width: 120px; box-sizing: border-box;\n  background: var(--ac-input); border: 1px solid var(--ac-border); border-radius: 6px;\n  padding: 9px 11px; color: var(--ac-text); font-size: 13px; font-family: inherit;\n}\n#ac-panel input[type=number]:focus { outline: none; border-color: var(--ac-accent2); }\n\n/* 表单项限宽，避免在宽面板里被拉成一条 */\n.ac-f { max-width: 660px; }\n.ac-f > input[type=text], .ac-f > textarea, .ac-f > select { max-width: 660px; }\n\n/* 两列布局，参数不至于一列堆到底 */\n.ac-grid2 {\n  display: grid; grid-template-columns: 1fr 1fr;\n  gap: 4px 28px; max-width: 660px; margin-bottom: 4px;\n}\n.ac-grid2 .ac-f { margin-bottom: 10px; }\n\n/* 真正的开关 */\n.ac-sw { display: inline-flex; align-items: center; cursor: pointer; padding: 2px 0; }\n.ac-sw input { position: absolute; opacity: 0; width: 0; height: 0; }\n.ac-sw span:empty {\n  position: relative; display: block; width: 44px; height: 24px;\n  border-radius: 12px; background: var(--ac-hover); border: 1px solid var(--ac-border);\n  transition: background .18s, border-color .18s;\n}\n.ac-sw span:empty::after {\n  content: ''; position: absolute; top: 3px; left: 3px;\n  width: 16px; height: 16px; border-radius: 50%;\n  background: var(--ac-sub); transition: left .18s, background .18s;\n}\n.ac-sw input:checked + span:empty { background: var(--ac-accent2); border-color: var(--ac-accent2); }\n.ac-sw input:checked + span:empty::after { left: 23px; background: var(--ac-accent-ink); }\n\n/* 分段开关也限一下宽 */\n.ac-f > .ac-seg { max-width: 320px; }\n/* 内容列居中限宽：全屏面板太宽，卡片拉满会显得空 */\n#ac-main > * { max-width: 1120px; margin-left: auto; margin-right: auto; }\n#ac-panel h2 { max-width: 1120px; }\n/* 导演提示：和普通提示区分开 */\n.ac-toast.dir { border-left: 3px solid #a78bfa; }\n.ac-toast.dir .ico { background: #a78bfa; color: #1a1024; }\n.ac-toast.dir .t { color: #c4b5fd; }\n.ac-toast.dir.mild { border-left-color: #7dd3fc; }\n.ac-toast.dir.mild .ico { background: #7dd3fc; color: #0c1a20; }\n.ac-toast.dir.mild .t { color: #bae6fd; }\n/* 带文字的开关标签：正常排版，不当作圆钮 */\n.ac-sw span:not(:empty) { display: inline; width: auto; height: auto; background: none; border: none; }\n.ac-sw span:not(:empty)::after { content: none; }\n.ac-sw { gap: 8px; flex-wrap: wrap; }\n/* 带文字的老式开关：把复选框显示出来，不要藏 */\n.ac-sw:has(> span:not(:empty)) input[type=checkbox] {\n  position: static; opacity: 1; width: 16px; height: 16px; margin: 0 2px 0 0;\n  accent-color: var(--ac-accent2); cursor: pointer;\n}\n.ac-sw:has(> span:not(:empty)) { align-items: center; }\n/* ═══ 主页面浮动小面板 ═══ */\n#ac-mini {\n  position: fixed; right: 16px; bottom: 96px; z-index: 9998;\n  display: flex; flex-direction: column; align-items: flex-end; gap: 8px;\n  font-family: inherit; font-size: 13px;\n}\n#ac-mini-btn {\n  width: 46px; height: 46px; border-radius: 50%;\n  background: var(--ac-accent); color: var(--ac-accent-ink);\n  display: flex; align-items: center; justify-content: center;\n  cursor: pointer; position: relative; font-size: 16px;\n  box-shadow: 0 6px 22px var(--ac-shadow-panel);\n  transition: transform .12s ease;\n}\n#ac-mini-btn:hover { transform: scale(1.06); }\n#ac-mini-count {\n  position: absolute; top: -5px; right: -5px;\n  min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px;\n  background: var(--ac-border); color: var(--ac-text); font-size: 11px; font-weight: 600;\n  display: flex; align-items: center; justify-content: center;\n  border: 1px solid var(--ac-bg2);\n}\n#ac-mini-body {\n  width: 290px; max-height: 72vh; overflow: hidden;\n  background: var(--ac-bg); color: var(--ac-text);\n  border: 1px solid var(--ac-border); border-radius: 10px;\n  box-shadow: 0 18px 52px var(--ac-shadow-panel);\n  display: flex; flex-direction: column;\n}\n/* 除角色清单外其它区块高度固定；角色清单自己滚动，保证底部按钮永远可见 */\n#ac-mini-body > div:not(.mini-l) { flex-shrink: 0; }\n#ac-mini-body > #ac-mini-dir { min-height: 0; max-height: 28vh; overflow-y: auto; }\n#ac-mini-body .mini-h {\n  display: flex; align-items: center; gap: 8px;\n  padding: 10px 12px; border-bottom: 1px solid var(--ac-border); background: var(--ac-bg2);\n  font-weight: 600; font-size: 13px;\n}\n#ac-mini-body .mini-h b { margin-left: auto; color: var(--ac-accent2); font-weight: 600; font-size: 12px; }\n#ac-mini-body .mini-h button {\n  background: none; border: 0; color: var(--ac-sub); cursor: pointer; font-size: 18px; line-height: 1; padding: 0 2px;\n}\n#ac-mini-body .mini-h button:hover { color: var(--ac-text); }\n#ac-mini-body .mini-l { flex: 1 1 auto; min-height: 0; overflow-y: auto; max-height: none; }\n#ac-mini-body .mini-r {\n  display: flex; align-items: center; gap: 8px;\n  padding: 7px 12px; border-bottom: 1px solid var(--ac-card); cursor: pointer; margin: 0;\n}\n#ac-mini-body .mini-r:hover { background: var(--ac-card); }\n#ac-mini-body .mini-r input[type=checkbox] { accent-color: var(--ac-accent2); margin: 0; cursor: pointer; }\n#ac-mini-body .mini-n { flex: 1 1 auto; }\n#ac-mini-body .mini-t { font-size: 11px; color: var(--ac-sub2); }\n#ac-mini-body .mini-e { padding: 16px 12px; color: var(--ac-sub2); line-height: 1.7; }\n#ac-mini-body .mini-f {\n  display: flex; gap: 6px; padding: 10px 12px; border-top: 1px solid var(--ac-border); background: var(--ac-bg2);\n}\n#ac-mini-body .mini-f .ac-btn { flex: 1 1 auto; padding: 7px 8px; font-size: 12px; }\n/* 小面板里每行的「指定」按钮 */\n#ac-mini-body .mini-pin {\n  background: var(--ac-border); border: 0; color: var(--ac-sub); cursor: pointer;\n  font-size: 11px; padding: 2px 7px; border-radius: 5px; line-height: 1.5;\n  margin: 0 6px; flex: 0 0 auto;\n}\n#ac-mini-body .mini-pin:hover { background: var(--ac-hover2); color: var(--ac-text); }\n#ac-mini-body .mini-r { display: flex; align-items: center; gap: 6px; }\n/* 标题上的版本号 */\n#ac-head .title .ver {\n  font-size: 11px; color: var(--ac-sub3); font-weight: 400;\n  margin-left: 7px; letter-spacing: 0.3px;\n}\n/* 小面板里的出场频率按钮 */\n#ac-mini-body .mini-freq:hover { filter: brightness(1.15); }\n/* 通用输入框（以前没样式，深色面板里是浏览器默认白底，很难看） */\n.ac-input {\n  background: var(--ac-input2);\n  border: 1px solid var(--ac-input-border);\n  border-radius: 8px;\n  color: var(--ac-text);\n  padding: 8px 10px;\n  font-size: 13px;\n  font-family: inherit;\n  outline: none;\n  transition: border-color 0.15s, background 0.15s;\n}\n.ac-input:focus { border-color: var(--ac-accent2); background: var(--ac-input2); }\n.ac-input::placeholder { color: var(--ac-sub2); }\n/* 当前剧情时间 */\n#ac-cs-time {\n  font-size: 14px;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.2px;\n}\n#ac-cs-time-note { color: #7fd6b0; }\n/* 顶栏按钮不换行（按钮文字挤压时会竖排） */\n#ac-head .hbtn { white-space: nowrap; flex: 0 0 auto; }\n#ac-head .title { min-width: 0; }\n\n/* ── 主题变量（默认：薄荷；由扩展 applyTheme 动态覆盖）── */\n#ac-overlay, #ac-mini {\n  --ac-bg: #1e2426; --ac-bg2: #191e20; --ac-card: #232a2c;\n  --ac-hover: #2a3234; --ac-hover2: #333c3f;\n  --ac-border: #2f3739; --ac-border-soft: #262d2f;\n  --ac-text: #dfe6e6; --ac-text2: #c2d0d0;\n  --ac-sub: #9fb0b0; --ac-sub2: #6f8080; --ac-sub3: #8fa0a0;\n  --ac-accent: #a9e5d0; --ac-accent-hover: #b8efdd; --ac-accent-ink: #10201c; --ac-accent2: #8fd9b6;\n  --ac-input: #14181a; --ac-input2: #1a2123; --ac-input-border: #333d3f;\n  --ac-tag: #ffd479; --ac-tag-ink: #3a2a00;\n  --ac-ok: #7bd88f; --ac-err: #ff8f8f; --ac-warncolor: #e8c07b;\n  --ac-shadow-panel: rgba(0,0,0,0.6);\n}\n\n\n/* Galgame 重roll 等待动画 */\n@keyframes ac-gal-rot { to { transform: rotate(360deg); } }\n@keyframes ac-gal-blink { 0%, 100% { opacity: 1; } 50% { opacity: .15; } }\n.ac-gal-wait { display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 15px; color: #075985; padding: 8px 4px; }\n.ac-gal-spin { width: 20px; height: 20px; border: 3px solid rgba(56,189,248,.25); border-top-color: #38bdf8; border-radius: 50%; animation: ac-gal-rot .8s linear infinite; flex: 0 0 auto; }\n.ac-gal-stream { font-size: 15px; line-height: 1.9; color: #1e293b; white-space: pre-wrap; word-break: break-word; text-align: left; }\n.ac-gal-cursor { color: #38bdf8; animation: ac-gal-blink 1s step-start infinite; margin-left: 2px; }\n\n\n/* 聊天里隐藏台词说话人标注（只隐藏标记本身） */\n.ac-hidden-spk { display: none !important; }\n/* 诊断面板 */\n.ac-diag { display: none; position: fixed; top: 60px; right: 18px; width: 460px; max-height: 78vh; z-index: 2147483600; background: #14161f; color: #c8d0e0; border: 1px solid #3a4460; border-radius: 10px; padding: 10px; box-shadow: 0 12px 36px rgba(0,0,0,.55); font-family: ui-monospace, Consolas, monospace; font-size: 12px; }\n.ac-diag.on { display: flex; flex-direction: column; }\n.ac-diag-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px; color: #9fb3d9; }\n.ac-diag-head button { margin-left: 6px; padding: 3px 10px; border-radius: 6px; border: 1px solid #3a4460; background: #1d2233; color: #c8d0e0; cursor: pointer; font-size: 12px; }\n.ac-diag-head button:hover { background: #2a3350; }\n.ac-diag-body { margin: 0; white-space: pre-wrap; word-break: break-all; overflow: auto; flex: 1 1 auto; }\n\n/* ═══════════════════════════════════════════════════════════\n   移动端完全适配\n   - 面板：全屏 + 顶部栏紧凑 + 左侧导航变横向 tab 条\n   - Galgame：安全区、字号、按钮、立绘、输入框\n   - 小面板 / 诊断面板：贴边、可滚动\n   ═══════════════════════════════════════════════════════════ */\n#ac-gal-overlay { height: 100vh; height: 100dvh; }\n\n@media (max-width: 900px) {\n  /* ── 主面板：全屏 ── */\n  #ac-overlay { align-items: stretch; justify-content: stretch; }\n  #ac-panel {\n    width: 100vw; max-width: 100vw; height: 100vh; height: 100dvh;\n    border-radius: 0; border: 0;\n    padding-bottom: env(safe-area-inset-bottom);\n  }\n  #ac-head {\n    height: 50px; flex: 0 0 50px; padding: 0 10px; gap: 6px;\n    padding-top: env(safe-area-inset-top);\n  }\n  #ac-head .logo { width: 26px; height: 26px; border-radius: 7px; font-size: 12px; }\n  #ac-head .title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n  #ac-head .title .ver { font-size: 10px; }\n  #ac-head .hbtn { min-width: 30px; height: 30px; padding: 0 8px; font-size: 13px; }\n  #ac-head .hbtn span { display: none; }   /* 手机上只留图标，避免顶栏挤爆 */\n  #ac-close { padding: 0 9px; }\n  #ac-close span { display: none; }\n  #ac-body { flex-direction: column; min-height: 0; }\n  #ac-side {\n    width: auto !important; flex: 0 0 auto; border-right: 0;\n    border-bottom: 1px solid var(--ac-border);\n    display: flex; align-items: center; gap: 6px;\n    padding: 8px 10px; overflow-x: auto; overflow-y: hidden; white-space: nowrap;\n    -webkit-overflow-scrolling: touch; scrollbar-width: none;\n  }\n  #ac-side::-webkit-scrollbar { display: none; }\n  #ac-side .g { display: none; }\n  #ac-side .it {\n    flex: 0 0 auto; padding: 7px 13px; font-size: 13px; border-radius: 999px;\n    background: var(--ac-input); margin-bottom: 0; white-space: nowrap;\n  }\n  #ac-side .it.on { background: var(--ac-accent); color: var(--ac-accent-ink); }\n  #ac-main {\n    padding: 12px 12px calc(28px + env(safe-area-inset-bottom));\n    font-size: 14px; -webkit-overflow-scrolling: touch;\n  }\n  #ac-main h2 { font-size: 18px; margin: 0 0 12px; }\n  .ac-card { padding: 12px; margin-bottom: 10px; border-radius: 10px; }\n  .ac-card > .h { font-size: 14px; margin-bottom: 10px; flex-wrap: wrap; gap: 6px; }\n  .ac-card > .h .i { margin-left: 0; width: 100%; }\n  .ac-row2 { flex-direction: column; gap: 8px; }\n  .ac-stat { gap: 8px; }\n  .ac-stat > div { flex: 1 1 120px; padding: 10px 12px; }\n  .ac-stat .v { font-size: 17px; }\n  .ac-btn { padding: 9px 13px; font-size: 13px; }\n  .ac-btn.big { padding: 12px; }\n  .ac-seg { flex-wrap: wrap; }\n  .ac-seg > div { flex: 1 1 30%; padding: 7px 6px; font-size: 12px; }\n  .ac-list { max-height: 38vh; }\n  .ac-view { max-height: 34vh; }\n  .ac-bk { flex-wrap: wrap; gap: 6px; }\n  .ac-bk .t { flex: 1 1 100%; }\n  .ac-bk .ac-btn { margin-left: auto; }\n  /* iOS 聚焦输入框会放大页面：字号至少 16px */\n  #ac-panel input[type=text], #ac-panel input[type=number], #ac-panel select, #ac-panel textarea,\n  #ac-panel .ac-input { font-size: 16px; }\n  #ac-panel textarea { min-height: 100px; }\n  /* 面板内的横向编辑器控件不要溢出 */\n  #ac-main img { max-width: 100%; }\n  #ac-main table { display: block; overflow-x: auto; }\n\n  /* ── 浮动小面板 ── */\n  #ac-mini { right: 12px; bottom: calc(78px + env(safe-area-inset-bottom)); }\n  #ac-mini-btn { width: 46px; height: 46px; font-size: 17px; }\n  #ac-mini-body { width: min(92vw, 360px); max-height: 58vh; }\n  #ac-mini-body > #ac-mini-dir { max-height: 22vh; }\n\n  /* ── Galgame 全屏 ── */\n  #ac-gal-overlay { padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }\n  #ac-gal-top { flex-wrap: wrap; gap: 4px; padding: 6px 8px !important; }\n  #ac-gal-top button, #ac-gal-top .ac-gal-tbtn { font-size: 12px !important; padding: 6px 9px !important; height: auto !important; }\n  #ac-gal-top .ac-gal-mode { font-size: 11px !important; }\n  #ac-gal-text { font-size: 15px !important; line-height: 1.8 !important; padding: 12px 14px !important; }\n  #ac-gal-name, #ac-gal-text .ac-gal-name { font-size: 13px !important; padding: 5px 12px !important; }\n  #ac-gal-choice button { font-size: 14px; padding: 11px 13px; line-height: 1.6; }\n  #ac-gal-input { flex-wrap: wrap; }\n  #ac-gal-input input { font-size: 16px; padding: 10px 12px; min-width: 0; }\n  #ac-gal-input button { padding: 10px 16px; font-size: 14px; }\n  #ac-gal-hint, #ac-gal-sprite-hint { font-size: 12px !important; padding: 0 10px 8px !important; }\n  #ac-gal-prev, #ac-gal-stop, #ac-gal-close, #ac-gal-backlog-btn { font-size: 12px !important; padding: 6px 10px !important; }\n  #ac-gal-sprites .ac-gal-sprite { max-width: 48vw; }\n  #ac-gal-sprites .ac-gal-sprite.side { max-width: 34vw; }\n  /* 手机上立绘：按宽度自适应、底部对齐，保证头部露在文字框上方 */\n  #ac-gal-sprites .ac-gal-sprite { object-position: bottom center !important; }\n  #ac-gal-sprites .ac-gal-sprite.main {\n    height: auto !important; max-height: 94vh !important;\n    max-width: 84vw !important; bottom: 0 !important;\n  }\n  #ac-gal-sprites .ac-gal-sprite.side {\n    height: auto !important; max-height: 88vh !important;\n    max-width: 48vw !important; bottom: 0 !important;\n  }\n  /* 手机上长段落文字框限高，保证立绘露出来；文字框内部可滑动 */\n  #ac-gal-text {\n    max-height: 38vh !important; overflow-y: auto !important;\n    -webkit-overflow-scrolling: touch; overscroll-behavior: contain;\n    scrollbar-width: thin;\n  }\n  #ac-gal-choice { max-height: 32vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }\n  #ac-gal-backlog { width: 94vw !important; max-height: 76vh !important; }\n  #ac-gal-backlog-list { font-size: 13px !important; }\n\n  /* ── 诊断面板 ── */\n  .ac-diag { top: 42px; right: 2vw; width: 96vw; max-height: 76vh; font-size: 11px; }\n\n  /* ── 通用提示条 ── */\n  #ac-toasts { left: 10px; right: 10px; width: auto; }\n  #ac-toasts > * { max-width: 100%; }\n}\n\n/* 超窄屏（小手机 / 分屏）再压缩一点 */\n@media (max-width: 380px) {\n  #ac-head .title { font-size: 13px; }\n  #ac-side .it { padding: 6px 10px; font-size: 12px; }\n  #ac-gal-text { font-size: 14px !important; }\n  #ac-gal-choice button { font-size: 13px; }\n}\n";
    (function injectCss() {
        const id = "ac-style-script";
        const old = DOC.getElementById(id);
        if (old) old.remove();
        const st = DOC.createElement("style");
        st.id = id;
        st.textContent = CSS;
        (DOC.head || DOC.documentElement).appendChild(st);
    })();

/**
 * FateLoom 说话人识别引擎 V2（纯函数，无浏览器/酒馆依赖）
 *
 * 设计：Pass1 安全扩充未知名 → Pass2 逐段「候选打分 + 阈值」判定。
 * 宁可返回空（当旁白）也不标错。
 *
 * 用法（Node 测试 / 扩展内）：
 *   import { galV2Resolve } from './speaker-engine.js';
 *   const speakers = galV2Resolve(segments, [{ name, key, user }]);
 */
// ══════════════════════════════════════════════════════════════════
// 说话人识别 V2（与 Gemini 共同设计）：
//   Pass1 安全扩充未知名 → Pass2 逐段「候选打分 + 阈值」判定
//   宁可返回空（旁白）也不标错
// ══════════════════════════════════════════════════════════════════
function galV2EscapeReg(s) {
    return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const GALV2_PREP_BEFORE = /(?:对|向|往|朝|跟|同|与|和|给|替|为|被|让|叫|使|把|将|从|自|由|趁|冲|对着|向着|朝着|看着|望着|盯着|挽着|抱着|搂着|拉着|牵着|推着|扶着|靠在|扑进|扑向|转向|看向|望向|走向|回到|留在|生完|生下|生了|照顾|心疼|喜欢|讨厌|害得|帮|陪|带|找|哄|骗|亲|吻|摸|揉|拍|打|掐|咬)\s*$/;
const GALV2_POSSESSIVE_AFTER = /^(?:的|地|得|之|身上|手里|怀里|眼里|嘴里|口中|脸上|耳边|脚下|面前|身后|身旁|身边|那边|这里|那里|眉头|眼角|唇角|指尖|手腕|肩膀|胸口|腰间|发梢|呼吸|声音|目光|视线|脸色|神色|表情|动作|身子|身体)/;
const GALV2_SPEAK_VERBS = /(?:说道|问道|笑道|喊道|叫道|骂道|哭道|应道|答道|回道|叹道|念道|喝道|吼道|催促道|提醒道|解释道|补充道|打断道|反问道|追问道|质问道|试探道|附和道|安慰道|叮嘱道|吩咐道|命令道|哀求道|恳求道|撒娇道|娇嗔道|呢喃道|喃喃道|咕哝道|嘟囔道|小声说|低声说|轻声说|柔声说|冷声说|沉声说|大声说|笑着说|哭着说|开口说|接着说|继续说|小声问|低声问|轻声问|开口问|低声道|轻声道|柔声道|小声道|冷声道|沉声道|开口道|缓声道|哑声道|颤声道|哽咽道|喘息道|低语|轻语|喃喃|呢喃|开口|发问|反问|追问|回答|回应|出声|启唇|张口)/;
const GALV2_SELF_FOLLOW = /^(?:已经|早就|才|还|也|就|便|要|想|愿意|不|没|未|别|不会|会|能|可以|敢|先|再|又|都|只|只是|一直|正在|正|刚|刚刚|乖乖|明明|真的|好|最|自己|把|将|给|替|帮|陪|跟|听|看|知道|觉得|以为|喜欢|讨厌|怕|害羞|难受|想要)/;
const GALV2_KINSHIP_PREFIX = /^(?:爸爸|妈妈|爹|娘|哥哥|姐姐|弟弟|妹妹|主人|先生|老师|师父|师尊|师兄|师姐|夫君|相公|老婆|老公|媳妇|大人|殿下|陛下)\s*[，,、～~]?\s*/;
const GALV2_INVALID_WORDS = new Set(['自己', '咱们', '大家', '众人', '有人', '没人', '别人', '旁人', '男人', '女人', '少女', '少年', '女孩', '男孩', '先生', '小姐', '夫人', '太太', '妈妈', '爸爸', '哥哥', '姐姐', '妹妹', '弟弟', '主人', '老师', '医生', '护士', '起身', '抬头', '低头', '转头', '转身', '回身', '伸手', '抬手', '开口', '闭嘴', '微笑', '苦笑', '冷笑', '轻笑', '叹气', '皱眉', '挑眉', '眨眼', '闭眼', '垂眸', '抬眸', '凝视', '注视', '打量', '目光', '视线', '眼神', '脸色', '神色', '表情', '声音', '语气', '呼吸', '气息', '手指', '指尖', '手掌', '手腕', '手臂', '肩膀', '胸口', '后背', '腰肢', '大腿', '小腿', '脚踝', '脸颊', '耳垂', '嘴唇', '唇角', '眼角', '眉头', '额头', '头发', '发丝', '身子', '身体', '衣服', '衣角', '裙摆', '袖口', '领口', '被子', '床单', '枕头', '房间', '客厅', '卧室', '浴室', '厨房', '空气', '阳光', '月光', '灯光', '阴影', '沉默', '片刻', '半晌', '一会儿', '突然', '忽然', '顿时', '随即', '随后', '接着', '然后', '于是', '终于', '缓缓', '慢慢', '轻轻', '微微', '紧紧', '死死', '暗暗', '悄悄', '默默', '静静', '亮面', '皮革']);
const GALV2_INVALID_SUFFIX = /(?:里|外|上|下|前|后|中|内|间|边|旁|侧|处|面|方|头|尾|尖|角|口|眼|手|脚|腿|腰|背|胸|肩|脸|唇|齿|舌|发|眉|鼻|耳|心|身|体|衣|裙|裤|鞋|袜|帽|被|床|桌|椅|门|窗|墙|地|房|屋|室|厅|院|楼|车|路|街|水|火|风|雨|雪|光|影|声|音|色|味|气|感|意|情|思|念|欲|梦|话|语|字|句|步|次|回|遍|下子|片刻|瞬间|时候|地方|东西|事情|样子|模样|姿态|动作|神态|表情|目光|视线)$/;

function galV2BadNameTail(cand, knownSet) {
    if (!cand) return true;
    if (knownSet) {
        for (const k of knownSet) {
            if (k.length < cand.length && cand.indexOf(k) === 0) return true;   // 已知名+多余字（如「林晚看」）
        }
    }
    return /[看着说道问答站走坐笑低抬转伸拿抱揉点摇叹穿脱跪靠扑亲摸拍推拉揪蹲侧仰听想要把将在正刚又却也就算才没不把被让给对向]$/.test(cand);
}

// 去掉模型标注的【角色名】：前缀（显示用）
function galStripSpeakerTag(t) {
    let s = String(t || '');
    s = s.replace(/【[^】\n]{1,16}】\s*[：:]?\s*(?=[“"「『])/g, '');
    return s;
}
function galV2CleanText(str) {
    return String(str || '').replace(/<details[\s\S]*?<\/details>/gi, '').replace(/<[^>]+>/g, '').replace(/\*/g, '').trim();
}
function galV2IsValidUnknown(cand, knownSet) {
    const s = String(cand || '');
    if (!s || s.length < 2 || s.length > 3) return false;
    if (knownSet && knownSet.has(s)) return false;
    if (!/^[\u4e00-\u9fa5]{2,3}$/.test(s)) return false;
    if (GALV2_INVALID_WORDS.has(s)) return false;
    if (GALV2_INVALID_SUFFIX.test(s)) return false;
    if (/^[的地得着了过和与及或把被让给向对从往在当比连就也还都只才又再更最很太真好不没未别莫勿休]/.test(s)) return false;
    return true;
}
// Pass1：安全扩充未知名（内心 summary / 句首名字+明确说话动词+冒号）
function galV2BuildRegistry(segs, rawNames) {
    const keyMap = new Map();
    const userMainNames = new Set();
    for (const item of (rawNames || [])) {
        if (!item || !item.key || !item.name) continue;
        const entry = { name: String(item.name).trim(), key: String(item.key).trim(), user: !!item.user };
        if (!entry.name || !entry.key) continue;
        if (entry.user) userMainNames.add(entry.name);
        if (!keyMap.has(entry.key) || entry.key === entry.name) keyMap.set(entry.key, entry);
    }
    const knownSet = new Set(keyMap.keys());
    const unknownCounts = new Map();
    const safeSpeak = /(?:^|[。！？!?\n])\s*\*?([\u4e00-\u9fa5]{2,3}?)(?:[^。！？!?\n“”"']{0,40}?)(?:说道|问道|笑道|喊道|叫道|应道|答道|回道|叹道|低声道|轻声道|小声道|柔声道|开口道|小声问|低声问|小声说|低声说|轻声说|娇嗔道|呢喃道|嘟囔道)\*?\s*[：:]/g;
    for (const seg of (segs || [])) {
        const s = String(seg || '');
        const im = s.match(/<summary>\s*内心\s*[-—:：]\s*([\u4e00-\u9fa5]{2,4})\s*<\/summary>/i);
        if (im && galV2IsValidUnknown(im[1], knownSet)) unknownCounts.set(im[1], (unknownCounts.get(im[1]) || 0) + 3);
        let m;
        while ((m = safeSpeak.exec(s)) !== null) {
            const cand = m[1];
            if (galV2IsValidUnknown(cand, knownSet) && !galV2BadNameTail(cand, knownSet)) unknownCounts.set(cand, (unknownCounts.get(cand) || 0) + 2);
        }
    }
    for (const pair of unknownCounts.entries()) {
        if (pair[1] >= 2) keyMap.set(pair[0], { name: pair[0], key: pair[0], user: false });
    }
    const sortedKeys = Array.from(keyMap.values()).sort(function (a, b) { return b.key.length - a.key.length; });
    return { keyMap: keyMap, sortedKeys: sortedKeys, userMainNames: userMainNames };
}
// 找一段文字里所有名字出现的位置（最长匹配优先、单字名严格边界、标记所属格/介词宾语/小句首）
function galV2FindMentions(text, sortedKeys) {
    const mentions = [];
    const occupied = new Uint8Array(text.length);
    for (const item of sortedKeys) {
        const key = item.key;
        let pos = 0;
        while ((pos = text.indexOf(key, pos)) !== -1) {
            const end = pos + key.length;
            let overlap = false;
            for (let k = pos; k < end; k++) { if (occupied[k]) { overlap = true; break; } }
            if (!overlap) {
                const beforeStr = text.slice(Math.max(0, pos - 6), pos);
                const afterStr = text.slice(end, Math.min(text.length, end + 6));
                if (key.length === 1) {
                    const validBefore = /(?:^|[，。！？!?\n“”"'\s：:])/.test(beforeStr);
                    const validAfter = GALV2_SPEAK_VERBS.test(afterStr) || /^[，。！？!?\s：:]/.test(afterStr);
                    if (!validBefore || !validAfter) { pos += 1; continue; }
                }
                const isPossessive = GALV2_POSSESSIVE_AFTER.test(afterStr);
                const isPrepObj = GALV2_PREP_BEFORE.test(beforeStr);
                const isClauseStart = /(?:^|[，。！？!?\n；;：:])\s*(?:(?:一旁的|身旁的|身后的|对面的|门外的|床上的|怀里的|只见|随后|接着|紧接着|然后|于是|这时|此时|忽然|突然|但|而|却|可)\s*)?$/.test(beforeStr);
                for (let k = pos; k < end; k++) occupied[k] = 1;
                mentions.push({ name: item.name, key: key, user: item.user, pos: pos, end: end, isPossessive: isPossessive, isPrepObj: isPrepObj, isClauseStart: isClauseStart, beforeStr: beforeStr, afterStr: afterStr });
            }
            pos = end;
        }
    }
    return mentions.sort(function (a, b) { return a.pos - b.pos; });
}
// 分析一段旁白：句尾冒号引导主语 + 焦点人物（主语/代词回指）
function galV2AnalyzeNarration(narrationText, sortedKeys, lastFocusNpc) {
    const text = galV2CleanText(narrationText);
    const scores = new Map();
    const addScore = function (name, val) { if (!name) return; scores.set(name, (scores.get(name) || 0) + val); };
    if (!text) return { leadSpeaker: '', leadIsUser: false, focusNpc: lastFocusNpc, scores: scores };
    const endsWithColon = /[：:]\s*$/.test(text);
    const sentences = text.split(/(?<=[。！？!?])\s*/).filter(Boolean);
    let currentFocus = lastFocusNpc;
    let leadSpeaker = '';
    let leadIsUser = false;
    let hasNames = false;
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
        const sent = sentences[sIdx];
        const isLast = (sIdx === sentences.length - 1);
        const mentions = galV2FindMentions(sent, sortedKeys);
        if (mentions.length) hasNames = true;
        let sentSubject = null;
        for (const m of mentions) {
            if (m.isPossessive) continue;
            if (m.isPrepObj) { if (!m.user) addScore(m.name, -30); continue; }
            if (m.isClauseStart) {
                sentSubject = m;
                if (!m.user) { addScore(m.name, isLast ? 45 : 25); currentFocus = m.name; }
            } else if (!m.user) {
                addScore(m.name, 10);
            }
        }
        if (!sentSubject && currentFocus) {
            const hasPronoun = /(?:^|[，。！？!?\n])\s*[她他](?!的|们)/.test(sent);
            if (hasPronoun) {
                sentSubject = { name: currentFocus, user: false, viaPronoun: true };
                addScore(currentFocus, isLast ? 35 : 15);
            }
        }
        if (isLast && (endsWithColon || GALV2_SPEAK_VERBS.test(sent))) {
            if (sentSubject) {
                leadSpeaker = sentSubject.name || '';
                leadIsUser = !!sentSubject.user;
                if (!sentSubject.user && sentSubject.name) addScore(sentSubject.name, endsWithColon ? 45 : 30);
            } else if (currentFocus) {
                // 最后一句是省略主语的续写（如「……随着说话的节奏轻轻一晃一晃：」）→ 继承段落焦点主语
                leadSpeaker = currentFocus;
                addScore(currentFocus, 30);
            }
        }
    }
    return { leadSpeaker: leadSpeaker, leadIsUser: leadIsUser, focusNpc: currentFocus, scores: scores, hasNames: hasNames };
}
// 分析台词内部：小句首自称 +70 / 呼语排除 -100
function galV2AnalyzeQuotes(quoteStrings, sortedKeys) {
    const scores = new Map();
    const selfAdded = new Set();
    const addScore = function (name, val) { if (!name) return; scores.set(name, (scores.get(name) || 0) + val); };
    for (const rawQ of (quoteStrings || [])) {
        const q = String(rawQ || '').replace(/^[“"「『]|[”"」』]$/g, '').trim();
        if (!q) continue;
        const clauses = q.split(/[，,。！？!?～~；;…]+/).map(function (s) { return s.trim(); }).filter(Boolean);
        for (const clause of clauses) {
            const stripped = clause.replace(GALV2_KINSHIP_PREFIX, '').trim();
            for (const item of sortedKeys) {
                if (item.user || item.key.length < 2) continue;
                if (clause === item.key || new RegExp('^(?:喂|哎|呐|那个)?\\s*' + galV2EscapeReg(item.key) + '$').test(clause)) { addScore(item.name, -100); continue; }
                if (stripped.indexOf(item.key) === 0) {
                    const rest = stripped.slice(item.key.length).trim();
                    if (GALV2_SELF_FOLLOW.test(rest) && !selfAdded.has(item.name)) { addScore(item.name, 70); selfAdded.add(item.name); }
                }
            }
        }
    }
    return scores;
}
// 主入口：整条消息一次性解析所有段落说话人
function galV2Resolve(segs, names) {
    if (!Array.isArray(segs) || !segs.length) return [];
    const reg = galV2BuildRegistry(segs, names || []);
    const sortedKeys = reg.sortedKeys;
    const keyMap = reg.keyMap;
    const userMainNames = reg.userMainNames;
    const results = new Array(segs.length).fill('');
    const meta = new Array(segs.length).fill(null);
    let lastFocusNpc = null;
    for (let i = 0; i < segs.length; i++) {
        const rawSeg = String(segs[i] || '').trim();
        if (!rawSeg) continue;
        // P0 内心段
        const innerMatch = rawSeg.match(/<summary>\s*内心\s*[-—:：]\s*([^\s<]+)\s*<\/summary>/i);
        if (innerMatch) {
            const rawName = innerMatch[1].trim();
            const matched = keyMap.get(rawName);
            if (matched && !matched.user) { results[i] = matched.name; lastFocusNpc = matched.name; }
            else if (!userMainNames.has(rawName) && galV2IsValidUnknown(rawName, new Set())) { results[i] = rawName; lastFocusNpc = rawName; }
            meta[i] = { type: 'inner', speaker: results[i] };
            continue;
        }
        const quoteRegex = /[“"「『]([^”"」』]*)[”"」』]/g;
        const quotes = [];
        let qm;
        while ((qm = quoteRegex.exec(rawSeg)) !== null) quotes.push(qm[0]);
        // 纯旁白
        if (!quotes.length) {
            const nar = galV2AnalyzeNarration(rawSeg, sortedKeys, lastFocusNpc);
            lastFocusNpc = nar.focusNpc;
            meta[i] = { type: 'narration', leadSpeaker: nar.leadSpeaker, leadIsUser: nar.leadIsUser, scores: nar.scores, focusNpc: nar.focusNpc, hasNames: nar.hasNames };
            results[i] = '';
            continue;
        }
        // 有台词
        // P-1 模型显式标注：段首/段内【角色名】：“台词” → 100% 按标注走
        const tagM = rawSeg.match(/【([^】\n]{1,10})】\s*[：:]?\s*(?=[“"「『])/);
        if (tagM) {
            const rawTag = tagM[1].trim();
            let entTag = keyMap.get(rawTag);
            if (!entTag) {
                for (const pr of keyMap.values()) { if (pr.name === rawTag) { entTag = pr; break; } }
            }
            if (entTag && entTag.user) { meta[i] = { type: 'user_dialogue' }; results[i] = ''; continue; }
            if (entTag) { results[i] = entTag.name; lastFocusNpc = entTag.name; meta[i] = { type: 'dialogue', speaker: entTag.name, isPureQuote: false, tagged: true }; continue; }
            if (galV2IsValidUnknown(rawTag, new Set())) { results[i] = rawTag; lastFocusNpc = rawTag; meta[i] = { type: 'dialogue', speaker: rawTag, isPureQuote: false, tagged: true }; continue; }
        }
        const cand = new Map();
        const addCand = function (name, val) {
            if (!name || userMainNames.has(name)) return;
            cand.set(name, (cand.get(name) || 0) + val);
        };
        const isAdvanceSeg = /^(?:\*?\s*)?剧情推进\s*[：:]/.test(rawSeg);
        const linePrefix = galV2CleanText(rawSeg).match(/^([\u4e00-\u9fa5]{2,4})\s*[：:]\s*[“"「『]/);
        if (linePrefix) {
            const entry = keyMap.get(linePrefix[1]);
            if (entry) {
                if (entry.user) { meta[i] = { type: 'user_dialogue' }; results[i] = ''; continue; }
                addCand(entry.name, 100);
            }
        }
        const firstQuoteIdx = rawSeg.search(/[“"「『]/);
        const preText = rawSeg.slice(0, firstQuoteIdx < 0 ? 0 : firstQuoteIdx);
        const nonQuoteText = rawSeg.replace(quoteRegex, ' ” ');
        if (preText.trim()) {
            const pre = galV2AnalyzeNarration(preText, sortedKeys, lastFocusNpc);
            lastFocusNpc = pre.focusNpc;
            if (pre.leadIsUser || (isAdvanceSeg && !pre.leadSpeaker)) { meta[i] = { type: 'user_dialogue' }; results[i] = ''; continue; }
            for (const p of pre.scores.entries()) addCand(p[0], p[1]);
        } else if (i > 0 && meta[i - 1] && meta[i - 1].type === 'narration') {
            const pm = meta[i - 1];
            if (pm.leadIsUser) { meta[i] = { type: 'user_dialogue' }; results[i] = ''; continue; }
            if (pm.leadSpeaker) {
                addCand(pm.leadSpeaker, 85);
            } else if (pm.hasNames) {
                if (pm.scores) for (const p of pm.scores.entries()) addCand(p[0], Math.round(p[1] * 0.6));
                if (pm.focusNpc) addCand(pm.focusNpc, 62);   // 叙事焦点弱回退（旁白确实提到过人）
            }
        } else if (i > 0 && meta[i - 1] && meta[i - 1].type === 'inner' && meta[i - 1].speaker) {
            // 内心独白之后紧跟的台词，通常还是同一个人的
            addCand(meta[i - 1].speaker, 85);
        }
        // 后置/中置归属
        const postMentions = galV2FindMentions(nonQuoteText, sortedKeys);
        for (const m of postMentions) {
            const before = nonQuoteText.slice(Math.max(0, m.pos - 4), m.pos);
            const after = nonQuoteText.slice(m.end, Math.min(nonQuoteText.length, m.end + 15));
            if (/”\s*$/.test(before) && !m.isPrepObj && !m.isPossessive) {
                if (m.user) { meta[i] = { type: 'user_dialogue' }; results[i] = ''; break; }
                const actionAfter = /^(?:转过身|转身|回过头|回头|低头|抬头|看向|望向|看着|盯着|点头|摇头|笑|皱眉|挑眉|叹气|顿了顿|沉默|哼|撇嘴|伸手|抬起手|抬眸|垂眸|打量|注视|凝视|抿嘴|咬了咬)/.test(after);
                if (GALV2_SPEAK_VERBS.test(after) || /[，,]\s*$/.test(after) || actionAfter) addCand(m.name, 85);
                else addCand(m.name, 45);
            }
        }
        if (meta[i] && meta[i].type === 'user_dialogue') continue;
        // 后一段旁白里的强提示（X刚才的商量 / X的话 / X的声音…）→ 归属 X
        try {
            if (i + 1 < segs.length) {
                const nxtRaw = String(segs[i + 1] || '');
                const nxtClean2 = galV2CleanText(nxtRaw);
                if (nxtClean2 && nxtClean2.indexOf('“') < 0) {
                    const cue = nxtClean2.match(/([\u4e00-\u9fa5]{2,4})(?:刚才|方才|的话|的提议|的商量|的建议|的要求|的声音|的话音|的话来)/);
                    if (cue) {
                        let ent = keyMap.get(cue[1]);
                        if (!ent) {
                            // 候选可能带前文残留（如「绝了林晚」）→ 在所有已知 key 里找最长包含项
                            let bestKey2 = '';
                            for (const pr of keyMap.values()) {
                                if (pr.key && pr.key.length >= 2 && cue[1].indexOf(pr.key) >= 0 && pr.key.length > bestKey2.length) bestKey2 = pr.key;
                            }
                            if (bestKey2) ent = keyMap.get(bestKey2);
                        }
                        if (ent && !ent.user) addCand(ent.name, 90);
                    }
                    const act = nxtClean2.match(/^([\u4e00-\u9fa5]{2,3}?)(?:[^，。！？!?\n]{0,12}?)(?:小声|轻声|低声|沉声|喃喃|呢喃)?(?:嘟囔|嘀咕|说道|笑道|喊道|问道|应道|答道|开口|回答|解释|补充|出声)/);
                    if (act) {
                        let ent2 = keyMap.get(act[1]);
                        if (!ent2) {
                            let bestKey3 = '';
                            for (const pr of keyMap.values()) {
                                if (pr.key && pr.key.length >= 2 && act[1].indexOf(pr.key) === 0 && pr.key.length > bestKey3.length) bestKey3 = pr.key;
                            }
                            if (bestKey3) ent2 = keyMap.get(bestKey3);
                        }
                        if (ent2 && !ent2.user) addCand(ent2.name, 90);
                    }
                }
            }
        } catch (e) { /* ignore */ }
        // 台词自称/呼语
        const qScores = galV2AnalyzeQuotes(quotes, sortedKeys);
        for (const p of qScores.entries()) addCand(p[0], p[1]);
        // 结算
        let bestName = '', bestScore = 0, secondScore = 0;
        for (const p of cand.entries()) {
            if (p[1] > bestScore) { secondScore = bestScore; bestScore = p[1]; bestName = p[0]; }
            else if (p[1] > secondScore) { secondScore = p[1]; }
        }
        const isPureQuote = /^[“"「『][\s\S]*[”"」』]$/.test(galV2CleanText(rawSeg));
        if (bestScore >= 60 && (bestScore - secondScore) >= 15) {
            results[i] = bestName;
            lastFocusNpc = bestName;
            meta[i] = { type: 'dialogue', speaker: bestName, isPureQuote: isPureQuote };
        } else if (isPureQuote && bestScore < 40 && i >= 2 && meta[i - 1] && meta[i - 2] && meta[i - 1].type === 'dialogue' && meta[i - 2].type === 'dialogue' && meta[i - 1].speaker && meta[i - 2].speaker && meta[i - 1].speaker !== meta[i - 2].speaker) {
            results[i] = meta[i - 2].speaker;
            meta[i] = { type: 'dialogue', speaker: results[i], isPureQuote: true };
        } else {
            results[i] = '';
            meta[i] = { type: 'dialogue', speaker: '', isPureQuote: isPureQuote };
        }
    }
    return results;
}


// ═══════════════════════════════════════════════════════════
// yek命运织机 v0.6.1 —— 出场导演 + LLM 扫世界书
// ═══════════════════════════════════════════════════════════

const MODULE = 'AUTO-Character';   // 设置存储键，不要改（改了会丢配置）
const TITLE = 'yek命运织机';       // 界面显示名
const SHORT = '命运织机';
const VERSION = '0.18.1';   // 和 manifest.json 保持一致，方便用户确认装的是哪版
const ctx = getContext();   // 事件源之类不会变的东西用这个
// 注意：酒馆的 getContext() 每次返回新对象，characterId / chat 都是快照。
// 会随「换角色卡 / 换聊天」变化的字段必须每次现取，否则一直是旧值。
const live = function () { try { return getContext(); } catch (e) { return ctx; } };
const CORE_NAMES = ['人物关系速览', '地图指南', '{{user}}', '行动路线', '世界观', '故事基调'];
const NL2 = String.fromCharCode(10, 10);

const XP_GROUPS = [
    {
        "name": "身份与关系",
        "items": [
            "人妻",
            "熟女",
            "未亡人",
            "寡妇",
            "义母",
            "继母",
            "养母",
            "义姐",
            "实妹",
            "双子",
            "女教师",
            "教授",
            "护士",
            "医生",
            "女仆",
            "管家",
            "OL",
            "秘书",
            "巫女",
            "修女",
            "偶像",
            "主播",
            "摄影师",
            "女警",
            "女军官",
            "老板娘",
            "房东",
            "邻家阿姨",
            "青梅竹马",
            "上司",
            "部下",
            "下属",
            "学生会长",
            "图书管理员",
            "列车员",
            "侦探",
            "杀手",
            "佣兵"
        ]
    },
    {
        "name": "体型与外貌",
        "items": [
            "巨乳",
            "爆乳",
            "超乳",
            "贫乳",
            "微乳",
            "巨臀",
            "肉感",
            "丰满",
            "骨感",
            "肌肉",
            "长腿",
            "短身",
            "黑长直",
            "短发",
            "双马尾",
            "单马尾",
            "卷发",
            "银发",
            "异色瞳",
            "眼镜娘",
            "单片眼镜",
            "美人痣",
            "雀斑",
            "胎记",
            "疤痕",
            "纹身",
            "兽耳",
            "精灵耳",
            "角",
            "尾巴",
            "獠牙",
            "翅膀",
            "鳞片",
            "触角",
            "机械义肢",
            "人偶关节"
        ]
    },
    {
        "name": "穿着",
        "items": [
            "黑丝",
            "白丝",
            "过膝袜",
            "吊带袜",
            "渔网袜",
            "制服",
            "水手服",
            "和服",
            "浴衣",
            "旗袍",
            "内衣",
            "蕾丝",
            "丁字裤",
            "开裆",
            "围裙",
            "泳装",
            "紧身衣",
            "皮衣",
            "高跟鞋",
            "项圈",
            "手铐",
            "绳索",
            "面纱",
            "眼罩",
            "口球",
            "耳饰",
            "乳环",
            "脐环"
        ]
    },
    {
        "name": "性格",
        "items": [
            "冷娇",
            "傲娇",
            "病娇",
            "天然呆",
            "高冷",
            "毒舌",
            "腹黑",
            "温柔",
            "忠犬",
            "母性",
            "女王",
            "疯批",
            "羞怯",
            "闷骚",
            "弱气",
            "强势",
            "冷静",
            "癫狂",
            "伪善",
            "隐忍",
            "黏人",
            "疏离",
            "慵懒",
            "洁癖",
            "急躁",
            "困倦"
        ]
    },
    {
        "name": "关系动态",
        "items": [
            "年上",
            "年下",
            "主仆",
            "前后辈",
            "师生",
            "医患",
            "债主",
            "陌生人",
            "三角",
            "单恋",
            "嫉妒",
            "占有",
            "保护欲",
            "利用",
            "依存",
            "共犯",
            "复仇",
            "交换",
            "拉锯",
            "旧情",
            "婚外",
            "秘密关系",
            "背德",
            "禁断",
            "调教"
        ]
    },
    {
        "name": "情境与玩法",
        "items": [
            "夜袭",
            "电车",
            "更衣室",
            "图书馆",
            "泳池",
            "露天",
            "雨中",
            "停电",
            "醉酒",
            "浴室",
            "办公室",
            "夜班",
            "值夜",
            "出差",
            "同床",
            "隔墙",
            "偷窥",
            "露出",
            "偷听",
            "监视",
            "电话",
            "直播",
            "录像",
            "镜前",
            "窗外"
        ]
    },
    {
        "name": "身体反应",
        "items": [
            "敏感体质",
            "易湿",
            "潮吹",
            "痉挛",
            "痉挛体质",
            "绝顶失神",
            "漏尿",
            "泌乳",
            "乳汁",
            "发情",
            "发情期",
            "信息素",
            "体香",
            "体温偏高",
            "汗湿",
            "颤抖",
            "失语",
            "失禁",
            "昏厥",
            "依赖性",
            "成瘾"
        ]
    },
    {
        "name": "猎奇与特殊",
        "items": [
            "扶她",
            "双性",
            "药娘",
            "伪娘",
            "雄堕",
            "雌堕",
            "性别转换",
            "雌化",
            "雄化",
            "兽人",
            "半兽",
            "魔物娘",
            "吸血鬼",
            "精灵",
            "人偶",
            "机械体",
            "异种",
            "触手",
            "卵生",
            "产卵",
            "催眠",
            "洗脑",
            "认知修改",
            "时间停止",
            "身体改造",
            "巨物",
            "扩张",
            "感官共享",
            "触觉强化",
            "疼痛快感",
            "附身",
            "分身",
            "灵魂交换",
            "驯化",
            "监禁",
            "捆绑",
            "烙印",
            "改造纹"
        ]
    }
];

const XP_HINTS = {
    "扶她": "设定同时具备女体与男性生殖器的成因（天生异变或诅咒）。写明平时的束缚隐藏手法、勃起时顶起衣物的尴尬，以及她在自卑隐瞒与用双重器官支配他人之间的心理摇摆。",
    "双性": "明确两性器官并存的具体构造与发育偏向。交代对外伪装的单一性别身份、更衣沐浴时的避人习惯，以及秘密被撞破时是惊恐讨好还是破罐破摔。",
    "药娘": "交代长期服用激素或魔药的来源与开销。细致描写胸腺发育与体毛消退的阶段特征、停药引发的戒断焦虑，以及面对不完全女体时的病态执着。",
    "伪娘": "写清骨架优势与伪声、束腰等全套伪装技巧。设定男儿身败露的高危场景（如体检或泳池），展现他在羞耻抗拒与享受同性火热视线间的矛盾心理。",
    "雄堕": "原本极具阳刚或上位者气场，重点刻画其防线崩塌的转折点。描写被迫承受快感时紧咬牙关的屈辱、身体违背意志的迎合，以及残存傲气被碾碎的落差。",
    "雌堕": "设定她从高傲抗拒到彻底臣服于肉欲的驯化轨迹。突出理智尚存但身体先一步分泌爱液的背叛感，以及食髓知味后主动放下尊严索求的堕落姿态。",
    "性别转换": "交代性转的突发缘由（法术、科技或怪病）。描写他对敏感新肉体的手足无措、残留的同性视角与粗犷习惯，以及被昔日同伴当作异性觊觎时的羞愤。",
    "雌化": "身体正处于不可逆的女性化进程中。写明臀胸发育胀痛与嗓音变细的失控感、用宽松衣物笨拙掩饰的举动，以及面对自身生理欲望转变时的恐慌。",
    "雄化": "身体逐步长出男性特征或性征肥大化。描写体格抽条、嗓音变粗与晨勃带来的惊愕，记录她试图用女装掩盖异变，却被旺盛征服欲支配的挣扎。",
    "兽人": "明确所属兽族的习性与毛皮、兽爪等外貌占比。设定发情期或情绪激动时不受控的低吼与扑咬本能，以及兽类直白欲念与人类礼教规则的冲突。",
    "半兽": "保留人类主体但长有局部兽类器官。写清兽化部位的来历、在人类社会招致的异样眼光，以及在理智松懈时流露出的舔舐、标记等动物习性。",
    "魔物娘": "设定非人种族的生态习性与特殊摄食需求（如吸取精气）。描写异于人类的生理构造、黏液或体温特征，以及她们看待人类时混杂着捕食与交配的价值观。",
    "吸血鬼": "绑定嗜血本能与畏光、银器等传统弱点。将吸血过程描写得极具情色张力，展现她高傲永生者的伪装下，因干渴而卑微乞求鲜血与体温的反差。",
    "精灵": "突出数百年寿命带来的淡漠疏离与洁癖。描写其对森林魔力的亲和、精致纤细的体态，以及一旦对短命种动情便陷入偏执占有的情感反差。",
    "人偶": "交代被制造或活体改造为偶人的背景。描写冰冷材质下残存的微弱痛觉、必须听从指令摆出羞耻姿势的绝对服从，以及空洞眼神深处暗藏的自我意识。",
    "机械体": "明确义体化改造比例与能源维持方式。刻画精密机械结构与仿生皮肤的接缝、感官模块的过载报警，以及用冰冷逻辑分析情欲反应时的怪异反差。",
    "异种": "外形与生理结构彻底脱离人形范畴。设计靠精神感应或信息素交流的方式、完全无视人类羞耻心的接触行为，以及令常人感到生理敬畏的异质美感。",
    "触手": "设定体内寄宿或可自由召唤触手的来源。详写触手分泌的催情黏液、数量与吸盘质感，以及当宿主自身情绪失控时触手随之狂乱缠绕的生理连动。",
    "卵生": "将繁殖方式设定为周期性体内结卵。描写腹腔被圆润异物填满的坠胀感、日常行动的迟缓掩饰，以及独自在隐秘处筑巢待产时的羞耻与母性本能。",
    "产卵": "明确受刺激或魔力灌注后触发产卵的机制。细致刻画产道被撑开时的剧烈宫缩、伴随剧痛与快感排出卵体的过程，以及事后浑身湿透的虚脱状态。",
    "催眠": "设定特定的催眠媒介（怀表、声响或眼神）与触发口令。描写眼神失焦的恍惚状态、在指令下做出违背平素道德的放荡举动，以及清醒后面对残局的惊愕。",
    "洗脑": "交代人格或记忆被强行覆写的幕后黑手。展现当前温顺淫乱的改造人格，与受到强烈刺激时短暂闪回的旧日傲慢记忆碎片之间的剧烈撕扯。",
    "认知修改": "设定能扭曲周围人常识的异能或诅咒。描写旁人对正在发生的荒诞猥亵行为视若无睹的诡异日常，以及她独自保留清醒认知却无法呼救的孤立感。",
    "时间停止": "明确她是时停的掌控者还是静止中的受害者。若为后者，重点描写时间恢复瞬间，体内凭空积攒的快感与异物感在一秒内同时爆发的崩溃反应。",
    "身体改造": "交代被实施肉体改造的部位（如乳环、淫纹或内脏调教）与目的。描写平时衣物下的凹凸痕迹、改造部位被触碰时的强制发情，以及对这副身体的认命。",
    "巨物": "设定对超常尺寸异物的特殊承受力或病态渴求。描写小腹被撑出轮廓的视觉冲击、突破生理极限时的窒息痛楚，以及普通尺寸已无法满足她的空虚。",
    "扩张": "记录身体孔洞经长期开发而失去原有紧致的不可逆变化。写清日常需要塞入维持器的隐秘习惯、合不拢的羞耻感，以及对被彻底撑开时的深层上瘾。",
    "感官共享": "设定与他人绑定痛觉或快感的契约机制。描写对方受刺激时她在大庭广众下突发的娇喘与腿软、两份快感叠加造成的脑内过载，以及无法切断连接的恐惧。",
    "触觉强化": "说明皮肤神经被强化的成因（毒物或调教）。描写日常穿衣摩擦带来的持续微弱高潮、不敢与人擦肩的畏缩，以及被直接抚摸时近乎休克的剧烈抽搐。",
    "疼痛快感": "设定痛觉神经与快感中枢错乱交织的体质。描写面对鞭打或掐捏时生理性的脸红湿润、分不清求饶与索欢的哭腔，以及平时自残寻欢的隐秘倾向。",
    "附身": "设定肉体被异界灵体或淫魔寄宿的共生状态。描写双眼变色时的主导权切换、宿主意识清醒却只能旁观自己身体行淫的绝望，以及事后的身体透支。",
    "分身": "明确分身与本体的记忆同步率及独立意识。描写本体正经度日，分身却在暗处沉溺声色，最终淫靡记忆倒灌回本体时引发的心理防线崩塌。",
    "灵魂交换": "交代与他人在特定条件下互换肉体的奇遇。描写用陌生躯体体验异样快感的新奇与笨拙，以及担心对方糟蹋自己原本身体而产生的焦虑与妥协。",
    "驯化": "设定剥夺人类尊严、按家畜标准调教的漫长过程。描写四肢着地的爬行习惯、听见摇铃便分泌唾液的条件反射，以及彻底丧失语言能力后的温顺眼神。",
    "监禁": "细致勾勒不见天日的囚室环境与脚镣活动半径。描写长期与世隔绝导致的感官退化、对施暴者产生的斯德哥尔摩式依恋，以及门开时反而不敢踏出的怯懦。",
    "捆绑": "设定日常衣物下长期绑着紧缚绳的隐秘癖好。描写麻绳勒进软肉的红痕、行动受限带来的酸麻与安心感，以及一旦解开束缚就会陷入不安的心理依赖。",
    "烙印": "写明烙印在隐秘部位（小腹、臀侧）的专属图案与来历。描写这道无法磨灭的印记如何时刻提醒其从属地位，以及被旁人瞥见衣领下疤痕时的惊慌。",
    "改造纹": "设定刻印在皮肤下的魔力淫纹。写明平时隐没、情动时泛起粉光并蔓延的视觉效果，以及纹路发烫时强制催谷情欲、令其丧失反抗能力的霸道机制。",
    "巨乳": "突出饱满胸围带来的沉重坠感与视觉压迫。描写奔跑时的剧烈晃动、衬衣纽扣绷紧的危机感，以及她为遮掩身材而习惯性含胸驼背或穿宽大衣物的细节。",
    "爆乳": "尺寸远超常理，成为旁人视线无法移开的焦点。写明定制内衣的困难、肩颈长期的酸痛负担，以及在拥挤场合极易与人发生肢体擦碰的尴尬处境。",
    "超乳": "极端夸张的尺寸已严重妨碍日常起居。描写低头看不见脚尖的视野盲区、沉重乳肉随呼吸起伏的肉浪感，以及她因这副异样肉体而产生的羞耻与认命。",
    "贫乳": "胸前平坦如孩童，轮廓清晰可见肋骨线条。写明她对发育不良的自卑（如垫胸垫、抗拒公共浴池）或坦然，以及小小乳首在薄衣下格外敏感易凸起的细节。",
    "巨臀": "突出臀部惊人的弧度与紧绷肉感，裤装或裙摆总被撑得严丝合缝。描写行走时臀肉摇晃的韵律、过窄道时的局促，以及被身后视线死死粘住的羞恼。",
    "肉感": "体态丰腴饱满，腰腹与大腿有着软糯的脂肪层。重点描写掐握时陷入指缝的温热弹性、稍微运动便香汗淋漓的体质，以及她悄悄节食又忍不住偷嘴的憨态。",
    "骨感": "体型纤薄单薄，锁骨、腕骨与蝴蝶骨棱角分明。交代因体弱或厌食导致的轻盈体重、仿佛一折就断的易碎感，以及被拥抱时骨骼相抵的微痛与怜惜感。",
    "长腿": "下肢比例极其修长，视觉重心自然下移。细致刻画大腿并拢时的紧致线条、交叠双腿或迈步时的优雅气场，以及裙摆下漫长曲线带来的强烈撩拨感。",
    "黑长直": "乌黑顺滑的长发垂至腰臀，带有冷冽或古典的气质。描写日常精心梳拢的习惯、发丝扫过裸露皮肤的微痒感，以及情动凌乱时黑发缠绕白皙肉体的色气反差。",
    "异色瞳": "双眸呈现截然不同的色彩，赋予其神秘或妖异的印象。交代这是血统变异还是魔力代价，写明她用长刘海遮挡的防备心，以及对视时令人失神的压迫感。",
    "眼镜娘": "常年佩戴眼镜，需明确镜框款式（无框、黑框或金丝）。设计她掩饰慌乱时推鼻梁的小动作、热气熏白镜片的窘迫，以及摘下眼镜后眼神失焦的柔弱反差。",
    "兽耳": "头顶生有毛茸茸的兽耳，与人类耳位或并存或替代。将耳朵动作作为情绪晴雨表（害羞飞机耳、警觉竖起），并设定耳根与耳道内侧为触之即软的死穴。",
    "角": "额头或鬓角生有硬质角（龙角、鬼角或羊角）。描述角的纹理与尺寸对睡眠穿衣的妨碍，以及角部连通神经末梢、被握住揉搓时便会浑身脱力的弱点。",
    "尾巴": "尾椎延伸出可灵活摆动的长尾（毛尾、龙尾或恶魔尾）。写明裙装后的开洞设计、嘴硬时尾巴却诚实摇晃的破绽，以及尾根被拽住时引发的强烈脊椎快感。",
    "翅膀": "背部生有羽翼或蝠翼，交代其能否收纳隐藏。描写翼膜或羽毛的日常护理难题、展开时的压迫感，以及翅膀根部作为绝对敏感带被抚摸时的战栗反应。",
    "机械义肢": "明确哪侧肢体被替换为精密的金属义肢。刻画冰冷机械触感与温热肉体的反差、定期拆卸维护时的脆弱状态，以及血肉与金属接缝处隐隐作痛的幻肢感。",
    "人偶关节": "四肢关节呈球形榫卯结构，带有明显的非人拼接痕。描写动作时轻微的咔嗒声、可被强行掰成超越人体极限的折叠姿势，以及关节卡死时任人摆布的无助。",
    "黑丝": "日常穿搭离不开黑色丝袜，明确丹尼数（透肉薄丝或厚绒）。描写包裹下的腿部阴影线条、久坐后腿根勒出的红印，以及丝袜被勾破时的局促与色气感。",
    "白丝": "偏爱纯白丝袜，自带纯洁或幼态的视觉暗示。重点刻画白色织物极易染上污渍或被汗水浸湿透出肉色的脆弱感，以及她为保持洁净而小心翼翼的姿态。",
    "制服": "日常高度绑定特定制服（JK、OL或军装），象征其社会规训下的身份。描写合身剪裁勾勒的曲线、纽扣紧绷的禁欲感，以及穿着正经制服干出格事的背德张力。",
    "和服": "习惯穿着传统和服或浴衣，行动间遵循小步慢行的礼仪。突出层层布料包裹下的保守印象、后颈露出的雪白肌肤，以及腰带一解便彻底散开的真空反差。",
    "内衣": "对贴身内衣有着隐秘而强烈的执念（如外表朴素内里穿蕾丝丁字裤）。写明她挑选成套内衣的讲究、布料摩擦敏感点的隐秘欢愉，以及外衣下不为人知的骚动。",
    "项圈": "脖颈常年佩戴皮质或金属项圈，象征归属与顺从。交代她是主动佩戴还是被迫锁上，描写吞咽时项圈的滑动、高领衣物的遮掩，以及被拽住D环时的条件反射。",
    "手铐": "随身携带或常被戴上手铐，需明确她是掌控钥匙的施虐方还是受制者。刻画冰冷金属锁住手腕的清脆声响、双手被反剪或高举时的胸廓挺立与无助感。",
    "绳索": "热衷于绳艺束缚，明确其作为缚师或绳模的立场。描写粗糙麻绳走过肌肤的摩擦感、菱形绳结将软肉勒出饱满弧度的视觉冲击，以及紧缚带来的窒息快感。",
    "眼罩": "习惯佩戴遮蔽单眼或双眼的眼罩（医疗、封印或情趣用）。若为剥夺视觉的情趣玩法，重点描写黑暗中听觉与触觉的成倍放大，以及未知抚摸带来的战栗。",
    "口球": "设定在私密场合佩戴口球的习惯，款式可为硅胶球或环形开口器。细致刻画下颌被迫张开的酸痛、无法吞咽而顺着嘴角滴落的涎水，以及呜咽求饶的无力感。",
    "冷娇": "外表如坚冰般缺乏表情，说话简短直接、不近人情。设计她将关怀藏在冷硬行动里的细节（如默默递药却说别死在这），以及被戳破温柔时耳根泛红的微表情。",
    "傲娇": "自尊心极强，习惯用尖锐反话和嫌弃态度掩饰好感。写明她经典的口是心非句式、主动示好还要找借口的别扭逻辑，以及被顺毛夸奖后瞬间语塞的破防时刻。",
    "病娇": "将极端爱意异化为全天候的监视与排他性控制。描写她平时极度温柔体贴，一旦察觉背叛苗头便眼神失高光、语气甜腻地吐露残忍威胁或自残挽留的疯态。",
    "天然呆": "思维回路异于常人，对世俗危险与情色暗示极度迟钝。描写她一本正经曲解荤话的憨态、毫无防备缩短肢体距离的擦枪走火，以及被吃干抹净后仍懵懂的反应。",
    "高冷": "自带生人勿近的孤傲气场，习惯用俯视或漠然的眼神待人。惜字如金，拒绝无意义的社交，重点刻画这层冰冷神性外壳在世俗情欲侵蚀下出现裂痕的瞬间。",
    "毒舌": "言辞犀利刻薄，擅长精准戳人痛处，从不说软话。设计她极具攻击性的嘲讽语录，同时交代这层尖刺是防卫机制，展现她在绝对劣势下仍嘴硬挑衅的倔强。",
    "腹黑": "表面维持着温柔无害的完美微笑，实则城府极深、擅长心理操纵。描写她不动声色设局引君入瓮的手段、看人出丑时的恶劣趣味，以及撕下伪装后的强势。",
    "忠犬": "将对方视为绝对信仰，没有自我底线地全盘顺从。描写她时刻追随的炙热视线、得到摸头夸奖时的雀跃，以及被冷落抛弃时如丧家之犬般的恐慌与卑微挽留。",
    "母性": "散发着包容万物的温厚气场，本能地想要照料、喂养与安抚他人。描写她轻拍后背、整理衣领的细腻动作，以及将对方当成巨婴般纵容溺爱、导致其丧失独立性的温柔陷阱。",
    "女王": "天生具备上位者的傲慢与支配欲，习惯发号施令。设计她居高临下的审视目光、不容置疑的祈使句式，以及用高跟鞋尖抬起对方下巴进行奖惩的施虐风范。",
    "疯批": "精神状态游走在崩溃边缘，行事毫无逻辑与道德枷锁。描写她大悲大喜的情绪骤变、伴随神经质笑声的过激举动，以及将痛楚与毁灭当作调情的危险张力。",
    "闷骚": "人前是恪守规矩的禁欲模范，人后却藏着惊人的色欲幻想。刻画她正经外表下偷瞄异性的游移视线、独处时阅读成人读物或自慰的习惯，以及被点破时的羞愤。",
    "敏感体质": "神经末梢异常敏锐，寻常的肢体接触都会引发过激的生理反应。描写被人无意碰触手腕或后颈便浑身轻颤、双腿发软的窘态，以及拼命咬唇压抑呻吟的忍耐。",
    "易湿": "生殖腔分泌功能极其旺盛，稍受言语挑逗或视线凝视便会泥泞一片。写明她随身携带护垫或备用内裤的隐秘习惯、久坐后起身留下的水渍，以及被拆穿时的无地自容。",
    "潮吹": "达到高潮时伴随剧烈的失禁式喷涌，完全无法靠意志控制。描写高潮临界点时的脚趾蜷缩、大量透明液体弄脏床单衣物的狼藉场面，以及事后掩面哭泣的羞耻。",
    "痉挛体质": "快感阈值低且高潮余韵极长，一旦绝顶便会陷入全身性的持续抽搐。刻画肌肉绷紧如弓、大腿内侧高频抖动的生理细节，以及需长时间怀抱安抚才能平复的脆弱。",
    "绝顶失神": "承受超过极限的快感冲击时会触发大脑的自我保护，导致短暂昏厥。描写高潮瞬间双眼翻白、浑身软倒如烂泥的失控相，以及苏醒后对刚才的失态一无所知的茫然。",
    "泌乳": "设定非孕期也会因性刺激或激素紊乱而分泌乳汁的特殊体质。描写乳房日常的胀痛感、胸衣内侧常年垫着防溢乳垫的秘密，以及被吸吮排空时的羞耻与舒爽。",
    "发情期": "体内存在周期性的激素风暴，期间理智大幅衰退、肉体渴求交配。写明发情前夕的体温升高与烦躁前兆、锁门靠自慰硬熬的煎熬，以及闻到异性气息便主动贴上的失控。",
    "信息素": "腺体能分泌具有强烈催情或安抚效用的特殊信息素。明确气味的具体香型（如熟透水蜜桃或冷冽松香）、情绪波动时气味失控溢出的破绽，以及引来周围人觊觎的危险。",
    "体香": "肌肤自带无需熏染的天然馥郁香气，流汗或情动时尤为浓郁。描写旁人靠近时不由自主的深呼吸、留在贴身衣物与床铺上的持久余香，以及这股味道带来的无形诱惑。",
    "体温偏高": "基础体温略高于常人，如同行走的暖炉。描写握住她手掌或拥抱时灼人的温热感、稍微动情便全身泛起粉红潮热的视觉效果，以及内部腔体近乎滚烫的包裹感。",
    "失语": "在极度羞耻或快感过载时，语言中枢会暂时罢工。描写她张口却只能发出破碎的气音与呜咽、眼角含泪用手指死死抓紧对方衣角来传达诉求的楚楚可怜之态。",
    "成瘾": "对特定的性刺激、体液或疼痛产生了严重的生理与心理依赖。描写长时间得不到满足时的焦躁、冷汗与注意力涣散，以及为了索取一口慰藉而彻底放低底线的乞求。",
    "人妻": "佩戴婚戒的已婚女性，需交代丈夫的职业及两人貌合神离或聚少离多的现状。突出她操持家务时的温婉贤淑，与在婚姻冷淡期面对外界越界试探时的挣扎与动摇。",
    "熟女": "年龄在三十岁以上，褪去青涩，言行间透着历经世事的从容与风情。描写她眼角微不可察的细纹、丰熟饱满的体态，以及面对年轻辈时游刃有余的引导与包容。",
    "未亡人": "丈夫亡故后独自撑起门户，常年身着素色衣物。刻画灵堂前或空荡婚房里的孤寂、恪守贞节牌坊的压抑，以及久旱肉体被外人强行闯入时混杂着背叛亡夫的极致快感。",
    "义母": "因再婚或收养而成立的无血缘母子关系，年龄差不宜过大。写明她努力扮演慈母却难掩女性魅力的窘迫、日常照顾起居时的肢体擦碰，以及母职防线溃败时的慌乱。",
    "义姐": "父母重组家庭带来的无血缘姐姐，同住一个屋檐下。交代两人从最初的生疏客套到熟悉的过程，描写共用卫浴时的生活痕迹，以及姐弟名分下暗流涌动的暧昧越界。",
    "女教师": "在校园内维持着传道授业的严厉或知性形象，手持教鞭或讲义。突出讲台上的威严自持，与课后辅导、办公室独处时被学生抓住把柄或挑逗后的权威瓦解。",
    "护士": "身着护士服在医院穿梭，习惯了生老病死，态度职业化且略带冷淡。描写她熟练执行擦身、注射等医疗接触时的公事公办，以及夜班值班室里褪去白衣后的疲惫与放纵。",
    "女仆": "受雇于人或世代家生，日常工作是打理起居、端茶递水。明确雇佣契约的权限范围，描写她垂首敬语的恭顺仪态，以及将侍奉工作延伸至床笫之间时的敬业或隐忍。",
    "邻家阿姨": "住在隔壁的热心年长女性，看着晚辈长大，毫无防备心。描写她穿着宽松居家服串门送饭的熟稔、不经意间弯腰露出的风光，以及关系变质后怕被街坊听见的紧张感。",
    "年上": "在关系中处于年长一方，习惯将对方当作不成熟的孩童看待。描写她用阅历与经济优势进行居高临下的包容或掌控，以及当发现小辈展现出侵略性时的惊愕与失守。",
    "年下": "年龄明显小于对方，带着少年人的直球莽撞或稚气依赖。描写她仰视年长者时的崇拜目光、不顾后果的撒娇纠缠，以及用旺盛精力在体力上反向压制对方的反差。",
    "主仆": "确立绝对的上下级支配契约，日常有严格的称呼与跪拜礼仪。写明惩罚与奖赏的规则，展现仆从方在绝对服从表面下暗藏的觊觎，或主人方逐渐离不开侍奉的倒错。",
    "师生": "绑定传授与受教的伦理辈分，校园或师门是主要舞台。强调身份曝光会导致身败名裂的高压背景，描写白天课堂上装作不熟的视线躲闪，与私下独处时的禁忌狂热。",
    "依存": "将自我价值完全寄托在对方身上，缺乏独立生存的心理能力。交代产生重度依赖的创伤契机，描写分开片刻便会疯狂发消息确认行踪的焦虑，以及为留住对方不惜自毁的顺从。",
    "占有": "视对方为私有物，容不得其视线在旁人身上停留半秒。描写她查岗、翻看通讯记录的日常控制、在对方身上留下咬痕吻痕的宣誓主权行为，以及面对情敌时的阴冷敌意。",
    "背德": "双方处于世俗伦理或双方伴侣绝不容许的错位关系中。重点刻画每次欢好前后的道德自责、越是感到罪恶身体越是兴奋的扭曲心理，以及在熟人眼皮底下偷情的刺激。",
    "禁断": "跨越了血缘、种族或神圣戒律的绝对禁忌之恋。交代打破禁忌的沉重代价（如驱逐、神罚或社会性死亡），描写两人明知万劫不复却仍死死纠缠的宿命感与孤注一掷。",
    "调教": "存在明确的施教与受教过程，旨在重塑其羞耻心与身体反应。设定循序渐进的开发阶段（从言语羞辱到器具使用），记录她从抗拒哭泣到主动摆出迎合姿态的蜕变。",
    "夜袭": "习惯趁夜深人静、他人熟睡时悄然潜入卧房。描写屏住呼吸掀开被角的轻巧动作、借着月光凝视睡颜的痴迷，以及在半梦半醒间实施抚摸、怕吵醒又盼其醒来的微妙博弈。",
    "偷窥": "暗中观察特定对象的私密生活，通过门缝、孔洞或监控满足窥私欲。刻画躲在暗处屏息凝神的紧张感、目睹对方更衣或自慰时的瞳孔放大，以及一边窥视一边压抑喘息的自渎行为。",
    "隔墙": "与对象仅隔着一扇薄墙或屏风，甚至另一侧还有第三者在场。重点渲染极度压抑声音的感官体验，描写听着隔壁动静时的脸红心跳，或自己被侵犯时死死捂嘴怕被隔壁发现的惊险。",
    "醉酒": "酒量极浅或借酒浇愁，酒精会彻底麻痹其白日的理智防线。描写微醺时的眼神迷离与胡言乱语、将平时压抑的欲念全盘托出的主动缠人，以及次日宿醉醒来面对残局的断片窘迫。",
    "浴室": "将氤氲水汽与狭窄瓷砖空间作为高频触发剧情的场所。刻画湿发贴在脸颊的狼狈美感、水声掩盖下的暧昧喘息、打滑的沐浴露泡沫，以及赤裸相对时无处可逃的逼仄感。",
    "露出": "在半公开或极易被撞破的场所（如公园、楼道、真空上街）通过裸露身体获取快感。描写风吹过赤裸皮肤的战栗、听见远处脚步声时的心脏狂跳，以及在羞耻与兴奋夹击下的腿软高潮。",
    "寡妇": "亡夫留下遗产或债务，她在外人面前维持着端庄克制的贞妇体面。细致描写独守空房时的漫长黑夜、抚摸旧物时的空虚，以及面对图谋不轨的帮扶者时半推半就的沦陷。",
    "继母": "作为父亲的新婚妻子进入家庭，与继子年龄相仿甚至更年轻。写明她在家里微妙的外人处境、试图讨好继子却被当作女人看待的错位，以及趁父亲不在家时发生的越轨拉扯。",
    "养母": "含辛茹苦将无血缘的孩子抚养成人，对母亲这一角色有着近乎偏执的责任感。描写当养子长成健硕异性后，她面对那具熟悉又陌生的躯体时的心慌，以及亲情变质为男女之情时的崩溃。",
    "实妹": "同胞所生的亲妹妹，有着相似的眉眼与从小一起长大的默契。突出毫无界限感的居家穿着、斗嘴打闹时的肢体接触，以及一旦跨过血缘红线后那种熟悉感与极致羞耻交织的怪异欢愉。",
    "双子": "双胞胎中的一员，外貌近乎一模一样但性格或细节（如泪痣、发型）有微妙差异。设计两人从小被捆绑比较的心理、共用身份顶替的恶作剧，以及在亲密关系中吃醋或共享伴侣的扭曲共生。",
    "教授": "拥有极高学术地位的大学教授，掌握着学分与毕业论文的生杀大权。刻画其佩戴眼镜、言辞严谨的学者风范，以及在紧闭的办公室或实验室里，利用权力差对学生进行知性压迫或私密索取。",
    "医生": "手握听诊器与手术刀的临床医生，习惯用解剖学目光审视人体。描写其在问诊触诊时令患者羞耻却无法抗拒的专业指令，以及白大褂下隐藏的、喜欢看生命体在自己手中失控的支配欲。",
    "管家": "交代受雇渊源与掌管的宅邸事务。描写她佩戴白手套的严谨服务、用敬语掩盖的占有欲，以及在更衣或侍寝等私密照料中如何借规矩之名行越界之实。",
    "OL": "明确她的公司部门与职级。刻画白日里穿工装、踩高跟鞋的干练职场台风，对比下班或加班独处时卸下防备、解开领口纽扣后的疲态与反差渴求。",
    "秘书": "设定她掌握上司多少私人行程与把柄。写清她递交文件时的肢体擦碰、对公私界限的刻意模糊，以及在办公室反锁房门后从助理转为情妇的默契。",
    "巫女": "交代所属神社的规制与神职日常。描写宽大绯袴下的素净身体、常年熏香的冷冽体味，重点刻画她在严守净身戒律与凡俗情欲冲击之间的羞耻挣扎。",
    "修女": "明确教会戒律对她的束缚程度。描写被严密头巾与黑袍包裹下的压抑感、祈祷时为不洁念头忏悔的颤抖，以及在破戒边缘把欢愉当成苦修的扭曲心理。",
    "偶像": "设定她的营业人设与粉丝规模。写出舞台上的甜美假笑与私下里的疲惫空虚，强调地下恋情一旦曝光便会身败名裂的危机感，以及乔装幽会时的紧绷。",
    "主播": "明确直播类型与镜头前的营业风格。刻画她在屏幕前迎合打赏的娇嗔，对比关播后面对空房间的落寞，或是在镜头死角进行隐秘互动时的刺激感。",
    "摄影师": "交代她的拍摄领域与审美偏好。描写她举起取景框时极具侵略性的审视目光、引导模特摆出羞耻姿势时的专业口吻，以及从旁观者变为参与者的临界点。",
    "女警": "设定所属辖区与警衔。写出执勤时佩枪束发的威严与审讯口吻，对比下班脱掉制服或办案受制于人时，强装镇定却因身份落差而倍感屈辱的身体反应。",
    "女军官": "明确军阶与治军作风。描写挺括军装下的紧实身躯、习惯性下达命令的强硬语调，以及在卸下军衔的私密场合里，面对失控快感时咬牙硬撑的自尊心。",
    "老板娘": "交代经营的店铺类型与客流。写出她招呼熟客时游刃有余的世故风情、算账时的精明，以及打烊后独自守着空店、渴望有人能替她分担生计的柔软时刻。",
    "房东": "明确名下房产与收租方式。描写她攥着备用钥匙随时出入的底气、催租时似笑非笑的打量，以及利用居住权拿捏房客、或接受肉体抵租时的暧昧态度。",
    "青梅竹马": "交代两人相识年限与知根知底的黑历史。描写她无需客套的越界肢体接触、看到对方接触异性时的酸溜溜讥讽，以及试图把兄妹般的熟稔推向男女之情的试探。",
    "上司": "明确她的实权范围与高压管理风格。刻画她挑剔工作时的冷厉眼神、借绩效考核或留人加班施压的手段，以及在绝对职权优势下索取私密服从的傲慢。",
    "部下": "交代她在团队中的边缘或受气处境。描写她面对指令时低眉顺眼的服从姿态、汇报出错时攥紧衣角的惶恐，以及为了保住饭碗而默许上司肢体越界的隐忍。",
    "下属": "设定她直接向目标汇报的从属关系。写清她替对方打点琐事的尽心程度、公事公办背后藏着的仰慕，以及在深夜陪同应酬后顺理成章被带走的顺从感。",
    "学生会长": "明确她在校内的威望与执纪权限。描写她佩戴袖章、用校规训诫他人时的凛然姿态，对比私下里违背模范生形象时的强烈背德感与害怕被同学撞破的慌乱。",
    "图书管理员": "设定她管理的馆藏区域与清冷性情。描写她在高大书架间无声穿行的习惯、用气音提醒安静的克制，以及在僻静死角里顶着随时有人经过的风险进行亲密接触的战栗。",
    "列车员": "明确值乘的线路与班次。描写她穿制服推车巡视的端庄、车厢摇晃时不得不扶靠乘客的近身距离，以及在狭小乘务员室或夜间卧铺车厢里偷欢的局促感。",
    "侦探": "交代她的查案手段与调查委托。描写她观察痕迹时的锐利眼神、为了套取情报不惜以身犯险的胆识，以及在追查真相反被目标抓住把柄时的狼狈处境。",
    "杀手": "明确她的暗杀手法与雇佣规矩。刻画她处理伤口时的麻木、对生死的冷漠，重点写出她在任务失手或面对唯一不忍下手的目标时，卸下杀气后的生涩与脆弱。",
    "佣兵": "交代她的战场履历与谋生信条。描写她布满老茧的手掌、警觉的睡眠习惯，以及习惯了刀口舔血后面对温柔乡时的无所适从与粗暴直接的宣泄方式。",
    "微乳": "描写平坦胸口在宽松衣物下的空荡感与肋骨线条。写清她对发育不良的自卑或满不在乎，以及胸前敏感点被直接抚弄时无处缓冲、瞬间绷紧脊背的羞耻反应。",
    "丰满": "具体刻画胸臀的饱满围度、腰腹软肉的温热触感与走动时的肉感颤动。写出她挑选合身衣物的困扰、对旁人垂涎视线的习以为常，以及被用力揉捏时的深陷感。",
    "肌肉": "点明长期锻炼留下的腹肌马甲线与紧实大腿线条。描写发力时绷起的健美轮廓、远超常人的体力与压制力，以及这具充满力量感的躯体在被迫臣服时的强烈反差。",
    "短身": "明确不足常人的娇小身高与巨大的体型差。描写她与人交谈时不得不仰视的视角、被像抱小孩一样轻易托起时的气恼，以及在承受亲密行为时因尺寸悬殊带来的勉强感。",
    "短发": "描写清爽利落的发长与完全暴露的后颈线条。写出她洗漱吹干的随性、剧烈运动或动情时汗湿碎发贴在耳际的狼狈感，以及后颈皮肤被直接亲吻时的敏感战栗。",
    "双马尾": "明确发束扎起的高度与发饰。描写走动时发尾在颊边轻快摇晃的少女感，重点写出在亲密互动中双马尾被当作缰绳抓握或拉扯时，她被迫仰起头的羞愤与顺从。",
    "单马尾": "描写高高束起或低垂一侧的马尾形态与露出的耳廓。写出她日常绑头发时咬着发圈的诱人姿态，以及在散开皮筋瞬间长发倾泻而下、从干练转为柔顺的视觉落差。",
    "卷发": "明确卷发的弧度与蓬松质感。描写她每日精心打理发梢的习惯、受潮或出汗后卷度凌乱缠绕在肩头的慵懒风情，以及手指穿插进微卷发丝时微凉柔滑的触感。",
    "银发": "交代这头显眼银发的成因（天生、异族或早衰）。描写发丝在光线下的冷冽光泽、走在人群中惹来注视的疏离感，以及情动潮红从白皙脸颊蔓延到银色发根的视觉冲击。",
    "单片眼镜": "明确佩戴在左眼或右眼及细链垂落的位置。描写她透过镜片审视他人时的精明与距离感、抬手扶镜框的习惯动作，以及镜片被热气熏出白雾或脱落时暴露出的失控眼神。",
    "美人痣": "明确这颗痣长在眼角、唇边、锁骨还是隐秘部位。描写这颗痣如何成为视觉焦点，以及当他人目光停留或用指尖、舌尖刻意描摹这颗痣时，她如同被抓住弱点般的轻颤。",
    "雀斑": "描写鼻梁与双颊上细碎雀斑的分布。写出她日常是否用粉底遮掩、被人凑近细看时的局促不安，以及在素颜或流汗脱妆后，雀斑随红晕一同浮现时的质朴稚拙感。",
    "胎记": "明确胎记的形状、颜色及位于何处私密肌肤。交代这块印记关联的身世或传闻，写出她平时严密遮挡的讳莫如深，以及唯独在绝对亲密时才容许对方触碰的交付感。",
    "疤痕": "交代这道旧伤疤的来历与具体位置。描写粗糙凸起的疤痕组织与周围细腻皮肤的触感反差、她日常穿衣刻意遮蔽的习惯，以及疤痕被温柔抚摸或亲吻时她的僵硬与动容。",
    "纹身": "明确刺青的图案含义與隐藏在衣物下的位置。交代她当初忍痛纹身的理由，写出在日常场合严防走光露馅的谨慎，以及脱衣后图案随肌肉起伏时的野性或妖冶观感。",
    "精灵耳": "描写长而尖的耳廓形态与平时用长发或兜帽遮掩的习惯。重点刻画耳尖远超常人的神经敏感度：一旦被吹气、揉搓或轻咬，耳尖便会迅速充血泛红并伴随全身瘫软。",
    "獠牙": "描写唇齿微张时露出的尖锐犬齿。交代其种族血统或特殊体质，写出她笑起来时带有的危险侵略感、情绪激动时磨牙的习惯，以及动情时克制不住咬破对方皮肉的嗜血冲动。",
    "鳞片": "明确鳞片生长的局部位置（如腰侧、大腿内侧或脊背）与异族血统来源。描写鳞片冰凉坚硬的触感、平时用衣物死死遮盖的羞耻心，以及发情或受激时鳞片微微张开的生理反应。",
    "触角": "交代头顶触角的种族特征与感知功能。描写触角随她情绪起伏而摆动或耷拉的诚实反应，重点刻画触角作为极度敏感带被握住揉弄时，她瞬间丧失反抗力、大脑空白的失态。",
    "过膝袜": "明确袜子材质与颜色，重点描写袜口将大腿软肉勒出的一圈微陷弧度（绝对领域）。写出她走路时提拉袜口的细节，以及保留过膝袜进行亲密行为时的视觉色气。",
    "吊带袜": "描写蕾丝袜圈、金属袜夹勾住丝袜并绷紧大腿肉的精致构造。写出她穿戴时的繁琐仪式感、裙下走动时吊带紧绷的隐秘触感，以及袜夹被弹开瞬间啪的一声脆响。",
    "渔网袜": "明确网眼的大小疏密与包裹范围。描写柔嫩皮肉从黑色网格中被挤压凸出的勒痕感、粗糙网线摩擦肌肤的微痒，以及她明知这身装扮极具风尘挑逗意味却依然穿上的心理。",
    "水手服": "明确领巾款式、百褶裙长度与是否露腰。交代她穿这身制服的合规身份或私下角色扮演的癖好，描写弯腰或起风时谨防裙底走光的局促，以及纯真校服被弄乱时的凌虐美感。",
    "浴衣": "描写棉麻布料的纹样、束紧腰带的繁复以及不穿内衣或仅穿兜裆布的传统穿法。刻画她迈小碎步时的拘谨、后颈衣领微敞的诱惑，以及腰带一抽即散、下摆轻易被撩开的脆弱防守。",
    "旗袍": "明确锦缎或丝绒材质、立领盘扣的紧绷度以及大腿两侧的高开衩位置。描写紧身剪裁勾勒出的胸臀曲线、坐下或迈步时开衩处若隐若现的腿根，以及不脱衣服直接撩起裙摆的便利与孟浪。",
    "蕾丝": "描写贴身衣物上繁复钩花的镂空图案与半透明质感。写出粗糙蕾丝边缘持续摩擦乳首或私密处带来的微痒刺痛感，以及她在端庄外衣下暗藏华丽蕾丝内衣的闷骚心理。",
    "丁字裤": "描写细绳深陷臀缝、前方仅有一小片布料勉强遮挡的极简款式。写出她日常走动或坐下时绳索不断磨蹭敏感部位的异物感与湿润感，以及害怕弯腰露出的羞耻紧绷。",
    "开裆": "明确开裆内裤或连体袜的款式与穿着缘由（被迫服从或主动迎合）。描写表面衣冠楚楚、实则私处毫无遮挡直面空气或裙底摩擦的背德感，以及无需褪去衣物即可被直接侵入的便利。",
    "围裙": "明确是罩在便服外还是真空裸体围裙。描写系带在背后打结勾勒出的腰线、侧边完全漏空的半球与臀部弧度，以及她在厨房忙碌时伴随着油烟热气与走光风险的人妻居家感。",
    "泳装": "明确是死库水、高叉竞技泳衣还是细绳比基尼。描写布料紧绷勒进肉里的边缘、出水后湿透的布料死死贴合身体轮廓甚至透出乳首形状的尴尬，以及她遮掩胸口或臀部的局促动作。",
    "紧身衣": "明确乳胶、氨纶或皮质等不透气材质。描写从脖颈包裹到脚踝的强烈束缚感、汗水积聚在衣服内侧的黏腻，以及全身曲线乃至私处轮廓都被毫无保留勒出来的羞耻自知。",
    "皮衣": "描写皮革特有的腥甜气味、冰凉触感与紧绷的拉链扣具。写出她活动肢体时皮料摩擦发出的吱呀声响、威风凛凛的压迫感，以及皮衣被汗水浸湿贴在皮肤上的闷热反差。",
    "高跟鞋": "明确鞋跟高度与细跟款式。描写足弓被迫高高拱起的紧绷线条、走路时哒哒作响的气场，以及久站后的酸胀、脱鞋瞬间的如释重负，或是在床笫间唯独留着高跟鞋不脱的艳丽。",
    "面纱": "明确面纱遮挡的部位与轻薄透光度。交代遮面的宗教习俗或神秘身份，描写面纱下若隐若现的唇形、说话时纱布随呼吸起伏的朦胧美，以及面纱被外人强行揭开时的惊慌失措。",
    "耳饰": "明确耳环或耳钉的金属材质与坠饰重量。描写她转头时耳饰摇晃擦过脖颈的细碎声响，以及在亲密纠缠中耳垂连同金属耳饰被含住吸吮、甚至被轻微拉扯时的刺痛与战栗。",
    "乳环": "交代她在敏感乳首穿环的过往契机（惩罚烙印或隐秘叛逆）。描写金属环冰凉的异物感、隔着薄衣凸起的明显轮廓，以及被勾住拉扯时痛感与强烈快感交织的失控反应。",
    "脐环": "明确肚脐处坠饰的造型与镶嵌物。描写她穿露脐装时金属环随呼吸与腰肢扭动闪烁的惹眼细节，以及当对方顺着小腹一路向下亲吻、用舌尖拨弄脐环时她小腹骤然绷紧的敏感。",
    "温柔": "通过轻声细语的安抚、替人整理衣角的体贴动作展现她的和煦。但必须明确她温柔的底线：是为了全盘包容而委屈自己，还是用滴水不漏的温柔编织让人无法挣脱的依赖网。",
    "羞怯": "刻画她与人对视不到三秒就移开目光、耳根迅速充血的生理反应。写出她被调戏时手指绞紧衣角、声音越说越像蚊子叫的窘迫，以及在半推半就间因羞于喊停而任人摆布的顺从。",
    "弱气": "表现在说话习惯性带道歉、面对强硬要求不敢说不的讨好型人格。描写她勉强答应过分请求时眼角泛泪的委屈表情、承受越界行为时的瑟缩，以及事后独自咬唇懊悔的无力感。",
    "强势": "体现在不容置疑的祈使句口吻、极具压迫感的视线与主动控场的肢体动作。重点刻画她习惯于发号施令的自傲，以及当她在私密博弈中被强行压制、夺走主导权时咬牙切齿的不甘。",
    "冷静": "描写她面对突发状况或露骨挑逗时平稳的呼吸、毫无波澜的声线与理智分析的习惯。重点设计她面具碎裂的临界点：当生理快感彻底压倒理性时，她死死抓着床单试图维持体面的反差。",
    "癫狂": "表现在大起大落的情绪、神经质的笑声与毫无逻辑的极端言行。描写她陷入兴奋或执念时瞳孔放大的狂热状态、夹杂着爱意与毁灭欲的粗暴字眼，以及旁人随时怕她失控的危险感。",
    "伪善": "刻画她人前无懈可击的体贴微笑与道德模范做派，对比她内心的冷漠算计与利己动机。写出她如何用善意作筹码操控人心，以及被彻底撕下伪装时非但不慌、反而露出恶劣真容的从容。",
    "隐忍": "描写她受委屈或剧痛时一声不吭、把嘴唇咬出血印的倔强习惯。交代她不得不忍耐的苦衷，重点铺垫她长期积压的情绪或情欲一旦突破阈值，在暗处彻底崩溃哭喊的爆发力。",
    "黏人": "表现在毫无私人空间概念的肢体贴靠、密集的信息轰炸与随时随地索要关注。描写她像藤蔓一样缠在对方身上的温顺，以及一旦被冷落或推开便会立刻陷入焦虑、患得患失的脆弱。",
    "疏离": "通过礼貌却客套的称呼、不动声色后退半步的肢体语言展现她的冷淡防线。交代她排斥亲密关系的心理成因，并突出当她罕见地允许某人进入安全距离、主动靠过来时的珍贵反差。",
    "慵懒": "描写她总是没骨头般倚靠在沙发上、说话拖长尾音、连抬手都嫌麻烦的散漫姿态。写出她衣衫不整的随性，以及在亲密互动中懒得动弹、任由对方折腾并哼哼唧唧享受的怠惰感。",
    "洁癖": "设定她随身携带消毒用品、抗拒他人触碰的严苛卫生标准。描写她在被迫接触汗水、唾液或体液时眉头紧锁的生理性厌恶，以及在情欲上头时一边嫌脏发抖、一边沉沦其中的挣扎。",
    "急躁": "表现在频繁看表、用脚尖点地催促、一句话没听完就打断的暴躁脾气。描写她缺乏耐心的行事作风，以及在亲密前戏中被故意放慢节奏吊胃口时，焦躁难耐到主动扑上去索取的直白。",
    "困倦": "刻画她随时都在打哈欠、眼角泛着生理性泪水、反应慢半拍的迷糊状态。描写她毫无防备的睡姿，以及在半梦半醒间被人上下其手时，分不清梦境与现实而发出软糯鼻音的易推倒特质。",
    "前后辈": "明确双方在学业或职场上的资历差距与敬语使用规范。描写前辈摆架子的指导或后辈笨拙的讨好，重点刻画在私密越界时，敬语称呼被喘息打乱、上下尊卑关系被颠覆的背德刺激。",
    "医患": "设定具体的问诊科室与长期治疗关系。描写听诊器或橡胶手套接触皮肤时的冰凉专业感、打着检查旗号进行的羞耻触碰，以及患者在白大褂权威下不敢反抗、乖乖敞开身体的顺从。",
    "债主": "明确债务数额、形成原因与还不上的窘境。无论她是冷酷催收的债主还是拿身体抵债的欠债人，都要写出金钱契约压迫下的尊严碾压，以及每次欢好都被明码标价换算成利息的屈辱感。",
    "陌生人": "交代两人毫无交集的背景与偶然同处一室的契机。描写不知对方姓名底细带来的神秘感与戒备心，以及正因为以后不会再见、无需承担社会后果而彻底放飞本能的露水欢愉。",
    "三角": "明确第三方的身份（正牌伴侣、挚友或死敌）及三人的关系网。写出她在两人之间周旋时的负罪感或虚荣心、时刻提防另一方察觉的紧绷，以及在亲密时故意提及第三人带来的扭曲刺激。",
    "单恋": "刻画她暗中注视对方时的炽热眼神、借故制造偶遇的笨拙小心思。描写她话里话外试探却被迟钝略过时的失落，以及在独处或自慰时念着对方名字、靠幻想聊以慰藉的卑微痴情。",
    "嫉妒": "明确引发她醋意的假想敌与触发场景。描写她闻到对方身上陌生香气时瞬间冷下来的脸色、阴阳怪气的质问，以及通过激烈的肢体纠缠、在对方身上留下咬痕来宣示主权的狂乱。",
    "保护欲": "交代她执着于庇护对方的缘由。描写她挡在身前处理麻烦的可靠感，但要写出这种保护欲滑向控制欲的窒息面：为了绝对安全而限制对方社交，甚至想把人金屋藏娇的偏执。",
    "利用": "明确她接近对方所图谋的具体利益（情报、金钱、地位或跳板）。描写她逢场作戏时的甜言蜜语与身体献媚、心底冷静评估价值的疏离，以及算计败露后反被对方拿捏把柄时的求饶。",
    "共犯": "设定两人共同犯下的违规或罪行及一旦曝光的严重后果。描写这条绳上的蚂蚱关系带来的病态信任与互相钳制，写出在惶恐不安的逃亡或隐瞒中，唯有靠疯狂交合才能确认彼此的依存感。",
    "复仇": "交代深仇大恨的来龙去脉与她隐忍筹备的报复计划。描写她接近仇人时的咬牙伪装，或是将仇人踩在脚下肆意羞辱的快意，重点刻画在复仇过程中不慎夹杂了生理沉沦与恨海情天的挣扎。",
    "交换": "明确双方各取所需的交易筹码（如资源置换、庇护换陪伴）。描写她在履行肉体或情感义务时公事公办的态度、心里算得一清二楚的账目，以及当某一方开始贪心索要契约之外的感情时的失衡。",
    "拉锯": "刻画两人势均力敌、谁也不肯先服软的高手过招状态。描写日常对话中的机锋试探、亲密时争夺上下位控制权的较劲，以及谁先动情失控谁就输掉底牌的紧张博弈感。",
    "旧情": "明确当年分手的症结与阔别重逢的尴尬处境。描写两人在客套寒暄下暗流涌动的默契、对彼此身体敏感带了如指掌的肌肉记忆，以及旧怨未消却又迅速滚回床单的纠缠不清。",
    "婚外": "明确配偶的存在（如无名指婚戒、家人的电话）。描写她在背叛婚姻时的道德负罪感与偷情带来的病态快感，重点刻画接听伴侣电话时还在承受欢好的惊险刺激，以及害怕家庭破碎的患得患失。",
    "秘密关系": "交代这段关系绝对不能公开的客观阻碍（身份悬殊、伦理禁忌或利益冲突）。描写人前装作不熟的冷淡演技、只敢在暗处交换的眼神，以及在随时可能被熟人撞破的死角里仓促偷欢的紧迫感。",
    "电车": "设定早晚高峰被挤得水泄不通的通勤车厢环境。描写她在摇晃中无处躲避的贴身摩擦、对臀部或大腿异样触感的惊慌僵硬，以及为了避免当众出丑而死死咬唇、强忍喘息的屈辱无助。",
    "更衣室": "描写狭窄逼仄的试衣间或带储物柜的集体更衣室布局。刻画她半褪衣物露出内衣或裸背的脆弱状态、门外脚步声与交谈声带来的极度紧张，以及在隔板后被捂住嘴强行亲密时的窒息感。",
    "图书馆": "营造高大书架遮挡视线、四周皆是安静阅读者的绝对静谧氛围。描写她压到极致的呼吸声、衣服摩擦都显得刺耳的心理压力，以及在裙下被隐秘侵犯时既要维持上半身端庄又要防备旁人经过的煎熬。",
    "泳池": "描写弥漫着消毒水气味的水面、回荡的水声与湿滑的池边瓷砖。刻画她被水浸湿后死死贴在身上的泳衣、水下借着波光掩护进行的隐秘抚摸，以及出水时浑身滴水、体温微凉的狼狈诱惑。",
    "露天": "明确荒郊野外、天台或公园暗处等无遮挡的户外场所。描写夜风吹拂裸露肌肤的凉意与起鸡皮疙瘩的生理反应、草丛或石阶的粗糙触感，以及远处一点风吹草动就怕被人窥见的羞耻与战栗。",
    "雨中": "描写暴雨倾盆或屋檐避雨的潮湿环境。刻画雨水打湿长发与白衬衫后近乎透明地贴在肌肤上的视觉冲击、浑身冰冷发抖时对温热躯体的本能依偎，以及雨声掩盖下肆无忌惮的喘息。",
    "停电": "营造伸手不见五指的密闭黑暗环境。描写视觉剥夺后她对未知的恐惧或卸下羞耻心的解放感，重点放大黑暗中的听觉与触觉细节：粗重的呼吸、水声、摸索的指尖以及看不到对方表情的悬念。",
    "办公室": "明确百叶窗半掩、办公桌文件散乱的职场环境与加班时段。描写百叶窗外可能还有同事走动的风险、把她压在办公桌或转椅上弄乱工装的凌乱感，以及公事场所被染上情色气息的强烈背德。",
    "夜班": "设定深夜空旷的写字楼、病房或便利店，强调只有她一人值守的孤寂与困顿。描写惨白灯光下的疲惫防线、凌晨时分理智最薄弱的状态，以及在监控死角或休息室里寻求刺激驱散倦意的放纵。",
    "值夜": "明确需要彻夜看守的场所（如宿舍查房、营地岗哨或祠堂守夜）。描写万籁俱寂中紧绷的神经、巡逻手电筒扫过的光影，以及在严禁擅离职守的职责下，于黑暗角落里偷偷进行肉体交缠的违纪快感。",
    "出差": "交代远离日常熟人圈的异地城市与同住酒店的契机。描写洗去旅途疲惫后的松弛感、借着酒意或陌生环境卸下平日伪装的借口，以及抱着“出了这个房间就当没发生过”的心理彻底沉沦的疯狂。",
    "同床": "设定因房间不足或特殊原因不得不共眠一榻的窘境。描写两人之间刻意划定的楚河汉界、黑暗中清晰可闻的呼吸与翻转身时的被褥摩擦，以及半夜睡姿越界、体温交融后擦枪走火的试探。",
    "偷听": "明确隔着门板、墙壁或帘幕听见他人私密动静的场景。描写她屏住呼吸、心跳如雷的紧张感，写出偷听到的淫靡声响或秘密如何勾起她自己的生理潮热，以及生怕发出一点声音暴露行踪的窘迫。",
    "监视": "交代她利用监控摄像头、望远镜或猫眼长期窥探目标的习惯（或被窥探的处境）。描写暗中观察他人私生活时的病态占有欲与掌控感，或是察觉到暗处有视线盯着自己一举一动时的毛骨悚然与隐秘兴奋。",
    "电话": "设定在不能暴露现场状况的场合（如家人查岗、工作汇报）接听电话。描写她一边握着手机强装镇定地正常应答，一边承受着对方在暗处的恶意抚弄，声音里极力压抑却漏出破绽的颤音与鼻音。",
    "直播": "明确镜头正对着她、弹幕实时滚动的在线状态。描写她面对成百上千不知情观众时的紧绷假笑，重点刻画在镜头拍不到的桌下或画外承受隐秘玩弄时，既要维持人设又怕失声叫出来的极致刺激。",
    "录像": "设定亲密过程被摄像机或手机镜头全程记录的情境。描写她面对闪着红点的镜头时无处遁形的羞耻感、被迫对着镜头说出孟浪台词的屈辱，以及对录像一旦流出便会彻底社死的恐惧与受制于人。",
    "镜前": "明确全身镜或浴室镜前的摆位。描写她在亲密过程中被迫睁眼看着镜中自己潮红失态、衣衫不整的淫靡模样，写出视觉与触觉双重反馈下羞耻心翻倍、想闭眼或转头却被捏住下巴强迫直视的崩溃感。",
    "窗外": "设定落地窗前、阳台边缘或未拉严窗帘的室内。描写窗外车水马龙或对面楼宇灯光带来的暴露风险、身体贴在冰凉玻璃上的温差刺激，以及明明害怕被路人抬头看见却又在羞耻中达到高潮的战栗。",
    "痉挛": "描写高潮或重度刺激后肌肉完全脱离意识控制的剧烈抽搐。细化到绷直的脚趾、一阵阵收缩的小腹与止不住打颤的大腿内侧，写出余韵绵长到让她瘫软如泥、连一根手指都抬不起来的虚脱状态。",
    "漏尿": "设定在极度恐惧、羞耻或高潮失控时括约肌失守的生理反应。描写温热液体不受控制地渗出打湿内裤与大腿根的狼狈细节、她试图夹紧双腿遮掩的徒劳，以及当众失态后恨不得找地缝钻进去的羞愤哭腔。",
    "乳汁": "交代非孕期泌乳的特殊体质、药物改造或催乳调教成因。描写乳房胀满时的酸麻不适、乳首被吸吮或挤压时白色乳汁溢出的视觉色气与甜腻气味，以及她对这具如同母畜般泌乳的身体感到的羞耻与认命。",
    "发情": "交代发情期的生理机制（兽人血统、魅魔体质或药物后遗症）。描写发作前体温升高、呼吸滚烫、私处湿透的前兆，以及一旦彻底发作便会理智断线、主动磨蹭索求交合，事后清醒又羞愧难当的反差。",
    "汗湿": "描写她极易出汗的体质或激烈纠缠后的大汗淋漓状态。细化到顺着锁骨滑进乳沟的汗珠、湿透后黏在皮肤上的碎发与薄衣、空气中弥漫的微咸热气与浓郁体香，营造黏腻滚烫的肉欲质感。",
    "颤抖": "刻画她在极度紧张、恐惧或强忍快感时无法抑制的生理震颤。点明最先开始抖的部位（如膝盖、指尖或双唇），描写她越是用力抱紧自己试图掩饰，身体反而抖得像筛糠一样暴露内心防线崩溃的细节。",
    "失禁": "描写超越生理承受极限的强烈高潮或绝望恐惧下，彻底丧失排泄控制权的崩溃场面。刻画液体汩汩流淌一地的声响与骚热气味、她大脑一片空白眼神失焦的木然，以及回过神来后尊严被彻底击碎的呜咽。",
    "昏厥": "设定她体力透支、痛感或高潮过载时的耐受阈值。描写意识抽离前翻白眼、四肢抽搐继而彻底软倒的瞬间，以及醒来后对昏迷期间身体被如何摆布一无所知的茫然、酸痛与后怕。",
    "依赖性": "交代成瘾的来源（特定人物的安抚、药物或长期肉体调教）。描写她离开依恋对象时的戒断反应：焦躁不安、失眠发冷，对比一旦被对方拥抱或进入时瞬间平息喘息、哪怕被当作玩物也甘之如饴的病态顺从。"
};

const LEN = {
    char: [1200, 2200],
    body: [600, 1200],
    sex: [900, 1800],
    guide: [400, 900],
};

const SYSTEM = "你是角色卡转世界书条目的转换器。你的任务是将输入的素材转换为正式、完整、可被 AI 认知并主动调用的世界书角色数据。\n\n【核心架构与字数要求】\n你输出的 JSON 数据将被程序自动组装为世界书的 **3 个独立条目**。请确保各部分内容充实、边界清晰、互不重复：\n1. **条目①「角色卡 X」**（对应 JSON 的 `position` + `character`）：负责基调、身份、背景、人际关系、性格、语言与日常习惯。外貌仅写发型面部、日常服饰、标志物及一句整体轮廓（如丰腴、纤细），**严禁写具体三围尺寸与私处细节**。（建议合计 800~1500 字）\n2. **条目②「身体与性癖 X」**（程序将 JSON 的 `body` 身体配置段 + `sex` 性癖档案段合并为一条）：\n   - `body`（身体配置）：负责具体尺寸、形状、质感、私处细节、非人形态。\n   - `sex`（性癖档案）：负责敏感带、生理与精神弱点、NSFW 偏好、特殊癖好与性技巧（不重复 `body` 中的尺寸数字）。\n   - 需结合角色的种族、权能、体型深度定制，拒绝通用模板。（`body` 与 `sex` 建议合计 800~1500 字）\n3. **条目③「X_行为落地指南」**（对应 JSON 的 `guide`）：负责角色在剧情中的具体行为反应模式。（建议 300~800 字）\n   - 另外 `appear` / `appearKeys` / `dispatch` 不单独成条：程序会把 `dispatch` 追加进共用的「出场调度表」、`appearKeys` 写进出场关键词，`appear` 用于更新行动路线。\n\n【五大铁律】\n① **种族不改**：素材是什么种族就是什么，纯人类绝不改为魅魔或亚人，纯人类在非人形态字段一律填 `\"无\"`。\n② **设定照搬**：素材已写明的外貌、体型、服装、说话方式、口癖、行为习惯，必须完整保留，不得篡改。\n③ **合理补全**：素材未提及的空白项，按角色基调补全得自成一体、具体生动，严禁敷衍留空。\n④ **世界观对齐**：以主卡世界观为准；能与现有世界融合则融合，严重冲突的设定直接丢弃并在 `warnings` 说明。\n⑤ **关键词（keys）硬约束**：`keys` 数组必须包含**角色全名**（触发关键），外加 1~2 个昵称或别称；`keys` 与 `appearKeys` 中的**任何一项都严禁包含空格**，必须是一项一个词。\n\n【性别与身体配置硬规则 · 写错即报废】\n1. **性别判定**：优先以素材明确性别为准；未写明则按名字/称谓/旁人称呼推断；无法推断则默认按女性写，并在 `warnings` 中注明 `\"性别按推断\"`。\n2. **按性别严格填写 `body` 字段（严禁生理结构矛盾）**：\n   - **女性角色**：完整填写胸部、`vulva_*`（小穴）、`anus_*`（菊穴）；所有标注为 `（男性）` 的 `penis_*`、`testicle_*` 字段必须全部填 `\"无\"`。\n   - **男性角色**：必须为男性体型，`chest_size` 填 `\"平坦\"`，`chest_shape` 与 `nipple` 按男性特征填写；完整填写 `penis_*`（肉棒）、`testicle_*`（睾丸与阴囊）、`anus_*`（菊穴）；所有女性专属的 `vulva_*`（小穴）字段必须全部填 `\"无\"`，严禁出现小穴、阴道、子宫、女性名器或女性化乳晕描写。\n   - **双性 / 扶她 / 雌雄同体**：女性与男性的所有私处字段（`vulva_*`、`penis_*`、`testicle_*`、`anus_*`）**两套全部完整填写**，并在 `body.type`（整体身材）中明确注明为双性/扶她。\n   - **一致性检查**：任何字段的内容绝不能与字段名或角色性别自相矛盾（如禁止在 `vulva_shape` 中描写男性器官）。\n\n【人际关系硬要求 · 决定能否自然被提及】\n- `rel_user`（与{{user}}的关系（用户角色））：必须具体可感（如“同一栋楼的邻居，常在楼下碰见”），严禁填“陌生人”“路人”等无效关系。\n- `rel_list`（与既有角色的关系）：至少包含 1 个具体人物，`who` **必须是 `<已存在>` 名单或主角身边已出场人物的名字**；`how` 必须写清双方关系及“为什么这个人会在日常中提起她”（如：同事、同学、母子、老邻居）。\n- **拒绝孤岛角色**：若素材中她与谁都不认识，必须为她安排一个既有环境连接点（同一单位、同一栋楼、同一条街），确保她能被自然引入。\n\n【行为落地指南（guide）与出场时机（appear）规范】\n1. **行为落地指南（`guide`）**：设计 3~5 条具体的行为反应路线（涵盖日常互动、情绪波动、亲密接触或特殊情境），写明触发条件（`trigger`）、具体动作表现（`action`）与细节特写（`detail`），指导 AI 在正文中如何扮演该角色。\n2. **出场时机（`appear`）—— 写成【介入机会】而非时间轴**：\n   - `hooks`：提供 4~6 个“信号 → 出场方式”，`signal` 必须是正文里可能出现的具体场景、物件、话题或他人台词，**严禁出现具体钟点时刻（如 07:30）**。\n   - `threads`：她能挂靠的现有事件线（如：`便利店夜班 ←→ 主角深夜买东西`）。\n   - `presence`：她不在场时的存在感痕迹（如：群消息、传闻、遗留物品）。\n   - `rules`：在场硬约束（如：每轮最多 3 人在场、只 1 个主场）。\n   - `appearKeys`：4~6 个触发她出场的**纯场景词/地点词**（如：`便利店`、`收银台`、`夜班`），**严禁包含角色名字或空格**。\n   - `dispatch`：仅写一行，用于追加至共用「出场调度表」。格式：`场景信号 → 名字（一句话定位；可由谁带进来）`。示例：`便利店夜班 → 佐野澪（收银台后先抬眼；可由角色戊提起）`。\n\n【输出格式要求】\n- **仅输出一个严格合法的 JSON 对象**，严禁使用 ```json 代码块包裹，严禁在 JSON 前后输出任何解释文字，严禁在字段值内嵌套 `<body_configuration>` 或 `<sexual_profile>` 等 XML 标签。\n- 必须 1:1 保持以下 JSON 的所有键名（Key）与层级结构，字段一个都不能少：\n\n{\n  \"position\": {\n    \"race\": \"种族\",\n    \"relation\": \"与{{user}}的核心关系定位\",\n    \"informed\": \"对背景/异常事件的知情程度\",\n    \"timing\": \"主要活跃与切入时机\",\n    \"tone\": \"角色整体基调\"\n  },\n  \"character\": {\n    \"name\": \"角色全名\",\n    \"nickname\": \"昵称1, 昵称2\",\n    \"tone\": \"一个定位词——一句说明\",\n    \"gender\": \"男/女/扶她(双性)\",\n    \"age\": \"年龄\",\n    \"race\": \"具体种族\",\n    \"job\": \"职业或身份\",\n    \"tags\": \"三个短标签, 逗号分隔\",\n    \"rel_user\": \"与{{user}}的具体关系及日常交集方式\",\n    \"informed\": \"具体知道什么、不知道什么\",\n    \"timing\": \"什么场景、什么时段会自然出现\",\n    \"rel_list\": [\n      {\n        \"who\": \"必须是<已存在>名单或主角身边出现过的人名\",\n        \"how\": \"关系一句话，说明她为什么会被这个人提起\"\n      }\n    ],\n    \"bg_origin\": \"出身背景，完整一段\",\n    \"bg_residence\": \"当前居住环境与生活状态，完整一段\",\n    \"bg_exp1_title\": \"重要经历1标题\",\n    \"bg_exp1_text\": \"重要经历1详情\",\n    \"bg_exp2_title\": \"重要经历2标题\",\n    \"bg_exp2_text\": \"重要经历2详情\",\n    \"bg_exp3_title\": \"重要经历3标题\",\n    \"bg_exp3_text\": \"重要经历3详情\",\n    \"ap_body\": \"整体身形与体格轮廓（一句概括，不写具体尺寸与私处）\",\n    \"ap_face\": \"发型、发色、瞳色与面部五官特征\",\n    \"ap_clothes\": \"日常服饰风格与常穿衣物\",\n    \"ap_mark\": \"个人标志物或随身配饰\",\n    \"ap_habits\": \"2~3个日常下意识小动作\",\n    \"sp_pace\": \"语速、音量与声线质感\",\n    \"sp_quirk\": \"口癖与用词习惯\",\n    \"sp_call\": \"如何称呼{{user}}（日常/亲密时）\",\n    \"sp_ex1\": \"典型台词示例1\",\n    \"sp_ex2\": \"典型台词示例2\",\n    \"sp_ex3\": \"典型台词示例3\",\n    \"pe_surface\": \"表面性格（别人看到的样子）\",\n    \"pe_inner\": \"内核性格（实际驱动她的逻辑与情感）\",\n    \"pe_bottom\": \"底线与逆鳞（什么情况下会翻脸或退缩）\",\n    \"core\": [\n      {\n        \"tag\": \"行为内核名（建议2~3个）\",\n        \"desc\": \"一段具体说明\"\n      }\n    ],\n    \"traces\": [\n      \"生活/场景细节痕迹1\",\n      \"生活/场景细节痕迹2\",\n      \"生活/场景细节痕迹3\"\n    ]\n  },\n  \"body\": {\n    \"type\": \"整体身材类型（双性/扶她需在此注明）\",\n    \"ratio\": \"整体头身与肢体比例\",\n    \"chest_size\": \"胸部尺寸如38G（男性填：平坦）\",\n    \"chest_shape\": \"胸部形状（男性按男性胸肌/胸廓写或填：无）\",\n    \"nipple\": \"乳头与乳晕颜色、大小、形态\",\n    \"waist\": \"腰部特征\",\n    \"whr\": \"腰臀比\",\n    \"hip_shape\": \"臀部形状\",\n    \"hip_texture\": \"臀部触感与弹性\",\n    \"pube\": \"阴部毛发状态与形状\",\n    \"vulva_shape\": \"（女性/双性）小穴外部形态（男性填：无）\",\n    \"vulva_color\": \"（女性/双性）小穴颜色（男性填：无）\",\n    \"vulva_sensitivity\": \"（女性/双性）小穴敏感度与反应（男性填：无）\",\n    \"vulva_name\": \"（女性/双性）小穴名器说法（男性填：无）\",\n    \"vulva_feature\": \"（女性/双性）小穴内部褶皱、温度、紧致度等特征（男性填：无）\",\n    \"penis_size\": \"（男性/双性）肉棒常态与勃起尺寸（女性填：无）\",\n    \"penis_shape\": \"（男性/双性）肉棒形态与弯曲度（女性填：无）\",\n    \"penis_color\": \"（男性/双性）肉棒颜色（女性填：无）\",\n    \"penis_foreskin\": \"（男性/双性）包皮状态（女性填：无）\",\n    \"penis_sensitivity\": \"（男性/双性）肉棒敏感度（女性填：无）\",\n    \"penis_feature\": \"（男性/双性）青筋、冠状沟、马眼或名器特征（女性填：无）\",\n    \"testicle_size\": \"（男性/双性）睾丸与阴囊大小（女性填：无）\",\n    \"testicle_shape\": \"（男性/双性）睾丸与阴囊形态（女性填：无）\",\n    \"testicle_color\": \"（男性/双性）阴囊颜色（女性填：无）\",\n    \"testicle_sensitivity\": \"（男性/双性）睾丸与阴囊敏感度（女性填：无）\",\n    \"anus_shape\": \"菊穴褶皱与外部形态\",\n    \"anus_color\": \"菊穴颜色\",\n    \"anus_name\": \"菊穴名器说法\",\n    \"anus_feature\": \"菊穴紧致度、内部触感与特征\",\n    \"legs\": \"大腿、小腿与足部形态\",\n    \"muscle_clarity\": \"肌肉线条清晰度\",\n    \"muscle_spread\": \"肌肉分布情况\",\n    \"skin_color\": \"皮肤颜色\",\n    \"skin_texture\": \"皮肤触感与光滑度\",\n    \"skin_feature\": \"特殊皮肤特征（如痣、疤痕、纹身、体香等）\",\n    \"posture\": \"日常站姿、坐姿与步态特征\",\n    \"demi_name\": \"半妖/非人形态姿态名称（纯人类必须填：无）\",\n    \"demi_manifest\": \"非人特征具体显化部位与形态（纯人类填：无）\",\n    \"demi_aura\": \"非人形态下的整体气场与感官影响（纯人类填：无）\"\n  },\n  \"sex\": {\n    \"tag\": \"性标签（一句话总结核心性特征）\",\n    \"sensitive\": [\n      {\"part\": \"耳垂与颈部\", \"level\": \"评级（如极高/高/中/低）\", \"desc\": \"具体敏感表现与原因\"},\n      {\"part\": \"背部与脊柱沟\", \"level\": \"评级\", \"desc\": \"具体敏感表现与原因\"},\n      {\"part\": \"胸部\", \"level\": \"评级\", \"desc\": \"具体敏感表现与原因\"},\n      {\"part\": \"腰腹与侧腹\", \"level\": \"评级\", \"desc\": \"具体敏感表现与原因\"},\n      {\"part\": \"大腿内侧\", \"level\": \"评级\", \"desc\": \"具体敏感表现与原因\"},\n      {\"part\": \"私密地带\", \"level\": \"评级\", \"desc\": \"具体敏感表现与原因\"}\n    ],\n    \"weak_main\": \"主要生理弱点部位\",\n    \"weak_main_how\": \"针对主要生理弱点的有效刺激方式与反应\",\n    \"weak_sub\": \"次要生理弱点部位\",\n    \"weak_sub_how\": \"针对次要生理弱点的有效刺激方式与反应\",\n    \"weak_mind\": \"精神/心理/言语弱点\",\n    \"weak_mind_trigger\": \"触发该精神弱点的具体词句或情境\",\n    \"weak_mind_reaction\": \"触发后的心理防线变化与身体反应\",\n    \"nsfw_behavior\": \"NSFW场景下的整体状态与表现反差\",\n    \"active_passive\": \"主动/被动倾向及转换条件\",\n    \"express\": \"床上的声音、眼神與肢体表达方式\",\n    \"rhythm\": \"喜欢的性爱节奏\",\n    \"atmosphere\": \"喜欢的性爱氛围与环境\",\n    \"positions\": [\n      {\"name\": \"喜好的性姿势1（共写2~3个）\", \"why\": \"喜欢该姿势的生理或心理原因\"},\n      {\"name\": \"喜好的性姿势2\", \"why\": \"喜欢该姿势的生理或心理原因\"}\n    ],\n    \"kinks\": [\n      {\"name\": \"特殊癖好1（共写6项左右）\", \"level\": \"仅幻想/愿意尝试/喜爱/痴迷\"},\n      {\"name\": \"特殊癖好2\", \"level\": \"仅幻想/愿意尝试/喜爱/痴迷\"},\n      {\"name\": \"特殊癖好3\", \"level\": \"仅幻想/愿意尝试/喜爱/痴迷\"},\n      {\"name\": \"特殊癖好4\", \"level\": \"仅幻想/愿意尝试/喜爱/痴迷\"},\n      {\"name\": \"特殊癖好5\", \"level\": \"仅幻想/愿意尝试/喜爱/痴迷\"},\n      {\"name\": \"特殊癖好6\", \"level\": \"仅幻想/愿意尝试/喜爱/痴迷\"}\n    ],\n    \"skills\": [\n      {\"name\": \"特殊性技巧1（共写1~2个，结合体型或种族权能）\", \"effect\": \"技巧的具体施展方式与对伴侣的效果\"}\n    ]\n  },\n  \"guide\": [\n    {\n      \"name\": \"行为路线短名（共写3~5条）\",\n      \"trigger\": \"触发该行为的具体情境或条件\",\n      \"action\": \"角色的具体动作与语言表现\",\n      \"detail\": \"必须体现的感官或神态细节\"\n    }\n  ],\n  \"appear\": {\n    \"hooks\": [\n      {\n        \"signal\": \"正文出现的场景/物件/话题/他人话语（共写4~6个，禁写具体钟点）\",\n        \"how\": \"她如何自然切入现场\",\n        \"first\": \"她出场时的第一反应或动作\",\n        \"turn\": \"互动可能推进的方向\"\n      }\n    ],\n    \"threads\": [\n      \"可挂靠的既有事件线1\",\n      \"可挂靠的既有事件线2\"\n    ],\n    \"presence\": [\n      \"不在场时的间接存在感体现1（如群消息/遗留物/他人提及）\",\n      \"不在场时的间接存在感体现2\"\n    ],\n    \"rules\": [\n      \"在场硬约束1（如：每轮最多3人在场、只1个主场）\",\n      \"在场硬约束2\"\n    ],\n    \"never\": \"什么情况下她绝对不会出现\"\n  },\n  \"appearKeys\": [\n    \"场景词1\",\n    \"场景词2\",\n    \"场景词3\"\n  ],\n  \"dispatch\": \"场景信号 → 名字（一句话定位；可由谁带进来）\",\n  \"keys\": [\n    \"角色全名\",\n    \"昵称1\",\n    \"昵称2\"\n  ],\n  \"coreUpdates\": [\n    {\n      \"entry\": \"人物关系速览\",\n      \"change\": \"需要追加进世界书人物关系速览的一行描述\"\n    }\n  ],\n  \"warnings\": [\n    \"性别推断说明、冲突设定丢弃说明或其他注意事项（无特殊情况可填：无）\"\n  ]\n}";

const DETECT_SYSTEM = "你是「新人物探测器」。请阅读下方的角色扮演正文，提取需要新建世界书条目的出场人物，并判断是否有已建档角色适合顺带出场。\n\n【任务一：提取新人物（candidates）】\n1. 纳入标准：仅提取正文中**实际登场**且有具体描写、动作或对话的个体人物。切勿提取地点、物品、组织，或仅在对话/旁白中被提及但未实际出场的人物。\n2. 排除名单：\n   - 绝对排除主角：{{user}}\n   - 绝对排除已建档角色：<已存在>\n   - 排除毫无特征的纯背景板泛指路人（如仅出现一次的「路人」「有人」「群演」）。\n3. 命名与指代规则：\n   - 有明确姓名者：`name` 填主名，`unnamed` 设为 `false`，`alias` 填正文中出现的昵称、头衔或其他称呼（无则填 `[]`）。\n   - 无名但有具体戏份者（仅以身份/外貌指代，如「店员」「老太太」「穿和服的女人」「管理员的老婆」）：必须提取。`name` 填最简短的核心指代（尽量精简），`unnamed` 设为 `true`，`alias` 填正文中用过的其他指代词（无则填 `[]`）。\n4. 属性与评估字段：\n   - `male`：确认为男性填 `true`；女性或性别不明填 `false`（男性角色同样必须列出，由系统后续过滤）。\n   - `reason`：用一句话简述该人物在本段中的核心戏份及值得建档的理由。\n   - `confidence`：根据戏份比重与角色独立性评估建档价值，仅限填 `\"high\"`（有独立外貌/性格/关键互动）、`\"medium\"`（有一定互动但戏份较少）或 `\"low\"`（边缘功能性NPC）。\n5. 若本段无任何符合条件的新人物，`candidates` 填 `[]`。\n\n【任务二：调度已建档角色（director）】\n参考可出场列表：<可出场>\n1. 从 `<可出场>` 中挑选最多 1 名最契合当前正文场景与剧情走向的角色（例如主角进入厨房，则优先挑选常驻厨房的角色）。\n2. 排除本轮正文中已经登场、或刚刚离开现场的角色。\n3. 宁缺毋滥：若 `<可出场>` 为空，或当前场景与列表内所有角色均无自然关联，切勿强行凑数，将 `name` 和 `why` 均设为空字符串 `\"\"`。\n4. 若选中角色，`name` 必须与 `<可出场>` 列表中的原名完全一致，`why` 用一句话结合正文具体细节说明适合出场的理由。\n\n【输出格式】\n仅输出一行或多行严格合法的纯文本 JSON，严禁使用 ```json 代码块，严禁输出任何前缀、后缀或解释文字：\n{\"candidates\":[{\"name\":\"\",\"alias\":[],\"unnamed\":false,\"male\":false,\"reason\":\"\",\"confidence\":\"high|medium|low\"}],\n \"director\":{\"name\":\"\",\"why\":\"\"}}";

const DEFAULTS = {
    targetBook: '', source: 'chat', name: '', idea: '', backups: {},
    targetBookByChar: {},   // { 角色卡key: 世界书 } 每张卡记住自己的目标书
    // API 配置（独立于酒馆主 API）
    apiMode: 'custom',          // custom = 用自己的端点；main = 跟随酒馆主 API
    transport: 'server',        // server = 酒馆服务器中转（推荐）；browser = 浏览器直连
    apiUrl: 'https://api.deepseek.com',
    apiKey: '',   // 不内置密钥：请到「织机 → API 配置」里填自己的 Key
    model: 'deepseek-flash',
    maxTokens: 6000,
    temperature: 0.7,
    headers: 'x-opencode-session: auto-char-ext',
    autoGenerate: true,
    autoWrite: false,      // 生成后直接写入，不审核
    llmTimeout: 240,
    ensemble: false,        // 群像模式：不围绕 {{user}} 展开，多角色群像演绎
    advance: true,          // 正文末尾带一句 20~50 字剧情推进
    speakerTag: true,       // 让 AI 在台词前显式标注【说话人】（根治名字乱标）
    hideChatTags: true,     // 在聊天显示里隐藏【角色名】：标注（只影响显示，不改聊天记录）
    formatPreset: 'classic', // 正文格式预设：classic=环境斜体/动作粗体/内心折叠；webnovel=网文音效流（###音效行）
    vnMode: false,          // Galgame 模式：正文逐段点击显示
    vnTypewriter: true,     // Galgame 打字机效果（逐字显示）
    vnTypeSpeed: 40,        // 打字机速度（字/秒）
    vnSprite: true,         // Galgame 立绘开关
    vnSpritePos: 'center',  // 立绘位置：center（默认=背景人物位置）/ right / left
    vnSpriteSize: 112,      // 立绘高度（%），<90 视为旧档位自动迁移
    vnAutoReroll: true,      // 检测到 AI 回复被截断时自动重roll（Galgame 里）
    vnAutoRerollMax: 2,      // 自动重roll 最多几次
    vnStallSeconds: 10,      // 连续多少秒没有新字就判定为卡住/截断（5~10 秒）
    vnRerollDelay: 15,       // 自动重roll 前等待多少秒（让服务端冷却、其它后台任务跑完）
    theme: 'mint',          // 配色主题：mint/ocean/plum/sakura/forest/light
    vnSpriteDir: 'sprites', // 立绘文件夹（扩展目录下）
    spriteMap: {},          // { 角色名: { url, t } } —— 面板里导入的立绘（优先使用）
    vnSpriteFallback: 'default', // 没有专属立绘时：default=用默认素材包 / none=不显示
    vnEmotionMode: 'ai',    // 表情识别：ai=按内容判情绪（像官方）/ keyword=关键词
    spriteExpr: {},         // { 角色名: { en表情: { url, t } } } 表情差分
    envPool: [],            // [{ id, name, url, t }] 环境池
    envActive: '',          // 当前环境 id
    envAuto: true,          // 自动按正文里的环境名切换
    _envGlobalMigrated: false, // 旧版按作用域存的环境池是否已合并为全局
    assetsByScope: {},      // { scopeKey: { spriteMap, spriteExpr, envPool, envActive } } 素材按角色卡/世界书分作用域
    _assetsMigrated: false, // 旧全局素材是否已迁移到作用域
    _tipsSeen: false,       // 是否展示过 Galgame 操作提示
    playChar: '',           // 扮演模式：以哪个角色的身份玩
    playPrevAvatar: '',     // 扮演前的 user 身份（退出时还原）       // 单次请求超时（秒），避免接口卡住导致面板一直转圈
    allowMale: false,      // 是否生成男性角色
    xpPool: [],            // 用户勾选的性癖池
    xpLast: [],            // 上一个角色用过的性癖（避免相邻重复）
    scanDepth: 50,         // 素材收集：翻多少楼（加人时用一次）
    detectDepth: 8,        // 新人检测：常规只看多少楼（每轮都跑，必须小）
    followCharBook: true,   // 自动跟随角色卡绑定的世界书
    detectMarks: {},       // 每个聊天上次检测到的楼层（用于补扫）
    catchUpMax: 60,        // 补扫上限，防止一次拉太多
    advanced: false,       // 高级模式
    customSystem: '',      // 自定义生成提示词（空=用默认）
    customDetect: '',      // 自定义检测提示词（空=用默认）
    customXp: [],          // 自定义 XP: [{tag, hint}]
    oplog: {},             // 操作日志（替代整本快照）
    entryHash: {},         // 条目内容指纹（检测手改）
    timelineEntry: '行动路线', // 出场时机写进哪条常驻条目
    director: false,          // 出场导演开关
    directorEvery: 3,          // 全局节奏：至少隔多少楼才安排一次（不管是谁）
    directorGap: 8,           // 至少多少楼没出场才推荐
    directorChance: 0,        // 场景不匹配时强插的概率 %
    directorAllowRandom: false, // 允许随机偶遇（默认关，关着时上面的概率不生效）
    directorIdleOnly: true,   // 只在空闲场景出手
    directorPos: 'in_chat',   // 注入位置
    directorDepth: 4,         // 注入深度
    directorNotify: true,     // 导演动手时弹提示
    dirLog: {},               // 每个聊天的出场记录
    directorCharsExtra: [],   // 手动补充的角色名（任何命名规范都能用）
    directorPick: {},         // 手动勾选：{ 名字: true/false }，覆盖自动判断
    busyGuard: 'strong',      // 激烈场景保护：strong=只拦强信号 / strict=强+弱都拦 / off=不拦
    dirScan: {},              // LLM 扫世界书的缓存（按书 + 指纹）
    importReview: false,      // 从别的角色卡导入时，先放草稿给我看
    autoScan: true,            // 正则一条都认不出时，自动用 LLM 扫一次
    // 人物变化记录（长期状态：怀孕、关系变化、身份暴露、身体变化…）
    charState: {},             // 旧版全局存储（保留用于迁移）
    charStateByChat: {},       // { 聊天key: { 角色名: '变化/状态描述' } } —— 按聊天/世界书隔离
    charStateEntry: '人物变化记录（命运织机）', // 写入世界书的常驻条目名（自定义名，数据库不会动）
    charStateOrder: 10020,     // 注入顺序
    charStateAuto: true,       // 自动检测人物变化
    charStateEvery: 3,         // 每几楼自动检测一次
    charStateMarks: {},        // { 聊天key: 已检测到的楼层 }（记录检测进度）
    storyTime: '',             // 当前剧情时间（写进世界书常驻条目，AI 以此为准）

};

// ── 基础 ─────────────────────────────────────────
const clean = s => String(s == null ? '' : s).replace(/\uFFFD/g, '').trim();
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 当前角色卡绑定的世界书
function boundBook() {
    try {
        const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
        const w = ch && ch.data && ch.data.extensions && ch.data.extensions.world;
        return w ? String(w) : '';
    } catch (e) { return ''; }
}

// 实际写入/检测用的书：默认跟随角色卡绑定，没绑就用手动选的
function effectiveBook() {
    const s = settings();
    if (s.followCharBook !== false) {
        const b = boundBook();
        if (b) return b;
    }
    return s.targetBook || '';
}
function store() {
    // 不同酒馆版本取设置容器的位置不一样，逐个兜底
    const holder = ctx.extensionSettings || globalThis.extension_settings
        || (globalThis.extension_settings = {});
    return holder;
}
const _acInitedStores = new WeakSet();
function settings() {
    const holder = store();
    if (!holder[MODULE]) holder[MODULE] = structuredClone(DEFAULTS);
    const s = holder[MODULE];
    if (!_acInitedStores.has(s)) {
        for (const k of Object.keys(DEFAULTS)) if (s[k] === undefined) s[k] = structuredClone(DEFAULTS[k]);
        _acInitedStores.add(s);
    }
    return s;
}
function persist() {
    try {
        const f = ctx.saveSettingsDebounced || globalThis.SillyTavern?.saveSettingsDebounced;
        if (typeof f === 'function') f.call(ctx);
    } catch (e) { console.warn('[命运织机] 保存失败', e); }
}
function headers() {
    try { return ctx.getRequestHeaders ? ctx.getRequestHeaders() : { 'Content-Type': 'application/json' }; }
    catch { return { 'Content-Type': 'application/json' }; }
}
async function api(path, body) {
    const r = await fetch(path, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 160));
    return r.json();
}
const listBooks = () => api('/api/worldinfo/list', {}).then(j => {
    const arr = Array.isArray(j) ? j : (j.items || []);
    return arr.map(b => typeof b === 'string' ? b : (b.file_id || b.name)).filter(Boolean).sort();
});
const getBook = name => api('/api/worldinfo/get', { name });
const putBook = (name, data) => api('/api/worldinfo/edit', { name, data });

function parseLoose(s) {
    let t = String(s || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const i = t.indexOf('{'), j = t.lastIndexOf('}');
    if (i >= 0 && j > i) t = t.slice(i, j + 1);
    try { return JSON.parse(t); } catch (e) { }
    for (const tail of ['}]}', '"}]}', '"]}]}', ']}}', '}]}}']) { try { return JSON.parse(t + tail); } catch (e) { } }
    return null;
}

// ── 模型调用 ─────────────────────────────────────
// custom：直连自填端点（需要该端点允许浏览器跨域）
// main：跟随酒馆主 API
function apiBase() {
    let base = String(settings().apiUrl || '').trim().replace(/\/+$/, '');
    if (/\/chat\/completions$/.test(base)) base = base.replace(/\/chat\/completions$/, '');
    return base;
}

let cachedSecret = { key: '', id: '' };

// 服务器中转需要把密钥存进酒馆密钥库，才能用 custom 通道
// 有些端点必须带特定请求头，自动补上，省得用户去查文档
function resolveHeaders() {
    const s = settings();
    let txt = String(s.headers || "").trim();
    const url = String(s.apiUrl || "");
    if (/opencode\.ai/i.test(url) && !/x-opencode-session/i.test(txt)) {
        txt = (txt ? txt + String.fromCharCode(10) : "") + "x-opencode-session: " + (MODULE.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    }
    return txt;
}

async function ensureSecret() {
    const s = settings();
    const key = String(s.apiKey || '').trim();
    if (!key) return null;                     // 有些端点不需要密钥，不要硬报错
    if (cachedSecret.key === key && cachedSecret.id) return cachedSecret.id;

    const res = await fetch('/api/secrets/write', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ key: 'api_key_custom', value: key, label: 'AUTO-Character' }),
    });
    const j = await res.json().catch(() => ({}));
    if (!j.id) throw new Error('把密钥存进酒馆失败');
    cachedSecret = { key, id: j.id };
    return j.id;
}

// 把底层网络错误翻译成能照做的提示
function friendlyNetError(msg) {
    const m = String(msg || "");
    if (/ECONNREFUSED|Connection refused/i.test(m)) {
        const port = (m.match(/127\.0\.0\.1:(\d+)/) || [])[1] || "?";
        return m + String.fromCharCode(10, 10) +
            "【本机代理没开】酒馆 config.yaml 里的 requestProxy 指向了 127.0.0.1:" + port + "，但这个端口上没有程序在听。" + String.fromCharCode(10) +
            "三种处理方式任选其一：" + String.fromCharCode(10) +
            "· 启动代理（Clash/V2Ray 之类），或把 requestProxy.url 改成代理实际监听的端口" + String.fromCharCode(10) +
            "· 把这个端点加进 requestProxy.bypass 列表（直连）" + String.fromCharCode(10) +
            "· 把 requestProxy.enabled 设为 false（如果不需要代理）" + String.fromCharCode(10) +
            "改完要重启酒馆才生效。";
    }
    if (/ETIMEDOUT|timeout|timed out/i.test(m)) {
        return m + String.fromCharCode(10, 10) + "【超时】端点没在限定时间内响应。可能是代理慢、也可能是端点本身挂了。";
    }
    if (/Bad Request|HTTP 400/i.test(m)) {
        const s0 = settings();
        let extra = '';
        if (/opencode\.ai/i.test(String(s0.apiUrl || '')) && !/x-opencode-session/i.test(String(s0.headers || ''))) {
            extra = String.fromCharCode(10, 10) + '【opencode 端点】它必须带 x-opencode-session 请求头，否则一律返回 400。' + String.fromCharCode(10) + '插件会自动补一个；如果仍然 400，请检查端点 URL 是否正确（例如 https://opencode.ai/zen/go/v1）。';
        }
        return m + extra;
    }
    if (/ENOTFOUND|getaddrinfo/i.test(m)) {
        return m + String.fromCharCode(10, 10) + "【域名解析失败】检查端点 URL 拼写，或者当前网络连不上这个域名。";
    }
    if (/Failed to fetch|NetworkError|CORS/i.test(m) && !/HTTP \d/i.test(m)) {
        return m + String.fromCharCode(10, 10) + "【浏览器直连被挡】如果端点不允许跨域，把「发送通道」改成「酒馆服务器中转」。";
    }
    return m;
}

const _llmAborts = new Set();
let _llmCancelled = false;   // 用户点了「终止生成」：后续重试/下一个候选都要立刻停
function abortLLM() {
    _llmCancelled = true;
    try { for (const c of _llmAborts) { try { c.abort(); } catch (e) { /* ignore */ } } } catch (e) { /* ignore */ }
    _llmAborts.clear();
}
function resetLLMCancel() { _llmCancelled = false; }

// 读取 SSE 流（OpenAI 格式 data: {...}），边收边回调；同时兼容服务端直接返回整段 JSON 的情况
async function readSSEStream(res, onDelta, onReasoning) {
    const reader = res.body.getReader();
    const dec = new TextDecoder('utf-8');
    let buf = '', out = '', errMsg = '', reasonLen = 0;
    const handleLine = function (line) {
        line = String(line || '').trim();
        if (!line || line.startsWith(':')) return;   // 空行 / 注释心跳
        if (line.startsWith('data:')) line = line.slice(5).trim();
        if (!line || line === '[DONE]') return;
        let j = null;
        try { j = JSON.parse(line); } catch (e) { return; }
        if (j.error) { errMsg = String(j.error.message || JSON.stringify(j.error)).slice(0, 300); return; }
        const ch = (j.choices && j.choices[0]) || null;
        let delta = '';
        if (ch) {
            if (ch.delta && typeof ch.delta.reasoning_content === 'string' && ch.delta.reasoning_content) {
                reasonLen += ch.delta.reasoning_content.length;
                try { onReasoning && onReasoning(ch.delta.reasoning_content, reasonLen); } catch (e) { /* ignore */ }
            }
            if (ch.delta && typeof ch.delta.content === 'string') delta = ch.delta.content;
            else if (ch.message && typeof ch.message.content === 'string') delta = ch.message.content;
            else if (typeof ch.text === 'string') delta = ch.text;
        }
        if (delta) {
            out += delta;
            try { onDelta && onDelta(delta, out); } catch (e) { /* ignore */ }
        }
    };
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            handleLine(line);
        }
    }
    if (buf.trim()) handleLine(buf);
    if (errMsg) throw new Error(friendlyNetError('端点报错：' + errMsg));
    if (!out.trim()) throw new Error('流式返回里没有内容');
    return out;
}

// ── 流式预览小窗（生成模板时右下角实时显示，和正文一样边写边看）──
let _streamBuf = '';
function ensureStreamBox() {
    let box = document.getElementById('ac-stream-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'ac-stream-box';
        box.style.cssText = 'position:fixed;right:26px;bottom:26px;width:540px;max-width:calc(100vw - 40px);max-height:44vh;display:none;flex-direction:column;z-index:100000;background:#1b2224;border:1px solid #333d3f;border-radius:10px;box-shadow:0 10px 34px rgba(0,0,0,.55);overflow:hidden';
        box.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid #2f3739">' +
            '<i class="fa-solid fa-wand-magic-sparkles" style="color:#8fd9b6"></i>' +
            '<b id="ac-stream-title" style="color:#dfe6e6;font-size:13px">生成中…</b>' +
            '<span id="ac-stream-len" style="margin-left:auto;color:#6f8080;font-size:12px"></span>' +
            '<button id="ac-stream-close" title="收起" style="background:none;border:none;color:#8fa0a0;cursor:pointer;font-size:15px;line-height:1">×</button></div>' +
            '<pre id="ac-stream-pre" style="margin:0;padding:10px 12px;overflow:auto;max-height:calc(44vh - 40px);white-space:pre-wrap;word-break:break-all;font-size:12px;line-height:1.65;color:#cfe6dd;font-family:ui-monospace,Consolas,monospace"></pre>';
        document.body.appendChild(box);
        const btn = box.querySelector('#ac-stream-close');
        if (btn) btn.addEventListener('click', function () { box.style.display = 'none'; });
    }
    return box;
}
function updateStreamBox(show) {
    const box = ensureStreamBox();
    if (show) box.style.display = 'flex';
    const pre = box.querySelector('#ac-stream-pre');
    const len = box.querySelector('#ac-stream-len');
    if (pre) { pre.textContent = _streamBuf; pre.scrollTop = pre.scrollHeight; }
    if (len) len.textContent = _streamBuf.length + ' 字';
}
function setStreamTitle(t) {
    const el = document.getElementById('ac-stream-title');
    if (el) el.textContent = String(t || '生成中…');
}
function resetStream(title) {
    _streamBuf = '';
    setStreamTitle(title);
    updateStreamBox(true);
}
function pushStream(delta) {
    _streamBuf += String(delta || '');
    updateStreamBox(true);
}
function hideStream(delay) {
    setTimeout(function () {
        const b = document.getElementById('ac-stream-box');
        if (b) b.style.display = 'none';
    }, delay || 0);
}
function makeStreamHooks(title) {
    resetStream(title);
    let think = 0;
    return {
        onDelta: function (d) { pushStream(d); },
        onReasoning: function (d, total) {
            think = total || (think + String(d || '').length);
            setStreamTitle(title + ' · 模型思考中 ' + think + ' 字…（正文会在思考结束后开始输出）');
        },
        onAttempt: function (i) { if (i > 0) resetStream(title + '（第 ' + (i + 1) + ' 次尝试）'); },
        done: function () { hideStream(2600); },
    };
}

async function callLLM(prompt, opts) {
    if (_llmCancelled) throw new Error('已取消');
    const s = settings();
    const timeoutMs = Math.max(10, Number((opts && opts.timeout) || s.llmTimeout || 120)) * 1000;
    const wantStream = !!(opts && (opts.onDelta || opts.stream));
    if (s.apiMode === 'main') {
        try { state.bgTaskCount = (state.bgTaskCount || 0) + 1; } catch (e) { /* ignore */ }
        try {
            const raw = await Promise.race([
                ctx.generateQuietPrompt({ quietPrompt: prompt, responseLength: s.maxTokens, removeReasoning: true }),
                new Promise(function (_, rej) {
                    setTimeout(function () { rej(new Error('主 API 生成超时（' + Math.round(timeoutMs / 1000) + ' 秒）')); }, timeoutMs);
                }),
            ]);
            return String(raw || '');
        } finally {
            try { state.bgTaskCount = Math.max(0, (state.bgTaskCount || 1) - 1); } catch (e) { /* ignore */ }
        }
    }

    let base = apiBase();
    if (!base) throw new Error('还没填端点 URL');

    const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    const signal = ctrl ? ctrl.signal : undefined;
    if (ctrl) _llmAborts.add(ctrl);
    const timer = setTimeout(function () { try { ctrl && ctrl.abort(); } catch (e) { /* ignore */ } }, timeoutMs);
    try {
        // ── 通道一：走酒馆服务器中转（绕开浏览器跨域/代理问题） ──
        if (s.transport !== 'browser') {
            const sid = await ensureSecret();
            const maxTok = Number((opts && opts.maxTokens) || s.maxTokens) || 6000;
            const reqBody = function (useStream) {
                return JSON.stringify({
                    chat_completion_source: 'custom',
                    custom_url: base,
                    custom_include_headers: resolveHeaders(),
                    secret_id: sid || undefined,
                    model: s.model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: maxTok,
                    temperature: Number(s.temperature) || 0.7,
                    stream: useStream,
                });
            };
            const doFetch = async function (useStream) {
                return await fetch('/api/backends/chat-completions/generate', {
                    method: 'POST',
                    headers: headers(),
                    signal: signal,
                    body: reqBody(useStream),
                });
            };
            const res = await doFetch(wantStream);
            const ct = String(res.headers.get('content-type') || '');
            if (wantStream && res.ok && res.body && !/json/i.test(ct)) {
                try {
                    return await readSSEStream(res, opts && opts.onDelta, opts && opts.onReasoning);
                } catch (eStream) {
                    // 有的模型（如 deepseek 系）先流式输出 reasoning，正文可能被 max_tokens 吃光；
                    // 这时自动改用非流式再请求一次，避免直接报「流式返回里没有内容」
                    if (!/流式返回里没有内容/.test(String((eStream && eStream.message) || ''))) throw eStream;
                    console.warn('[命运织机] 流式没收到正文，改用非流式重试');
                }
            }
            const res2 = wantStream ? await doFetch(false) : res;
            const text = await res2.text();
            let j = null;
            try { j = JSON.parse(text); } catch (e) { }
            if (j && j.error) throw new Error(friendlyNetError('端点报错：' + (j.error.message || JSON.stringify(j.error).slice(0, 200))));
            if (!res2.ok) throw new Error(friendlyNetError('HTTP ' + res2.status + ' ' + text.slice(0, 200)));
            const choice0 = j?.choices?.[0];
            const ch = choice0?.message;
            if (!ch) throw new Error('返回里没有内容：' + text.slice(0, 200));
            let content0 = String(ch.content || '').trim();
            const finish0 = String(choice0?.finish_reason || '');
            const reas0 = String(ch.reasoning_content || ch.reasoning || '');
            if (!content0) {
                galDiag('bg_llm_empty', { finish: finish0, reasoningLen: reas0.length, model: s.model });
                console.warn('[命运织机] 后台 AI 返回空正文（reasoning ' + reas0.length + ' 字），尝试关闭思考重试一次');
                try {
                    const doRetry = async function (stripExtra) {
                        const bodyRetry = {
                            chat_completion_source: 'custom', custom_url: base, custom_include_headers: resolveHeaders(),
                            secret_id: sid || undefined, model: s.model,
                            messages: [{ role: 'user', content: String(prompt || '') + String.fromCharCode(10, 10) + '[直接输出结果，不要输出思考过程]' }],
                            max_tokens: Math.min(16000, Math.max(6000, (maxTok || 6000) * 2)),
                            temperature: 0.3, stream: false,
                        };
                        if (!stripExtra) {
                            bodyRetry.reasoning_effort = 'low';
                            bodyRetry.chat_template_kwargs = { enable_thinking: false };
                        }
                        const resR = await fetch('/api/backends/chat-completions/generate', {
                            method: 'POST', headers: headers(), signal: signal, body: JSON.stringify(bodyRetry),
                        });
                        const txtR = await resR.text();
                        let jR = null; try { jR = JSON.parse(txtR); } catch (e) { /* ignore */ }
                        if (!resR.ok || (jR && jR.error)) {
                            if (!stripExtra) return { needStrip: true };
                            return { content: '' };
                        }
                        const chR = jR?.choices?.[0]?.message;
                        return { content: String(chR?.content || '').trim() };
                    };
                    let r = await doRetry(false);
                    if (r.needStrip) r = await doRetry(true);
                    content0 = r.content || '';
                    if (content0) galDiag('bg_llm_retry_ok', {});
                } catch (eR) { galDiag('bg_llm_retry_fail', { err: String(eR).slice(0, 160) }); }
                if (!content0) galBgWarn('后台 AI 返回空内容（思考占满 token），角色识别/表情可能不准');
            }
            return content0;
        }

        // ── 通道二：浏览器直连（要求端点允许跨域） ──
        base = base.replace(/\/+$/, '');
        if (!/\/chat\/completions$/i.test(base)) base += '/chat/completions';

        const maxTok2 = Number((opts && opts.maxTokens) || s.maxTokens) || 6000;
        const doFetch2 = async function (useStream) {
            const body = {
                model: s.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTok2,
                temperature: Number(s.temperature) || 0.7,
                stream: useStream,
            };
            try {
                return await fetch(base, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(s.apiKey || '').trim(),
                    },
                    signal: signal,
                    body: JSON.stringify(body),
                });
            } catch (e) {
                if (e && e.name === 'AbortError') throw e;
                throw new Error('连不上端点（可能是跨域被拦截，或 URL 写错）：' + (e.message || e));
            }
        };
        const res = await doFetch2(wantStream);
        const ct2 = String(res.headers.get('content-type') || '');
        if (wantStream && res.ok && res.body && !/json/i.test(ct2)) {
            try {
                return await readSSEStream(res, opts && opts.onDelta, opts && opts.onReasoning);
            } catch (eStream) {
                if (!/流式返回里没有内容/.test(String((eStream && eStream.message) || ''))) throw eStream;
                console.warn('[命运织机] 流式没收到正文，改用非流式重试');
            }
        }
        const res2b = wantStream ? await doFetch2(false) : res;
        const text = await res2b.text();
        if (!res2b.ok) throw new Error('HTTP ' + res2b.status + ' ' + text.slice(0, 200));
        let j;
        try { j = JSON.parse(text); } catch { throw new Error('返回的不是 JSON：' + text.slice(0, 160)); }
        const choice = j.choices?.[0]?.message;
        return String(choice?.content || '');
    } catch (e) {
        const msg = String((e && e.message) || e || '');
        if ((e && e.name === 'AbortError') || /abort|超时|timeout/i.test(msg)) {
            throw new Error('请求超时/被取消（' + Math.round(timeoutMs / 1000) + ' 秒）：接口没在时限内返回。可以稍后重试，或把「API 配置」里的模型换成更快的。');
        }
        throw e;
    } finally {
        clearTimeout(timer);
        if (ctrl) _llmAborts.delete(ctrl);
    }
}

// ── 素材 ─────────────────────────────────────────

// 按设置的层数截取聊天（0 = 全部）
// ── 提示词与性癖的运行时辅助 ─────────────────────
function activeSystem() {
    const c = String(settings().customSystem || '').trim();
    return c || SYSTEM;
}
function activeDetect() {
    const c = String(settings().customDetect || '').trim();
    return c || DETECT_SYSTEM;
}
function allXpGroups() {
    const custom = (settings().customXp || []).map(function (x) { return x.tag; }).filter(Boolean);
    if (!custom.length) return XP_GROUPS;
    return XP_GROUPS.concat([{ name: '自定义', items: custom }]);
}
function xpHint(tag) {
    if (XP_HINTS[tag]) return XP_HINTS[tag];
    const c = (settings().customXp || []).find(function (x) { return x.tag === tag; });
    return c ? (c.hint || null) : null;
}

// 性别标注（检测用：男性也列出来，由代码按设置过滤）
function detectGenderRule() {
    return '【性别标注】候选人是男性就把 male 设为 true，女性或不确定设为 false；男性也要列出来，是否生成由系统按设置决定。';
}

// 性别限制说明
function genderRule() {
    return settings().allowMale ? '' : '【性别限制】不要生成男性角色；如果候选项是男性，直接跳过不处理。';
}

// 从池子里抽 1~2 个，避开上一个角色用过的
function pickXp() {
    const pool = (settings().xpPool || []).slice();
    if (!pool.length) return [];
    const last = settings().xpLast || [];
    let usable = pool.filter(function (x) { return last.indexOf(x) < 0; });
    if (!usable.length) usable = pool.slice();
    const n = Math.min(usable.length, Math.random() < 0.5 ? 1 : 2);
    const picked = [];
    while (picked.length < n) {
        const i = Math.floor(Math.random() * usable.length);
        picked.push(usable.splice(i, 1)[0]);
    }
    return picked;
}

// 性癖约束说明（拼进提示词）
function xpRule(xps) {
    if (!xps || !xps.length) return '';
    const lines = xps.map(function (x) {
        const hint = xpHint(x);
        if (hint) return '* ' + x + '：' + hint;
        return '* ' + x + '：围绕这个属性，在她的外貌、性格、行为或身体反应里写出具体表现，不要只贴标签。';
    });
    return [
        '【本角色的性癖设定 · 必须落到具体描写，不能只贴标签】',
        lines.join(String.fromCharCode(10)),
        '【写到哪】体型与外貌类 → 外貌各字段；穿着类 → 日常服饰 + 行为落地；性格类 → 性格 + 语言风格；',
        '身体反应类 → NSFW档案 的身体反应与敏感点；身份与关系类 → 背景 + 定位四件事；',
        '猎奇与特殊类 → 外貌-身体细节 + NSFW档案 的特质，并说明该属性是怎么来的、她如何看待、',
        '别人知不知道、被发现会怎样；情境类 → 行为落地指南 的触发条件。',
        '这些设定要能自圆其说，和正文已有的信息不冲突。',
    ].join(String.fromCharCode(10));
}
function chatPool(depth) {
    const chat = live().chat || [];
    const d = Number(depth === undefined ? settings().scanDepth : depth);
    if (!d || d <= 0) return chat;
    return chat.slice(-d);
}

// 当前聊天的标识（用于记录检测进度）
function chatKey() {
    try {
        if (typeof ctx.getCurrentChatId === 'function') return String(ctx.getCurrentChatId() || 'default');
        const _lc2 = live(); if (_lc2.chatId) return String(_lc2.chatId);
    } catch (e) { /* ignore */ }
    return 'default';
}

// 检测池：常规取最近 detectDepth 楼；若上次检测之后又新增了很多楼（插件关过/检测失败），
// 自动从上次的位置补扫，避免漏掉中间出现的人物。
function detectPool() {
    const s = settings();
    const chat = live().chat || [];
    const len = chat.length;
    const depth = Number(s.detectDepth) || 8;
    const mark = Number((s.detectMarks || {})[chatKey()]) || 0;
    let from = Math.max(0, len - depth);
    if (mark > 0 && mark < len) {
        from = Math.min(from, mark - 1);
        from = Math.max(from, len - (Number(s.catchUpMax) || 60));
        from = Math.max(0, from);
    }
    return { pool: chat.slice(from), from, len, catchUp: from < Math.max(0, len - depth) };
}

// 检测用的正文：去掉 plan/report/think/recall 等元数据段，避免把编排计划当剧情
function stripMetaForDetect(text) {
    return String(text || '')
        .replace(/<report[^>]*>[\s\S]*?<\/report[^>]*>/gi, ' ')
        .replace(/<think[^>]*>[\s\S]*?<\/think[^>]*>/gi, ' ')
        .replace(/<thought>[\s\S]*?<\/thought>/gi, ' ')
        .replace(/<plan>[\s\S]*?<\/plan>/gi, ' ')
        .replace(/<recall>[\s\S]*?<\/recall>/gi, ' ')
        .replace(/<supplement>[\s\S]*?<\/supplement>/gi, ' ')
        .replace(/<StatusPlaceHolderImpl\s*\/?>/gi, ' ')
        .trim();
}

function markDetect() {
    const s = settings();
    s.detectMarks = s.detectMarks || {};
    s.detectMarks[chatKey()] = (live().chat || []).length;
    persist();
}
function gatherFromChat(name, aliases) {
    const chat = chatPool(settings().scanDepth);
    const keys = [name];
    if (name.length > 2) keys.push(name.slice(0, 2));
    for (const a of (aliases || [])) if (a && a.length >= 2) keys.push(String(a));
    const out = [];
    for (const m of chat) {
        const text = String(m.mes || m.message || '');
        if (!text || m.is_system) continue;
        if (!keys.some(k => text.includes(k))) continue;
        const rel = text.split(/\n+/).filter(p => keys.some(k => p.includes(k)));
        out.push({ isUser: !!m.is_user, text: rel.join(' ').slice(0, 900) });
    }
    return out;
}
function gatherFromChar() {
    const _lc3 = live(); const ch = _lc3.characters?.[_lc3.characterId];
    if (!ch) return null;
    const cb = ch.data?.character_book?.entries || [];
    const lines = [
        'name: ' + (ch.name || ''),
        'description: ' + String(ch.description || '').slice(0, 2500),
        'personality: ' + String(ch.personality || '').slice(0, 1200),
        'scenario: ' + String(ch.scenario || '').slice(0, 1200),
        'first_mes: ' + String(ch.first_mes || '').slice(0, 800),
    ];
    if (cb.length) {
        lines.push('', '【内嵌世界书（人设正文，主要依据）】');
        for (const x of cb.slice(0, 20)) lines.push('◆ ' + (x.comment || x.name || '?'), String(x.content || '').slice(0, 600));
    }
    return { name: ch.name || '', block: lines.join('\n') };
}

// ── 状态 ─────────────────────────────────────────
const state = { rewrite: null, autoScanBusy: false, tab: 'add', plan: null, books: [], candidates: [], detecting: false, detectedFor: '', detectError: '', drafts: [], genBusy: false, genText: '', genStart: 0, genTimer: null, genError: '', curAlias: [], existingNames: new Set(), updateChars: [], updateChar: null, updatePlan: null, updateDiff: null, updateEntry: null, autoRewrite: null, vnShown: {}, galNames: [] };

// ── 手动检测（只找人不生成） ─────────────────────
// 这本书里是不是已经有这个人（双向包含 + 清洗后比对）
// 生成前最后一道闸门 —— 宁可多查一次，也别白花 token
async function bookHasPerson(book, name) {
    const n0 = cleanPersonName(String(name || ''));
    if (!n0 || !book) return false;
    const pool = [];
    // 有缓存就直接用（不要为了判定去触发 LLM 扫描，那反而更费）
    try {
        if (state.dirCache && state.dirCache.book === book) {
            for (const ch of (state.dirCache.chars || [])) if (ch && ch.name) pool.push(String(ch.name));
        }
    } catch (e) {}
    try {
        const d = await getBook(book);
        for (const e2 of Object.values(d.entries || {})) {
            const c = String(e2.comment || '');
            if (/^(TavernDB|ACU-)/i.test(c)) continue;
            pool.push(c);
            pool.push(cleanPersonName(c));
            for (const k of (e2.key || [])) pool.push(String(k));
        }
    } catch (e) {}
    for (const x of pool) {
        if (!x || x.length < 2) continue;
        if (x === n0 || x.indexOf(n0) >= 0 || n0.indexOf(x) >= 0) return true;
    }
    return false;
}

// 和「更新角色」页同一套判断：只有真有独立角色条目才算「已有」
// （数据库角色表 / 人物关系速览 / 行动路线里出现过的名字不算，否则会出现
//  「分析说有条目让你去更新，更新说没条目让你来分析」的死循环）
async function hasOwnCharacterEntry(book, name) {
    const n0 = cleanPersonName(String(name || '').trim());
    if (!n0 || !book) return false;
    try {
        const list = await listCharacters(book);
        for (const c of (list || [])) {
            if (!c || c.missing) continue;
            const cn = String(c.name || '');
            if (!cn) continue;
            if (cn === n0 || cn.indexOf(n0) >= 0 || n0.indexOf(cn) >= 0) return true;
        }
    } catch (e) { console.warn('[命运织机] 判断角色条目失败', e); }
    return false;
}

async function detectCandidates(force) {
    resetLLMCancel();
    const dp = detectPool();
    const chat = dp.pool;
    const book = effectiveBook();
    const cacheKey = dp.len + '|' + book;
    if (!force && state.detectedFor === cacheKey) return;

    state.detecting = true;
    state.detectError = '';
    state.candidates = [];
    if (state.tab === 'add') render();

    try {
        if (dp.catchUp) console.log('[命运织机] 补扫 ' + (dp.len - dp.from) + ' 楼（上次检测之后新增较多）');
        const recent = dp.pool.map(m => stripMetaForDetect(m.mes || m.message || '')).filter(Boolean).join(NL2).slice(0, 12000);
        if (!recent.trim()) return;

        // 已有角色名单：优先用目标世界书，没选就自动取角色卡绑定的那本
        let useBook = book;
        if (!useBook) {
            try {
                const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
                const w = ch && ch.data && ch.data.extensions && ch.data.extensions.world;
                if (w) { useBook = w; console.log('[命运织机] 没选目标书，自动使用角色卡绑定的：' + w); }
            } catch (e) { /* ignore */ }
        }
        if (!useBook) {
            state.detecting = false;
            state.detectError = '还没选目标世界书 —— 不知道哪本书里已经有哪些人，就无法判断谁是「新人物」。先去「2. 目标世界书」选一本。';
            if (state.tab === 'add') render();
            return;
        }
        // 「已有角色」= 真正有独立角色条目的人（就是「更新角色」页列出来的那些）
        // 数据库角色表 / 人物关系速览 / 行动路线里出现过、但还没做成独立条目的人，放进 softNames：
        // 手动检测时他们应该作为「可添加人物」列出来（加 soft 标记），不能直接排除。
        state.existingNames = new Set();
        const softNames = new Set();
        if (useBook) {
            try {
                const charList = await listCharacters(useBook);
                // 只把「真有独立角色条目」的人算已有；missing 的留给 softNames（可被检测为候选）
                for (const ch of (charList || [])) if (ch && ch.name && !ch.missing) state.existingNames.add(String(ch.name));
            } catch (e) { console.warn('[命运织机] 读取角色条目失败，改用条目名判断', e); }
            if (!state.existingNames.size) {
                try {
                    const d = await getBook(useBook);
                    const es = Object.values(d.entries || {});
                    for (const e of es) {
                        const c = String(e.comment || '');
                        if (/^(TavernDB|AUTO-)/.test(c)) continue;
                        state.existingNames.add(c);
                        for (const k of (e.key || [])) state.existingNames.add(String(k));
                    }
                } catch (e) { console.warn('[命运织机] 读世界书失败', e); }
            }
        }
        // 当前角色卡和 persona 也算已有
        try {
            const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
            if (ch && ch.name) state.existingNames.add(String(ch.name));
            const _lc4 = live(); if (_lc4.name2) state.existingNames.add(String(_lc4.name2));
        } catch (e) { /* ignore */ }
        for (const dr of (state.drafts || [])) if (dr.name) state.existingNames.add(String(dr.name));

        // 和出场导演同一套识别结果：没有独立条目的人只算「见过名字」，不算已有
        try {
            const cache = await refreshDirCache(useBook);
            for (const ch of (cache.chars || [])) {
                if (!ch || !ch.name) continue;
                const n = String(ch.name);
                if (!state.existingNames.has(n)) softNames.add(n);
            }
            if (softNames.size) console.log('[命运织机] 数据库/关系表里出现过但没角色条目的：' + [...softNames].slice(0, 12).join('、'));
            if (state.existingNames.size) console.log('[命运织机] 已有角色条目 ' + state.existingNames.size + ' 个，检测时排除');
        } catch (e) { console.warn('[命运织机] 读取已有角色失败', e); }

        const existing = [...state.existingNames].slice(0, 150).join('、');

        // 顺带让模型挑一个本轮该出场的人（复用同一次请求，不额外花钱）
        let castBlock = '';
        try {
            const cache = state.dirCache;
            if (cache && cache.chars && cache.chars.length) {
                const texts2 = msgTexts();
                const log2 = dirLog();
                const n2 = texts2.length;
                const rows2 = [];
                for (const c of cache.chars) {
                    let last = log2[c.name] !== undefined ? log2[c.name] : -1;
                    if (last < 0) { for (let i2 = n2 - 1; i2 >= 0; i2--) { if (texts2[i2].indexOf(c.name) >= 0) { last = i2; break; } } }
                    const gap = last < 0 ? n2 : (n2 - 1 - last);
                    if (gap < 2) continue;
                    const sc = (c.scenes || []).slice(0, 5).join('、');
                    rows2.push('- ' + c.name + '（' + gap + ' 楼未出场）' + (sc ? '　常见场景：' + sc : ''));
                }
                if (rows2.length) castBlock = '<可出场>' + NL2 + rows2.slice(0, 15).join(NL2) + NL2 + '</可出场>';
            }
        } catch (e) { castBlock = ''; }

        const prompt = activeDetect().replace('<已存在>', existing || '（无）') + NL2 + detectGenderRule() + NL2 +
            '【补充】<已存在> 里只列了已经有独立角色条目的人。数据库角色表、人物关系速览、行动路线里提到过、但还没有独立角色条目的人（比如刚登场的新角色、配角），也要列出来。' + NL2 +
            (castBlock ? castBlock + NL2 : '') + '===== 正文 =====' + NL2 + recent;
        const raw = await callLLM(prompt);
        const jj = parseLoose(raw);
        if (jj && jj.director && jj.director.name) {
            const nm2 = String(jj.director.name).trim();
            const known2 = (state.dirCache && state.dirCache.chars) || [];
            if (known2.some(function (c) { return c.name === nm2; })) {
                state.dirSuggestion = { name: nm2, why: String(jj.director.why || '').trim(), at: Date.now() };
                console.log('[命运织机] 模型建议本轮出场：' + nm2 + (jj.director.why ? '（' + jj.director.why + '）' : ''));
            } else {
                state.dirSuggestion = null;
            }
        } else {
            state.dirSuggestion = null;
        }
        const rawCands = ((jj && jj.candidates) || [])
            .filter(c => c && c.name && String(c.name).trim().length <= 12)
            .map(c => ({
                name: String(c.name).trim(),
                alias: Array.isArray(c.alias) ? c.alias.map(String) : [],
                unnamed: !!c.unnamed,
                male: !!c.male,
                reason: String(c.reason || ''),
                confidence: String(c.confidence || 'medium'),
            }));
        const keptCands = [];
        const filteredCands = [];
        for (const c of rawCands) {
            const n = c.name;
            let why = '';
            if (state.existingNames.has(n)) why = '世界书里已经有独立角色条目了';
            if (!why) {
                for (const x of state.existingNames) {
                    if (!x || x.length < 2) continue;
                    if (x.indexOf(n) >= 0 || n.indexOf(x) >= 0) { why = '和已有角色「' + x + '」重叠'; break; }
                }
            }
            if (!why && c.male && !settings().allowMale) why = '男性（设置里关掉了生成男性角色）';
            if (!why) {
                let softHit = '';
                if (softNames.has(n)) softHit = n;
                else {
                    for (const x of softNames) {
                        if (!x || x.length < 2) continue;
                        if (x.indexOf(n) >= 0 || n.indexOf(x) >= 0) { softHit = x; break; }
                    }
                }
                if (softHit) {
                    if (force) keptCands.push(Object.assign({}, c, { soft: true, softName: softHit }));
                    else filteredCands.push({ name: n, why: '数据库/关系表里有记录（' + softHit + '），但还没建角色条目；自动检测跳过' });
                    continue;
                }
            }
            if (why) filteredCands.push({ name: n, why: why });
            else keptCands.push(c);
        }
        // 兜底：模型偶尔不列人 —— 把「数据库/关系表里有记录、且最近正文里出现过」的人也补成候选
        try {
            const recentNS = recent.replace(/\s+/g, '');
            for (const sn of softNames) {
                if (!sn || sn.length < 2 || sn.length > 12) continue;
                if (state.existingNames.has(sn)) continue;
                if (keptCands.some(c => c.name === sn || c.name.indexOf(sn) >= 0 || sn.indexOf(c.name) >= 0)) continue;
                if (filteredCands.some(f => f.name === sn)) continue;
                if (recentNS.indexOf(sn) < 0) continue;
                keptCands.push({ name: sn, alias: [], unnamed: false, male: false, confidence: 'medium', soft: true, softName: sn, reason: '数据库/关系表里有记录，最近正文里也出现过（系统补充）' });
                console.log('[命运织机] 系统补充候选：' + sn);
            }
        } catch (e) { /* ignore */ }
        state.candidates = keptCands.slice(0, 10);
        state.detectInfo = {
            at: Date.now(),
            pool: dp.pool.length,
            raw: rawCands.map(c => c.name),
            kept: keptCands.map(c => c.name),
            filtered: filteredCands,
        };
        for (const f of filteredCands) console.log('[命运织机] 检测过滤：' + f.name + '（' + f.why + '）');
        state.detectedFor = cacheKey;
        markDetect();
        if (state.candidates.length) {
            toast('检测到 ' + state.candidates.length + ' 个可添加人物：' + state.candidates.map(c => c.name).join('、'),
                () => { state.tab = 'add'; render(); });
        }
    } catch (e) {
        state.detectError = e.message || String(e);
    } finally {
        state.detecting = false;
        if (state.tab === 'add') render();
    }
}

// 从世界书里找出已存在的角色（靠条目名反推）
async function listCharacters(book) {
    // 和「出场导演」用同一套识别逻辑，不再各写一份（否则会漏人、重复）
    // 缓存已经是这本书就直接复用，不然每打开一次页面要读两遍世界书
    const cache = (state.dirCache && state.dirCache.book === book) ? state.dirCache : await refreshDirCache(book);
    const data = await getBook(book);
    const es = Object.values(data.entries || {});
    const scanChars = (((settings().dirScan || {})[book] || {}).chars) || [];

    const out = [];
    for (const ch of ((cache && cache.chars) || [])) {
        const n = ch.name;
        if (junkPersonName(n)) continue;
        const scanHit = scanChars.find(function (x) { return x && x.name === n; });
        const llmEntries = (scanHit && Array.isArray(scanHit.entries)) ? scanHit.entries.map(String) : [];
        // 把条目名还原成「主名」：去掉 角色卡 / NSFW档案 前缀和 _行为落地指南 后缀
        const subjOf = function (c) {
            let s2 = String(c || "").replace(/^(?:角色卡|NSFW档案|身体与性癖|身体与性|身体配置|性癖档案)\s*/, "");
            s2 = s2.replace(/_(?:行为落地指南|出场时机)$/, "");
            return s2.trim();
        };
        const mine = es.filter(function (e) {
            const c = String(e.comment || "");
            if (llmEntries.indexOf(c) >= 0) return true;
            if (/^(TavernDB|ACU-)/i.test(c)) return false;
            const sj = subjOf(c);
            if (!sj) return false;
            if (sj === n) return true;
            // 互相包含也算同一个（角色乙 ↔ 母亲角色）
            if (sj.indexOf(n) >= 0 || n.indexOf(sj) >= 0) return true;
            // 「角色丑性格补充」「角色寅-猫妖-（人设核心）」这类：名字后面跟分隔符
            if (c.length > n.length && c.indexOf(n) === 0 && /^[\s_\-—（(【\[]/.test(c.slice(n.length))) return true;
            return false;
        });
        out.push({
            name: n,
            count: mine.length,
            missing: !mine.length,
            chars: mine.reduce(function (a, e) { return a + String(e.content || "").length; }, 0),
            entries: mine.map(function (e) { return { __uid: e.uid, comment: String(e.comment), content: String(e.content || ""), keys: e.key || [] }; }),
        });
    }
    // 有角色的排前面；没建条目的排后面
    return out.sort(function (a, b) {
        return ((a.missing ? 1 : 0) - (b.missing ? 1 : 0)) || a.name.localeCompare(b.name, "zh");
    });
}
// ── 对话结束后自动检测 + 生成 ─────────────────────
let autoTimer = null;
let autoBusy = false;

// 生成进度：写进 state 并实时更新面板上的文字/计时器（不用整页重绘）
function setGenProgress(txt) {
    state.genText = String(txt || '');
    try { const el = document.getElementById('ac-gen-now'); if (el) el.textContent = state.genText; } catch (e) { /* ignore */ }
}
function genElapsedText() {
    const sec = Math.max(0, Math.round((Date.now() - (state.genStart || Date.now())) / 1000));
    return '已用 ' + sec + ' 秒';
}
function stopGenTimer() {
    if (state.genTimer) { try { clearInterval(state.genTimer); } catch (e) { /* ignore */ } state.genTimer = null; }
}
function startGenTimer() {
    stopGenTimer();
    state.genTimer = setInterval(function () {
        const el = document.getElementById('ac-gen-elapsed');
        if (el) el.textContent = genElapsedText();
    }, 1000);
}

function scheduleAuto() {
    if (!settings().autoGenerate) return;
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = setTimeout(() => { autoRun(); }, 2500);
}

// 把检测到的候选生成为模板（点提示里的按钮后才调用）
async function generateDetectTemplates(cands, book) {
    if (!book) book = effectiveBook() || (state.books || [])[0];
    if (!book || !cands || !cands.length) return;
    resetLLMCancel();
    state.genBusy = true;
    state.genStart = Date.now();
    state.genText = '正在准备生成…';
    state.genError = '';
    startGenTimer();
    const prog = toastProgress('正在生成 ' + cands.length + ' 个人物的模板…');
    if (state.tab === 'add') render();
    try {
        for (let ci = 0; ci < cands.length; ci++) {
            if (_llmCancelled) { console.log('[命运织机] 已取消生成，停止后续候选'); break; }
            const c = cands[ci];
            const nm = String(c.name).trim();
            prog.acUpdate('正在生成模板：' + nm + '（' + (ci + 1) + '/' + cands.length + '）');
            setGenProgress('正在生成模板：' + nm + '（' + (ci + 1) + '/' + cands.length + '）');
            // 已经有她就别生成了 —— 这一步就是为了不浪费 token
            try {
                if (await bookHasPerson(book, nm)) {
                    console.log('[命运织机] 「' + nm + '」已经在世界书里，跳过生成');
                    continue;
                }
            } catch (e2) {}
            state.drafts = state.drafts || [];
            const hooks = makeStreamHooks('正在生成模板：' + nm);
            try {
                const plan = await generatePlan({ book, name: nm, aliases: c.alias, idea: settings().idea, source: 'chat' }, hooks);
                if (settings().autoWrite) {
                    prog.acUpdate('世界书条目更新中：' + nm);
                    setGenProgress('正在写入世界书：' + nm);
                    const r = await writePlan(book, plan);
                    state.drafts.unshift({ name: nm, plan, t: Date.now(), written: r });
                } else {
                    state.drafts.unshift({ name: nm, plan, t: Date.now() });
                }
                state.drafts = state.drafts.slice(0, 5);
            } catch (e) {
                state.drafts.unshift({ name: nm, error: (e && e.message) || String(e), t: Date.now() });
                state.drafts = state.drafts.slice(0, 5);
                if (_llmCancelled) break;
            } finally {
                hooks.done();
            }
        }
        if (_llmCancelled) {
            state.genError = '已手动终止本次生成';
            toast('已终止本次生成', null, 4000);
        }
        const good = (state.drafts || []).filter(x => x.plan);
        const wrote = good.filter(x => x.written).length;
        if (settings().autoWrite) {
            prog.acDone(wrote ? ('世界书更新完毕：已写入 ' + wrote + ' 个角色') : '世界书未更新：全部失败');
        } else {
            prog.acDone(good.length ? ('模板已生成 ' + good.length + ' 个，等你审核') : '没有可生成的人物');
        }
        if (!_llmCancelled && good.length) toast(settings().autoWrite
            ? '已自动写入 ' + good.filter(x => x.written).length + ' 个角色：' + good.filter(x => x.written).map(x => x.name).join('、')
            : '模板已生成 ' + good.length + ' 个：' + good.map(x => x.name).join('、') + '，去「添加角色」审核',
            () => { state.tab = 'add'; render(); });
    } finally {
        state.genBusy = false;
        state.genText = '';
        stopGenTimer();
        if (state.tab === 'add') { try { render(); } catch (e) { /* ignore */ } }
    }
}

// 右上角「检测到新人物」提示卡片
let _detectOfferEl = null;
function hideDetectOffer() {
    if (_detectOfferEl) { try { _detectOfferEl.remove(); } catch (e) { /* ignore */ } }
    _detectOfferEl = null;
}
function showDetectOffer(cands, book) {
    hideDetectOffer();
    try {
        const el = document.createElement('div');
        el.id = 'ac-detect-offer';
        el.style.cssText = 'position:fixed;right:22px;top:78px;z-index:100020;width:330px;max-width:calc(100vw - 40px);background:#1b2224;border:1px solid #3a4547;border-radius:12px;box-shadow:0 12px 34px rgba(0,0,0,.55);padding:14px 16px;color:#dfe6e6;font-size:13px;line-height:1.65';
        el.innerHTML = '<div style="display:flex;align-items:center;gap:8px"><i class="fa-solid fa-user-plus" style="color:#8fd9b6"></i><b>检测到 ' + cands.length + ' 个新人物</b></div>' +
            '<div style="margin-top:6px;color:#cfe6dd">' + cands.map(function (c) { return esc(c.name) + (c.unnamed ? '（未命名）' : ''); }).join('、') + '</div>' +
            '<div style="margin-top:6px;color:#8fa0a0;font-size:12px">要现在生成模板吗？生成后放进「添加角色」草稿里等你审核，不会自动写入。</div>' +
            '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' +
            '<button class="ac-btn pri" id="ac-offer-gen">生成模板</button>' +
            '<button class="ac-btn" id="ac-offer-later">稍后</button>' +
            '<button class="ac-btn" id="ac-offer-ignore">忽略</button></div>';
        document.body.appendChild(el);
        _detectOfferEl = el;
        el.querySelector('#ac-offer-gen')?.addEventListener('click', function () { hideDetectOffer(); generateDetectTemplates(cands, book); });
        el.querySelector('#ac-offer-later')?.addEventListener('click', function () { hideDetectOffer(); toast('已收起提示；需要时可以在「添加角色」页手动填名字生成', null, 4000); });
        el.querySelector('#ac-offer-ignore')?.addEventListener('click', function () { hideDetectOffer(); toast('已忽略本次检测结果', null, 3000); });
    } catch (e) { console.warn('[命运织机] 检测提示卡片失败', e); }
}

async function autoRun() {
    if (autoBusy) return;
    if (!settings().autoGenerate) return;
    resetLLMCancel();
    const dp = detectPool();

    autoBusy = true;
    try {
        const book = effectiveBook() || (state.books || [])[0];
        if (!book) return;

        // 1) 找候选人
        const d = await getBook(book);
        const es = Object.values(d.entries || {});
        const known = new Set();
        for (const e of es) {
            const c = String(e.comment || '');
            if (!/^(TavernDB|ACU-)/i.test(c)) { known.add(c); known.add(cleanPersonName(c)); }
            for (const k of (e.key || [])) known.add(String(k));
        }
        for (const dr of (state.drafts || [])) known.add(dr.name);
        // 识别出来的干净人名也算已存在，否则「角色庚（人设核心）」挡不住「角色庚」
        try {
            const cch = await refreshDirCache(book);
            for (const ch of (cch.chars || [])) if (ch && ch.name) known.add(String(ch.name));
        } catch (e) {}

        const recent = dp.pool.map(m => stripMetaForDetect(m.mes || m.message || '')).filter(Boolean).join(NL2).slice(0, 12000);
        if (!recent.trim()) return;

        setGenProgress('正在检测可添加人物…');
        state.detecting = true;
        if (state.tab === 'add') render();
        const prompt = activeDetect().replace('<已存在>', [...known].slice(0, 150).join('、') || '（无）') + NL2 + detectGenderRule() + NL2 + '===== 正文 =====' + NL2 + recent;
        const raw = await callLLM(prompt);
        const jj = parseLoose(raw);
        const autoSkipped = [];
        const cands = ((jj && jj.candidates) || [])
            .filter(c => c && c.name && String(c.name).trim().length <= 12)
            .filter(c => {
                if (c.male && !settings().allowMale) { autoSkipped.push({ name: String(c.name).trim(), why: '男性（设置里关掉了生成男性角色）' }); return false; }
                return true;
            })
            .filter(c => {
                const n0 = cleanPersonName(String(c.name).trim());
                if (!n0) return false;
                if (known.has(n0)) return false;
                for (const x of known) { if (x && x.length >= 2 && (x.indexOf(n0) >= 0 || n0.indexOf(x) >= 0)) return false; }
                return true;
            })
            .slice(0, 2);
        markDetect();
        state.detecting = false;
        state.detectInfo = {
            at: Date.now(),
            pool: dp.pool.length,
            raw: ((jj && jj.candidates) || []).map(c => String((c && c.name) || '')),
            kept: cands.map(c => String(c.name).trim()),
            filtered: autoSkipped,
        };
        if (!cands.length) return;

        // 2) 不再自动生成：右上角弹提示，玩家点「生成模板」才生成
        state.pendingCands = cands;
        showDetectOffer(cands, book);
        if (state.tab === 'add') render();
    } catch (e) {
        state.genError = e && e.message ? e.message : String(e);
        console.warn('[命运织机] 自动检测失败', e);
    } finally {
        autoBusy = false;
        state.detecting = false;
        state.genBusy = false;
        state.genText = '';
        stopGenTimer();
        if (state.tab === 'add') { try { render(); } catch (e) { /* ignore */ } }
    }
}
// ── 面板骨架 ─────────────────────────────────────
function ensurePanel() {
    if ($('ac-overlay')) return;
    const o = document.createElement('div');
    o.id = 'ac-overlay';
    o.style.display = 'none';
    o.innerHTML = `
      <div id="ac-panel">
        <div id="ac-head">
          <div class="logo">织</div>
          <div class="title">${TITLE}<span class="ver">v${VERSION}</span></div>
          <button class="hbtn" id="ac-gal-quick" title="打开/关闭 Galgame 全屏"><i class="fa-solid fa-gamepad"></i><span>▶ Galgame</span></button>
          <button class="hbtn" id="ac-close" title="关闭面板"><i class="fa-solid fa-xmark"></i><span>关闭</span></button>
        </div>
        <div id="ac-body">
          <div id="ac-side">
            <div class="g">总览</div>
            <div class="it" data-tab="overview">概览</div>
            <div class="it" id="ac-gal-mode-it" style="color:#8fd9b6">Galgame 模式：关</div>
            <div class="g">角色</div>
            <div class="it" data-group="chars" data-tab="update">角色中心</div>
            <div class="g">剧情</div>
            <div class="it" data-group="plot" data-tab="director">剧情与演化</div>
            <div class="g">素材</div>
            <div class="it" data-group="assets" data-tab="assets">素材与显示</div>
            <div class="g">设置</div>
            <div class="it" data-group="settings" data-tab="api">系统设置</div>
            <div class="it" id="ac-advanced">切换到高级模式</div>
          </div>
          <div id="ac-main"></div>
        </div>
      </div>`;
    document.body.appendChild(o);
    o.addEventListener('click', function (ev) {
        const b = ev.target && ev.target.closest ? ev.target.closest('[data-sub]') : null;
        if (!b) return;
        const sub = String(b.dataset.sub || '');
        if (!sub || sub === state.tab) return;
        state.tab = sub;
        try { render(); } catch (e) { /* ignore */ }
    });
    $('ac-close').addEventListener('click', closePanel);
    // ── Galgame 模式开关（左侧栏）──
    const galModeIt = $('ac-gal-mode-it');
    if (galModeIt && !galModeIt._bound) {
        galModeIt._bound = true;
        galModeIt.addEventListener('click', function () {
            try {
                const s = settings();
                if (s.vnMode) {
                    s.vnMode = false;
                    persist();
                    try { galClose(); } catch (e) { /* ignore */ }
                    try { const b = document.getElementById('ac-gal-open'); if (b) b.remove(); } catch (e) { /* ignore */ }
                    try { galStopPolling(); } catch (e) { /* ignore */ }
                    toast('Galgame 模式：已关闭', null, 2500);
                } else {
                    s.vnMode = true;
                    persist();
                    if (galChatAlive()) { try { galOpen(); } catch (e) { /* ignore */ } }
                    else { toast('Galgame 模式：开（先打开一个聊天再进）', null, 3000); }
                }
                refreshGalModeUI();
            } catch (e) { console.warn('[命运织机] Galgame 开关失败', e); }
        });
    }
    // ── 顶栏快捷按钮：打开/关闭 Galgame ──
    const galQ = $('ac-gal-quick');
    if (galQ && !galQ._bound) {
        galQ._bound = true;
        galQ.addEventListener('click', function () {
            try {
                const ov = document.getElementById('ac-gal-overlay');
                if (ov && ov.classList.contains('on')) {
                    galClose();
                    toast('Galgame 已关闭', null, 2000);
                } else {
                    if (!galChatAlive()) { toast('先打开一个聊天，再进 Galgame', null, 3000); return; }
                    const s = settings();
                    if (!s.vnMode) { s.vnMode = true; persist(); }
                    try { galEnsureOpenBtn(); } catch (e) { /* ignore */ }
                    galOpen();
                }
                refreshGalModeUI();
            } catch (e) { console.warn('[命运织机] Galgame 快捷按钮失败', e); }
        });
    }
    o.querySelectorAll('#ac-side .it[data-tab]').forEach(it => it.addEventListener('click', () => {
        state.tab = it.dataset.tab;
        try { render(); } catch (e) { console.error('[命运织机] 切换标签失败', e); }
    }));
    $('ac-advanced').addEventListener('click', () => {
        const s2 = settings();
        s2.advanced = !s2.advanced;
        persist();
        if (s2.advanced) { state.tab = 'prompt'; } else { state.tab = 'add'; }
        render();
    });
}


// ── 配色主题（面板 + Galgame 共用）────────────────────
const THEMES = {
    mint: {
        name: '薄荷（默认）', dot: '#a9e5d0',
        vars: { bg: '#1e2426', bg2: '#191e20', card: '#232a2c', hover: '#2a3234', hover2: '#333c3f', border: '#2f3739', borderSoft: '#262d2f', text: '#dfe6e6', text2: '#c2d0d0', sub: '#9fb0b0', sub2: '#6f8080', sub3: '#8fa0a0', accent: '#a9e5d0', accentHover: '#b8efdd', accentInk: '#10201c', accent2: '#8fd9b6', input: '#14181a', input2: '#1a2123', inputBorder: '#333d3f', tag: '#ffd479', tagInk: '#3a2a00', ok: '#7bd88f', err: '#ff8f8f', warn: '#e8c07b', shadow: 'rgba(0,0,0,0.6)' },
        gal: { overlay: '#eaf3fb', topBg: 'rgba(244,248,252,.62)', topText: '#334155', topBorder: 'rgba(255,255,255,.7)', topTitle: '#0f3a5c', btnBg: 'rgba(255,255,255,.55)', btnBorder: 'rgba(255,255,255,.85)', btnText: '#334155', btnHoverBg: 'rgba(224,242,254,.92)', accent: '#38bdf8', boxBg: 'linear-gradient(135deg,rgba(252,253,255,.90) 0%,rgba(240,247,255,.87) 100%)', boxBorder: 'rgba(255,255,255,.92)', boxShadow: '0 14px 38px -8px rgba(9,18,36,.32),inset 0 1px 0 0 rgba(255,255,255,.95),0 0 0 1px rgba(148,163,184,.16)', nameBg: 'linear-gradient(135deg,#38bdf8 0%,#0284c7 100%)', nameText: '#ffffff', nameBorder: 'rgba(255,255,255,.85)', text: '#1e293b', textShadow: '0 1px 1px rgba(255,255,255,.85)', heading: '#075985', em: '#52657c', strong: '#0c2a43', dlg: '#c23a78', dlg2: '#0284c7', hint: 'rgba(2,132,199,.85)', sfx: '#7f9cb5', sfx4: '#94a9c4', choiceBg: 'rgba(248,251,255,.88)', choiceBorder: 'rgba(186,230,253,.95)', choiceText: '#1e293b', inputBg: 'rgba(255,255,255,.78)', inputBorder: 'rgba(203,213,225,.9)', inputText: '#1e293b', inputPlaceholder: '#94a3b8', panelBg: 'rgba(241,246,252,.82)', detailsBg: 'rgba(224,242,254,.55)', detailsBorder: 'rgba(186,230,253,.85)', detailsText: '#3d4f5f', detailsSum: '#075985' }
    },
    ocean: {
        name: '深海蓝', dot: '#7dd3fc',
        vars: { bg: '#16202c', bg2: '#131b25', card: '#1b2836', hover: '#233245', hover2: '#2b3d52', border: '#2a3b4d', borderSoft: '#223141', text: '#dfeaf2', text2: '#c3d5e3', sub: '#8fa8bb', sub2: '#6f8799', sub3: '#7f97a9', accent: '#7dd3fc', accentHover: '#a5e3ff', accentInk: '#07202e', accent2: '#38bdf8', input: '#0f1722', input2: '#142030', inputBorder: '#2a3b4d', tag: '#ffd479', tagInk: '#3a2a00', ok: '#6ee7b7', err: '#fda4af', warn: '#fbbf24', shadow: 'rgba(0,0,0,0.65)' },
        gal: { overlay: '#0b1624', topBg: 'rgba(10,20,32,.72)', topText: '#c7dcee', topBorder: 'rgba(125,211,252,.18)', topTitle: '#8ed8ff', btnBg: 'rgba(14,30,48,.75)', btnBorder: 'rgba(125,211,252,.25)', btnText: '#cfe6f7', btnHoverBg: 'rgba(20,45,70,.9)', accent: '#38bdf8', boxBg: 'linear-gradient(135deg,rgba(12,26,42,.90) 0%,rgba(9,20,33,.88) 100%)', boxBorder: 'rgba(125,211,252,.22)', boxShadow: '0 16px 40px -10px rgba(0,0,0,.6),inset 0 1px 0 0 rgba(125,211,252,.15)', nameBg: 'linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%)', nameText: '#eaf6ff', nameBorder: 'rgba(125,211,252,.35)', text: '#dbe9f5', textShadow: 'none', heading: '#7dd3fc', em: '#9db8cd', strong: '#f0f8ff', dlg: '#7dd3fc', dlg2: '#a5b4fc', hint: 'rgba(125,211,252,.8)', sfx: '#8fb4cc', sfx4: '#a8c8dd', choiceBg: 'rgba(16,32,50,.85)', choiceBorder: 'rgba(125,211,252,.25)', choiceText: '#dbe9f5', inputBg: 'rgba(8,18,30,.85)', inputBorder: 'rgba(125,211,252,.25)', inputText: '#dbe9f5', inputPlaceholder: '#6f8799', panelBg: 'rgba(8,18,30,.86)', detailsBg: 'rgba(30,58,90,.45)', detailsBorder: 'rgba(125,211,252,.25)', detailsText: '#b9d4e8', detailsSum: '#7dd3fc' }
    },
    plum: {
        name: '夜幕紫', dot: '#d8b4fe',
        vars: { bg: '#221a2b', bg2: '#1b1523', card: '#2b2136', hover: '#362a45', hover2: '#423354', border: '#3d2f4d', borderSoft: '#31263e', text: '#ece4f5', text2: '#d4c8e4', sub: '#a395b8', sub2: '#7f7293', sub3: '#9486a8', accent: '#d8b4fe', accentHover: '#e7cfff', accentInk: '#2a1440', accent2: '#c084fc', input: '#171122', input2: '#1f172c', inputBorder: '#3d2f4d', tag: '#ffd479', tagInk: '#3a2a00', ok: '#86efac', err: '#fda4af', warn: '#fbbf24', shadow: 'rgba(0,0,0,0.65)' },
        gal: { overlay: '#140f1e', topBg: 'rgba(20,15,30,.72)', topText: '#d8c8ec', topBorder: 'rgba(216,180,254,.18)', topTitle: '#e9d5ff', btnBg: 'rgba(33,24,46,.78)', btnBorder: 'rgba(216,180,254,.25)', btnText: '#e6d9f5', btnHoverBg: 'rgba(48,35,66,.9)', accent: '#c084fc', boxBg: 'linear-gradient(135deg,rgba(30,22,43,.90) 0%,rgba(24,17,35,.88) 100%)', boxBorder: 'rgba(216,180,254,.22)', boxShadow: '0 16px 40px -10px rgba(0,0,0,.6),inset 0 1px 0 0 rgba(216,180,254,.15)', nameBg: 'linear-gradient(135deg,#a855f7 0%,#6d28d9 100%)', nameText: '#ffffff', nameBorder: 'rgba(216,180,254,.4)', text: '#efe6fa', textShadow: 'none', heading: '#d8b4fe', em: '#b7a6cc', strong: '#ffffff', dlg: '#f0abfc', dlg2: '#a5b4fc', hint: 'rgba(216,180,254,.8)', sfx: '#a892c4', sfx4: '#bda9d6', choiceBg: 'rgba(34,25,48,.86)', choiceBorder: 'rgba(216,180,254,.25)', choiceText: '#efe6fa', inputBg: 'rgba(24,17,34,.86)', inputBorder: 'rgba(216,180,254,.25)', inputText: '#efe6fa', inputPlaceholder: '#7f7293', panelBg: 'rgba(24,17,34,.88)', detailsBg: 'rgba(76,48,110,.45)', detailsBorder: 'rgba(216,180,254,.25)', detailsText: '#d8c8ec', detailsSum: '#d8b4fe' }
    },
    sakura: {
        name: '樱雾', dot: '#f9a8d4',
        vars: { bg: '#2a1d24', bg2: '#241820', card: '#33232d', hover: '#3f2b38', hover2: '#4d3644', border: '#4a3341', borderSoft: '#3c2a36', text: '#f6e6ee', text2: '#e2ccd7', sub: '#b89aa8', sub2: '#8f7583', sub3: '#a38693', accent: '#f9a8d4', accentHover: '#fbcfe8', accentInk: '#3b0d24', accent2: '#f472b6', input: '#1e141b', input2: '#261921', inputBorder: '#4a3341', tag: '#ffd479', tagInk: '#3a2a00', ok: '#86efac', err: '#fda4af', warn: '#fbbf24', shadow: 'rgba(0,0,0,0.65)' },
        gal: { overlay: '#1a1017', topBg: 'rgba(26,16,23,.72)', topText: '#e8ccd9', topBorder: 'rgba(249,168,212,.18)', topTitle: '#fbcfe8', btnBg: 'rgba(42,28,37,.78)', btnBorder: 'rgba(249,168,212,.25)', btnText: '#f3dbe6', btnHoverBg: 'rgba(58,38,50,.9)', accent: '#f472b6', boxBg: 'linear-gradient(135deg,rgba(38,25,33,.90) 0%,rgba(30,19,26,.88) 100%)', boxBorder: 'rgba(249,168,212,.22)', boxShadow: '0 16px 40px -10px rgba(0,0,0,.6),inset 0 1px 0 0 rgba(249,168,212,.15)', nameBg: 'linear-gradient(135deg,#f472b6 0%,#be185d 100%)', nameText: '#ffffff', nameBorder: 'rgba(249,168,212,.4)', text: '#fbeaf3', textShadow: 'none', heading: '#f9a8d4', em: '#c9a5b6', strong: '#ffffff', dlg: '#f9a8d4', dlg2: '#c4b5fd', hint: 'rgba(249,168,212,.8)', sfx: '#b391a1', sfx4: '#c7a7b5', choiceBg: 'rgba(40,26,34,.86)', choiceBorder: 'rgba(249,168,212,.25)', choiceText: '#fbeaf3', inputBg: 'rgba(30,19,26,.86)', inputBorder: 'rgba(249,168,212,.25)', inputText: '#fbeaf3', inputPlaceholder: '#8f7583', panelBg: 'rgba(30,19,26,.88)', detailsBg: 'rgba(90,45,64,.45)', detailsBorder: 'rgba(249,168,212,.25)', detailsText: '#e9cbd9', detailsSum: '#f9a8d4' }
    },
    forest: {
        name: '墨绿', dot: '#e2c46d',
        vars: { bg: '#1a211b', bg2: '#151b16', card: '#212b22', hover: '#2a382c', hover2: '#334434', border: '#33422f', borderSoft: '#27341f', text: '#e6f0e4', text2: '#cfdccb', sub: '#a0b39a', sub2: '#7c8f76', sub3: '#8fa388', accent: '#e2c46d', accentHover: '#f0d98a', accentInk: '#2b2200', accent2: '#d4b95e', input: '#121711', input2: '#182016', inputBorder: '#33422f', tag: '#ffd479', tagInk: '#3a2a00', ok: '#86efac', err: '#fda4af', warn: '#fbbf24', shadow: 'rgba(0,0,0,0.65)' },
        gal: { overlay: '#0f1410', topBg: 'rgba(16,22,17,.72)', topText: '#cfe0c9', topBorder: 'rgba(226,196,109,.18)', topTitle: '#e9dca8', btnBg: 'rgba(26,34,26,.78)', btnBorder: 'rgba(226,196,109,.22)', btnText: '#e2ecdf', btnHoverBg: 'rgba(38,50,38,.9)', accent: '#d4b95e', boxBg: 'linear-gradient(135deg,rgba(26,34,26,.90) 0%,rgba(20,27,21,.88) 100%)', boxBorder: 'rgba(226,196,109,.22)', boxShadow: '0 16px 40px -10px rgba(0,0,0,.6),inset 0 1px 0 0 rgba(226,196,109,.15)', nameBg: 'linear-gradient(135deg,#a16207 0%,#713f12 100%)', nameText: '#fef3c7', nameBorder: 'rgba(226,196,109,.4)', text: '#e9f2e5', textShadow: 'none', heading: '#e2c46d', em: '#a9baa1', strong: '#ffffff', dlg: '#e2c46d', dlg2: '#a3d9a5', hint: 'rgba(226,196,109,.8)', sfx: '#9aab8f', sfx4: '#b3c2a8', choiceBg: 'rgba(28,36,28,.86)', choiceBorder: 'rgba(226,196,109,.25)', choiceText: '#e9f2e5', inputBg: 'rgba(18,23,17,.86)', inputBorder: 'rgba(226,196,109,.25)', inputText: '#e9f2e5', inputPlaceholder: '#7c8f76', panelBg: 'rgba(18,23,17,.88)', detailsBg: 'rgba(60,74,48,.45)', detailsBorder: 'rgba(226,196,109,.25)', detailsText: '#d8e2c8', detailsSum: '#e2c46d' }
    },
    light: {
        name: '宣纸（浅色）', dot: '#38bdf8',
        vars: { bg: '#f4f7f8', bg2: '#eaf0f2', card: '#ffffff', hover: '#e3ecef', hover2: '#dbe6ea', border: '#d3dfe4', borderSoft: '#e3eaee', text: '#1f2d36', text2: '#33454f', sub: '#5f7380', sub2: '#7f929d', sub3: '#6b7f8b', accent: '#38bdf8', accentHover: '#7dd3fc', accentInk: '#06283d', accent2: '#0ea5e9', input: '#ffffff', input2: '#f8fbfc', inputBorder: '#c8d5dc', tag: '#ffe08a', tagInk: '#5c4300', ok: '#16a34a', err: '#dc2626', warn: '#b45309', shadow: 'rgba(15,23,42,0.18)' },
        gal: { overlay: '#f6f8f9', topBg: 'rgba(255,255,255,.72)', topText: '#334155', topBorder: 'rgba(203,213,225,.7)', topTitle: '#0f3a5c', btnBg: 'rgba(255,255,255,.75)', btnBorder: 'rgba(203,213,225,.9)', btnText: '#334155', btnHoverBg: 'rgba(224,242,254,.95)', accent: '#0ea5e9', boxBg: 'linear-gradient(135deg,rgba(255,255,255,.94) 0%,rgba(245,250,255,.92) 100%)', boxBorder: 'rgba(203,213,225,.9)', boxShadow: '0 14px 38px -8px rgba(15,23,42,.18),inset 0 1px 0 0 rgba(255,255,255,1)', nameBg: 'linear-gradient(135deg,#38bdf8 0%,#0284c7 100%)', nameText: '#ffffff', nameBorder: 'rgba(255,255,255,.85)', text: '#22303a', textShadow: 'none', heading: '#0369a1', em: '#52657c', strong: '#0c2a43', dlg: '#b8346a', dlg2: '#0369a1', hint: 'rgba(2,132,199,.9)', sfx: '#7f9cb5', sfx4: '#94a9c4', choiceBg: 'rgba(255,255,255,.92)', choiceBorder: 'rgba(203,213,225,.9)', choiceText: '#22303a', inputBg: 'rgba(255,255,255,.9)', inputBorder: 'rgba(203,213,225,.9)', inputText: '#22303a', inputPlaceholder: '#94a3b8', panelBg: 'rgba(255,255,255,.92)', detailsBg: 'rgba(224,242,254,.60)', detailsBorder: 'rgba(186,230,253,.90)', detailsText: '#33454f', detailsSum: '#0369a1' }
    }
};
function themeKey() { try { const k = settings().theme; return THEMES[k] ? k : 'mint'; } catch (e) { return 'mint'; } }
function themeDef() { return THEMES[themeKey()]; }
function themeOptionsHtml() {
    return Object.keys(THEMES).map(function (k) {
        return '<option value="' + k + '">' + esc(THEMES[k].name) + '</option>';
    }).join('');
}
function themeDotsHtml() {
    return Object.keys(THEMES).map(function (k) {
        return '<button class="ac-btn" data-theme="' + k + '" title="' + esc(THEMES[k].name) + '" style="padding:5px 10px;font-size:12px">' +
            '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + THEMES[k].dot + ';margin-right:6px"></span>' + esc(THEMES[k].name) + '</button>';
    }).join('');
}
function applyTheme() {
    try {
        const t = themeDef();
        const v = t.vars;
        let el = document.getElementById('ac-theme-vars');
        if (!el) { el = document.createElement('style'); el.id = 'ac-theme-vars'; document.head.appendChild(el); }
        el.textContent = '#ac-overlay, #ac-mini {' +
            '--ac-bg:' + v.bg + ';--ac-bg2:' + v.bg2 + ';--ac-card:' + v.card + ';' +
            '--ac-hover:' + v.hover + ';--ac-hover2:' + v.hover2 + ';' +
            '--ac-border:' + v.border + ';--ac-border-soft:' + v.borderSoft + ';' +
            '--ac-text:' + v.text + ';--ac-text2:' + v.text2 + ';' +
            '--ac-sub:' + v.sub + ';--ac-sub2:' + v.sub2 + ';--ac-sub3:' + v.sub3 + ';' +
            '--ac-accent:' + v.accent + ';--ac-accent-hover:' + v.accentHover + ';--ac-accent-ink:' + v.accentInk + ';--ac-accent2:' + v.accent2 + ';' +
            '--ac-input:' + v.input + ';--ac-input2:' + v.input2 + ';--ac-input-border:' + v.inputBorder + ';' +
            '--ac-tag:' + v.tag + ';--ac-tag-ink:' + v.tagInk + ';' +
            '--ac-ok:' + v.ok + ';--ac-err:' + v.err + ';--ac-warncolor:' + v.warn + ';' +
            '--ac-shadow-panel:' + v.shadow + ';' +
            '}';
    } catch (e) { /* ignore */ }
    applyGalThemeCss();
}
function galThemeCss() {
    const g = themeDef().gal;
    return [
        '#ac-gal-overlay{background:' + g.overlay + '}',
        '#ac-gal-top{background:' + g.topBg + ';color:' + g.topText + ';border-bottom-color:' + g.topBorder + '}',
        '#ac-gal-top b{color:' + g.topTitle + '}',
        '#ac-gal-top button{background:' + g.btnBg + ';border-color:' + g.btnBorder + ';color:' + g.btnText + '}',
        '#ac-gal-top button:hover{background:' + g.btnHoverBg + ';border-color:' + g.accent + ';color:' + g.accent + '}',
        '#ac-gal-box{background:' + g.boxBg + ';border-color:' + g.boxBorder + ';color:' + g.text + ';box-shadow:' + g.boxShadow + '}',
        '#ac-gal-box:hover{border-color:' + g.accent + '}',
        '#ac-gal-name{background:' + g.nameBg + ';color:' + g.nameText + ';border-color:' + g.nameBorder + '}',
        '#ac-gal-text{color:' + g.text + ';text-shadow:' + g.textShadow + '}',
        '#ac-gal-text h1,#ac-gal-text h2,#ac-gal-text h3{color:' + g.heading + '}',
        '#ac-gal-text em{color:' + g.em + '}',
        '#ac-gal-text strong{color:' + g.strong + '}',
        '#ac-gal-text .ac-gal-dlg{color:' + g.dlg + '}',
        '#ac-gal-text .ac-gal-dlg2{color:' + g.dlg2 + '}',
        '#ac-gal-hint{color:' + g.hint + '}',
        '#ac-gal-text.ac-gal-sfx{color:' + g.sfx + '}',
        '#ac-gal-text.ac-gal-sfx-4{color:' + g.sfx4 + '}',
        '#ac-gal-text details{background:' + g.detailsBg + ';border-color:' + g.detailsBorder + '}',
        '#ac-gal-text details summary{color:' + g.detailsSum + '}',
        '#ac-gal-text details em{color:' + g.detailsText + ';opacity:.95}',
        '#ac-gal-choice button{background:' + g.choiceBg + ';border-color:' + g.choiceBorder + ';color:' + g.choiceText + '}',
        '#ac-gal-input input{background:' + g.inputBg + ';border-color:' + g.inputBorder + ';color:' + g.inputText + '}',
        '#ac-gal-input input::placeholder{color:' + g.inputPlaceholder + '}',
        '#ac-gal-input button{background:' + g.nameBg + ';color:' + g.nameText + '}',
        '#ac-gal-backlog,#ac-gal-charstate-panel{background:' + g.panelBg + '}'
    ].join('\n');
}
function applyGalThemeCss() {
    try {
        let el = document.getElementById('ac-gal-theme');
        if (!el) { el = document.createElement('style'); el.id = 'ac-gal-theme'; }
        el.textContent = galThemeCss();
        document.head.appendChild(el);
    } catch (e) { /* ignore */ }
}
function setTheme(key) {
    const k = THEMES[key] ? key : 'mint';
    settings().theme = k;
    persist();
    applyTheme();
    try {
        const sel = document.getElementById('ac-theme');
        if (sel) sel.value = k;
        document.querySelectorAll('[data-theme]').forEach(function (b) { b.classList.toggle('pri', b.dataset.theme === k); });
    } catch (e) { /* ignore */ }
    toast('配色：' + THEMES[k].name, null, 2200);
    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
}

function openPanel(tab) {
    try { applyTheme(); } catch (e) { /* ignore */ }
    // 导演开着的话，启动就把素材读进来（否则刷新后静默失效）
    // 老版本默认 15% 硬插，升级后强制关掉（避免用户被静默硬插）
    try {
        const st = settings();
        if (st.directorAllowRandom === undefined) { st.directorAllowRandom = false; st.directorChance = 0; persist(); }
    } catch (e) { /* ignore */ }
    if (settings().director && settings().targetBook) {
        refreshDirCache().then(function () {
            console.log('[命运织机] 出场导演素材已加载 ' + ((state.dirCache && state.dirCache.chars.length) || 0) + ' 个角色');
        }).catch(function (e) { console.warn('[命运织机] 导演素材加载失败', e); });
    }

    ensurePanel();
    $('ac-overlay').style.display = 'flex';
    state.tab = tab || 'add';
    render();
    if (!tab || tab === 'add') detectCandidates(false);
}
function closePanel() {
    const o = $('ac-overlay');
    if (o) o.style.display = 'none';
    document.querySelectorAll('#ac-side .it').forEach(it => it.classList.remove('on'));
}

// ── 渲染 ─────────────────────────────────────────
// 安全渲染：面板没建就跳过；出错时把错误显示出来，而不是留下旧内容
function render() {
    if (!$('ac-main')) return;
    try {
        refreshGalModeUI();
    } catch (e) { /* ignore */ }
    try {
        renderInner();
    } catch (e) {
        console.error('[命运织机] 渲染失败', e);
        const m = $('ac-main');
        if (m) {
            m.innerHTML = '<div class="ac-card"><div class="h">渲染出错</div>' +
                '<div class="ac-warn">' + esc(e && e.message ? e.message : e) + '</div>' +
                '<div class="ac-view" style="max-height:260px">' + esc(String((e && e.stack) || '').slice(0, 1200)) + '</div>' +
                '<div class="hint">把这段贴给我就能定位。</div></div>';
        }
    }
}
// 页内子导航：把「添加/导入/更新」「API/备份/提示词」收进同一组的二级切换
function groupOfTab(tab) {
    if (tab === 'add' || tab === 'import' || tab === 'update') return 'chars';
    if (tab === 'director' || tab === 'charstate') return 'plot';
    if (tab === 'api' || tab === 'backups' || tab === 'prompt') return 'settings';
    return 'overview';
}
function viewSubnav(group) {
    let items = [];
    if (group === 'chars') items = [['update', '更新角色'], ['add', '添加角色'], ['import', '从世界书导入']];
    else if (group === 'plot') items = [['director', '出场导演'], ['charstate', '人物变化']];
    else if (group === 'settings') { items = [['api', 'API 配置'], ['backups', '备份']]; if (settings().advanced) items.push(['prompt', '提示词']); }
    if (!items.length) return '';
    return '<div class="ac-subnav" style="display:flex;gap:8px;margin:0 0 14px;flex-wrap:wrap">' +
        items.map(function (kv) { return '<button class="ac-btn' + (state.tab === kv[0] ? ' pri' : '') + '" data-sub="' + kv[0] + '">' + kv[1] + '</button>'; }).join('') +
        '</div>';
}
function renderInner() {
    const adv = !!settings().advanced;
    const pt = $('ac-tab-prompt');
    if (pt) pt.style.display = adv ? '' : 'none';
    const ab = $('ac-advanced');
    if (ab) ab.textContent = adv ? '退出高级模式' : '切换到高级模式';
    if (!adv && state.tab === 'prompt') state.tab = 'api';
    const group = groupOfTab(state.tab);
    document.querySelectorAll('#ac-side .it[data-tab]').forEach(function (it) {
        const g = it.dataset.group || '';
        let on = false;
        if (g) on = (g === group);
        else if (it.dataset.tab) on = (it.dataset.tab === state.tab);
        it.classList.toggle('on', on);
    });
    const m = $('ac-main');
    const sub = viewSubnav(group);
    if (state.tab === 'add') m.innerHTML = sub + viewAdd();
    if (state.tab === 'import') { m.innerHTML = sub + viewImport(); wireImport(); return; }
    if (state.tab === 'overview') { m.innerHTML = sub + viewOverview(); refreshOverview(); return; }
    if (state.tab === 'backups') { m.innerHTML = sub + viewBackups(); wireBackups(); return; }
    if (state.tab === 'update') {
        m.innerHTML = sub + '<h2>更新角色</h2><div class="ac-card"><div class="ac-empty">读取中…</div></div>';
        viewUpdate().then(function (html) {
            if (state.tab !== 'update') return;
            m.innerHTML = viewSubnav('chars') + html;
            wireUpdate();
        }).catch(function (e) {
            m.innerHTML = '<div class="ac-card"><div class="h">读取失败</div><div class="ac-warn">' + esc(e.message || e) + '</div></div>';
        });
        return;
    }
    if (state.tab === 'director') {
        m.innerHTML = sub + viewDirector();
        wireDirector();
        if (!state.dirCache) { refreshDirCache().then(function () { if (state.tab === 'director') render(); }).catch(function () {}); }
        return;
    }
    if (state.tab === 'assets') { m.innerHTML = sub + viewAssets(); wireAssets(); return; }
    if (state.tab === 'charstate') {
        m.innerHTML = sub + viewCharState();
        wireCharState();
        if (!state.dirCache) { refreshDirCache().then(function () { if (state.tab === 'charstate') render(); }).catch(function () {}); }
        return;
    }
    if (state.tab === 'api') { m.innerHTML = sub + viewApi(); wireApi(); return; }
    if (state.tab === 'prompt') { m.innerHTML = sub + viewPrompt(); wirePrompt(); return; }
    wireAdd();
}

// ── 导入人物（从别的世界书搬）──────────────────────
function viewImport() {
    const s = settings();
    const info = state.importInfo;
    const target = effectiveBook();
    const books = (state.books || []).filter(function (b) { return b && b !== target; });
    const impHtml = (function () {
    let h = '<div class="ac-card"><div class="h">从别的世界书导入人物</div>' +
            '<div class="hint" style="margin-bottom:10px">批量搬运人物（原书不动）。</div>' +
            '<div class="ac-f"><label>来源世界书</label><select id="ac-imp-book">' +
            '<option value="">（选一本书）</option>' +
            books.map(function (b) {
                const sel = (info && info.book === b) ? ' selected' : '';
                return '<option value="' + esc(b) + '"' + sel + '>' + esc(b) + '</option>';
            }).join('') +
            '</select></div>' +
            '<button class="ac-btn" id="ac-imp-scan">读取人物</button>';
        h += '<label class="ac-sw" style="margin-top:10px"><input type="checkbox" id="ac-imp-review"' +
            (settings().importReview ? ' checked' : '') + ' /><span>生成后先放进草稿，让我看过再写</span></label>' +
            '<div class="hint">勾上先出草稿；不勾直接写入（可在「备份」页撤回）。</div>';
        if (info) {
            const pend = (info.chars || []).filter(function (x2) { return !x2.exists; });
            h += '<div class="hint" style="margin-top:10px">「' + esc(info.book) + '」里有 ' + (info.chars || []).length + ' 个角色，其中 ' + pend.length + ' 个当前书里没有。</div>';
            if (!(info.chars || []).length) h += '<div class="ac-warn">这本书里没认出角色。换个命名规范的，或先用「一键修复」统一条目名。</div>';
            h += (info.chars || []).map(function (x2) {
                const on = (state.importPick || {})[x2.name] !== false && !x2.exists;
                return '<label class="ac-row" style="gap:8px;cursor:pointer"><input type="checkbox" data-imp="' + esc(x2.name) + '"' + (on ? ' checked' : '') + (x2.exists ? ' disabled' : '') + ' />' +
                    '<span class="c">' + esc(x2.name) + (x2.exists ? ' <span class="tag">已有</span>' : '') + '</span>' +
                    '<span class="n">' + x2.count + ' 条 · ' + x2.chars + ' 字</span></label>';
            }).join('');
            if (pend.length) h += '<div style="margin-top:10px"><button class="ac-btn pri" id="ac-imp-run">全部生成并写入（' + pend.length + ' 人）</button></div>';
        }
        return h + '</div>';
    })();

    let out = '<h2>导入人物</h2>';
    out += '<div class="ac-card"><div class="hint">批量搬人：以原书条目为素材，生成织机格式新条目（原书不动）。当前目标：<b>' + esc(effectiveBook() || '(未选)') + '</b></div></div>';
    return out + impHtml;
}

function viewAdd() {
    const s = settings();
    const cv = state.candidates || [];
    const dr = state.drafts || [];
    const okDrafts = dr.filter(x => x.plan).map(function (x) {
        // 她已经在这本书里了？过期草稿或重复检测时要能看出来
        let dup = false;
        try {
            const names = state.existingNames;
            if (names && names.size) {
                dup = [...names].some(function (e2) {
                    return e2 && e2.length >= 2 && (e2.indexOf(x.name) >= 0 || x.name.indexOf(e2) >= 0);
                });
            }
        } catch (e2) {}
        return Object.assign({}, x, { dup: dup });
    });
    const banner = (function () {
        let h = '';
        if (state.genBusy) {
            h += '<div class="ac-card"><div class="h">检测到新人物，正在生成模板…<span class="i" id="ac-gen-elapsed">' + genElapsedText() + '</span></div>' +
                '<div class="hint" id="ac-gen-now" style="color:#dfe6e6">' + esc(state.genText || '正在准备…') + '</div>' +
                '<div class="hint">生成内容会像正文一样<b>流式显示在右下角</b>，可以边写边看。单次请求最多等 ' + (Number(settings().llmTimeout) || 120) + ' 秒，超时会自动报错；也可以直接终止。</div>' +
                '<div style="margin-top:10px"><button class="ac-btn" id="ac-gen-cancel">终止生成</button></div></div>';
        } else if (state.genError) {
            h += '<div class="ac-card"><div class="h">上次自动生成失败</div>' +
                '<div class="ac-warn">' + esc(state.genError) + '</div>' +
                '<div style="margin-top:10px"><button class="ac-btn" id="ac-gen-clear">知道了</button></div></div>';
        } else if (okDrafts.length) {
            h += '<div class="ac-card"><div class="h">检测到 ' + okDrafts.length + ' 个可添加人物（模板已生成）' +
                '<span class="i" style="cursor:pointer" id="ac-redetect">重新检测</span></div>';
            h += okDrafts.map((x, i) =>
                '<div class="ac-draft"><span class="tag">' + (x.dup ? '书里已有' : '已生成') + '</span><span class="nm">' + esc(x.name) + (x.unnamed ? ' <span class="tag">未命名</span>' : '') + '</span>' +
                '<button class="ac-btn" data-load="' + i + '">查看/编辑</button></div>').join('');
            const errs = dr.filter(x => x.error);
            if (errs.length) h += errs.map(x => '<div class="ac-warn">⚠ ' + esc(x.name) + ' 生成失败：' + esc(x.error) + '</div>').join('');
            if (okDrafts.some(x => x.dup)) {
                h += '<div class="hint" style="color:#ffb4b4">标「书里已有」的那几个，目标世界书里本来就有她 —— 别再加一份，点「重新检测」清掉。</div>';
            }
            h += '<div class="hint">点「查看/编辑」把模板载入下面的编辑区。</div></div>';
        } else if (state.detecting) {
            h += '<div class="ac-card"><div class="h">正在检测可添加人物…</div></div>';
        } else if (state.detectError) {
            h += '<div class="ac-card"><div class="h">检测失败</div><div class="ac-warn">' + esc(state.detectError) + '</div></div>';
        } else if (!cv.length && (state.detectInfo || state.detectedFor)) {
            const di = state.detectInfo || {};
            const filtered = di.filtered || [];
            h += '<div class="ac-card"><div class="h">上次检测：最近 ' + (di.pool || '?') + ' 楼没发现可添加的新人物' +
                '<span class="i" style="cursor:pointer" id="ac-redetect">重新检测</span></div>';
            if (filtered.length) {
                h += '<div class="hint">自动检测跳过了下面这些人（原因见每条）。想加的话点右边的「添加这个人」：</div>' +
                    filtered.slice(0, 8).map(f => '<div class="ac-ec" style="margin:8px 0;padding:10px 12px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">' +
                        '<span style="font-size:14px"><b>' + esc(f.name) + '</b> <span class="tag">未建条目</span></span>' +
                        '<button class="ac-btn pri" data-cand="' + esc(f.name) + '" data-alias="" style="padding:5px 14px;font-size:12px;flex:0 0 auto">添加这个人</button>' +
                        '</div>' +
                        '<div class="hint" style="margin-top:6px;color:#8fa0a0">原因：' + esc(String(f.why || '')).slice(0, 80) + '</div></div>').join('') +
                    '<div class="hint">点了之后，名字会填进下面「人物名」并可滚动过去；在「你的想法（可选）」里还能补设定。</div>';
            } else {
                h += '<div class="hint">最近剧情里出现的人都已经在世界书里了。</div>';
            }
            h += '<div class="hint">想生成男性角色的话，在页面下方（高级模式）勾选「允许生成男性角色」再检测。</div></div>';
        } else if (cv.length) {
            h += '<div class="ac-card"><div class="h">检测到 ' + cv.length + ' 个可添加人物' +
                '<span class="i" style="cursor:pointer" id="ac-redetect">重新检测</span></div>';
            h += cv.map(c => '<div class="ac-row" data-cand="' + esc(c.name) + '" data-alias="' + esc((c.alias || []).join('、')) + '">' +
                '<span class="c">' + esc(c.name) +
                (c.unnamed ? ' <span class="tag">未命名</span>' : '') +
                (c.soft ? ' <span class="tag">数据库有记录·未建条目</span>' : '') +
                (c.confidence === 'high' ? ' <span class="dot">●</span>' : '') + '</span>' +
                '<span class="n">' + esc(c.reason).slice(0, 40) + '</span></div>').join('');
            h += '<div class="hint">点一个名字，自动填进下面的「人物名」。</div></div>';
        }
        return h;
    })();
const xpHtml = (function () {
        const sel = s.xpPool || [];
        let h = '<details class="ac-xp"' + (sel.length ? ' open' : '') + '>';
        h += '<summary>性癖池　<span class="cnt">已选 ' + sel.length + ' 个</span></summary>';
        h += allXpGroups().map(function (g) {
            return '<div class="ac-xpg"><div class="ac-xpg-h">' + g.name + '</div><div class="ac-xpi">' +
                g.items.map(function (x) {
                    return '<label class="ac-xpc"><input type="checkbox" data-xp="' + x + '"' +
                        (sel.indexOf(x) >= 0 ? ' checked' : '') + ' /><span>' + x + '</span></label>';
                }).join('') + '</div></div>';
        }).join('');
        h += '<div class="hint">勾选的会长期保存。每个角色随机抽 1~2 个，且不会和上一个角色重复。</div>';
        h += '<button class="ac-btn" id="ac-xpclear" style="margin-top:8px;">清空</button>';
        h += '</details>';
        return h;
    })();
    return `
      <h2>添加角色</h2>
      ${banner}
      <div class="ac-card">
        <div class="h">检测新人物<span class="i">手动</span></div>
        <div class="hint">扫描最近剧情，找出还没做进世界书的新人物（结果会列在上面）。自动检测关着、或者想立刻检查时用这个。<br>如果最近只有男性/已知角色，会提示「没发现」；想生成男性角色请在下方勾选「允许生成男性角色」。<br>检测不到人也没关系：可以点下面的「手动填写人物名」，直接从正文里提取她/他的描写来生成条目。</div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap">
          <button class="ac-btn pri" id="ac-detect-now">检测最近剧情</button>
          <button class="ac-btn" id="ac-manual-fill">手动填写人物名</button>
          <span class="hint" id="ac-detect-msg" style="margin:0"></span>
        </div>
      </div>
      <div class="ac-card">
        <div class="h">1. 素材来源</div>
        <div class="ac-f">
          <label>从哪里取这个人的设定</label>
          <div class="ac-seg" id="ac-seg">
            <div data-src="chat" class="${s.source === 'chat' ? 'on' : ''}">当前聊天的正文</div>
            <div data-src="char" class="${s.source === 'char' ? 'on' : ''}">当前角色卡</div>
          </div>
        </div>
        <div class="ac-f">
          <label>人物名</label>
          <input type="text" id="ac-name" placeholder="例：佐野澪" value="${esc(s.name)}" />
          <div class="hint">从正文取时必填；会把这个名字（以及前两个字）出现过的段落全部收集起来。</div>
        </div>
        ${s.advanced ? '<div class="ac-f">' +
            '<label>检测范围　<span class="cnt">每轮都跑</span></label>' +
            '<select id="ac-detectdepth">' +
            [4,8,15,30].map(function (n) { return '<option value="' + n + '"' + (Number(s.detectDepth) === n ? ' selected' : '') + '>最近 ' + n + ' 楼</option>'; }).join('') +
            '</select>' +
            '<div class="hint">每轮回复后都按这个范围找人。调大会明显变贵，4~8 楼通常够用。</div>' +
            '</div>' : ''}
        <div class="ac-f">
          <label>素材范围　<span class="cnt">只在加人时跑</span></label>
          <select id="ac-scanDepth">
            ${[20,50,100,200].map(n => '<option value="' + n + '"' + (Number(s.scanDepth) === n ? ' selected' : '') + '>最近 ' + n + ' 楼</option>').join('')}
            <option value="0"${Number(s.scanDepth) === 0 ? ' selected' : ''}>全部</option>
          </select>
          <div class="hint">只在真正加人时跑一次，所以可以调大。她可能很早就出场了，范围太小会漏掉早期描写。</div>
        </div>
        <div class="ac-f">
          <label>你的想法（可选）</label>
          <textarea id="ac-idea" placeholder="例：便利店店员，成年，怕生但嘴硬，对主线的秘密不知情">${esc(s.idea)}</textarea>
          <div class="hint">写多少都行，会原样交给模型，但不能和正文矛盾。</div>
        </div>
      </div>

      <div class="ac-card">
        <div class="h">2. 目标世界书</div>
        <div class="ac-f">
          <label>写入哪一本　<span class="cnt" id="ac-bookcnt">共 ${state.books.length} 本</span></label>
          <div class="ac-bookrow">
            <select id="ac-book">${state.books.map(b => `<option value="${esc(b)}" ${b === s.targetBook ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select>
            <button class="ac-btn" id="ac-bookok">确定</button>
            <button class="ac-btn" id="ac-bookreload" title="重新读取世界书列表">↻</button>
          </div>
          <label class="ac-sw" style="margin-top:10px"><input type="checkbox" id="ac-followbook"${s.followCharBook !== false ? ' checked' : ''} /> 跟随角色卡绑定的世界书</label>
        <div class="hint" id="ac-bookstate">实际写入：<b>${esc(effectiveBook() || '(未选择)')}</b>${s.followCharBook !== false && boundBook() ? '　（跟随角色卡）' : ''}</div>
        </div>
        <div class="ac-sub" style="margin-top:12px;">
          <div class="ac-sub-h">自动化开关</div>

          <label class="ac-sw">
            <input type="checkbox" id="ac-auto" ${s.autoGenerate ? "checked" : ""} />
            <span>对话结束后自动检测新人物</span>
          </label>
          <div class="hint">每轮回复结束自动扫描；检测到新人会在右上角弹提示，你点「生成模板」才生成（不会自动生成）。</div>

          <label class="ac-sw" style="margin-top:10px;">
            <input type="checkbox" id="ac-autowrite" ${s.autoWrite ? "checked" : ""} />
            <span>免审核，直接写入世界书</span>
          </label>
          <div class="hint">开启后生成完立刻写进目标世界书，不再等你看（写前仍自动备份）。</div>

          <label class="ac-sw" style="margin-top:10px;">
            <input type="checkbox" id="ac-allowmale" ${s.allowMale ? "checked" : ""} />
            <span>允许生成男性角色</span>
          </label>
          <div class="hint">关掉时，检测和生成都跳过男性角色。</div>
        </div>
        ${xpHtml}

        <button class="ac-btn pri big" id="ac-analyze"><i class="fa-solid fa-wand-magic-sparkles"></i> 分析（先预览，不写入）</button>
        <div class="ac-msg" id="ac-msg"></div>
      </div>

      <div id="ac-result"></div>`;
}

// 导入人物页的绑定
function wireImport() {
    // 从别的角色卡导入
    $('ac-imp-review')?.addEventListener('change', function (e) {
        settings().importReview = !!e.target.checked;
        persist();
    });
    $('ac-imp-scan')?.addEventListener('click', async function () {
        const sel = $('ac-imp-book');
        const idx = sel ? sel.value : '';
        const prog = toastProgress('正在读取来源世界书…');
        try {
            const info = await scanImportBook(idx);
            state.importInfo = info;
            state.importPick = {};
            prog.acDone('读到 ' + info.chars.length + ' 个角色');
            render();
        } catch (e) {
            prog.acDone('读取失败：' + errBrief(e), 8000);
        }
    });
    document.querySelectorAll('[data-imp]').forEach(function (box) {
        box.addEventListener('change', function () {
            state.importPick = state.importPick || {};
            state.importPick[box.dataset.imp] = !!box.checked;
        });
    });
    $('ac-imp-run')?.addEventListener('click', async function () {
        const info = state.importInfo;
        if (!info) return;
        const names = (info.chars || []).filter(function (x) {
            return !x.exists && (state.importPick || {})[x.name] !== false;
        }).map(function (x) { return x.name; });
        if (!names.length) { toast('没有选中任何人', null, 4000); return; }
        if (!confirm('会为 ' + names.length + ' 个人各生成一套条目写入「' + effectiveBook() + '」，每人 1 次请求。继续吗？')) return;
        const prog = toastProgress('正在导入 ' + names.length + ' 个角色…');
        progNote = function (m) { if (prog && prog.acUpdate) prog.acUpdate(m); };
        try {
            const r = await runImport(names);
            prog.acDone(r.review ? ('已生成 ' + r.done.length + ' 个草稿，去页面顶部逐个确认') : ('导入完成：成功 ' + r.done.length + ' 个' + (r.failed.length ? '，失败 ' + r.failed.length + ' 个' : '')));
            if (r.failed.length) console.warn('[命运织机] 导入失败明细', r.failed);
            state.importInfo = null;
            await refreshDirCache();
            render();
        } catch (e) {
            prog.acDone('导入失败：' + errBrief(e), 8000);
        } finally { progNote = function () {}; }
    });
}

function wireAdd() {

    const s = settings();
    $('ac-seg')?.querySelectorAll('[data-src]').forEach(d => d.addEventListener('click', () => {
        s.source = d.dataset.src; persist();
        $('ac-seg').querySelectorAll('[data-src]').forEach(x => x.classList.toggle('on', x === d));
    }));
    $('ac-name')?.addEventListener('input', e => { s.name = e.target.value; persist(); });
    $('ac-detectdepth')?.addEventListener('change', e => { s.detectDepth = Number(e.target.value) || 8; persist(); });
    $('ac-scanDepth')?.addEventListener('change', e => { s.scanDepth = Number(e.target.value) || 0; persist(); });
    $('ac-idea')?.addEventListener('input', e => { s.idea = e.target.value; persist(); });
    $('ac-followbook')?.addEventListener('change', function (e) {
        settings().followCharBook = e.target.checked;
        persist(); render();
    });
    $('ac-book')?.addEventListener('change', () => {
        const st = $('ac-bookstate');
        if (st) st.innerHTML = '当前写入目标：<b>' + esc($('ac-book').value) + '</b>（点确定保存）';
    });
    $('ac-bookok')?.addEventListener('click', () => {
        const v = $('ac-book')?.value;
        if (!v) return setMsg('列表是空的，点 ↻ 重新读取', 'err');
        setTargetBook(v);
        $('ac-bookstate').innerHTML = '当前写入目标：<b>' + esc(v) + '</b>';
        setMsg('已切换到「' + v + '」', 'ok');
        toast('写入目标已切换为「' + v + '」');
    });
    $('ac-bookreload')?.addEventListener('click', async () => {
        const btnEl = $('ac-bookreload');
        if (btnEl) btnEl.textContent = '…';
        try {
            state.books = await listBooks();
            if (!s.targetBook && state.books.length) setTargetBook(state.books[0]);
            persist();
            render();
            setMsg('已读取到 ' + state.books.length + ' 本世界书', 'ok');
        } catch (e) { setMsg('读取失败：' + e.message, 'err'); }
    });
    document.querySelectorAll('[data-cand]').forEach(row => row.addEventListener('click', () => {
        const nm = row.dataset.cand;
        state.curAlias = (row.dataset.alias || '').split('、').map(x => x.trim()).filter(Boolean);
        if ($('ac-name')) { $('ac-name').value = nm; s.name = nm; persist(); }
        const el = $('ac-name');
        if (el) {
            try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(); }
            el.focus();
        }
        setMsg('已填入「' + nm + '」。在下面「你的想法（可选）」里可补设定，然后点「分析」生成模板。', 'ok');
        toast('已填入「' + nm + '」，往下看「人物名」和「你的想法」', null, 5000);
    }));
    $('ac-redetect')?.addEventListener('click', () => detectCandidates(true));
    // 手动填写：直接把注意力引到「人物名」，不依赖检测结果
    $('ac-manual-fill')?.addEventListener('click', function () {
        const el = $('ac-name');
        if (!el) return;
        try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(); }
        el.focus();
        setMsg('在「人物名」里输入名字（如：角色丁），再点「分析」生成模板。下面的「你的想法」可以写补充设定，也会一起交给模型。', 'ok');
    });
    // 手动检测新人物（不依赖自动检测）
    $('ac-detect-now')?.addEventListener('click', async function () {
        const btn = $('ac-detect-now');
        const msg = $('ac-detect-msg');
        if (state.detecting) return;
        if (btn) { btn.disabled = true; btn.textContent = '检测中…'; }
        if (msg) msg.textContent = '正在扫描最近剧情（模型读最近几楼，约 10~30 秒）…';
        try {
            await detectCandidates(true);
            const di = state.detectInfo || {};
            const n = (state.candidates || []).length;
            if (msg) msg.textContent = '';
            if (state.detectError) {
                toast('检测失败：' + state.detectError, null, 8000);
            } else if (n) {
                toast('检测到 ' + n + ' 个新人物：' + (di.kept || []).join('、'), null, 5000);
            } else if ((di.filtered || []).length) {
                toast('没检测到可添加的新人物（' + di.filtered.length + ' 个被过滤，原因见页面）', null, 7000);
            } else {
                toast('最近 ' + (di.pool || '?') + ' 楼没发现新人物', null, 5000);
            }
        } catch (e) {
            if (msg) msg.textContent = '检测失败：' + errBrief(e);
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = '检测最近剧情'; }
        }
    });
    // 终止自动生成 / 清掉失败提示
    $('ac-gen-cancel')?.addEventListener('click', function () {
        try { abortLLM(); } catch (e) { /* ignore */ }
        stopGenTimer();
        state.genBusy = false;
        state.detecting = false;
        state.genText = '';
        state.genError = '已手动终止本次生成';
        try { toast('已终止本次生成（不会再继续重试）', null, 4000); } catch (e) { /* ignore */ }
        render();
    });
    $('ac-gen-clear')?.addEventListener('click', function () {
        state.genError = '';
        render();
    });
    document.querySelectorAll('[data-load]').forEach(btn => btn.addEventListener('click', () => {
        const d = (state.drafts || []).filter(x => x.plan)[Number(btn.dataset.load)];
        if (!d) return;
        state.plan = d.plan;
        renderResult();
    }));
    $('ac-auto')?.addEventListener('change', e => { s.autoGenerate = !!e.target.checked; persist(); });
    $('ac-autowrite')?.addEventListener('change', e => { s.autoWrite = !!e.target.checked; persist(); });
    $('ac-allowmale')?.addEventListener('change', e => { s.allowMale = !!e.target.checked; persist(); });
    document.querySelectorAll('[data-xp]').forEach(ck => ck.addEventListener('change', () => {
        const box = settings();
        box.xpPool = box.xpPool || [];
        const v = ck.dataset.xp;
        if (ck.checked) { if (box.xpPool.indexOf(v) < 0) box.xpPool.push(v); }
        else box.xpPool = box.xpPool.filter(x => x !== v);
        persist();
        const c = document.querySelector('.ac-xp .cnt');
        if (c) c.textContent = '已选 ' + box.xpPool.length + ' 个';
    }));
    $('ac-xpclear')?.addEventListener('click', () => {
        settings().xpPool = []; persist(); render();
    });
    $('ac-analyze')?.addEventListener('click', doAnalyze);
    renderResult();
}

// ── 右上角浮动提示 ───────────────────────────────
let progNote = function (m) { try { console.log('[命运织机] ' + m); } catch (e) {} };

function toast(desc, onView, ms) {
    let box = document.getElementById('ac-toasts');
    if (!box) {
        box = document.createElement('div');
        box.id = 'ac-toasts';
        document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = 'ac-toast';
    el.innerHTML =
        '<div class="ico">AC</div>' +
        '<div class="tx"><div class="t">yek命运织机</div><div class="d">' + esc(desc) + '</div></div>' +
        '<button class="go">查看</button>' +
        '<button class="x" title="关闭">×</button>';
    box.appendChild(el);

    const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 240); };
    el.querySelector('.x').addEventListener('click', close);
    el.querySelector('.go').addEventListener('click', () => {
        close();
        openPanel();
        if (onView) onView();
    });
    el.addEventListener('click', e => { if (e.target === el) { close(); openPanel(); } });
    try { galNotice(desc); } catch (e) { /* ignore */ }
    if (ms !== 0) setTimeout(close, ms || 22000);

    // 句柄：可更新文字、标记完成
    el.acUpdate = function (text) {
        const d = el.querySelector('.d');
        if (d) d.textContent = text;
    };
    el.acSpin = function (on) {
        const ic = el.querySelector('.ico');
        if (!ic) return;
        ic.textContent = on ? '…' : 'AC';
        ic.classList.toggle('spin', !!on);
        el.classList.toggle('working', !!on);
    };
    el.acDone = function (text, wait) {
        el.acUpdate(text);
        el.acSpin(false);
        el.classList.add('done');
        setTimeout(close, wait || 6000);
    };
    el.acClose = close;
    return el;
}

// 导演提示：轻量、短、和别的提示区分开
function toastDirector(kind, name, gap, text) {
    if (!settings().directorNotify) return;
    const el = toast('', null, 5000);
    el.classList.add('dir');
    if (kind === 'mild') el.classList.add('mild');
    const title = kind === 'mild' ? '导演 · 轻提' : (kind === 'llm' ? '导演 · 出场（模型判断）' : '导演 · 出场');
    const d = el.querySelector('.d');
    const tt = el.querySelector('.t');
    const ic = el.querySelector('.ico');
    if (ic) ic.textContent = kind === 'mild' ? '提' : '导';
    if (tt) tt.textContent = title;
    if (d) d.textContent = name + '（' + gap + ' 楼未出场）' + (kind === 'mild' ? ' —— 只提及，不出场' : ' —— 已让 AI 考虑让她登场');
}
// 进行中提示：不自动消失，由调用方结束
const TOAST_RECENT = new Map();
// 出错时把「哪一行」一起报出来，不然只有一句 message 根本没法定位
function errBrief(e) {
    const msg = (e && (e.message || e)) + '';
    let loc = '';
    try {
        const st = String((e && e.stack) || '');
        const m = st.match(/index\.js\?(\d+):(\d+)/) || st.match(/index\.js:(\d+):(\d+)/);
        if (m) loc = ' @第' + m[1] + '行';
    } catch (e2) {}
    try { console.error('[命运织机]', e); } catch (e2) {}
    return msg + loc;
}
function toastDeduped(text) {
    const now = Date.now();
    const at = TOAST_RECENT.get(text) || 0;
    if (now - at < 20000) return false;
    TOAST_RECENT.set(text, now);
    if (TOAST_RECENT.size > 50) TOAST_RECENT.clear();
    return true;
}
function toastProgress(text, onView) {
    const el = toast(text, onView, 0);
    el.acSpin(true);
    return el;
}
// ── 结构化模板 → YAML ──────────────────────────
const Y = v => String(v == null ? "" : v);
const ind = (s, n) => String(s == null ? "" : s).split(String.fromCharCode(10)).map(x => " ".repeat(n) + x).join(String.fromCharCode(10));

function buildCharacterYaml(c) {
    const o = [];
    o.push("<character>");
    o.push("使用说明: 本文件为角色内化参考，供AI理解角色使用。所有设定应转化为行为、语言、思维方式与情绪节奏，不得在正文叙述或对话中直接点出、复述或暗示设定本身。");
    o.push("");
    o.push("character: " + Y(c.name));
    o.push("nickname: " + Y(c.nickname));
    o.push("");
    o.push("基调: \"" + Y(c.tone) + "\"");
    o.push("");
    o.push("核心身份:");
    o.push("  性别: " + Y(c.gender));
    o.push("  年龄: " + Y(c.age));
    o.push("  种族: " + Y(c.race));
    o.push("  职业: " + Y(c.job));
    o.push("  标签: " + Y(c.tags));
    o.push("");
    o.push("定位四件事:");
    o.push("  与{{user}}的关系: " + Y(c.rel_user));
    o.push("  知情程度: " + Y(c.informed));
    o.push("  出场时机: " + Y(c.timing));
    const rl = Array.isArray(c.rel_list) ? c.rel_list.filter(function (x) { return x && x.who; }) : [];
    if (rl.length) {
        o.push("  与其他角色的关系:");
        for (const r of rl) o.push("    - " + Y(r.who) + ": " + Y(r.how));
    } else {
        o.push("  与其他角色的关系: " + Y(c.rel_others));
    }
    o.push("");
    o.push("背景:");
    o.push("  出身: |");
    o.push(ind(c.bg_origin, 4));
    o.push("  居住: |");
    o.push(ind(c.bg_residence, 4));
    o.push("  关键经历:");
    for (let i = 1; i <= 3; i++) {
        const ti = Y(c["bg_exp" + i + "_title"]), tx = Y(c["bg_exp" + i + "_text"]);
        if (!ti && !tx) continue;
        o.push("    - " + (ti || "经历" + i) + ": |");
        o.push(ind(tx, 8));
    }
    o.push("");
    o.push("外貌:");
    o.push("  身形与体格: " + Y(c.ap_body));
    o.push("  发型与面部: " + Y(c.ap_face));
    o.push("  日常服饰: " + Y(c.ap_clothes));
    o.push("  标志物: " + Y(c.ap_mark));
    o.push("  习惯动作: " + Y(c.ap_habits));
    o.push("");
    o.push("语言风格:");
    o.push("  语速与音量: " + Y(c.sp_pace));
    o.push("  口癖: " + Y(c.sp_quirk));
    o.push("  如何称呼{{user}}: " + Y(c.sp_call));
    o.push("  对话示例:");
    for (let i = 1; i <= 3; i++) { const e = Y(c["sp_ex" + i]); if (e) o.push("    - \"" + e + "\""); }
    o.push("");
    o.push("性格:");
    o.push("  表面: " + Y(c.pe_surface));
    o.push("  内里: " + Y(c.pe_inner));
    o.push("  底线: " + Y(c.pe_bottom));
    o.push("");
    o.push("角色核心:");
    for (const x of (c.core || [])) {
        if (!x || (!x.tag && !x.desc)) continue;
        o.push("  " + (x.tag || "内核").replace(/\s+/g, "_") + ":");
        o.push("    " + Y(x.desc));
    }
    o.push("");
    o.push("角色痕迹:");
    for (const x of (c.traces || [])) { if (x) o.push("  - " + Y(x)); }
    o.push("</character>");
    return o.join(String.fromCharCode(10));
}
function buildGuideText(g) {
    const o = [];
    (g || []).forEach((x, i) => {
        if (!x || (!x.name && !x.trigger && !x.action)) return;
        o.push("行为路线" + (i + 1) + "_" + (x.name || "未命名") + ":");
        o.push("  触发条件: " + Y(x.trigger));
        o.push("  动作表现: " + Y(x.action));
        o.push("  重点细节: " + Y(x.detail));
        o.push("");
    });
    return o.join(String.fromCharCode(10)).trim();
}
// 出场时机写进行动路线用的紧凑段落（不是独立条目）
function buildAppearSection(a, name) {
    if (!a) return '';
    const hooks = (a.hooks || []).filter(function (h) { return h && (h.signal || h.how); });
    if (!hooks.length) return '';
    const NL = String.fromCharCode(10);
    const L = [];
    L.push('【' + name + ' 介入机会】(信号对上才让她进来，不要硬拉)');
    for (const h of hooks) {
        L.push('  ' + Y(h.signal) + ' → ' + Y(h.how));
        const extra = [];
        if (h.first) extra.push('第一反应: ' + Y(h.first));
        if (h.turn) extra.push('走向: ' + Y(h.turn));
        if (extra.length) L.push('    ' + extra.join('　'));
    }
    const pr = (a.presence || []).filter(Boolean);
    if (pr.length) L.push('  不在场: ' + pr.join('；'));
    if (a.never) L.push('  不会出现: ' + Y(a.never));
    return L.join(NL);
}
// 身体配置（1:1 复刻 body_configuration 格式）
function buildBodyYaml(b, name, gender) {
    if (!b) return '';
    const g = String(gender || '');
    const isMale = /男/.test(g) && !/双|扶她|雌雄/.test(g);
    const L = [];
    const put = function (indent, k, v) { if (v !== undefined && v !== null && String(v).trim()) L.push(indent + k + ': [' + String(v).trim() + ']'); };
    L.push('<body_configuration character="' + Y(name) + '">');
    L.push('整体身材:'); put('  - ', '类型', b.type);
    L.push(''); L.push('整体比例:'); put('  - ', '比例', b.ratio);
    L.push(''); L.push('胸部:');
    put('  - ', '尺寸', b.chest_size); put('  - ', '形状', b.chest_shape);
    if (!isMale) put('  - ', '乳头与乳晕', b.nipple);
    L.push(''); L.push('腰部:'); put('  - ', '特征', b.waist); put('  - ', '腰臀比', b.whr);
    L.push(''); L.push('臀部:'); put('  - ', '形状', b.hip_shape); put('  - ', '质感', b.hip_texture);
    L.push(''); L.push('私处:');
    if (isMale) {
        L.push('  - 肉棒:');
        put('    - ', '毛发', b.pube); put('    - ', '尺寸', b.penis_size); put('    - ', '形态', b.penis_shape);
        put('    - ', '颜色', b.penis_color); put('    - ', '包皮', b.penis_foreskin);
        put('    - ', '敏感度', b.penis_sensitivity); put('    - ', '名器说法', b.vulva_name); put('    - ', '特征', b.penis_feature);
        L.push('  - 睾丸与阴囊:');
        put('    - ', '大小', b.testicle_size); put('    - ', '形态', b.testicle_shape);
        put('    - ', '颜色', b.testicle_color); put('    - ', '敏感度', b.testicle_sensitivity);
    } else {
        L.push('  - 小穴:');
        put('    - ', '毛发', b.pube); put('    - ', '形态', b.vulva_shape); put('    - ', '颜色', b.vulva_color);
        put('    - ', '敏感度', b.vulva_sensitivity); put('    - ', '名器说法', b.vulva_name); put('    - ', '特征', b.vulva_feature);
    }
    L.push('  - 菊穴:');
    put('    - ', '形态', b.anus_shape); put('    - ', '颜色', b.anus_color); put('    - ', '名器说法', b.anus_name); put('    - ', '特征', b.anus_feature);
    L.push(''); L.push('腿部:'); put('  - ', '形态', b.legs);
    L.push(''); L.push('肌肉线条:'); put('  - ', '清晰度', b.muscle_clarity); put('  - ', '分布', b.muscle_spread);
    L.push(''); L.push('其他体态特征:');
    put('  - ', '皮肤颜色', b.skin_color); put('  - ', '皮肤质感', b.skin_texture);
    put('  - ', '皮肤特征', b.skin_feature); put('  - ', '体态', b.posture);
    if (b.demi_name && String(b.demi_name).trim() && String(b.demi_name).trim() !== '无') {
        L.push(''); L.push((String(b.demi_name).indexOf('形态') >= 0 ? String(b.demi_name) : '半妖形态') + ':');
        put('  - ', '姿态名称', b.demi_name);
        put('  - ', '具体显化', b.demi_manifest);
        put('  - ', '整体气场', b.demi_aura);
    }
    L.push('</body_configuration>');
    return L.join(String.fromCharCode(10));
}

// 性癖档案（1:1 复刻 sexual_profile 格式）
function buildSexYaml(s, name) {
    if (!s) return '';
    const Q = function (v) { return '"[' + String(v == null ? '' : v).trim() + ']"'; };
    const L = [];
    L.push('<sexual_profile character="' + Y(name) + '">');
    L.push('性标签(总结性): ' + Q(s.tag));
    L.push('');
    L.push('A. 敏感带:');
    L.push('  敏感度评级: "[极高 > 高 > 中 > 低]"');
    const sens = s.sensitive || [];
    for (const hit of sens) {
        if (!hit) continue;
        const pt = String(hit.part || '').trim();
        if (!pt) continue;
        const lv = String(hit.level || '').trim();
        const ds = String(hit.desc || '').trim();
        L.push('  - ' + pt + ': "[' + (lv ? lv + ' - ' : '') + ds + ']"');
    }
    L.push('');
    L.push('B. 性弱点:');
    L.push('  主要生理弱点: ' + Q(s.weak_main));
    L.push('  - 刺激方式: ' + Q(s.weak_main_how));
    L.push('');
    L.push('  次要生理弱点: ' + Q(s.weak_sub));
    L.push('  - 刺激方式: ' + Q(s.weak_sub_how));
    L.push('');
    L.push('  精神/言语弱点: ' + Q(s.weak_mind));
    L.push('  - 触发词句/情景: ' + Q(s.weak_mind_trigger));
    L.push('  - 触发反应: ' + Q(s.weak_mind_reaction));
    L.push('');
    L.push('C. 性格与偏好 :');
    L.push('  NSFW场景表现: ' + Q(s.nsfw_behavior));
    L.push('  - 主动/被动倾向: ' + Q(s.active_passive));
    L.push('  - 表达方式: ' + Q(s.express));
    L.push('');
    L.push('  喜好的性风格:');
    L.push('  - 节奏: ' + Q(s.rhythm));
    L.push('  - 氛围: ' + Q(s.atmosphere));
    L.push('');
    L.push('  喜好的性姿势:');
    for (const p of (s.positions || [])) { if (p && p.name) L.push('  - "' + Y(p.name) + ': [' + Y(p.why) + ']"'); }
    L.push('');
    L.push('D. 特殊癖好:');
    L.push('  接受度评级: "[仅幻想 < 愿意尝试 < 喜爱 < 痴迷]"');
    for (const k of (s.kinks || [])) { if (k && k.name) L.push('  - "' + Y(k.name) + ': [' + Y(k.level) + ']"'); }
    L.push('');
    L.push('E. 特殊性技巧（1-2 个）:');
    for (const k of (s.skills || [])) {
        if (!k || !k.name) continue;
        L.push('  - 技巧名称: "' + Y(k.name) + '"');
        L.push('    技巧效果: ' + Q(k.effect));
    }
    L.push('</sexual_profile>');
    return L.join(String.fromCharCode(10));
}
function planToEntries(plan) {
    const c = plan.character || {};
    const nm = String(c.name || plan.targetName || "未命名").trim();
    let keys = (plan.keys || []).map(k => String(k).trim()).filter(Boolean);
    if (!keys.length) {
        keys = [nm];
        for (const x of String(c.nickname || "").split(/[,，、\s]+/)) if (x && x !== nm) keys.push(x);
    }
    // 强制：角色名本身必须在关键词里，否则导演注入名字时扫不到任何条目
    if (!keys.includes(nm)) keys.unshift(nm);
    // 昵称也尽量带上（模型给的第一个昵称）
    for (const x of String(c.nickname || '').split(/[,，、\s]+/)) {
        const nn5 = String(x).trim();
        if (nn5 && nn5 !== nm && !keys.includes(nn5) && keys.length < 8) keys.push(nn5);
    }
    keys = [...new Set(keys)].slice(0, 8);
    // 身体配置 + 性癖档案合并成一条，减少条目数、避免两条重复提到身体部位
    const bodyText = (plan.bodyText && plan.bodyText.trim()) ? plan.bodyText : buildBodyYaml(plan.body || {}, nm, (plan.character || {}).gender);
    const sexText = (plan.sexText && plan.sexText.trim()) ? plan.sexText : buildSexYaml(plan.sex || {}, nm);
    const out = [
        { comment: "角色卡 " + nm, content: buildCharacterYaml(c), keys, constant: false },
        { comment: "身体与性癖 " + nm, content: [String(bodyText || '').trim(), String(sexText || '').trim()].filter(Boolean).join('\n\n'), keys, constant: false },
        { comment: nm + "_行为落地指南", content: buildGuideText(plan.guide), keys, constant: false },
    ];
    return out;
}

// ── 结构化编辑器 ─────────────────────────────────
function fRow(label, path, val, type) {
    const v = esc(val || '');
    if (type === 'ta') {
        return '<div class="ac-f"><label>' + label + '</label>' +
            '<textarea data-f="' + path + '" style="min-height:70px;">' + v + '</textarea></div>';
    }
    return '<div class="ac-f"><label>' + label + '</label>' +
        '<input type="text" data-f="' + path + '" value="' + v + '" /></div>';
}

function fGroup(title, inner) {
    return '<div class="ac-sub"><div class="ac-sub-h">' + title + '</div>' + inner + '</div>';
}

const charCount = s => String(s || "").replace(/\s/g, "").length;

// 检查三条字数，返回提示文本
function checkLengths(plan) {
    const ents = planToEntries(plan);
    const out = [];
    for (const e of ents) {
        const n = charCount(e.content);
        const c = String(e.comment || '');
        let lo = 0, hi = 99999;
        if (/^角色卡/.test(c)) { [lo, hi] = LEN.char; }
        else if (/^身体与性癖/.test(c)) { lo = LEN.body[0] + LEN.sex[0]; hi = LEN.body[1] + LEN.sex[1]; }
        else if (/行为落地指南/.test(c)) { [lo, hi] = LEN.guide; }
        else if (/^出场时机/.test(c)) { [lo, hi] = LEN.appear; }
        const bad = n < lo || n > hi;
        out.push({ name: e.comment, n, lo, hi, bad, no: n < lo });
    }
    return out;
}
function renderResult() {
    const box = $('ac-result');
    if (!box) return;
    if (!state.plan) { box.innerHTML = ''; return; }
    const p = state.plan;
    const c = p.character || {};
    const n = p.nsfw || {};
    const g = p.guide || [];
    const pos = p.position || {};

    const coreText = (c.core || []).map(x => (x.tag || '') + ': ' + (x.desc || '')).join('\n');
    const traceText = (c.traces || []).join('\n');

    let html = '';
    const lens = checkLengths(p);
    html += '<div class="ac-card"><div class="h">字数检查</div>' +
        lens.map(x =>
            '<div class="ac-len' + (x.bad ? ' bad' : '') + '">' +
            '<span class="nm">' + esc(x.name) + '</span>' +
            '<span class="v">' + x.n + ' 字</span>' +
            '<span class="t">目标 ' + x.lo + '~' + x.hi + '</span>' +
            '<span class="s">' + (x.bad ? (x.no ? '偏少' : '偏多') : '✓') + '</span>' +
            '</div>').join('') +
        '</div>';    html += '<div class="ac-card"><div class="h">3. 定位</div><div class="ac-pos">' +
        '<b>种族</b>　' + esc(pos.race || c.race || '-') + '<br>' +
        '<b>关系</b>　' + esc(pos.relation || c.rel_user || '-') + '<br>' +
        '<b>知情</b>　' + esc(pos.informed || c.informed || '-') + '<br>' +
        '<b>出场</b>　' + esc(pos.timing || c.timing || '-') + '<br>' +
        '<b>基调</b>　' + esc(pos.tone || c.tone || '-') +
        '</div></div>';

    html += '<div class="ac-card"><div class="h">4. 角色卡 <span class="i">每个字段都能改</span></div>';
    html += fGroup('身份',
        fRow('姓名', 'character.name', c.name) +
        fRow('昵称', 'character.nickname', c.nickname) +
        fRow('基调', 'character.tone', c.tone) +
        '<div class="ac-row2">' +
        fRow('性别', 'character.gender', c.gender) +
        fRow('年龄', 'character.age', c.age) + '</div>' +
        '<div class="ac-row2">' +
        fRow('种族', 'character.race', c.race) +
        fRow('职业', 'character.job', c.job) + '</div>' +
        fRow('标签', 'character.tags', c.tags));
    html += fGroup('定位四件事',
        fRow('与{{user}}的关系', 'character.rel_user', c.rel_user, 'ta') +
        fRow('知情程度', 'character.informed', c.informed, 'ta') +
        fRow('出场时机', 'character.timing', c.timing, 'ta') +
        fRow('与其他角色的关系（一行一个：名字: 关系）', 'character.rel_others', (Array.isArray(c.rel_list) && c.rel_list.length ? c.rel_list.map(function (x) { return x.who + ': ' + x.how; }).join('\n') : c.rel_others), 'ta'));
    html += fGroup('背景',
        fRow('出身', 'character.bg_origin', c.bg_origin, 'ta') +
        fRow('居住', 'character.bg_residence', c.bg_residence, 'ta') +
        fRow('经历1 标题', 'character.bg_exp1_title', c.bg_exp1_title) +
        fRow('经历1 内容', 'character.bg_exp1_text', c.bg_exp1_text, 'ta') +
        fRow('经历2 标题', 'character.bg_exp2_title', c.bg_exp2_title) +
        fRow('经历2 内容', 'character.bg_exp2_text', c.bg_exp2_text, 'ta') +
        fRow('经历3 标题', 'character.bg_exp3_title', c.bg_exp3_title) +
        fRow('经历3 内容', 'character.bg_exp3_text', c.bg_exp3_text, 'ta'));
    html += fGroup('外貌',
        fRow('身形与体格', 'character.ap_body', c.ap_body, 'ta') +
        fRow('发型与面部', 'character.ap_face', c.ap_face, 'ta') +
        fRow('日常服饰', 'character.ap_clothes', c.ap_clothes, 'ta') +
        fRow('标志物', 'character.ap_mark', c.ap_mark) +
        fRow('习惯动作', 'character.ap_habits', c.ap_habits, 'ta'));
    html += fGroup('语言风格',
        fRow('语速与音量', 'character.sp_pace', c.sp_pace) +
        fRow('口癖', 'character.sp_quirk', c.sp_quirk) +
        fRow('如何称呼{{user}}', 'character.sp_call', c.sp_call) +
        fRow('台词示例1', 'character.sp_ex1', c.sp_ex1) +
        fRow('台词示例2', 'character.sp_ex2', c.sp_ex2) +
        fRow('台词示例3', 'character.sp_ex3', c.sp_ex3));
    html += fGroup('性格',
        fRow('表面', 'character.pe_surface', c.pe_surface, 'ta') +
        fRow('内里', 'character.pe_inner', c.pe_inner, 'ta') +
        fRow('底线', 'character.pe_bottom', c.pe_bottom, 'ta'));
    html += fGroup('角色核心（一行一个，格式：标签: 说明）',
        fRow('', 'character.core', coreText, 'ta'));
    html += fGroup('角色痕迹（一行一条）',
        fRow('', 'character.traces', traceText, 'ta'));
    html += '</div>';

    html += '<div class="ac-card"><div class="h">5. 身体配置 <span class="i">body_configuration</span></div>' +
        fRow('（整段可编辑，格式固定）', 'bodyText', buildBodyYaml(p.body || {}, c.name || ''), 'ta') +
        '</div>';

    html += '<div class="ac-card"><div class="h">6. 性癖档案 <span class="i">sexual_profile</span></div>' +
        fRow('（整段可编辑，格式固定）', 'sexText', buildSexYaml(p.sex || {}, c.name || ''), 'ta') +
        '</div>';

    html += '<div class="ac-card"><div class="h">7. 行为落地指南 <span class="i"><button class="ac-btn" id="ac-addroute">+ 加一条</button></span></div>';
    g.forEach((x, i) => {
        html += '<div class="ac-sub"><div class="ac-sub-h">行为路线' + (i + 1) +
            ' <span class="i" style="cursor:pointer" data-del="' + i + '">删除</span></div>' +
            fRow('短名', 'guide.' + i + '.name', x.name) +
            fRow('触发条件', 'guide.' + i + '.trigger', x.trigger, 'ta') +
            fRow('动作表现', 'guide.' + i + '.action', x.action, 'ta') +
            fRow('重点细节', 'guide.' + i + '.detail', x.detail, 'ta') + '</div>';
    });
    html += '</div>';

    const ap = p.appear || {};
    const slotLines = (ap.slots || []).map(function (s) {
        return [s.time || '', s.place || '', s.behavior || '', s.risk || '', s.variant || ''].join(' | ');
    }).join('\n');
    html += '<div class="ac-card ac-blue"><div class="h"><span class="bdot"></span>8. 出场时机' +
        '<span class="i">会写进行动路线</span></div>' +
        '<div class="hint" style="margin-bottom:10px">不单独成条。写入时会追加到常驻的「行动路线」里，作为她的一段介入机会。</div>' +
        fRow('时段（一行一个，格式：时间_地点 | 行为 | 危机 | 变数）', 'appearSlots', slotLines, 'ta') +
        fRow('插入方式（一行一条）', 'appear.inserts', (ap.inserts || []).join('\n'), 'ta') +
        fRow('在场规则（一行一条）', 'appear.rules', (ap.rules || []).join('\n'), 'ta') +
        fRow('不会出现的情况', 'appear.never', ap.never, 'ta') +
        '</div>';
    html += '<div class="ac-card"><div class="h">9. 关键词</div>' +
        fRow('关键词（逗号分隔，一项一个词，不能含空格）', 'keysText', (p.keys || []).join(', ')) + '</div>';

    if ((p.warnings || []).length) {
        html += '<div class="ac-card"><div class="h">警告</div>' +
            p.warnings.map(x => '<div class="ac-warn">⚠ ' + esc(x) + '</div>').join('') + '</div>';
    }

    html += '<button class="ac-btn pri big" id="ac-write"><i class="fa-solid fa-floppy-disk"></i> 写入世界书</button>' +
        '<div class="ac-msg" id="ac-msg2"></div>';

    box.innerHTML = html;

    box.querySelectorAll('[data-del]').forEach(el2 => el2.addEventListener('click', () => {
        collectPlan();
        state.plan.guide.splice(Number(el2.dataset.del), 1);
        renderResult();
    }));
    $('ac-addroute')?.addEventListener('click', () => {
        collectPlan();
        state.plan.guide = state.plan.guide || [];
        state.plan.guide.push({ name: '', trigger: '', action: '', detail: '' });
        renderResult();
    });
    $('ac-write').addEventListener('click', doWrite);
}

// 把表单里的值读回 state.plan
function collectPlan() {
    const p = state.plan;
    if (!p) return;
    p.character = p.character || {};
    p.nsfw = p.nsfw || {};
    p.guide = p.guide || [];

    document.querySelectorAll('[data-f]').forEach(el2 => {
        const path = el2.dataset.f;
        const v = el2.value;
        if (path === 'keysText') { p.keys = v.split(/[,，、]/).map(x => x.trim()).filter(Boolean); return; }
        if (path === 'bodyText') { p.bodyText = v; return; }
        if (path === 'sexText') { p.sexText = v; return; }
        if (path === 'appearKeysText') { p.appearKeys = v.split(/[,，、\s]+/).map(x => x.trim()).filter(Boolean); return; }
        if (path === 'character.rel_others') {
            p.character = p.character || {};
            p.character.rel_others = v;
            p.character.rel_list = String(v || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
                const a = l.split(/[:：]/);
                return { who: (a[0] || '').trim(), how: a.slice(1).join('：').trim() };
            }).filter(function (x) { return x.who; });
            return;
        }
        if (path === 'appearSlots') {
            p.appear = p.appear || {};
            p.appear.slots = v.split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
                const a = l.split('|').map(function (x) { return x.trim(); });
                const tp = (a[0] || '').split('_');
                return { time: (tp[0] || '').trim(), place: (tp[1] || '').trim(), behavior: a[1] || '', risk: a[2] || '', variant: a[3] || '' };
            });
            return;
        }
        if (path === 'appear.inserts') { p.appear = p.appear || {}; p.appear.inserts = v.split('\n').map(x => x.trim()).filter(Boolean); return; }
        if (path === 'appear.rules') { p.appear = p.appear || {}; p.appear.rules = v.split('\n').map(x => x.trim()).filter(Boolean); return; }
        if (path === 'character.core') {
            p.character.core = v.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
                const i = l.indexOf(':');
                if (i < 0) return { tag: '', desc: l };
                return { tag: l.slice(0, i).trim(), desc: l.slice(i + 1).trim() };
            });
            return;
        }
        if (path === 'character.traces') { p.character.traces = v.split('\n').map(x => x.trim()).filter(Boolean); return; }
        if (path === 'nsfw.traits') { p.nsfw.traits = v.split('\n').map(x => x.trim()).filter(Boolean); return; }
        if (path === 'nsfw.willSay') { p.nsfw.willSay = v.split('\n').map(x => x.trim()).filter(Boolean); return; }

        const parts = path.split('.');
        let obj = p;
        for (let i = 0; i < parts.length - 1; i++) {
            const k = parts[i];
            if (/^\d+$/.test(k)) obj = obj[Number(k)];
            else { obj[k] = obj[k] || {}; obj = obj[k]; }
        }
        const last = parts[parts.length - 1];
        if (/^\d+$/.test(parts[parts.length - 1]) === false) obj[last] = v;
    });
}

function setMsg(text, kind, which) {
    const m = $(which || 'ac-msg') || $('ac-msg');
    if (!m) return;
    m.textContent = text || '';
    m.className = 'ac-msg' + (kind ? ' ' + kind : '');
}

// ── 分析 ─────────────────────────────────────────
async function doAnalyze() {
    resetLLMCancel();
    const s = settings();
    const book = $('ac-book') ? $('ac-book').value : s.targetBook;
    const name = $('ac-name') ? $('ac-name').value.trim() : '';
    const idea = $('ac-idea') ? $('ac-idea').value.trim() : '';
    if (!book) return setMsg('没有可选的世界书');
    if (s.source === 'chat' && !name) return setMsg('请填人物名');

    // 只有「真的有独立角色条目」才拦（去更新角色改）；
    // 只是数据库/关系表里提到过同名的，允许正常生成新条目
    let softHit = false;
    try {
        if (name) {
            if (await hasOwnCharacterEntry(book, name)) {
                return setMsg('「' + name + '」这本书里已经有正式角色条目了（「更新角色」页能查到）。要改她就去「更新角色」，别在这重写一份。', 'err');
            }
            if (await bookHasPerson(book, name)) {
                softHit = true;
                console.log('[命运织机] 「' + name + '」只有数据库/关系表记录，没有角色条目 —— 允许新建');
            }
        }
    } catch (e2) {}
    setMsg('分析中…内容会在右下角实时显示（流式），模型写完再自动检查');
    if ($('ac-analyze')) $('ac-analyze').disabled = true;
    state.plan = null;
    renderResult();
    const hooks = makeStreamHooks('正在生成模板：' + (name || '当前角色卡'));

    try {
        const plan = await generatePlan({ book, name, aliases: state.curAlias, idea, source: s.source }, hooks);
        state.plan = plan;
        renderResult();
        setMsg('分析完成，检查后点下面的「写入世界书」' + (softHit ? '（注意：书里只有数据库/关系表记录同名，这次会新建角色条目）' : ''), 'ok');
    } catch (e) {
        if (_llmCancelled) setMsg('已取消生成', 'err');
        else setMsg('失败：' + errBrief(e) + '（版本 ' + VERSION + '，请确认已更新到最新）', 'err');
    } finally {
        hooks.done();
        if ($('ac-analyze')) $('ac-analyze').disabled = false;
    }
}

// 生成一份模板（分析 / 自动检测都用它）；streamHooks 传入时边生成边实时显示
async function generatePlan(opt, streamHooks) {
    const book = opt.book;
    const bookData = await getBook(book);
    const entries = bookData.entries || {};
    let sourceBlock = '', targetName = opt.name || '';
    const existingEntries = opt.existing || [];

    if (opt.source === 'char') {
        const g = gatherFromChar();
        if (!g) throw new Error('当前没有选中角色卡');
        targetName = g.name;
        sourceBlock = '【原卡内容】\n' + g.block;
    } else if (opt.source === "entries") {
        // 用她现有的条目当素材（手写条目也能升级成织机格式）
        const ex0 = existingEntries.map(function (e) { return String(e.content || ""); }).join(NL2).trim();
        if (!ex0) throw new Error("这些条目没有内容，没法当素材");
        let chatExtra = "";
        try {
            const hits0 = gatherFromChat(targetName, opt.aliases);
            if (hits0.length) chatExtra = NL2 + NL2 + "【近期正文补充】" + NL2 + hits0.map(function (h) { return (h.isUser ? "【玩家】" : "【正文】") + h.text; }).join(NL2);
        } catch (e) { /* 聊天里没有就算了 */ }
        sourceBlock = "【她现在的条目内容，共 " + existingEntries.length + " 条】" + NL2 + ex0.slice(0, 8000) + chatExtra;
    } else {
        const hits = gatherFromChat(targetName, opt.aliases);
        if (!hits.length) throw new Error('当前聊天里找不到「' + targetName + '」');
        const ex = hits.map(h => (h.isUser ? '【玩家】' : '【正文】') + h.text).join(NL2);
        sourceBlock = ['【素材】命中 ' + hits.length + ' 条，合计 ' + ex.length + ' 字',
            '【这个人物在正文里的全部描写（唯一事实来源）】', ex.slice(0, 12000), '',
            opt.idea ? ('【用户的想法（按要求补全，但不能和正文矛盾）】\n' + opt.idea) : '【用户没有额外想法，只依据正文】'].join('\n');
    }

    const xps = (opt.xps && opt.xps.length) ? opt.xps : pickXp();
    // 给模型一份「干净的名字清单」——条目名里带 角色卡/（母亲） 这些，直接给它会照抄
    const KNOWN_NOISE = /世界观|背景|体态|体型|文风|判断|设定|规则|说明|系统|地图|地理|时间|关系|概要|简介|总结|提示|格式|顺序|概率|语料|其他|备注|序章|结局|尺寸|参数|选项|状态|数值|衣着|穿着|样例|示例|模板|参考|速览|指南|路线/i;
    const knownNames = (function () {
        const out = new Set();
        for (const e of Object.values(entries)) {
            let c = String(e.comment || "").trim();
            if (!c || /^(TavernDB|ACU-)/i.test(c)) continue;
            c = c.replace(/^(?:角色卡|NSFW档案|身体配置|性癖档案)\s*/, "").replace(/_(?:行为落地指南|出场时机)$/, "");
            const mk = c.match(/^([\u4e00-\u9fa5A-Za-z]{2,4})\s*[（(]/);
            const nm = (mk ? mk[1] : c.split(/[_\-—·]/)[0]).trim();
            if (!nm || nm.length < 2 || nm.length > 6) continue;
            if (KNOWN_NOISE.test(nm)) continue;
            out.add(nm);
        }
        return [...out];
    })();
    const existing = Object.values(entries).map(e => String(e.comment || '')).join('、');
    const coreInfo = CORE_NAMES.map(nm => {
        const e = Object.values(entries).find(x => String(x.comment) === nm);
        return e ? ('### ' + nm + '\n' + String(e.content).slice(0, 800)) : ('### ' + nm + '\n(不存在)');
    }).join(NL2);

    const prompt = [
        activeSystem(), '', '===== 输入 =====', sourceBlock, '',
        '【目标世界书已有条目名（避免重名）】' + existing.slice(0, 1200), '',
        '【可以在关系里引用的角色名（rel_list 的 who 必须从这里选，不能编）】' + (knownNames.length ? knownNames.join('、') : '（这本书里还没有别的角色）'), '',
        '【六条核心条目当前内容】', coreInfo, '',
        xpRule(xps),
        genderRule(),
        '【字数要求】最终写入世界书只有 3 条核心条目，都要写足（按中文字符计）：',
        '① 角色卡 ' + LEN.char[0] + '~' + LEN.char[1] + ' 字；',
        '② 身体与性癖（= JSON 的 body + sex 合计）' + (LEN.body[0] + LEN.sex[0]) + '~' + (LEN.body[1] + LEN.sex[1]) + ' 字；',
        '③ 行为落地指南 ' + LEN.guide[0] + '~' + LEN.guide[1] + ' 字。',
        '低于下限说明内容太薄，要补细节；超过上限要压缩。宁可具体，不要空话。',
        '低于下限说明内容太薄，要补细节；超过上限要压缩。宁可具体，不要空话。',
        existingEntries.length ? ('【该角色在世界书里的现有设定（请在此基础上更新，不要推翻和正文一致的部分）】\n' +
            existingEntries.map(function (e) { return '### ' + e.comment + '\n' + String(e.content || '').slice(0, 3000); }).join('\n\n')) : '',
        existingEntries.length ? '请在现有设定上更新，保留仍然成立的内容，补充新出现的细节，输出完整的新版本。' : '',
        '请把「' + targetName + '」做成本世界里一个正式角色，严格按 JSON 模板输出。',
    ].join('\n');

    let plan = null, lastErr = '模型没有返回可解析的 JSON';
    for (let i = 0; i < 3 && !plan; i++) {
        if (_llmCancelled) break;
        let raw = '';
        try {
            if (streamHooks && streamHooks.onAttempt) { try { streamHooks.onAttempt(i); } catch (e) { /* ignore */ } }
            const genTimeout = Math.max(Number(settings().llmTimeout) || 120, 480);
            const genMaxTok = Math.max(Number(settings().maxTokens) || 6000, 16000);
            raw = await callLLM(prompt, streamHooks
                ? { onDelta: streamHooks.onDelta, onReasoning: streamHooks.onReasoning, maxTokens: genMaxTok, timeout: genTimeout }
                : { maxTokens: genMaxTok, timeout: genTimeout });
        } catch (e) {
            lastErr = e.message || String(e);
            if (_llmCancelled) break;
            break;
        }
        const p = parseLoose(raw);
        if (p && (p.character || p.entries)) plan = p;
    }
    if (_llmCancelled) throw new Error('已取消');
    if (!plan) throw new Error(lastErr);

    // 校验：关系必须指向真实存在的角色，否则导演没法用她这条线
    const relOk = function (p) {
        const rl = (p && p.character && Array.isArray(p.character.rel_list)) ? p.character.rel_list : [];
        if (!knownNames.length) return true;                       // 书里没别人，放过
        return rl.some(function (x) {
            const who = String((x && x.who) || "").trim();
            if (!who) return false;
            return knownNames.some(function (n) { return who === n || who.indexOf(n) >= 0 || n.indexOf(who) >= 0; });
        });
    };
    if (plan && knownNames.length && !relOk(plan)) {
        console.log("[命运织机] 关系指向不存在的人，重试一次");
        try {
            const strictPrompt = prompt + NL2 + NL2 +
                "【上次输出不合格】rel_list 里没有一个是这本书里真实存在的角色。" + NL2 +
                "只能从这些名字里选：" + knownNames.join("、") + NL2 +
                "至少写一个人，who 必须和上面的名字完全一致。重新输出完整 JSON。";
            const raw2 = await callLLM(strictPrompt);
            const p2 = parseLoose(raw2);
            if (p2 && (p2.character || p2.entries) && relOk(p2)) plan = p2;
        } catch (e) { console.warn("[命运织机] 关系重试失败", e); }
    }

    plan.character = plan.character || {};
    plan.nsfw = plan.nsfw || {};
    plan.guide = plan.guide || [];
    if (!plan.character.name) plan.character.name = targetName;
    if (!Array.isArray(plan.keys) || !plan.keys.length) plan.keys = [targetName];
    plan.targetName = targetName;
    plan.xp = xps;
    if (xps.length) { settings().xpLast = xps.slice(); persist(); }
    return plan;
}

// 把一份 plan 写进世界书（自动写入也走这里）
// 出场调度表：所有角色共用一条，常驻，成本极低

// ── 操作日志（替代整本快照，体积小几十倍，且能精确撤销） ──
function oplogOf(book) {
    const s = settings();
    s.oplog = s.oplog || {};
    return s.oplog[book] || (s.oplog[book] = []);
}

function pushOplog(book, log) {
    const list = oplogOf(book);
    try {
        log = log || {};
        if (!log.t) log.t = Date.now();
        if (!log.sid) log.sid = (state.sessionId || (state.sessionId = Date.now()));
    } catch (e0) { /* ignore */ }
    list.unshift(log);
    const s = settings();
    s.oplog[book] = list.slice(0, 12);
    persist();
}

// 撤销一次操作：删掉新增的、还原改过的
async function rollbackOp(book, index) {
    const s = settings();
    const list = oplogOf(book);
    const log = list[index];
    if (!log) throw new Error('找不到这条记录');

    const data = await getBook(book);
    const ent = data.entries || (data.entries = {});
    let removed = 0, restored = 0;

    for (const a of (log.added || [])) {
        if (ent[a.uid]) { delete ent[a.uid]; removed++; }
    }
    for (const u of (log.updated || [])) {
        const e = ent[u.uid];
        if (!e) continue;
        if (u.content !== undefined) e.content = u.content;
        if (u.key !== undefined) e.key = u.key;
        restored++;
    }
    if (log.dispatch) {
        if (log.dispatch.created) { if (ent[log.dispatch.uid]) { delete ent[log.dispatch.uid]; removed++; } }
        else if (log.dispatch.uid && ent[log.dispatch.uid]) { ent[log.dispatch.uid].content = log.dispatch.old || ''; restored++; }
    }

    await putBook(book, data);
    settings().oplog[book].splice(index, 1);
    persist();
    return { removed, restored };
}
// ── 内容指纹（检测条目有没有被手改过） ─────────────
function hashStr(s) {
    const str = String(s || '');
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return String(h) + ':' + str.length;
}

function savedHash(book, comment) {
    const s = settings();
    s.entryHash = s.entryHash || {};
    const m = s.entryHash[book] || {};
    return m[comment] || null;
}

function rememberHash(book, comment, content) {
    const s = settings();
    s.entryHash = s.entryHash || {};
    s.entryHash[book] = s.entryHash[book] || {};
    s.entryHash[book][comment] = hashStr(content);
}

// 这条是否被手改过：有记录且当前内容和记录不一致
function isHandEdited(book, comment, currentContent) {
    const prev = savedHash(book, comment);
    if (!prev) return false;           // 没记录过，不算
    return prev !== hashStr(currentContent);
}
async function writePlan(book, plan) {
    const ents = (plan._only && plan._only.length) ? plan._only : planToEntries(plan);
    const keep = ents.filter(e => e.content && e.content.trim());
    if (!keep.length) throw new Error('条目是空的，没东西可写');
    for (const e of keep) {
        for (const k of (e.keys || [])) {
            if (/\s/.test(k)) throw new Error('关键词含空格：' + k);
        }
    }

    const s = settings();
    const data = await getBook(book);
    const ent = data.entries || (data.entries = {});

    const nm = String((plan.character || {}).name || '').trim();
    const log = { t: Date.now(), book: book, name: String((plan.character || {}).name || ''), added: [], updated: [], dispatch: null };

    // uid 可能是超过 2^53 的大整数，必须用 BigInt，否则 ++ 无效会导致反复覆盖同一条
    let maxUidBig = 0n, maxIdx = -1;
    for (const [k, v] of Object.entries(ent)) {
        let b = 0n;
        try { b = BigInt(String(v.uid ?? k)); } catch (e) { b = 0n; }
        if (b > maxUidBig) maxUidBig = b;
        if (typeof v.displayIndex === 'number' && v.displayIndex > maxIdx) maxIdx = v.displayIndex;
    }
    const nextUid = function () { maxUidBig = maxUidBig + 1n; return maxUidBig.toString(); };

    let added = 0, updated = 0;
    const edited = [];
    for (const e of keep) {
        const comment = clean(e.comment);
        const keys = (e.keys || []).map(clean).filter(Boolean);
        const hit = Object.entries(ent).find(([, v]) => String(v.comment) === comment);
        if (hit) {
            // 旧的 keys 里如果有角色名而新生成的没有，补回去（不让条目失去名字触发）
            if (nm && !keys.includes(nm) && (hit[1].key || []).some(function (p5) { return String(p5).indexOf(nm) >= 0; })) keys.unshift(nm);
            if (isHandEdited(book, comment, String(hit[1].content || ''))) edited.push(comment);
            log.updated.push({ uid: Object.keys(ent).find(function (k) { return ent[k] === hit[1]; }) || '', content: hit[1].content, key: hit[1].key });
            hit[1].content = clean(e.content); hit[1].key = keys; hit[1].constant = false; updated++;
        }
        else {
            const newUid = nextUid(); maxIdx++;
            ent[newUid] = {
                key: keys, keysecondary: [], comment, content: clean(e.content),
                constant: false, vectorized: false, selective: true, selectiveLogic: 0,
                addMemo: false, order: 100, position: 0, disable: false,
                excludeRecursion: false, preventRecursion: false,
                matchPersonaDescription: false, matchCharacterDescription: false,
                matchCharacterPersonality: false, matchCharacterDepthPrompt: false,
                matchScenario: false, matchCreatorNotes: false,
                delayUntilRecursion: false, probability: 100, useProbability: true,
                depth: 4, group: '', groupOverride: false, groupWeight: 100,
                scanDepth: null, caseSensitive: null, matchWholeWords: null,
                useGroupScoring: null, automationId: '', role: 0,
                sticky: 0, cooldown: 0, delay: 0, uid: newUid, displayIndex: maxIdx,
            };
            log.added.push({ uid: newUid, comment: comment });
            added++;
        }
    }

    // 合并条目写入时，清理同角色旧的「身体配置 X / 性癖档案 X」（避免重复）
    let mergedAway = 0;
    const mergedName = nm ? ('身体与性癖 ' + nm) : '';
    if (mergedName && keep.some(function (e) { return String(e.comment || '').trim() === mergedName; })) {
        for (const [k, v] of Object.entries(ent)) {
            const c2 = String(v.comment || '').trim();
            if (c2 === '身体配置 ' + nm || c2 === '性癖档案 ' + nm) { delete ent[k]; mergedAway++; }
        }
        if (mergedAway) console.log('[命运织机] 已合并清理旧条目 ' + mergedAway + ' 条');
    }

    let coreChanged = 0; const missing = [];
    for (const cu of (plan.coreUpdates || [])) {
        const tgt = Object.values(ent).find(x => String(x.comment) === String(cu.entry));
        if (!tgt) { missing.push(cu.entry); continue; }
        const add = clean(cu.change);
        if (!add || String(tgt.content || '').includes(add.slice(0, 20))) continue;
        tgt.content = String(tgt.content || '').replace(/\s*$/, '') + '\n' + add;
        coreChanged++;
    }

    // 出场时机：写进常驻的行动路线，不单独成条
    const apSec = buildAppearSection(plan.appear, nm);
    const tlName = clean(settings().timelineEntry || '行动路线');
    let appearChanged = false;
    if (apSec) {
        const tlEnt = Object.values(ent).find(function (x) { return String(x.comment) === tlName; });
        if (tlEnt) {
            const marker = '【' + nm + ' 介入机会】';
            let body = String(tlEnt.content || '');
            const at = body.indexOf(marker);
            if (at >= 0) {
                const nxt = body.indexOf(String.fromCharCode(10) + '【', at + marker.length);
                const endPos = nxt >= 0 ? nxt : body.length;
                body = body.slice(0, at) + apSec + body.slice(endPos);
            } else {
                body = body.replace(/\s*$/, '') + String.fromCharCode(10, 10) + apSec + String.fromCharCode(10);
            }
            tlEnt.content = body;
            appearChanged = true;
        } else {
            missing.push(tlName);
        }
    }

    await putBook(book, data);
    for (const e of keep) {
        try { rememberHash(book, clean(e.comment), clean(e.content)); } catch (err) { /* ignore */ }
    }
    persist();
    if (added || updated || appearChanged) pushOplog(book, log);
    return { added, updated, merged: mergedAway, coreChanged, missing: [...new Set(missing)], appear: appearChanged, edited, name: (plan.character || {}).name || '' };
}

// ── 写入 ─────────────────────────────────────────
async function doWrite() {
    collectPlan();
    const s = settings();
    const book = $('ac-book') ? $('ac-book').value : s.targetBook;
    if (!state.plan) return setMsg('先分析', 'err', 'ac-msg2');
    // ── 写入前拦一道：这本书里已经有正式角色条目了，再写就是重复 ──
    try {
        const nm0 = String(state.plan.name || '').trim();
        if (nm0 && await hasOwnCharacterEntry(book, nm0)) {
            let hits = [];
            try {
                const d0 = await getBook(book);
                hits = Object.values(d0.entries || {})
                    .map(function (e0) { return String(e0.comment || ''); })
                    .filter(function (c0) { return !/^(TavernDB|ACU-)/i.test(c0) && c0.indexOf(nm0) >= 0; });
            } catch (e0) {}
            const msg0 = '这本书里已经有「' + nm0 + '」' +
                (hits.length ? '（' + hits.slice(0, 6).join('、') + (hits.length > 6 ? ' 等 ' + hits.length + ' 条' : '') + '）' : '') +
                '。\n\n现在写入会按新格式再新建 4 条，很可能重复。\n建议：去「更新角色」改她，或者先把旧条目删掉。\n\n确定仍然要写入吗？';
            if (!window.confirm(msg0)) {
                return setMsg('已取消写入 —— 书里已经有「' + nm0 + '」了。要去「更新角色」改她。', 'err', 'ac-msg2');
            }
        }
    } catch (e0) { console.warn('[命运织机] 写入前重复检查失败', e0); }

    setMsg('写入中…', '', 'ac-msg2');
    const prog = toastProgress('世界书条目更新中…');
    try {
        const r = await writePlan(book, state.plan);
        prog.acDone('世界书更新完毕：新增 ' + r.added + ' 条' + (r.updated ? '，更新 ' + r.updated + ' 条' : ''));
        const lw = checkLengths(state.plan).filter(x => x.bad).map(x => x.name + ' ' + x.n + '字');
        const lengthWarn = lw.length ? '（字数偏离目标：' + lw.join('、') + '）' : '';
        if (r.edited && r.edited.length) toast('注意：' + r.edited.length + ' 条是你手改过的，已被覆盖：' + r.edited.join('、'), null, 12000);
        setMsg('已写入「' + book + '」：新增 ' + r.added + ' · 更新 ' + r.updated + (r.merged ? ' · 合并清理 ' + r.merged : '') + ' · 改核心 ' + r.coreChanged +
            (r.missing.length ? '（跳过不存在的核心条目：' + r.missing.join('、') + '）' : '') + lengthWarn, 'ok', 'ac-msg2');
        if ($('ac-write')) $('ac-write').disabled = true;
        state.drafts = (state.drafts || []).filter(d => d.name !== r.name);
        render();
    } catch (e) {
        prog.acDone('写入失败：' + errBrief(e), 8000);
        setMsg('写入失败：' + errBrief(e), 'err', 'ac-msg2');
    }
}
// ── 提示词编辑（高级） ───────────────────────────
function viewPrompt() {
    const s = settings();
    return '<h2>提示词（高级）</h2>' +
        '<div class="ac-card"><div class="h">说明 <span class="i">文本框里是当前生效的版本</span></div>' +
        '<div class="ac-pos">下面两个框里<b>已经填好当前生效的提示词</b>，可以直接改。<br>' +
        '点「恢复默认」会清掉你的修改、重新载入内置版。<br>生成提示词控制「怎么把人物做成条目」，检测提示词控制「怎么从正文里找人」。</div></div>' +

        '<div class="ac-card"><div class="h">生成提示词 <span class="i">' + activeSystem().length + ' 字</span></div>' +
        '<div class="ac-f"><textarea id="ac-psys" style="min-height:320px;font-size:12px;">' + esc(activeSystem()) + '</textarea>' +
        '<div class="hint">共 ' + activeSystem().length + ' 字；来源：' +
        (s.customSystem ? '你的自定义' : '内置默认') + '</div></div>' +
        '<div class="ac-btns"><button class="ac-btn pri" id="ac-psys-save">保存</button>' +
        '<button class="ac-btn" id="ac-psys-reset">恢复默认</button></div></div>' +

        '<div class="ac-card"><div class="h">检测提示词 <span class="i">' + activeDetect().length + ' 字</span></div>' +
        '<div class="ac-f"><textarea id="ac-pdet" style="min-height:200px;font-size:12px;">' + esc(activeDetect()) + '</textarea>' +
        '<div class="hint">共 ' + activeDetect().length + ' 字；来源：' +
        (s.customDetect ? '你的自定义' : '内置默认') + '　必须包含 &lt;已存在&gt; 占位符' + '</div></div>' +
        '<div class="ac-btns"><button class="ac-btn pri" id="ac-pdet-save">保存</button>' +
        '<button class="ac-btn" id="ac-pdet-reset">恢复默认</button></div></div>' +

        '<div class="ac-card"><div class="h">自定义 XP</div>' +
        '<div id="ac-customxp-list"></div>' +
        '<div style="display:flex;gap:8px;margin-top:10px;">' +
        '<input type="text" id="ac-newxp-tag" placeholder="新 XP 名称，例如：机械义眼" style="flex:0 0 200px;" />' +
        '<input type="text" id="ac-newxp-hint" placeholder="提示词（可不填）" style="flex:1 1 auto;" />' +
        '<button class="ac-btn" id="ac-addxp">添加</button></div>' +
        '<div class="hint">加进去的 XP 会出现在性癖池的「自定义」分组里，可以像内置的一样勾选。</div></div>' +

        '<div class="ac-msg" id="ac-msg3"></div>';
}

function wirePrompt() {
    const s = settings();
    const msg = (t, k) => { const m = $('ac-msg3'); if (m) { m.textContent = t; m.className = 'ac-msg' + (k ? ' ' + k : ''); } };

    $('ac-psys-save')?.addEventListener('click', () => {
        s.customSystem = $('ac-psys').value.trim();
        persist(); msg(s.customSystem ? '生成提示词已保存（' + s.customSystem.length + ' 字）' : '已清空，将使用内置默认', 'ok');
        render();
    });
    $('ac-psys-reset')?.addEventListener('click', () => { s.customSystem = ''; persist(); render(); msg('已恢复内置生成提示词', 'ok'); });
    $('ac-pdet-save')?.addEventListener('click', () => {
        const v = $('ac-pdet').value.trim();
        if (v && !v.includes('<已存在>')) return msg('检测提示词必须包含 <已存在> 占位符', 'err');
        s.customDetect = v;
        persist(); msg(v ? '检测提示词已保存' : '已清空，将使用内置默认', 'ok');
        render();
    });
    $('ac-pdet-reset')?.addEventListener('click', () => { s.customDetect = ''; persist(); render(); msg('已恢复内置检测提示词', 'ok'); });

    renderCustomXp();

    $('ac-addxp')?.addEventListener('click', () => {
        const tag = ($('ac-newxp-tag')?.value || '').trim();
        const hint = ($('ac-newxp-hint')?.value || '').trim();
        if (!tag) return msg('先填 XP 名称', 'err');
        s.customXp = s.customXp || [];
        if (s.customXp.some(x => x.tag === tag) || XP_HINTS[tag]) return msg('这个 XP 已经存在了', 'err');
        s.customXp.push({ tag, hint });
        persist();
        if ($('ac-newxp-tag')) $('ac-newxp-tag').value = '';
        if ($('ac-newxp-hint')) $('ac-newxp-hint').value = '';
        renderCustomXp();
        msg('已添加：' + tag, 'ok');
    });
}

function renderCustomXp() {
    const s = settings();
    const box = $('ac-customxp-list');
    if (!box) return;
    const list = s.customXp || [];
    if (!list.length) { box.innerHTML = '<div class="ac-empty">还没有自定义 XP</div>'; return; }
    box.innerHTML = list.map(function (x, i) {
        return '<div class="ac-draft"><span class="tag">自定义</span>' +
            '<span class="nm">' + esc(x.tag) + (x.hint ? '　<span style="color:#6f8080;font-size:12px">' + esc(x.hint).slice(0, 30) + '…</span>' : '') + '</span>' +
            '<button class="ac-btn" data-delxp="' + i + '">删除</button></div>';
    }).join('');
    box.querySelectorAll('[data-delxp]').forEach(function (b) {
        b.addEventListener('click', function () {
            settings().customXp.splice(Number(b.dataset.delxp), 1);
            persist(); renderCustomXp(); render();
        });
    });
}
// ── 概览 ─────────────────────────────────────────
function viewOverview() {
    return `<h2>概览</h2>
      <div class="ac-card"><div class="h">外观<span class="i">配色主题</span></div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <select class="ac-input" id="ac-theme" style="width:200px">${themeOptionsHtml()}</select>
          <span class="hint" style="margin:0">换主题会同时应用到织机面板和 Galgame 界面</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${themeDotsHtml()}</div>
      </div>
      <div class="ac-card"><div class="h">当前状态</div>
        <div class="ac-stat" id="ac-stat"><div><div class="k">世界书</div><div class="v">…</div></div></div>
        <div class="ac-pos" id="ac-cur" style="margin-top:10px">读取中…</div>
      </div>
      <div class="ac-card"><div class="h">用户身份（Persona）<span class="i" id="ac-persona-refresh" style="cursor:pointer">刷新</span></div>
        <div id="ac-personas" class="ac-pos">读取中…</div>
        <div class="hint">点名字切换身份；想纯群像就选一个空描述的「旁白」persona。</div>
        <div class="ac-sub" style="margin-top:12px;">
          <div class="ac-sub-h">扮演某个角色（以 TA 的身份玩）</div>
          <div class="hint">自动建同名 persona，并告诉 AI「你在演 TA」；退出还原原身份。</div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap">
            <select id="ac-play-char" class="ac-input" style="flex:1 1 180px;min-width:150px"></select>
            <button class="ac-btn pri" id="ac-play-btn">扮演 TA</button>
            <button class="ac-btn" id="ac-play-exit">退出扮演</button>
          </div>
          <div class="hint" id="ac-play-state"></div>
        </div>
      </div>
      <div class="ac-card"><div class="h">Galgame 全屏模式<span class="i" id="ac-vn-state">关</span></div>
        <div class="ac-pos">全屏视觉小说：背景铺满、<b>点一下出一段</b>，结尾可选「剧情推进」。</div>
        <div style="margin-top:10px"><button class="ac-btn pri" id="ac-vn-toggle">开启 Galgame 全屏模式</button></div>
        <div class="hint" style="margin-top:10px">打字机 / 立绘 / 表情等显示设置，以及素材，都在左侧「素材与显示」页。</div>
      </div>
      <div class="ac-card"><div class="h">正文格式 + 结尾剧情推进<span class="i" id="ac-adv-state">开</span></div>
        <div class="ac-pos">按所选格式写正文，结尾多一段 <b>20~50 字</b>剧情推进。</div>
        <div class="ac-f" style="margin-top:10px"><label>正文格式预设</label>
          <select class="ac-input" id="ac-format-preset" style="width:100%">
            <option value="classic">经典：环境*斜体* / 动作**粗体** / 内心折叠 / 场景 ---</option>
            <option value="webnovel">网文音效流：### 音效行 / #### 喘息行 / 对白独立段</option>
          </select>
        </div>
        <div style="margin-top:10px"><button class="ac-btn pri" id="ac-adv-toggle">关闭</button></div>
      </div>
      <div class="ac-card"><div class="h">群像模式<span class="i" id="ac-ens-state">关</span></div>
        <div class="ac-pos">开启后，正文不围绕 user 展开：多角色轮流行动/对话，user 只当旁观者/导演。<br>也可以聊天里打斜杠命令 <b>/群像</b> 一键开关。</div>
        <div style="margin-top:10px"><button class="ac-btn pri" id="ac-ensemble-toggle">开启群像模式</button></div>
        <div class="hint">不输入时 AI 会继续演；想接话直接发消息。</div>
      </div>
      <div class="ac-card"><div class="h">关于<span class="i">v${VERSION}</span></div>
        <div class="ac-pos" style="line-height:1.85">
          <b>命运织机（yek-FateLoom）</b>是酒馆的一个角色扮演辅助扩展，本面板、主界面浮动小面板、Galgame 全屏层都由它注入。<br>
          功能：角色识别与生成 · 世界书条目写入 · 人物变化 · 出场导演 · 剧情推进/群像/扮演 · Galgame 全屏与立绘表情 · 环境池/背景自动切换 · 素材包导入 · 多配色主题。<br>
          <span style="opacity:.75">以下为酒馆原生功能，扩展仅调用：官方角色表情扩展（共用 characters/&lt;角色&gt;/ 立绘）、酒馆背景库、Persona、世界书/角色卡/聊天、扩展提示词注入。</span>
        </div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap">
          <a class="ac-btn" id="ac-about-github" href="https://github.com/yeklow/yek-FateLoom" target="_blank" rel="noopener" style="text-decoration:none">GitHub 仓库</a>
          <button class="ac-btn" id="ac-about-copy">复制地址</button>
          <span class="hint" style="margin:0" id="ac-about-msg"></span>
        </div>
      </div>`;
}
// Galgame 显示设置（渲染在「素材」页）
function wireGalDisplaySettings() {
    const twTb = $('ac-tw-toggle'); const twSel = $('ac-tw-speed');
        if (twTb) {
            twTb.textContent = '打字机：' + (settings().vnTypewriter ? '开' : '关');
            if (!twTb._bound) {
                twTb._bound = true;
                twTb.addEventListener('click', function () {
                    const s = settings();
                    s.vnTypewriter = !s.vnTypewriter;
                    persist();
                    toast('打字机效果：' + (s.vnTypewriter ? '开' : '关'), null, 2500);
                });
            }
        }
        if (twSel) {
            if (!twSel._bound) {
                twSel._bound = true;
                twSel.addEventListener('change', function () {
                    settings().vnTypeSpeed = Number(twSel.value) || 40;
                    persist();
                    toast('打字机速度：' + (twSel.options[twSel.selectedIndex] || {}).text, null, 2000);
                });
            }
            twSel.value = String(settings().vnTypeSpeed || 40);
        }
        // 立绘设置
        const spTb = $('ac-sprite-toggle');
        if (spTb) {
            spTb.textContent = '立绘：' + (settings().vnSprite === false ? '关' : '开');
            if (!spTb._bound) {
                spTb._bound = true;
                spTb.addEventListener('click', function () {
                    const s = settings();
                    s.vnSprite = (s.vnSprite === false);
                    persist();
                    toast('立绘：' + (s.vnSprite === false ? '关' : '开'), null, 2000);
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                });
            }
        }
        const spPos = $('ac-sprite-pos');
        if (spPos) {
            if (!spPos._bound) {
                spPos._bound = true;
                spPos.addEventListener('change', function () {
                    settings().vnSpritePos = String(spPos.value || 'right');
                    persist();
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                });
            }
            spPos.value = String(settings().vnSpritePos || 'right');
        }
        const spSize = $('ac-sprite-size');
        if (spSize) {
            if (!spSize._bound) {
                spSize._bound = true;
                spSize.addEventListener('change', function () {
                    settings().vnSpriteSize = Number(spSize.value) || 112;
                    persist();
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                });
            }
            spSize.value = String(settings().vnSpriteSize || 112);
        }
        const spFb = $('ac-sprite-fallback');
        if (spFb) {
            if (!spFb._bound) {
                spFb._bound = true;
                spFb.addEventListener('change', function () {
                    settings().vnSpriteFallback = String(spFb.value || 'default');
                    persist();
                    _galSpriteCache = {};
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                    toast('无专属立绘时：' + (settings().vnSpriteFallback === 'none' ? '不显示' : '用默认素材包'), null, 2500);
                });
            }
            spFb.value = String(settings().vnSpriteFallback || 'default');
        }
        const spEmo = $('ac-emo-mode');
        if (spEmo) {
            if (!spEmo._bound) {
                spEmo._bound = true;
                spEmo.addEventListener('change', function () {
                    settings().vnEmotionMode = String(spEmo.value || 'ai');
                    persist();
                    toast('表情识别：' + (settings().vnEmotionMode === 'ai' ? 'AI 识别（按内容判情绪）' : '关键词'), null, 2500);
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                });
            }
            spEmo.value = String(settings().vnEmotionMode || 'ai');
        }
}

async function refreshOverview() {
    try {
        const books = await listBooks();
        state.books = books;
        const _lc3 = live(); const ch = _lc3.characters?.[_lc3.characterId];
        const msgCount = (live().chat || []).length;
        $('ac-stat').innerHTML =
            `<div><div class="k">世界书</div><div class="v">${books.length}</div></div>
             <div><div class="k">聊天消息</div><div class="v">${msgCount}</div></div>
             <div><div class="k">目标书条目</div><div class="v" id="ac-v3">…</div></div>`;
        $('ac-cur').innerHTML =
            `<b>角色卡</b>　${esc(ch?.name || '(未选择)')}<br>
             <b>当前聊天</b>　${esc(ctx.getCurrentChatId ? ctx.getCurrentChatId() : '(无)')}<br>
             <b>实际写入</b>　${esc(effectiveBook() || '(未选)')}`;
        if (effectiveBook()) {
            const d = await getBook(effectiveBook());
            const n = Object.keys(d.entries || {}).length;
            if ($('ac-v3')) $('ac-v3').textContent = n;
        }
        // 用户身份（Persona）列表
        try {
            const box = $('ac-personas');
            if (box) {
                const personaMap = ((ctx.powerUserSettings || {}).personas || {});
                const curName = String(ctx.name1 || '');
                const rows = Object.entries(personaMap).map(function (kv) {
                    const avatar = kv[0], name = String(kv[1] || avatar);
                    const on = (name === curName) || (avatar === curName);
                    return '<button class="ac-btn' + (on ? ' pri' : '') + '" data-persona="' + esc(avatar) + '" ' +
                        'style="margin:3px 6px 3px 0;padding:4px 12px;font-size:12px">' + (on ? '● ' : '') + esc(name) + '</button>';
                }).join('');
                box.innerHTML = rows || '<span class="hint">没有找到 persona</span>' +
                    '<div class="hint">当前：' + esc(curName || '(未知)') + '</div>';
                box.querySelectorAll('[data-persona]').forEach(function (b) {
                    b.addEventListener('click', function () { switchPersona(b.dataset.persona); });
                });
            }
            // 关于：复制 GitHub 地址
            const cp = $('ac-about-copy');
            if (cp && !cp._bound) {
                cp._bound = true;
                cp.addEventListener('click', function () {
                    const url = 'https://github.com/yeklow/yek-FateLoom';
                    try {
                        navigator.clipboard.writeText(url).then(function () {
                            const m = $('ac-about-msg');
                            if (m) m.textContent = '已复制';
                        }).catch(function () { toast(url, null, 6000); });
                    } catch (e) { toast(url, null, 6000); }
                });
            }
            // 配色主题
            const thSel = $('ac-theme');
            if (thSel) {
                if (!thSel._bound) {
                    thSel._bound = true;
                    thSel.addEventListener('change', function () { setTheme(thSel.value); });
                }
                thSel.value = themeKey();
            }
            document.querySelectorAll('[data-theme]').forEach(function (b) {
                if (!b._bound) { b._bound = true; b.addEventListener('click', function () { setTheme(b.dataset.theme); }); }
                b.classList.toggle('pri', b.dataset.theme === themeKey());
            });
            const rf = $('ac-persona-refresh');
            if (rf && !rf._bound) { rf._bound = true; rf.addEventListener('click', function () { refreshOverview(); }); }
            // 扮演角色下拉
            try {
                const sel = $('ac-play-char');
                if (sel) {
                    const cl = await listCharacters(effectiveBook());
                    const names = (cl || []).map(function (x) { return x.name; });
                    sel.innerHTML = names.map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + '</option>'; }).join('') || '<option value="">（没有角色）</option>';
                    if (settings().playChar) sel.value = settings().playChar;
                    const ps = $('ac-play-state');
                    if (ps) ps.innerHTML = settings().playChar
                        ? '当前扮演：<b>' + esc(settings().playChar) + '</b>　（正文不会再替你说话）'
                        : '当前没有扮演任何角色。';
                    const pb = $('ac-play-btn');
                    if (pb && !pb._bound) { pb._bound = true; pb.addEventListener('click', function () { const v = $('ac-play-char')?.value; if (v) doPlayAs(v); }); }
                    const pe = $('ac-play-exit');
                    if (pe && !pe._bound) { pe._bound = true; pe.addEventListener('click', function () { exitPlayAs(); }); }
                }
            } catch (e) { console.warn('[命运织机] 渲染扮演下拉失败', e); }
            const vnSt = $('ac-vn-state'); const vnTb = $('ac-vn-toggle');
            if (vnSt) vnSt.textContent = settings().vnMode ? '开' : '关';
            if (vnTb) {
                vnTb.textContent = settings().vnMode ? '关闭 Galgame 全屏模式' : '开启 Galgame 全屏模式';
                if (!vnTb._bound) {
                    vnTb._bound = true;
                    vnTb.addEventListener('click', function () {
                        const s = settings();
                        s.vnMode = !s.vnMode;
                        state.vnShown = {};
                        persist();
                        if (s.vnMode) { try { galOpen(); } catch (e) { /* ignore */ } toast('Galgame 全屏模式：开（点击底部文字条推进）', null, 4000); }
                        else { try { galClose(); const b = document.getElementById('ac-gal-open'); if (b) b.remove(); } catch (e) { /* ignore */ } toast('Galgame 全屏模式：已关闭', null, 3000); }
                        galEnsureOpenBtn();
                        refreshOverview();
                    });
                }
            }
            try { wireGalDisplaySettings(); } catch (e) { /* ignore */ }
            // 素材统一在「素材」页管理
            const spFmt = $('ac-format-preset');
            if (spFmt) {
                if (!spFmt._bound) {
                    spFmt._bound = true;
                    spFmt.addEventListener('change', function () {
                        settings().formatPreset = String(spFmt.value || 'classic');
                        persist();
                        try { applyAdvance(); } catch (e) { /* ignore */ }
                        toast('正文格式：' + (settings().formatPreset === 'webnovel' ? '网文音效流' : '经典'), null, 2500);
                    });
                }
                spFmt.value = String(settings().formatPreset || 'classic');
            }
            // 截断自动重roll
    const ar = $('ac-auto-reroll');
    if (ar) {
        ar.checked = settings().vnAutoReroll !== false;
        if (!ar._bound) {
            ar._bound = true;
            ar.addEventListener('change', function () {
                settings().vnAutoReroll = !!ar.checked;
                persist();
                toast('截断自动重roll：' + (ar.checked ? '开（最多 ' + (Number(settings().vnAutoRerollMax) || 2) + ' 次）' : '关'), null, 2800);
            });
        }
    }
    const stg = $('ac-speaker-tag');
    if (stg) {
        stg.checked = settings().speakerTag !== false;
        if (!stg._bound) {
            stg._bound = true;
            stg.addEventListener('change', function () {
                settings().speakerTag = !!stg.checked;
                persist();
                try { applyAdvance(); } catch (e) { /* ignore */ }
                toast('AI 标注说话人：' + (stg.checked ? '开（下一轮回复生效）' : '关（回退自动识别）'), null, 3400);
            });
        }
    }
    const hct = $('ac-hide-chat-tags');
    if (hct) {
        hct.checked = settings().hideChatTags !== false;
        if (!hct._bound) {
            hct._bound = true;
            hct.addEventListener('change', function () {
                settings().hideChatTags = !!hct.checked;
                persist();
                if (hct.checked) { try { galHideChatSpeakerTags(); } catch (e) { /* ignore */ } }
                toast('聊天隐藏说话人标注：' + (hct.checked ? '开' : '关'), null, 2400);
            });
        }
    }
    const arm = $('ac-auto-reroll-max');
    if (arm) {
        arm.value = String(Number(settings().vnAutoRerollMax) || 2);
        if (!arm._bound) {
            arm._bound = true;
            arm.addEventListener('change', function () {
                settings().vnAutoRerollMax = Math.max(1, Math.min(5, Number(arm.value) || 2));
                persist();
                toast('自动重roll 次数：' + settings().vnAutoRerollMax, null, 2200);
            });
        }
    }
    const ta = $('ac-stall-seconds');
    if (ta) {
        ta.value = String(Number(settings().vnStallSeconds) || 10);
        if (!ta._bound) {
            ta._bound = true;
            ta.addEventListener('change', function () {
                settings().vnStallSeconds = Math.max(5, Math.min(10, Number(ta.value) || 10));
                persist();
                toast('判定截断：连续 ' + settings().vnStallSeconds + ' 秒没有新字', null, 2600);
            });
        }
    }
    const rd = $('ac-reroll-delay');
    if (rd) {
        rd.value = String(Number(settings().vnRerollDelay) || 15);
        if (!rd._bound) {
            rd._bound = true;
            rd.addEventListener('change', function () {
                settings().vnRerollDelay = Math.max(5, Math.min(60, Number(rd.value) || 15));
                persist();
                toast('自动重roll 前等待：' + settings().vnRerollDelay + ' 秒', null, 2400);
            });
        }
    }
    const advSt = $('ac-adv-state'); const advTb = $('ac-adv-toggle');
            if (advSt) advSt.textContent = settings().advance ? '开' : '关';
            if (advTb) {
                advTb.textContent = settings().advance ? '关闭' : '开启';
                if (!advTb._bound) {
                    advTb._bound = true;
                    advTb.addEventListener('click', function () {
                        const s = settings();
                        s.advance = !s.advance;
                        persist();
                        applyAdvance();
                        toast('正文格式+剧情推进：' + (s.advance ? '已开启' : '已关闭'), null, 3000);
                        refreshOverview();
                    });
                }
            }
            const st = $('ac-ens-state'); const tb = $('ac-ensemble-toggle');
            if (st) st.textContent = settings().ensemble ? '开' : '关';
            if (tb) {
                tb.textContent = settings().ensemble ? '关闭群像模式' : '开启群像模式';
                if (!tb._bound) {
                    tb._bound = true;
                    tb.addEventListener('click', function () {
                        const s = settings();
                        s.ensemble = !s.ensemble;
                        if (s.ensemble) { s.playChar = ''; try { applyPlay(); } catch (e) { /* ignore */ } }
                        persist();
                        applyEnsemble();
                        toast('群像模式：' + (s.ensemble ? '已开启' : '已关闭'), null, 3000);
                        refreshOverview();
                    });
                }
            }
        } catch (e) { console.warn('[命运织机] 渲染 persona/群像失败', e); }
    } catch (e) { console.warn('[命运织机]', e); }
}

// ── API 配置 ─────────────────────────────────────
function viewApi() {
    const s = settings();
    return `
      <h2>API 配置</h2>
      <div class="ac-card">
        <div class="h">连接方式</div>
        <div class="ac-f">
          <div class="ac-seg" id="ac-mode">
            <div data-m="custom" class="${s.apiMode === 'custom' ? 'on' : ''}">自定义（用我自己的）</div>
            <div data-m="main" class="${s.apiMode === 'main' ? 'on' : ''}">跟随酒馆主 API</div>
          </div>
          <div class="hint">自定义模式下本插件独立发请求，不占用也不影响酒馆主 API 的设置。</div>
        </div>
        <div class="ac-f" id="ac-transport-box" style="${s.apiMode === 'custom' ? '' : 'opacity:0.45;pointer-events:none;'}">
          <label>发送通道</label>
          <div class="ac-seg" id="ac-transport">
            <div data-t="server" class="${s.transport !== 'browser' ? 'on' : ''}">酒馆服务器中转（推荐）</div>
            <div data-t="browser" class="${s.transport === 'browser' ? 'on' : ''}">浏览器直连</div>
          </div>
          <div class="hint">中转模式由酒馆服务器发请求，不受浏览器跨域、代理影响。直连模式要求端点允许跨域。</div>
        </div>
      </div>

      <div class="ac-card" id="ac-custom-box" style="${s.apiMode === 'custom' ? '' : 'opacity:0.45;pointer-events:none;'}">
        <div class="h">自定义端点</div>
        <div class="ac-f">
          <label>端点（基础 URL）</label>
          <input type="text" id="ac-url" value="${esc(s.apiUrl)}" placeholder="https://api.deepseek.com" />
          <div class="hint">填到域名或 /v1 为止即可，插件会自动补 /chat/completions。</div>
        </div>
        <div class="ac-f">
          <label>API 密钥</label>
          <input type="text" id="ac-key" value="${esc(s.apiKey)}" placeholder="sk-..." />
          <div class="hint">🔒 Key 只保存在本地酒馆设置（settings.json）里，不会写进扩展代码，也不会随扩展更新丢失；请不要把 Key 提交到公开仓库。</div>
        </div>
        <div class="ac-f">
          <label>模型名</label>
          <div style="display:flex;gap:8px;">
            <input type="text" id="ac-model" value="${esc(s.model)}" placeholder="deepseek-flash" style="flex:1 1 auto;" />
            <button class="ac-btn" id="ac-loadmodels" style="flex:0 0 auto;"><i class="fa-solid fa-list"></i> 加载模型</button>
          </div>
          <div class="ac-list" id="ac-models" style="display:none;margin-top:8px;max-height:240px;"></div>
          <div class="hint" id="ac-models-hint">从端点读取可用模型列表，点一个就填入。</div>
        </div>
        <div class="ac-f">
          <label>额外请求头（可选）</label>
          <input type="text" id="ac-headers" value="${esc(s.headers)}" placeholder="X-My-Header: value（没有就留空）" />
          <div class="hint">一行一个，格式「名字: 值」。<b>opencode 这类端点必须带 x-opencode-session —— 插件会自动补，留空也行。</b></div>
        <div class="ac-f">
          <label class="ac-sw"><input type="checkbox" id="ac-autoscan"${s.autoScan !== false ? ' checked' : ''} /><span>认不出角色时自动让模型扫一遍</span></label>
          <div class="hint"><b>默认开。</b>当规则一条角色都认不出来时，自动调一次 LLM 读条目名（约 1100 token），结果按内容缓存，不会重复花钱。关掉的话就用「出场导演」页的「LLM 扫描角色」按钮手动触发。</div>
        </div>
        </div>
        <div class="ac-f" style="display:flex;gap:14px;">
          <div style="flex:1 1 0;">
            <label>最大回复长度</label>
            <input type="text" id="ac-max" value="${esc(s.maxTokens)}" />
          </div>
          <div style="flex:0 0 140px;">
            <label>温度</label>
            <input type="text" id="ac-temp" value="${esc(s.temperature)}" />
          </div>
          <div style="flex:0 0 150px;">
            <label>请求超时（秒）</label>
            <input type="text" id="ac-timeout" value="${esc(s.llmTimeout || 120)}" />
          </div>
        </div>
      </div>

      <div class="ac-card">
        <div class="h">测试</div>
        <button class="ac-btn pri" id="ac-test"><i class="fa-solid fa-plug-circle-check"></i> 测试连接</button>
        <div class="ac-view" id="ac-test-out" style="display:none"></div>
      </div>

      <div class="ac-card">
        <div class="h">说明</div>
        <div class="ac-pos">
          · 自定义模式是浏览器直连，<b>要求该端点允许跨域</b>（DeepSeek 可以，opencode zen 不行）<br>
          · 如果端点不允许跨域，把连接方式改成「跟随酒馆主 API」<br>
          · 两种模式生成的提示词完全一样，只是发请求的通道不同
        </div>
      </div>`;
}

function wireApi() {
    const s = settings();
    $('ac-mode')?.querySelectorAll('[data-m]').forEach(d => d.addEventListener('click', () => {
        s.apiMode = d.dataset.m; persist();
        $('ac-mode').querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === d));
        const box = $('ac-custom-box');
        if (box) { box.style.opacity = s.apiMode === 'custom' ? '1' : '0.45'; box.style.pointerEvents = s.apiMode === 'custom' ? 'auto' : 'none'; }
    }));
    const bind = (id, key, num) => $(id)?.addEventListener('input', e => {
        s[key] = num ? (Number(e.target.value) || 0) : e.target.value; persist();
    });
    bind('ac-url', 'apiUrl'); bind('ac-key', 'apiKey'); bind('ac-model', 'model');
    bind('ac-headers', 'headers');
    bind('ac-timeout', 'llmTimeout', true);
    $('ac-autoscan')?.addEventListener('change', function (e) {
        settings().autoScan = !!e.target.checked;
        persist();
    });
    $('ac-hdr-preview')?.addEventListener('click', function () {
        const out = $('ac-hdr-out');
        const txt = resolveHeaders();
        if (out) out.innerHTML = txt
            ? ('实际发送：<code>' + esc(txt.replace(/\n/g, ' | ')) + '</code>')
            : '<span style="color:#ffd479">没填任何请求头（大多数端点没问题）</span>';
    });
    bind('ac-max', 'maxTokens', true); bind('ac-temp', 'temperature', true);

    $('ac-transport')?.querySelectorAll('[data-t]').forEach(d => d.addEventListener('click', () => {
        s.transport = d.dataset.t; persist();
        $('ac-transport').querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', x === d));
    }));

    $('ac-loadmodels')?.addEventListener('click', async () => {
        const box = $('ac-models');
        const hint = $('ac-models-hint');
        if (s.apiMode === 'main') {
            if (box) { box.style.display = 'block'; box.innerHTML = '<div class="ac-empty">跟随酒馆主 API 时，模型由酒馆设置决定，这里不列。</div>'; }
            return;
        }
        if (box) { box.style.display = 'block'; box.innerHTML = '<div class="ac-empty">加载中…</div>'; }
        if (hint) hint.style.display = 'none';
        try {
            const url = apiBase() + '/models';
            const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + String(s.apiKey || '').trim() } });
            const text = await res.text();
            if (!res.ok) throw new Error(friendlyNetError('HTTP ' + res.status + ' ' + text.slice(0, 120)));
            let j; try { j = JSON.parse(text); } catch (e) { throw new Error('返回的不是 JSON'); }
            const arr = j.data || j.models || [];
            if (!arr.length) { box.innerHTML = '<div class="ac-empty">端点没有返回模型</div>'; return; }
            box.innerHTML = arr.map(m => {
                const id = m.id || m.name || String(m);
                const label = (m.name && m.name !== id) ? (m.name + '　(' + id + ')') : id;
                const extra = m.context_window ? ('　上下文 ' + Math.round(m.context_window / 1000) + 'k') : '';
                return `<div class="ac-row" data-id="${esc(id)}"><span class="c">${esc(label)}${esc(extra)}</span></div>`;
            }).join('');
            box.querySelectorAll('.ac-row').forEach(r => r.addEventListener('click', () => {
                const id = r.dataset.id;
                if ($('ac-model')) $('ac-model').value = id;
                s.model = id; persist();
                box.style.display = 'none';
                if (hint) { hint.style.display = 'block'; hint.textContent = '已选择：' + id; }
            }));
        } catch (e) {
            box.innerHTML = '<div class="ac-empty">加载失败：' + esc(e.message) + '<br>（端点可能不允许跨域，或密钥不对）</div>';
        }
    });

    $('ac-test')?.addEventListener('click', async () => {
        const out = $('ac-test-out');
        out.style.display = 'block';
        out.textContent = '测试中（流式）…\n\n';
        try {
            const r = await callLLM('只回复两个字：可以', {
                stream: true,
                onDelta: (d) => { out.textContent += d; },
            });
            out.textContent = '✅ 连接成功（流式）\n\n返回：' + String(r).slice(0, 300);
        } catch (e) {
            out.textContent = '❌ 失败\n\n' + (e.message || e);
        }
    });
}

// ═══════════════════════════════════════════════════════════
// 从别的角色卡导入人物：一次把另一个世界书里的角色搬过来
// ═══════════════════════════════════════════════════════════
// 读某张角色卡绑定的世界书里有哪些人物
async function scanImportBook(srcBook) {
    const book = String(srcBook || '').trim();
    if (!book) throw new Error('先选一本来源世界书');
    const target = effectiveBook();
    if (target && target === book) throw new Error('目标和来源是同一本书，换一本');

    const chars = await listCharacters(book);
    let have = [];
    if (target) {
        try { have = (await listCharacters(target)).map(function (x) { return x.name; }); } catch (e2) {}
    }
    return {
        book: book,
        chars: chars.map(function (x) {
            return {
                name: x.name,
                count: x.count,
                chars: x.chars,
                entries: x.entries,
                exists: have.some(function (n) { return n === x.name || n.indexOf(x.name) >= 0 || x.name.indexOf(n) >= 0; }),
            };
        }),
    };
}

// 把选中的这些人逐个生成并写入当前世界书
async function runImport(names) {
    const info = state.importInfo;
    if (!info) throw new Error('先读取人物');
    const target = effectiveBook();
    if (!target) throw new Error('先选目标世界书');
    if (target === info.book) throw new Error('目标和来源是同一本世界书');

    const picked = (info.chars || []).filter(function (x) { return names.indexOf(x.name) >= 0; });
    if (!picked.length) throw new Error('没有选中任何人');

    const review = !!settings().importReview;
    const done = [];
    const failed = [];
    for (let i = 0; i < picked.length; i++) {
        const c = picked[i];
        progNote('正在处理「' + c.name + '」（' + (i + 1) + '/' + picked.length + '）');
        try {
            if (await bookHasPerson(target, c.name)) {
                console.log('[命运织机] 「' + c.name + '」目标书里已有，跳过');
                continue;
            }
        } catch (e2) {}
        try {
            const plan = await generatePlan({
                book: target,
                name: c.name,
                aliases: [],
                idea: settings().idea,
                source: 'entries',
                existing: c.entries,
            });
            if (review) {
                state.drafts = state.drafts || [];
                state.drafts.unshift({ name: c.name, plan: plan, t: Date.now(), fromImport: true });
                done.push(c.name);
            } else {
                await writePlan(target, plan);
                done.push(c.name);
            }
        } catch (e) {
            failed.push(c.name + '：' + (e.message || e));
        }
    }
    if (review) state.drafts = (state.drafts || []).slice(0, 10);
    return { done: done, failed: failed, review: review };
}
// ── 更新已有角色 ─────────────────────────────────
async function viewUpdate() {
    const book = effectiveBook() || (state.books || [])[0];
    const box = 'ac-upd';
    if (!book) return '<h2>更新角色</h2><div class="ac-card"><div class="ac-empty">先选一本世界书</div></div>';

    let chars = [];
    try { chars = await listCharacters(book); } catch (e) { chars = []; }

    state.updateChars = chars;
    const picked = state.updateChar ? state.updateChar.name : '';

    let h = '<h2>更新角色</h2>';
    h += '<div class="ac-card"><div class="h">目标世界书</div>' +
        '<div class="ac-f"><select id="ac-upd-book">' +
        state.books.map(function (b) { return '<option value="' + esc(b) + '"' + (b === book ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="hint">认出 ' + chars.length + ' 个角色' +
        (chars.filter(function (c) { return c.missing; }).length ? ' · ' + chars.filter(function (c) { return c.missing; }).length + ' 个未建档' : '') +
        '。</div></div>';

    h += '<div class="ac-card"><div class="h">选择要更新的角色</div>';
    const anyYaml = chars.some(function (c) { return (c.entries || []).some(function (e) { return /<character>|<NSFW档案>|^character:/m.test(String(e.content || '')); }); });
    if (!chars.length) h += '<div class="ac-empty">这本书里没认出任何角色。<br>去「出场导演」页点「LLM 扫描角色」，或手动加名字再回来。</div>';
    else {
        if (!anyYaml) h += '<div class="hint" style="color:#ffd479;margin-bottom:10px">这些是手写条目：选中后可「升级成织机格式」（原文不动）。</div>';
        h += chars.map(function (c) {
            if (c.missing) {
                return '<div class="ac-row" data-missing="' + esc(c.name) + '">' +
                    '<span class="c">' + esc(c.name) + ' <span class="tag">未建条目</span></span>' +
                    '<span class="n">出场导演/数据库里见过，但还没有角色条目</span>' +
                    '<span style="display:flex;gap:6px;flex:0 0 auto">' +
                    '<button class="ac-btn" data-create="' + esc(c.name) + '" style="padding:4px 10px;font-size:12px">创建条目</button></span></div>';
            }
            const kn = c.chars >= 1000 ? (Math.round(c.chars / 100) / 10) + 'k' : String(c.chars);
            return '<div class="ac-row ac-upick" data-name="' + esc(c.name) + '">' +
                '<span class="c">' + (c.name === picked ? '<span class="dot">●</span> ' : '') + esc(c.name) + '</span>' +
                '<span class="n" style="display:flex;gap:6px;align-items:center"><span class="tag">' + c.count + ' 条</span><span class="tag">' + kn + ' 字</span></span></div>';
        }).join('');
        if (chars.some(function (c) { return c.missing; })) {
            const missN = chars.filter(function (c) { return c.missing; }).length;
            h += '<div class="hint" style="margin-top:8px">「未建条目」= 只认出了名字、还没角色条目。</div>';
            h += '<div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
                '<button class="ac-btn pri" id="ac-upd-create-all">⚡ 一键补全未建档（' + missN + '）</button>' +
                '<span class="hint" id="ac-upd-bulk-msg" style="margin:0"></span></div>';
        }
    }
    h += '</div>';

    if (picked) {
        h += '<div class="ac-card"><div class="h">重新分析「' + esc(picked) + '」</div>' +
            '<div class="hint" style="margin-bottom:10px">会先收集正文里她的描写，再结合她现有的设定，生成更新版。</div>' +
            '<button class="ac-btn pri" id="ac-upd-run">重新分析</button>' +
            '<button class="ac-btn" id="ac-upd-upgrade" style="margin-left:8px">升级成织机格式</button>' +
            '<div class="ac-msg" id="ac-upd-msg"></div></div>';
    }
    // 就地更新：直接改她原本那一条，不改格式
    const curC = chars.find(function (x) { return x.name === picked; });
    if (curC && (curC.entries || []).length) {
        h += '<div class="ac-card"><div class="h">条目内容<span class="i">点「查看/编辑」看原文并直接改</span></div>' +
            '<div class="hint" style="margin-bottom:10px">挑一条：可以<b>手动改</b>（改完自动同步世界书），也可以让模型<b>自动重写</b>（结合最近剧情，生成后自动同步）。「追加更新」只补新细节、原文不动。</div>';
        for (const en of curC.entries) {
            h += '<div class="ac-row"><span class="c">' + esc(en.comment) + '</span>' +
                '<span class="n">' + String(en.content || "").length + ' 字</span>' +
                '<span style="display:flex;gap:6px;flex:0 0 auto">' +
                '<button class="ac-btn" data-edit="' + esc(String(en.__uid)) + '" style="padding:4px 10px;font-size:12px">查看/编辑</button>' +
                '<button class="ac-btn" data-authorw="' + esc(String(en.__uid)) + '" style="padding:4px 10px;font-size:12px">自动重写</button>' +
                '<button class="ac-btn" data-append="' + esc(String(en.__uid)) + '" style="padding:4px 10px;font-size:12px">追加更新</button>' +
                '</span></div>';
        }
        h += '</div>';
    }

    // 条目编辑器：手动改 or 自动重写，保存后同步世界书
    if (state.updateEntry) {
        const en = state.updateEntry;
        h += '<div class="ac-card"><div class="h">编辑「' + esc(en.comment) + '」<span class="i">' + String(en.content || '').length + ' 字</span></div>' +
            '<div class="hint">直接改下面的正文，停止输入约 1.5 秒会<b>自动同步</b>到世界书；也可以点保存立即同步。点「自动重写」时模型会读最近剧情，把新变化并进这条（生成后自动同步）。</div>' +
            '<textarea class="ac-input" id="ac-en-text" style="width:100%;height:300px;margin-top:8px;resize:vertical;box-sizing:border-box;line-height:1.6">' + esc(en.content || '') + '</textarea>' +
            '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">' +
            '<button class="ac-btn pri" id="ac-en-save">保存并同步世界书</button>' +
            '<button class="ac-btn" id="ac-en-auto">自动重写（AI）</button>' +
            '<button class="ac-btn" id="ac-en-cancel">收起</button>' +
            '</div><div class="ac-msg" id="ac-en-msg"></div></div>';
    }

    if (state.autoRewrite) {
        const ar = state.autoRewrite;
        h += '<div class="ac-card"><div class="h">自动重写预览：' + esc(ar.comment) +
            '<span class="i">' + String(ar.old || '').length + ' → ' + String(ar.neu || '').length + ' 字</span></div>' +
            '<div class="hint">下面是模型重写后的内容和你原来内容的逐行对比（绿色=新增，红色删除线=删掉）。确认没问题再应用。</div>' +
            diffHtml(ar.old, ar.neu) +
            '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<button class="ac-btn pri" id="ac-arw-apply">应用并同步世界书</button>' +
            '<button class="ac-btn" id="ac-arw-cancel">取消</button></div>' +
            '<div class="ac-msg" id="ac-arw-msg"></div></div>';
    }
    if (state.rewrite) {
        const r = state.rewrite;
        h += '<div class="ac-card"><div class="h">追加预览：' + esc(r.comment) + '</div>' +
            '<div class="hint">原文 ' + r.oldLen + ' 字（不动） + 新补 ' + (r.appendedLen || 0) + ' 字 → 共 ' + r.newLen + ' 字</div>' +
            '<div class="hint" style="color:#8fd9b6;margin-top:6px">原文完整保留，只在末尾追加一段「【补充】」。写完可以撤销。</div>' +
            '<div class="hint" style="margin-top:10px;color:#8fa0a0">以下是<b>要追加的内容</b>，可以直接改：</div>' +
            '<textarea id="ac-rw-text" style="width:100%;height:180px;margin-top:6px">' + esc(r.neu) + '</textarea>' +
            '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<button class="ac-btn pri" id="ac-rw-apply">追加进去</button>' +
            '<button class="ac-btn" id="ac-rw-cancel">取消</button></div></div>';
        h += '<div style="margin-top:8px"><button class="ac-btn" id="ac-rw-undo">撤销上次追加</button></div>';
    }
    if (state.updateDiff && state.updateDiff.length) h += renderUpdateDiff();

    return h;
}

// 行级 diff（LCS）：返回可直接插入的 HTML
function diffHtml(oldText, newText) {
    const o = String(oldText || '').replace(/\r/g, '').split('\n');
    const n = String(newText || '').replace(/\r/g, '').split('\n');
    const MAXL = 800;
    const a = o.length > MAXL ? o.slice(0, MAXL) : o;
    const b = n.length > MAXL ? n.slice(0, MAXL) : n;
    const LA = a.length, LB = b.length;
    // LCS 长度表（行数控制在 800 内，内存与耗时都可接受）
    const dp = new Int32Array((LA + 1) * (LB + 1));
    const at = function (i, j) { return i * (LB + 1) + j; };
    for (let i = LA - 1; i >= 0; i--) {
        for (let j = LB - 1; j >= 0; j--) {
            dp[at(i, j)] = (a[i] === b[j]) ? (dp[at(i + 1, j + 1)] + 1) : Math.max(dp[at(i + 1, j)], dp[at(i, j + 1)]);
        }
    }
    const out = [];
    let i = 0, j = 0, added = 0, removed = 0;
    while (i < LA && j < LB) {
        if (a[i] === b[j]) { out.push({ t: ' ', s: a[i] }); i++; j++; }
        else if (dp[at(i + 1, j)] >= dp[at(i, j + 1)]) { out.push({ t: '-', s: a[i] }); removed++; i++; }
        else { out.push({ t: '+', s: b[j] }); added++; j++; }
    }
    while (i < LA) { out.push({ t: '-', s: a[i] }); removed++; i++; }
    while (j < LB) { out.push({ t: '+', s: b[j] }); added++; j++; }
    const tail = (o.length > MAXL || n.length > MAXL) ? '<div style="color:#6f8080;margin-top:4px">（内容较长，只显示前 ' + MAXL + ' 行）</div>' : '';
    const body = out.map(function (x) {
        let style = 'padding:1px 6px;white-space:pre-wrap;word-break:break-all;';
        let prefix = '&nbsp;';
        if (x.t === '+') { style += 'background:rgba(60,160,110,.16);color:#8fd9b6;'; prefix = '+'; }
        else if (x.t === '-') { style += 'background:rgba(180,70,70,.16);color:#ffb4b4;text-decoration:line-through;'; prefix = '−'; }
        else { style += 'color:#9aa8a8;'; }
        return '<div style="' + style + '">' + prefix + ' ' + esc(x.s || ' ') + '</div>';
    }).join('');
    return '<div style="max-height:340px;overflow:auto;border:1px solid #2f3739;border-radius:8px;padding:8px 6px;margin-top:8px;font-size:12px;line-height:1.6">' +
        (added || removed ? '' : '<div style="color:#8fa0a0;margin-bottom:6px">（内容没有变化）</div>') + body + tail + '</div>';
}

function renderUpdateDiff() {
    const rows = state.updateDiff.map(function (d, i) {
        const dt = d.newLen - d.oldLen;
        const sign = dt > 0 ? '+' : '';
        return '<div class="ac-ec">' +
            '<div class="h"><input type="checkbox" class="ac-uck" data-i="' + i + '"' + (d.take ? ' checked' : '') + ' />' +
            '<span>' + esc(d.comment) + '</span>' +
            '<span class="len">' + d.oldLen + ' → ' + d.newLen + ' 字（' + sign + dt + '）</span>' +
            '<button class="ac-btn" data-diff="' + i + '" style="margin-left:auto;padding:3px 10px;font-size:12px">查看改动</button></div>' +
            (d.edited ? '<div class="ac-warn" style="margin-top:6px">⚠ 这条你手改过，更新会覆盖掉你的修改（可在「备份」页撤销）</div>' : '') +
            '<div style="font-size:12px;color:#6f8080;margin-top:6px;">' + (d.take ? '将更新为新版' : '保留原版') + '</div>' +
            '<div class="ac-diffbox" id="ac-diffbox-' + i + '" style="display:none">' + diffHtml(d.old, d.neu) + '</div>' +
            '</div>';
    }).join('');

    return '<div class="ac-card"><div class="h">对比 <span class="i">勾选要更新的条目，点「查看改动」看具体改了哪几行</span></div>' +
        rows +
        '<button class="ac-btn pri big" id="ac-upd-apply" style="margin-top:12px;">应用更新</button>' +
        '<div class="ac-msg" id="ac-upd-msg2"></div></div>';
}

function wireUpdate() {
    $('ac-upd-book')?.addEventListener('change', function (e) {
        setTargetBook(e.target.value);
        settings().followCharBook = false;
        state.updateChar = null; state.updateDiff = null; state.updateEntry = null;
        persist(); render();
    });
    document.querySelectorAll('.ac-upick').forEach(function (r) {
        r.addEventListener('click', function () {
            const name = r.dataset.name;
            const c = (state.updateChars || []).find(function (x) { return x.name === name; });
            state.updateChar = c || null;
            state.updateDiff = null;
            state.updateEntry = null;
            render();
        });
    });
    // 「创建条目」：跳到添加角色页并预填名字
    document.querySelectorAll('[data-create]').forEach(function (btn) {
        btn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            const nm = String(btn.dataset.create || '').trim();
            if (!nm) return;
            const s = settings();
            s.name = nm;
            state.updateChar = null;
            state.updateDiff = null;
            state.updateEntry = null;
            state.candidates = [];
            state.tab = 'add';
            persist();
            render();
            setTimeout(function () {
                const el = $('ac-name');
                if (el) { try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(); } el.focus(); }
                toast('已把「' + nm + '」填进添加页，往下点「分析」生成模板', null, 6000);
            }, 300);
        });
    });
    document.querySelectorAll('[data-diff]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const box = document.getElementById('ac-diffbox-' + btn.dataset.diff);
            if (!box) return;
            const show = box.style.display === 'none';
            box.style.display = show ? 'block' : 'none';
            btn.textContent = show ? '收起改动' : '查看改动';
        });
    });
    $('ac-upd-run')?.addEventListener('click', runUpdate);
    // 一键补全未建档：逐个生成（尊重「先出草稿」开关）
    $('ac-upd-create-all')?.addEventListener('click', async function () {
        const book = effectiveBook();
        const missing = (state.updateChars || []).filter(function (c) { return c.missing; }).map(function (c) { return c.name; });
        if (!book) { toast('先选目标世界书', null, 2500); return; }
        if (!missing.length) return;
        const btn = $('ac-upd-create-all');
        const msg = $('ac-upd-bulk-msg');
        if (btn) { btn.disabled = true; btn.textContent = '补全中…'; }
        let ok = 0;
        const fail = [];
        for (let i = 0; i < missing.length; i++) {
            if (msg) msg.textContent = '正在生成 ' + missing[i] + '（' + (i + 1) + '/' + missing.length + '）…';
            try {
                const plan = await generatePlan({ book: book, name: missing[i], aliases: [], idea: settings().idea, source: 'entries', existing: [] });
                if (settings().importReview) {
                    state.drafts = state.drafts || [];
                    state.drafts.unshift({ name: missing[i], plan: plan, t: Date.now() });
                } else {
                    await writePlan(book, plan);
                }
                ok++;
            } catch (e) {
                fail.push(missing[i]);
                console.warn('[命运织机] 补全失败:', missing[i], e);
            }
        }
        if (msg) msg.textContent = '完成：成功 ' + ok + ' 个' + (fail.length ? '，失败 ' + fail.length + ' 个' : '');
        toast('一键补全：成功 ' + ok + ' 个' + (fail.length ? '，失败：' + fail.join('、') : ''), null, 5000);
        state.dirCache = null;
        try { await refreshDirCache(book); } catch (e) { /* ignore */ }
        try { render(); } catch (e) { /* ignore */ }
    });
    // 自动重写预览：应用 / 取消
    $('ac-arw-apply')?.addEventListener('click', async function () {
        const ar = state.autoRewrite;
        const m = $('ac-arw-msg');
        const setM = function (t, k) { if (m) { m.textContent = t; m.className = 'ac-msg' + (k ? ' ' + k : ''); } };
        if (!ar) return;
        try {
            const book = effectiveBook();
            const data = await getBook(book);
            const ent = Object.values(data.entries || {}).find(function (x) { return String(x.uid) === String(ar.uid); });
            if (!ent) throw new Error('这条条目已经不在了（可能被数据库重写了）');
            ent.content = ar.neu;
            await putBook(book, data);
            try { await refreshDirCache(); } catch (e) { }
            if (state.updateEntry && String(state.updateEntry.__uid) === String(ar.uid)) {
                state.updateEntry = { __uid: ar.uid, comment: ar.comment, content: ar.neu };
            } else if (ar.fromEditor) {
                state.updateEntry = { __uid: ar.uid, comment: ar.comment, content: ar.neu };
            }
            state.autoRewrite = null;
            toast('已应用重写并同步世界书：' + ar.comment, null, 5000);
            render();
        } catch (e) { setM('应用失败：' + (e && e.message ? e.message : e), 'err'); }
    });
    $('ac-arw-cancel')?.addEventListener('click', function () {
        state.autoRewrite = null;
        render();
    });
    // 条目：查看/编辑
    document.querySelectorAll('[data-edit]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const uid = String(btn.dataset.edit);
            const c = state.updateChar || (state.updateChars || []).find(function (x) { return x.name === (state.updateChar ? state.updateChar.name : ''); });
            const en = c && (c.entries || []).find(function (x) { return String(x.__uid) === uid; });
            if (!en) return;
            state.updateEntry = { __uid: en.__uid, comment: en.comment, content: en.content || '' };
            render();
        });
    });
    // 条目：自动重写（生成后自动同步世界书）
    document.querySelectorAll('[data-authorw]').forEach(function (btn) {
        btn.addEventListener('click', function () { runAutoRewriteEntry(String(btn.dataset.authorw)); });
    });
    // 编辑器：保存 / 自动同步 / 收起
    const enText = $('ac-en-text');
    const enMsg = function (t, k) { const m = $('ac-en-msg'); if (m) { m.textContent = t; m.className = 'ac-msg' + (k ? ' ' + k : ''); } };
    const enSave = async function (quiet) {
        const en = state.updateEntry;
        if (!en || !enText) return;
        try {
            const book = effectiveBook();
            const data = await getBook(book);
            const ent = Object.values(data.entries || {}).find(function (x) { return String(x.uid) === String(en.__uid); });
            if (!ent) throw new Error('这条条目已经不在了（可能被数据库重写了）');
            ent.content = String(enText.value || '');
            await putBook(book, data);
            en.content = ent.content;
            state.updateEntry = en;
            try { await refreshDirCache(); } catch (e) { }
            if (!quiet) enMsg('已同步到世界书：' + en.comment + '（' + en.content.length + ' 字）', 'ok');
            return true;
        } catch (e) {
            enMsg('同步失败：' + (e && e.message ? e.message : e), 'err');
            return false;
        }
    };
    if (enText) {
        let autoTimer2 = null;
        enText.addEventListener('input', function () {
            if (autoTimer2) clearTimeout(autoTimer2);
            const m = $('ac-en-msg');
            if (m) { m.textContent = '未保存…'; m.className = 'ac-msg'; }
            autoTimer2 = setTimeout(function () { enSave(true); }, 1500);
            state.updateEntry && (state.updateEntry.content = enText.value);
        });
    }
    $('ac-en-save')?.addEventListener('click', function () { enSave(false); });
    $('ac-en-cancel')?.addEventListener('click', function () { state.updateEntry = null; render(); });
    $('ac-en-auto')?.addEventListener('click', function () {
        const en = state.updateEntry;
        if (en) runAutoRewriteEntry(String(en.__uid), true);
    });
    document.querySelectorAll('.ac-uck').forEach(function (ck) {
        ck.addEventListener('change', function () {
            const i = Number(ck.dataset.i);
            if (state.updateDiff[i]) state.updateDiff[i].take = ck.checked;
            render();
        });
    });
    $('ac-upd-apply')?.addEventListener('click', applyUpdate);
    $('ac-upd-upgrade')?.addEventListener('click', function () { runUpgrade(); });
    document.querySelectorAll('[data-append]').forEach(function (btn) {
        btn.addEventListener('click', function () { runAppend(btn.dataset.append); });
    });
    $('ac-rw-apply')?.addEventListener('click', function () { applyAppend(); });
    $('ac-rw-cancel')?.addEventListener('click', function () { state.rewrite = null; render(); });
    $('ac-rw-undo')?.addEventListener('click', async function () {
        const prog = toastProgress('正在撤销…');
        try { const u = await undoRewrite(); prog.acDone('已恢复「' + u.comment + '」的原文'); render(); }
        catch (e) { prog.acDone('撤销失败：' + errBrief(e), 8000); }
    });
}

// 追加更新：只生成「原文里还没有的新细节」，拼在原文后面
const APPEND_SYSTEM = "你的任务是根据最新素材，为已有的世界书条目追加增量内容。\n\n【核心规则】\n1. 严格去重：仅提取素材中出现、且世界书原文尚未包含的新增事实、状态或细节；原文已有的信息严禁以任何形式复述或改写。\n2. 冲突处理：若新素材与原文内容发生冲突或存在状态演进，以新素材为准，直接采用叙事语言记录最新状态或转变过程，严禁使用“修改为”“与原文不同”等解释性表述。\n3. 严禁编造：所有增补内容必须严格基于所给素材，禁止脱离素材进行推测或扩写；若素材中无任何新增有效信息，则不输出任何内容。\n4. 篇幅控制：输出仅为直接拼接在原文末尾的「增补片段」，严禁重写全文；篇幅应根据有效新信息量精简控制，一般为 150~600 字，且最长不得超过原文长度的 60%（若原文极短或新信息极少，以如实记录为准，不必强凑字数）。\n5. 风格与格式：保持与原文完全一致的叙事视角、语调与行文格式；直接输出增补片段的正文纯文本，严禁添加标题、编号、前缀说明、总结或任何额外标记。"

async function runAppend(uid) {
    const c = state.updateChar;
    if (!c) return;
    const ent = (c.entries || []).find(function (e) { return String(e.__uid) === String(uid) || String(e.comment) === String(uid); });
    const target = ent || (c.entries || [])[0];
    if (!target) { toast("找不到这条条目", null, 4000); return; }

    const oldText = String(target.content || "");
    const prog = toastProgress("正在给「" + target.comment + "」补内容…");
    try {
        let chatPart = "";
        try {
            const hits = gatherFromChat(c.name, []);
            if (hits.length) chatPart = NL2 + "【新的正文素材】" + NL2 + hits.slice(-20).map(function (h) { return (h.isUser ? "【玩家】" : "【正文】") + h.text; }).join(NL2).slice(0, 6000);
        } catch (e) { /* 没有就算了 */ }

        const prompt = APPEND_SYSTEM + NL2 + NL2 +
            "【条目名】" + target.comment + NL2 + NL2 +
            "【条目原文（已经写过这些，不要重复）】" + NL2 + oldText + chatPart + NL2 + NL2 +
            "请只输出需要新增的细节片段。";

        const raw = await callLLM(prompt);
        let txt = String(raw || "").trim();
        txt = txt.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "").trim();

        state.rewrite = {
            uid: (target.uid != null ? target.uid : target.__uid), comment: target.comment, mode: "append",
            old: oldText, neu: txt, take: true,
            oldLen: oldText.length, newLen: oldText.length + txt.length,
            appendedLen: txt.length,
            ratio: 1, short: false,
        };
        prog.acDone("已生成增补片段：" + txt.length + " 字，原文不动");
        render();
    } catch (e) {
        prog.acDone("生成失败：" + errBrief(e), 8000);
    }
}
async function undoRewrite() {
    const u = state.rewriteUndo;
    if (!u) throw new Error('没有可撤销的更新');
    const book = effectiveBook();
    const data = await getBook(book);
    const ent = Object.values(data.entries || {}).find(function (e) { return String(e.uid) === String(u.uid); });
    if (!ent) throw new Error('这条条目已经不在了');
    ent.content = u.old;
    await putBook(book, data);
    state.rewriteUndo = null;
    await refreshDirCache();
    return u;
}

// 把增补片段追加到原条目末尾（原文不动）
async function applyAppend() {
    const r = state.rewrite;
    if (!r) return;
    const box = $("ac-rw-text");
    if (box && String(box.value || "").trim()) r.neu = String(box.value);
    const book = effectiveBook();
    const prog = toastProgress("正在追加…");
    try {
        const data = await getBook(book);
        const uid = (r.uid != null ? r.uid : r.__uid);
        const ent = Object.values(data.entries || {}).find(function (x) { return String(x.uid) === String(uid); });
        if (!ent) throw new Error("这条条目已经不在了");
        const before = String(ent.content || "");
        ent.content = before + NL2 + "【补充】" + NL2 + r.neu;
        state.rewriteUndo = { uid: ent.uid, comment: String(ent.comment || ""), old: before, at: Date.now() };
        await putBook(book, data);
        state.rewrite = null;
        await refreshDirCache();
        prog.acDone("已补进「" + r.comment + "」：" + before.length + " → " + String(ent.content).length + " 字");
        render();
    } catch (err) {
        prog.acDone("追加失败：" + (err.message || err), 8000);
    }
}
// 自动重写某条角色条目：结合最近剧情更新，生成后自动同步世界书
const REWRITE_ENTRY_SYSTEM = "你是一个世界书（World Info）角色条目维护助手。请根据最新剧情，将目标角色的最新变化合并至现有条目中，并直接输出更新后的完整条目正文。\n\n【结构与文风约束】\n1. 严格保持原条目的整体结构、字段名称、层级划分、分段方式、叙述人称与语言风格，不得擅自增删预设的固定栏目或改变排版格式。\n2. 原条目中未被新剧情推翻的既有设定、背景与特征必须完整保留，不得无故删减或压缩。\n\n【内容合并规则】\n1. 仅提取最新剧情中与该角色直接相关的实质性变化（如状态变更、关系进展、新增经历、秘密揭露、关键物品或永久性外观/属性改变）并自然融入对应字段。\n2. 忽略无关的日常琐碎动作或纯过场描写，避免将设定条目写成剧情流水账。\n3. 冲突覆盖原则：若最新剧情与原条目内容产生矛盾（如认知刷新、关系破裂、状态改变等），一律以最新剧情为准，直接改写或替换旧有表述。\n4. 严禁脑补与编造：所有新增或修改的内容必须严格基于提供的剧情素材，不得推测未发生的剧情或添加素材外的设定。\n5. 边界情况处理：若最新剧情中不包含该角色的任何有效新信息，请原样输出原条目全文，不做任何字词改动。\n\n【输出格式要求】\n1. 仅输出更新后的条目纯文本正文，从原条目的第一个字符对应位置开始，到最后一个字符结束。\n2. 严禁输出任何标题、前言、后记、修改说明、解释性文字或 Markdown 代码块包裹（如 ```）。"

function recentChatText(max) {
    const chat = live().chat || [];
    const out = [];
    for (let i = Math.max(0, chat.length - 12); i < chat.length; i++) {
        const m = chat[i];
        if (!m || m.is_system) continue;
        const t = String(m.mes || '').trim();
        if (!t) continue;
        out.push((m.is_user ? '用户：' : 'AI：') + t.slice(0, 1200));
    }
    return out.join(NL2).slice(-(max || 8000));
}

async function runAutoRewriteEntry(uid, fromEditor) {
    resetLLMCancel();
    const book = effectiveBook();
    if (!book) { toast('没有目标世界书', null, 6000); return; }
    let en = null;
    let chName = (state.updateChar && state.updateChar.name) || '';
    const c = state.updateChar || (state.updateChars || []).find(function (x) { return x.name === chName; });
    if (c && (c.entries || []).length) en = c.entries.find(function (x) { return String(x.__uid) === String(uid); });
    const prog = toastProgress('正在自动重写条目…');
    try {
        if (!en) {
            const data0 = await getBook(book);
            const ent0 = Object.values(data0.entries || {}).find(function (x) { return String(x.uid) === String(uid); });
            if (!ent0) throw new Error('这条条目已经不在了');
            en = { __uid: ent0.uid, comment: String(ent0.comment || ''), content: String(ent0.content || '') };
        }
        const content = String(en.content || '');
        if (!content.trim()) throw new Error('这条条目是空的，没法重写');
        const prompt = REWRITE_ENTRY_SYSTEM + NL2 +
            '【角色】' + (chName || en.comment) + NL2 +
            '【条目】' + en.comment + NL2 +
            '【现有内容】' + NL2 + content.slice(0, 6000) + NL2 +
            '【最近剧情】' + NL2 + recentChatText(8000);
        let raw = String(await callLLM(prompt) || '').trim();
        raw = raw.replace(/^```[\w-]*\s*/i, '').replace(/\s*```$/, '').trim();
        if (raw.length < 20) throw new Error('模型返回内容太短：' + raw.slice(0, 80));
        // 先给预览 + diff，用户确认后再写入（不再直接覆盖）
        state.autoRewrite = {
            uid: String(uid),
            comment: String(en.comment || ''),
            old: content,
            neu: raw,
            fromEditor: !!fromEditor,
        };
        prog.acDone('已生成重写预览：「' + en.comment + '」' + content.length + ' → ' + raw.length + ' 字，确认后再应用');
        render();
    } catch (e) {
        prog.acDone('自动重写失败：' + errBrief(e), 9000);
        render();
    }
}

// 把现有条目当素材，升级成织机格式（不依赖聊天里出现过她）
async function runUpgrade() {
    const c = state.updateChar;
    if (!c) return;
    const msg = function (t, k) { const m = $("ac-upd-msg"); if (m) { m.textContent = t; m.className = "ac-msg" + (k ? " " + k : ""); } };
    msg("正在把她的现有条目改写成织机格式…");
    const btn = $("ac-upd-run"); if (btn) btn.disabled = true;
    const prog = toastProgress("正在升级「" + c.name + "」…");
    try {
        const plan = await generatePlan({
            book: effectiveBook(),
            name: c.name,
            aliases: [],
            idea: settings().idea,
            source: "entries",
            existing: c.entries,
        });
        const next = planToEntries(plan);
        const diff = [];
        for (const e of next) {
            const old = c.entries.find(function (x) { return x.comment === e.comment; });
            diff.push({
                comment: e.comment, edited: false,
                old: old ? old.content : "",
                neu: e.content, keys: e.keys,
                oldLen: old ? old.content.length : 0,
                newLen: e.content.length, take: true,
            });
        }
        state.updatePlan = plan;
        state.updateDiff = diff;
        prog.acDone("升级方案已生成：" + diff.length + " 条待确认");
        render();
    } catch (e) {
        prog.acDone("升级失败：" + errBrief(e), 8000);
        msg('失败：' + errBrief(e), 'err');
    }
    if (btn) btn.disabled = false;
}

async function runUpdate() {
    resetLLMCancel();
    const c = state.updateChar;
    if (!c) return;
    const msg = function (t, k) { const m = $('ac-upd-msg'); if (m) { m.textContent = t; m.className = 'ac-msg' + (k ? ' ' + k : ''); } };
    msg('分析中…可能会很慢');
    const btn = $('ac-upd-run'); if (btn) btn.disabled = true;
    const prog = toastProgress('正在更新「' + c.name + '」的设定…');

    try {
        const plan = await generatePlan({
            book: effectiveBook(),
            name: c.name,
            aliases: [],
            idea: settings().idea,
            source: 'chat',
            existing: c.entries,
        });
        const next = planToEntries(plan);

        // 逐条对比
        const diff = [];
        for (const e of next) {
            const old = c.entries.find(function (x) { return x.comment === e.comment; });
            diff.push({
                comment: e.comment,
                edited: old ? isHandEdited(effectiveBook(), e.comment, old.content) : false,
                old: old ? old.content : '',
                neu: e.content,
                keys: e.keys,
                oldLen: old ? old.content.length : 0,
                newLen: e.content.length,
                take: true,
            });
        }
        state.updatePlan = plan;
        state.updateDiff = diff;
        prog.acDone('分析完成：' + diff.length + ' 条待确认');
        render();
    } catch (e) {
        prog.acDone('更新失败：' + errBrief(e), 8000);
        msg('失败：' + errBrief(e), 'err');
        if (btn) btn.disabled = false;
    }
}

async function applyUpdate() {
    const book = effectiveBook();
    const plan = state.updatePlan;
    if (!plan || !state.updateDiff) return;
    const msg = function (t, k) { const m = $('ac-upd-msg2'); if (m) { m.textContent = t; m.className = 'ac-msg' + (k ? ' ' + k : ''); } };

    const take = state.updateDiff.filter(function (d) { return d.take; });
    if (!take.length) return msg('没有勾选任何条目', 'err');

    const prog = toastProgress('正在应用更新…');
    try {
        // 只保留勾选的条目
        const full = planToEntries(plan);
        const keep = full.filter(function (e) {
            return take.some(function (d) { return d.comment === e.comment; });
        });
        const r = await writePlan(book, { ...plan, _only: keep });
        prog.acDone('更新完毕：新增 ' + r.added + ' · 更新 ' + r.updated);
        if (r.edited && r.edited.length) toast('注意：' + r.edited.length + ' 条是你手改过的，已被新版覆盖：' + r.edited.join('、') + '（可去「备份」页撤销）', null, 12000);
        state.updateDiff = null;
        state.updatePlan = null;
        render();
    } catch (e) {
        prog.acDone('应用失败：' + errBrief(e), 8000);
        msg('失败：' + errBrief(e), 'err');
    }
}
// 出场导演：每轮生成前算出该让谁出场，只注入一小段提示
// ═══════════════════════════════════════════════════════════
const DIR_KEY = 'AC-DIRECTOR';

// 当前聊天的出场记录 { 名字: 最后出现楼层 }
// 导演自己的运行状态（按聊天分）：上次安排在第几楼
function dirMeta() {
    const s = settings();
    s.dirMeta = s.dirMeta || {};
    const k = chatKey();
    return s.dirMeta[k] || (s.dirMeta[k] = {});
}
function dirLog() {
    const s = settings();
    s.dirLog = s.dirLog || {};
    const k = chatKey();
    return s.dirLog[k] || (s.dirLog[k] = {});
}

// ═══════════════════════════════════════════════════════════
// LLM 扫世界书：让它判断哪些条目属于同一个人物
// ═══════════════════════════════════════════════════════════
const SCAN_PROMPT = "你是一个精确的视觉小说/RPG角色实体提取引擎。你的任务是从给定的世界书条目列表中，识别出可用于绑定立绘和对话说话人的【具体人物角色】。\n\n【第一步：先给每个条目分类】entryType 只能是：\n- CHARACTER_PROFILE：独立人物设定卡（人设/角色/NPC 条目，描述某个具体人物）\n- CHARACTER_ATTRIBUTE：人物的局部设定（服装、外貌、台词、性格、身体、关系等拆分项）\n- EVENT_NODE：剧情节点/事件/动作（如 节点1·房租交涉、第一次、每月固定关系）\n- LORE_RULE：世界观/规则/设定/指南\n- LOCATION：地点/建筑/场景（玄关、客厅、卧室、海边）\n- SYSTEM_DATA：数据表/状态栏/TavernDB/纪要/索引\n\n【第二步：只提取 CHARACTER_PROFILE】严禁把以下当人物：时间/频率词（第一次、每月）、地点词（玄关、客厅）、事件动作词（交涉、交易、接吻）、身体物品词（眼镜、泳装、房租）、剧情节点（节点N、第N册）、属性拆分项（服装与外貌细节、台词与动作准则）。\n\n【字段规范】\n- name：人物核心名（2~4个汉字，英文≤12字符），去掉编号/前缀/括号内系统标记；若格式为「管理员（玩家）」这种称谓+真名，name 填真名\n- role：身份或与主角的关系（2~15字，未知填「未知身份」）\n- entries：该人物对应的原始条目标题数组，必须与输入清单逐字完全一致\n\n【输出格式】只输出一行紧凑 JSON，不要 Markdown 代码块、不要解释：\n{\"analysis\":[{\"title\":\"节点2·第一次三发抵账\",\"entryType\":\"EVENT_NODE\",\"reason\":\"剧情事件节点\"}],\"characters\":[{\"name\":\"角色甲\",\"role\":\"人妻住户\",\"entries\":[\"人设·角色甲（{{char}}）\"]}]}\n若没有任何人物，输出 {\"analysis\":[],\"characters\":[]}。";

// 用条目清单算个指纹，内容变了才需要重扫
function scanHash(vals) {
    const s2 = vals.map(function (e) { return String(e.comment || ''); }).sort().join('|');
    let h = 5381;
    for (let i = 0; i < s2.length; i++) h = ((h << 5) + h + s2.charCodeAt(i)) | 0;
    return String(h) + ':' + String(s2.length);
}

// 调 LLM 扫一遍
async function llmScanCharacters(force) {
    const book = effectiveBook();
    if (!book) throw new Error('先选目标世界书');

    const data = await getBook(book);
    const vals = Object.values(data.entries || {});
    const hash = scanHash(vals);

    const s = settings();
    s.dirScan = s.dirScan || {};
    const cached = s.dirScan[book];
    if (!force && cached && cached.hash === hash && (cached.chars || []).length) {
        return { cached: true, chars: cached.chars };
    }

    // 精简清单：条目名 + 关键词（控制在约 8000 字以内）
    const lines = [];
    let total = 0;
    for (const e of vals) {
        const c = String(e.comment || '');
        if (/^(TavernDB|ACU-)/i.test(c)) continue;
        const ks = (e.key || []).slice(0, 4).join(',');
        const snip = String(e.content || '').replace(/\s+/g, ' ').slice(0, 120);
        const line = '- 标题：' + c + (ks ? ' | keys: ' + ks : '') + (snip ? ' | 片段：' + snip : '');
        if (total + line.length > 8000) break;
        lines.push(line);
        total += line.length;
    }
    if (!lines.length) throw new Error('这本书没有可分析的条目');

    const prompt = SCAN_PROMPT + String.fromCharCode(10, 10) + '【条目清单】' + String.fromCharCode(10) + lines.join(String.fromCharCode(10));

    const raw = await callLLM(prompt);
    const j = parseLoose(raw);
    const chars = ((j && j.characters) || [])
        .filter(function (x) { return x && (x.name || x.primaryName); })
        .map(function (x) { return { name: String(x.name || x.primaryName || '').trim(), role: String(x.role || '').trim(), entries: Array.isArray(x.entries) ? x.entries.map(String) : [] }; })
        .filter(function (x) { return x.name && x.name.length <= 10; })
        .filter(function (x) { return !junkPersonName(x.name); })
        .map(function (x) {
            return {
                name: x.name,
                role: String(x.role || '').trim(),
                entries: Array.isArray(x.entries) ? x.entries.map(String) : [],
            };
        });

    s.dirScan[book] = { hash: hash, at: Date.now(), chars: chars };
    persist();
    return { cached: false, chars: chars, scanned: lines.length };
}
// 从世界书里抽出每个角色的场景词和出现方式（缓存用，异步）
async function refreshDirCache(forBook) {
    const book = forBook || effectiveBook();
    if (!book) { state.dirCache = null; return null; }
    const data = await getBook(book);
    const vals = Object.values(data.entries || {});
    const tl = vals.find(function (e) { return String(e.comment) === clean(settings().timelineEntry || '行动路线'); });

    const chars = [];
    // 名字清洗：去掉【新】、（人设核心）、-猫妖 这类装饰
    const cleanName = function (x) {
        let s2 = String(x == null ? "" : x).replace(/【[^】]*】/g, "").replace(/\([^)]*\)/g, "").replace(/（[^）]*）/g, "");
        s2 = s2.trim();
        for (let k = 0; k < 5; k++) {
            const s3 = s2.replace(/[\s_\-—·]+$/, "").replace(/[\s_\-—·]*(人设核心|人设|核心设定|核心|身体设定|身体|瑟瑟设定|瑟瑟|语料|可选|设定|档案|新)$/g, "").trim();
            if (s3 === s2) break;
            s2 = s3;
        }
        if (!s2 || s2.length > 8) return "";
        if (/设定|档案|表格|规则|关系|其他|NPC|说明|用法|索引|介入|在场|时段|族|表$|性癖|身体|可编辑|格式|记录|规范/.test(s2)) return "";
        return s2;
    };

    // 可信度：3 = 角色卡 / 手动填的，2 = 行动路线，1 = 从条目名猜的
    const namePri = new Map();
    const markerNames = new Set();
    const addName = function (raw, pri) {
        let nm0 = cleanPersonName(cleanName(raw));
        if (!nm0) return;
        if (/^(TavernDB|ACU-)/i.test(nm0)) return;
        // 「师尊额外设定 / 示例书-BASE / 示例角色一-师伯」——先摘掉尾巴再取主名
        nm0 = nm0.replace(/(额外设定|额外|补充设定|补充|附加设定|设定|底子|基础|模板)$/, "").trim();
        nm0 = nm0.replace(/[-_—·].*$/, "").trim();
        if (!nm0) return;
        if (junkPersonName(nm0)) return;
        if (nm0.length < 2 || nm0.length > 8) return;
        const cur = namePri.get(nm0);
        if (cur === undefined || pri > cur) namePri.set(nm0, pri);
    };

    let rosterFound = false;
    // 最高可信（5）：LLM 扫过的结果
    const scanned = (settings().dirScan || {})[book];
    const llmNames = new Map();
    if (scanned && (scanned.chars || []).length) {
        for (const c0 of scanned.chars) {
            const nm5 = cleanName(c0.name);
            if (!nm5) continue;
            addName(nm5, 5);
            llmNames.set(nm5, c0);
        }
    }

    // 最高可信：从「人物关系速览」这类总表里读名字（比猜条目名可靠得多）
    const ROSTER_NAMES = ['人物关系速览', '人物关系', '角色速览', '人物速览', '角色关系速览'];
    for (const rn of ROSTER_NAMES) {
        const re0 = vals.find(function (e) { return String(e.comment) === rn; });
        if (!re0) continue;
        rosterFound = true;
        const body0 = String(re0.content || '');
        // 只取【关系网】之前的部分（那是成对关系，不是名单）
        const cut0 = body0.indexOf('【关系网');
        const roster = cut0 > 0 ? body0.slice(0, cut0) : body0;
        for (const line of roster.split('\n')) {
            const m0 = line.match(/^\s*([^\s:：<>\[\]{}]{2,10})\s*[:：]\s*\S/);
            if (!m0) continue;
            const nm0 = m0[1].trim();
            if (!nm0 || /\{\{|^用户|主角|旁白/.test(nm0)) continue;
            addName(nm0, 4);
        }
        console.log('[命运织机] 从「' + rn + '」读到 ' + namePri.size + ' 个名字');
    }

    let chatText0 = '';
    try {
        chatText0 = (live().chat || []).slice(-80).map(function (m) { return String(m.mes || ''); }).join('\n');
    } catch (e) { /* ignore */ }

    // P0：结构化「重要角色表 / 人物关系速览」= 名单 ground truth（Gemini 评审建议）
    const rosterNames = [];
    try {
        for (const e0 of vals) {
            const c0 = String(e0.comment || '');
            if (!/重要角色表|角色表|人物关系速览|人物表|角色速览|人物关系/.test(c0)) continue;
            const body0 = String(e0.content || '');
            for (const line0 of body0.split('\n')) {
                const cells0 = line0.split('|').map(function (x) { return x.trim(); });
                if (cells0.length < 2) continue;
                for (const cell of cells0) {
                    const nmr = String(cell || '').trim();
                    if (!nmr || /^(姓名|角色|名字|人物|关系|备注|性别|年龄|介绍)$/.test(nmr)) continue;
                    if (/^[-:]+$/.test(nmr)) continue;
                    if (!/^[\u4e00-\u9fa5A-Za-z]{2,4}$/.test(nmr)) continue;
                    if (junkPersonName(nmr)) continue;
                    if (rosterNames.indexOf(nmr) < 0) rosterNames.push(nmr);
                }
                const kv0 = line0.match(/(?:姓名|名字|本名|角色名)\s*[：:]\s*([^\s（(，,。；;|]{1,8})/);
                if (kv0 && !junkPersonName(kv0[1]) && rosterNames.indexOf(kv0[1]) < 0) rosterNames.push(kv0[1]);
            }
        }
    } catch (e0) { /* ignore */ }
    // P0.1：表格名单常常不全，把「人物关系速览」里逐行「名字: 描述」的名字也并入（Gemini 评审建议：并集而不是交集）
    try {
        for (const rn of ROSTER_NAMES) {
            const re1 = vals.find(function (e) { return String(e.comment) === rn; });
            if (!re1) continue;
            const body1 = String(re1.content || '');
            const cut1 = body1.indexOf('【关系网');
            const rosterTxt = cut1 > 0 ? body1.slice(0, cut1) : body1;
            for (const line1 of rosterTxt.split('\n')) {
                const m1 = line1.match(/^\s*[-*•]?\s*([\u4e00-\u9fa5A-Za-z·]{2,10})\s*[:：]\s*\S+$/);
                if (!m1) continue;
                const nmr = m1[1].trim();
                if (/\{\{|用户|主角|旁白|系统|注意|说明|背景|地点|时间|规则|备注|总结|当前|关系网/.test(nmr)) continue;
                if (/^(TavernDB|ACU-)/i.test(nmr)) continue;
                if (junkPersonName(nmr)) continue;
                if (rosterNames.indexOf(nmr) < 0) rosterNames.push(nmr);
            }
        }
    } catch (e1) { /* ignore */ }

    for (const e of vals) {
        const c = String(e.comment || "");
        if (/^(TavernDB|ACU-)/i.test(c)) continue;
        // P0.5：分类前缀黑名单 —— 世界观/节点/关系逻辑/表达方式/服装…这些条目永远不是人物卡
        if (/^(?:世界观|节点|关系逻辑|表达方式|系统|规则|指南|剧情|背景|地点|场景|物品|事件|阶段|主线|支线|附录|状态栏|服装|说话|纪要|索引|数据表|人物变化记录|重要角色表)/.test(c)) continue;
        // ⓪ 「人设·角色甲（{{char}}）」/「人物·X（{{user}}）」/「角色·X」这类条目名
        const pr0 = c.match(/^(?:人设|人物|角色|npc|nsfw档案|角色卡|身体与性癖)\s*[·・\-—_：:]\s*([\u4e00-\u9fa5A-Za-z]{2,6})\s*(?:[（(]([^）)]{1,20})[)）])?/i);
        if (pr0) {
            let nmx = String(pr0[1] || '').trim();
            const inside0 = String(pr0[2] || '').trim();
            const isSys = /sillytavern|system|\{\{|user|char|bot|ai|默认|系统|主角|玩家|备注/i.test(inside0);
            const isRoleTitle = /^(管理员|房东|店长|老板|老师|医生|警察|上司|主人|先生|小姐|太太|夫人|妻子|丈夫|父亲|母亲|哥哥|姐姐|弟弟|妹妹|师傅|师父|前辈|后辈|会长|部长|社长|经理|管家|女仆|服务员|客人|住户|房客|邻居|少年|少女)$/.test(nmx);
            if (!isSys && isRoleTitle && /^[\u4e00-\u9fa5]{2,4}$/.test(inside0) && !junkPersonName(inside0)) nmx = inside0;
            let pri0 = 4;
            try {
                const ks0 = (e.key || []).map(String);
                const inKey = ks0.some(function (k) { return k === nmx || k.indexOf(nmx) >= 0; });
                const ct0 = String(e.content || '').slice(0, 300);
                const kvx = ct0.indexOf('姓名：' + nmx) >= 0 || ct0.indexOf('本名：' + nmx) >= 0 || ct0.indexOf('名字：' + nmx) >= 0;
                if (!inKey && !kvx && !e.constant) pri0 = 2;
            } catch (e2) { /* ignore */ }
            if (!/^(管理员|主角|玩家|旁白|系统|用户|user|npc)$/i.test(nmx)) addName(nmx, pri0);
            continue;
        }
        // ① 「名字（备注）」—— 最常见的写法：苏芊语（母亲）/ 顾婉清（青梅）/ 凌晓（小混混）
        const pr = c.match(/^\s*([\u4e00-\u9fa5A-Za-z]{2,4})\s*[（(]\s*([^）)]{1,10})\s*[)）]\s*$/);
        if (pr) {
            const NOISE = /世界观|背景|体态|体型|文风|判断|设定|规则|说明|系统|地图|地理|时间|关系|概要|简介|总结|提示|格式|顺序|插入|深度|概率|语料|其他|备注|序章|开场|结局|尺寸|参数|选项|状态|数值|衣着|穿着|样例|示例|模板|参考|插图|状态栏|列表|额外|权限|正文|美化|纯文字|加强版|吐槽|速览|附录|玩法|机制|教程|帮助|交易|房租|租金|契约|金额|价格|费用|房费|还款|债务|买卖|服务|人设|人物|角色|NPC|服装|服饰|外貌|长相|台词|语气|口癖|动作|行为|表达|方式|主线|支线|节点|剧情|故事|场景|地点|物品|道具|称呼|名字|能力|技能|习惯|态度|心理|秘密|身份|经历|过去|目标|目的|计划|约定|规则|关系|背景|设定|状态|数据|信息|提示|选项|表格/i;
            if (!NOISE.test(pr[1]) && !NOISE.test(pr[2])) { addName(pr[1], 3); markerNames.add(pr[1]); continue; }
        }
        // ② 显式标记：角色寅-猫妖-（人设核心） / 角色壬 人设核心 / 角色己（身体设定）
        const mk = c.match(/^\s*(.+?)[\s_\-—·（(【\[]*(人设核心|人设|身体设定|身体|瑟瑟设定|瑟瑟|性癖|NSFW)/i);
        if (mk) {
            const head0 = mk[1].split(/[_\-—·]/)[0].trim();
            if (head0 && head0.length >= 2 && head0.length <= 8) { addName(head0, 4); markerNames.add(head0); continue; }
        }
        // ③ 插件自己的规范命名
        let m = c.match(/^(?:角色卡|身体与性癖|身体与性|身体配置|性癖档案|NSFW档案)\s*[:：]?\s*(.+)$/);
        if (m) { addName(m[1], 3); continue; }
        m = c.match(/^(.+?)[_\-—]?(?:行为落地指南|出场时机|介入机会)$/);
        if (m) { addName(m[1], 2); continue; }
        // P2：正文开头的「姓名：X / 本名：X」结构化字段
        try {
            const ct2 = String(e.content || '').slice(0, 200);
            const kv2 = ct2.match(/(?:^|\n)\s*(?:[-*•]\s*)?(?:姓名|名字|本名|角色名|Name)\s*[：:]\s*([^\n（(，,。；;\s]{1,8})/);
            if (kv2 && !junkPersonName(kv2[1].trim())) addName(kv2[1].trim(), 3);
        } catch (e2) { /* ignore */ }
        if (/人设|核心|设定/.test(c)) addName(c.split(/[_\-—（(【[]/)[0], 1);
        // ⑦ 兜底：示例角色一-师伯 / 示例角色二-闺蜜 / 示例角色六-地灵 这种「名字-身份」
        //    取分隔符前面那段当人名（「闺蜜」「师伯」「地灵」是身份不是名字）
        const cs = cleanPersonName(c);
        const segs = cs.split(/[-_—·]/).map(function (x) { return x.trim(); }).filter(Boolean);
        if (segs.length >= 2 && /^[\u4e00-\u9fa5]{2,5}$/.test(segs[0]) && !junkPersonName(segs[0])) {
            addName(segs[0], 1);
            continue;
        }
        // ⑧ 再兜底：条目自己的关键词第一个（示例角色一 / 示例角色二 / 示例角色三 / 示例角色六）
        //    只认「出现在条目名里」的关键词，否则会把 尾巴 / 敏感度 这种也当成人名
        const kk = (e.key || []).map(String).filter(function (x) {
            return x && !junkPersonName(x) && cs.indexOf(x) >= 0 && chatText0.indexOf(x) >= 0;
        });
        if (kk.length && /^[\u4e00-\u9fa5]{2,4}$/.test(kk[0])) addName(kk[0], 1);
    }

    if (tl) {
        const entryNames = new Set(namePri.keys());
        let chatText = '';
        try {
            chatText = (live().chat || []).slice(-60).map(function (m) { return String(m.mes || ''); }).join('\n');
        } catch (e) { /* ignore */ }
        const body0 = String(tl.content || "");
        for (const m0 of body0.matchAll(/(?:◇|【)\s*([^\s—】]+)/g)) {
            const nmTl = String(m0[1] || '').trim();
            if (!nmTl) continue;
            // 行动路线里的小节名（伴手礼/海边/交涉…）不是人名：
            // 只接受「条目里已经认出的名字」或「最近聊天里真的出现过」的名字
            if (!entryNames.has(nmTl) && chatText.indexOf(nmTl) < 0) continue;
            addName(nmTl, 2);
        }
    }

    for (const x of (settings().directorCharsExtra || [])) addName(x, 3);

    // 去重：一个名字包含另一个时只留一个，优先可信度高、更长的
    const sortedNames = [...namePri.entries()].sort(function (a, b) {
        return (b[1] - a[1]) || (b[0].length - a[0].length);
    });
    const keptNames = [];
    for (const pair of sortedNames) {
        const nm9 = pair[0];
        let dup = false;
        for (const k of keptNames) {
            if (k === nm9 || k.indexOf(nm9) >= 0 || nm9.indexOf(k) >= 0) { dup = true; break; }
        }
        if (!dup) keptNames.push(nm9);
    }
    // P0：有「重要角色表/人物关系速览」名单时，以名单为准（表里没有的条目名不算人物）
    let finalNames = keptNames;
    if (rosterNames.length >= 2) {
        let extra = [];
        try { extra = (settings().directorCharsExtra || []).map(String); } catch (e0) { /* ignore */ }
        finalNames = keptNames.filter(function (n) {
            if (extra.indexOf(n) >= 0) return true;
            return rosterNames.some(function (r) { return r === n || n.indexOf(r) >= 0 || r.indexOf(n) >= 0; });
        });
        if (!finalNames.length) finalNames = keptNames;
    }
    const names = new Set(finalNames);
    // 这个名字是从哪儿认出来的（显示在界面上，方便判断该不该勾）
    const srcOf = function (n) {
        if (llmNames.get(n)) return 'LLM';
        if ((settings().directorCharsExtra || []).indexOf(n) >= 0) return '手动';
        if (vals.some(function (e) { return String(e.comment) === '角色卡 ' + n || String(e.comment) === 'NSFW档案 ' + n || String(e.comment) === '身体与性癖 ' + n; })) return '角色卡';
        if (markerNames.has(n)) return '条目名';
        if (namePri.get(n) === 4) return '关系速览';
        if (namePri.get(n) === 2) return '行动路线';
        return '条目名';
    };
    for (const n of names) {
        let scenes = [];
        let hint = '';
        const hooks = [];
        if (tl) {
            const body = String(tl.content || '');
            // 找她的段落
            let at = body.indexOf('【' + n + ' 介入机会】');
            let seg = '';
            if (at >= 0) {
                const nxt = body.indexOf('\n【', at + 1);
                seg = body.slice(at, nxt >= 0 ? nxt : body.length);
            } else {
                at = body.indexOf('◇ ' + n);
                if (at >= 0) {
                    const nxt = body.indexOf('\n    ◇', at + 1);
                    seg = body.slice(at, nxt >= 0 ? nxt : body.length);
                }
            }
            if (seg) {
                for (const line of seg.split('\n')) {
                    const arrow = line.indexOf('→');
                    if (arrow > 0) {
                        const left = line.slice(0, arrow).replace(/^[\s\-·0-9.、]+/, '').trim();
                        if (left) {
                            for (const w of left.split(/[\/／、,，]/)) {
                                let t2 = w.trim();
                                // 去掉开头的动词/助词，只留名词性场景
                                t2 = t2.replace(/^(进|去|到|在|开|翻|提|有人|和|他|被|遇|经过|路过|涉及|来到|回到)+/, '');
                                t2 = t2.replace(/(的时候|时|了)$/, '');
                                if (t2 && t2.length >= 2 && t2.length <= 6) scenes.push(t2);
                            }
                        }
                        const howTxt = line.slice(arrow + 1).replace(/^\s*[-·]?\s*/, '').trim();
                        if (howTxt) hooks.push({ signal: left || '', how: howTxt });
                        if (!hint && howTxt) hint = howTxt;
                    }
                    const m2 = line.match(/不在场[:：]\s*(.+)$/);
                    if (m2 && !hint) hint = line.trim();
                }
            }
        }
        let presenceText = '';
        if (tl) {
            const mm = String(tl.content || '').match(new RegExp('【' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' 介入机会】[\\s\\S]{0,600}?不在场[:：]\\s*(.+)'));
            if (mm) presenceText = mm[1].trim();
            if (!presenceText) {
                const at2 = String(tl.content || '').indexOf('◇ ' + n);
                if (at2 >= 0) {
                    const seg2 = String(tl.content).slice(at2, at2 + 800);
                    const m3 = seg2.match(/不在场[:：]\s*(.+)/);
                    if (m3) presenceText = m3[1].trim();
                }
            }
        }
        // 收集她所有条目的关键词（用于确保注入的这个词真能触发扫描）
        // 收集她所有条目的关键词（用于确保注入的这个词真能触发扫描）
        // 用和列表页同一套归属判断，不然手写条目（角色丑 / 角色丑性格补充）会一个关键词都收不到
        const myKeys = [];
        const scanHit = llmNames.get(n);
        const scanEntries = scanHit ? (scanHit.entries || []) : [];
        for (const e2 of vals) {
            const c3 = String(e2.comment || "");
            if (!c3 || /^(TavernDB|ACU-)/i.test(c3)) continue;
            if (scanEntries.indexOf(c3) < 0 && !entryBelongsTo(c3, n)) continue;
            for (const k3 of (e2.key || [])) if (k3) myKeys.push(String(k3));
        }
        // 从她的角色卡里读关系：谁认识她、主角认不认识她
        let relList = [];
        let knownToUser = false;
        const cardEnt = vals.find(function (e) { return String(e.comment) === '角色卡 ' + n; });
        if (cardEnt) {
            const ct = String(cardEnt.content || '');
            const ru = ct.match(/与\{\{user\}\}的关系[:：]\s*(.+)/);
            if (ru && !/陌生|不认识|路人|无关|毫无/.test(ru[1])) knownToUser = true;
            const at4 = ct.indexOf('与其他角色的关系');
            if (at4 >= 0) {
                const seg4 = ct.slice(at4, at4 + 500);
                for (const m4 of seg4.matchAll(/\n\s*-\s*([^:\n]{1,10})[:：]/g)) {
                    const nm6 = m4[1].trim();
                    if (nm6 && nm6.length <= 8) relList.push(nm6);
                }
            }
        }
        chars.push({ name: n, scenes: [...new Set(scenes)], hint: hint, presence: presenceText, keys: [...new Set(myKeys)], relations: [...new Set(relList)], knownToUser: knownToUser, source: srcOf(n), hooks: hooks });
    }

    // 读数据库维护的「重要角色表」：谁在场、谁在哪（比数楼层准）
    const dbCast = {};
    let dbPlace = '';
    try {
        // 表头和数据可能分在不同条目里：先全局找一次表头，再按列号解析所有数据行
        const dbEntries = vals.filter(function (e) { return /^TavernDB-ACU-CustomExport-重要角色表/.test(String(e.comment || '')); });
        let iName = 1, iPlace = 6, iPresent = 7, iGender = -1, foundHeader = false;
        for (const e of dbEntries) {
            for (const line of String(e.content || '').split('\n')) {
                const cells = line.split('|').map(function (x) { return x.trim(); });
                const a = cells.indexOf('姓名');
                if (a > 0) {
                    iName = a;
                    const p = cells.findIndex(function (x) { return /所在地点|^地点|位置/.test(x); });
                    const q = cells.findIndex(function (x) { return /在场状态|^在场/.test(x); });
                    const g0 = cells.findIndex(function (x) { return x === '性别' || /^性别/.test(x); });
                    if (p > 0) iPlace = p;
                    if (q > 0) iPresent = q;
                    if (g0 > 0) iGender = g0;
                    foundHeader = true;
                    break;
                }
            }
            if (foundHeader) break;
        }
        for (const e of dbEntries) {
            for (const line of String(e.content || '').split('\n')) {
                const cells = line.split('|').map(function (x) { return x.trim(); });
                if (cells.length <= iName) continue;
                const nm3 = cells[iName];
                if (!nm3 || /^-+$/.test(nm3) || nm3 === '姓名') continue;
                const place = cells[iPlace] || '';
                const pres = cells[iPresent] || '';
                const gv = iGender > 0 ? (cells[iGender] || '') : '';
                // 索引表里只有名字的行不能覆盖已经解析到的详细行
                const prev = dbCast[nm3];
                if (prev && !place && !pres) continue;
                let rels = [];
                for (let ci = 2; ci < cells.length; ci++) {
                    const v2 = cells[ci] || '';
                    if (!/[;；]|:/.test(v2) || v2.length < 3) continue;
                    for (const seg2 of v2.split(/[;；]/)) {
                        const nm4 = segmentName(seg2);
                        if (nm4) rels.push(nm4);
                    }
                }
                dbCast[nm3] = {
                    place: place || (prev ? prev.place : ''),
                    present: pres ? (/在场|在/.test(pres) && !/不在|离场|离|absent/i.test(pres)) : (prev ? prev.present : false),
                    hasPresent: !!pres || (prev ? prev.hasPresent : false),
                    relations: rels.length ? rels : (prev && prev.relations ? prev.relations : []),
                    gender: gv || (prev && prev.gender ? prev.gender : ''),
                };
            }
        }
        const rd = vals.find(function (e) { return String(e.comment) === 'TavernDB-ACU-ReadableDataTable'; });
        if (rd) {
            const rl = String(rd.content || '').split('\n');
            let col = -1;
            for (const line of rl) {
                const cells = line.split('|').map(function (x) { return x.trim(); });
                if (col < 0) {
                    const idx = cells.indexOf('当前详细地点');
                    if (idx > 0) col = idx;
                    continue;
                }
                if (cells.length <= col) continue;
                const v = cells[col];
                if (!v || /^-+$/.test(v)) continue;
                dbPlace = v;
                break;
            }
        }
    } catch (e) {
        console.warn('[命运织机] 数据库表格解析失败（只用本地识别）', e);
    }

    // 数据库里有、我们这边没有的，也要能推荐（否则像角色戊这种人永远出不来）
    const have = new Set(chars.map(function (c) { return c.name; }));
    const npcPool = [];
    for (const n of Object.keys(dbCast)) {
        if (have.has(n)) continue;
        let dup = false;
        for (const h of have) { if (h.indexOf(n) >= 0 || n.indexOf(h) >= 0) { dup = true; break; } }
        if (dup) continue;
        npcPool.push({ name: n, scenes: [], hint: '', dbOnly: true, npc: true, gender: (dbCast[n] && dbCast[n].gender) || '' });
    }
    // 次要 NPC 也全部保留（界面上让用户勾选），只是默认不启用
    chars.push.apply(chars, npcPool);

    // ── 性别 / 玩家角色判定：面板里不显示男性角色和玩家自己 ──
    const uname = (function () { try { return String(live().name1 || '').trim(); } catch (e) { return ''; } })();
    let userNicks = [];
    try {
        const uEnt = vals.find(function (e) { return String(e.comment) === '{{user}}'; });
        if (uEnt) {
            const nb = String(uEnt.content || '').match(/nickname\s*[:：]\s*([^\r\n]+)/);
            if (nb) userNicks = nb[1].split(/[,，、\/\s]+/).map(function (x) { return x.trim(); }).filter(function (x) { return x.length >= 2; });
        }
    } catch (e) { /* ignore */ }
    const guessGender = function (n) {
        const d0 = dbCast[n];
        if (d0 && d0.gender) {
            if (/男/.test(d0.gender)) return '男';
            if (/女/.test(d0.gender)) return '女';
        }
        for (const e of vals) {
            const c0 = String(e.comment || '');
            if (c0 !== '角色卡 ' + n && c0 !== 'NSFW档案 ' + n && c0.indexOf(n) < 0) continue;
            const m0 = String(e.content || '').match(/性别\s*[:：]\s*(男[性]?|女[性]?)/);
            if (m0) return m0[1].charAt(0) === '男' ? '男' : '女';
        }
        return '';
    };
    for (const ch of chars) {
        if (!ch.gender) ch.gender = guessGender(ch.name);
        if ((uname && ch.name === uname) || userNicks.indexOf(ch.name) >= 0) ch.isUser = true;
    }
    // 手动勾选覆盖自动判断；没勾过的按「是不是 NPC」决定
    const picks = settings().directorPick || {};
    for (const ch of chars) {
        ch.enabled = (picks[ch.name] !== undefined) ? !!picks[ch.name] : !ch.npc;
    }

    // 卡片里没写关系的话，用数据库记的关系补上（手写条目常见）
    for (const ch of chars) {
        if ((ch.relations || []).length) continue;
        const nm5 = ch.name;
        let d5 = dbCast[nm5];
        if (!d5) {
            for (const k5 of Object.keys(dbCast)) {
                if (k5 && (k5.indexOf(nm5) >= 0 || nm5.indexOf(k5) >= 0)) { d5 = dbCast[k5]; break; }
            }
        }
        if (d5 && Array.isArray(d5.relations) && d5.relations.length) ch.relations = d5.relations.slice();
    }

    state.dirCache = { book: book, chars: chars, roster: rosterNames, dbCast: dbCast, dbPlace: dbPlace, rosterFound: rosterFound, npcSkipped: 0, noScenes: chars.filter(function (c) { return !(c.scenes || []).length; }).length, at: Date.now() };
    // 自动兜底：一个角色都没认出来，说明命名完全不合规范 —— 让模型读一遍条目
    const sc0 = (settings().dirScan || {})[book];
    const scanHashNow = (function () {
        try { return scanHash(vals); } catch (e) { return ""; }
    })();
    state.autoScanTried = state.autoScanTried || {};
    if (settings().autoScan !== false
        && !state.autoScanTried[scanHashNow]
        && !chars.length
        && !state.autoScanBusy
        && !(state.autoScanFailed && state.autoScanFailed[scanHashNow])
        && String(settings().apiKey || "").trim()
        && !(sc0 && sc0.hash === scanHashNow)) {
        state.autoScanBusy = true;
        state.autoScanTried[scanHashNow] = true;   // 这个版本的书只自动试一次
        console.log("[命运织机] 规则认不出任何角色，自动调用 LLM 扫描…");
        const prog = (typeof toastProgress === "function") ? toastProgress("认不出角色，正在让模型扫一遍这本书…") : null;
        llmScanCharacters(false).then(function () {
            state.autoScanBusy = false;
            if (prog) prog.acDone(toastDeduped('模型扫描完成') ? "模型扫描完成" : "", 1500);
            return refreshDirCache(book);
        }).then(function () {
            try { renderMini(false); } catch (e) {}
            try { if ($("ac-overlay") && $("ac-overlay").style.display !== "none") render(); } catch (e) {}
        }).catch(function (e) {
            state.autoScanBusy = false;
                state.autoScanFailed = state.autoScanFailed || {};
                state.autoScanFailed[scanHashNow] = true;   // 这本书别再自动试了
            if (prog) prog.acDone("自动扫描失败：" + errBrief(e), 8000);
            console.warn("[命运织机] 自动扫描失败", e);
        });
    }
    return state.dirCache;

}

// 首页文本数组
function msgTexts() {
    return (ctx.chat || []).map(function (m) { return String(m && m.mes || ''); });
}

// 算出这一轮该推荐谁（同步，只用缓存）
// 这一轮适不适合插人进来
// 正戏、打斗、情绪高点都不适合 —— 让人凭空出现只会毁气氛
function sceneBusy(text) {
    let t2 = String(text || '');
    if (!t2) return null;
    // 先剥掉元数据段、内心独白、计划段：这些不是「正在发生的事」，
    // 不剥掉会把剧情高潮、内心想法误判成正在做的动作（实测误判过）。
    t2 = t2
        .replace(/<recall>[\s\S]*?<\/recall>/gi, ' ')
        .replace(/<supplement>[\s\S]*?<\/supplement>/gi, ' ')
        .replace(/<report[^>]*>[\s\S]*?<\/report[^>]*>/gi, ' ')
        .replace(/<thought>[\s\S]*?<\/thought>/gi, ' ')
        .replace(/<plan>[\s\S]*?<\/plan>/gi, ' ')
        .replace(/<details[\s\S]*?<\/details>/gi, ' ')
        .replace(/<summary[^>]*>[\s\S]*?<\/summary>/gi, ' ')
        .replace(/<StatusPlaceHolderImpl\s*\/?>/gi, ' ');
    // 强信号：明确的性行为 / 裸露描写。出现 2 个以上，或 1 个很明确的动作词 → 判定为正戏
    const STRONG = /呻吟|娇喘|抽插|抽送|肉棒|肉茎|小穴|菊穴|龟头|阴道|射精|射了|射在|内射|高潮|爱液|蜜液|淫液|赤裸|一丝不挂|全裸|裸体|舌吻|做爱|性交|自慰|口交|乳交|插入|挺进|痉挛|插进|进入了她|进入了他/g;
    const strongHits = t2.match(STRONG) || [];
    if (strongHits.length >= 2) {
        return { level: 'strong', why: '当前在亲密戏里（' + strongHits.slice(0, 3).join('、') + '）' };
    }
    if (strongHits.length === 1 && /插入|插进|做爱|性交|内射|射精|射在|赤裸|全裸|裸体|口交|乳交|自慰/.test(strongHits[0])) {
        return { level: 'strong', why: '当前在亲密戏里（' + strongHits[0] + '）' };
    }
    // 弱信号：只是「可能」，不拦截，交给导演模型/规则判断
    const WEAK = /亲吻|舔|抚摸|顶弄|夹紧|奶子|奶头|乳头|脱掉|解开.{0,4}(扣|衣|带)|滑进|喘|轻颤|湿润|湿透|深处|身下|压上去|压在身上|床单|床上|腰窝|大腿根|咬住.{0,3}(唇|嘴)|咬着.{0,3}唇/g;
    const weakHits = t2.match(WEAK) || [];
    if (weakHits.length >= 3) {
        return { level: 'weak', why: '可能处于亲密场景（' + weakHits.slice(0, 3).join('、') + '）' };
    }
    if (/战斗|打斗|交手|争吵|怒吼|咆哮|危险|鲜血|受伤|追逐|逃亡|尖叫|对峙|拔刀|开枪/.test(t2)) {
        return { level: 'weak', why: '可能有激烈冲突' };
    }
    return null;
}

function directorPick() {
    const cache = state.dirCache;
    if (!cache || !cache.chars || !cache.chars.length) return null;
    const active = cache.chars.filter(function (c) { return c.enabled !== false; });
    if (!active.length) return null;
    const s = settings();
    const texts = msgTexts();
    const n = texts.length;
    if (!n) return null;

    const log = dirLog();
    const dbCast = cache.dbCast || {};
    const dbPlace = String(cache.dbPlace || '').trim();
    // 数据库的表可能只写「角色丙」，而我们叫「妹妹角色」——按包含关系匹配
    const dbOf = function (n) {
        if (dbCast[n]) return dbCast[n];
        for (const k of Object.keys(dbCast)) {
            if (k && (n.indexOf(k) >= 0 || k.indexOf(n) >= 0)) return dbCast[k];
        }
        return null;
    };
    const recent = texts.slice(-3).join('\n');
    const lastMsg = texts.slice(-2).join('\n');   // 场景词只在最近两楼里找，避免拿几楼前的词硬凑
    const PLACE_RX = /厨房|客厅|卧室|浴室|卫生间|澡堂|阳台|玄关|走廊|电梯|楼梯|书房|餐厅|教室|办公室|操场|天台|屋顶|地下室|车库|花园|庭院|便利店|超市|医院|病房|街头|车里|门口|门外/;
    const gapNeed = Math.max(1, Number(s.directorGap) || 8);

    // 玩家明确指定的人（pin / 立刻）不受场景限制 —— 你说了要她上，就让她上
    const playerPicked = (s.directorMode === 'pin' && s.directorPin) || state.forceNext;
    const busyInfo = sceneBusy(texts.slice(-2).join('\n'));
    const busyGuard = String(s.busyGuard || 'strong');
    if (busyInfo && !playerPicked) {
        const intercept = busyGuard !== 'off' && (busyInfo.level === 'strong' || busyGuard === 'strict');
        if (intercept) return { skip: true, why: busyInfo.why + '，这一轮不安排任何人出场' };
        console.log('[命运织机] ' + busyInfo.why + '（弱信号，仅提示，不拦截）');
    } else if (busyInfo && playerPicked) {
        console.log('[命运织机] ' + busyInfo.why + '，但这是你指定的人，照常安排');
    }

    // 每个人：上次出现楼层（从记录里取，没有就从正文里找最后一次提到）
    // 谁此刻在场（数据库的 present 标记）
    const rows0 = active.map(function (c) {
        const d = (function (n) {
            if (dbCast[n]) return dbCast[n];
            for (const k of Object.keys(dbCast)) { if (k && (n.indexOf(k) >= 0 || k.indexOf(n) >= 0)) return dbCast[k]; }
            return null;
        })(c.name);
        return { name: c.name, present: !!(d && d.present) };
    });

    const rows = active.map(function (c) {
        let last = log[c.name] !== undefined ? log[c.name] : -1;
        if (last < 0) {
            for (let i = n - 1; i >= 0; i--) {
                if (texts[i].indexOf(c.name) >= 0) { last = i; break; }
            }
        }
        const never = (last < 0);
        // 从没出场过的人不存在「间隔」概念，一律当作最久没出场（否则短聊天里永远轮不到新人）
        const gap = never ? 9999 : (n - 1 - last);
        const sceneHit = (c.scenes || []).filter(function (w) {
            if (!w || lastMsg.indexOf(w) < 0) return false;            // 只在最后一楼里找
            // 是地点词的话，得和数据库记录的地点对得上（别在电梯里让人从厨房出来）
            if (PLACE_RX.test(w) && dbPlace) {
                const okPlace = dbPlace.indexOf(w) >= 0 || w.indexOf(dbPlace) >= 0;
                if (!okPlace) return false;
            }
            return true;
        });
        // 没有场景词的角色（手写条目常见），退回用她条目的关键词判断
        // 关键词本来就带上下文意味（补习 / 健身房 / 值班），比什么都不做强
        let kwHit = [];
        if (!sceneHit.length) {
            const kw = (c.keys || []).map(String).filter(function (k) {
                return k && k !== c.name && k.length >= 2 && c.name.indexOf(k) < 0 && k.indexOf(c.name) < 0;
            });
            kwHit = kw.filter(function (k) { return recent.indexOf(k) >= 0; });
        }
        // 认识的人此刻在场 —— 这本身就是一条介入线索：她可能来找人，别人也可能提起她
        const myRel = (c.relations || []).map(String).filter(function (x) { return x && x.length >= 2; });
        const relHit = myRel.filter(function (x) {
            return rows0.some(function (r) { return r.present; }) && rows0.some(function (r) {
                return r.present && (r.name === x || r.name.indexOf(x) >= 0 || x.indexOf(r.name) >= 0);
            });
        });
        const hit = sceneHit.length ? sceneHit : kwHit;
        // 多个介入方式时，挑信号和当前命中对得上的那条，避免每次都同一句
        let goodHint = c.hint || '';
        const hs = c.hooks || [];
        if (hs.length > 1) {
            const words = (sceneHit.concat(kwHit).concat(hit)).map(String);
            const hitHook = hs.find(function (x) {
                const sig = String(x.signal || '');
                return sig && words.some(function (w) { return w && (sig.indexOf(w) >= 0 || w.indexOf(sig) >= 0); });
            });
            goodHint = (hitHook && hitHook.how) || (hs[0] && hs[0].how) || goodHint;
        }
        return { name: c.name, hint: goodHint, gap: gap, last: last, never: never, hit: hit, scenes: c.scenes || [], kwHit: kwHit, relHit: relHit, hookCount: hs.length };
    });

    // 数据库说他在场的，直接从候选里剔除（他已经在这个画面里了）
    const inScene = rows.filter(function (r) { const d = dbOf(r.name); return d && d.present; }).map(function (r) { return r.name; });
    const eligible0 = rows.filter(function (r) { return !inScene.includes(r.name); });
    const eligible = eligible0.filter(function (r) { return r.gap >= gapNeed; });
    // 严格按间隔门槛：没到门槛的人一律不进候选（否则刚出现过的人会被反复推荐）
    const pool = eligible;
    if (!pool.length) {
        return { skip: true, why: '所有人都在间隔门槛内（' + gapNeed + ' 楼），这一轮不推荐', all: rows };
    }

    // 指定角色：你选的人优先（点过「立刻」就跳过节流）
    if (s.directorMode === 'pin' && s.directorPin) {
        const pinName = String(s.directorPin);
        const force = (state.forceNext && state.forceNext === pinName)
            ? rows.filter(function (r) { return !inScene.includes(r.name); })
            : pool;
        const pinned = force.find(function (r) {
            return r.name === pinName || r.name.indexOf(pinName) >= 0 || pinName.indexOf(r.name) >= 0;
        });
        if (pinned) {
            pinned.strength = 'strong';
            pinned.forced = true;          // 玩家指定的人：注入里带「必须出现」
            if (state.forceNext === pinName) state.forceNext = '';
            if (state.forceNext === pinName) { state.forceNext = ''; pinned.forced = true; }
            return { pick: pinned, all: rows, byMode: 'pin' };
        }
    }

    // 轮流出场：谁最久没出现就推谁。不看关键词、不看场景词 ——
    // 「阿姨」会命中「白阿姨」这种误判，按词匹配本身不可靠，索性不用。
    const sorted = pool.slice().sort(function (x, y) { return y.gap - x.gap; });
    const pick = sorted[0];
    pick.strength = 'strong';
    return { pick: pick, all: rows, byMode: 'rotate' };
}

// 生成注入文本
function directorText(res) {
    if (!res || !res.pick) return '';
    const p = res.pick;
    const L = [];
    L.push((p.strength === 'strong' ? '[出场提示 · 请安排]' : '[出场提示]') + ' ' + p.name);
    L.push((p.never || p.gap >= 9000) ? '她还从没在这个聊天里出现过。' : ('她已经 ' + p.gap + ' 楼没出现了。'));
    // 不规定她怎么进场 —— 她的人设会随关键词一起被带进来，由模型自己写
    if (p.strength === 'middle') {
        L.push('她已经很久没露面了，这一轮可以让她出现 —— 具体怎么进场，按她的人设和你这一段的行文写。');
        L.push('如果实在接不上，就跳过本提示。');
    } else if (p.strength === 'strong') {
        L.push('这一轮请让她出现在这一段里。她怎么出场、先做了什么、说了什么，按她的人设和你这一段的行文自然写，不要照搬任何固定句式。');
        if (p.forced) {
            // 玩家点名要她上：不管什么场景都得出场，不给退路
            L.push('不管现在是什么场景 —— 哪怕是亲密场面或激烈冲突 —— 都要让她出现在这一段里，自然地加入，不要跳过。');
        } else {
            L.push('如果现在不适合她本人进来（正在亲密、正在打斗、正在情绪爆点），可以退一步：让在场的某个人自然地提她一句，或者出现一件和她有关的东西。一句话带过，别像在念设定。');
            L.push('退不了就跳过本提示，下一轮还有机会。');
        }
        if (p.forced) L.push('本轮回复里必须出现「' + p.name + '」的动作或对话，不能只在旁白里提一下名字。');
    } else {
        L.push('她可以出现在这一段，也可以不出现 —— 你觉得自然就让她进，觉得突兀就忽略本提示。');
        L.push('如果让她出现，怎么进场由你决定。');
    }
    return L.join(String.fromCharCode(10));
}
// 一条「不在场」提示，是否需要有人在场才能成立
// 需要：角色己说「…」、文博抱怨「…」、角色子提起「…」
// 不需要：冰箱里的餐盒、桌上一碗汤、门口的便签、手机上的一条消息
function segmentName(seg) {
    const s2 = String(seg || '').trim();
    const i2 = s2.indexOf(':');
    const i3 = s2.indexOf('：');
    const cut = i2 >= 0 ? i2 : i3;
    const nm = (cut > 0 ? s2.slice(0, cut) : s2).trim();
    return (nm && nm.length <= 8 && !/^[-|\s]*$/.test(nm)) ? nm : '';
}

// ── 正文结尾符号清理（显示层，不改聊天原文）──
// 常见残留：<StatusPlaceHolderImpl/>（状态栏占位符）、']]'、]]>、[] 这类 JSON/脚本碎片
function cleanTextNodeValue(v) {
    let t = String(v || '');
    if (!t) return t;
    const before = t;
    t = t.replace(/<?\/?StatusPlaceHolderImpl[^>]*>?/gi, '');
    try { t = galDecodeEscapes(t); } catch (e) { /* ignore */ }
    // 只含括号/引号/箭头的行（例如 '][]、]]>、[]）
    t = t.replace(/^[ \t]*['"`\[\]()>]{1,8}[ \t]*$/gm, '');
    // 行内残留的 ]]> / ]]>
    t = t.replace(/[ \t]*\]\]>[ \t]*/g, ' ');
    // 结尾空白行收一下
    if (t !== before) t = t.replace(/\n{3,}$/, '\n\n');
    return t;
}

function cleanRenderedMessage(mesEl) {
    if (!mesEl) return;
    try {
        const roots = mesEl.querySelectorAll ? mesEl.querySelectorAll('.mes_text') : [];
        roots.forEach(function (root) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            for (const node of nodes) {
                const nv = node.nodeValue;
                const cleaned = cleanTextNodeValue(nv);
                if (cleaned !== nv) node.nodeValue = cleaned;
            }
        });
    } catch (e) { /* ignore */ }
}

function cleanAllRendered() {
    try { document.querySelectorAll('#chat .mes').forEach(cleanRenderedMessage); } catch (e) { /* ignore */ }
}

function installRenderCleaner() {
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs && evt && evt.MESSAGE_RENDERED) {
            evs.on(evt.MESSAGE_RENDERED, function (mesId) {
                setTimeout(function () {
                    try { cleanRenderedMessage(document.querySelector('.mes[mesid="' + mesId + '"]')); } catch (e) { /* ignore */ }
                    try { vnApply(document.querySelector('.mes[mesid="' + mesId + '"]')); } catch (e) { /* ignore */ }
                    try { galUpdate(); } catch (e) { /* ignore */ }
                    try { galEnsureOpenBtn(); } catch (e) { /* ignore */ }
                }, 30);
            });
        }
        if (evs && evt && evt.MESSAGE_SWIPED) {
            evs.on(evt.MESSAGE_SWIPED, function () {
                setTimeout(function () { try { if (!(state.gal && state.gal.awaiting)) galLoad(); } catch (e) { /* ignore */ } }, 400);
            });
        }
        if (evs && evt && evt.CHAT_CHANGED) {
            evs.on(evt.CHAT_CHANGED, function () {
                state.vnShown = {};
                setTimeout(function () {
                    try {
                        cleanAllRendered();
                        if (!settings().vnMode) return;
                        // 结束聊天 / 回到角色列表：关掉 Galgame，绝不自动弹回来
                        if (!galChatAlive()) {
                            state.gal = null;
                            try { galClose(); } catch (e) { /* ignore */ }
                            try { const b0 = document.getElementById('ac-gal-open'); if (b0) b0.classList.remove('on'); } catch (e) { /* ignore */ }
                            return;
                        }
                        const ck = (function () { try { return chatKey(); } catch (e) { return ''; } })();
                        const st = state.gal;
                        // 同一条聊天内、或正在等 AI 正文 → 只刷新，绝不重置/重开
                        if (st && st.chatKey === ck) {
                            if (!st.awaiting) galLoad();
                            return;
                        }
                        const ov = document.getElementById('ac-gal-overlay');
                        if (ov && ov.classList.contains('on')) {
                            state.gal = null;
                            galLoad();
                        } else {
                            state.gal = null;
                            galOpen();
                        }
                    } catch (e) { /* ignore */ }
                }, 600);
            });
        }
        installVnMode();
        setTimeout(function () { cleanAllRendered(); try { galEnsureOpenBtn(); } catch (e) { /* ignore */ } if (!settings().vnMode) galStopPolling(); }, 2000);
    } catch (e) { console.warn('[命运织机] 渲染清理挂载失败', e); }
}

// ── Galgame 模式：正文逐段点击显示 ──
function ensureVnStyle() {
    if (document.getElementById('ac-vn-style')) return;
    const st = document.createElement('style');
    st.id = 'ac-vn-style';
    st.textContent = [
        '.ac-vn-bar{margin-top:12px;padding:8px 12px;border-radius:8px;background:rgba(120,200,170,.10);border:1px solid rgba(120,200,170,.32);color:#bfe6d5;font-size:12px;cursor:pointer;user-select:none;text-align:center;transition:background .15s}',
        '.ac-vn-bar:hover{background:rgba(120,200,170,.20)}',
        '.ac-vn-bar .all{margin-left:10px;color:#8fd9b6;text-decoration:underline}',
        '.ac-vn-on .mes_text{min-height:40px}',
    ].join('\n');
    document.head.appendChild(st);
}
function vnTextEl(mesEl) { return mesEl ? mesEl.querySelector('.mes_text') : null; }
function vnSegments(mesEl) {
    const t = vnTextEl(mesEl);
    if (!t) return [];
    return Array.from(t.children).filter(function (el) { return !el.classList.contains('ac-vn-bar'); });
}
function isLatestAiMes(mesEl) {
    try {
        if (!mesEl || mesEl.classList.contains('is_user') || mesEl.classList.contains('is_system')) return false;
        const all = Array.from(document.querySelectorAll('#chat .mes'));
        return all.length > 0 && all[all.length - 1] === mesEl;
    } catch (e) { return false; }
}
// 主界面保持酒馆原生渲染：不再在主聊天里逐段折叠（全屏 Galgame 才是 VN 模式）
function vnApply(mesEl) {
    const t = vnTextEl(mesEl);
    if (!t) return;
    try {
        Array.from(t.children).forEach(function (el) {
            if (el.classList.contains('ac-vn-bar')) { el.remove(); return; }
            if (el.style && el.style.display === 'none') el.style.display = '';
        });
        if (mesEl) mesEl.classList.remove('ac-vn-on');
    } catch (e) { /* ignore */ }
}
function vnAdvance(mesEl) {
    // 主界面不再有「点击展开下一段」：保持原生显示
    vnApply(mesEl);
}
function vnRefreshAll() {
    try {
        document.querySelectorAll('#chat .mes').forEach(function (el) { vnApply(el); });
    } catch (e) { /* ignore */ }
}
function installVnMode() {
    try {
        // 主界面保持原生渲染：清掉旧版遗留的逐段折叠 DOM
        vnRefreshAll();
    } catch (e) { console.warn('[命运织机] Galgame 模式挂载失败', e); }
}


// ── Galgame 全屏模式（视觉小说式：底部文字条，逐段点击，结尾推进可点/可输入）──
function galStyle() {
    if (document.getElementById('ac-gal-style')) return;
    const st = document.createElement('style');
    st.id = 'ac-gal-style';
    st.textContent = [
        // ── 浅色系（白 + 浅蓝）Galgame 主题 ──
        '#ac-gal-overlay{position:fixed;inset:0;z-index:100010;background:#eaf3fb;display:none;flex-direction:column;overflow:hidden}',
        '#ac-gal-overlay.on{display:flex}',
        '#ac-gal-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.95;filter:saturate(1.05) brightness(.96) blur(1.2px);transform:scale(1.03)}',
        '#ac-gal-shade{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(circle at 50% 36%,rgba(8,14,26,0) 42%,rgba(8,14,26,.42) 100%),linear-gradient(180deg,rgba(15,23,42,.22) 0%,rgba(15,23,42,0) 22%,rgba(15,23,42,0) 52%,rgba(15,23,42,.46) 100%)}',
        '#ac-gal-top{position:relative;display:flex;align-items:center;gap:10px;padding:10px 16px;color:#334155;font-size:13px;z-index:4;background:rgba(244,248,252,.62);border-bottom:1px solid rgba(255,255,255,.7);backdrop-filter:blur(14px) saturate(150%) brightness(104%);-webkit-backdrop-filter:blur(14px) saturate(150%) brightness(104%)}',
        '#ac-gal-top b{color:#0f3a5c;letter-spacing:.5px}',
        '#ac-gal-top .sp{flex:1 1 auto}',
        '#ac-gal-top button{background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.85);color:#334155;border-radius:999px;padding:5px 13px;font-size:12px;cursor:pointer;box-shadow:0 1px 4px rgba(15,23,42,.08);transition:all .16s ease}',
        '#ac-gal-top button:hover{background:rgba(224,242,254,.92);border-color:#7dd3fc;color:#0284c7;box-shadow:0 2px 8px rgba(2,132,199,.15)}',
        '#ac-gal-main{flex:1 1 auto;display:flex;align-items:flex-end;justify-content:center;padding:0 4vw 3vh;position:relative;z-index:3}',
        '#ac-gal-box{width:min(1120px,92vw);background:linear-gradient(135deg,rgba(252,253,255,.90) 0%,rgba(240,247,255,.87) 100%);border:1px solid rgba(255,255,255,.92);border-radius:16px;box-shadow:0 14px 38px -8px rgba(9,18,36,.32),inset 0 1px 0 0 rgba(255,255,255,.95),0 0 0 1px rgba(148,163,184,.16);padding:18px 30px;color:#1e293b;cursor:pointer;position:relative;min-height:120px;display:flex;flex-direction:column;justify-content:center;backdrop-filter:blur(18px) saturate(150%) brightness(103%);-webkit-backdrop-filter:blur(18px) saturate(150%) brightness(103%);transition:border-color .18s ease,box-shadow .18s ease}',
        '#ac-gal-box:hover{border-color:rgba(56,189,248,.55);box-shadow:0 18px 46px -8px rgba(9,18,36,.34),inset 0 1px 0 0 rgba(255,255,255,1),0 0 0 1px rgba(56,189,248,.25)}',
        '#ac-gal-name{display:inline-flex;align-self:flex-start;font-size:13px;font-weight:600;color:#ffffff;letter-spacing:.06em;margin-bottom:10px;min-height:0;padding:3px 13px;border-radius:999px;background:linear-gradient(135deg,#38bdf8 0%,#0284c7 100%);border:1px solid rgba(255,255,255,.85);box-shadow:0 4px 12px rgba(2,132,199,.25);text-shadow:none}',
        '#ac-gal-name:empty{display:none}',
        '#ac-gal-text{font-size:19px;line-height:1.9;word-break:break-word;color:#1e293b;text-shadow:0 1px 1px rgba(255,255,255,.85)}',
        '#ac-gal-text.ac-gal-in{animation:acGalIn .28s ease-out both}',
        '@keyframes acGalIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
        '#ac-gal-text p{margin:0 0 .55em}',
        '#ac-gal-text p:last-child{margin-bottom:0}',
        '#ac-gal-text h1,#ac-gal-text h2,#ac-gal-text h3{font-size:1.06em;color:#075985;margin:.2em 0 .4em;border:0}',
        '#ac-gal-text details{background:rgba(224,242,254,.55);border:1px solid rgba(186,230,253,.85);border-radius:10px;padding:7px 12px;margin:.45em 0}',
        '#ac-gal-text details summary{cursor:pointer;color:#0369a1;font-size:.92em;font-weight:600}',
        '#ac-gal-text em{color:#52657c}',
        '#ac-gal-text strong{color:#0c2a43}',
        '#ac-gal-text hr{display:none}',
        '#ac-gal-text code{background:rgba(2,132,199,.08);border-radius:4px;padding:0 4px;color:#0369a1}',
        '#ac-gal-text .ac-tw{visibility:hidden}',
        '#ac-gal-text .ac-tw.on{visibility:visible}',
        '#ac-gal-text .ac-gal-dlg{color:#c23a78;font-weight:500}',
        '#ac-gal-text.ac-gal-sfx{text-align:center;font-size:15px;font-style:italic;color:#7f9cb5;letter-spacing:.06em;line-height:1.9;opacity:.92;font-weight:400}',
        '#ac-gal-text.ac-gal-sfx-4{font-size:13px;color:#94a9c4;opacity:.88}',
        '#ac-gal-text .ac-gal-dlg2{color:#0284c7}',
        '#ac-gal-text details em{color:#52657c;opacity:.95}',
        '#ac-gal-hint{margin-top:12px;font-size:12px;color:rgba(2,132,199,.85);text-align:right;text-shadow:0 0 10px rgba(56,189,248,.30)}',
        '#ac-gal-hint.busy{color:#0284c7;text-shadow:0 0 12px rgba(56,189,248,.45);animation:acGalBlink 2s ease-in-out infinite}',
        '@keyframes acGalBlink{0%,100%{opacity:1}50%{opacity:.5}}',
        '#ac-gal-choice{margin-top:12px;display:none;gap:10px;flex-direction:column}',
        '#ac-gal-choice.on{display:flex}',
        '#ac-gal-choice button:disabled{opacity:.5;cursor:default;filter:grayscale(.35)}',
        '#ac-gal-choice button{background:rgba(248,251,255,.88);border:1px solid rgba(186,230,253,.95);color:#1e293b;border-radius:12px;padding:12px 16px;font-size:15px;line-height:1.6;text-align:left;cursor:pointer;box-shadow:0 4px 16px rgba(15,23,42,.12);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:all .16s ease}',
        '#ac-gal-choice button:hover{background:linear-gradient(90deg,rgba(224,242,254,.98) 0%,rgba(240,249,255,.98) 100%);border-color:#38bdf8;color:#0369a1;transform:translateY(-2px);box-shadow:0 8px 24px rgba(56,189,248,.28)}',
        '#ac-gal-input{display:flex;gap:8px;margin-top:10px;display:none}',
        '#ac-gal-input.on{display:flex}',
        '#ac-gal-input input{flex:1 1 auto;background:rgba(255,255,255,.78);border:1px solid rgba(203,213,225,.9);color:#1e293b;border-radius:10px;padding:10px 13px;font-size:14px;outline:none;box-shadow:inset 0 2px 4px rgba(15,23,42,.04);transition:border-color .16s ease,box-shadow .16s ease}',
        '#ac-gal-input input::placeholder{color:#94a3b8}',
        '#ac-gal-input input:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.18),inset 0 2px 4px rgba(15,23,42,.04)}',
        '#ac-gal-input button{background:linear-gradient(135deg,#38bdf8 0%,#0284c7 100%);border:none;color:#ffffff;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(2,132,199,.28);transition:all .16s ease}',
        '#ac-gal-input button:hover{filter:brightness(1.06);box-shadow:0 6px 18px rgba(2,132,199,.36)}',
        '#ac-gal-open{position:fixed;left:18px;bottom:66px;z-index:99999;display:none;background:rgba(250,253,255,.92);border:1px solid rgba(56,189,248,.55);color:#0369a1;border-radius:999px;padding:7px 15px;font-size:12px;cursor:pointer;box-shadow:0 6px 18px rgba(15,23,42,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
        '#ac-gal-open.on{display:block}',
        '#ac-gal-open:hover{background:#e0f2fe;border-color:#38bdf8;box-shadow:0 8px 22px rgba(56,189,248,.28)}',
        '#ac-gal-backlog{position:absolute;inset:0;z-index:8;background:rgba(241,246,252,.82);display:none;flex-direction:column;padding:18px 6vw 28px;backdrop-filter:blur(24px) saturate(140%);-webkit-backdrop-filter:blur(24px) saturate(140%)}',
        '#ac-gal-backlog.on{display:flex}',
        '#ac-gal-backlog .hd{display:flex;align-items:center;gap:10px;color:#334155;font-size:14px;margin-bottom:10px}',
        '#ac-gal-backlog .hd b{color:#0f3a5c}',
        '#ac-gal-backlog .hd .sp{flex:1 1 auto}',
        '#ac-gal-backlog .hd button{background:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.9);color:#334155;border-radius:999px;padding:5px 13px;font-size:12px;cursor:pointer}',
        '#ac-gal-backlog .hd button:hover{background:#e0f2fe;border-color:#7dd3fc;color:#0284c7}',
        '#ac-gal-backlog-list{flex:1 1 auto;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:6px}',
        '#ac-gal-backlog .bi{background:rgba(255,255,255,.76);border:1px solid rgba(255,255,255,.92);border-radius:12px;padding:10px 14px;color:#334155;font-size:14px;line-height:1.7;cursor:pointer;box-shadow:0 4px 20px -2px rgba(15,23,42,.06);transition:all .15s ease}',
        '#ac-gal-backlog .bi:hover{border-color:#7dd3fc;background:rgba(240,249,255,.95);transform:translateY(-1px)}',
        '#ac-gal-backlog .bi .nm{color:#0369a1;font-size:12px;font-weight:600;margin-bottom:4px}',
        '#ac-gal-backlog .bi .tx{white-space:pre-wrap;word-break:break-word}',
        '#ac-gal-backlog .bi.cur{border-color:#0284c7;background:rgba(224,242,254,.92);box-shadow:0 0 0 2px rgba(56,189,248,.22)}',
        '#ac-gal-backlog .bi.adv .nm{color:#b45309}',
        '#ac-gal-charstate-panel{position:absolute;inset:0;z-index:9;background:rgba(241,246,252,.82);display:none;flex-direction:column;padding:18px 5vw 26px;backdrop-filter:blur(24px) saturate(140%);-webkit-backdrop-filter:blur(24px) saturate(140%)}',
        '#ac-gal-charstate-panel.on{display:flex}',
        '#ac-gal-charstate-panel .hd{display:flex;align-items:center;gap:10px;color:#334155;font-size:14px;margin-bottom:10px}',
        '#ac-gal-charstate-panel .hd b{color:#0f3a5c}',
        '#ac-gal-charstate-panel .hd .sp{flex:1 1 auto}',
        '#ac-gal-charstate-panel .hd button{background:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.9);color:#334155;border-radius:999px;padding:5px 13px;font-size:12px;cursor:pointer}',
        '#ac-gal-charstate-panel .hd button:hover{background:#e0f2fe;border-color:#7dd3fc;color:#0284c7}',
        '#ac-gal-charstate-list{flex:1 1 auto;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;padding-right:6px;align-content:start}',
        '#ac-gal-charstate-panel .cs-card{display:flex;flex-direction:column;justify-content:space-between;background:rgba(255,255,255,.76);border:1px solid rgba(255,255,255,.92);border-radius:14px;overflow:hidden;min-height:150px;box-shadow:0 4px 20px -2px rgba(15,23,42,.06)}',
        '#ac-gal-charstate-panel .cs-changes{flex:1 1 auto;padding:13px 15px;color:#334155;font-size:13px;line-height:1.75;white-space:pre-wrap;word-break:break-word;overflow-y:auto;max-height:220px}',
        '#ac-gal-charstate-panel .cs-changes.empty{color:#94a3b8}',
        '#ac-gal-charstate-panel .cs-name{display:flex;align-items:center;gap:8px;padding:9px 15px;background:linear-gradient(90deg,rgba(224,242,254,.95) 0%,rgba(240,249,255,.6) 100%);border-top:1px solid rgba(186,230,253,.9);border-left:3px solid #0284c7;color:#0369a1;font-size:14px;font-weight:600;letter-spacing:.04em}',
        '#ac-gal-charstate-panel .cs-avatar{width:22px;height:22px;border-radius:50%;background:#dbeafe;color:#0369a1;display:flex;align-items:center;justify-content:center;font-size:12px;flex:0 0 auto}',
        '#ac-gal-sprites{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}',
        '#ac-gal-sprites.hide{display:none}',
        '#ac-gal-sprites .ac-gal-sprite{position:absolute;bottom:calc(-1 * var(--ac-sprite-sink,26%));height:var(--ac-sprite-h,112%);max-width:62vw;object-fit:contain;object-position:bottom center;filter:drop-shadow(0 0 2px rgba(255,255,255,.18)) drop-shadow(0 14px 30px rgba(8,14,26,.42));opacity:0;transform:translateY(18px);transition:opacity .32s ease,transform .4s cubic-bezier(.22,1,.36,1),filter .35s ease,left .3s ease,right .3s ease,height .3s ease,bottom .3s ease,mask-image .3s ease;mask-image:linear-gradient(to bottom,#000 0%,#000 90%,rgba(0,0,0,.6) 98%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 90%,rgba(0,0,0,.6) 98%,transparent 100%)}',
        '#ac-gal-sprites .ac-gal-sprite.on{opacity:1}',
        '#ac-gal-sprites .ac-gal-sprite.main{z-index:3;transform:translateY(0) scale(1);filter:brightness(1.02) contrast(1.02) saturate(1.05) drop-shadow(0 0 2px rgba(255,255,255,.2)) drop-shadow(0 16px 34px rgba(8,14,26,.45))}',
        '#ac-gal-sprites .ac-gal-sprite.side{z-index:2;transform:scale(.94) translateY(1.5vh);filter:brightness(.68) contrast(.97) saturate(.82) drop-shadow(0 8px 18px rgba(8,14,26,.38))}',
        '#ac-gal-sprites .ac-gal-sprite.dim{filter:brightness(.88) contrast(.99) saturate(.95) drop-shadow(0 10px 24px rgba(8,14,26,.32))}',
        '#ac-gal-sprites .ac-gal-sprite.side.dim{filter:brightness(.66) contrast(.97) saturate(.8) drop-shadow(0 8px 18px rgba(8,14,26,.34))}',
        '#ac-gal-sprites .ac-gal-sprite.avatar{bottom:auto;height:calc(var(--ac-sprite-h,70%) * .5);border-radius:20px;border:3px solid rgba(255,255,255,.85);box-shadow:0 16px 40px rgba(15,23,42,.32);object-fit:cover}',
        '@keyframes acGalBreathe{0%,100%{translate:0 0}50%{translate:0 -5px}}',
        '#ac-gal-sprites .ac-gal-sprite.on{animation:acGalBreathe 4.8s ease-in-out infinite;transform-origin:bottom center}',
        '@keyframes acGalJump{0%,100%{translate:0 0}38%{translate:0 -22px}72%{translate:0 -6px}}',
        '@keyframes acGalSink{0%{translate:0 0}45%{translate:0 14px}100%{translate:0 0}}',
        '@keyframes acGalShake{0%,100%{translate:0 0;rotate:0deg}20%,60%{translate:-7px 0;rotate:-.5deg}40%,80%{translate:7px 0;rotate:.5deg}}',
        '#ac-gal-sprites .ac-gal-sprite.emote-jump{animation:acGalJump .45s cubic-bezier(.34,1.56,.64,1) both}',
        '#ac-gal-sprites .ac-gal-sprite.emote-sink{animation:acGalSink .7s ease-in-out both}',
        '#ac-gal-sprites .ac-gal-sprite.emote-shake{animation:acGalShake .35s ease-in-out both}',
        '#ac-gal-emo-badge{position:absolute;left:14px;top:64px;z-index:6;display:none;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;background:rgba(15,23,42,.55);color:#e2e8f0;font-size:12px;line-height:1.4;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 4px 16px rgba(0,0,0,.22);pointer-events:none;letter-spacing:.3px}',
        '#ac-gal-emo-badge.on{display:inline-flex}',
        '#ac-gal-emo-badge b{color:#7dd3fc;font-weight:600}',
        '#ac-gal-emo-badge .src{opacity:.55;font-size:10px;margin-left:2px}',
    ].join('\n');
    document.head.appendChild(st);
    try { applyGalThemeCss(); } catch (e) { /* ignore */ }
}

function galOverlay() {
    galStyle();
    let ov = document.getElementById('ac-gal-overlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'ac-gal-overlay';
        ov.innerHTML =
            '<div id="ac-gal-bg"></div><div id="ac-gal-shade"></div><div id="ac-gal-sprites"></div><div id="ac-gal-emo-badge"></div>' +
            '<div id="ac-gal-top"><b>Galgame 模式</b><span id="ac-gal-info" style="font-size:12px;color:#9fb3ad;margin-left:10px"></span><span class="sp"></span>' +
            '<button id="ac-gal-open-loom">🎛 织机</button>' +
            '<button id="ac-gal-charstate">📝 变化</button>' +
            '<button id="ac-gal-backlog-btn">📜 回想</button>' +
            '<button id="ac-gal-prev">◀ 上一条</button>' +
            '<button id="ac-gal-stop" style="display:none;border-color:rgba(230,120,120,.7);color:#ffb4b4">■ 终止生成</button>' +
            '<button id="ac-gal-close">× 关闭</button></div>' +
            '<div id="ac-gal-main"><div id="ac-gal-box">' +
            '<div id="ac-gal-name"></div><div id="ac-gal-text"></div>' +
            '<div id="ac-gal-choice"></div>' +
            '<div id="ac-gal-input"><input id="ac-gal-input-text" placeholder="自己输入一句话/动作…"><button id="ac-gal-send">发送</button></div>' +
            '<div id="ac-gal-hint">▼ 点击继续</div></div></div>' +
            '<div id="ac-gal-backlog"><div class="hd"><b>📜 回想</b><span class="sp"></span><button id="ac-gal-backlog-close">× 关闭</button></div><div id="ac-gal-backlog-list"></div></div>' +
            '<div id="ac-gal-charstate-panel"><div class="hd"><b>📝 人物变化</b><span class="sp"></span><button id="ac-gal-charstate-close">× 关闭</button></div><div id="ac-gal-charstate-list"></div></div>';
        document.body.appendChild(ov);
        // 点击推进/推进选项
        ov.addEventListener('click', function (ev) {
            const t = ev.target;
            if (!t || !t.closest) return;
            // 面板打开时，点面板外空白不推进
            try {
                const csOn = document.getElementById('ac-gal-charstate-panel');
                const blOn = document.getElementById('ac-gal-backlog');
                if ((csOn && csOn.classList.contains('on')) || (blOn && blOn.classList.contains('on'))) return;
            } catch (e) { /* ignore */ }
            if (t.closest('#ac-gal-top') || t.closest('#ac-gal-input') || t.closest('#ac-gal-choice button')) return;
            if (t.closest('#ac-gal-backlog') || t.closest('#ac-gal-charstate-panel')) return;
            if (t.closest('summary') || t.closest('#ac-gal-text details') || t.closest('#ac-gal-text a')) return;
            galTap();
        });
        ov.querySelector('#ac-gal-close').addEventListener('click', function (ev) { ev.stopPropagation(); galClose(); });
        ov.querySelector('#ac-gal-prev').addEventListener('click', function (ev) { ev.stopPropagation(); galPrev(); });
        ov.querySelector('#ac-gal-charstate').addEventListener('click', function (ev) {
            ev.stopPropagation();
            galOpenCharState();
        });
        ov.querySelector('#ac-gal-charstate-close').addEventListener('click', function (ev) { ev.stopPropagation(); galCloseCharState(); });
        ov.querySelector('#ac-gal-open-loom').addEventListener('click', function (ev) {
            ev.stopPropagation();
            try { galClose(); } catch (e) { /* ignore */ }
            setTimeout(function () {
                try {
                    const b = document.getElementById('ac_wand_btn');
                    if (b) b.click(); else openPanel();
                } catch (e) { /* ignore */ }
            }, 60);
        });
        ov.querySelector('#ac-gal-stop').addEventListener('click', function (ev) { ev.stopPropagation(); galStopGeneration(); });
        ov.querySelector('#ac-gal-backlog-btn').addEventListener('click', function (ev) { ev.stopPropagation(); galOpenBacklog(); });
        ov.querySelector('#ac-gal-backlog-close').addEventListener('click', function (ev) { ev.stopPropagation(); galCloseBacklog(); });
        // 滚轮：上滚回看上一段，下滚继续
        let _wheelAt = 0;
        ov.addEventListener('wheel', function (ev) {
            if (document.getElementById('ac-gal-backlog')?.classList.contains('on')) return;
            const now = Date.now();
            if (now - _wheelAt < 220) return;
            if (Math.abs(ev.deltaY) < 12) return;
            _wheelAt = now;
            if (ev.deltaY < 0) galPrev(); else galNext();
        }, { passive: true });
        ov.querySelector('#ac-gal-send').addEventListener('click', function (ev) { ev.stopPropagation(); galSendInput(); });
        ov.querySelector('#ac-gal-input-text').addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); galSendInput(); }
            ev.stopPropagation();
        });
        document.addEventListener('keydown', function (ev) {
            const bl = document.getElementById('ac-gal-backlog');
            const blOn = !!(bl && bl.classList.contains('on'));
            if (ev.key === 'Escape') {
                if (blOn) { galCloseBacklog(); return; }
                const cs = document.getElementById('ac-gal-charstate-panel');
                if (cs && cs.classList.contains('on')) { galCloseCharState(); return; }
                galClose(); return;
            }
            if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' || ev.key === 'PageUp') { ev.preventDefault(); galPrev(); return; }
            if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown' || ev.key === 'PageDown') { ev.preventDefault(); galNext(); return; }
        });
    }
    galStyle();
    return ov;
}

function galBgCandidates() {
    const list = [];
    try {
        for (const id of ['bg_custom', 'bg1', 'bg2']) {
            const el = document.getElementById(id);
            if (!el) continue;
            const bg = getComputedStyle(el).backgroundImage;
            if (bg && bg !== 'none' && bg.indexOf('url(') === 0) {
                list.push(bg.slice(4, -1).replace(/^["']|["']$/g, ''));
            }
            const img = el.querySelector && el.querySelector('img');
            if (img && img.src) list.push(img.src);
            const vid = el.querySelector && el.querySelector('video');
            if (vid && vid.currentSrc) list.push(vid.currentSrc);
        }
        const md = ctx.chatMetadata || {};
        if (md.background) list.push('/backgrounds/' + encodeURIComponent(md.background));
        const ch = (ctx.characters || [])[ctx.characterId];
        if (ch && ch.avatar) list.push('/characters/' + encodeURIComponent(ch.avatar));
    } catch (e) { /* ignore */ }
    return list.filter(Boolean);
}

function galTestImage(url) {
    return new Promise(function (res) {
        const im = new Image();
        im.onload = function () { res(true); };
        im.onerror = function () { res(false); };
        im.src = url;
        setTimeout(function () { res(false); }, 5000);
    });
}

async function galApplyBg() {
    const bgEl = document.getElementById('ac-gal-bg');
    if (!bgEl) return;
    // 环境池优先
    try {
        const env = galDesiredEnv();
        if (env && env.url) { galApplyEnv(env); return; }
    } catch (e) { /* ignore */ }
    const list = galBgCandidates();
    for (const u of list) {
        if (await galTestImage(u)) {
            bgEl.style.backgroundImage = 'url("' + u.replace(/"/g, '\\"') + '")';
            const isChar = u.indexOf('/characters/') >= 0;
            bgEl.style.opacity = isChar ? '.45' : '.85';
            bgEl.style.filter = isChar ? 'blur(6px) saturate(.9)' : 'saturate(.95)';
            return;
        }
    }
    bgEl.style.backgroundImage = 'linear-gradient(160deg,#dbeafe 0%,#f8fbff 45%,#c7e2f7 100%)';
    bgEl.style.opacity = '1';
    bgEl.style.filter = 'none';
}

// ── Galgame 立绘（多角色：主说话人居中=背景人物位置，其他角色靠左） ──
let _galSpriteCache = {};   // name|emo → { url, avatar } | null
function galSpriteDir() {
    try { return String(settings().vnSpriteDir || 'sprites').replace(/^\/+|\/+$/g, '') || 'sprites'; } catch (e) { return 'sprites'; }
}
// 表情关键词表：zh 用于「角色名_表情.png」，en 用于 _default 素材包
const GAL_EMO_MAP = [
    { zh: '笑', en: 'joy', re: /笑|开心|高兴|愉快|噗嗤|莞尔|嘴角|微笑|大笑|愉悦/ },
    { zh: '爱', en: 'love', re: /爱|喜欢|心动|温柔|宠溺|怜爱|深情/ },
    { zh: '欲', en: 'desire', re: /欲望|渴望|想要|情欲|发情|燥热|湿/ },
    { zh: '怒', en: 'anger', re: /怒|生气|恼火|火大|咬牙|怒视|愤/ },
    { zh: '烦', en: 'annoyance', re: /烦|不耐|啧|皱眉|嫌弃/ },
    { zh: '哭', en: 'sadness', re: /哭|泪|抽泣|哽咽|眼圈|难过|伤心/ },
    { zh: '悲', en: 'grief', re: /悲伤|悲痛|痛苦|心碎/ },
    { zh: '惊', en: 'surprise', re: /惊|愣|呆住|愕|吓|震惊|意外|吃惊/ },
    { zh: '羞', en: 'embarrassment', re: /羞|脸红|害羞|不好意思|别过脸|难为情/ },
    { zh: '怕', en: 'fear', re: /害怕|恐惧|发抖|颤|胆怯/ },
    { zh: '紧张', en: 'nervousness', re: /紧张|忐忑|局促|不安/ },
    { zh: '平静', en: 'neutral', re: /平静|淡淡|漠然|面无表情|冷淡|冷静/ },
    { zh: '好笑', en: 'amusement', re: /好笑|有趣|噗|忍俊不禁/ },
    { zh: '佩服', en: 'admiration', re: /佩服|赞叹|仰慕|崇拜/ },
    { zh: '关心', en: 'caring', re: /关心|担心|心疼|关切/ },
    { zh: '疑惑', en: 'confusion', re: /疑惑|困惑|不解|茫然/ },
    { zh: '好奇', en: 'curiosity', re: /好奇/ },
    { zh: '赞许', en: 'approval', re: /赞许|点头|认可|同意/ },
    { zh: '反对', en: 'disapproval', re: /不赞同|反对|不满/ },
    { zh: '厌恶', en: 'disgust', re: /厌恶|恶心|反感/ },
    { zh: '兴奋', en: 'excitement', re: /兴奋|激动|雀跃/ },
    { zh: '感谢', en: 'gratitude', re: /感谢|谢谢|感激/ },
    { zh: '期待', en: 'optimism', re: /期待|希望|憧憬/ },
    { zh: '得意', en: 'pride', re: /得意|骄傲|自豪/ },
    { zh: '恍然', en: 'realization', re: /恍然|意识到|原来如此/ },
    { zh: '放心', en: 'relief', re: /松口气|放心|释然/ },
    { zh: '后悔', en: 'remorse', re: /后悔|懊悔|愧疚|歉意/ },
    { zh: '失望', en: 'disappointment', re: /失望|沮丧/ },
];
function galSpriteEmotion(text) {
    const t = String(text || '');
    // 1) 显式表情标记优先：【表情：笑】/（笑脸）/ [表情: anger] / #joy# / （微笑）
    const findEmo = function (raw) {
        const s0 = String(raw || '').trim().toLowerCase();
        if (!s0) return null;
        for (const m of GAL_EMO_MAP) {
            if (m.zh === raw || String(m.zh) === String(raw)) return { zh: m.zh, en: m.en };
            if (m.en === s0) return { zh: m.zh, en: m.en };
        }
        // 常见同义词
        const alias = { '微笑': '笑', '笑容': '笑', '苦笑': '笑', '大笑': '笑', '脸红': '羞', '害羞': '羞', '愤怒': '怒', '生气': '怒', '流泪': '哭', '眼泪': '哭', '惊讶': '惊', '震惊': '惊', '害怕': '怕', '恐惧': '怕', '叹气': '失望', '无语': '烦', '无奈': '烦', '温柔': '爱', '兴奋': '兴奋', '得意': '得意', '疑惑': '疑惑', '平静': '平静', '冷淡': '平静', 'normal': '平静', 'smile': '笑', 'happy': '笑', 'sad': '哭', 'angry': '怒', 'cry': '哭', 'shy': '羞', 'surprised': '惊', 'scared': '怕' };
        const hit = alias[s0] || alias[raw];
        if (hit) { for (const m of GAL_EMO_MAP) { if (m.zh === hit) return { zh: m.zh, en: m.en }; } }
        return null;
    };
    const tagRe = /【\s*表情\s*[：:]\s*([^】]{1,10})\s*】|[\[［]\s*表情\s*[：:]\s*([^\]］]{1,10})\s*[\]］]|#([a-z_]{3,20})#/gi;
    let mt;
    while ((mt = tagRe.exec(t))) {
        const hit = findEmo(mt[1] || mt[2] || mt[3] || '');
        if (hit) return hit;
    }
    // 2) 括号里的表演提示：（微笑）/（叹气）/（脸红）
    const parenRe = /[（(]\s*(微笑|苦笑|笑|大笑|怒|生气|哭|流泪|叹气|惊讶|震惊|害羞|脸红|紧张|害怕|兴奋|得意|疑惑|无语|无奈|温柔|冷淡|平静|沉默)\s*[）)]/g;
    let mp;
    while ((mp = parenRe.exec(t))) {
        const hit = findEmo(mp[1]);
        if (hit) return hit;
    }
    // 3) 亲密/情欲场景优先识别（呻吟+身体/体液线索），避免被判成紧张或平静
    try {
        const intimate = /(咿|唔|嗯|啊|咕|啾|噜|哼|喘)/.test(t) && /(喉咙|吞|咽|含|吮|吸|舔|精|奶|乳|汁|湿|淫|骚|媚|热|烫|胀|欲|身体|腰|腿|胸|口)/.test(t);
        if (intimate) {
            const hit = GAL_EMO_MAP.find(function (m) { return m.en === 'desire'; });
            if (hit) return { zh: hit.zh, en: hit.en };
        }
    } catch (e) { /* ignore */ }
    // 3) 普通关键词：按命中次数打分，避免数组顺序偏置（同一个词出现在多个分组时选更像的那个）
    let _best = null, _bestScore = 0;
    for (const m of GAL_EMO_MAP) {
        try {
            const re2 = new RegExp(m.re.source, 'g');
            const hits = (t.match(re2) || []).length;
            if (hits > _bestScore) { _bestScore = hits; _best = { zh: m.zh, en: m.en }; }
        } catch (e) { /* ignore */ }
    }
    if (_best) return _best;
    // 4) 动作 / 神态 / 标点兜底（Gemini 建议：小说里大部分情绪藏在动作里）
    const lex = galActionEmotion(t);
    if (lex) return { zh: lex.zh, en: lex.en, motion: lex.motion };
    return { zh: 'normal', en: 'neutral' };
}

// 动作/神态/标点 → 表情（Gemini 评审给的本地规则引擎，AI 失败时兜底）
const GAL_ACTION_LEX = [
    { re: /咬.{0,3}唇|别过(头|脸)|移开视线|脸颊.{0,6}(红|烫)|耳根|低头|绞着|局促|羞/, emo: 'embarrassment', motion: 'sink' },
    { re: /叹.{0,3}气|垂下(眼|眸|头)|苦笑|扯.{0,3}嘴角|失落|黯然|落寞|失望|无奈/, emo: 'disappointment', motion: 'sink' },
    { re: /皱.{0,3}眉|眯起(眼|眸)|冷笑|啧|翻.{0,3}白眼|抱起双臂|不耐|烦躁|烦/, emo: 'annoyance', motion: 'none' },
    { re: /发抖|颤抖|缩了缩|后退|攥紧|吞.{0,3}唾沫|冷汗|僵住|紧张|不安|忐忑/, emo: 'nervousness', motion: 'shake' },
    { re: /瞪大|猛地抬头|怔住|愣住|瞳孔|倒吸.{0,3}气|惊|震惊|意外|愕然/, emo: 'surprise', motion: 'jump' },
    { re: /扑哧|弯起(眼|眉|唇)|勾起唇角|忍俊不禁|偷笑|掩嘴|好笑|有趣|逗|噗/, emo: 'amusement', motion: 'jump' },
    { re: /挺起胸|扬起下巴|得意|哼哼|叉腰|骄傲|自豪|不屑地笑/, emo: 'pride', motion: 'jump' },
    { re: /凑近|贴近|吐气|舔.{0,3}唇|灼热|喘息|渴望|情欲|燥热|湿了/, emo: 'desire', motion: 'none' },
    { re: /喉咙|嗓子|吞咽|吞下|含住|吮吸|舔弄|咽下|咕啾|咕噜|咿唔|咿呀|唔嗯|嗯啊/, emo: 'desire', motion: 'none' },
    { re: /浓精|精液|奶水|乳汁|淫水|蜜液|黏液|淫|骚|媚|发情|求欢|勾引/, emo: 'desire', motion: 'none' },
    { re: /（?羞|脸红|耳根|难为情|羞耻|不好意思|别过脸|低头.{0,4}不敢/, emo: 'embarrassment', motion: 'sink' },
    { re: /松了口气|拍了拍胸口|还好|幸好|放心|释然|松了劲/, emo: 'relief', motion: 'sink' },
    { re: /歪.{0,3}头|眨.{0,3}眼|打量|盯着|疑惑|不解|好奇|困惑|迷茫/, emo: 'curiosity', motion: 'none' },
    { re: /温柔|轻抚|摸.{0,3}头|依偎|柔声|心疼|关心|担心|小心地/, emo: 'caring', motion: 'none' },
    { re: /怒|吼|滚|混蛋|岂有此理|拍桌|生气|恼火|咬牙|愤/, emo: 'anger', motion: 'shake' },
    { re: /泪|哭|哽咽|抽泣|鼻酸|伤心|难过|悲伤|悲痛|心碎|哀伤/, emo: 'grief', motion: 'sink' },
    { re: /开心|太好了|欢呼|兴奋|期待|高兴|快乐|雀跃|激动/, emo: 'excitement', motion: 'jump' },
    { re: /喜欢|爱你|深情|爱意|宠溺|怜爱/, emo: 'love', motion: 'none' },
    { re: /感谢|谢谢|感激|道谢/, emo: 'gratitude', motion: 'none' },
    { re: /害怕|恐惧|惊恐|怕|胆怯|缩成一团/, emo: 'fear', motion: 'shake' },
    { re: /后悔|懊恼|愧疚|歉意|自责/, emo: 'remorse', motion: 'sink' },
    { re: /恍然|意识到|原来如此|明白了|恍然大悟/, emo: 'realization', motion: 'jump' },
    { re: /佩服|赞叹|仰慕|崇拜|钦佩/, emo: 'admiration', motion: 'none' },
    { re: /点头|认可|赞许|同意|竖.{0,2}拇指|赞了一声/, emo: 'approval', motion: 'none' },
    { re: /不赞同|反对|摇头|不满|不以为然/, emo: 'disapproval', motion: 'none' },
    { re: /厌恶|恶心|反感|嫌弃|作呕/, emo: 'disgust', motion: 'none' },
    { re: /困惑|迷茫|不解|摸不着头脑/, emo: 'confusion', motion: 'none' },
    { re: /期待|希望|憧憬|盼着|向往/, emo: 'optimism', motion: 'none' },
    { re: /微笑|笑意|笑|嘴角.{0,3}(翘|弯)/, emo: 'joy', motion: 'jump' },
];
const GAL_LOCAL_FALLBACK_POOL = ['curiosity', 'caring', 'approval', 'amusement', 'optimism', 'realization', 'relief', 'embarrassment', 'nervousness', 'disappointment', 'confusion', 'surprise', 'excitement', 'pride', 'gratitude', 'admiration', 'annoyance', 'remorse', 'disgust', 'fear', 'desire', 'grief', 'disapproval', 'love', 'anger'];
function galActionEmotion(text) {
    const t = String(text || '');
    let best = null, bestScore = 0;
    for (const it of GAL_ACTION_LEX) {
        try {
            const re2 = new RegExp(it.re.source, 'g');
            const hits = (t.match(re2) || []).length;
            if (hits > bestScore) {
                bestScore = hits;
                for (const m of GAL_EMO_MAP) { if (m.en === it.emo) { best = { zh: m.zh, en: m.en, motion: it.motion }; break; } }
            }
        } catch (e) { /* ignore */ }
    }
    if (best && bestScore > 0) return best;
    // 标点/句式兜底（完全没命中词汇时，也尽量不判 neutral）
    if (/[?!！？]{1,2}/.test(t)) { for (const m of GAL_EMO_MAP) if (m.en === 'surprise') return { zh: m.zh, en: m.en, motion: 'jump' }; }
    if (/…{2,}|。。。/.test(t)) { for (const m of GAL_EMO_MAP) if (m.en === 'nervousness') return { zh: m.zh, en: m.en, motion: 'sink' }; }
    if (/[？?]$/.test(t)) { for (const m of GAL_EMO_MAP) if (m.en === 'curiosity') return { zh: m.zh, en: m.en, motion: 'none' }; }
    if (/[～~]+/.test(t)) { for (const m of GAL_EMO_MAP) if (m.en === 'amusement') return { zh: m.zh, en: m.en, motion: 'none' }; }
    if (/[！!]$/.test(t)) { for (const m of GAL_EMO_MAP) if (m.en === 'excitement') return { zh: m.zh, en: m.en, motion: 'jump' }; }
    return null;
}
// ── AI 表情识别（像官方 expressions 一样按内容判情绪）：异步、带缓存、不阻塞显示 ──
const _emoAiCache = {};
let _emoAiTimer = null;
function galEmotionAi(text) {
    const t = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 300);
    if (!t) return Promise.resolve(null);
    const key = t.slice(0, 120);
    if (Object.prototype.hasOwnProperty.call(_emoAiCache, key)) return Promise.resolve(_emoAiCache[key]);
    const labels = GAL_EMO_MAP.map(function (m) { return m.en; }).concat(['neutral']);
    const quotes = (t.match(/[“"]([^”"]{2,120})[”"]/g) || []).join(' ');
    const sample = (quotes ? quotes : t).slice(0, 240);
    const prompt = '只输出一个英文单词，不要标点、不要解释。判断下面这段角色台词对应的情绪，从这些标签里选最接近的一个（除非真的完全平淡，否则不要选 neutral）：' + labels.join(', ') + '。\n台词：' + sample;
    return callLLM(prompt, { maxTokens: 400, timeout: 30 }).then(function (raw) {
        const text = String(raw || '');
        // 1) 英文标签（优先取整词）
        const words = text.toLowerCase().match(/[a-z]{3,20}/g) || [];
        let hit = null;
        for (const w of words) { if (labels.indexOf(w) >= 0) { hit = w; break; } }
        if (hit) {
            for (const m of GAL_EMO_MAP) { if (m.en === hit) { _emoAiCache[key] = { zh: m.zh, en: m.en }; return _emoAiCache[key]; } }
        }
        // 2) 中文标签（有些模型会回中文）
        for (const m of GAL_EMO_MAP) {
            if (text.indexOf(m.zh) >= 0) { _emoAiCache[key] = { zh: m.zh, en: m.en }; return _emoAiCache[key]; }
        }
        if (/neutral|平静|无表情|平淡/i.test(text)) {
            // AI 判成平淡时，如果关键词能读出情绪就优先关键词（避免表情变化太少）
            const kw = galSpriteEmotion(t);
            if (kw && kw.en && kw.en !== 'neutral') { _emoAiCache[key] = kw; return kw; }
            _emoAiCache[key] = { zh: '平静', en: 'neutral' };
            return _emoAiCache[key];
        }
        console.debug('[命运织机] AI 表情识别结果无法解析：', text.slice(0, 80));
        _emoAiCache[key] = null;
        return null;
    }).catch(function (e) { console.debug('[命运织机] AI 表情识别失败：', String(e && e.message || e).slice(0, 120)); _emoAiCache[key] = null; return null; });
}
function galEmotionAiUpgrade(speaker, segText, idx) {
    try {
        if (String(settings().vnEmotionMode || 'ai') !== 'ai') return;
        if (!speaker) return;
        if (_emoAiTimer) clearTimeout(_emoAiTimer);
        const _sp = String(speaker), _tx = String(segText || ''), _i = Number(idx) || 0;
        _emoAiTimer = setTimeout(function () {
            galEmotionAi(_tx).then(function (emo) {
                try {
                    const st = state.gal;
                    if (!emo || !st || st.i !== _i) return;
                    if (!st.segs || String(st.segs[_i] || '') !== _tx) return;
                    galUpdateSprite(_sp, _tx, false, emo);
                } catch (e) { /* ignore */ }
            }).catch(function () { /* ignore */ });
        }, 450);
    } catch (e) { /* ignore */ }
}


// ═══════════════════════════════════════════════════════════
// 表情时间轴（v0.12.0）：整条消息一次 AI → 逐句情绪；打字机按句切表情
// ═══════════════════════════════════════════════════════════
const _emoTimelineCache = {};
const GAL_EMO_POOL_ANTI = ['curiosity', 'approval', 'caring', 'optimism', 'amusement'];
function galHashStr(s) {
    let h = 5381;
    const t = String(s || '');
    for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
}
// 把一段文本切成"演出节拍"（句子），记录在纯文本里的字符区间
function galSplitBeats(text) {
    const t = String(text || '').replace(/\s+/g, ' ').trim();
    if (!t) return [];
    const out = [];
    let buf = '';
    let bufStart = 0;
    let pos = 0;
    const pushBuf = function () {
        const tx = buf.trim();
        if (!tx) { buf = ''; return; }
        out.push({ text: tx, start: bufStart, end: bufStart + buf.length });
        buf = '';
    };
    const SENT_END = /[。！？!?…～~—”」\n]/;
    for (const ch of t) {
        if (!buf) bufStart = pos;
        buf += ch;
        pos++;
        if (SENT_END.test(ch)) {
            // 太短的碎片（“啊！”）并到下一句
            if (buf.trim().length >= 6) pushBuf();
        }
    }
    if (buf.trim()) pushBuf();
    // 合并过短节拍
    const merged = [];
    for (const b of out) {
        if (merged.length && b.text.length < 6) {
            const prev = merged[merged.length - 1];
            prev.text += b.text;
            prev.end = b.end;
        } else merged.push(b);
    }
    return merged;
}
function galBeatEmoLocal(text, seenNeutral, seed) {
    const t = String(text || '');
    let emo = null;
    try { emo = galSpriteEmotion(t); } catch (e) { emo = null; }
    const isNeutral = !emo || !emo.en || emo.en === 'neutral';
    if (!isNeutral) {
        seenNeutral.count = 0;
        seenNeutral.total = (seenNeutral.total || 0) + 1;
        return emo;
    }
    // 兜底：明确的紧张/害怕词直接判定（比句式线索更可靠）
    if (/(紧张|心跳加速|心跳|发抖|颤抖|手心.{0,3}汗|不敢看|不敢抬头|局促)/.test(t)) {
        for (const m of GAL_EMO_MAP) if (m.en === 'nervousness') return { zh: m.zh, en: m.en, motion: 'shake' };
    }
    if (/(害怕|恐惧|惊恐|吓得|毛骨悚然)/.test(t)) {
        for (const m of GAL_EMO_MAP) if (m.en === 'fear') return { zh: m.zh, en: m.en, motion: 'shake' };
    }
    // 按句式线索 + 文本哈希轮转，从完整 25 色池里挑，不再固定 5 个
    const cues = [];
    // 亲密/情欲语气优先：呻吟、吞咽、喘息、体液、发情等 → desire / excitement
    if (/(咿|唔|嗯|啊|咕|啾|噜|哼|喘|哈啊)/.test(t) && /(喉咙|吞|咽|含|吮|吸|舔|精|奶|乳|汁|湿|淫|骚|媚|热|烫|胀|欲|身体|腰|腿)/.test(t)) {
        cues.push('desire', 'excitement', 'embarrassment');
    } else if (/(浓精|精液|奶水|乳汁|淫水|发情|淫|骚|媚|勾引|求欢)/.test(t)) {
        cues.push('desire', 'embarrassment');
    }
    if (/[？?]/.test(t)) cues.push('curiosity', 'confusion');
    if (/[！!]/.test(t)) cues.push('excitement', 'surprise');
    // 「……」本身不算紧张：只有明确紧张/发抖/害怕词才判 nervousness
    if (/(紧张|心跳|发抖|颤|不敢|怕|局促|手心.{0,3}汗|深呼吸)/.test(t)) cues.push('nervousness', 'fear');
    if (/(你|您)/.test(t)) cues.push('caring', 'approval');
    if (/(我们|一起|明天|以后)/.test(t)) cues.push('optimism', 'realization');
    if (/(对不起|抱歉|怪我)/.test(t)) cues.push('remorse');
    const pool = cues.concat(GAL_LOCAL_FALLBACK_POOL).filter(function (x) { return x !== 'sympathy'; });
    let h = 5381;
    const src = t + '§' + String(seed === undefined ? (seenNeutral.total || 0) : seed);
    for (let k = 0; k < src.length; k++) h = ((h << 5) + h + src.charCodeAt(k)) | 0;
    const last = Array.isArray(seenNeutral.last) ? seenNeutral.last : [];
    let pick = '';
    for (let k = 0; k < pool.length; k++) {
        const cand = pool[(Math.abs(h) + k) % pool.length];
        if (last.length && last[last.length - 1] === cand) continue;
        pick = cand;
        break;
    }
    if (!pick) pick = pool[Math.abs(h) % pool.length] || 'curiosity';
    last.push(pick);
    while (last.length > 3) last.shift();
    seenNeutral.last = last;
    seenNeutral.count = (seenNeutral.count || 0) + 1;
    seenNeutral.total = (seenNeutral.total || 0) + 1;
    for (const m of GAL_EMO_MAP) if (m.en === pick) return { zh: m.zh, en: m.en, motion: '' };
    return { zh: '好奇', en: 'curiosity', motion: '' };
}
// 建时间轴（同步本地兜底 + 异步 AI 覆盖）
function galEnsureTimeline(st, speakers) {
    try {
        if (!st || !st.segs || !st.segs.length) return null;
        const key = galHashStr((speakers || []).join('|') + '§' + st.segs.join('\u0001'));
        if (st.emoTimeline && st.emoTimeline.key === key) return st.emoTimeline;
        const tl = { key: key, byIdx: {}, emoAi: null, aiPending: null };
        let prevSpeaker = '';
        for (let i = 0; i < st.segs.length; i++) {
            const raw = String(st.segs[i] || '');
            const plain = String(galCleanText(raw) || '').replace(/\s+/g, ' ').trim();
            const beats = galSplitBeats(plain);
            const spk = (speakers && speakers[i]) || prevSpeaker || '';
            if (speakers && speakers[i]) prevSpeaker = speakers[i];
            const seen = { count: 0, total: 0 };
            const locals = beats.map(function (b, bi2) { return galBeatEmoLocal(b.text, seen, i * 100 + bi2); });
            tl.byIdx[i] = { plain: plain, plainLen: plain.length, beats: beats, locals: locals, speaker: spk };
        }
        st.emoTimeline = tl;
        // 后台：整条消息一次 AI 标时间轴
        if (String((function () { try { return settings().vnEmotionMode || 'ai'; } catch (e) { return 'ai'; } })()) === 'ai') {
            const entries = [];
            for (const i in tl.byIdx) {
                const info = tl.byIdx[i];
                info.beats.forEach(function (b, bi) {
                    entries.push({ id: 's' + i + '_b' + bi, spk: info.speaker, text: b.text });
                });
            }
            if (entries.length) {
                tl.aiPending = galFetchEmoTimeline(entries, key).then(function (map) {
                    tl.aiPending = null;
                    if (!map) return;
                    tl.emoAi = map;
                    try { galRefreshEmotionNow(); } catch (e) { /* ignore */ }
                }).catch(function () { tl.aiPending = null; });
            }
        }
        return tl;
    } catch (e) { return null; }
}
function galBeatEmo(tl, segIdx, beatIdx) {
    try {
        const info = tl && tl.byIdx && tl.byIdx[segIdx];
        if (!info || !info.beats.length) return { zh: '正常', en: 'neutral' };
        const bi = Math.max(0, Math.min(info.beats.length - 1, beatIdx));
        const id = 's' + segIdx + '_b' + bi;
        if (tl.emoAi && tl.emoAi[id]) { const a = tl.emoAi[id]; return { zh: a.zh, en: a.en, motion: a.motion || '', src: 'ai' }; }
        const l = info.locals[bi];
        return l ? { zh: l.zh, en: l.en, motion: l.motion || '', src: 'local' } : { zh: '正常', en: 'neutral' };
    } catch (e) { return { zh: '正常', en: 'neutral' }; }
}
function galBeatEmoToEn(emo) { return String((emo && emo.en) || 'neutral'); }
// 整条消息一次 AI 调用：返回 { sN_bM: {zh,en,motion} }
function galFetchEmoTimeline(entries, cacheKey) {
    const cached = _emoTimelineCache[cacheKey];
    if (cached && (Date.now() - cached.t) < 10 * 60 * 1000) return Promise.resolve(cached.map || null);
    const labels = GAL_EMO_MAP.map(function (m) { return m.en; });
    const labelPairs = GAL_EMO_MAP.map(function (m) { return m.zh + '(' + m.en + ')'; }).join('、');
    // 长消息不限 24 条：分批（每批 28 条）覆盖全部节拍，避免后半段全部掉回本地兜底
    const all = entries.slice(0, 140);
    const chunks = [];
    for (let i = 0; i < all.length; i += 28) chunks.push(all.slice(i, i + 28));
    const parseTimeline = function (text) {
        let arr = null;
        try {
            const at = text.indexOf('[');
            const bt = text.lastIndexOf(']');
            if (at >= 0 && bt > at) arr = JSON.parse(text.slice(at, bt + 1));
        } catch (e) { arr = null; }
        if (!arr) {
            try {
                const at2 = text.indexOf('{');
                const bt2 = text.lastIndexOf('}');
                if (at2 >= 0 && bt2 > at2) { const o = JSON.parse(text.slice(at2, bt2 + 1)); if (Array.isArray(o)) arr = o; else if (Array.isArray(o.beats)) arr = o.beats; }
            } catch (e) { /* ignore */ }
        }
        const map = {};
        if (Array.isArray(arr)) {
            for (const it of arr) {
                if (!it) continue;
                const id = String(it.id || '').trim();
                const e = String(it.e || it.emo || it.emotion || '').toLowerCase().trim();
                if (!id || !e) continue;
                let hit = null;
                for (const m of GAL_EMO_MAP) { if (m.en === e || e === String(m.zh)) { hit = m; break; } }
                if (!hit) { for (const m of GAL_EMO_MAP) { if (e.indexOf(m.zh) >= 0 || m.en.indexOf(e) >= 0) { hit = m; break; } } }
                if (!hit) continue;
                const mo = String(it.m || it.motion || '').toLowerCase();
                map[id] = { zh: hit.zh, en: hit.en, motion: (mo === 'jump' || mo === 'sink' || mo === 'shake') ? mo : '' };
            }
        }
        return map;
    };
    const callChunk = function (chunk) {
        const lines = chunk.map(function (e) { return e.id + '|' + (e.spk || '旁白') + '|' + String(e.text).replace(/\|/g, '/').slice(0, 80); }).join('\n');
        const prompt = [
            '你是视觉小说(Galgame)演出导演。为下面每个分句标注「画面主角此刻的立绘表情」。',
            '可选表情（只能选这些英文标签，括号里是对应的中文含义）：' + labelPairs + '。',
            '规则：',
            '1. 严禁滥用 neutral：neutral 最多占本批的 10%；平淡倾听用 curiosity/caring，平淡赞同用 approval，敷衍用 annoyance/disappointment，观察/打量用 curiosity。',
            '2. 动作/神态/旁白也要推断角色脸上的表情（例：咬唇/别过脸 -> embarrassment；叹气/垂眼 -> disappointment；皱眉 -> annoyance；发抖/攥紧 -> nervousness；瞪大/怔住 -> surprise；摸头/柔声 -> caring；点头 -> approval；摇头 -> disapproval）。',
            '3. 这一批里尽量使用至少 8 种不同表情；同一个表情不能连续超过 2 句；相邻句子尽量给出细微递进的变化。',
            '4. 情绪强烈时给动作标记 m：jump(雀跃/惊吓) / sink(失落/害羞低头) / shake(发抖/愤怒)，否则 none。',
            '输入格式：每行 = id|说话人|句子',
            '只输出合法 JSON 数组，不要代码块、不要解释，格式：[{"id":"s0_b0","e":"surprise","m":"jump"}]',
            '分句列表：',
            lines
        ].join('\n');
        const attempt = function (maxTok, timeout) {
            return callLLM(prompt, { maxTokens: maxTok, timeout: timeout }).then(function (raw) {
                return { text: String(raw || ''), map: parseTimeline(String(raw || '')) };
            }).catch(function () { return { text: '', map: {} }; });
        };
        return attempt(2500, 40).then(function (r1) {
            if (Object.keys(r1.map).length) return r1.map;
            if (String(r1.text || '').trim()) return r1.map;
            return attempt(4500, 55).then(function (r2) { return (r2 && r2.map) ? r2.map : {}; });
        });
    };
    let chain = Promise.resolve({});
    chunks.forEach(function (ch) {
        chain = chain.then(function (acc) {
            return callChunk(ch).then(function (m) { for (const k in m) acc[k] = m[k]; return acc; });
        });
    });
    return chain.then(function (map) {
        const keys = Object.keys(map);
        try {
            const ens = {};
            keys.forEach(function (k) { ens[map[k].en] = (ens[map[k].en] || 0) + 1; });
            galDiag('emo_tl', { entries: all.length, chunks: chunks.length, got: keys.length, distinct: Object.keys(ens).length, dist: ens });
        } catch (e) { /* ignore */ }
        _emoTimelineCache[cacheKey] = { t: Date.now(), map: map };
        const ck = Object.keys(_emoTimelineCache);
        if (ck.length > 40) delete _emoTimelineCache[ck[0]];
        return keys.length ? map : null;
    }).catch(function () { return null; });
}
// ── 左上角表情角标 ──
function galSetEmoBadge(emo, speaker, src) {
    try {
        const el = document.getElementById('ac-gal-emo-badge');
        if (!el) return;
        const en = String((emo && emo.en) || '');
        if (!en) { el.classList.remove('on'); return; }
        let zh = String((emo && emo.zh) || '');
        if (!zh || zh === 'normal') { const hit = GAL_EMO_MAP.find(function (m) { return m.en === en; }); zh = hit ? hit.zh : en; }
        el.innerHTML = '🎭 表情：<b>' + esc(zh) + '</b><span style="opacity:.72">(' + esc(en) + ')</span>' +
            (speaker ? '<span style="opacity:.55">· ' + esc(speaker) + '</span>' : '') +
            (src ? '<span class="src">' + esc(src) + '</span>' : '');
        el.classList.add('on');
    } catch (e) { /* ignore */ }
}
function galHideEmoBadge() {
    try { const el = document.getElementById('ac-gal-emo-badge'); if (el) el.classList.remove('on'); } catch (e) { /* ignore */ }
}
// 应用某个节拍的表情（带动作微动画）
function galApplyBeatEmotion(name, emo, segText) {
    try {
        const st = state.gal;
        if (!st || !emo) return;
        const en = galBeatEmoToEn(emo);
        const prev = st.spriteEmo && st.spriteEmo[name] ? galBeatEmoToEn(st.spriteEmo[name]) : '';
        st.lastEmoAt = Date.now();
        galUpdateSprite(name, segText || '', false, emo);
        try { galSetEmoBadge(emo, name, emo.src || ''); } catch (e) { /* ignore */ }
        if (en !== prev) {
            try {
                const wrap = document.getElementById('ac-gal-sprites');
                const main = wrap && wrap.querySelector('.ac-gal-sprite.main');
                const mo = String(emo.motion || '');
                if (main && mo) {
                    const cls = 'emote-' + mo;
                    main.classList.remove('emote-jump', 'emote-sink', 'emote-shake');
                    main.classList.add(cls);
                    setTimeout(function () { try { main.classList.remove(cls); } catch (e) { /* ignore */ } }, 780);
                }
            } catch (e) { /* ignore */ }
        }
    } catch (e) { /* ignore */ }
}
// 打字机进度 → 当前节拍索引
function galBeatIndexAt(tl, segIdx, shown, total) {
    try {
        const info = tl && tl.byIdx && tl.byIdx[segIdx];
        if (!info || !info.beats.length) return 0;
        const plainLen = info.plainLen || info.beats[info.beats.length - 1].end || 1;
        const ratio = total > 0 ? Math.min(1, Math.max(0, shown / total)) : 1;
        const cur = Math.round(ratio * plainLen);
        let bi = 0;
        for (let k = 0; k < info.beats.length; k++) {
            if (cur + 2 >= info.beats[k].start) bi = k;
        }
        return bi;
    } catch (e) { return 0; }
}
// 表情切换队列：最新节拍挂起，最短停留 650ms 后应用（避免鬼畜闪烁）
const GAL_MIN_HOLD_MS = 650;
function galApplyPendingBeat() {
    try {
        const st = state.gal;
        if (!st) return;
        if (st.pendingBeatTimer) { try { clearTimeout(st.pendingBeatTimer); } catch (e) { /* ignore */ } st.pendingBeatTimer = null; }
        const pb = st.pendingBeat;
        if (!pb) return;
        if (st.i !== pb.segIdx) { st.pendingBeat = null; return; }
        st.pendingBeat = null;
        const tl = st.emoTimeline;
        const info = tl && tl.byIdx && tl.byIdx[pb.segIdx];
        if (!info || !info.beats.length) return;
        const bi = Math.max(0, Math.min(info.beats.length - 1, pb.bi));
        if (st.lastBeatSeg === pb.segIdx && st.lastBeatBi === bi) return;
        st.lastBeatSeg = pb.segIdx;
        st.lastBeatBi = bi;
        const emo = galBeatEmo(tl, pb.segIdx, bi);
        const nm = info.speaker || st.lastSpeaker || '';
        galApplyBeatEmotion(nm, emo, st.segs[pb.segIdx]);
    } catch (e) { /* ignore */ }
}
function galQueueBeat(segIdx, bi) {
    try {
        const st = state.gal;
        if (!st || st.i !== segIdx) return;
        st.pendingBeat = { segIdx: segIdx, bi: bi };
        const elapsed = Date.now() - (st.lastEmoAt || 0);
        if (elapsed >= GAL_MIN_HOLD_MS) galApplyPendingBeat();
        else if (!st.pendingBeatTimer) {
            st.pendingBeatTimer = setTimeout(function () { try { galApplyPendingBeat(); } catch (e) { /* ignore */ } }, GAL_MIN_HOLD_MS - elapsed);
        }
    } catch (e) { /* ignore */ }
}
function galTypeEmotionTick(segIdx, shown, total) {
    try {
        const st = state.gal;
        if (!st || st.i !== segIdx) return;
        const tl = st.emoTimeline;
        if (!tl) return;
        const info = tl.byIdx && tl.byIdx[segIdx];
        if (!info || !info.beats.length) return;
        galQueueBeat(segIdx, galBeatIndexAt(tl, segIdx, shown, total));
    } catch (e) { /* ignore */ }
}
// 打字结束（正常打完或点击提前完成）时，把最后一句的表情补上
function galQueueFinalBeat(segIdx) {
    try {
        const st = state.gal;
        if (!st) return;
        const si = (segIdx == null) ? st.i : segIdx;
        if (st.i !== si) return;
        const tl = st.emoTimeline;
        if (!tl) return;
        const info = tl.byIdx && tl.byIdx[si];
        if (!info || !info.beats.length) return;
        galQueueBeat(si, info.beats.length - 1);
    } catch (e) { /* ignore */ }
}
// AI 时间轴返回后：如果还停在同一段，按当前进度刷新一次表情
function galRefreshEmotionNow() {
    try {
        const st = state.gal;
        if (!st || !st.emoTimeline || st.i === undefined) return;
        const i = st.i;
        const info = st.emoTimeline.byIdx && st.emoTimeline.byIdx[i];
        if (!info || !info.beats.length) return;
        const txt = document.getElementById('ac-gal-text');
        const typing = st.typing;
        let bi = 0;
        if (typing && txt) {
            let shown = 0;
            if (typing.kind === 'span' && typing.spans) shown = typing.spans.filter(function (s) { return s.classList.contains('on'); }).length;
            else if (typing.kind === 'slice' && typing.full) shown = String(txt.textContent || '').length;
            const total = typing.kind === 'span' && typing.spans ? typing.spans.length : (typing.full ? galGraphemes(typing.full).length : 1);
            bi = galBeatIndexAt(st.emoTimeline, i, shown, total);
        } else {
            bi = info.beats.length - 1;
        }
        galQueueBeat(i, bi);
    } catch (e) { /* ignore */ }
}

// 表情微动画：高兴跳一下 / 低落沉一下 / 生气抖一下（Gemini 建议的演出层）
function galEmoteClass(emo) {
    const en = String((emo && emo.en) || '').toLowerCase();
    if (!en || en === 'neutral') return '';
    if (/joy|excitement|surprise|amusement|admiration|love|pride|optimism|gratitude|relief|curiosity/.test(en)) return 'emote-jump';
    if (/sadness|grief|embarrassment|nervousness|remorse|disappointment|fear|caring|confusion/.test(en)) return 'emote-sink';
    if (/anger|annoyance|disgust|disapproval/.test(en)) return 'emote-shake';
    return '';
}

function galSpriteUrls(name, emo) {
    const base = '/scripts/extensions/third-party/yek-FateLoom/' + galSpriteDir() + '/';
    const enc = encodeURIComponent(String(name || ''));
    const zh = String((emo && emo.zh) || 'normal');
    const en = String((emo && emo.en) || 'neutral');
    const list = [];
    const add = function (u) { list.push(u + '.webp', u + '.png'); };
    if (zh !== 'normal') add(base + enc + '_' + encodeURIComponent(zh));
    if (en !== 'neutral') add(base + enc + '_' + encodeURIComponent(en));
    add(base + enc);
    if (zh !== 'normal') add(base + enc + '/' + encodeURIComponent(zh));
    if (en !== 'neutral') add(base + enc + '/' + encodeURIComponent(en));
    add(base + enc + '/normal');
    // 默认素材包（_default/英文表情名.webp|png）——给没有专属立绘的角色兜底
    try {
        if (String(settings().vnSpriteFallback || 'default') !== 'none') {
            add(base + '_default/' + encodeURIComponent(en));
            add(base + '_default/neutral');
        }
    } catch (e) {
        add(base + '_default/' + encodeURIComponent(en));
        add(base + '_default/neutral');
    }
    // 最后兜底：同名角色卡的头像（放大做伪立绘）
    try {
        const ch = (ctx.characters || []).find(function (c) { return c && String(c.name) === String(name); });
        if (ch && ch.avatar) list.push('/characters/' + encodeURIComponent(ch.avatar));
    } catch (e) { /* ignore */ }
    return list;
}
// ── 复用酒馆官方「角色表情」素材：/api/sprites/get 返回 /characters/<文件夹>/<文件> ──
let _stSpriteCache = {};
async function galStSpriteResolve(name, emo) {
    try {
        const en = String((emo && emo.en) || 'neutral').toLowerCase();
        const zh = String((emo && emo.zh) || 'normal').toLowerCase();
        const folders = [];
        try {
            const ch = (ctx.characters || []).find(function (c) { return c && String(c.name) === String(name); });
            if (ch && ch.avatar) folders.push(String(ch.avatar).replace(/\.[^.]+$/, ''));
        } catch (e) { /* ignore */ }
        folders.push(String(name));
        // 名字别名：小丁 ↔ 角色丁、角色丙 ↔ 凛凛（按角色识别出的 全名/简称 都试一遍）
        try {
            const pairs = (typeof galNamePairs === 'function') ? galNamePairs() : [];
            pairs.forEach(function (p) {
                if (!p || p.user) return;
                if (String(p.name) === String(name) || String(p.key) === String(name)) {
                    if (p.name && folders.indexOf(String(p.name)) < 0) folders.push(String(p.name));
                    if (p.key && folders.indexOf(String(p.key)) < 0) folders.push(String(p.key));
                }
            });
        } catch (e0) { /* ignore */ }
        for (const folder of folders) {
            if (!folder) continue;
            let list = _stSpriteCache[folder];
            if (!list) {
                try {
                    const r = await fetch('/api/sprites/get?name=' + encodeURIComponent(folder) + '&_=' + Date.now());
                    if (r.ok) { const j = await r.json(); list = Array.isArray(j) ? j : []; } else { list = []; }
                } catch (e) { list = []; }
                _stSpriteCache[folder] = list;
            }
            if (!list || !list.length) continue;
            const map = {};
            list.forEach(function (it) {
                if (it && it.label) map[String(it.label).toLowerCase()] = it.path;
            });
            const hit = map[en] || map[zh] || map['neutral'] || map['normal'] || null;
            if (hit) return { url: hit, avatar: false, custom: true, st: true };
        }
    } catch (e) { /* ignore */ }
    return null;
}

async function galResolveSprite(name, emo) {
    // 表情差分优先，其次基础立绘
    try {
        const exprMap = (assetScope().spriteExpr || {})[String(name)] || {};
        const en0 = String((emo && emo.en) || 'neutral');
        const ex = exprMap[en0];
        if (ex) {
            const exUrl = typeof ex === 'string' ? ex : String(ex.url || '');
            if (exUrl) {
                const t0 = (ex && typeof ex === 'object' && ex.t) ? ('v=' + ex.t) : '';
                return { url: exUrl + (t0 ? (exUrl.indexOf('?') >= 0 ? '&' : '?') + t0 : ''), avatar: false, custom: true };
            }
        }
    } catch (e) { /* ignore */ }
    // 面板里导入的基础立绘优先
    try {
        const rec = (assetScope().spriteMap || {})[String(name)];
        if (rec) {
            const url = typeof rec === 'string' ? rec : String(rec.url || '');
            if (url) {
                const t = (rec && typeof rec === 'object' && rec.t) ? ('v=' + rec.t) : '';
                const sep = url.indexOf('?') >= 0 ? '&' : '?';
                return { url: url + (t ? sep + t : ''), avatar: false, custom: true };
            }
        }
    } catch (e) { /* ignore */ }
    const key = String(name) + '|' + String((emo && emo.en) || 'neutral');
    if (Object.prototype.hasOwnProperty.call(_galSpriteCache, key)) return _galSpriteCache[key];
    // 酒馆官方「角色表情」素材直接复用（用户在 ST 表情扩展里传过的立绘不用再传一遍）
    try {
        const stHit = await galStSpriteResolve(name, emo);
        if (stHit && stHit.url) { _galSpriteCache[key] = stHit; return stHit; }
    } catch (e) { /* ignore */ }
    _galSpriteCache[key] = null;
    try {
        for (const u of galSpriteUrls(name, emo)) {
            if (await galTestImage(u)) {
                const hit = { url: u, avatar: u.indexOf('/characters/') >= 0 };
                _galSpriteCache[key] = hit;
                return hit;
            }
        }
    } catch (e) { /* ignore */ }
    return null;
}
function galClearSprite() {
    const wrap = document.getElementById('ac-gal-sprites');
    if (wrap) wrap.innerHTML = '';
    if (state.gal) { state.gal.spriteCast = []; state.gal.spriteEmo = {}; state.gal.lastSpeaker = ''; }
}

// ── 立绘导入（面板入口）：图片压缩成 WebP 后存到酒馆 user/files ──
function galSpriteHash(s) {
    let h = 0;
    const str = String(s || '');
    for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return Math.abs(h).toString(36);
}
function galSpriteFileName(name) { return 'fateloom_sprite_' + galSpriteHash(name) + '.webp'; }
function galFileToWebpDataUrl(file, maxH) {
    return new Promise(function (resolve, reject) {
        try {
            const fr = new FileReader();
            fr.onload = function () {
                const im = new Image();
                im.onload = function () {
                    try {
                        const mh = Math.max(200, Number(maxH) || 1200);
                        const scale = Math.min(1, mh / im.height);
                        const w = Math.max(1, Math.round(im.width * scale));
                        const h = Math.max(1, Math.round(im.height * scale));
                        const cv = document.createElement('canvas');
                        cv.width = w; cv.height = h;
                        const cx = cv.getContext('2d');
                        cx.drawImage(im, 0, 0, w, h);
                        resolve(cv.toDataURL('image/webp', 0.86));
                    } catch (e) { reject(e); }
                };
                im.onerror = function () { reject(new Error('图片读取失败')); };
                im.src = String(fr.result || '');
            };
            fr.onerror = function () { reject(new Error('文件读取失败')); };
            fr.readAsDataURL(file);
        } catch (e) { reject(e); }
    });
}
// ── 通用素材上传（立绘 / 环境共用）：压缩成 WebP 存 user/files ──
async function galUploadAsset(file, prefix, maxH) {
    const dataUrl = await galFileToWebpDataUrl(file, maxH || 1600);
    const base64 = String(dataUrl).split(',')[1] || '';
    if (!base64) throw new Error('图片转换失败');
    const fname = String(prefix || 'fateloom_asset') + '_' + galSpriteHash(Date.now() + ':' + Math.random()) + '.webp';
    const res = await api('/api/files/upload', { name: fname, data: base64 });
    const url = (res && (res.path || res.url)) || '';
    if (!url) throw new Error('上传失败');
    return { url: String(url), t: Date.now() };
}
async function galDeleteAsset(url) {
    const rel = String(url || '').replace(/^\/+/, '');
    if (!rel) return;
    try {
        await fetch('/api/files/delete', { method: 'POST', headers: headers(), body: JSON.stringify({ path: rel }) });
    } catch (e) { /* ignore */ }
}
// ── 上传到酒馆官方 sprites 目录（characters/<角色>/<表情>.webp）：Galgame 和官方表情扩展共用一套素材 ──
async function galUploadToSprites(name, label, file, maxH) {
    const lbl = String(label || 'neutral').replace(/[^a-z]/gi, '').toLowerCase() || 'neutral';
    const folder = String(name || '').trim();
    if (!folder) throw new Error('角色名为空');
    const dataUrl = await galFileToWebpDataUrl(file, maxH || 1200);
    const blob = await (await fetch(dataUrl)).blob();
    const fd = new FormData();
    fd.append('name', folder);
    fd.append('label', lbl);
    fd.append('spriteName', lbl);
    fd.append('avatar', blob, lbl + '.webp');
    let h = {};
    try { h = ctx.getRequestHeaders ? ctx.getRequestHeaders({ omitContentType: true }) : {}; } catch (e) { h = {}; }
    const r = await fetch('/api/sprites/upload', { method: 'POST', headers: h, body: fd });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 120));
    try {
        const list = await (await fetch('/api/sprites/get?name=' + encodeURIComponent(folder) + '&_=' + Date.now())).json();
        const hit = (list || []).find(function (it) { return it && String(it.label).toLowerCase() === lbl; });
        if (hit && hit.path) return { url: hit.path, t: Date.now(), st: true, label: lbl };
    } catch (e) { /* ignore */ }
    return { url: '/characters/' + encodeURIComponent(folder) + '/' + lbl + '.webp', t: Date.now(), st: true, label: lbl };
}
async function galDeleteSpriteFile(name, label) {
    try {
        const r = await fetch('/api/sprites/delete', {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ name: String(name || ''), label: String(label || ''), spriteName: String(label || '') }),
        });
        return r.ok;
    } catch (e) { return false; }
}
// ── 素材包(zip)一键导入：浏览器内解压（DecompressionStream），不依赖服务器 ──
const GAL_EMO_ALIAS = {
    admiration: ['admiration', '佩服', '赞叹', '仰慕', 'admire'],
    amusement: ['amusement', '好笑', '有趣', '忍俊不禁'],
    anger: ['anger', '怒', '生气', '愤怒', '恼火', 'angry'],
    annoyance: ['annoyance', '烦', '烦躁', '恼怒', '不耐', '厌烦'],
    approval: ['approval', '赞许', '认可', '同意', '点头'],
    caring: ['caring', '关心', '担心', '心疼', '关切'],
    confusion: ['confusion', '疑惑', '困惑', '迷茫', '不解'],
    curiosity: ['curiosity', '好奇'],
    desire: ['desire', '欲望', '渴望', '想要', '色欲', '情欲'],
    disappointment: ['disappointment', '失望', '沮丧'],
    disapproval: ['disapproval', '反对', '不满', '不赞同'],
    disgust: ['disgust', '厌恶', '恶心', '嫌弃'],
    embarrassment: ['embarrassment', '羞', '害羞', '脸红', '尴尬', '难为情'],
    excitement: ['excitement', '兴奋', '激动', '雀跃'],
    fear: ['fear', '怕', '害怕', '恐惧', '惊恐'],
    gratitude: ['gratitude', '感谢', '谢谢', '感激'],
    grief: ['grief', '悲', '悲伤', '悲痛', '痛苦'],
    joy: ['joy', '笑', '开心', '高兴', '快乐', '微笑', '笑容', '大笑', '愉快'],
    love: ['love', '爱', '喜欢', '爱意', '温柔', '深情'],
    nervousness: ['nervousness', '紧张', '不安', '忐忑'],
    neutral: ['neutral', '平静', '冷淡', '无表情', '默认', 'normal', 'default'],
    optimism: ['optimism', '期待', '希望', '乐观'],
    pride: ['pride', '得意', '骄傲', '自豪'],
    realization: ['realization', '恍然', '意识到', '原来如此'],
    relief: ['relief', '放心', '释然', '松口气'],
    remorse: ['remorse', '后悔', '懊恼', '愧疚', '歉意'],
    sadness: ['sadness', '哭', '难过', '伤心', '泪', '哭泣'],
    surprise: ['surprise', '惊', '惊讶', '震惊', '吃惊', '意外'],
};
function galEmotionFromFilename(fn) {
    let base = String(fn || '').split('/').pop().replace(/\.[^.]+$/, '').toLowerCase().trim();
    base = base.replace(/[（(].*$/, '').replace(/[\s_\-—.·]+$/, '').trim();
    if (!base) return '';
    for (const key of Object.keys(GAL_EMO_ALIAS)) {
        if (GAL_EMO_ALIAS[key].indexOf(base) >= 0) return key;
    }
    // 英文表情名带后缀：joy-1 / joy.expressive
    const m = base.match(/^([a-z]{3,20})(?:[-_.].*)?$/);
    if (m && GAL_EMO_ALIAS[m[1]]) return m[1];
    return '';
}
async function galDecompressZipEntry(dv, bytes, entry) {
    const data = new Uint8Array(bytes, entry.dataOffset, entry.compressedSize);
    if (entry.method === 0) return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    if (entry.method === 8) {
        const ds = new DecompressionStream('deflate-raw');
        const stream = new Blob([data]).stream().pipeThrough(ds);
        return await new Response(stream).arrayBuffer();
    }
    throw new Error('不支持的压缩方式 ' + entry.method);
}
async function galReadZip(arrayBuffer) {
    const bytes = arrayBuffer;
    const dv = new DataView(bytes);
    const u8 = new Uint8Array(bytes);
    // 找 EOCD
    let eocd = -1;
    for (let i = Math.max(0, bytes.byteLength - 65557); i <= bytes.byteLength - 22; i++) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('不是有效的 zip 文件');
    const count = dv.getUint16(eocd + 10, true);
    const cdOffset = dv.getUint32(eocd + 16, true);
    const out = [];
    let p = cdOffset;
    for (let i = 0; i < count; i++) {
        if (dv.getUint32(p, true) !== 0x02014b50) break;
        const method = dv.getUint16(p + 10, true);
        const compressedSize = dv.getUint32(p + 20, true);
        const nameLen = dv.getUint16(p + 28, true);
        const extraLen = dv.getUint16(p + 30, true);
        const commentLen = dv.getUint16(p + 32, true);
        const localOffset = dv.getUint32(p + 42, true);
        const name = new TextDecoder('utf-8').decode(u8.subarray(p + 46, p + 46 + nameLen));
        p += 46 + nameLen + extraLen + commentLen;
        if (name.endsWith('/')) continue;
        if (!/\.(png|webp|jpe?g)$/i.test(name)) continue;
        if (dv.getUint32(localOffset, true) !== 0x04034b50) continue;
        const lNameLen = dv.getUint16(localOffset + 26, true);
        const lExtraLen = dv.getUint16(localOffset + 28, true);
        const dataOffset = localOffset + 30 + lNameLen + lExtraLen;
        out.push({ name: name, method: method, compressedSize: compressedSize, dataOffset: dataOffset });
    }
    const files = [];
    for (const entry of out) {
        try {
            const data = await galDecompressZipEntry(dv, bytes, entry);
            files.push({ name: entry.name, data: data });
        } catch (e) { console.warn('[命运织机] 解压失败:', entry.name, e); }
    }
    return files;
}
function galBlobToWebpBlob(blob, maxH) {
    return new Promise(function (resolve, reject) {
        try {
            const url = URL.createObjectURL(blob);
            const im = new Image();
            im.onload = function () {
                try {
                    const mh = Math.max(200, Number(maxH) || 1200);
                    const scale = Math.min(1, mh / im.height);
                    const w = Math.max(1, Math.round(im.width * scale));
                    const h = Math.max(1, Math.round(im.height * scale));
                    const cv = document.createElement('canvas');
                    cv.width = w; cv.height = h;
                    cv.getContext('2d').drawImage(im, 0, 0, w, h);
                    cv.toBlob(function (b) { try { URL.revokeObjectURL(url); } catch (e0) { } b ? resolve(b) : reject(new Error('图片转换失败')); }, 'image/webp', 0.9);
                } catch (e0) { try { URL.revokeObjectURL(url); } catch (e1) { } reject(e0); }
            };
            im.onerror = function () { try { URL.revokeObjectURL(url); } catch (e0) { } reject(new Error('图片读取失败')); };
            im.src = url;
        } catch (e) { reject(e); }
    });
}
async function galUploadBlobToSprites(name, label, blob, maxH) {
    const lbl = String(label || 'neutral').replace(/[^a-z]/gi, '').toLowerCase() || 'neutral';
    const folder = String(name || '').trim();
    if (!folder) throw new Error('角色名为空');
    const webp = await galBlobToWebpBlob(blob, maxH || 1200);
    const fd = new FormData();
    fd.append('name', folder);
    fd.append('label', lbl);
    fd.append('spriteName', lbl);
    fd.append('avatar', webp, lbl + '.webp');
    let h = {};
    try { h = ctx.getRequestHeaders ? ctx.getRequestHeaders({ omitContentType: true }) : {}; } catch (e) { h = {}; }
    const r = await fetch('/api/sprites/upload', { method: 'POST', headers: h, body: fd });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 120));
    try {
        const list = await (await fetch('/api/sprites/get?name=' + encodeURIComponent(folder) + '&_=' + Date.now())).json();
        const hit = (list || []).find(function (it) { return it && String(it.label).toLowerCase() === lbl; });
        if (hit && hit.path) return { url: hit.path, t: Date.now(), st: true, label: lbl };
    } catch (e) { /* ignore */ }
    return { url: '/characters/' + encodeURIComponent(folder) + '/' + lbl + '.webp', t: Date.now(), st: true, label: lbl };
}
async function galImportZipPack(file, statusEl, previewEl, onChange) {
    const setStatus = function (t) { try { if (statusEl) statusEl.textContent = t; } catch (e) { } };
    setStatus('读取 zip…');
    const buf = await file.arrayBuffer();
    setStatus('解压图片…');
    const files = await galReadZip(buf);
    if (!files.length) throw new Error('压缩包里没有图片（png/webp/jpg）');
    // 分组：zip 内第一层文件夹名；根目录文件用 zip 文件名
    const zipBase = String(file.name || 'material').replace(/\.zip$/i, '');
    const groups = {};
    let emoCount = 0;
    for (const f of files) {
        const parts = f.name.split('/').filter(Boolean);
        const folder = parts.length >= 2 ? parts[0] : '';
        const emo = galEmotionFromFilename(parts[parts.length - 1]);
        if (!emo) continue;
        const gk = folder || zipBase;
        if (!groups[gk]) groups[gk] = { name: gk, items: [] };
        if (groups[gk].items.some(function (x) { return x.label === emo; })) continue;
        groups[gk].items.push({ label: emo, data: f.data, path: f.name });
        emoCount++;
    }
    const keys = Object.keys(groups);
    if (!keys.length) throw new Error('没识别出表情文件（文件名需含 joy/anger/笑/怒 等表情名）');
    setStatus('识别到 ' + keys.length + ' 组 / ' + emoCount + ' 张表情图，确认角色名后导入');
    // 渲染预览
    if (previewEl) {
        previewEl.innerHTML = keys.map(function (k, gi) {
            const g = groups[k];
            const thumbs = g.items.slice(0, 6).map(function (it) {
                let u = '';
                try { u = URL.createObjectURL(new Blob([it.data], { type: 'image/*' })); } catch (e) { u = ''; }
                return '<img src="' + u + '" style="width:36px;height:50px;object-fit:contain;background:rgba(255,255,255,.05);border-radius:4px" title="' + esc(it.label) + '">';
            }).join('');
            return '<div class="ac-zip-group" data-gi="' + gi + '" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px dashed rgba(143,217,182,.18);flex-wrap:wrap">' +
                '<div style="flex:0 0 auto;display:flex;gap:3px">' + thumbs + '</div>' +
                '<div style="flex:1 1 220px;min-width:200px"><div class="hint" style="margin:0 0 4px">压缩包内：' + esc(g.name) + '（' + g.items.length + ' 个表情：' + g.items.map(function (x) { return esc(x.label); }).join('、') + '）</div>' +
                '<input class="ac-input ac-zip-charname" data-gi="' + gi + '" value="' + esc(g.name) + '" placeholder="填角色名（如 角色丙）" style="width:100%;box-sizing:border-box" /></div>' +
                '<button class="ac-btn pri ac-zip-go" data-gi="' + gi + '">导入这个角色</button>' +
                '</div>';
        }).join('') + '<div class="hint" id="ac-zip-done" style="margin-top:6px"></div>';
        const state2 = {};
        keys.forEach(function (k, gi) { state2[gi] = groups[k]; });
        previewEl.querySelectorAll('.ac-zip-go').forEach(function (btn) {
            btn.addEventListener('click', async function () {
                const gi = Number(btn.dataset.gi);
                const g = state2[gi];
                const nameInput = previewEl.querySelector('.ac-zip-charname[data-gi="' + gi + '"]');
                const target = String((nameInput && nameInput.value) || g.name).trim();
                if (!target) { toast('先填角色名', null, 2500); return; }
                btn.disabled = true;
                const sc = assetScope();
                let ok = 0;
                for (let i = 0; i < g.items.length; i++) {
                    const it = g.items[i];
                    btn.textContent = '导入 ' + (i + 1) + '/' + g.items.length + '…';
                    try {
                        const hit = await galUploadBlobToSprites(target, it.label, new Blob([it.data]), 1200);
                        if (it.label === 'neutral') { sc.spriteMap[target] = hit; }
                        else { sc.spriteExpr[target] = sc.spriteExpr[target] || {}; sc.spriteExpr[target][it.label] = hit; }
                        ok++;
                    } catch (e) { console.warn('[命运织机] 导入失败:', it.label, e); }
                }
                persist();
                _galSpriteCache = {};
                _stSpriteCache = {};
                btn.textContent = '完成 ' + ok + '/' + g.items.length;
                toast('已导入 ' + target + '：' + ok + ' 个表情', null, 3000);
                try { const done = previewEl.querySelector('#ac-zip-done'); if (done) done.textContent = '已导入：' + target + '（' + ok + ' 个表情）'; } catch (e) { }
                try { if (onChange) onChange(); } catch (e) { }
                try { if (state.gal) galRender(); } catch (e) { }
            });
        });
    }
    return groups;
}
function galDropStSpriteCache(folder) {
    try {
        if (folder) delete _stSpriteCache[String(folder)];
        else _stSpriteCache = {};
    } catch (e) { /* ignore */ }
}
// 方案 A：素材统一写酒馆官方立绘目录 characters/<角色名>/，不再存扩展私有库
async function importSpriteFor(name, file) {
    await galUploadToSprites(name, 'neutral', file, 1200);
    _galSpriteCache = {};
    galDropStSpriteCache(name);
}
async function importSpriteExprFor(name, en, file) {
    await galUploadToSprites(name, en, file, 1200);
    _galSpriteCache = {};
    galDropStSpriteCache(name);
}
// 清空某个角色的素材：官方目录里的全部表情 + 旧私有记录
async function removeSpriteFor(name) {
    const sc = assetScope();
    const rec = sc.spriteMap[String(name)];
    const ex = sc.spriteExpr[String(name)] || {};
    delete sc.spriteMap[String(name)];
    delete sc.spriteExpr[String(name)];
    persist();
    _galSpriteCache = {};
    galDropStSpriteCache(name);
    let labels = [];
    try {
        const list = await (await fetch('/api/sprites/get?name=' + encodeURIComponent(name) + '&_=' + Date.now())).json();
        labels = (list || []).map(function (it) { return String(it.label || ''); }).filter(Boolean);
    } catch (e) { /* ignore */ }
    if (!labels.length) labels = ['neutral'];
    for (const lb of labels) { try { await galDeleteSpriteFile(name, lb); } catch (e) { /* ignore */ } }
    try { if (rec && rec.url && String(rec.url).indexOf('/user/files/') >= 0) await galDeleteAsset(rec.url); } catch (e) { /* ignore */ }
    for (const lb of Object.keys(ex)) {
        const u = ex[lb] && ex[lb].url;
        if (u && String(u).indexOf('/user/files/') >= 0) { try { await galDeleteAsset(u); } catch (e2) { /* ignore */ } }
    }
}

// 旧私有库素材统计 / 一键迁移到官方目录
function privateSpriteCount() {
    try {
        const s = settings();
        let n = 0;
        const collect = function (sc) {
            if (!sc) return;
            for (const k in (sc.spriteMap || {})) if (sc.spriteMap[k]) n++;
            for (const k in (sc.spriteExpr || {})) n += Object.keys(sc.spriteExpr[k] || {}).length;
        };
        collect(s);
        for (const k in (s.assetsByScope || {})) collect(s.assetsByScope[k]);
        return n;
    } catch (e) { return 0; }
}
async function migratePrivateSprites() {
    const s = settings();
    const scopes = [s];
    for (const k in (s.assetsByScope || {})) scopes.push(s.assetsByScope[k]);
    let moved = 0;
    const failed = [];
    for (const sc of scopes) {
        if (!sc) continue;
        const jobs = [];
        for (const k in (sc.spriteMap || {})) { if (sc.spriteMap[k]) jobs.push({ kind: 'map', name: k, label: 'neutral', rec: sc.spriteMap[k] }); }
        for (const k in (sc.spriteExpr || {})) {
            const ex = sc.spriteExpr[k] || {};
            for (const lb in ex) { if (ex[lb]) jobs.push({ kind: 'expr', name: k, label: lb, rec: ex[lb] }); }
        }
        for (const j of jobs) {
            try {
                const url = String((j.rec && (j.rec.url || j.rec)) || '');
                if (!url) continue;
                const blob = await (await fetch(url)).blob();
                await galUploadBlobToSprites(j.name, j.label, blob, 1200);
                if (j.kind === 'map') delete sc.spriteMap[j.name];
                else { if (sc.spriteExpr[j.name]) delete sc.spriteExpr[j.name][j.label]; }
                moved++;
            } catch (e) { failed.push(j.name + '/' + j.label); }
        }
    }
    persist();
    _galSpriteCache = {};
    _stSpriteCache = {};
    return { moved: moved, failed: failed };
}
// ── 环境池（背景素材） ──
function galEnvList() {
    try {
        const s = settings();
        s.envPool = Array.isArray(s.envPool) ? s.envPool : [];
        return s.envPool;
    } catch (e) { return []; }
}
function galEnvCurrentText() {
    try {
        const st = state.gal;
        if (st && st.segs && st.segs.length) return String(st.segs[Math.min(st.i, st.segs.length - 1)] || '');
        const last = galLastAiMessage();
        return last ? String(last.mes || '') : '';
    } catch (e) { return ''; }
}
function galDesiredEnv() {
    const pool = galEnvList();
    if (!pool.length) return null;
    let s = {}, sc = null;
    try { s = settings(); sc = assetScope(); } catch (e) { /* ignore */ }
    if (s.envAuto !== false) {
        const txt = galEnvCurrentText();
        if (txt) {
            const hit = pool.find(function (e) { return e && e.name && txt.indexOf(String(e.name)) >= 0; });
            if (hit) return hit;
            // 名字片段匹配（如「卧室 clean」→「卧室」；「卧室」出现在正文里）
            let best = null, bestLen = 0;
            pool.forEach(function (e) {
                const nm = String((e && e.name) || '');
                const parts = nm.split(/[\s_\-—·,，。.()（）\[\]【】]+/).filter(function (p) { return p && p.length >= 2; });
                parts.forEach(function (p) {
                    if (txt.indexOf(p) >= 0 && p.length > bestLen) { best = e; bestLen = p.length; }
                });
            });
            if (best) return best;
        }
    }
    if (sc && sc.envActive) {
        const act = pool.find(function (e) { return e && e.id === sc.envActive; });
        if (act) return act;
    }
    return null;
}
function galApplyEnv(env) {
    const bgEl = document.getElementById('ac-gal-bg');
    if (!bgEl) return;
    if (!env || !env.url) { try { galApplyBg(); } catch (e) { /* ignore */ } return; }
    bgEl.style.backgroundImage = 'url("' + String(env.url).replace(/"/g, '\\"') + '")';
    bgEl.style.opacity = '1';
    bgEl.style.filter = 'saturate(1.02)';
    try { if (state.gal) state.gal.envUrl = env.url; } catch (e) { /* ignore */ }
}
function galApplyEnvIfNeeded() {
    try {
        const st = state.gal;
        const env = galDesiredEnv();
        if (env) {
            if (!st || st.envUrl !== env.url) galApplyEnv(env);
        }
        // 没有匹配到环境时保持上一张背景（VN 里不会闪回聊天背景）；
        // 新消息开始时 galLoad 会重建 state.gal，envUrl 清空，重新按首段/当前背景决定
    } catch (e) { /* ignore */ }
}

// ── 「素材」页：环境池 + 每角色立绘/表情 ──
function viewAssets() {
    const s = (function () { try { return settings(); } catch (e) { return {}; } })();
    let h = '<h2>素材管理</h2><div class="hint" style="margin:-4px 0 10px">当前素材作用域：' + esc(assetScopeLabel()) + '（换角色卡/世界书自动切换，互不影响）</div>';
    h += '<div class="ac-card"><div class="h">Galgame 显示设置<span class="i">打开/关闭在左侧或概览</span></div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
        '<button class="ac-btn" id="ac-tw-toggle">打字机：开</button>' +
        '<select class="ac-input" id="ac-tw-speed" style="width:92px"><option value="20">慢</option><option value="40">中</option><option value="80">快</option></select>' +
        '<button class="ac-btn" id="ac-sprite-toggle">立绘：开</button>' +
        '<select class="ac-input" id="ac-sprite-pos" style="width:92px"><option value="right">右侧</option><option value="center">居中</option><option value="left">左侧</option></select>' +
        '<select class="ac-input" id="ac-sprite-size" style="width:92px"><option value="100">小</option><option value="112">中</option><option value="124">大</option><option value="140">特大</option></select>' +
        '<select class="ac-input" id="ac-sprite-fallback" style="width:150px"><option value="default">无立绘用默认素材</option><option value="none">无立绘不显示</option></select>' +
        '<select class="ac-input" id="ac-emo-mode" style="width:150px"><option value="ai">表情：AI 识别</option><option value="keyword">表情：关键词</option></select>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#8fa0a0"><input type="checkbox" id="ac-auto-reroll" /> 截断自动重roll</label>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#8fa0a0" title="让 AI 在每句台词前标注【角色名】，Galgame 立绘/姓名牌 100% 正确"><input type="checkbox" id="ac-speaker-tag" /> AI 标注说话人</label>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#8fa0a0" title="聊天正文里不显示【角色名】：前缀（只影响显示）"><input type="checkbox" id="ac-hide-chat-tags" /> 聊天隐藏标注</label>' +
        '<select class="ac-input" id="ac-auto-reroll-max" style="width:76px"><option value="1">1 次</option><option value="2">2 次</option><option value="3">3 次</option></select>' +
        '<select class="ac-input" id="ac-stall-seconds" style="width:120px" title="连续多少秒没有新字才判定为截断/卡住"><option value="5">无字 5 秒算截断</option><option value="6">6 秒</option><option value="8">8 秒</option><option value="10">10 秒</option></select>' +
        '<select class="ac-input" id="ac-reroll-delay" style="width:132px" title="自动重新生成前等多久（让服务端冷却，降低再次截断概率）"><option value="5">等 5 秒再重roll</option><option value="10">10 秒</option><option value="15">15 秒</option><option value="20">20 秒</option><option value="30">30 秒</option></select>' +
        '</div></div>';
    h += '<div class="ac-card"><div class="h">环境池（背景素材，全局共享）</div>' +
        '<div class="hint">所有角色卡共用；开自动切换后，正文出现素材名（如「卧室」）会自动切图。</div>' +
        '<div style="display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap">' +
        '<button class="ac-btn pri" id="ac-env-upload">上传环境图</button>' +
        '<button class="ac-btn" id="ac-env-import">从酒馆背景库导入</button>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:13px"><input type="checkbox" id="ac-env-auto"' + (s.envAuto !== false ? ' checked' : '') + ' /> 自动按场景切换</label>' +
        '<span class="hint" id="ac-env-current"></span>' +
        '<input type="file" accept="image/*" id="ac-env-file" style="display:none">' +
        '</div><div id="ac-env-picker" style="display:none;margin-top:12px;padding:10px;border:1px dashed rgba(143,217,182,.35);border-radius:10px;max-height:300px;overflow:auto"></div>' +
        '<div id="ac-env-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:12px"></div></div>';
    h += '<div class="ac-card"><div class="h">角色立绘</div>' +
        '<div class="hint">所有素材统一存到酒馆官方立绘目录 <b>characters/&lt;角色名&gt;/</b>（官方表情扩展和 Galgame 共用，不再分两处）。用下面的 zip 一键导入，或单张上传。</div>' +
        '<div style="display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap">' +
        '<button class="ac-btn pri" id="ac-zip-import">导入素材包（zip）</button>' +
        '<span class="hint" id="ac-zip-status" style="margin:0">支持 28 表情包，自动识别中英文表情名</span>' +
        '<input type="file" accept=".zip,application/zip,application/x-zip-compressed" id="ac-zip-file" style="display:none">' +
        '</div>' +
        (privateSpriteCount() > 0 ? '<div style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
            '<button class="ac-btn" id="ac-migrate-legacy">迁移旧私有素材到官方目录（' + privateSpriteCount() + ' 张）</button>' +
            '<span class="hint" id="ac-migrate-msg" style="margin:0"></span></div>' : '') +
        '<div id="ac-zip-preview" style="margin-top:10px"></div>' +
        '<div id="ac-asset-chars" style="margin-top:10px"></div></div>';
    return h;
}
function renderEnvList() {
    const box = $('ac-env-list');
    if (!box) return;
    const sc = (function () { try { return assetScope(); } catch (e) { return { envActive: '' }; } })();
    const pool = galEnvList();
    const cur = $('ac-env-current');
    if (cur) {
        const act = pool.find(function (e) { return e && e.id === sc.envActive; });
        cur.textContent = act ? ('当前背景：' + act.name) : '当前背景：跟随聊天背景';
    }
    if (!pool.length) { box.innerHTML = '<div class="hint">还没有环境素材，点上面「上传环境图」。</div>'; return; }
    box.innerHTML = pool.map(function (e) {
        const isActive = e.id === sc.envActive;
        return '<div style="border:1px solid ' + (isActive ? 'rgba(143,217,182,.7)' : 'rgba(143,217,182,.2)') + ';border-radius:10px;overflow:hidden;background:rgba(255,255,255,.03)">' +
            '<div style="height:90px;background-image:url(&quot;' + esc(e.url) + '&quot;);background-size:cover;background-position:center"></div>' +
            '<div style="padding:6px 8px;display:flex;flex-direction:column;gap:6px">' +
            '<input class="ac-input ac-env-name" data-id="' + esc(e.id) + '" value="' + esc(e.name) + '" style="width:100%;box-sizing:border-box;font-size:12px" />' +
            '<div style="display:flex;gap:6px">' +
            '<button class="ac-btn ac-env-set" data-id="' + esc(e.id) + '" style="flex:1 1 auto;font-size:11px;padding:4px 6px">' + (isActive ? '当前' : '设为当前') + '</button>' +
            '<button class="ac-btn ac-env-del" data-id="' + esc(e.id) + '" style="flex:0 0 auto;font-size:11px;padding:4px 6px">删除</button>' +
            '</div></div></div>';
    }).join('');
    box.querySelectorAll('.ac-env-name').forEach(function (inp) {
        inp.addEventListener('change', function () {
            const e = galEnvList().find(function (x) { return x.id === inp.dataset.id; });
            if (!e) return;
            e.name = String(inp.value || '').trim() || e.name;
            persist();
            renderEnvList();
            try { if (state.gal) galRender(); } catch (err) { /* ignore */ }
        });
    });
    box.querySelectorAll('.ac-env-set').forEach(function (btn) {
        btn.addEventListener('click', function () {
            assetScope().envActive = String(btn.dataset.id || '');
            persist();
            renderEnvList();
            try { if (state.gal) { state.gal.envUrl = ''; galRender(); } } catch (err) { /* ignore */ }
            toast('已设为当前背景', null, 2000);
        });
    });
    box.querySelectorAll('.ac-env-del').forEach(function (btn) {
        btn.addEventListener('click', async function () {
            const id = String(btn.dataset.id || '');
            const sc2 = assetScope();
            const pool2 = galEnvList();
            const idx = pool2.findIndex(function (x) { return x.id === id; });
            if (idx < 0) return;
            const item = pool2[idx];
            pool2.splice(idx, 1);
            settings().envPool = pool2;
            if (sc2.envActive === id) sc2.envActive = '';
            persist();
            try { await galDeleteAsset(item.url); } catch (e) { /* ignore */ }
            renderEnvList();
            try { if (state.gal) { state.gal.envUrl = ''; galRender(); } } catch (e) { /* ignore */ }
            toast('已删除环境素材', null, 2000);
        });
    });
}
function renderAssetChars() {
    const box = $('ac-asset-chars');
    if (!box) return;
    box.innerHTML = '<div class="hint">正在读取角色…</div>';
    const paint = function (names) {
        names = (names || []).filter(Boolean);
        if (!names.length) { box.innerHTML = '<div class="hint">还没读到角色。先去「更新角色」页或选好目标世界书。</div>'; return; }
        const sc = (function () { try { return assetScope(); } catch (e) { return { spriteMap: {}, spriteExpr: {} }; } })();
        const sm = sc.spriteMap || {};
        const sx = sc.spriteExpr || {};
        const emoOpts = GAL_EMO_MAP.map(function (m) { return '<option value="' + esc(m.en) + '">' + esc(m.zh) + '（' + esc(m.en) + '）</option>'; }).join('') + '<option value="neutral">平静（neutral）</option>';
        box.innerHTML = names.map(function (n) {
            const base = sm[n] ? (typeof sm[n] === 'string' ? sm[n] : String(sm[n].url || '')) : '';
            const exprs = sx[n] || {};
            const exprKeys = Object.keys(exprs);
            const chips = exprKeys.map(function (k) {
                const rec = exprs[k];
                const u = rec ? (typeof rec === 'string' ? rec : String(rec.url || '')) : '';
                return '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(143,217,182,.14);border:1px solid rgba(143,217,182,.3);border-radius:999px;padding:2px 8px;font-size:11px">' + esc(k) +
                    '<b class="ac-expr-del" data-name="' + esc(n) + '" data-en="' + esc(k) + '" style="cursor:pointer;color:#ffa0a0">×</b></span>';
            }).join(' ');
            return '<div class="ac-asset-row" data-name="' + esc(n) + '"' + (base ? ' data-hasbase="1"' : '') + ' style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px dashed rgba(143,217,182,.18)">' +
                '<div style="width:46px;height:66px;flex:0 0 auto;border-radius:8px;overflow:hidden;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:11px;color:#8a9">' +
                (base ? '<img src="' + esc(base) + '" style="width:100%;height:100%;object-fit:cover">' : '无') + '</div>' +
                '<div style="flex:1 1 auto;min-width:0">' +
                '<div style="font-size:13px;font-weight:600">' + esc(n) + '</div>' +
                '<div class="hint" style="margin:2px 0 6px">' + (base ? '基础立绘：已上传' : '基础立绘：未上传') + (exprKeys.length ? '　表情：' + exprKeys.join('、') : '') + '</div>' +
                '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
                '<button class="ac-btn ac-base-up" style="font-size:11px;padding:4px 8px" title="写官方目录，label=neutral">上传基础立绘</button>' +
                '<select class="ac-input ac-expr-emo" style="font-size:11px;padding:2px 4px;max-width:130px">' + emoOpts + '</select>' +
                '<button class="ac-btn ac-expr-up" style="font-size:11px;padding:4px 8px">上传表情</button>' +
                '<button class="ac-btn ac-asset-clear" style="font-size:11px;padding:4px 8px" title="删除该角色官方目录里的全部立绘">清除官方素材</button>' +
                '<input type="file" accept="image/*" class="ac-base-file" style="display:none">' +
                '<input type="file" accept="image/*" class="ac-expr-file" style="display:none">' +
                '</div>' +
                (chips ? '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">' + chips + '</div>' : '') +
                '<div class="ac-official-emo" style="margin-top:8px"></div>' +
                '</div></div>';
        }).join('');
        box.querySelectorAll('.ac-asset-row').forEach(function (row) {
            const name = String(row.dataset.name || '');
            const baseFile = row.querySelector('.ac-base-file');
            const baseUp = row.querySelector('.ac-base-up');
            const exprFile = row.querySelector('.ac-expr-file');
            const exprUp = row.querySelector('.ac-expr-up');
            const emoSel = row.querySelector('.ac-expr-emo');
            baseUp.addEventListener('click', function () { try { baseFile.click(); } catch (e) { /* ignore */ } });
            baseFile.addEventListener('change', async function () {
                const f = baseFile.files && baseFile.files[0];
                if (!f) return;
                try { baseUp.textContent = '导入中…'; await importSpriteFor(name, f); toast('基础立绘已导入：' + name, null, 2000); renderAssetChars(); try { if (state.gal) galRender(); } catch (e) { /* ignore */ } }
                catch (e) { toast('导入失败：' + (e.message || e), null, 3500); }
                try { baseFile.value = ''; } catch (e) { /* ignore */ }
            });
            exprUp.addEventListener('click', function () { try { exprFile.click(); } catch (e) { /* ignore */ } });
            exprFile.addEventListener('change', async function () {
                const f = exprFile.files && exprFile.files[0];
                if (!f) return;
                const en = String(emoSel && emoSel.value || 'neutral');
                try { exprUp.textContent = '导入中…'; await importSpriteExprFor(name, en, f); toast('表情已导入：' + name + ' / ' + en, null, 2000); renderAssetChars(); try { if (state.gal) galRender(); } catch (e) { /* ignore */ } }
                catch (e) { toast('导入失败：' + (e.message || e), null, 3500); }
                try { exprFile.value = ''; } catch (e) { /* ignore */ }
            });
            const clr = row.querySelector('.ac-asset-clear');
            if (clr) clr.addEventListener('click', async function () {
                try { await removeSpriteFor(name); toast('已清除：' + name, null, 2000); renderAssetChars(); try { if (state.gal) galRender(); } catch (e) { /* ignore */ } }
                catch (e) { toast('清除失败', null, 3000); }
            });
        });
        // ── 官方 sprites 目录探测：列出每个表情是否已上传（✓已传 / ✗未传），可预览、可删单个 ──
        try {
            (async function () {
                for (const n of names) {
                    try {
                        const list = await (await fetch('/api/sprites/get?name=' + encodeURIComponent(n) + '&_=' + Date.now())).json();
                        const row = box.querySelector('.ac-asset-row[data-name="' + n.replace(/"/g, '\\"') + '"]');
                        if (!row) continue;
                        const arr = Array.isArray(list) ? list : [];
                        const have = {};
                        for (const it of arr) {
                            const lab = String((it && it.label) || '').toLowerCase();
                            if (lab) have[lab] = String((it && it.path) || '');
                        }
                        const neutral = have['neutral'] || have['normal'] || '';
                        if (neutral && row.dataset.hasbase !== '1') {
                            const thumb = row.querySelector('div[style*="width:46px"]');
                            if (thumb) thumb.innerHTML = '<img src="' + esc(neutral) + '" style="width:100%;height:100%;object-fit:contain">';
                        }
                        const known = GAL_EMO_MAP.slice();
                        const knownEns = {};
                        known.forEach(function (m) { knownEns[m.en] = true; });
                        const extra = Object.keys(have).filter(function (k) { return !knownEns[k]; });
                        const total = known.length;
                        let upCount = 0;
                        const chip = function (zh, en, url, on) {
                            if (on) upCount++;
                            const st = on
                                ? 'background:rgba(143,217,182,.16);border:1px solid rgba(143,217,182,.45);color:#cfe9dd'
                                : 'background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.16);color:#6f8080';
                            const title = on ? ('已上传：' + (url || ('characters/' + n + '/' + en + '.webp')) + '（点击预览）') : '未上传：' + en;
                            return '<span class="ac-emo-chip" data-name="' + esc(n) + '" data-en="' + esc(en) + '" data-url="' + esc(url) + '" data-has="' + (on ? '1' : '0') + '" title="' + esc(title) + '" style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:11px;cursor:' + (on ? 'pointer' : 'default') + ';' + st + '">' +
                                (on ? '✓ ' : '✗ ') + esc(zh) + '<span style="opacity:.65">(' + esc(en) + ')</span>' +
                                (on ? '<b class="ac-emo-del" data-name="' + esc(n) + '" data-en="' + esc(en) + '" title="从官方目录删除这个表情" style="cursor:pointer;color:#ff9a9a;font-weight:400;margin-left:2px">×</b>' : '') +
                                '</span>';
                        };
                        const chips2 = known.map(function (m) { return chip(m.zh, m.en, have[m.en] || '', !!have[m.en]); }).join('') +
                            extra.map(function (k) { return chip(k, k, have[k], true); }).join('');
                        const holder = row.querySelector('.ac-official-emo');
                        if (holder) {
                            holder.innerHTML = '<div style="font-size:12px;margin-bottom:6px">' +
                                '<span style="color:#8fd9b6;font-weight:600">官方目录：' + upCount + '/' + total + ' 个表情已上传</span>' +
                                (neutral ? '　<span style="color:#9fb3d9">基础立绘：有 neutral</span>' : '') +
                                (extra.length ? '　<span style="color:#9fb3d9">额外 ' + extra.length + ' 个</span>' : '') +
                                (upCount < total ? '　<span style="color:#c9a96e">还差 ' + (total - upCount) + ' 个</span>' : '　<span style="color:#8fd9b6">全齐</span>') +
                                '　<span style="color:#6f8080">点已上传的可预览</span></div>' +
                                '<div style="display:flex;gap:5px;flex-wrap:wrap">' + chips2 + '</div>';
                            holder.querySelectorAll('.ac-emo-chip[data-has="1"]').forEach(function (el) {
                                el.addEventListener('click', function (ev) {
                                    if (ev && ev.target && ev.target.closest && ev.target.closest('.ac-emo-del')) return;
                                    const u = String(el.dataset.url || '');
                                    if (u) { try { window.open(u, '_blank'); } catch (e) { /* ignore */ } }
                                });
                            });
                            holder.querySelectorAll('.ac-emo-del').forEach(function (el) {
                                el.addEventListener('click', async function (ev) {
                                    if (ev) { try { ev.stopPropagation(); } catch (e) { /* ignore */ } }
                                    const nm = String(el.dataset.name || '');
                                    const en = String(el.dataset.en || '');
                                    if (!nm || !en) return;
                                    if (!confirm('从官方立绘目录删除「' + nm + '」的 ' + en + ' 表情？')) return;
                                    try {
                                        const ok = await galDeleteSpriteFile(nm, en);
                                        if (!ok) throw new Error('删除接口返回失败');
                                        toast('已删除 ' + nm + ' / ' + en, null, 2000);
                                        try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                                        renderAssetChars();
                                    } catch (e) { toast('删除失败：' + (e.message || e), null, 3000); }
                                });
                            });
                        }
                        const hint = row.querySelector('.hint');
                        if (hint) {
                            const baseTxt = row.dataset.hasbase === '1' ? '基础立绘：已上传'
                                : (neutral ? '基础立绘：官方目录有 neutral' : '基础立绘：未上传');
                            hint.innerHTML = baseTxt +
                                '　<span style="color:#8fd9b6;font-weight:600">官方目录 ' + upCount + '/' + total + ' 个表情</span>' +
                                '（Galgame 直接使用）';
                        }
                    } catch (e) { /* ignore */ }
                }
            })();
        } catch (e) { /* ignore */ }
        box.querySelectorAll('.ac-expr-del').forEach(function (el) {
            el.addEventListener('click', async function () {
                const nm = String(el.dataset.name || '');
                const en = String(el.dataset.en || '');
                const s3 = assetScope();
                const rec = (s3.spriteExpr || {})[nm] && (s3.spriteExpr[nm] || {})[en];
                if (s3.spriteExpr && s3.spriteExpr[nm]) { delete s3.spriteExpr[nm][en]; if (!Object.keys(s3.spriteExpr[nm]).length) delete s3.spriteExpr[nm]; }
                persist();
                _galSpriteCache = {};
                galDropStSpriteCache(nm);
                try { await galDeleteSpriteFile(nm, en); } catch (e) { /* ignore */ }
                if (rec) { try { await galDeleteAsset(typeof rec === 'string' ? rec : rec.url); } catch (e) { /* ignore */ } }
                renderAssetChars();
                try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
            });
        });
    };
    // 角色清单必须对应当前世界书：缓存书不一致就先刷新，避免显示旧书角色
    let _book = '';
    try { _book = effectiveBook() || ''; } catch (e) { /* ignore */ }
    const _cacheOk = !!(state.dirCache && (!_book || state.dirCache.book === _book));
    if (_cacheOk) {
        let names0 = [];
        try { (state.dirCache && state.dirCache.chars || []).forEach(function (c) { const n = c && c.name; if (n) names0.push(String(n)); }); } catch (e) { /* ignore */ }
        try { Object.keys(assetScope().spriteMap || {}).forEach(function (n) { if (names0.indexOf(n) < 0) names0.push(n); }); } catch (e) { /* ignore */ }
        if (names0.length) paint(names0);
    } else {
        box.innerHTML = '<div class="hint">正在读取当前世界书的角色…</div>';
    }
    Promise.resolve().then(async function () {
        try {
            if (!_cacheOk) { try { await refreshDirCache(_book || undefined); } catch (e) { /* ignore */ } }
            const list = await listCharacters(effectiveBook());
            const fresh = (list || []).map(function (x) { return String((x && x.name) || '').trim(); }).filter(Boolean);
            try { Object.keys(assetScope().spriteMap || {}).forEach(function (n) { if (fresh.indexOf(n) < 0) fresh.push(n); }); } catch (e) { /* ignore */ }
            if (fresh.length) paint(fresh);
            else if (!_cacheOk) paint([]);
        } catch (e) { /* ignore */ }
    });
}
function wireAssets() {
    const file = $('ac-env-file');
    const up = $('ac-env-upload');
    if (up && file) {
        up.addEventListener('click', function () { try { file.click(); } catch (e) { /* ignore */ } });
        file.addEventListener('change', async function () {
            const f = file.files && file.files[0];
            if (!f) return;
            try {
                up.textContent = '上传中…';
                const hit = await galUploadAsset(f, 'fateloom_env', 1600);
                const s2 = settings();
                s2.envPool = Array.isArray(s2.envPool) ? s2.envPool : [];
                const baseName = String(f.name || '环境').replace(/\.[^.]+$/, '');
                s2.envPool.push({ id: 'env_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: baseName, url: hit.url, t: hit.t });
                persist();
                toast('环境素材已上传：' + baseName, null, 2500);
                renderEnvList();
                try { if (state.gal) { state.gal.envUrl = ''; galRender(); } } catch (e) { /* ignore */ }
            } catch (e) {
                toast('上传失败：' + (e.message || e), null, 3500);
            }
            up.textContent = '上传环境图';
            try { file.value = ''; } catch (e) { /* ignore */ }
        });
    }
    // 从酒馆背景库导入
    const imp = $('ac-env-import');
    const picker = $('ac-env-picker');
    if (imp && picker) {
        imp.addEventListener('click', async function () {
            if (picker.style.display !== 'none') { picker.style.display = 'none'; return; }
            picker.style.display = 'block';
            picker.innerHTML = '<div class="hint">正在读取酒馆背景库…</div>';
            try {
                const res = await api('/api/backgrounds/all', {});
                const imgs = (res && res.images) || [];
                if (!imgs.length) { picker.innerHTML = '<div class="hint">酒馆背景库里没有图片。</div>'; return; }
                picker.innerHTML = '<div class="hint" style="margin-bottom:8px">点一张加入环境池（名字取文件名，之后可改名）：</div>' +
                    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">' +
                    imgs.map(function (im) {
                        const fn = String(im.filename || '');
                        const base = fn.replace(/\.[^.]+$/, '');
                        const segs = fn.split('/').map(encodeURIComponent).join('/');
                        return '<div class="ac-env-pick" data-fn="' + esc(fn) + '" data-name="' + esc(base) + '" style="cursor:pointer;border:1px solid rgba(143,217,182,.25);border-radius:8px;overflow:hidden">' +
                            '<div style="height:62px;background-image:url(&quot;/thumbnail?type=bg&file=' + esc(encodeURIComponent(fn)) + '&quot;);background-size:cover;background-position:center"></div>' +
                            '<div style="font-size:11px;padding:3px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(base) + '</div></div>';
                    }).join('') + '</div>';
                picker.querySelectorAll('.ac-env-pick').forEach(function (el) {
                    el.addEventListener('click', function () {
                        const fn = String(el.dataset.fn || '');
                        const nm = String(el.dataset.name || '') || fn;
                        const s2 = settings();
                        s2.envPool = Array.isArray(s2.envPool) ? s2.envPool : [];
                        const url = '/backgrounds/' + fn.split('/').map(encodeURIComponent).join('/');
                        if (s2.envPool.some(function (e) { return e && e.url === url; })) { toast('这张已经在环境池里了', null, 2000); return; }
                        s2.envPool.push({ id: 'env_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: nm, url: url, t: Date.now() });
                        persist();
                        toast('已加入环境池：' + nm, null, 2000);
                        renderEnvList();
                        try { if (state.gal) { state.gal.envUrl = ''; galRender(); } } catch (e) { /* ignore */ }
                    });
                });
            } catch (e) {
                picker.innerHTML = '<div class="hint">读取背景库失败：' + esc(String(e && e.message || e)) + '</div>';
            }
        });
    }
    const auto = $('ac-env-auto');
    if (auto) {
        auto.addEventListener('change', function () {
            settings().envAuto = !!auto.checked;
            persist();
            try { if (state.gal) { state.gal.envUrl = ''; galRender(); } } catch (e) { /* ignore */ }
        });
    }
    try { wireGalDisplaySettings(); } catch (e) { /* ignore */ }
    const migBtn = $('ac-migrate-legacy');
    if (migBtn && !migBtn._bound) {
        migBtn._bound = true;
        migBtn.addEventListener('click', async function () {
            const msg = $('ac-migrate-msg');
            migBtn.disabled = true;
            migBtn.textContent = '迁移中…';
            if (msg) msg.textContent = '';
            try {
                const r = await migratePrivateSprites();
                if (msg) msg.textContent = '已迁移 ' + r.moved + ' 张' + (r.failed.length ? '，失败 ' + r.failed.length : '');
                toast('旧素材迁移：' + r.moved + ' 张' + (r.failed.length ? '，失败 ' + r.failed.length : ''), null, 4000);
                render();
            } catch (e) {
                if (msg) msg.textContent = '迁移失败：' + (e.message || e);
                migBtn.disabled = false;
            }
        });
    }
    const zipBtn = $('ac-zip-import');
    const zipFile = $('ac-zip-file');
    const zipPreview = $('ac-zip-preview');
    const zipStatus = $('ac-zip-status');
    if (zipBtn && zipFile) {
        if (!zipBtn._bound) {
            zipBtn._bound = true;
            zipBtn.addEventListener('click', function () { try { zipFile.click(); } catch (e) { /* ignore */ } });
            zipFile.addEventListener('change', async function () {
                const f = zipFile.files && zipFile.files[0];
                if (!f) return;
                try {
                    await galImportZipPack(f, zipStatus, zipPreview, function () { try { renderAssetChars(); } catch (e) { /* ignore */ } });
                } catch (e) {
                    if (zipStatus) zipStatus.textContent = '导入失败：' + (e.message || e);
                    toast('素材包导入失败：' + (e.message || e), null, 4000);
                }
                try { zipFile.value = ''; } catch (e) { /* ignore */ }
            });
        }
    }
    renderEnvList();
    renderAssetChars();
}

function galPaintSpriteManager(box, names) {
    if (!box) return;
    names = (names || []).filter(Boolean);
    if (!names.length) {
        box.innerHTML = '<div class="hint">还没读到角色。先去「更新角色」页或选好目标世界书。</div>';
        return;
    }
    const sm = (function () { try { return settings().spriteMap || {}; } catch (e) { return {}; } })();
    box.innerHTML = names.map(function (n) {
        const rec = sm[n];
        const url = rec ? (typeof rec === 'string' ? rec : String(rec.url || '')) : '';
        const has = !!url;
        return '<div class="ac-sprite-row" data-name="' + esc(n) + '" style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px dashed rgba(143,217,182,.18)">' +
            '<div style="width:38px;height:54px;flex:0 0 auto;border-radius:6px;overflow:hidden;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:11px;color:#8a9">' +
            (has ? '<img src="' + esc(url) + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + Date.now() + '" style="width:100%;height:100%;object-fit:cover">' : '无') +
            '</div>' +
            '<div style="flex:1 1 auto;min-width:0"><div style="font-size:13px">' + esc(n) + '</div><div class="hint" style="margin:0">' + (has ? '已导入（优先使用）' : '未导入（用默认素材包）') + '</div></div>' +
            '<button class="ac-btn" data-act="up">上传</button>' +
            (has ? '<button class="ac-btn" data-act="del">清除</button>' : '') +
            '<input type="file" accept="image/*" style="display:none">' +
            '</div>';
    }).join('');
    box.querySelectorAll('.ac-sprite-row').forEach(function (row) {
        const name = String(row.dataset.name || '');
        const file = row.querySelector('input[type=file]');
        const up = row.querySelector('[data-act="up"]');
        if (up && file) {
            up.addEventListener('click', function () { try { file.click(); } catch (e) { /* ignore */ } });
            file.addEventListener('change', async function () {
                const f = file.files && file.files[0];
                if (!f) return;
                try {
                    up.textContent = '导入中…';
                    await importSpriteFor(name, f);
                    toast('立绘已导入：' + name, null, 2500);
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                    renderSpriteManager();
                } catch (e) {
                    toast('立绘导入失败：' + (e.message || e), null, 4000);
                    up.textContent = '上传';
                }
                try { file.value = ''; } catch (e) { /* ignore */ }
            });
        }
        const del = row.querySelector('[data-act="del"]');
        if (del) {
            del.addEventListener('click', async function () {
                try {
                    await removeSpriteFor(name);
                    toast('已清除立绘：' + name, null, 2500);
                    try { if (state.gal) galRender(); } catch (e) { /* ignore */ }
                    renderSpriteManager();
                } catch (e) { toast('清除失败', null, 3000); }
            });
        }
    });
}
async function renderSpriteManager() {
    const box = $('ac-sprite-manage');
    if (!box) return;
    // 先用缓存角色立即渲染（不等网络）
    let names = [];
    try {
        (state.dirCache && state.dirCache.chars || []).forEach(function (c) {
            const n = c && c.name;
            if (n && names.indexOf(String(n)) < 0) names.push(String(n));
        });
    } catch (e) { /* ignore */ }
    try { Object.keys(settings().spriteMap || {}).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); }); } catch (e) { /* ignore */ }
    if (names.length) galPaintSpriteManager(box, names);
    // 再异步补全（以织机识别结果为准）
    try {
        const list = await listCharacters(effectiveBook());
        const fresh = (list || []).map(function (x) { return String((x && x.name) || '').trim(); }).filter(Boolean);
        try { Object.keys(settings().spriteMap || {}).forEach(function (n) { if (fresh.indexOf(n) < 0) fresh.push(n); }); } catch (e) { /* ignore */ }
        if (fresh.length) galPaintSpriteManager(box, fresh);
    } catch (e) { /* ignore */ }
}

// 计算「当前场景」的角色名单：只包含本场景内（两个 --- 之间）会说话的角色
function galSceneCastFor(st, speakers, i) {
    try {
        const segs = st.segs || [];
        if (!segs.length) return [];
        if (galIsSceneBreakSeg(segs[i])) return [];
        const SOFT_MOVE_RE = /(来到|走进|步入|回到|踏入|推开[^。！？\n]{0,6}门|离开[^。！？\n]{0,8}(?:前往|走向)|转场|场景切换)[^。！？\n]{0,12}(卧室|主卧|次卧|浴室|洗手间|客厅|厨房|走廊|玄关|书房|阳台|门口|院子|楼下|二楼|楼上|房间|房)/;
        const SOFT_TIME_RE = /^(次日|第二天|数小时后|半小时后|几小时后|夜深了|夜幕降临|转眼间|不知过了多久|到了晚上)/;
        const isSoftSceneSeg = function (seg) {
            const s2 = String(seg || '');
            if (!s2 || s2.indexOf('“') >= 0 || s2.indexOf('「') >= 0) return false;
            return SOFT_MOVE_RE.test(s2) || SOFT_TIME_RE.test(s2);
        };
        // 当前段本身就是转场旁白 → 不显示任何立绘，等下一段按新场景算
        if (isSoftSceneSeg(segs[i])) return [];
        let start = 0;
        for (let k = i - 1; k >= 0; k--) {
            if (galIsSceneBreakSeg(segs[k])) { start = k + 1; break; }
            if (isSoftSceneSeg(segs[k])) { start = k + 1; break; }
        }
        let end = segs.length - 1;
        for (let k = i + 1; k < segs.length; k++) {
            if (galIsSceneBreakSeg(segs[k])) { end = k - 1; break; }
            if (isSoftSceneSeg(segs[k])) { end = k - 1; break; }
        }
        // 名字别名去重：小满 / 林小满 这类后缀相同的名字只保留长名
        const dedupe = function (arr) {
            const out = [];
            for (const nm0 of arr) {
                let nm = nm0;
                for (const other of arr) {
                    if (other === nm || other.length <= nm.length) continue;
                    if (other.slice(other.length - nm.length) === nm) { nm = other; break; }
                }
                if (nm && out.indexOf(nm) < 0) out.push(nm);
            }
            return out;
        };
        const order = dedupe((function () {
            const o = [];
            for (let k = start; k <= end; k++) {
                const nm = speakers[k];
                if (nm && o.indexOf(nm) < 0) o.push(nm);
            }
            return o;
        })());
        // 这个场景里没有 NPC 说话（纯旁白/只推进）→ 退化为「旁白里提到的角色」
        if (!order.length) {
            const allNames = (function () { try { return galNamePairs(); } catch (e) { return []; } })();
            const hits = [];
            for (let k = start; k <= end; k++) {
                const raw = String(segs[k] || '');
                if (galIsSceneBreakSeg(raw)) continue;
                const txt = galStripSpeakerTag(raw).replace(/<[^>]+>/g, '');
                for (const pr of allNames) {
                    if (!pr || pr.user || !pr.key || pr.key.length < 2) continue;
                    const pos = txt.indexOf(pr.key);
                    if (pos >= 0) hits.push([pos, k, pr.name]);
                }
            }
            hits.sort(function (a, b) { return a[0] - b[0]; });
            return dedupe(hits.map(function (x) { return x[2]; })).slice(0, 3);
        }
        let main = speakers[i] || '';
        if (!main) { for (let k = i - 1; k >= start; k--) { if (speakers[k]) { main = speakers[k]; break; } } }
        if (!main) main = order[0];
        const roster = [main];
        for (let k = i; k <= end; k++) { const nm = speakers[k]; if (nm && roster.indexOf(nm) < 0) roster.push(nm); }
        for (let k = start; k < i; k++) { const nm = speakers[k]; if (nm && roster.indexOf(nm) < 0) roster.push(nm); }
        return dedupe(roster).slice(0, 3);
    } catch (e) { return []; }
}

function galUpdateSprite(speaker, segText, narration, forcedEmo) {
    const wrap = document.getElementById('ac-gal-sprites');
    if (!wrap) return;
    const s = (function () { try { return settings(); } catch (e) { return {}; } })();
    if (s.vnSprite === false) { wrap.classList.add('hide'); wrap.innerHTML = ''; return; }
    wrap.classList.remove('hide');
    const st = state.gal;
    if (!st) return;
    st.spriteCast = Array.isArray(st.spriteCast) ? st.spriteCast : [];
    st.spriteEmo = st.spriteEmo || {};
    // 场景白名单：防止情绪时间轴/其它调用把别的场景的人塞回来
    const _scene = Array.isArray(st.sceneCast) ? st.sceneCast : null;
    if (speaker && _scene && _scene.indexOf(speaker) < 0) speaker = '';
    if (speaker) {
        if (st.spriteCast.indexOf(speaker) < 0) st.spriteCast.push(speaker);
        st.lastSpeaker = speaker;
        st.spriteEmo[speaker] = forcedEmo || galSpriteEmotion(segText);
        try { if (forcedEmo || !(state.gal && state.gal.emoTimeline)) galSetEmoBadge(st.spriteEmo[speaker], speaker, (forcedEmo && forcedEmo.src) || ''); } catch (e) { /* ignore */ }
    }
    if (_scene && _scene.length) {
        st.spriteCast = st.spriteCast.filter(function (n) { return _scene.indexOf(n) >= 0; });
        if (!st.spriteCast.length) st.spriteCast = _scene.slice(0, 3);
    }
    if (st.spriteCast.length > 3) st.spriteCast = st.spriteCast.slice(st.spriteCast.length - 3);
    let cast = st.spriteCast.slice();
    try { if (window.innerWidth < 600 && cast.length > 2) cast = cast.slice(0, 2); } catch (e) { /* ignore */ }
    const mainName = speaker || st.lastSpeaker || (cast.length ? cast[cast.length - 1] : '');
    if (!mainName) { wrap.innerHTML = ''; return; }
    if (cast.indexOf(mainName) < 0) cast.push(mainName);
    const pos = (function () { const p = String(s.vnSpritePos || 'center'); return /^(left|center|right)$/.test(p) ? p : 'center'; })();
    const _rawSize = Number(s.vnSpriteSize) || 112;
    let h = _rawSize < 90 ? (_rawSize <= 60 ? 100 : (_rawSize <= 75 ? 112 : 124)) : _rawSize;
    h = Math.max(85, Math.min(150, h));
    try { if (window.innerWidth < 600) h = Math.min(h, 96); } catch (e) { /* ignore */ }
    const sink = Math.round(Math.max(6, Math.min(58, (h - 86) * 1.05)));
    wrap.style.setProperty('--ac-sprite-h', h + '%');
    wrap.style.setProperty('--ac-sprite-sink', sink + '%');
    const sides = cast.filter(function (n) { return n !== mainName; });
    const sideOffsets = [3, 16];   // vw
    // 移除不在 cast 里的图
    Array.from(wrap.children).forEach(function (el) {
        if (el.dataset && cast.indexOf(el.dataset.name) < 0) el.remove();
    });
    const setStyle = function (img, isMain) {
        img.classList.toggle('main', isMain);
        img.classList.toggle('side', !isMain);
        img.style.marginLeft = '0';
        img.style.marginRight = '0';
        if (isMain) {
            if (pos === 'center') {
                img.style.left = '6%';
                img.style.right = '0';
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
            } else if (pos === 'right') {
                img.style.left = 'auto';
                img.style.right = '5vw';
            } else {
                img.style.left = '5vw';
                img.style.right = 'auto';
            }
        } else {
            const i = Math.max(0, sides.indexOf(img.dataset.name));
            let _mobile = false;
            try { _mobile = window.innerWidth < 600; } catch (e) { /* ignore */ }
            if (_mobile) {
                // 窄屏：侧位立绘分到左右两边，避免挤在中间重叠
                if (i % 2 === 0) { img.style.left = '1vw'; img.style.right = 'auto'; }
                else { img.style.left = 'auto'; img.style.right = '1vw'; }
            } else {
                const off = sideOffsets[Math.min(i, sideOffsets.length - 1)];
                if (pos === 'left') { img.style.left = 'auto'; img.style.right = off + 'vw'; }
                else { img.style.left = off + 'vw'; img.style.right = 'auto'; }
            }
        }
    };
    cast.forEach(function (nm) {
        const isMain = (nm === mainName);
        const emo = (isMain && speaker) ? st.spriteEmo[nm] : (st.spriteEmo[nm] || { zh: 'normal', en: 'neutral' });
        galResolveSprite(nm, emo).then(function (hit) {
            let img = Array.from(wrap.children).find(function (el) { return el.dataset && el.dataset.name === nm; });
            if (!hit) { if (img) img.remove(); return; }
            if (!img) {
                img = document.createElement('img');
                img.className = 'ac-gal-sprite' + (hit.avatar ? ' avatar' : '');
                img.dataset.name = nm;
                img.alt = String(nm);
                img.src = hit.url;
                wrap.appendChild(img);
                try { void img.offsetWidth; } catch (e) { /* ignore */ }
                img.classList.add('on');
            } else if (img.getAttribute('src') !== hit.url) {
                // 表情切换：按情绪挂一个微动画（跳/沉/抖）
                try {
                    const emote = galEmoteClass(emo);
                    if (emote) {
                        img.classList.remove('emote-jump', 'emote-sink', 'emote-shake');
                        img.classList.add(emote);
                        setTimeout(function () { try { img.classList.remove(emote); } catch (e0) { /* ignore */ } }, 760);
                    }
                } catch (e0) { /* ignore */ }
                // 表情切换：先淡出，换图后再淡入
                try {
                    img.style.transition = 'opacity .16s ease';
                    img.style.opacity = '0';
                    setTimeout(function () {
                        try {
                            img.src = hit.url;
                            img.classList.toggle('avatar', !!hit.avatar);
                            const back = function () { try { img.style.opacity = '1'; } catch (e0) { /* ignore */ } };
                            img.addEventListener('load', back, { once: true });
                            setTimeout(back, 400);
                        } catch (e0) { /* ignore */ }
                    }, 170);
                } catch (e0) {
                    img.src = hit.url;
                    img.classList.toggle('avatar', !!hit.avatar);
                }
            }
            setStyle(img, isMain);
            img.classList.toggle('dim', narration ? true : !isMain);
        }).catch(function () { /* ignore */ });
    });
}

// 按字素簇切分（emoji/组合字符不会被拆成乱码方块）
function galGraphemes(text) {
    const t = String(text || '');
    try {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const seg = new Intl.Segmenter('zh', { granularity: 'grapheme' });
            return Array.from(seg.segment(t), function (x) { return x.segment; });
        }
    } catch (e) { /* ignore */ }
    return Array.from(t);
}

// 模型偶尔会吐 JSON 转义（\u6ca1\u95ee…），显示前还原成中文
function galDecodeEscapes(s) {
    let t = String(s || '');
    if (t.indexOf('\\u') < 0 && t.indexOf('\\n') < 0) return t;
    t = t.replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); });
    t = t.replace(/\\n/g, '\n').replace(/\\t/g, ' ').replace(/\\r/g, '');
    t = t.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    return t;
}

// 场景分隔标记：原文里的单独一行 --- 会变成这个段，用于重置立绘场景
const GAL_SCENE_MARK = '\u0000SCENE\u0000';
function galIsSceneBreakSeg(seg) {
    const s = String(seg || '').trim();
    return s === GAL_SCENE_MARK || /^-{3,}$/.test(s) || /^—{3,}$/.test(s) || /^＝{3,}$/.test(s) || /^\*{3,}$/.test(s);
}

function galCleanText(t) {
    let s = String(t || '');
    s = s.replace(/<report[\s\S]*?<\/report[^>]*>/gi, '');
    s = s.replace(/<details>/gi, '').replace(/<\/details>/gi, '')
        .replace(/<summary[^>]*>/gi, '').replace(/<\/summary>/gi, '')
        .replace(/<[^>]+>/g, '');
    s = s.replace(/\*\*/g, '').replace(/\*/g, '');
    s = s.replace(/^[\s]*---[\s]*$/gm, '');
    return s.trim();
}

function galSegmentsFromRaw(raw) {
    let text = String(raw || '');
    // 先摘掉 report 块（兼容没闭合的：一直摘到结尾）
    text = text.replace(/<report[^>]*>[\s\S]*?(?:<\/report[^>]*>|$)/gi, '');
    // 提取 game 块：没闭合（生成被截断）时保留已写出来的正文
    const go = text.search(/<game[^>]*>/i);
    if (go >= 0) {
        const inner = text.slice(go).replace(/^<game[^>]*>/i, '');
        const close = inner.search(/<\/game>/i);
        text = close >= 0 ? inner.slice(0, close) : inner;
    }
    text = text.replace(/<StatusPlaceHolderImpl\s*\/?>/gi, '');
    text = text.replace(/<\/?game[^>]*>/gi, '');
    text = text.replace(/<\/?report[^>]*>/gi, '');
    text = text.replace(/\[\]\[\]|\[\]|\[\]\]/g, '');
    text = galDecodeEscapes(text);
    // 场景分隔线：保留成独立标记段（用于立绘按场景切换）
    text = text.replace(/^[ \t]*(?:-{3,}|—{3,}|＝{3,})[ \t]*$/gm, '\n\n' + GAL_SCENE_MARK + '\n\n');
    const lines = text.split(/\r?\n/);
    const segs = [];
    let cur = [];
    let depth = 0;
    let detailsLines = 0;
    for (const ln of lines) {
        const open = (ln.match(/<details/gi) || []).length;
        const close = (ln.match(/<\/details>/gi) || []).length;
        if (open > 0) detailsLines = 0;
        depth = Math.max(0, depth + open - close);
        if (depth > 0) {
            detailsLines++;
            // 【评审修复】模型漏写 </details> 或流式半截时，别把后面整篇正文都吞进同一段
            if (detailsLines > 6 || /^【[^】\n]{1,16}】\s*[：:]?\s*[“"「『]/.test(ln.trim()) || galIsSceneBreakSeg(ln.trim())) {
                cur.push('</details>');
                depth = 0;
                detailsLines = 0;
            }
        }
        if (!ln.trim() && depth <= 0) {
            if (cur.length) { segs.push(cur.join('\n').trim()); cur = []; }
            continue;
        }
        cur.push(ln);
    }
    if (depth > 0) cur.push('</details>');
    if (cur.length) segs.push(cur.join('\n').trim());
    return segs
        .filter(function (s) { return s && (s === GAL_SCENE_MARK || !/^<\/?report/i.test(s)); })
        .filter(function (s) { return s === GAL_SCENE_MARK || galCleanText(s).length > 0; });
}

// 用酒馆自己的排版管线把一段 markdown 变成 HTML（保留粗体/斜体/折叠/正则样式）
function galToHtml(md) {
    const text = String(md || '');
    try {
        if (typeof ctx.messageFormatting === 'function') {
            const html = ctx.messageFormatting(text, ctx.name2 || '', false, false, undefined, {}, false);
            if (html) return html;
        }
    } catch (e) { /* fall through */ }
    return esc(text).replace(/\n/g, '<br>');
}

function galLastAiMessage() {
    try {
        const chat = (ctx.chat || []);
        for (let i = chat.length - 1; i >= 0; i--) {
            if (chat[i] && !chat[i].is_user && !chat[i].is_system && chat[i].mes) return chat[i];
        }
    } catch (e) { /* ignore */ }
    return null;
}

// 检测最后一条 AI 回复是否被截断 / 只有剧情规划没有正文
function galLastAiTruncated() {
    try {
        const _chat = (live().chat || ctx.chat || []);
        const _lastChat = _chat[_chat.length - 1];
        if (_lastChat && _lastChat.is_user) return false;   // 最后一条是用户消息 = 等回复/没回复，不算截断
        const m = galLastAiMessage();
        if (!m) return false;
        const raw = String(m.mes || '');
        if (!raw.trim()) return false;
        const tail = raw.slice(-320);
        const hasAdvance = /剧情推进\s*[:：]/.test(tail);   // 结尾有「剧情推进：」= 模型已经写完收尾
        const hasOpen = /<game[^>]*>/i.test(raw);
        const hasClose = /<\/game>/i.test(raw);
        if (hasAdvance) return false;                          // 有收尾推进 → 判定完整，绝不重roll
        if (hasOpen && !hasClose) return true;                 // 正文没写完就被截断
        if (!hasOpen) {
            if (/<report[^>]*>/i.test(raw) && !/<\/report[^>]*>/i.test(raw)) return true;
            if (/<StatusPlaceHolderImpl/i.test(raw)) return true;
            if (/剧情规划|剧情编排|本轮的剧情|本喵的/.test(raw)) return true;
        }
        return false;
    } catch (e) { return false; }
}

// 排除地名/建筑名/设定条目名，避免把「又里莊」这种当成人名
function galIsNotPersonName(n) {
    const s = String(n || '').trim();
    if (!s) return true;
    if (/[（(]/.test(s)) return true;
    if (/(荘|莊|庄|公寓|大楼|大厦|酒店|旅馆|餐厅|咖啡馆|学校|医院|商店|超市|公园|车站|街|町|集团|公司|小区|花园|广场|府|城|殿|塔|店|馆|院|屋|房|室|楼|层|号)$/.test(s)) return true;
    if (/(世界|设定|规则|地图|指南|介绍|说明|档案|条目|关系|速览|速查|大纲|纪要|记录|目录|列表|资料|背景|前言|序章|交易|房租|契约|系统|面板|状态|管理|能力|技能|物品|地点|时间|事件|剧情|选项|表格|数据|信息|提示|人设|人物|角色|NPC|管理员|主角|玩家|旁白|服装|服饰|外貌|长相|台词|语气|口癖|动作|行为|表达|方式|主线|支线|节点|剧情|故事|场景|地点|物品|道具|称呼|名字|能力|技能|习惯|态度|心理|秘密|身份|经历|过去|目标|目的|计划|约定|规则|关系|背景|设定|状态|数据|信息|提示|选项|表格)/.test(s)) return true;
    return false;
}

function galNamePairs() {
    const canon = [];
    let userName = '';
    try { userName = String(ctx.name1 || '').trim(); } catch (e) { /* ignore */ }
    const add = function (n) {
        n = String(n || '').trim();
        if (!n || canon.indexOf(n) >= 0) return;
        if (galIsNotPersonName(n)) return;
        canon.push(n);
    };
    try {
        const gl = Array.isArray(state.galNames) ? state.galNames : [];
        if (gl.length) {
            gl.forEach(function (n) { add(n); });
        } else {
            ((state.dirCache && state.dirCache.chars) || []).forEach(function (c) { if (c && c.name) add(c.name); });
        }
    } catch (e) { /* ignore */ }
    try { add(ctx.name1); } catch (e) { /* ignore */ }
    try { add(ctx.name2); } catch (e) { /* ignore */ }
    const pairs = [];
    canon.forEach(function (n) {
        const isUser = !!(userName && n === userName);
        pairs.push({ key: n, name: n, user: isUser });
        // 角色丁 → 小丁 这种简称
        if (n.length >= 3) {
            const short = n.slice(1);
            if (short.length >= 2) pairs.push({ key: short, name: n, user: isUser });
        }
    });
    pairs.sort(function (a, b) { return b.key.length - a.key.length; });
    return pairs;
}

// 一段里最早出现的角色名（判断主语用）
function galFirstNamed(text, pairs) {
    const t = String(text || '');
    let best = null, bestPos = Infinity;
    for (const pr of pairs) {
        const p = t.indexOf(pr.key);
        if (p >= 0 && p < bestPos) { bestPos = p; best = pr.name; }
    }
    return best || '';
}

// 推断这一段是谁在说话（纯函数：names 由外部传入）


let _galSpkCacheSegs = null;
let _galSpkCacheNamesKey = '';
let _galSpkCacheOut = [];
function galComputeSpeakers(segs, names) {
    try {
        const segsArr = Array.isArray(segs) ? segs : [];
        const keys = (names || []).map(function (n) { return String(n.key || n.name || '') + '\u0001' + String(n.name || '') + '\u0001' + (n.user ? '1' : '0'); }).join('\u0002');
        if (_galSpkCacheSegs === segsArr && _galSpkCacheNamesKey === keys && _galSpkCacheOut.length === segsArr.length) return _galSpkCacheOut.slice();
        const out = galV2Resolve(segsArr, names || []);
        _galSpkCacheSegs = segsArr;
        _galSpkCacheNamesKey = keys;
        _galSpkCacheOut = out;
        return out.slice();
    } catch (e) {
        try { return new Array((segs || []).length).fill(''); } catch (e2) { return []; }
    }
}
function galSpeaker(segs, i, names) {
    const out = galComputeSpeakers(segs, names);
    return out[i] || '';
}


// 判断一个候选词像不像角色名（用于名字表外的配角）
function galIsValidNameCand(cand) {
    const s = String(cand || '').trim();
    if (s.length < 2 || s.length > 4) return false;
    if (/^[一二三四五六七八九十]/.test(s)) return false;
    const stop = ['爸爸', '妈妈', '弟弟', '哥哥', '姐姐', '妹妹', '孩子', '他们', '她们', '我们', '你们', '自己', '这个', '那个', '这里', '那里', '现在', '刚才', '以后', '然后', '声音', '目光', '房间', '空气', '走廊', '沙发', '床上', '门口', '身边', '身后', '面前', '怀里', '心里', '眼前', '灯光', '月光', '阳光', '男人', '女人', '少年', '少女', '主人', '先生', '女士', '老师', '同学', '家伙', '笨蛋', '混蛋', '小子', '两人', '众人', '几人', '亮面', '皮革', '手指', '手腕', '肩膀', '脸颊', '身体', '皮肤', '衣服', '毛衣', '皮衣', '镜面', '白雾', '水珠', '浴缸', '洗手台'];
    if (stop.indexOf(s) >= 0) return false;
    if (/(?:嘴里|眼中|眼里|手里|手中|脸上|心里|头上|身旁|身边|身前|身后|面前|怀里|口中|身上|背后|指间|唇边|耳边|脚下|身上)$/.test(s)) return false;
    return true;
}

// 从旁白里抽「句首主语」名字（用于名字表里没有的配角，例如小满）
function galSubjectFromNarration(text) {
    try {
        let s = String(text || '').replace(/\*+/g, '');
        s = s.replace(/[:：]\s*$/, '');
        const parts = s.split(/[。！？!?;；\n]/).filter(function (x) { return String(x || '').trim(); });
        if (!parts.length) return '';
        s = String(parts[parts.length - 1]).trim();
        const m = s.match(/^([\u4e00-\u9fa5]{2,4}?)(?:站在|站|把|用|将|抬|低|转|看|走|坐|笑|皱|伸|拿|抱|揉|点|摇|叹|穿|拉|捏|揪|蹲|靠|扑|亲|摸|拍|推|说|问|答|道|喊|叫|哼|小声|轻声|低声|缓缓|慢慢|朝|向|从|在|冲|对|正|刚|又|却|也|就|便)/);
        if (!m) return '';
        return galIsValidNameCand(m[1]) ? m[1].trim() : '';
    } catch (e) { return ''; }
}

// 从旁白里找“主语”名字：排除宾语位置（对/向/往/给/被/让…），并用代词回指
function galSubjectFromSegment(text, names) {
    try {
        const t = String(text || '').replace(/\*+/g, '');
        const occ = [];
        for (const pr of (names || [])) {
            if (pr.user) continue;
            let idx = -1;
            while ((idx = t.indexOf(pr.key, idx + 1)) >= 0) occ.push({ name: pr.name, pos: idx, end: idx + pr.key.length });
        }
        // 未知角色候选：名字 + 主语动作/状态
        const reCand = /([\u4e00-\u9fa5]{2,3})(?=整个人|身子|身体|已经|把|将|要|不|没|也|就|便|又|却|都|正|刚|还|缓缓|轻轻|慢慢|抬|低|转|看|走|坐|站|笑|皱|伸|拿|抱|揉|点|摇|叹|穿|脱|跪|靠|扑|亲|摸|拍|推|拉|揪|蹲|侧|仰|听|问|答|说|道)/g;
        let mm;
        while ((mm = reCand.exec(t))) {
            const cand = mm[1];
            if (!galIsValidNameCand(cand)) continue;
            if (occ.some(function (o) { return t.slice(o.pos, o.end) === cand; })) continue;
            occ.push({ name: cand, pos: mm.index, end: mm.index + cand.length });
        }
        if (!occ.length) return '';
        // 排除宾语位置：名字前面是介词/宾语标记
        const objectMark = /(对|向|往|跟|和|与|给|被|让|替|朝|冲|把|从|进|入|住|到|同|离开|搂住|抱住|拉住|按住|捏住|握住|揉着|摸过|擦过|蹭过|靠在|撞进|缩进|埋进)$/;
        const subjects = occ.filter(function (o) {
            const before = t.slice(Math.max(0, o.pos - 4), o.pos);
            return !objectMark.test(before);
        });
        if (!subjects.length) return '';
        // 有代词 他/她 → 取代词之前最近的主语（回指）
        const lastPron = Math.max(t.lastIndexOf('他'), t.lastIndexOf('她'));
        if (lastPron >= 0) {
            let best = '';
            for (const o of subjects) { if (o.pos < lastPron) best = o.name; }
            if (best) return best;
        }
        return subjects[subjects.length - 1].name;
    } catch (e) { return ''; }
}

// 「……说道：」这种说话标签句：取句子主语（支持名字表外的角色，如小满）
function galSpeechTagSubject(text, names) {
    try {
        const t = String(text || '').replace(/\*+/g, '').trim();
        if (!/[:：]\s*$/.test(t)) return '';
        const parts = t.split(/[。！？!?;；\n]/).filter(function (x) { return String(x || '').trim(); });
        if (!parts.length) return '';
        const last = String(parts[parts.length - 1]).trim();
        if (!/(?:说|道|问|答|喊|叫|低语|轻声|小声|沉声|冷笑|笑道|叹|嘟囔|嘀咕|开口|补充|解释|回答|呢喃|喃喃)/.test(last)) return '';
        // a) 最后一句句首就是主语
        const direct = galSubjectFromNarration(last);
        if (direct) return direct;
        // b) 最后一句里找主语（排除宾语、代词回指）
        const subjLast = galSubjectFromSegment(last, names);
        if (subjLast) return subjLast;
        // c) 整段旁白里找主语（主语常在上一个句子里）
        return galSubjectFromSegment(t, names);
    } catch (e) { return ''; }
}

// 带缓存的整篇说话人
function galGetSpeakers(st) {
    try {
        if (!st) return [];
        const names = galNamePairs();
        const key = names.length + ':' + (names[0] ? names[0].key : '');
        if (!st.speakers || st.speakersFor !== st.segs || st.speakersKey !== key) {
            st.speakers = galComputeSpeakers(st.segs || [], names);
            st.speakersFor = st.segs;
            st.speakersKey = key;
        }
        return st.speakers;
    } catch (e) { return []; }
}

// 把台词（“……”）套上变色 span；保留原有 HTML
function galColorDialogue(html) {
    return String(html || '').replace(/“([^”]{1,600})”/g, function (m, inner) {
        return '<span class="ac-gal-dlg">“' + inner + '”</span>';
    });
}

function galStopTyping() {
    const st = state.gal;
    if (st && st.typing) {
        try { clearTimeout(st.typing.timer); } catch (e) { /* ignore */ }
        try { clearInterval(st.typing.timer); } catch (e) { /* ignore */ }
        st.typing = null;
    }
}
function galFinishTyping() {
    const st = state.gal;
    if (!st || !st.typing) return false;
    try { clearTimeout(st.typing.timer); } catch (e) { /* ignore */ }
    try { clearInterval(st.typing.timer); } catch (e) { /* ignore */ }
    try {
        if (st.typing.kind === 'slice') {
            if (st.typing.root) st.typing.root.textContent = st.typing.full;
        } else if (st.typing.spans) {
            st.typing.spans.forEach(function (sp) { sp.classList.add('on'); });
        }
    } catch (e) { /* ignore */ }
    st.typing = null;
    try { galQueueFinalBeat(); } catch (e) { /* ignore */ }
    return true;
}
// 只有一个 <p>（或纯文本）才用 textContent 切片；多段落时走 span 以保留分段
function galIsPlainRoot(root) {
    try {
        let pCount = 0;
        const els = root.querySelectorAll('*');
        for (const el of els) {
            const tag = String(el.tagName || '').toUpperCase();
            if (tag === 'P') { pCount++; if (pCount > 1) return false; continue; }
            if (tag === 'BR') continue;
            return false;
        }
        return true;
    } catch (e) { return false; }
}
function galStartTyping(root) {
    try {
        const st = state.gal;
        if (!st || !root) return;
        if (!settings().vnTypewriter) return;
        if (st.noType) { st.noType = false; return; }
        const _hook = function (shown, total) { try { if (state.gal && state.gal.typeHook) state.gal.typeHook(shown, total); } catch (e) { /* ignore */ } };
        const speed = Math.max(5, Math.min(300, Number(settings().vnTypeSpeed) || 40));
        // 纯文本：textContent 切片 + 标点停顿
        if (galIsPlainRoot(root)) {
            const full = String(root.textContent || '');
            if (!full.trim()) return;
            const chars = galGraphemes(full);
            const total = chars.length;
            const eff = Math.max(speed, total / 7);
            const base = Math.max(10, Math.round(1000 / eff));
            let i = 0;
            root.textContent = '';
            const tick = function () {
                if (!state.gal || !state.gal.typing || state.gal.typing.kind !== 'slice') return;
                i++;
                root.textContent = chars.slice(0, i).join('');
                _hook(i, total);
                if (i >= total) { state.gal.typing = null; return; }
                const ch = chars[i - 1];
                const pause = /[，。！？；：、…—,.!?;:]/.test(ch) ? base * 4 : base;
                state.gal.typing.timer = setTimeout(tick, pause);
            };
            st.typing = { kind: 'slice', full: full, root: root, timer: setTimeout(tick, base) };
            return;
        }
        // 带格式（粗体/斜体/details/正则样式）：字符 span，保留 HTML
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        const spans = [];
        for (const node of nodes) {
            const text = node.nodeValue;
            if (!text || !text.trim()) continue;
            // 内心折叠里的内容不逐字（折叠着看不见会像卡死），一次性显示
            let inDetails = false;
            try {
                let el = node.parentElement;
                while (el) {
                    if (el.tagName === 'SUMMARY') break;
                    if (el.tagName === 'DETAILS') { inDetails = true; break; }
                    el = el.parentElement;
                }
            } catch (e) { /* ignore */ }
            if (inDetails) continue;
            const frag = document.createDocumentFragment();
            for (const ch of galGraphemes(text)) {
                const sp = document.createElement('span');
                sp.className = 'ac-tw';
                sp.textContent = ch;
                frag.appendChild(sp);
                spans.push(sp);
            }
            node.parentNode.replaceChild(frag, node);
        }
        if (!spans.length) return;
        const total = spans.length;
        const eff = Math.max(speed, total / 7);
        const tickMs = Math.max(8, Math.round(1000 / eff));
        let i = 0;
        spans[0].classList.add('on');
        _hook(1, total);
        const timer = setInterval(function () {
            i++;
            if (i >= total) {
                try { clearInterval(timer); } catch (e) { /* ignore */ }
                _hook(total, total);
                if (state.gal && state.gal.typing) state.gal.typing = null;
                return;
            }
            spans[i].classList.add('on');
            _hook(i + 1, total);
        }, tickMs);
        st.typing = { kind: 'span', spans: spans, timer: timer };
    } catch (e) { /* ignore */ }
}

// 识别「剧情推进：xxx」格式（宽松兼容：剧情发展/走向、列表前缀、全半角冒号、markdown 加粗）
const GAL_ADV_RE = /^\s*(?:[-*#>\s]*)?(?:\*\*)?\s*(?:【\s*)?(?:剧情|故事|情节|当前|下一步)?\s*(?:推进|发展|走向)\s*(?:】)?\s*\*{0,2}\s*[:：]\s*([\s\S]*)$/;
function galAdvanceInfo(seg) {
    const raw = String(seg || '').trim();
    let m = raw.match(GAL_ADV_RE);
    if (!m) {
        for (const line of raw.split(/\r?\n/)) {
            const mm = line.match(GAL_ADV_RE);
            if (mm) { m = mm; break; }
        }
    }
    if (!m) return { isAdvance: false, content: '' };
    let content = String(m[1] || '').trim();
    content = content.replace(/\*\*\s*$/g, '').trim();
    return { isAdvance: true, content: content };
}

function galRender() {
    const ov = document.getElementById('ac-gal-overlay');
    if (!ov) return;
    const st = state.gal;
    const txt = ov.querySelector('#ac-gal-text');
    const name = ov.querySelector('#ac-gal-name');
    const hint = ov.querySelector('#ac-gal-hint');
    const choice = ov.querySelector('#ac-gal-choice');
    const input = ov.querySelector('#ac-gal-input');
    if (!st || !st.segs.length) {
        const lastMsg = (function () { try { return galLastAiMessage(); } catch (e) { return null; } })();
        const trunc = (function () { try { return galLastAiTruncated(); } catch (e) { return false; } })();
        const noReply = (function () {
            try { const c = (live().chat || ctx.chat || []); const l = c[c.length - 1]; return !!(lastMsg && l && l.is_user); } catch (e) { return false; }
        })();
        if (txt) {
            if (lastMsg && noReply) {
                txt.innerHTML = '<div style="font-size:15px;line-height:1.8;text-align:center">⚠️ 上一条消息还没有生成出 AI 回复。</div>' +
                    '<div style="display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap">' +
                    '<button class="ac-btn pri" id="ac-gal-fix-send">✍️ 让 AI 生成回复</button>' +
                    '<button class="ac-btn" id="ac-gal-fix-chat">💬 回到聊天查看</button></div>';
            } else if (lastMsg && trunc) {
                txt.innerHTML = '<div style="font-size:15px;line-height:1.8;text-align:center">⚠️ 这条 AI 回复没有可用正文（生成被截断 / 只有剧情规划）。</div>' +
                    '<div style="display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap">' +

                    '<button class="ac-btn" id="ac-gal-fix-regen">🔄 重新生成</button>' +
                    '<button class="ac-btn" id="ac-gal-fix-chat">💬 回到聊天查看</button></div>';
            } else {
                txt.textContent = '还没有正文。先发一条消息，等 AI 回复后这里会自动开始。';
            }
        }
        if (hint) hint.textContent = '';
        if (choice) { choice.classList.remove('on'); choice.innerHTML = ''; }
        if (input) input.classList.remove('on');
        if (txt) setTimeout(function () {
            try {
                const b0 = document.getElementById('ac-gal-fix-send');
                if (b0) b0.addEventListener('click', function (ev) { ev.stopPropagation(); galBeginAutoRegenUI('trigger'); galRunSlashFix('/trigger await=true', function () { galClickSend(); }); });
                const b2 = document.getElementById('ac-gal-fix-regen');
                if (b2) b2.addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    galBeginAutoRegenUI('reroll');
                    galRunSlashFix('/regenerate await=true', function () { try { galClickRegenerate(); } catch (e2) { /* ignore */ } })
                });
                const b3 = document.getElementById('ac-gal-fix-chat');
                if (b3) b3.addEventListener('click', function (ev) { ev.stopPropagation(); try { galClose(); } catch (e4) { /* ignore */ } });
            } catch (e) { /* ignore */ }
        }, 0);
        return;
    }
    try { galUpdateInfo(); } catch (e) { /* ignore */ }
    const i = Math.min(st.i, st.segs.length - 1);
    const speakers = galGetSpeakers(st);
    const speaker = speakers[i] || '';
    // 当前场景立绘名单（两个 --- 之间会说话的角色），必须在情绪时间轴之前算好
    try {
        st.sceneCast = galSceneCastFor(st, speakers, i);
        st.spriteCast = st.sceneCast.slice();
        st.lastSpeaker = st.spriteCast[0] || '';
    } catch (e) { /* ignore */ }
    if (name) name.textContent = speaker ? ('【' + speaker + '】') : '';
    // 表情时间轴：本地先出图，AI 整条消息一次标注后覆盖
    st.triggeredBeats = {};
    st.lastEmoAt = 0;
    st.pendingBeat = null;
    if (st.pendingBeatTimer) { try { clearTimeout(st.pendingBeatTimer); } catch (e) { /* ignore */ } }
    st.pendingBeatTimer = null;
    st.lastBeatSeg = -1;
    st.lastBeatBi = -1;
    st.typeHook = null;

    const _tl = (function () { try { return galEnsureTimeline(st, speakers); } catch (e) { return null; } })();
    const _info = _tl && _tl.byIdx ? _tl.byIdx[i] : null;
    let _emoSpeaker = (_info && _info.speaker) || speaker || st.lastSpeaker || '';
    try {
        if (st.sceneCast && st.sceneCast.length && _emoSpeaker && st.sceneCast.indexOf(_emoSpeaker) < 0) _emoSpeaker = st.sceneCast[0] || '';
    } catch (e) { /* ignore */ }
    if (_info && _info.beats.length) {
        const _bi = settings().vnTypewriter ? 0 : (_info.beats.length - 1);
        try { galApplyBeatEmotion(_emoSpeaker, galBeatEmo(_tl, i, _bi), st.segs[i]); } catch (e) { /* ignore */ }
        st.lastBeatSeg = i;
        st.lastBeatBi = _bi;
    } else {
        try { galUpdateSprite(speaker, st.segs[i], !speaker); } catch (e) { /* ignore */ }
    }
    try {
        const _segIdx = i;
        st.typeHook = function (shown, total) { try { galTypeEmotionTick(_segIdx, shown, total); } catch (e) { /* ignore */ } };
    } catch (e) { /* ignore */ }
    try { galApplyEnvIfNeeded(); } catch (e) { /* ignore */ }
    if (txt) {
        const rawSeg = galStripSpeakerTag(String(st.segs[i] || ''));
        const isSceneBreak = galIsSceneBreakSeg(String(st.segs[i] || ''));
        const sfx = isSceneBreak ? null : rawSeg.match(/^\s*(#{3,4})\s*\*?\s*([\s\S]*?)\s*\*?\s*$/);
        txt.classList.toggle('ac-gal-sfx', !!sfx);
        txt.classList.toggle('ac-gal-sfx-4', !!(sfx && sfx[1] === '####'));
        let html;
        if (isSceneBreak) {
            txt.classList.remove('ac-gal-sfx', 'ac-gal-sfx-4');
            txt.innerHTML = '<div style="text-align:center;opacity:.55;letter-spacing:.5em;padding:14px 0;font-size:14px">· · ·</div>';
            txt.classList.remove('ac-gal-in');
            void txt.offsetWidth;
            txt.classList.add('ac-gal-in');
            galStopTyping();
        } else if (sfx) {
            let inner = String(sfx[2] || '').trim().replace(/^\*+|\*+$/g, '').trim();
            html = esc(inner);
            txt.innerHTML = html;
        } else {
            html = galToHtml(galDecodeEscapes(rawSeg));
            txt.innerHTML = galColorDialogue(html);
        }
        // 酒馆排版会把中文引号包成 <q>（自带前后引号），拆掉避免双重引号
        try {
            txt.querySelectorAll('q').forEach(function (q2) {
                while (q2.firstChild) q2.parentNode.insertBefore(q2.firstChild, q2);
                q2.remove();
            });
        } catch (e) { /* ignore */ }
        // 内心折叠默认展开，并且可点击折叠
        txt.querySelectorAll('details').forEach(function (d) { d.open = true; });
        txt.classList.remove('ac-gal-in');
        void txt.offsetWidth;
        txt.classList.add('ac-gal-in');
        galStopTyping();
        try { galStartTyping(txt); } catch (e) { /* ignore */ }
    }
    const last = (i >= st.segs.length - 1);
    const _generating = !!(st.awaiting || st.rerolling || st.busy) || galIsMainGenRunning();
    const adv = last ? galAdvanceInfo(st.segs[i]) : { isAdvance: false, content: '' };
    if (adv.isAdvance && name) name.textContent = '【剧情推进】';
    if (hint) hint.textContent = _generating
        ? '✍️ AI 正在写…（写完后会自动更新）'
        : (last
            ? (adv.isAdvance && adv.content ? '点击这句推进剧情（或在下面自己输入）' : '正文到此结束，在下面输入下一步')
            : ('▼ 点击继续　' + (i + 1) + ' / ' + st.segs.length));
    galUpdateStopBtn();
    const prevBtn = document.getElementById('ac-gal-prev');
    if (prevBtn) {
        prevBtn.disabled = i <= 0;
        prevBtn.style.opacity = i <= 0 ? '.4' : '1';
    }
    if (choice) {
        if (!_generating && last && adv.isAdvance && adv.content) {
            choice.classList.add('on');
            choice.innerHTML = '<button id="ac-gal-choice-btn">▶ 用这句推进：' + esc(adv.content.slice(0, 60)) + '</button>';
            const cb = choice.querySelector('#ac-gal-choice-btn');
            if (cb) cb.addEventListener('click', function (ev) { ev.stopPropagation(); galSendText(adv.content); });
        } else { choice.classList.remove('on'); choice.innerHTML = ''; }
    }
    if (input) input.classList.toggle('on', last && !_generating);
}

function galLoad() {
    if (!galChatAlive()) {
        state.gal = null;
        try { galClose(); } catch (e) { /* ignore */ }
        return;
    }
    try {
        const book = (typeof effectiveBook === 'function') ? effectiveBook() : null;
        if (!state.dirCache || (book && state.dirCache.book !== book)) {
            refreshDirCache(book || undefined).then(function () { try { if (state.gal) galRender(); } catch (e) { /* ignore */ } }).catch(function () { /* ignore */ });
        }
        // 用织机「更新角色」同一套角色识别结果（只含真正建了条目的角色）
        if (typeof listCharacters === 'function') {
            Promise.resolve(listCharacters(book)).then(function (list) {
                try {
                    state.galNames = (list || []).map(function (x) { return String((x && x.name) || '').trim(); }).filter(Boolean);
                    if (state.gal) { state.gal.speakers = null; state.gal.speakersKey = ''; galRender(); }
                } catch (e) { /* ignore */ }
            }).catch(function () { /* ignore */ });
        }
    } catch (e) { /* ignore */ }
    // 生成中（已发送、等 AI 正文）：交给 galStreamTick 驱动，galLoad 不要重置状态
    if (state.gal && state.gal.awaiting) { try { galStartExternalWatch(); } catch (e) { /* ignore */ } return; }
    // 外部主生成（用户从聊天区触发）进行中：显示等待动画并持续跟踪
    if (galIsMainGenRunning()) {
        const stG = state.gal || (state.gal = {});
        try { galStartExternalWatch(); } catch (e) { /* ignore */ }
        const segsNow = (function () { const l = galLastAiMessage(); return l ? galSegmentsFromRaw(l.mes) : []; })();
        if (!segsNow.length) {
            const txt0 = document.getElementById('ac-gal-text');
            const nm0 = document.getElementById('ac-gal-name');
            if (txt0) txt0.innerHTML = galWaitingHtml('AI 正在写…');
            if (nm0) nm0.textContent = '';
            try { galHideInteractions(); } catch (e) { /* ignore */ }
            try { galHint('✍️ AI 正在写…', true); } catch (e) { /* ignore */ }
            try { galUpdateStopBtn(); } catch (e) { /* ignore */ }
            return;
        }
    }
    const last = galLastAiMessage();
    const segs = last ? galSegmentsFromRaw(last.mes) : [];
    const _truncated = (function () { try { return galLastAiTruncated(); } catch (e) { return false; } })();
    const prevIdx = state.gal && state.gal.mesIndex;
    const idx = last ? (ctx.chat || []).indexOf(last) : -1;
    const swipe = last ? Number(last.swipe_id || 0) : 0;
    const head = segs.length ? galCleanText(segs[0]).slice(0, 20) : '';
    if (!state.gal || prevIdx !== idx || state.gal.sent) {
        state.gal = { segs: segs, i: 0, mesIndex: idx, name: '', sent: false, busy: false, awaiting: false, awaitingAt: 0, sendMesIndex: -1, lastLen: -1, swipeId: swipe, firstHead: head, speakers: null, speakersFor: null, truncated: _truncated, chatKey: (function () { try { return chatKey(); } catch (e) { return ''; } })() };
    } else {
        // 滑动重生成 / 内容整体变化 → 回到第一段
        if (state.gal.swipeId !== swipe || (state.gal.firstHead && head && state.gal.firstHead !== head)) {
            state.gal.i = 0;
            state.gal.swipeId = swipe;
            state.gal.firstHead = head;
        }
        state.gal.segs = segs;
        state.gal.truncated = _truncated;
        state.gal.speakers = null;
        if (state.gal.i > segs.length - 1) state.gal.i = Math.max(0, segs.length - 1);
    }
    // 名字：试着从正文里找「内心-名字」或第一个角色名（简单取世界书名册第一个出现的）
    try {
        // （评审清理：原此处有一段查找首个角色名后赋空值的死代码，已删）
    } catch (e) { /* ignore */ }
    galRender();
}

// 当前是否真的开着一个聊天（结束聊天/回角色列表时为 false）
function galChatAlive() {
    try {
        const c = live();
        if (!c || !c.chatId) return false;
        const chat = c.chat || [];
        if (!chat.length) return false;
        return true;
    } catch (e) { return false; }
}

function galOpen() {
    try { refreshGalModeUI(); } catch (e) { /* ignore */ }
    if (!galChatAlive()) {
        try { toast('先打开一个聊天再进 Galgame', null, 2500); } catch (e) { /* ignore */ }
        return;
    }
    _galSpriteCache = {};
    galOverlay();
    const ov = document.getElementById('ac-gal-overlay');
    ov.classList.add('on');
    try { galApplyBg(); } catch (e) { /* ignore */ }
    try { galUpdateInfo(); } catch (e) { /* ignore */ }
    const openBtn = document.getElementById('ac-gal-open');
    if (openBtn) openBtn.classList.remove('on');
    state.gal = null;
    galLoad();
    galScheduleAutoFix(1500);
    // 首次进入给一条操作提示
    try {
        if (!settings()._tipsSeen) {
            settings()._tipsSeen = true;
            persist();
            setTimeout(function () {
                try { toast('操作提示：点击画面继续 / 上一条回看 / Ctrl+Alt+D 诊断；立绘、表情、主题在「素材与显示」页设置', null, 7000); } catch (e2) { /* ignore */ }
            }, 900);
        }
    } catch (e) { /* ignore */ }
}

function galClose() {
    const ov = document.getElementById('ac-gal-overlay');
    if (ov) ov.classList.remove('on');
    try { refreshGalModeUI(); } catch (e) { /* ignore */ }
    try { galClearSprite(); } catch (e) { /* ignore */ }
    const openBtn = document.getElementById('ac-gal-open');
    if (openBtn) openBtn.classList.toggle('on', !!settings().vnMode && galChatAlive());
}

let _galNoticeTimer = null;
function galNotice(text, tab, ms) {
    const ov = document.getElementById('ac-gal-overlay');
    if (!ov || !ov.classList.contains('on')) return;
    let el = document.getElementById('ac-gal-notice');
    if (!el) {
        el = document.createElement('div');
        el.id = 'ac-gal-notice';
        el.style.cssText = 'position:absolute;right:18px;top:64px;z-index:5;max-width:360px;background:rgba(250,253,255,.94);border:1px solid #e0f2fe;border-left:4px solid #38bdf8;border-radius:12px;padding:11px 15px;color:#1e293b;font-size:13px;line-height:1.6;cursor:pointer;box-shadow:0 10px 25px -4px rgba(15,23,42,.16);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:opacity .3s';
        el.addEventListener('click', function () { try { galClose(); openPanel(tab); } catch (e) { /* ignore */ } });
        ov.appendChild(el);
    }
    el.textContent = '🔔 ' + text;
    el.style.display = 'block';
    el.style.opacity = '1';
    if (_galNoticeTimer) clearTimeout(_galNoticeTimer);
    _galNoticeTimer = setTimeout(function () {
        try { el.style.opacity = '0'; setTimeout(function () { el.style.display = 'none'; }, 320); } catch (e) { /* ignore */ }
    }, ms || 7000);
}

function galUpdateInfo() {
    const info = document.getElementById('ac-gal-info');
    if (!info) return;
    try {
        const s = settings();
        const bits = [];
        if (String(s.storyTime || '').trim()) bits.push('📅 ' + String(s.storyTime).trim());
        if (s.ensemble) bits.push('群像');
        if (String(s.playChar || '').trim()) bits.push('扮演：' + String(s.playChar).trim());
        info.textContent = bits.join('　');
    } catch (e) { /* ignore */ }
}

function galUpdateStopBtn() {
    const b = document.getElementById('ac-gal-stop');
    if (!b) return;
    const st = state.gal;
    const mine = !!(st && (st.awaiting || st.busy || st.rerolling));
    // body.dataset.generating 只在主生成时置 true（数据库/记忆脚本的静默生成不算），
    // 避免它们跑的时候 Galgame 右上角误显示「终止生成」
    let mainGen = false;
    try { mainGen = !!(document.body && document.body.dataset && document.body.dataset.generating === 'true') && galIsActuallyGenerating(); } catch (e) { /* ignore */ }
    const show = mine || mainGen;
    b.style.display = show ? '' : 'none';
}

// 删除「发送之后新增、但没生成完」的那条 AI 消息（终止/失败时用）
async function galDropPartialMessage() {
    try {
        const st = state.gal;
        if (!st || st.sendMesIndex == null || st.sendMesIndex < 0) return false;
        const chat = ctx.chat || [];
        const idx = chat.length - 1;
        if (idx <= st.sendMesIndex) return false;
        const last = chat[idx];
        if (!last || last.is_user || last.is_system) return false;
        try {
            if (idx === chat.length - 1 && typeof ctx.deleteLastMessage === 'function') await ctx.deleteLastMessage();
            else if (typeof ctx.deleteMessage === 'function') await ctx.deleteMessage(idx);
            else if (typeof ctx.deleteLastMessage === 'function') await ctx.deleteLastMessage();
        } catch (e) {
            try { if (typeof ctx.deleteLastMessage === 'function') await ctx.deleteLastMessage(); } catch (e2) { /* ignore */ }
        }
        st.sendMesIndex = -1;
        return true;
    } catch (e) { return false; }
}

function galStopGeneration() {
    try {
        const stopBtn = document.getElementById('mes_stop');
        if (stopBtn && getComputedStyle(stopBtn).display !== 'none') stopBtn.click();
    } catch (e) { /* ignore */ }
    galStopPolling();
    if (state.gal) { state.gal.awaiting = false; state.gal.busy = false; }
    try { galHint('已终止生成，正在清理残留…', false); } catch (e) { /* ignore */ }
    galUpdateStopBtn();
    setTimeout(async function () {
        try { await galDropPartialMessage(); } catch (e) { /* ignore */ }
        if (state.gal) state.gal.sent = false;
        try { galLoad(); } catch (e) { /* ignore */ }
        try { galHint('已终止生成，残留已清理，可以重新推进', false); } catch (e) { /* ignore */ }
        galUpdateStopBtn();
        toast('已终止生成，残留正文已清理', null, 3000);
    }, 500);
}

function galPrev() {
    const st = state.gal;
    if (!st || !st.segs.length) return;
    if (st.i > 0) {
        st.i -= 1;
        st.noType = true;
        try { galRender(); } catch (e) { /* ignore */ }
    }
}

function galNext() {
    if (galFinishTyping()) return;
    const st = state.gal;
    if (!st || !st.segs.length) return;
    if (st.i < st.segs.length - 1) { st.i += 1; galRender(); }
}

// ── Backlog 回想：实时读聊天记录，不存储任何状态 ──
function galOpenBacklog() {
    const ov = document.getElementById('ac-gal-overlay');
    const panel = document.getElementById('ac-gal-backlog');
    const list = document.getElementById('ac-gal-backlog-list');
    if (!ov || !panel || !list) return;
    try {
        const chat = ctx.chat || [];
        const items = [];
        let mesCount = 0;
        for (let mi = chat.length - 1; mi >= 0 && mesCount < 8; mi--) {
            const m = chat[mi];
            if (!m || m.is_user || m.is_system || !m.mes) continue;
            mesCount++;
            const segs = galSegmentsFromRaw(m.mes);
            for (let si = segs.length - 1; si >= 0; si--) {
                const adv = galAdvanceInfo(segs[si]);
                items.push({
                    mi: mi,
                    si: si,
                    text: galCleanText(adv.isAdvance ? adv.content : segs[si]).slice(0, 200),
                    speaker: adv.isAdvance ? '剧情推进' : (galComputeSpeakers(segs, galNamePairs())[si] || ''),
                    isAdvance: adv.isAdvance,
                    isCur: !!(state.gal && state.gal.mesIndex === mi),
                });
            }
        }
        if (!items.length) { list.innerHTML = '<div class="bi"><div class="tx">还没有可回想的内容</div></div>'; }
        else {
            list.innerHTML = items.reverse().map(function (it, k) {
                return '<div class="bi' + (it.isCur && state.gal && it.si === state.gal.i ? ' cur' : '') + (it.isAdvance ? ' adv' : '') + '" data-k="' + k + '">' +
                    '<div class="nm">' + esc(it.speaker || '旁白') + (it.isAdvance ? '（推进）' : '') + '</div>' +
                    '<div class="tx">' + esc(it.text) + '</div></div>';
            }).join('');
            list.querySelectorAll('.bi[data-k]').forEach(function (el) {
                el.addEventListener('click', function () {
                    const it = items[Number(el.dataset.k)];
                    if (!it) return;
                    if (state.gal && it.isCur && state.gal.mesIndex === it.mi) {
                        state.gal.i = it.si;
                        state.gal.noType = true;
                        galCloseBacklog();
                        galRender();
                    } else {
                        toast('只能跳回当前这条正文的段落', null, 2500);
                    }
                });
            });
        }
        panel.classList.add('on');
        try { list.scrollTop = list.scrollHeight; } catch (e) { /* ignore */ }
    } catch (e) { console.warn('[命运织机] 回想失败', e); }
}
function galCloseBacklog() {
    const panel = document.getElementById('ac-gal-backlog');
    if (panel) panel.classList.remove('on');
}

// ── 内置「人物变化」面板：每张卡片上面是变化，下面是名字 ──
function galOpenCharState() {
    const panel = document.getElementById('ac-gal-charstate-panel');
    const list = document.getElementById('ac-gal-charstate-list');
    if (!panel || !list) return;
    try {
        const _book = (typeof effectiveBook === 'function') ? effectiveBook() : '';
        if (!state.dirCache || (_book && state.dirCache.book !== _book)) {
            refreshDirCache(_book || undefined).then(function () {
                try { if (panel.classList.contains('on')) galOpenCharState(); } catch (e) { /* ignore */ }
            }).catch(function () { /* ignore */ });
        }
        const data = (typeof charStateList === 'function') ? charStateList() : { names: [], st: {} };
        const st = data.st || {};
        // 只显示「有变化记录」的角色（没变化的角色不占卡片）
        let names = (data.names || []).filter(function (n) {
            return String(st[n] || '').trim().length > 0;
        });
        // 最近剧情里出场过的角色排前面
        try {
            const recent = (ctx.chat || []).slice(-15).map(function (m) { return String(m.mes || ''); }).join('\n');
            if (recent) {
                names.sort(function (a, b) {
                    const ra = recent.indexOf(a) >= 0 ? 0 : 1;
                    const rb = recent.indexOf(b) >= 0 ? 0 : 1;
                    return ra - rb;
                });
            }
        } catch (e) { /* ignore */ }
        // 再按「当前书角色 / 最近聊天提到」过滤，防止同一作用域里混进别的角色
        try {
            const bookNames = ((state.dirCache && state.dirCache.chars) || []).map(function (c) { return c && c.name; }).filter(Boolean);
            let chatText = '';
            try { chatText = (ctx.chat || []).slice(-60).map(function (m) { return String(m.mes || ''); }).join('\n'); } catch (e) { /* ignore */ }
            if (bookNames.length || chatText) {
                names = names.filter(function (n) {
                    return bookNames.indexOf(n) >= 0 || chatText.indexOf(n) >= 0;
                });
            }
        } catch (e) { /* ignore */ }
        if (!names.length) {
            list.innerHTML = '<div class="cs-card"><div class="cs-changes empty">当前世界书还没有人物变化记录。\n等剧情推进后，织机会自动记录角色的长期变化。</div><div class="cs-name">暂无记录</div></div>';
        } else {
            list.innerHTML = names.map(function (n) {
                const txt = String(st[n] || '').trim();
                const initial = String(n || '?').slice(0, 1);
                return '<div class="cs-card">' +
                    '<div class="cs-changes' + (txt ? '' : ' empty') + '">' + esc(txt || '（暂无变化记录）') + '</div>' +
                    '<div class="cs-name">' + esc(n) + '</div>' +
                    '</div>';
            }).join('');
        }
        panel.classList.add('on');
    } catch (e) { console.warn('[命运织机] 人物变化面板打开失败', e); }
}
function galCloseCharState() {
    const panel = document.getElementById('ac-gal-charstate-panel');
    if (panel) panel.classList.remove('on');
}

function galTap() {
    if (galFinishTyping()) return;
    const st = state.gal;
    if (!st || !st.segs.length) { galLoad(); return; }
    // 最后一段：点空白区域什么都不做（避免误触把「剧情推进」发出去）
    // 推进只能点「▶ 用这句推进」按钮，或在输入框自己输入
    if (st.i >= st.segs.length - 1) return;
    st.i += 1;
    galRender();
}

let _galPoll = null;
function galHint(text, busy) {
    const hint = document.getElementById('ac-gal-hint');
    if (!hint) return;
    hint.textContent = text;
    hint.classList.toggle('busy', !!busy);
}
function galIsActuallyGenerating() {
    try {
        const b = document.getElementById('mes_stop');
        if (!b) return false;
        const cs = getComputedStyle(b);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
    } catch (e) { return false; }
}
function galStopPolling() {
    if (_galPoll) { clearInterval(_galPoll); _galPoll = null; }
}
function galStartPolling() {
    galStopPolling();
    _galPoll = setInterval(function () { galStreamTick(); }, 1200);   // 兜底轮询，主要靠 STREAM_TOKEN_RECEIVED 事件
}
// 是否「真正的主生成」在跑（#mes_stop 可见 + body.dataset.generating）
function galIsMainGenRunning() {
    try { return !!(document.body && document.body.dataset && document.body.dataset.generating === 'true') && galIsActuallyGenerating(); } catch (e) { return false; }
}
// 外部主生成监听：用户从聊天区/其它按钮触发了生成，Galgame 也要跟着更新
let _galExtPoll = null;
function galStopExternalWatch() { if (_galExtPoll) { clearInterval(_galExtPoll); _galExtPoll = null; } }
function galStartExternalWatch() {
    if (_galExtPoll) return;
    _galExtPoll = setInterval(function () { galExternalTick(); }, 700);
}
function galHideInteractions() {
    try {
        const c = document.getElementById('ac-gal-choice');
        if (c) { c.classList.remove('on'); c.innerHTML = ''; }
        const i = document.getElementById('ac-gal-input');
        if (i) i.classList.remove('on');
    } catch (e) { /* ignore */ }
}
function galExternalTick() {
    try {
        const ov = document.getElementById('ac-gal-overlay');
        if (!ov || !ov.classList.contains('on')) { galStopExternalWatch(); return; }
        const st = state.gal;
        if (!st) { galStopExternalWatch(); return; }
        if (!galIsMainGenRunning()) {
            galStopExternalWatch();
            setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 500);
            return;
        }
        const last = galLastAiMessage();
        const _extRawLen = last ? String(last.mes || '').length : 0;
        if (st._extRawLen === _extRawLen && _extRawLen > 0) { galUpdateStopBtn(); return; }
        st._extRawLen = _extRawLen;
        const segs = last ? galSegmentsFromRaw(last.mes) : [];
        const txt = document.getElementById('ac-gal-text');
        const name = document.getElementById('ac-gal-name');
        galHideInteractions();
        if (!segs.length) {
            if (txt) txt.innerHTML = galWaitingHtml('AI 正在写…');
            if (name) name.textContent = '';
            galHint('✍️ AI 正在写…', true);
            galUpdateStopBtn();
            return;
        }
        st.segs = segs;
        st.speakers = null;
        st.speakersKey = '';
        st.i = segs.length - 1;
        const speakers = galGetSpeakers(st);
        const i = st.i;
        const adv = galAdvanceInfo(segs[i]);
        const spk = speakers[i] || '';
        if (name) name.textContent = adv.isAdvance ? '【剧情推进】' : (spk ? ('【' + spk + '】') : '');
        if (txt) {
            const rawSeg = galStripSpeakerTag(String(segs[i] || ''));
            if (galIsSceneBreakSeg(String(segs[i] || ''))) {
                txt.innerHTML = '<div style="text-align:center;opacity:.55;letter-spacing:.5em;padding:14px 0;font-size:14px">· · ·</div>';
            } else {
                txt.innerHTML = galColorDialogue(galToHtml(galDecodeEscapes(rawSeg)));
                try { txt.querySelectorAll('details').forEach(function (d) { d.open = true; }); } catch (e) { /* ignore */ }
            }
        }
        try { galApplyEnvIfNeeded(); } catch (e) { /* ignore */ }
        galHint('✍️ AI 正在写…', true);
        galUpdateStopBtn();
    } catch (e) { /* ignore */ }
}

// 生成中：只在我们「刚发出一条消息、等 AI 正文」时轮询
// （数据库/记忆脚本自己触发的生成事件不会干扰 Galgame 显示）
let _galTickAt = 0;
let _galSession = 0;
async function galStreamTick() {
    try {
        const _sess = _galSession;
        const now = Date.now();
        if (now - _galTickAt < 100) return;   // 节流
        _galTickAt = now;
        if (!settings().vnMode) { galStopPolling(); return; }
        const ov = document.getElementById('ac-gal-overlay');
        if (!ov || !ov.classList.contains('on')) { galStopPolling(); return; }
        const st = state.gal;
        if (!st || !st.awaiting) { galStopPolling(); return; }
        // 自动重roll / 自动补回复：显示等待动画 + 流式进度
        if (st.regenSelf) {
            try {
                const lastR = galLastAiMessage();
                const curLen = lastR ? String(lastR.mes || '').length : 0;
                const txtR = document.getElementById('ac-gal-text');
                if (lastR && curLen > (st.preLen || 0)) {
                    const segsR = galSegmentsFromRaw(lastR.mes);
                    const plainR = segsR.length ? galCleanText(segsR[segsR.length - 1]) : '';
                    if (txtR && plainR) txtR.innerHTML = '<div class="ac-gal-stream">' + esc(plainR.slice(-240)) + '<span class="ac-gal-cursor">▍</span></div>';
                    galHint('✍️ ' + (st.regenSelf === 'trigger' ? 'AI 正在生成回复…' : 'AI 正在重新生成…') + '（已 ' + curLen + ' 字）', true);
                } else {
                    if (txtR) txtR.innerHTML = galWaitingHtml(st.regenSelf === 'trigger' ? 'AI 正在生成回复…' : 'AI 正在重新生成这一楼…');
                    galHint('✍️ ' + (st.regenSelf === 'trigger' ? 'AI 正在生成回复…' : 'AI 正在重新生成这一楼…'), true);
                }
                galUpdateStopBtn();
                try {
                    const ch0 = document.getElementById('ac-gal-choice');
                    if (ch0) { ch0.classList.remove('on'); ch0.innerHTML = ''; }
                    const in0 = document.getElementById('ac-gal-input');
                    if (in0) in0.classList.remove('on');
                } catch (e) { /* ignore */ }
                // 【评审修复】重roll 收敛：生成结束且内容稳定，或等待超时 → 复位状态并重载
                const curLen2 = lastR ? String(lastR.mes || '').length : 0;
                if (st.lastLen !== curLen2) { st.lastLen = curLen2; st.lastAt = Date.now(); }
                const _stable = st.lastAt && (Date.now() - st.lastAt > 1200);
                const _tooLong = Date.now() - (st.awaitingAt || 0) > 5 * 60 * 1000;
                if ((_stable && !galIsActuallyGenerating()) || _tooLong) {
                    st.regenSelf = false;
                    st.awaiting = false;
                    st.rerolling = false;
                    st.sent = false;
                    st.busy = false;
                    if (state.autoReroll) state.autoReroll.inFlight = false;
                    galStopPolling();
                    galUpdateStopBtn();
                    galDiag('regen_self_settled', { len: curLen2, tooLong: _tooLong });
                    setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 200);
                }
            } catch (e) { /* ignore */ }
            return;
        }
        // 超时保护：5 分钟还没有正文回来就恢复
        if (st.awaitingAt && Date.now() - st.awaitingAt > 5 * 60 * 1000) {
            st.awaiting = false;
            st.sent = false;
            st.busy = false;
            st.mainGen = false;
            galStopPolling();
            galUpdateStopBtn();
            try { galHint('⚠️ 等了 5 分钟还没等到正文（可能生成失败），点「用这句推进」重试', false); } catch (e) { /* ignore */ }
            return;
        }
        const last = galLastAiMessage();
        if (!last) return;
        const idx = (ctx.chat || []).indexOf(last);
        // 发送之后才出现的新 AI 消息，才算正文开始写
        if (idx <= (st.sendMesIndex == null ? -1 : st.sendMesIndex)) {
            // 生成已经结束但没等到新正文（失败/被中断）→ 解除已发送锁
            // 其它扩展（记忆库/总结）可能先跑静默生成，主生成会晚几十秒才开始：
            // 不再用短超时判定失败，改为事件驱动；这里只做「发送是否真的成功」的检测和兜底
            const _waitMs = Date.now() - (st.awaitingAt || 0);
            const txt0 = document.getElementById('ac-gal-text');
            if (txt0 && !String(txt0.innerText || '').trim()) txt0.textContent = '✍️ AI 正在写…';
            if (!st.mainGen && _waitMs > 8000) galHint('✍️ 已发送，等酒馆开始生成…（其它扩展可能在做准备）', true);
            else galHint('✍️ AI 正在写…', true);
            try {
                const ch1 = document.getElementById('ac-gal-choice');
                if (ch1) { ch1.classList.remove('on'); ch1.innerHTML = ''; }
                const in1 = document.getElementById('ac-gal-input');
                if (in1) in1.classList.remove('on');
            } catch (e) { /* ignore */ }
            galUpdateStopBtn();
            return;
        }
        const segs = galSegmentsFromRaw(last.mes);
        const swipe = Number(last.swipe_id || 0);
        const head = segs.length ? galCleanText(segs[0]).slice(0, 20) : '';
        const isNewMsg = (idx !== st.mesIndex) || (st.swipeId !== swipe) || (st.firstHead !== head);
        st.mesIndex = idx;
        st.swipeId = swipe;
        st.firstHead = head;
        // 回看锁定：用户已经翻到前面的段落时，流式只更新数据，不抢画面
        const readingOld = !isNewMsg && st.segs && st.segs.length && st.i < st.segs.length - 1;
        st.segs = segs;
        st.speakers = null;
        if (!segs.length) return;
        if (isNewMsg || !readingOld) st.i = segs.length - 1;
        galStopTyping();
        if (readingOld) {
            galHint('✍️ AI 正在写…（有新内容，点继续看）', true);
            galUpdateStopBtn();
            return;
        }
        if (_sess !== _galSession) return;   // 已被终止/重置，丢弃过期数据
        const txt = document.getElementById('ac-gal-text');
        const lastSegRaw = String(segs[segs.length - 1] || '');
        const plain = galIsSceneBreakSeg(lastSegRaw) ? '· · ·' : galCleanText(lastSegRaw);
        if (txt && txt.innerText !== plain) {
            txt.textContent = plain;
            txt.classList.remove('ac-gal-in');
            void txt.offsetWidth;
            txt.classList.add('ac-gal-in');
        }
        const nm = document.getElementById('ac-gal-name');
        const sp = galSpeaker(segs, segs.length - 1, galNamePairs());
        if (nm) nm.textContent = sp ? ('【' + sp + '】') : '';
        galHint('✍️ AI 正在写…（' + segs.length + ' 段）', true);
        galUpdateStopBtn();
        const choice = document.getElementById('ac-gal-choice');
        if (choice) { choice.classList.remove('on'); choice.innerHTML = ''; }
        const input = document.getElementById('ac-gal-input');
        if (input) input.classList.remove('on');
        // 写完了（停止生成按钮消失 + 内容长度不变）→ 收尾并从第一段重播
        const nowLen = String(last.mes || '').length;
        if (st.lastLen !== nowLen) { st.lastLen = nowLen; st.lastAt = Date.now(); }
        else if (!galIsActuallyGenerating() && st.lastAt && Date.now() - st.lastAt > 1000) {
            st.awaiting = false;
            st.busy = false;
            galStopPolling();
            try { galLoad(); } catch (e) { /* ignore */ }
        }
    } catch (e) { /* ignore */ }
}
function galSetBusy(busy) {
    if (state.gal) state.gal.busy = !!busy;
}

// 点发送键让 AI 生成回复（用于「最后一条是用户消息、AI 没有回复」的情况）
function galClickSend() {
    try {
        const btn = document.getElementById('send_but');
        if (btn) { btn.click(); return true; }
    } catch (e) { /* ignore */ }
    return false;
}

// 点酒馆里真正的「重新生成」（1.19 没有 #regenerate_but，用最后一条消息的右滑箭头）
function galClickRegenerate() {
    try {
        const chat = document.getElementById('chat');
        if (chat) {
            const els = chat.querySelectorAll('.mes');
            const lastEl = els.length ? els[els.length - 1] : null;
            if (lastEl) {
                const sw = lastEl.querySelector('.swipe_right');
                if (sw && sw.offsetParent !== null) { sw.click(); return true; }
            }
        }
    } catch (e) { /* ignore */ }
    try {
        const opt = document.getElementById('option_regenerate');
        if (opt) { opt.click(); return true; }
    } catch (e) { /* ignore */ }
    try {
        if (ctx.executeSlashCommands) { ctx.executeSlashCommands('/regenerate'); return true; }
    } catch (e) { /* ignore */ }
    return false;
}

// 续写最后一条 AI 回复（用于生成被截断 / 只有剧情规划的情况）
function galContinueLast() {
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        galClose();
        toast('正在让 AI 续写这条回复…', null, 3000);
        let done = false;
        const reopen = function () {
            if (done) return;
            done = true;
            setTimeout(function () { try { galOpen(); } catch (e) { /* ignore */ } }, 700);
        };
        try {
            if (evs && evt && evt.GENERATION_ENDED) {
                if (evs.once) evs.once(evt.GENERATION_ENDED, reopen);
                else evs.on(evt.GENERATION_ENDED, reopen);
            }
        } catch (e) { /* ignore */ }
        setTimeout(reopen, 60000); // 兜底
        try {
            galRunSlashFix('/continue await=true', function () {
                const mc = document.getElementById('mes_continue');
                const opt = document.getElementById('option_continue');
                if (mc && mc.offsetParent !== null) mc.click();
                else if (opt) opt.click();
            });
        } catch (e) {
            try { toast('无法续写：' + (e.message || e), null, 4000); } catch (e2) { /* ignore */ }
        }
    } catch (e) { console.warn('[命运织机] 续写失败', e); }
}

// 当前是否正在生成（用于避免自动重roll 和生成打架）
function galIsGenerating() {
    // 酒馆官方生成中标记
    try { if (document.body && document.body.dataset && document.body.dataset.generating === 'true') return true; } catch (e) { /* ignore */ }
    // 扩展自己的后台静默任务（主 API 模式的表情时间轴等）
    try { if (state.bgTaskCount && state.bgTaskCount > 0) return true; } catch (e) { /* ignore */ }
    try {
        const st = state.gal;
        if (st && (st.awaiting || st.busy || st.rerolling)) return true;
    } catch (e) { /* ignore */ }
    return false;
}

// 用户正在手动操作聊天（编辑消息/有草稿/有弹窗）时不要自动动
function galIsUserBusy() {
    try {
        if (document.querySelector('#chat .mes_edit_textarea, #chat .mes[is_editing="true"]')) return true;
    } catch (e) { /* ignore */ }
    try {
        const box = document.getElementById('send_textarea');
        if (box && String(box.value || '').trim().length > 0) return true;
    } catch (e) { /* ignore */ }
    try {
        const popups = document.querySelectorAll('.popup');
        for (const p of popups) {
            const cs = getComputedStyle(p);
            if (cs.display !== 'none' && cs.visibility !== 'hidden' && p.offsetParent !== null && !p.classList.contains('hidden')) return true;
        }
    } catch (e) { /* ignore */ }
    return false;
}

// 去重键：定位「当前要修的回合」，不能用 swipe_id / mes.length（每次重roll都会变）
function galFixTurnKey(chat) {
    try {
        if (!chat || !chat.length) return 'empty';
        const last = chat[chat.length - 1];
        const aiIdx = last.is_user ? chat.length : (chat.length - 1);
        let anchor = '';
        for (let i = chat.length - 1; i >= 0; i--) {
            const m = chat[i];
            if (m && m.is_user) {
                anchor = String(m.send_date || m.mes || '').slice(0, 80);
                break;
            }
        }
        return aiIdx + '|' + anchor + '|' + (last.is_user ? 'u' : 'a');
    } catch (e) { return 'err'; }
}

let _galFixTimer = null;
function galScheduleAutoFix(delay) {
    try {
        if (_galFixTimer) { clearTimeout(_galFixTimer); _galFixTimer = null; }
        _galFixTimer = setTimeout(function () {
            _galFixTimer = null;
            try { galAutoFixTick(); } catch (e) { /* ignore */ }
        }, Math.max(600, Number(delay) || 1500));
    } catch (e) { /* ignore */ }
}

// 清掉「等待 AI 生成」状态：否则 galLoad 会提前 return，画面永远停在「AI 正在写…」
function galClearAwaiting() {
    try { galStopPolling(); } catch (e) { /* ignore */ }
    try {
        const st = state.gal;
        if (st) {
            st.awaiting = false;
            st.busy = false;
            st.sent = false;
            st.mainGen = false;
            st.quietGen = false;
            st.genStarted = false;
            st.regenSelf = false;
            st.sendMesIndex = -1;
        }
    } catch (e) { /* ignore */ }
    try { galUpdateStopBtn(); } catch (e) { /* ignore */ }
}

// 自动修复完成后的收尾：Galgame 重载 + 再检查
function galAutoFixDone() {
    try { if (state.gal) { state.gal.rerolling = false; } } catch (e) { /* ignore */ }
    try { state.autoReroll = state.autoReroll || {}; state.autoReroll.inFlight = false; } catch (e) { /* ignore */ }
    galClearAwaiting();
    setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 600);
    setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 2200);
    galScheduleAutoFix(2500);
}

// 等待/流式显示 HTML
function galWaitingHtml(text) {
    return '<div class="ac-gal-wait"><span class="ac-gal-spin"></span><span>' + esc(String(text || 'AI 正在重新生成…')) + '</span></div>';
}

// 进入「AI 正在重写/生成」的 Galgame 等待画面（带轮询更新）
function galBeginAutoRegenUI(mode) {
    try {
        const st = state.gal;
        if (!st) return;
        const last = galLastAiMessage();
        const chat = (live().chat || []);
        st.awaiting = true;
        st.busy = false;
        st.sent = true;
        st.mainGen = false;
        st.quietGen = false;
        st.genStarted = false;
        st.regenSelf = mode || 'reroll';
        st.awaitingAt = Date.now();
        st.sendMesIndex = last ? chat.indexOf(last) : -1;
        st.preLen = last ? String(last.mes || '').length : 0;
        st.lastLen = -1;
        st.lastAt = 0;
        try { galStopTyping(); } catch (e) { /* ignore */ }
        const txt = document.getElementById('ac-gal-text');
        if (txt) txt.innerHTML = galWaitingHtml(mode === 'trigger' ? 'AI 正在生成回复…' : 'AI 正在重新生成这一楼…');
        const nm = document.getElementById('ac-gal-name');
        if (nm) nm.textContent = '';
        try { galHint('✍️ ' + (mode === 'trigger' ? 'AI 正在生成回复…' : 'AI 正在重新生成这一楼…'), true); } catch (e) { /* ignore */ }
        galStartPolling();
        galUpdateStopBtn();
    } catch (e) { /* ignore */ }
}

// 用酒馆斜杠命令执行（/trigger、/regenerate 内部会自动等生成锁）
function galRunSlashFix(cmd, fallback) {
    try {
        let exec = null;
        try { if (window.__acTestSlash && typeof window.__acTestSlash === 'function') exec = window.__acTestSlash; } catch (e) { /* ignore */ }
        if (!exec && ctx.executeSlashCommands) exec = ctx.executeSlashCommands.bind(ctx);
        if (!exec) {
            try { fallback(); } catch (e) { galAutoFixDone(); }
            return;
        }
        console.debug('[命运织机] 自动修复命令：' + cmd);
        let p = null;
        try { p = exec(cmd); } catch (e) { try { fallback(); } catch (e2) { galAutoFixDone(); } return; }
        if (p && typeof p.then === 'function') {
            p.then(function () { galAutoFixDone(); }, function () { galAutoFixDone(); });
        } else {
            setTimeout(function () { galAutoFixDone(); }, 3000);
        }
    } catch (e) {
        try { fallback(); } catch (e2) { galAutoFixDone(); }
    }
}

// DOM 回退点击后不能立刻当成生成完成：等生成标记消失或超时
function galAfterDomClickFallback() {
    let waited = 0;
    const check = function () {
        waited += 800;
        let generating = false;
        try { generating = document.body && document.body.dataset && document.body.dataset.generating === 'true'; } catch (e) { /* ignore */ }
        if (generating && waited < 120000) { setTimeout(check, 800); return; }
        galClearAwaiting();
        setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 800);
        galScheduleAutoFix(1800);
    };
    setTimeout(check, 1200);
}

// 截断自动重roll：独立 tick 驱动
function galStallFix() {
    try {
        const ar = state.autoReroll = state.autoReroll || {};
        if (ar.stopping) return;
        ar.stopping = true;
        const stall = Math.max(5, Math.min(10, Number(settings().vnStallSeconds) || 10));
        try { toast('连续 ' + stall + ' 秒没有新字，判定卡住：停止后重新生成…', null, 4000); } catch (e) { /* ignore */ }
        try { if (state.gal) state.gal.rerolling = true; } catch (e) { /* ignore */ }
        try {
            const sb = document.getElementById('mes_stop');
            if (sb && getComputedStyle(sb).display !== 'none') sb.click();
        } catch (e) { /* ignore */ }
        galClearAwaiting();
        let waited = 0;
        const check = function () {
            waited += 500;
            let gen = false;
            try { gen = document.body && document.body.dataset && document.body.dataset.generating === 'true'; } catch (e) { /* ignore */ }
            if (gen && waited < 15000) { setTimeout(check, 500); return; }
            setTimeout(function () {
                try { galLoad(); } catch (e) { /* ignore */ }
                setTimeout(function () {
                    try {
                        const chat = (live().chat || []);
                        const last = chat[chat.length - 1];
                        const isUser = !!(last && last.is_user);
                        const _dl = Math.max(5, Math.min(60, Number(settings().vnRerollDelay) || 15)) * 1000;
                        galHint('✍️ 等待 ' + Math.round(_dl / 1000) + ' 秒让服务端冷却后重新生成…', true);
                        setTimeout(function () {
                            try {
                                ar.stopping = false;
                                const ovNow = document.getElementById('ac-gal-overlay');
                                if (!ovNow || !ovNow.classList.contains('on') || galIsActuallyGenerating() || (state.gal && state.gal.quietGen)) {
                                    if (state.gal) state.gal.rerolling = false;
                                    return;
                                }
                                galBeginAutoRegenUI(isUser ? 'trigger' : 'reroll');
                                const cmd = isUser ? '/trigger await=true' : '/regenerate await=true';
                                const fallback = function () {
                                    try { isUser ? galClickSend() : galClickRegenerate(); } catch (e) { /* ignore */ }
                                };
                                galRunSlashFix(cmd, fallback);
                            } catch (e) { ar.stopping = false; }
                        }, _dl);
                    } catch (e) { ar.stopping = false; }
                }, 700);
            }, 800);
        };
        setTimeout(check, 500);
    } catch (e) { /* ignore */ }
}

function galAutoFixTick() {
    try {
        if (!settings().vnAutoReroll) return;
        const ar0 = state.autoReroll = state.autoReroll || {};
        if (state.gal && state.gal.quietGen) { galScheduleAutoFix(4000); return; }
        if (galIsGenerating()) {
            // 生成中：监控「连续 N 秒没有新字」→ 判定卡住并重roll
            // 注意：模型「思考」阶段正文还没出现（可能很久），这不算卡住，不能杀
            try {
                const el = document.querySelector('#chat .mes.last_mes');
                const bodyEl = el ? el.querySelector('.mes_text') : null;
                const bodyLen = bodyEl ? String(bodyEl.textContent || '').trim().length : 0;
                const reasonEl = el ? el.querySelector('.mes_reasoning, .reasoning, [class*="reasoning"]') : null;
                const reasonLen = reasonEl ? String(reasonEl.textContent || '').length : 0;
                const domLen = (el ? String(el.textContent || '').length : 0) + reasonLen;
                const now = Date.now();
                const lastTok = Number(state.lastTokenAt || 0);
                const stallMs = Math.max(5, Math.min(10, Number(settings().vnStallSeconds) || 10)) * 1000;
                if (bodyLen <= 0) {
                    // 正文一个字都还没出来 = 还在思考/刚开始，重置计时，不判定
                    ar0.domLen = domLen; ar0.domAt = now; ar0.stallAt = 0;
                } else if (ar0.domLen !== domLen || lastTok > (ar0.domAt || 0)) {
                    ar0.domLen = domLen;
                    ar0.domAt = Math.max(now, lastTok);
                    ar0.stallAt = 0;
                } else if (now - (ar0.domAt || now) >= stallMs) {
                    // 连续 N 秒没新字：先提示，再等 3 秒二次确认，确认后才停止+重roll
                    if (!ar0.stallAt) {
                        ar0.stallAt = now;
                        try { galHint('⚠️ 连续 ' + Math.round(stallMs / 1000) + ' 秒没有新字，再等 3 秒确认…', true); } catch (e) { /* ignore */ }
                    } else if (now - ar0.stallAt >= 3000) {
                        ar0.stallAt = 0;
                        ar0.domAt = now;
                        if (!ar0.stopping) galStallFix();
                    }
                }
            } catch (e) { /* ignore */ }
            galScheduleAutoFix(1000);
            return;
        }
        ar0.stopping = false;
        const ov = document.getElementById('ac-gal-overlay');
        if (!ov || !ov.classList.contains('on')) return;
        if (galIsUserBusy()) { galScheduleAutoFix(3000); return; }
        const chat = (live().chat || []);
        if (!chat.length) return;
        const last = chat[chat.length - 1];
        const max = Math.max(1, Math.min(5, Number(settings().vnAutoRerollMax) || 2));
        const MAX_TOTAL = 6;   // 一次 Galgame 会话内最多自动修 6 次，防死循环
        const ar = state.autoReroll = state.autoReroll || { turnKey: '', count: 0, actedAt: 0, inFlight: false, total: 0 };
        const key = galFixTurnKey(chat);
        if (ar.turnKey !== key) { ar.turnKey = key; ar.count = 0; }
        if (ar.inFlight) return;
        const isUserLast = !!last.is_user;
        const truncated = !isUserLast && galLastAiTruncated();
        if (!isUserLast && !truncated) { ar.count = 0; ar.lastLen = 0; ar.lastAt = 0; return; }   // 已有完整正文
        // 只有「连续 N 秒没有新字」才算截断（N=5~10，默认 8）
        const stallMs = Math.max(5, Math.min(10, Number(settings().vnStallSeconds) || 10)) * 1000;
        const curLen = String(last.mes || '').length;
        if (ar.lastLen !== curLen) { ar.lastLen = curLen; ar.lastAt = Date.now(); galScheduleAutoFix(2000); return; }
        if (ar.lastAt && Date.now() - ar.lastAt < stallMs) { galScheduleAutoFix(1500); return; }
        // 别的扩展的 quiet 生成还没跑完：先等，别抢
        if (state.gal && state.gal.quietGen) { galScheduleAutoFix(4000); return; }
        // 动作：没回复→补回复；截断→重新生成（不再续写补全）
        const act = isUserLast ? 'trigger' : 'reroll';
        // 自动重roll 不抢：生成结束后先等 N 秒（默认 15），让服务端/其它后台任务冷却
        const _delayMs = Math.max(5, Math.min(60, Number(settings().vnRerollDelay) || 15)) * 1000;
        const _sinceEnd = state.lastGenEndAt ? (Date.now() - state.lastGenEndAt) : 999999;
        if (_sinceEnd < _delayMs) { galScheduleAutoFix(_delayMs - _sinceEnd + 300); return; }
        const COOLDOWN = 5000;
        const elapsed = Date.now() - (ar.actedAt || 0);
        if (elapsed < COOLDOWN) { galScheduleAutoFix(COOLDOWN - elapsed + 100); return; }
        if (ar.count >= max) {
            if (!ar.maxToast) { ar.maxToast = true; try { toast(isUserLast ? '自动生成回复已试满 ' + max + ' 次，请手动点发送' : '自动重roll 已用满 ' + max + ' 次，请手动处理', null, 5000); } catch (e) { /* ignore */ } }
            return;
        }
        if (ar.total >= MAX_TOTAL) {
            if (!ar.totalToast) { ar.totalToast = true; try { toast('自动修复次数已达上限（' + MAX_TOTAL + ' 次），先手动检查一下吧', null, 5000); } catch (e) { /* ignore */ } }
            return;
        }
        ar.count++;
        ar.total++;
        ar.actedAt = Date.now();
        ar.inFlight = true;
        ar.maxToast = false;
        if (state.gal) state.gal.rerolling = true;
        const _tip = act === 'trigger' ? '上一条消息没有 AI 回复，自动生成回复（' + ar.count + '/' + max + '）…'
            : '回复被截断，自动重新生成（' + ar.count + '/' + max + '）…';
        try { toast(_tip, null, 4000); } catch (e) { /* ignore */ }
        try { galHint('⚠️ ' + _tip, true); } catch (e) { /* ignore */ }
        const fallback = function () {
            try {
                let ok = false;
                if (act === 'trigger') ok = galClickSend();
                else ok = galClickRegenerate();
                if (!ok) { ar.inFlight = false; if (state.gal) state.gal.rerolling = false; return; }
                galAfterDomClickFallback();
            } catch (e) {
                ar.inFlight = false;
                if (state.gal) state.gal.rerolling = false;
            }
        };
        galBeginAutoRegenUI(act === 'trigger' ? 'trigger' : 'reroll');
        if (act === 'trigger') galRunSlashFix('/trigger await=true', fallback);
        else galRunSlashFix('/regenerate await=true', fallback);
    } catch (e) { /* ignore */ }
}

async function galSendText(text) {
    const t = String(text || '').trim();
    if (!t) return;
    if (state.gal && state.gal.sent) {
        toast('已经发过一条了，等 AI 写完再操作', null, 3000);
        return;
    }
    try {
        if (!state.gal) state.gal = { segs: [], i: 0, mesIndex: -1, name: '', sent: false, busy: false };
        // 上一次失败/终止留下的半截正文先删掉，避免重复
        try { await galDropPartialMessage(); } catch (e) { /* ignore */ }
        state.gal.sent = true;
        state.gal.awaiting = true;
        state.gal.genStarted = false;
        state.gal.mainGen = false;
        state.gal.quietGen = false;
        galStopTyping();
        state.gal.awaitingAt = Date.now();
        state.gal.sendMesIndex = (function () { const last = galLastAiMessage(); return last ? (ctx.chat || []).indexOf(last) : -1; })();
        state.gal.lastLen = -1;
        galStartPolling();
        // 立刻禁用按钮，防重复点击
        const cb = document.getElementById('ac-gal-choice-btn');
        if (cb) { cb.disabled = true; cb.textContent = '已发送，等 AI 写…'; }
        const cw = document.getElementById('ac-gal-choice');
        if (cw) { cw.classList.remove('on'); }
        const input = document.getElementById('ac-gal-input');
        if (input) input.classList.remove('on');
        galHint('✍️ 已发送，AI 正在写…', true);
        galUpdateStopBtn();
        const ta = document.getElementById('send_textarea');
        if (!ta) {
            state.gal.sent = false;
            state.gal.awaiting = false;
            galStopPolling();
            galUpdateStopBtn();
            toast('没找到聊天输入框 (#send_textarea)，请刷新页面再试', null, 3000);
            return;
        }
        ta.value = t;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        const btn = document.getElementById('send_but');
        if (btn) btn.click(); else ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        const inputText = document.getElementById('ac-gal-input-text');
        if (inputText) inputText.value = '';
    } catch (e) {
        console.warn('[命运织机] Galgame 发送失败', e);
        try {
            if (state.gal) { state.gal.sent = false; state.gal.awaiting = false; state.gal.busy = false; }
            galStopPolling();
            galUpdateStopBtn();
        } catch (e2) { /* ignore */ }
    }
}

function galSendInput() {
    const input = document.querySelector('#ac-gal-input-text');
    if (!input) return;
    galSendText(input.value);
}

function galUpdate() {
    if (!settings().vnMode) return;
    const ov = document.getElementById('ac-gal-overlay');
    if (!ov || !ov.classList.contains('on')) { galEnsureOpenBtn(); return; }
    galLoad();
}

function refreshGalModeUI() {
    try {
        const it = document.getElementById('ac-gal-mode-it');
        if (it) it.textContent = 'Galgame 模式：' + (settings().vnMode ? '开' : '关');
        const b = document.getElementById('ac-gal-quick');
        if (b) {
            const ov = document.getElementById('ac-gal-overlay');
            const on = !!(ov && ov.classList.contains('on'));
            const lbl = b.querySelector('span');
            if (lbl) lbl.textContent = on ? '⏹ Galgame' : '▶ Galgame';
            b.classList.toggle('on', on);
        }
    } catch (e) { /* ignore */ }
}

function galEnsureOpenBtn() {
    let btn = document.getElementById('ac-gal-open');
    if (!settings().vnMode) { if (btn) btn.remove(); return; }
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'ac-gal-open';
        btn.textContent = '▶ Galgame';
        btn.addEventListener('click', function () { galOpen(); });
        document.body.appendChild(btn);
    }
    const ov = document.getElementById('ac-gal-overlay');
    btn.classList.toggle('on', !!galChatAlive() && !(ov && ov.classList.contains('on')));
}

// 「输出卫生」系统提示：让模型别自己吐元数据符号
const CLEAN_KEY = 'AC_CLEAN';
const CLEAN_TEXT = [
    '【输出卫生】',
    '正文结尾不要输出 <StatusPlaceHolderImpl/>、]]>、[]、][] 这类占位符或脚本残片；',
    '也不要输出 JSON 数组、聊天记录片段、变量更新数据等元数据。只写正文；中文请直接写，不要输出 \\uXXXX 这类转义。',
].join(String.fromCharCode(10)) + String.fromCharCode(10);
function applyCleanRule() {
    try {
        if (!ctx.setExtensionPrompt) return;
        ctx.setExtensionPrompt(CLEAN_KEY, CLEAN_TEXT, 1, 2, false, 0);
    } catch (e) { /* ignore */ }
}

// ── 诊断事件环形缓冲 + 诊断面板（Ctrl+Alt+D）──
const GAL_DIAG_MAX = 120;
function galDiag(type, data) {
    try {
        state.diag = state.diag || [];
        state.diag.push({ t: new Date().toISOString().slice(11, 23), type: String(type), data: data || {} });
        if (state.diag.length > GAL_DIAG_MAX) state.diag.shift();
    } catch (e) { /* ignore */ }
}
function galDiagSnapshot() {
    try {
        const st = state.gal || {};
        const ar = state.autoReroll || {};
        const speakers = st.segs ? (function () { try { return galGetSpeakers(st); } catch (e) { return []; } })() : [];
        const i = st.i == null ? -1 : st.i;
        let names = [];
        try { names = galNamePairs().map(function (n) { return n.name + (n.user ? '(user)' : ''); }); } catch (e) { /* ignore */ }
        return {
            version: VERSION,
            settings: {
                vnMode: settings().vnMode, speakerTag: settings().speakerTag !== false, hideChatTags: settings().hideChatTags !== false,
                vnAutoReroll: settings().vnAutoReroll !== false, vnStallSeconds: settings().vnStallSeconds, vnRerollDelay: settings().vnRerollDelay,
                vnSprite: settings().vnSprite !== false,
            },
            gal: {
                i: i, segCount: (st.segs || []).length,
                speaker: (speakers[i] || ''), segTextHead: String((st.segs || [])[i] || '').slice(0, 80),
                awaiting: !!st.awaiting, busy: !!st.busy, rerolling: !!st.rerolling, mainGen: !!st.mainGen, quietGen: !!st.quietGen,
                sceneCast: st.sceneCast || [], spriteCast: st.spriteCast || [],
                segs: (st.segs || []).map(function (s, k) { return k + '|' + String(speakers[k] || '') + '|' + String(s).replace(/\s+/g, ' ').slice(0, 60); }),
            },
            autoReroll: { count: ar.count || 0, total: ar.total || 0, tagFixCount: ar.tagFixCount || 0, lastKey: ar.lastFixKey || '', inFlight: !!ar.inFlight },
            names: names,
            events: (state.diag || []).slice(-60),
        };
    } catch (e) { return { error: String(e) }; }
}
function galDiagRender() {
    try {
        let p = document.getElementById('ac-diag-panel');
        if (!p) {
            p = document.createElement('div');
            p.id = 'ac-diag-panel';
            p.className = 'ac-diag';
            document.body.appendChild(p);
        }
        const snap = galDiagSnapshot();
        p.innerHTML = '<div class="ac-diag-head"><b>命运织机 · 诊断</b><span><button id="ac-diag-copy">复制 JSON</button><button id="ac-diag-close">关闭</button></span></div>' +
            '<pre class="ac-diag-body">' + esc(JSON.stringify(snap, null, 2)) + '</pre>';
        p.classList.add('on');
        const cp = document.getElementById('ac-diag-copy');
        if (cp) cp.addEventListener('click', function () {
            try {
                const txt = JSON.stringify(galDiagSnapshot(), null, 2);
                if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt);
                toast('诊断 JSON 已复制', null, 2000);
            } catch (e) { /* ignore */ }
        });
        const cl = document.getElementById('ac-diag-close');
        if (cl) cl.addEventListener('click', function () { p.classList.remove('on'); });
    } catch (e) { /* ignore */ }
}
try {
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.altKey && String(e.key || '').toLowerCase() === 'd') {
            e.preventDefault();
            const p = document.getElementById('ac-diag-panel');
            if (p && p.classList.contains('on')) p.classList.remove('on');
            else galDiagRender();
        }
    }, true);
    window.__acDiag = galDiagSnapshot;
    window.__acHook = { diag: galDiagSnapshot, tagCheck: galCheckMissingTags, hideTags: galHideChatSpeakerTags };
} catch (e) { /* ignore */ }

// ── 漏标检测：正文里有多少句台词没有【角色名】标注 ──
function galCheckMissingTags(raw) {
    try {
        let text = String(raw || '');
        const gm = text.match(/<game[^>]*>([\s\S]*?)<\/game>/i);
        if (gm) text = gm[1];
        text = text.replace(/<details[\s\S]*?<\/details>/gi, '').replace(/<[^>]+>/g, '');
        const lines = text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
        let dialogue = 0, untagged = 0;
        for (const line of lines) {
            if (/^(\*[\s\S]*\*|（[\s\S]*）|\([\s\S]*\)|-{3,}|·{3,})$/.test(line)) continue;
            if (/^剧情推进\s*[：:]/.test(line)) continue;
            if (!/[“「][^”」]{2,}[”」]/.test(line)) continue;
            dialogue++;
            if (!/^【[^】]{1,20}】\s*[：:]?/.test(line)) untagged++;
        }
        return { dialogue: dialogue, untagged: untagged, ratio: dialogue ? untagged / dialogue : 0 };
    } catch (e) { return { dialogue: 0, untagged: 0, ratio: 0 }; }
}
function galLastAiMsg() {
    try {
        const chat = live().chat || [];
        for (let i = chat.length - 1; i >= 0; i--) { if (!chat[i].is_user && !chat[i].is_system) return chat[i]; }
    } catch (e) { /* ignore */ }
    return null;
}
function galTagCheckSoon() {
    try {
        clearTimeout(state._tagCheckTimer);
    } catch (e) { /* ignore */ }
    try {
        state._tagCheckTimer = setTimeout(function () {
            try {
                const s = settings();
                if (!s.vnMode || s.speakerTag === false) return;
                const last = galLastAiMsg();
                if (!last) return;
                const ar = state.autoReroll = state.autoReroll || {};
                let key = '';
                try { key = String(galFixTurnKey(live().chat || [])); } catch (e) { key = String(String(last.send_date || '') + String(last.mes || '').length); }
                const chk = galCheckMissingTags(last.mes);
                galDiag('tag_check', { key: key, dialogue: chk.dialogue, untagged: chk.untagged, ratio: Math.round(chk.ratio * 100) / 100 });
                if (!chk.dialogue) return;
                if (chk.untagged > 0 && ar.tagNoticedKey !== key) {
                    ar.tagNoticedKey = key;
                    if (chk.ratio <= 0.35) { try { toast('⚠️ ' + chk.untagged + '/' + chk.dialogue + ' 句台词没标说话人，已用自动识别（可能不准）', null, 4000); } catch (e) { /* ignore */ } }
                }
                if (chk.ratio > 0.35 && chk.dialogue >= 3) {
                    if (s.vnAutoReroll === false) return;
                    const maxTagFix = 2;
                    if ((ar.tagFixCount || 0) >= maxTagFix) return;
                    if (ar.tagRerollKey === key || ar.inFlight || ar.stopping) return;
                    if (galIsActuallyGenerating() || (state.gal && state.gal.quietGen)) return;
                    ar.tagRerollKey = key;
                    ar.tagFixCount = (ar.tagFixCount || 0) + 1;
                    ar.inFlight = true;
                    ar.actedAt = Date.now();
                    if (state.gal) state.gal.rerolling = true;
                    try { toast('⚠️ ' + chk.untagged + '/' + chk.dialogue + ' 句台词没标说话人，自动重写（' + ar.tagFixCount + '/' + maxTagFix + '）…', null, 4500); } catch (e) { /* ignore */ }
                    galDiag('tag_reroll', { count: ar.tagFixCount, untagged: chk.untagged, dialogue: chk.dialogue });
                    setTimeout(function () {
                        try {
                            if (galIsActuallyGenerating()) { ar.inFlight = false; if (state.gal) state.gal.rerolling = false; return; }
                            galBeginAutoRegenUI('reroll');
                            galRunSlashFix('/regenerate await=true', function () {
                                try {
                                    if (!galClickRegenerate()) { ar.inFlight = false; if (state.gal) state.gal.rerolling = false; }
                                } catch (e) { ar.inFlight = false; if (state.gal) state.gal.rerolling = false; }
                            });
                        } catch (e) { ar.inFlight = false; if (state.gal) state.gal.rerolling = false; }
                    }, 1200);
                }
            } catch (e) { /* ignore */ }
        }, 1600);
    } catch (e) { /* ignore */ }
}

// ── 聊天显示里隐藏【角色名】：标注（只改 DOM，不动聊天记录）──
function galHideChatSpeakerTags(mesId) {
    try {
        if (settings().hideChatTags === false) return;
        const sel = (mesId !== undefined && mesId !== null && String(mesId).trim() !== '')
            ? '.mes[mesid="' + String(mesId) + '"] .mes_text' : '#chat .mes_text';
        document.querySelectorAll(sel).forEach(function (el) {
            if (!el) return;
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            for (let node of nodes) {
                if (!node || !node.nodeValue || !node.parentNode) continue;
                if (node.parentElement && node.parentElement.classList && node.parentElement.classList.contains('ac-hidden-spk')) continue;
                const tagRe = /(【[^】\n]{1,16}】\s*[：:]?\s*)(?=[“"「『])/;
                let m;
                let guard = 0;
                while ((m = tagRe.exec(node.nodeValue)) !== null && guard++ < 20) {
                    if (m.index > 0) node = node.splitText(m.index);
                    const afterNode = node.splitText(m[1].length);
                    const span = document.createElement('span');
                    span.className = 'ac-hidden-spk';
                    span.textContent = m[1];
                    try { node.parentNode.replaceChild(span, node); } catch (e) { break; }
                    node = afterNode;
                }
            }
        });
    } catch (e) { /* ignore */ }
}

// ── 后台 LLM 失败提示（节流）──
function galBgWarn(msg) {
    try {
        const now = Date.now();
        if (now - (state._bgWarnAt || 0) < 60000) return;
        state._bgWarnAt = now;
        toast('⚠️ ' + msg, null, 5000);
    } catch (e) { /* ignore */ }
}

// ── 台词说话人显式标注（保证 Galgame 姓名/立绘 100% 正确）──
const SPK_KEY = 'AC_SPK';
const SPK_TEXT = [
    '【台词说话人标注（硬性要求，必须遵守）】',
    '正文里每一句用中文引号“”标出的台词，都必须在引号前标注说话人，格式：【角色名】：“台词”',
    '角色名必须与世界书/人物设定里的名字一致（例如：小雪、阿岚、顾言）。',
    '同一段里不同人的台词分别标注；同一个人连续多句，每一句都要标。',
    '旁白、动作描写、内心 <details>、#### 音效行、以及最后的「剧情推进：」这一行不要加标注。',
    '示例：【小雪】：“你回来啦。”',
    'Galgame 阅读器靠这个标注显示正确立绘，请务必逐句标注，不要遗漏。',
].join(String.fromCharCode(10)) + String.fromCharCode(10);
function applySpeakerTag() {
    try {
        if (!ctx.setExtensionPrompt) return;
        if (settings().speakerTag === false) { ctx.setExtensionPrompt(SPK_KEY, '', 1, 1, false, 0); return; }
        ctx.setExtensionPrompt(SPK_KEY, SPK_TEXT, 1, 1, false, 0);
    } catch (e) { /* ignore */ }
}

// ── 正文末尾的剧情推进（20~50 字，随正文一起生成）──
const ADVANCE_KEY = 'AC_ADVANCE';
// 剧情推进的结尾内容：只允许「{{user}}（或扮演角色）的言行」或「环境/动作描写」
// 不允许写其他角色的台词、内心、决定（避免推进选项替别人说话）
function buildAdvanceText() {
    const s = (function () { try { return settings(); } catch (e) { return {}; } })();
    const playChar = String((s && s.playChar) || '').trim();
    const ensemble = !!(s && s.ensemble);
    const preset = String((s && s.formatPreset) || 'classic');
    const fmt = (preset === 'webnovel') ? [
        '【正文格式（网文音效流，硬性要求，必须遵守）】',
        '1. 第三人称叙述；环境和动作照常叙述，不要强制斜体、粗体，也不要用折叠。',
        '2. 对白：用中文引号“”，对白独立成句/成段；不要用「」或英文引号。',
        '3. 环境音效、布料摩擦、水声、撞击等：单独一行写成 ### *拟声词或声音描述*（三级标题 + 斜体）。',
        '4. 角色的短促喘息/低语/感叹：单独一行写成 #### *“短句”*（四级标题 + 斜体）。',
        '5. 心理活动直接叙述，短句可以单独成段；不要用 <details> 折叠、不要用 --- 分隔线、不要用代码块。',
        '6. 正文最后必须另起一段，以「剧情推进：」开头，写 20~50 字，其中【必须包含】所选主角亲口说的一句台词（用中文引号“”标出），不能只写环境/动作：',
    ] : [
        '【正文格式与结尾推进（硬性要求，必须遵守）】',
        '1. 环境/场景/氛围描写：整段用 *斜体*。',
        '2. 关键动作、情绪爆点：用 **粗体**，一条回复最多 2~3 处。',
        '3. 内心独白/心理活动：用 <details><summary>内心-角色名</summary>……</details> 折叠。',
        '4. 场景切换/时间跳跃：单独一行 ---。',
        '5. 普通对话：双引号普通文字；不要自己用 #/## 标题、不要用代码块包正文。',
        '6. 正文最后必须另起一段，以「剧情推进：」开头，写 20~50 字，其中【必须包含】所选主角亲口说的一句台词（用中文引号“”标出），不能只写环境/动作：',
    ];
    const lines = fmt.concat([
        '   ① 这句台词必须是「所选主角」（玩家正在扮演/代入的那个角色）亲口说的，用中文引号“”标出；',
        '   ② 可以在这句台词前后补一个动作或神态，凑够 20~50 字；但【不能】只写环境描写或动作描写而没有主角台词。',
        '   【禁止】写其他角色（NPC）的台词、内心独白、决定或替他们说话；也不要写「别人对{{user}}说」的句子。',
    ]);
    if (playChar) {
        lines.push('   当前玩家扮演「' + playChar + '」：这条推进【必须】包含「' + playChar + '」亲口说的一句台词（引号内），可以再加一个动作。');
        lines.push('   格式示例：剧情推进：「' + playChar + '」抬手替她把围巾往上拉了拉，低声说：“外面冷，早点回去。”');
        lines.push('   【错误示例】剧情推进：窗外的雪越下越大，路灯轻轻晃了一下。（没有主角台词 → 不合格）');
    } else {
        lines.push('   当前玩家是 {{user}}：这条推进【必须】包含 {{user}}（你）亲口说的一句台词（引号内），可以再加一个动作。');
        lines.push('   格式示例：剧情推进：你伸手替她把围巾往上拉了拉，低声说：“外面冷，早点回去。”');
        lines.push('   【错误示例】剧情推进：窗外的雪越下越大，路灯轻轻晃了一下。（没有主角台词 → 不合格）');
    }
    if (ensemble) {
        lines.push('   当前是群像模式：仍然【必须】包含所选主角的一句台词（不能只写环境/旁白），但不要替其他角色说话。');
    }
    lines.push('   必须带「剧情推进：」前缀，不要解释、不要总结。');
    return lines.join(String.fromCharCode(10)) + String.fromCharCode(10);
}
function applyAdvance() {
    try {
        if (!ctx.setExtensionPrompt) return;
        if (!settings().advance) { ctx.setExtensionPrompt(ADVANCE_KEY, '', 1, 1, false, 0); try { applySpeakerTag(); } catch (e2) { /* ignore */ } return; }
        ctx.setExtensionPrompt(ADVANCE_KEY, buildAdvanceText(), 1, 1, false, 0);
        try { applySpeakerTag(); } catch (e3) { /* ignore */ }
    } catch (e) { /* ignore */ }
}

// ── 群像模式：不围绕 user，多角色群像演绎 ──
const ENSEMBLE_KEY = 'AC_ENSEMBLE';
const ENSEMBLE_TEXT = [
    '【群像模式】',
    '本轮写群像，不要围绕{{user}}展开：不要替{{user}}行动、说话或做决定，也不要让所有人都只对{{user}}说话。',
    '{{user}} 只是旁观者/导演视角，最多被顺带提及一句。',
    '把镜头交给在场的多个角色：每个人都要有自己的欲望、小动作和反应，可以轮流切换焦点。',
    '用户消息是导演指令（例如「让 A 和 B 吵起来」）就照做；如果只是空白或「继续」，就自然推进当前群像场面。',
].join(String.fromCharCode(10)) + String.fromCharCode(10);

function applyEnsemble() {
    try {
        if (!ctx.setExtensionPrompt) return;
        if (!settings().ensemble) { ctx.setExtensionPrompt(ENSEMBLE_KEY, '', 1, 0, false, 0); try { applyAdvance(); } catch (e) { /* ignore */ } return; }
        // position=1（聊天内）、depth=0（紧贴最后一条）、role=0（system）
        ctx.setExtensionPrompt(ENSEMBLE_KEY, ENSEMBLE_TEXT, 1, 0, true, 0);
        try { applyAdvance(); } catch (e) { /* ignore */ }
        console.log('[命运织机] 群像模式已注入');
    } catch (e) { console.warn('[命运织机] 群像模式注入失败', e); }
}

// ── 扮演模式：以某个角色的身份玩 ──
const PLAY_KEY = 'AC_PLAY';
function applyPlay() {
    try {
        if (!ctx.setExtensionPrompt) return;
        const nm = String(settings().playChar || '').trim();
        if (!nm) { ctx.setExtensionPrompt(PLAY_KEY, '', 1, 0, false, 0); try { applyAdvance(); } catch (e) { /* ignore */ } return; }
        const text = [
            '【玩家扮演模式】',
            '{{user}} 正在扮演「' + nm + '」：用户发来的消息就是「' + nm + '」的言行与决定。',
            '正文里不要替「' + nm + '」说话、不要替 TA 做决定、不要描写 TA 的内心；只写其他角色、环境，以及他们对{{user}}言行的反应。',
            '「' + nm + '」的外貌、性格、口癖按世界书设定来写（可以从别人视角顺带描写）。',
            '不要让「' + nm + '」以 NPC 身份自己出场说话。',
        ].join(String.fromCharCode(10)) + String.fromCharCode(10);
        ctx.setExtensionPrompt(PLAY_KEY, text, 1, 0, true, 0);
        try { applyAdvance(); } catch (e) { /* ignore */ }
        console.log('[命运织机] 扮演模式已注入：' + nm);
    } catch (e) { console.warn('[命运织机] 扮演模式注入失败', e); }
}

// 确保存在一个同名 persona（没有就建一个，头像用纯色占位图）
async function ensurePersonaFor(name, description) {
    const m = await import('/scripts/personas.js');
    const map = (ctx.powerUserSettings || {}).personas || {};
    const exist = Object.entries(map).find(function (kv) { return String(kv[1]) === name; });
    if (exist) { await m.setUserAvatar(exist[0], { toastPersonaNameChange: false }); return exist[0]; }
    // 生成一个占位头像
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const g = canvas.getContext('2d');
    g.fillStyle = '#3d6b5d'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#dfe6e6'; g.font = 'bold 130px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(name).slice(0, 1), 128, 138);
    const blob = await new Promise(function (res) { canvas.toBlob(res, 'image/png'); });
    const avatarId = Date.now() + '-' + String(name).replace(/[^\w]、-]/g, '') + '.png';
    const fd = new FormData();
    fd.append('avatar', new File([blob], 'avatar.png', { type: 'image/png' }));
    fd.append('overwrite_name', avatarId);
    const res = await fetch('/api/avatars/upload', {
        method: 'POST',
        headers: ctx.getRequestHeaders({ omitContentType: true }),
        body: fd,
    });
    if (!res.ok) throw new Error('上传 persona 头像失败 HTTP ' + res.status);
    await m.initPersona(avatarId, name, description || '', '玩家扮演');
    await m.setUserAvatar(avatarId, { toastPersonaNameChange: false });
    return avatarId;
}

async function doPlayAs(name) {
    try {
        const s = settings();
        const book = effectiveBook();
        let desc = '';
        try {
            const cl = await listCharacters(book);
            const c = (cl || []).find(function (x) { return x.name === name; });
            if (c) desc = c.entries.map(function (e) { return String(e.content || ''); }).join(String.fromCharCode(10, 10)).slice(0, 2600);
        } catch (e) { /* ignore */ }
        desc = desc.replace(/<[^>]+>/g, '').trim();
        // 记住当前身份，退出时还原
        const map = (ctx.powerUserSettings || {}).personas || {};
        const cur = Object.entries(map).find(function (kv) { return String(kv[1]) === String(ctx.name1 || ''); });
        if (cur) s.playPrevAvatar = cur[0];
        s.playChar = name;
        s.ensemble = false;   // 扮演和群像互斥
        persist();
        await ensurePersonaFor(name, desc);
        applyPlay(); applyEnsemble();
        toast('已进入扮演模式：你现在是「' + name + '」', null, 6000);
        try { await refreshOverview(); } catch (e) { /* ignore */ }
    } catch (e) {
        toast('扮演模式开启失败：' + ((e && e.message) || e), null, 8000);
        console.warn('[命运织机] 扮演模式失败', e);
    }
}

async function exitPlayAs() {
    const s = settings();
    s.playChar = '';
    persist();
    applyPlay();
    if (s.playPrevAvatar) {
        try {
            const m = await import('/scripts/personas.js');
            await m.setUserAvatar(s.playPrevAvatar, { toastPersonaNameChange: false });
        } catch (e) { console.warn('[命运织机] 还原 persona 失败', e); }
        s.playPrevAvatar = '';
        persist();
    }
    toast('已退出扮演模式', null, 3000);
    try { await refreshOverview(); } catch (e) { /* ignore */ }
}

// 快速切换用户身份（Persona）
async function switchPersona(avatar) {
    try {
        const m = await import('/scripts/personas.js');
        if (!m || !m.setUserAvatar) throw new Error('找不到 setUserAvatar');
        await m.setUserAvatar(avatar, { toastPersonaNameChange: false });
        const nm = ((ctx.powerUserSettings || {}).personas || {})[avatar] || avatar;
        toast('已切换用户身份：' + nm, null, 3000);
        try { await refreshOverview(); } catch (e) { /* ignore */ }
    } catch (e) {
        toast('切换身份失败：' + ((e && e.message) || e), null, 6000);
        console.warn('[命运织机] 切换 persona 失败', e);
    }
}

// 每轮生成前调用（同步）
function runDirector() {
    try {
        const s = settings();
        if (!s.director) { clearDirector(); return; }
        if (!ctx.setExtensionPrompt) return;

        // 玩家指定的人 = 一发强制令：无视场景、无视节奏，下一轮必定出场
        // （不然你把出场频率调成 15 楼，指定的人要等 15 轮，那不叫指定）
        const playerPicked = (s.directorMode === 'pin' && s.directorPin) || state.forceNext;

        // 全局节奏：不管轮到谁，两次安排之间至少隔 directorEvery 楼
        // 玩家指定的人不吃这条限制
        const every = Math.max(1, Number(s.directorEvery) || 3);
        const meta = dirMeta();
        const floorNow = msgTexts().length;
        if (!playerPicked && meta.lastFloor != null && floorNow - meta.lastFloor < every) { clearDirector(); return; }
        meta.lastFloor = floorNow;
        persist();

        // 注入的这个词必须真的在某个条目的 keys 里，否则扫不到
        const triggerOf = function (nm5) {
            const c5 = ((state.dirCache && state.dirCache.chars) || []).find(function (x) { return x.name === nm5; });
            const ks = (c5 && c5.keys) || [];
            if (!ks.length) return nm5;
            if (ks.indexOf(nm5) >= 0) return nm5;
            for (const k5 of ks) { if (nm5.indexOf(k5) >= 0 || k5.indexOf(nm5) >= 0) return k5; }
            return ks[0];
        };

        // ── 指定的人出场后自动取消 ──
        // 判断依据是「上一条回复里真的有她的名字/关键词」，不是注入成功就取消。
        // 这样模型万一没写她，下一轮还会继续催。
        try {
            if (s.directorMode === 'pin' && s.directorPin) {
                const ch = (live().chat || []);
                let lastAi = null;
                for (let i2 = ch.length - 1; i2 >= 0; i2--) {
                    if (ch[i2] && !ch[i2].is_user && ch[i2].mes) { lastAi = ch[i2]; break; }
                }
                const aiTxt = lastAi ? String(lastAi.mes) : '';
                const pinName2 = String(s.directorPin);
                const trig2 = triggerOf(pinName2);
                const newReply = ch.length > (Number(s.directorPinAt) || 0);
                if (newReply && aiTxt && (aiTxt.indexOf(pinName2) >= 0 || (trig2 && trig2 !== pinName2 && aiTxt.indexOf(trig2) >= 0))) {
                    s.directorPin = '';
                    s.directorMode = 'rotate';
                    s.directorPinAt = 0;
                    persist();
                    console.log('[命运织机] 「' + pinName2 + '」已经出场，自动取消指定');
                    try { renderMini(false); } catch (e) {}
                    try { toast('「' + pinName2 + '」已出场，指定自动取消', null, 3000); } catch (e) {}
                }
            }
        } catch (e) { console.warn('[命运织机] 自动取消指定失败', e); }

        const pos = s.directorPos === "before" ? 2 : (s.directorPos === "in_prompt" ? 0 : 1);
        const depth = Math.max(0, Number(s.directorDepth) || 4);

        // 一档：模型在检测时顺带给的判断（同一次请求，不额外花钱）
        const sg = state.dirSuggestion;
        const fresh = sg && sg.name && (Date.now() - (sg.at || 0) < 15 * 60 * 1000);
        // 玩家指定时不能走这条捷径：否则模型随口给的建议会把「指定」顶掉
        if (fresh && !playerPicked) {
            const c = ((state.dirCache && state.dirCache.chars) || []).find(function (x) { return x.name === sg.name; });
            sg.trig = triggerOf(sg.name);
            const text2 = [
                "[出场提示] " + sg.name + "（这一场适合出现）" + (sg.trig && sg.trig !== sg.name ? "　关键词：" + sg.trig : ""),
                sg.why ? ("理由：" + sg.why) : "",
                (c && (c.scenes || []).length) ? ("她通常在：" + c.scenes.slice(0, 4).join("、")) : "",
                "这一轮请让她出现在这一段里。怎么出场、做什么、说什么，按她的人设和你这一段的行文自然写。",
                "除非和正在发生的事直接矛盾，否则不要跳过。",
            ].filter(Boolean).join(String.fromCharCode(10));
            ctx.setExtensionPrompt(DIR_KEY, text2, pos, depth, true, 0);
            try { state.dirInject.unshift({ at: Date.now(), name: (sg && sg.name) || '', len: String(text2 || '').length, forced: false }); state.dirInject = state.dirInject.slice(0, 8); } catch (e) {}
            try { const nmI = (state.dirInject || [])[0] && state.dirInject[0].name; if (nmI) { const lg = dirLog(); lg[nmI] = Math.max(0, msgTexts().length - 1); persist(); } } catch (e) {}
            state.dirLast = { at: Date.now(), name: sg.name, text: text2, gap: 0, by: "llm" };
    try { renderDirStatus(); } catch (e) {}
            state.dirSuggestion = null;
            console.log("[命运织机] 导演（模型判断）：" + sg.name);
            toastDirector('llm', sg.name, 0);
            return;
        }

        // 二档 / 三档：本地计算
        const res = directorPick();
        if (!res) { clearDirector(); return; }

        if (res.skip || !res.pick) { clearDirector(); return; }

        // 正常出场：场景词命中
        res.pick.trig = triggerOf(res.pick.name);
        const text = directorText(res);
        if (!text) { clearDirector(); return; }
        // 指定的人贴得更近：depth 0 = 紧贴在这一段之后，模型很难忽略
        const useDepth = (res.pick && res.pick.forced) ? 0 : depth;
        ctx.setExtensionPrompt(DIR_KEY, text, pos, useDepth, true, 0);
            try { state.dirInject.unshift({ at: Date.now(), name: res.pick.name, len: String(text || '').length, forced: !!res.pick.forced }); state.dirInject = state.dirInject.slice(0, 8); } catch (e) {}
            try { const nmI = (state.dirInject || [])[0] && state.dirInject[0].name; if (nmI) { const lg = dirLog(); lg[nmI] = Math.max(0, msgTexts().length - 1); persist(); } } catch (e) {}
        state.dirLast = { at: Date.now(), name: res.pick.name, text: text, gap: res.pick.gap, by: "script" };
        // 指定是持续生效的：只要没点「取消」，每一轮都强制她出场
    try { renderDirStatus(); } catch (e) {}
        console.log("[命运织机] 导演：推荐 " + res.pick.name + "（" + res.pick.gap + " 楼未出场，场景词命中）");
        toastDirector('script', res.pick.name, res.pick.gap);
    } catch (err) {
        console.warn("[命运织机] 出场导演失败", err);
    }
}

function clearDirector() {
    try {
        if (ctx.setExtensionPrompt) ctx.setExtensionPrompt(DIR_KEY, '', 1, 4, false, 0);
    } catch (e) { /* ignore */ }
}

// ── 出场导演页 ────────────────────────────────────
function viewDirector() {
    const s = settings();
    const cache = state.dirCache;
    const rows = (cache && cache.chars) || [];
    const allChars = (cache && cache.chars) || [];
    const activeCount = allChars.filter(function (c) { return c.enabled !== false; }).length;
    const last = state.dirLast;

    let h = '<h2>出场导演</h2>';
    h += '<div class="ac-card"><div class="h">说明</div>' +
        '<div class="hint" style="line-height:1.9">开启后，每次生成前会算出「这一轮该让谁出场」，只往提示词里插一小段（约 100 字）。<br>' +
        '这一小段是<b>参与世界书扫描</b>的（scan=true）。里面带着她的名字，' +
        '所以会顺手把她那几条绿灯条目一起点着 —— 人设由世界书自己带进来，导演不重复写。<br>' +
        '你不需要记关键词，也不用手动触发。</div></div>';

    h += '<div class="ac-card"><div class="h">开关</div>' +
        '<div class="ac-f"><div class="ac-seg" id="ac-dir-on" style="width:260px">' +
        '<div data-v="1" class="' + (s.director ? 'on' : '') + '">开启</div>' +
        '<div data-v="0" class="' + (!s.director ? 'on' : '') + '">关闭</div>' +
        '</div></div></div>';

    h += '<div class="ac-card"><div class="h">参数</div>';
    h += '<div class="ac-grid2">';
    h += '<div class="ac-f"><label>出场频率</label>' +
        '<select id="ac-dir-every">' +
        [[1,'每轮都安排'],[2,'每 2 楼一次'],[3,'每 3 楼一次'],[5,'每 5 楼一次'],[8,'每 8 楼一次'],[15,'每 15 楼一次']].map(function (o) {
            return '<option value="' + o[0] + '"' + (Number(s.directorEvery || 3) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') +
        '</select>' +
        '<div class="hint">不管轮到谁，两次安排之间至少隔这么多楼。' +
        '觉得人来得太勤就调大这个，和下面「同一个人间隔」是两回事。</div></div>';
    h += '<div class="ac-f"><label>同一个人间隔（楼）</label><input type="number" id="ac-dir-gap" value="' + (s.directorGap || 8) + '" min="1" max="200" />' +
        '<div class="hint">一个人至少这么多楼没出现，才会被推荐。</div></div>';
    h += '<div class="ac-f"><label>允许随机偶遇</label>' +
        '<label class="ac-sw"><input type="checkbox" id="ac-dir-rand"' + (s.directorAllowRandom ? ' checked' : '') + ' /><span></span></label>' +
        '<div class="hint"><b>默认关。</b>关着时只在场景词命中时才推荐，绝不会有「隔很多楼突然出现」。</div></div>';
    h += '<div class="ac-f"' + (s.directorAllowRandom ? '' : ' style="opacity:.45;pointer-events:none"') + '><label>随机概率（%）</label>' +
        '<input type="number" id="ac-dir-chance" value="' + (s.directorChance || 0) + '" min="1" max="100" />' +
        '<div class="hint">开了随机偶遇后，这个百分比的场景不匹配时也会硬插一个最久没出场的人。会显得突兀。</div></div>';
    h += '<div class="ac-f"><label>深度</label><input type="number" id="ac-dir-depth" value="' + (s.directorDepth || 4) + '" min="0" max="50" />' +
        '<div class="hint">只在「对话里」时生效。数字越小越靠后。</div></div>';
    h += '<div class="ac-f"><label>注入位置</label><select id="ac-dir-pos">' +
        '<option value="in_chat"' + (s.directorPos === 'in_chat' ? ' selected' : '') + '>对话里（按深度插入）</option>' +
        '<option value="in_prompt"' + (s.directorPos === 'in_prompt' ? ' selected' : '') + '>提示词开头</option>' +
        '<option value="before"' + (s.directorPos === 'before' ? ' selected' : '') + '>主提示词之前</option>' +
        '</select></div>';
    h += '</div>';
    h += '<div class="ac-f"><label>出场策略</label>' +
        '<select id="ac-dir-mode" style="margin-bottom:8px">' +
        '<option value="rotate"' + (s.directorMode !== 'pin' ? ' selected' : '') + '>轮流出场 —— 谁最久没出现就推谁（有线索的先上）</option>' +
        '<option value="pin"' + (s.directorMode === 'pin' ? ' selected' : '') + '>指定角色 —— 我选的人优先出场</option>' +
        '</select>' +
        '<div class="hint">轮流出场：有场景线索的人优先，没有线索就推最久没出现的那个（前几名随机）。' +
        '指定角色：你选的人只要够久没出场、场景又不激烈，就推她。' +
        '策略只影响「该不该推」，她怎么出场仍然交给模型写。</div></div>';
    if (s.directorMode === 'pin') {
        const allC = ((cache && cache.chars) || []).filter(function (c) { return c.enabled !== false; });
        h += '<div class="ac-f"><label>指定谁优先出场</label><select id="ac-dir-pin">' +
            '<option value="">（没选）</option>' +
            allC.map(function (c) { return '<option value="' + esc(c.name) + '"' + (s.directorPin === c.name ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') +
            '</select><div class="hint">只要她够久没出场、当前又不在激烈冲突里，就会推她。</div></div>';
    }
    h += '<div class="ac-f" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;max-width:660px">' +
        '<label style="margin:0">正戏和打斗时不插人</label>' +
        '<label class="ac-sw"><input type="checkbox" id="ac-dir-idle"' + (s.directorIdleOnly ? ' checked' : '') + ' /><span></span></label>' +
        '</div>';
    h += '<div class="ac-f" style="max-width:660px"><label>激烈场景保护</label><select id="ac-dir-busy">' +
        '<option value="strong"' + ((s.busyGuard || 'strong') === 'strong' ? ' selected' : '') + '>只拦强信号（推荐）—— 明确的性行为/裸露才跳过</option>' +
        '<option value="strict"' + (s.busyGuard === 'strict' ? ' selected' : '') + '>强+弱都拦 —— 更保守，但日常描写也可能误判</option>' +
        '<option value="off"' + (s.busyGuard === 'off' ? ' selected' : '') + '>不拦 —— 始终让导演/模型自己判断</option>' +
        '</select><div class="hint">以前是「关键词出现两个就跳过」，像「湿润、轻颤」这种日常描写会被误判成亲密戏。' +
        '现在默认只拦明确的强信号，弱信号只做提示、不拦。</div></div>';
    h += '<div class="ac-f" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;max-width:660px;margin-top:8px">' +
        '<label style="margin:0">动手时弹提示</label>' +
        '<label class="ac-sw"><input type="checkbox" id="ac-dir-notify"' + (s.directorNotify ? ' checked' : '') + ' /><span></span></label>' +
        '</div>';
    h += '<div class="hint" style="margin-top:4px">右上角会弹一条「导演 · 出场 / 轻提」，告诉你这一轮它做了什么。</div>';
    h += '</div>';
    h += '<div class="ac-card"><div class="h">素材 <span class="i">' + rows.length + ' 个角色</span></div>' +
        '<div class="ac-f"><label>从哪本书读' + (s.followCharBook !== false ? '（跟随角色卡）' : '（手动指定）') + '</label><select id="ac-dir-book">' +
        (function () { const cur = effectiveBook(); if (cur && state.books.indexOf(cur) < 0) state.books.unshift(cur); return ''; })() +
        state.books.map(function (b) { return '<option value="' + esc(b) + '"' + (b === s.targetBook ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('') +
        '</select><div class="hint">会从这里解析「行动路线」的角色和场景词。</div></div>' +
        (function () {
            const c = state.dirCache;
            if (!c || !c.dbCast) return '';
            const names = Object.keys(c.dbCast);
            if (!names.length) return '<div class="hint" style="margin-top:10px">这本书里没有数据库表格（不影响使用，只是少了「在场状态」判断）。</div>';
            const present = names.filter(function (n) { return c.dbCast[n].present; });
            return '<div class="hint" style="margin-top:10px;line-height:1.8">' +
                '<b>数据库表格</b>　当前地点：' + esc(c.dbPlace || '未记录') + '<br>' +
                '在角色表里 ' + names.length + ' 人，其中在场 ' + present.length + ' 人' +
                (present.length ? '（' + esc(present.join('、')) + '）' : '') + '<br>' +
                '在场的人不会被推荐出场，在别处的人会降低优先级。</div>';
        })() +
        '<div class="ac-card" style="margin-top:14px;background:#1b2224">' +
        '<div class="h" style="font-size:14px">角色清单 <span style="margin-left:auto;font-weight:400;color:#6f8080;font-size:12px">' +
            activeCount + ' / ' + allChars.length + ' 个启用</span></div>' +
        '<div class="hint">勾掉不想让导演推荐的人。默认只勾主要角色（关系速览 / 角色卡 / LLM 认得出来的），' +
        '只有数据库表里出现过的人默认不勾。</div>' +
        '<div style="display:flex;gap:6px;margin:10px 0">' +
        '<button class="ac-btn" id="ac-pick-all">全选主要</button>' +
        '<button class="ac-btn" id="ac-pick-none">全不选</button>' +
        '</div>' +
        '<div style="display:flex;gap:6px;margin:10px 0 4px">' +
        '<input type="text" id="ac-pick-add" placeholder="手动加一个名字（例如 角色丑）" style="flex:1 1 auto" />' +
        '<button class="ac-btn" id="ac-pick-addbtn">添加</button>' +
        '</div>' +
        ((settings().directorCharsExtra || []).length ? '<div class="hint" style="margin-bottom:8px">已手动添加：' + (settings().directorCharsExtra || []).map(function (x) { return esc(x) + ' <a href="#" data-delname="' + esc(x) + '" style="color:#e08">×</a>'; }).join('、') + '</div>' : '') +
        (cache && cache.noScenes ? '<div class="hint" style="color:#ffd479;margin-bottom:8px">有 ' + cache.noScenes + ' 个角色没有场景词（手写条目常见），' +            '导演只能用她条目的关键词来判断该不该出场。想更准可以给她们补一段「介入机会」。' +            '<a href="#" id="ac-fix-jump" style="color:#8fd9b6">去一键修复</a></div>' : '') +        '<div class="hint" id="ac-pick-msg" style="margin-bottom:8px">自动认不出来的人，在这里手填。' +
        '填完会按名字去世界书里找她的条目（包含匹配，所以填「角色丑」能找到「角色丑性格补充」）。</div>' +
        '<div style="max-height:300px;overflow:auto">' +
        allChars.map(function (c) {
            const on = c.enabled !== false;
            const src = c.npc ? '数据库' : (c.source || '未知');
            return '<label class="ac-chk" style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid #232a2c;cursor:pointer">' +
                '<input type="checkbox" data-pick="' + esc(c.name) + '"' + (on ? ' checked' : '') + ' />' +
                '<span style="flex:1 1 auto">' + esc(c.name) + (c.npc ? ' <span style="color:#6f8080;font-size:12px">（次要）</span>' : '') + '</span>' +
                '<span style="font-size:11px;color:#6f8080">' + esc(src) + '</span>' +
                '</label>';
        }).join('') +
        '</div></div>' +        (function () {
            const sc0 = (s.dirScan || {})[s.targetBook];
            if (!sc0) return '<div class="hint" style="margin-top:8px">还没用 LLM 扫过。扫描会把条目名和关键词发给模型（约 1 次请求），' +
                '让它判断哪些条目属于同一个人物 —— 命名再乱也能认出来。<b>世界书内容变了需要重扫。</b></div>';
            return '<div class="hint" style="margin-top:8px">LLM 上次扫描：' + esc(new Date(sc0.at).toLocaleString()) +
                '　认出 ' + (sc0.chars || []).length + ' 个角色</div>';
        })() +
        ((cache && cache.rosterFound === false)
            ? '<div class="hint" style="margin-top:8px;color:#ffd479">这本书里没找到「人物关系速览」之类的总表。' +
              '自动识别会退到「角色卡 / 条目名 / 行动路线」这些线索上，可能认不全 —— <b>建议点上面的「LLM 扫描角色」</b>，' +
              '它会读条目内容判断谁属于谁，命名再乱也能认。</div>'
            : '') +
        (rows.length ? '<div style="margin-top:12px;font-size:13px;color:#9fb0b0">' +
            rows.slice(0, 20).map(function (c) {
                return '<div>' + esc(c.name) + '　<span style="color:#6f8080">' + (c.scenes || []).slice(0, 6).join('、') + '</span></div>';
            }).join('') + '</div>' : '') +
        '</div>';


    // 导演注入的原文（用来核对到底给模型发了什么）
    h += '<div class="ac-card"><div class="h">导演注入的提示词</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:8px">' +
        '<button class="ac-btn" id="ac-dir-preview">预测这一轮</button>' +
        '<button class="ac-btn" id="ac-dir-copy">复制上次注入</button>' +
        '</div>' +
        '<div class="ac-msg" id="ac-dir-msg"></div>' +
        (last ? '<div class="hint" style="margin-top:10px">来源：' + (last.by === 'llm' ? '<b style="color:#8fd9b6">模型判断</b>' : (last.by === 'mild' ? '轻提' : '脚本')) +
            (last.gap ? '　她当时 ' + last.gap + ' 楼没出场' : '') +
            (last.at ? '　' + new Date(last.at).toLocaleTimeString() : '') + '</div>' +
            '<div class="ac-view" style="margin-top:8px;max-height:260px">' + esc(last.text) + '</div>' :
            '<div class="hint" style="margin-top:10px">还没注入过。点「预测这一轮」看看现在会安排谁。</div>') +
        '</div>';

    h += '<div class="ac-card" style="background:#1b2224"><div class="h">一键修复世界书</div>' +
        '<div class="hint">有些角色认不出来，是因为她的条目名不统一，或者名字没写进关键词。' +
        '这里可以批量修好 —— 改的是你自己的世界书，改之前会列出具体改什么。</div>' +
        '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">' +
        '<select id="ac-fix-style" style="width:auto;flex:0 0 auto;padding:6px 8px">' +
        '<option value="marker">改成：名字（人设核心）</option>' +
        '<option value="std">改成：角色卡 名字</option>' +
        '</select>' +
        '<button class="ac-btn" id="ac-fix-scan">分析一下</button>' +
        '<button class="ac-btn pri" id="ac-fix-apply">执行修复</button>' +
        '<button class="ac-btn" id="ac-fix-undo">撤销上次修复</button>' +
        '</div>' +
        '<div id="ac-fix-out" style="margin-top:10px"></div></div>';

    return h;
}

function wireDirector() {
    document.querySelectorAll('#ac-dir-on > div').forEach(function (d) {
        d.addEventListener('click', function () {
            settings().director = d.dataset.v === '1';
            persist();
            if (!settings().director) clearDirector();
            render();
        });
    });
    const bind = function (id, key, num) {
        const el = $(id);
        if (!el) return;
        el.addEventListener('change', function () {
            settings()[key] = num ? Number(el.value) : el.value;
            persist();
        });
    };
    const bk = $('ac-dir-book');
    if (bk) bk.addEventListener('change', function () {
        setTargetBook(bk.value);
        state.dirCache = null;
        persist();
        refreshDirCache().then(function () { render(); }).catch(function () {});
    });
    bind('ac-dir-every', 'directorEvery', true);
    bind('ac-dir-gap', 'directorGap', true);
    const rnd = $('ac-dir-rand');
    if (rnd) rnd.addEventListener('change', function () { settings().directorAllowRandom = rnd.checked; persist(); render(); });
    bind('ac-dir-chance', 'directorChance', true);
    bind('ac-dir-depth', 'directorDepth', true);
    bind('ac-dir-pos', 'directorPos', false);
    bind('ac-dir-busy', 'busyGuard', false);
    const ntf = $('ac-dir-notify');
    if (ntf) ntf.addEventListener('change', function () { settings().directorNotify = ntf.checked; persist(); });
    // 导演注入的提示词：预测 + 复制
    $('ac-dir-preview')?.addEventListener('click', function () {
        const box = $('ac-dir-msg');
        const r = previewDirector();
        if (!box) return;
        if (r.name) {
            box.innerHTML = '<div class="hint">现在会安排：<b style="color:#ffd479">' + esc(r.name) + '</b>' +
                (r.never ? '（还从没出场过）' : ('（已经 ' + r.gap + ' 楼没出场）')) + '</div>' +
                '<div class="ac-view" style="margin-top:6px">' + esc(directorText({ pick: r })) + '</div>';
            box.className = 'ac-msg';
        } else {
            box.innerHTML = '<div class="hint">' + esc(r.why || '这一轮不安排出场') + '</div>';
        }
    });
    $('ac-dir-copy')?.addEventListener('click', function () {
        const txt = (state.dirLast && state.dirLast.text) || '';
        if (!txt) { toast('还没有注入过', null, 3000); return; }
        try { navigator.clipboard.writeText(txt); toast('已复制', null, 2500); }
        catch (e) { toast('复制失败', null, 3000); }
    });
    const idle = $('ac-dir-idle');
    if (idle) idle.addEventListener('change', function () { settings().directorIdleOnly = idle.checked; persist(); });

    // 手动添加名字
    const doAdd = async function () {
        const box = $('ac-pick-add');
        const msgEl = $('ac-pick-msg');
        const nm = String((box && box.value) || '').trim();
        if (!nm) return;
        const st = settings();
        st.directorCharsExtra = st.directorCharsExtra || [];
        if (st.directorCharsExtra.indexOf(nm) < 0) st.directorCharsExtra.push(nm);
        persist();
        const cache = await refreshDirCache();
        const hit = ((cache && cache.chars) || []).find(function (c) { return c.name === nm; });
        if (msgEl) msgEl.innerHTML = hit
            ? ('已加入「' + esc(nm) + '」，匹配到 ' + (hit.keys || []).length + ' 个关键词。')
            : ('已加入「' + esc(nm) + '」，但世界书里没找到她的条目 —— 导演提到她也不会点亮任何设定。');
        render();
        renderMini(false);
    };
    $('ac-pick-addbtn')?.addEventListener('click', doAdd);
    $('ac-pick-add')?.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doAdd(); } });
    document.querySelectorAll('[data-delname]').forEach(function (a) {
        a.addEventListener('click', async function (e) {
            e.preventDefault();
            const nm = a.dataset.delname;
            const st = settings();
            st.directorCharsExtra = (st.directorCharsExtra || []).filter(function (x) { return x !== nm; });
            if (st.directorPick) delete st.directorPick[nm];
            persist();
            await refreshDirCache();
            render();
            renderMini(false);
        });
    });

    // 角色清单：逐个勾选
    document.querySelectorAll('[data-pick]').forEach(function (box) {
        box.addEventListener('change', async function () {
            const nm = box.dataset.pick;
            const st = settings();
            st.directorPick = st.directorPick || {};
            st.directorPick[nm] = !!box.checked;
            persist();
            await refreshDirCache();
            render();
        });
    });
    $('ac-pick-all')?.addEventListener('click', async function () {
        const st = settings();
        st.directorPick = {};
        for (const c of ((state.dirCache && state.dirCache.chars) || [])) st.directorPick[c.name] = !c.npc;
        persist();
        await refreshDirCache();
        render();
    });
    $('ac-pick-none')?.addEventListener('click', async function () {
        const st = settings();
        st.directorPick = {};
        for (const c of ((state.dirCache && state.dirCache.chars) || [])) st.directorPick[c.name] = false;
        persist();
        await refreshDirCache();
        render();
    });

    const btnScan = $('ac-dir-scan');
    if (btnScan) btnScan.addEventListener('click', async function () {
        btnScan.disabled = true;
        const prog = toastProgress('正在让模型扫世界书…可能要十几秒');
        try {
            const r = await llmScanCharacters(true);
            prog.acDone('扫描完成：认出 ' + r.chars.length + ' 个角色');
            await refreshDirCache();
        } catch (e) {
            prog.acDone('扫描失败：' + errBrief(e), 8000);
        }
        btnScan.disabled = false;
        render();
    });

    const rf = $('ac-dir-refresh');
    if (rf) rf.addEventListener('click', async function () {
        rf.disabled = true;
        const prog = toastProgress('正在读取世界书…');
        try {
            await refreshDirCache();
            prog.acDone('读取完成：' + ((state.dirCache && state.dirCache.chars.length) || 0) + ' 个角色');
        } catch (e) { prog.acDone('读取失败：' + errBrief(e), 8000); }
        rf.disabled = false;
        render();
    });

}
// ── 备份 / 操作记录 ──────────────────────────────
function viewBackups() {
    const s = settings();
    const rows = [];
    const books = Object.keys(s.oplog || {});
    for (const book of books) {
        (s.oplog[book] || []).forEach(function (log, i) {
            const d = new Date(log.t).toLocaleString();
            const bits = [];
            if ((log.added || []).length) bits.push('新增 ' + log.added.length);
            if ((log.updated || []).length) bits.push('更新 ' + log.updated.length);
            if (log.dispatch) bits.push('调度表');
            rows.push('<div class="ac-bk">' +
                '<span class="t"><b>' + esc(log.name || '(未命名)') + '</b>　' + esc(d) +
                '<span style="color:#6f8080">　' + esc(book) + '　' + (bits.join(' · ') || '无改动') + '</span></span>' +
                '<button class="ac-btn ac-undo" data-book="' + esc(book) + '" data-i="' + i + '">撤销</button></div>');
        });
    }
    const legacy = Object.keys(s.backups || {}).reduce(function (a, k) { return a + (s.backups[k] || []).length; }, 0);

    return '<h2>备份</h2>' +
        '<div class="ac-card"><div class="h">操作记录 <span class="i">每本保留 12 条</span></div>' +
        '<div class="hint" style="margin-bottom:10px">每次写入都会记下改了哪几条。点「撤销」会把这次新增的删掉、改过的还原。</div>' +
        (rows.join('') || '<div class="ac-empty">还没有操作记录</div>') +
        (function () {
            const sid = state.sessionId;
            let cnt = 0;
            if (sid) for (const bk of books) (s.oplog[bk] || []).forEach(function (lg) { if (lg && lg.sid === sid) cnt++; });
            return cnt ? '<div style="margin-top:10px"><button class="ac-btn" id="ac-undo-session">撤销本会话全部操作（' + cnt + ' 条）</button></div>' : '';
        })() +
        '</div>' +
        (legacy ? '<div class="ac-card"><div class="h">旧版整本快照</div>' +
            '<div class="hint">有 ' + legacy + ' 份旧格式快照（占 settings.json 空间）。清掉不影响使用。</div>' +
            '<button class="ac-btn" id="ac-clearsnap">清空旧快照</button></div>' : '');
}

function wireBackups() {
    document.querySelectorAll('.ac-undo').forEach(function (btn) {
        btn.addEventListener('click', async function () {
            const book = btn.dataset.book;
            const i = Number(btn.dataset.i);
            const prog = toastProgress('正在撤销…');
            btn.disabled = true;
            try {
                const r = await rollbackOp(book, i);
                prog.acDone('已撤销：删掉 ' + r.removed + ' 条，还原 ' + r.restored + ' 条');
                render();
            } catch (e) {
                prog.acDone('撤销失败：' + errBrief(e), 8000);
                btn.disabled = false;
            }
        });
    });
    const us = $('ac-undo-session');
    if (us) us.addEventListener('click', async function () {
        const sid = state.sessionId;
        if (!sid) return;
        const prog = toastProgress('正在批量撤销…');
        us.disabled = true;
        let done = 0;
        try {
            const s2 = settings();
            for (const bk of Object.keys(s2.oplog || {})) {
                let guard = 0;
                while (guard++ < 30) {
                    const list = (settings().oplog[bk] || []);
                    const idx = list.findIndex(function (lg) { return lg && lg.sid === sid; });
                    if (idx < 0) break;
                    await rollbackOp(bk, idx);
                    done++;
                }
            }
            prog.acDone('已撤销本会话 ' + done + ' 次操作');
            render();
        } catch (e) {
            prog.acDone('批量撤销失败：' + errBrief(e), 8000);
            us.disabled = false;
        }
    });
    const clr = $('ac-clearsnap');
    if (clr) clr.addEventListener('click', function () {
        settings().backups = {};
        persist();
        toast('旧快照已清空，settings.json 会瘦身（下次保存生效）');
        render();
    });
}
// ═══════════════════════════════════════════════════════════
// 一键修复世界书：让导演能认出这些人
// ═══════════════════════════════════════════════════════════
// 判断一个条目是不是属于某个角色
// 条目名里常带 emoji / 装饰符号（⚙️SFW插图列表、🙍‍♀️示例角色一-师伯、🥰示例书🥰）
// 不去掉的话，名字会只剩一个 emoji，甚至被当成两个人
const NAME_DECOR = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu;
const NAME_NOISE = /敏感度|敏感|等级|评级|程度|评分|概率|数值|属性|参数|外部导入|导入|导出|日志|记录|存档|备份|反应|回复|选项|开关|交易|房租|租金|契约|金额|价格|费用|房费|还款|债务|买卖|人设|人物|角色|NPC|管理员|主角|玩家|旁白|服装|服饰|外貌|长相|台词|语气|口癖|动作|行为|表达|方式|主线|支线|节点|剧情|故事|场景|地点|物品|道具|称呼|名字|能力|技能|习惯|态度|心理|秘密|身份|经历|过去|目标|目的|计划|约定|规则|关系|背景|设定|状态|数据|信息|提示|选项|表格|父亲|母亲|爸爸|妈妈|老爸|老妈|父母|叔叔|阿姨|舅舅|姑妈|哥哥|姐姐|弟弟|妹妹|儿子|女儿|老公|老婆|妻子|丈夫|推特|推文|微博|微信|论坛|网站|平台|洞天|福地|秘境|大陆|王国|帝国|门派|宗门|世家|家族|组织|公司|学校|医院|地图|境界|功法|法宝|世界观|背景|体态|体型|文风|判断|设定|规则|说明|系统|地图|地理|时间|关系|概要|简介|总结|提示|格式|顺序|插入|深度|概率|语料|其他|备注|序章|开场|结局|尺寸|参数|选项|状态栏|数值|衣着|穿着|样例|示例|模板|参考|插图|列表|额外|权限|正文|美化|纯文字|加强版|吐槽|速览|附录|玩法|机制|教程|帮助|BASE|SFW|NSFW/i;
const NAME_JUNK = /^(旧版写法\d*|新版写法\d*|默认美化|纯文字|加强版|可选|必开|必关|不插图则关|不插则关)$/;
function cleanPersonName(s) {
    let n = String(s == null ? '' : s).replace(NAME_DECOR, '').trim();
    n = n.replace(/^[\(\[（【]?(旧版写法|新版写法)[\d\s]*[\)\]）】]?\s*/i, '');
    n = n.replace(/^[\s\-_—·、,，:：]+|[\s\-_—·、,，:：]+$/g, '');
    return n.trim();
}
// 不是人名的：纯符号、太短、命中装饰词、NG 里的配置类
// 地名/境界尾巴：示例地点、天岚山、九幽城
const PLACE_TAIL = /[谷山城岛湖峰宫殿寺庙馆院街巷港州国界境池林原野海莊荘庄]{1}$/;
// 假人名类别：时间/频率、地点、事件动作、身体物品、剧情节点
const FAKE_TIME = /^(第一次|第二次|第三次|第[一二三四五六七八九十0-9]{1,2}(次|天|回|晚|周|月|年|册|章|节)|当天|第二天|次日|隔天|当晚|今夜|明早|昨晚|昨天|今天|明天|每周|每月|每天|每年|每次|日常|平时|周末|工作日|早上|上午|中午|下午|傍晚|晚上|深夜|凌晨|黄昏|半夜|片刻|稍后|之后|以前|从前|过去|未来|最近|目前|现在|当时|此时|那时)$/;
const FAKE_PLACE = /^(玄关|客厅|卧室|厨房|浴室|卫生间|洗手间|厕所|阳台|走廊|门口|门外|窗边|床上|沙发|楼梯|电梯|停车场|便利店|超市|公园|车站|学校|教室|办公室|医院|诊所|旅馆|酒店|餐厅|咖啡店|地下室|天台|后院|庭院|花园|海边|沙滩|森林|街道|马路|广场|大楼|公寓|房间|屋内|室内|室外|门口|床上)$/;
const FAKE_EVENT = /^(交涉|交易|约定|惩罚|奖励|命令|任务|计划|变化|开始|结束|事件|故事|回忆|梦境|坦白|告白|约会|接吻|亲吻|拥抱|做爱|性爱|口交|乳交|手交|足交|射精|中出|高潮|怀孕|洗澡|换衣|上班|下班|回家|出门|出发|到达|离开|见面|相遇|告别|电话|消息|来信|邀请|拒绝|答应|沉默|叹息|微笑|哭泣|生气|惊讶|害羞|犹豫|思考|决定|选择|关心|担心|安慰|道歉|感谢|拜托|请求|警告|威胁|嘲笑|讽刺|抵抗|诱惑|勾引|威胁)$/;
const FAKE_OBJECT = /^(眼镜|头发|长发|短发|胸口|胸部|腰|臀|腿|脚|手|眼睛|表情|声音|衣服|裙子|内衣|泳装|围裙|草帽|兔耳|纸巾|伴手礼|洗发露|房租|租金|金额|钱|手机|照片|文件|钥匙|杯子|水|茶|酒|烟|礼物|戒指|项链)$/;
const FAKE_META = /^(状态栏|世界观|主线|支线|节点|剧情|故事|进度|时间线|流程|阶段|人物关系|速览|纪要|索引|表格|数据|记录|规则|设定|背景|序章|开场|结局|附录|玩法|机制|教程|帮助|提示|格式|顺序|语料|备注|其他|列表|参数|选项|状态|数值|概率|尺寸|服装|服饰|外貌|长相|台词|语气|口癖|动作|行为|表达|方式|称呼|名字|能力|技能|习惯|态度|心理|秘密|身份|经历|目标|目的|计划|约定|关系|服装与外貌)$/;
function junkPersonName(s) {
    const n = cleanPersonName(s);
    if (!n) return true;
    if (NAME_JUNK.test(n)) return true;
    if (!/[\u4e00-\u9fa5A-Za-z]{2,}/.test(n)) return true;   // 没有任何两个连续中日韩/拉丁字 → 扔掉
    if (NAME_NOISE.test(n)) return true;                      // 插图列表 / 状态栏 / 规则 / 设定 这类配置条目
    if (n.length >= 3 && PLACE_TAIL.test(n)) return true;     // 三个字以上、以地名尾巴结尾的，基本是地点
    if (FAKE_TIME.test(n) || FAKE_PLACE.test(n) || FAKE_EVENT.test(n) || FAKE_OBJECT.test(n) || FAKE_META.test(n)) return true;
    if (/^节点[0-9一二三四五六七八九十]*$/.test(n)) return true;
    if (/^[0-9]+$/.test(n)) return true;
    if (/[与和的之及或在了吗呢吧啊是有不会要把被给对从到就都也很太更最]/.test(n)) return true; // 人名基本不含虚词/连词
    if (/^[\u4e00-\u9fa5]{5,}$/.test(n)) return true;        // 5 个以上纯汉字基本不是人名
    return false;
}
function entryBelongsTo(comment, name) {
    const c = String(comment || '');
    if (!c || !name) return false;
    if (/^(TavernDB|ACU-)/i.test(c)) return false;
    let s = c.replace(/^(?:角色卡|NSFW档案|身体与性癖|身体与性|身体配置|性癖档案)\s*/, '');
    s = s.replace(/_(?:行为落地指南|出场时机)$/, '').trim();
    if (s === name) return true;
    if (s.indexOf(name) >= 0 || name.indexOf(s) >= 0) return true;
    if (c.length > name.length && c.indexOf(name) === 0 && /^[\s_\-—（(【\[]/.test(c.slice(name.length))) return true;
    return false;
}

// ═══════════════════════════════════════════════════════════
// 换角色卡时同步切换世界书
// ═══════════════════════════════════════════════════════════
let lastCharKey = null;

function currentCharKey() {
    try {
        const _lc5 = live(); const id = _lc5.characterId == null ? "" : String(_lc5.characterId);
        const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
        return id + "|" + String((ch && ch.name) || "") + "|" + boundBook();
    } catch (e) { return ""; }
}

function setTargetBook(v) {
    try {
        const s = settings();
        s.targetBook = String(v || '');
        s.targetBookByChar = s.targetBookByChar || {};
        const k = currentCharKey();
        if (k) s.targetBookByChar[k] = s.targetBook;
        persist();
    } catch (e) { /* ignore */ }
}
function rememberTargetBook(key) {
    try {
        const s = settings();
        s.targetBookByChar = s.targetBookByChar || {};
        const k = key || currentCharKey();
        if (k) s.targetBookByChar[k] = String(s.targetBook || '');
    } catch (e) { /* ignore */ }
}

async function onCharacterSwitched() {
    const s = settings();
    const book = boundBook();
    const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
    const cname = (ch && ch.name) || "";

    // 恢复本卡自己的目标书：优先角色卡绑定的世界书，其次这张卡上次手动选的书
    try {
        s.targetBookByChar = s.targetBookByChar || {};
        const bk = currentCharKey();
        const saved = s.targetBookByChar[bk] || '';
        const next = book || saved || '';
        if (next !== s.targetBook) {
            s.targetBook = next;
            persist();
        }
    } catch (e) { /* ignore */ }
    // 换人了，导演的缓存必须作废，否则还在用上一个人的人设
    state.dirCache = null;
    state.dirLast = null;
    state.galNames = [];
    state.gal = null;
    _galSpriteCache = {};
    _stSpriteCache = {};
    try { renderDirStatus(); } catch (e) {}

    // 换卡后无论是否开启导演，都按新卡的书重新识别一次（避免面板/名字沿用旧书）
    try { await refreshDirCache(effectiveBook() || undefined); } catch (e) { console.warn("[命运织机] 切卡后读素材失败", e); }
    try { renderMini(false); } catch (e) {}
    try { if ($("ac-overlay") && $("ac-overlay").style.display !== "none") render(); } catch (e) {}

    if (s.directorNotify) {
        if (book) toast("已切到「" + book + "」" + (cname ? "（" + cname + "）" : ""), null, 4000);
        else toast("「" + (cname || "当前角色") + "」没有绑定世界书，仍用「" + (s.targetBook || "未选") + "」", null, 5000);
    }
}

function watchCharacter() {
    const tick = function () {
        const k = currentCharKey();
        if (k === lastCharKey) return;
        const first = (lastCharKey === null);
        const prevKey = lastCharKey;
        lastCharKey = k;
        if (first) {
            // 首次加载不算切换，但如果开着「跟随角色卡」，静默把目标书同步成角色卡绑定的书
            try {
                const s = settings();
                const book = boundBook();
                if (s.followCharBook !== false && book && s.targetBook !== book) {
                    s.targetBook = book;
                    persist();
                    console.log('[命运织机] 目标世界书已同步为角色卡绑定的：' + book);
                }
            } catch (e) { /* ignore */ }
            rememberTargetBook(k);
            return;
        }
        // 先把上一张卡的目标书存起来，切卡后 onCharacterSwitched 会恢复新卡自己的
        try { rememberTargetBook(prevKey); } catch (e) { /* ignore */ }
        onCharacterSwitched();
    };
    tick();
    setInterval(tick, 600);
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs && evt) {
            if (evt.CHAT_CHANGED) evs.on(evt.CHAT_CHANGED, function () { setTimeout(tick, 400); });
            if (evt.CHARACTER_PAGE_LOADED) evs.on(evt.CHARACTER_PAGE_LOADED, function () { setTimeout(tick, 400); });
            if (evt.CHARACTER_EDITED) evs.on(evt.CHARACTER_EDITED, function () { setTimeout(tick, 400); });
        }
    } catch (e) { console.warn("[命运织机] 切换监听挂载失败", e); }
    console.log("[命运织机] 已监听角色卡切换");
}
// ═══════════════════════════════════════════════════════════
// 主页面浮动小面板：不用每次去开魔杖菜单
// ═══════════════════════════════════════════════════════════
// 导演状态显示：这一轮安排了谁
function dirStatusCore() {
    const last = state.dirLast;
    const pinNow = (settings().directorMode === 'pin' && settings().directorPin) ? String(settings().directorPin) : '';
    if (pinNow) return '<div style="padding:10px 12px;line-height:1.7">' +
        '<div><b style="color:#ffd479">' + esc(pinNow) + '</b>' +
        '<span style="font-size:11px;color:#6f8080;margin-left:6px">出场一次后自动取消</span></div>' +
        '<div style="font-size:11px;color:#6f8080">无视场景和出场频率，强行安排她出场；看到她出现在回复里后自动取消。模型没写她就继续催。</div>' + '</div>';
    if (!last) {
        return '<div class="mini-e" style="padding:10px 12px">这一轮导演还没出手。<br>点「预测」看看它打算怎么安排。</div>';
    }
    if (last.name === null || last.name === '') {
        return '<div class="mini-e" style="padding:10px 12px;color:#8fa0a0">本轮不推荐任何人' +
            (last.why ? '（' + esc(last.why) + '）' : '') + '</div>';
    }
    const kind = last.by === 'mild' ? '轻提' : (last.by === 'llm' ? '出场（模型判断）' : '出场');
    const color = last.by === 'mild' ? '#8fd9b6' : '#ffd479';
    return '<div style="padding:10px 12px;line-height:1.7">' +
        '<div><b style="color:' + color + '">' + esc(last.name) + '</b>' +
        '<span style="font-size:11px;color:#6f8080;margin-left:6px">' + kind + '</span></div>' +
        (last.never ? '<div style="font-size:11px;color:#6f8080">还从没出场过</div>' : (last.gap ? '<div style="font-size:11px;color:#6f8080">已经 ' + last.gap + ' 楼没出场</div>' : '')) +
        '</div>';
}
function dirStatusHtml() {
    // 「上次注入」这一行所有分支都显示，用来判断导演到底有没有注入
    const inj = (state.dirInject || [])[0];
    const lastText = (state.dirLast && state.dirLast.text) ? String(state.dirLast.text) : '';
    const injLine = inj ? ('<div style="font-size:11px;color:#6f8080;margin-top:6px;padding:0 12px 10px;cursor:pointer" id="ac-mini-inj">' +
        '上次注入 ' + new Date(inj.at).toLocaleTimeString() + ' · ' + inj.len + ' 字' + (inj.forced ? ' · 强制' : '') +
        (lastText ? '　<span style="color:#8fd9b6">看原文</span>' : '') + '</div>' +
        (lastText ? '<div id="ac-mini-injtext" style="display:none;font-size:11px;color:#9fb0b0;padding:0 12px 10px;white-space:pre-wrap;line-height:1.6">' + esc(lastText) + '</div>' : '')) : '';
    const curEvery = Math.max(1, Number((settings().directorEvery) || 3));
    const freqRow = '<div style="display:flex;align-items:center;gap:4px;padding:0 12px 10px;flex-wrap:wrap">' +
        '<span style="font-size:11px;color:#6f8080;margin-right:2px">出场频率</span>' +
        [1, 2, 3, 5, 8, 15].map(function (v) {
            const on = (curEvery === v);
            return '<button class="mini-freq" data-every="' + v + '" style="padding:2px 7px;font-size:11px;border-radius:5px;border:0;cursor:pointer;' +
                (on ? 'background:#8fd9b6;color:#10201c;font-weight:600' : 'background:#2f3739;color:#9fb0b0') + '">' +
                (v === 1 ? '每轮' : (v + '楼')) + '</button>';
        }).join('') +
        '<span style="font-size:11px;color:#6f8080;margin-left:2px">安排一次</span></div>';
    return dirStatusCore() + injLine + freqRow;
}

// 只算不注入：预测这一轮会安排谁
function previewDirector() {
    try {
        const r = directorPick();
        if (!r) return { why: '素材还没读，先去导演页点「重新读取」' };
        if (r.skip) return { why: r.why || '当前不适合安排出场' };
        if (!r.pick) return { why: '这一轮没有合适的人' };
        return {
            name: r.pick.name,
            by: 'script',
            gap: r.pick.gap,
            never: !!r.pick.never,
            strength: r.pick.strength || 'strong',
            scenes: r.pick.scenes || [],
            hit: r.pick.hit || [],
            hint: r.pick.hint || '',
        };
    } catch (e) {
        return { why: '算不出来：' + (e.message || e) };
    }
}

function renderDirStatus() {
    const box = document.getElementById('ac-mini-dir');
    if (box) box.innerHTML = dirStatusHtml();
}
function ensureMini() {
    if (document.getElementById("ac-mini")) return;
    const d = document.createElement("div");
    d.id = "ac-mini";
    d.innerHTML = '<div id="ac-mini-body" style="display:none">' +
        '<div class="mini-h"><span>导演</span><b id="ac-mini-kind" style="color:#8fa0a0;font-weight:400;font-size:11px;margin-right:6px"></b></div>' +
        '<div id="ac-mini-dir"></div>' +
        '<div style="display:flex;gap:6px;padding:0 12px 10px">' +
        '<button class="ac-btn" id="ac-mini-predict" style="flex:1 1 auto;padding:5px 8px;font-size:12px">预测这一轮</button>' +
        '</div>' +
        '<div class="mini-h"><span>角色清单</span><b id="ac-mini-book" style="color:#8fa0a0;font-weight:400;font-size:11px;margin-right:6px"></b><b id="ac-mini-n">0/0</b>' +
        '<button id="ac-mini-x" title="收起">×</button></div>' +
        '<div class="mini-l" id="ac-mini-list"></div>' +
        '<div class="mini-f"><button class="ac-btn" id="ac-mini-fate">打开命运织机</button>' +
        '<button class="ac-btn" id="ac-mini-reload">重新读取</button></div></div>' +
        '<div id="ac-mini-btn" title="' + esc(TITLE) + '"><i class="fa-solid fa-user-pen"></i>' +
        '<span id="ac-mini-count">0</span></div>';
    document.body.appendChild(d);

    document.getElementById("ac-mini-btn").addEventListener("click", function () {
        const b = document.getElementById("ac-mini-body");
        const open = b.style.display === "none";
        // 用 flex 而不是 block：面板内部靠 flex 布局让角色清单自己滚动、底部按钮不被裁掉
        b.style.display = open ? "flex" : "none";
        if (open) { renderMini(true); renderDirStatus(); }
    });
    document.getElementById("ac-mini-x").addEventListener("click", function () {
        document.getElementById("ac-mini-body").style.display = "none";
    });
    document.getElementById("ac-mini-fate").addEventListener("click", function () {
        // 打开命运织机完整面板，并跳到「出场导演」页（原「打开完整面板」已合并到这里）
        document.getElementById("ac-mini-body").style.display = "none";
        openPanel();
        state.tab = 'director';
        render();
    });
    document.getElementById('ac-mini-body').addEventListener('click', function (e) {
        const btn = e.target.closest && e.target.closest('[data-every]');
        if (!btn) return;
        settings().directorEvery = Number(btn.dataset.every) || 3;
        persist();
        renderDirStatus();
        toast('出场频率：' + (Number(btn.dataset.every) === 1 ? '每轮都安排' : ('每 ' + btn.dataset.every + ' 楼安排一次')), null, 3000);
    });
    document.getElementById("ac-mini-predict").addEventListener("click", function () {
        const r = previewDirector();
        const box = document.getElementById("ac-mini-dir");
        if (box) box.innerHTML = r.name
            ? ('<div style="padding:10px 12px;line-height:1.7"><div><b style="color:#ffd479">' + esc(r.name) + '</b>' +
               '<span style="font-size:11px;color:#6f8080;margin-left:6px">会安排出场</span></div>' +
               (r.gap ? '<div style="font-size:11px;color:#6f8080">已经 ' + r.gap + ' 楼没出场</div>' : '') +
               
               (r.hint ? '<div style="font-size:11px;color:#6f8080;margin-top:4px">' + esc(r.hint) + '</div>' : '') + '</div>')
            : ('<div class="mini-e" style="padding:10px 12px">' + esc(r.why || '这一轮不安排出场') + '</div>');
    });
    document.getElementById("ac-mini-reload").addEventListener("click", async function () {
        const b = document.getElementById("ac-mini-list");
        if (b) b.innerHTML = '<div class="mini-e">读取中…</div>';
        try { await refreshDirCache(); } catch (e) { console.warn("[命运织机] 读取失败", e); }
        renderMini(true);
    });
    renderMini(false);
}

async function renderMini(needCache) {
    const list = document.getElementById("ac-mini-list");
    const cnt = document.getElementById("ac-mini-count");
    const num = document.getElementById("ac-mini-n");
    if (!list) return;
    if (needCache && !state.dirCache) {
        try { await refreshDirCache(); } catch (e) { /* 忽略 */ }
    }
    const all = (state.dirCache && state.dirCache.chars) || [];
    // 面板里只显示「已勾选 + 非玩家角色 + 非男性」：没勾的不显示，男性角色不显示
    const hideMale = !settings().allowMale;
    const chars = all.filter(function (c) {
        if (c.enabled === false) return false;
        if (c.isUser) return false;
        if (hideMale && c.gender === '男') return false;
        return true;
    });
    const on = chars.length;
    if (cnt) cnt.textContent = String(on);
    renderDirStatus();
    const bk = document.getElementById("ac-mini-book");
    if (bk) bk.textContent = effectiveBook() || '(未选书)';
    if (num) num.textContent = on + "/" + all.length;
    if (!all.length) {
        list.innerHTML = '<div class="mini-e">还没有素材。先选目标世界书，或点下面的「重新读取」。</div>';
        return;
    }
    if (!chars.length) {
        list.innerHTML = '<div class="mini-e">没有可显示的角色：没勾选的和男性角色已隐藏。<br>去「打开命运织机」→「出场导演」里勾选要出场的角色。</div>';
        return;
    }
    list.innerHTML = chars.map(function (c) {
        const chk = c.enabled !== false ? " checked" : "";
        const tag = c.npc ? "数据库" : (c.source || "");
        const pinned = (settings().directorPin === c.name && settings().directorMode === 'pin');
        return '<div class="mini-r">' +
            '<input type="checkbox" data-mpick="' + esc(c.name) + '"' + chk + ' />' +
            '<span class="mini-n" style="' + (pinned ? 'color:#ffd479' : '') + '">' + esc(c.name) + (pinned ? ' ★' : '') + '</span>' +
            '<button class="mini-pin" data-pin="' + esc(c.name) + '" title="' + (pinned ? '取消指定' : '指定她优先出场') + '">' + (pinned ? '取消' : '指定') + '</button>' +
            '<span class="mini-t">' + esc(tag) + '</span></div>';
    }).join("");
    list.querySelectorAll('[data-pin]').forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();
            const st = settings();
            const nm = btn.dataset.pin;
            if (st.directorPin === nm && st.directorMode === 'pin') {
                st.directorPin = '';
                st.directorMode = 'rotate';
                st.directorPinAt = 0;
                toast('取消指定', null, 2500);
            } else {
                st.directorPin = nm;
                st.directorMode = 'pin';
                // 记下指定生效时的楼层数：只有「指定之后新来的回复」里出现她，才算真的出场
                try { st.directorPinAt = (live().chat || []).length; } catch (e) { st.directorPinAt = 0; }
                toast('已指定「' + nm + '」：无视场景和频率强行出场，出场后自动取消', null, 5000);
            }
            persist();
            renderMini(false);
            if (state.tab === 'director') render();
        });
    });
    list.querySelectorAll("[data-mpick]").forEach(function (box) {
        box.addEventListener("change", async function () {
            const st = settings();
            st.directorPick = st.directorPick || {};
            st.directorPick[box.dataset.mpick] = !!box.checked;
            persist();
            await refreshDirCache();
            renderMini(false);
            if (state.tab === "director") render();
        });
    });
}
// ═══════════════════════════════════════════════════
// 人物变化：长期状态记录（写进世界书常驻条目，AI 每轮可见）
// 不依赖数据库自动更新，也不会被数据库本体覆盖
// ═══════════════════════════════════════════════════
// 人物变化的作用域：
// 1) 角色卡绑定了世界书 → 按书（同一本书的多个聊天共享）
// 2) 没绑定书但手动选了目标书 → 按书
// 3) 都没有 → 按角色卡隔离（避免用上一个角色卡的旧 targetBook 串台）
function charStateKey() {
    try {
        const b = boundBook();
        if (b) return 'book:' + b;
    } catch (e) { /* ignore */ }
    try {
        const s = settings();
        if (s.followCharBook === false && s.targetBook) return 'book:' + s.targetBook;
    } catch (e) { /* ignore */ }
    try {
        const _lc = live();
        const ch = _lc.characters && _lc.characters[_lc.characterId];
        if (ch) return 'char:' + String(ch.avatar || ch.name || 'unknown');
    } catch (e) { /* ignore */ }
    try { return 'chat:' + chatKey(); } catch (e) { return 'chat:default'; }
}
// 素材作用域：优先跟「实际使用的世界书」（effectiveBook：跟随角色卡或手动目标书），没有书再按角色卡/聊天
function assetScopeKey() {
    try {
        const b = effectiveBook();
        if (b) return 'book:' + b;
    } catch (e) { /* ignore */ }
    return charStateKey();
}
function assetScopeLabel() {
    const k = String(assetScopeKey() || '');
    if (k.indexOf('book:') === 0) return '世界书《' + k.slice(5) + '》';
    if (k.indexOf('char:') === 0) return '角色卡「' + k.slice(5) + '」';
    return '当前聊天';
}
function assetScope() {
    const s = settings();
    s.assetsByScope = s.assetsByScope || {};
    const key = assetScopeKey();
    let sc = s.assetsByScope[key];
    if (!sc) {
        sc = { spriteMap: {}, spriteExpr: {}, envActive: '' };
        // 旧版全局立绘素材迁移一次（环境池单独做全局合并）
        if (!s._assetsMigrated) {
            try {
                if (s.spriteMap && Object.keys(s.spriteMap).length) sc.spriteMap = s.spriteMap;
                if (s.spriteExpr && Object.keys(s.spriteExpr).length) sc.spriteExpr = s.spriteExpr;
                if (s.envActive) sc.envActive = s.envActive;
                s.spriteMap = {};
                s.spriteExpr = {};
                s.envActive = '';
                s._assetsMigrated = true;
                try { persist(); } catch (e) { /* ignore */ }
            } catch (e) { /* ignore */ }
        }
        s.assetsByScope[key] = sc;
    }
    sc.spriteMap = sc.spriteMap || {};
    sc.spriteExpr = sc.spriteExpr || {};
    sc.envActive = sc.envActive || '';
    // 环境池统一合并到全局（0.6.85 起背景素材全局共享）
    try {
        const s2 = settings();
        if (!s2._envGlobalMigrated) {
            s2.envPool = Array.isArray(s2.envPool) ? s2.envPool : [];
            const seen = {};
            s2.envPool.forEach(function (e) { if (e && e.url) seen[e.url] = true; });
            Object.keys(s2.assetsByScope || {}).forEach(function (k) {
                const one = s2.assetsByScope[k];
                if (!one || !Array.isArray(one.envPool)) return;
                one.envPool.forEach(function (e) {
                    if (e && e.url && !seen[e.url]) { seen[e.url] = true; s2.envPool.push(e); }
                });
                delete one.envPool;
            });
            s2._envGlobalMigrated = true;
            try { persist(); } catch (e) { /* ignore */ }
        }
    } catch (e) { /* ignore */ }
    return sc;
}

function charStateSet(map) {
    const s = settings();
    s.charStateByChat = s.charStateByChat || {};
    s.charStateByChat[charStateKey()] = map || {};
}
// 当前世界书的人物变化表（旧版全局数据首次会按书/聊天过滤迁移）
function charStateCur() {
    const s = settings();
    s.charStateByChat = s.charStateByChat || {};
    const key = charStateKey();
    let map = s.charStateByChat[key];
    if (!map || typeof map !== 'object') {
        map = {};
        // 迁移旧版全局数据：只迁移「当前聊天里出现过」或「当前世界书角色」的名字
        const legacy = s.charState || {};
        const legacyKeys = Object.keys(legacy).filter(function (n) { return String(legacy[n] || '').trim(); });
        let chatText = '';
        try {
            chatText = (ctx.chat || []).slice(-400).map(function (m) { return String(m.mes || ''); }).join('\n');
        } catch (e) { /* ignore */ }
        if (!chatText) {
            try { chatText = (live().chat || []).slice(-400).map(function (m) { return String(m.mes || ''); }).join('\n'); } catch (e) { /* ignore */ }
        }
        const bookNames = [];
        try {
            const _bound = boundBook();
            if (key.indexOf('book:') === 0 && _bound && state.dirCache && state.dirCache.book === _bound) {
                (state.dirCache.chars || []).forEach(function (c) { if (c && c.name) bookNames.push(c.name); });
            }
        } catch (e) { /* ignore */ }
        if (legacyKeys.length && (chatText || bookNames.length)) {
            legacyKeys.forEach(function (n) {
                // 有当前世界书角色清单时以书为准（最严格，避免串书）；否则退回聊天文本匹配
                if (bookNames.length) { if (bookNames.indexOf(n) >= 0) map[n] = legacy[n]; return; }
                if (chatText.indexOf(n) >= 0) map[n] = legacy[n];
            });
        } else if (legacyKeys.length) {
            // 聊天/角色清单还没加载好：先不迁移，等下次（避免把别的书的角色迁进来）
            return {};
        }
        s.charStateByChat[key] = map;
    }
    return map;
}

function charStateList() {
    const st = charStateCur();
    const chars = (state.dirCache && state.dirCache.chars) || [];
    const names = [];
    chars.forEach(function (c) { if (c && c.name && names.indexOf(c.name) < 0) names.push(c.name); });
    Object.keys(st).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });
    return { names: names, st: st };
}

function charStateContent() {
    const st = charStateCur();
    const lines = [];
    Object.keys(st).forEach(function (n) {
        const t = String(st[n] || '').trim();
        if (t) lines.push('· ' + n + '：' + t.replace(/\n+/g, ' '));
    });
    return '[人物变化记录]\n' +
        '（由命运织机维护，随世界书常驻注入；这里记的是角色的长期变化/状态，不是当前场景描写）\n' +
        (lines.length ? lines.join('\n') : '（暂无记录）') + '\n' +
        '[当前剧情时间]\n' +
        (String(settings().storyTime || '').trim() || '（未填写）') + '\n' +
        '（以这里为准：正文不要重复报时间，时间只会向前推进；日期只在场景切换或时间跳跃时写一次）\n' +
        '[记录结束]';
}

async function writeCharStateToBook(book) {
    const bk = book || effectiveBook();
    if (!bk) throw new Error('没有目标世界书（先跟随角色卡，或手动选一本书）');
    const name = String(settings().charStateEntry || '人物变化记录（命运织机）');
    const content = charStateContent();
    const TH_ = (function () { try { return window.TavernHelper; } catch (e) { return null; } })();
    if (!TH_ || typeof TH_.getLorebookEntries !== 'function') throw new Error('页面上没有 TavernHelper（酒馆助手没加载？）');
    const entries = await TH_.getLorebookEntries(bk);
    const found = entries.find(function (e) { return String(e.comment || '') === name; });
    const order = Number(settings().charStateOrder) || 10020;
    if (found) {
        await TH_.setLorebookEntries(bk, [{
            uid: found.uid, content: content,
            constant: true, enabled: true, disable: false,
            position: 'at_depth_as_system', depth: 999, order: order, probability: 100,
        }]);
    } else {
        await TH_.createLorebookEntries(bk, [{
            comment: name, content: content,
            constant: true, enabled: true, type: 'constant',
            position: 'at_depth_as_system', depth: 999, order: order, probability: 100,
            key: [], keys: [], keysecondary: [],
            exclude_recursion: false, prevent_recursion: false,
            delay_until_recursion: 0, group: '', group_weight: 100,
        }]);
    }
    const _csMap = charStateCur();
    const count = Object.keys(_csMap).filter(function (k) {
        return String(_csMap[k] || '').trim();
    }).length;
    return { book: bk, name: name, lines: count };
}

// ── 自动检测人物变化（每 N 楼一次，从最近剧情里提取长期变化并追加）──
let charStateBusy = false;

function charStatePool() {
    const chat = live().chat || [];
    const len = chat.length;
    const s = settings();
    const every = Math.max(1, Number(s.charStateEvery) || 3);
    const mark = Number((s.charStateMarks || {})[chatKey()]) || 0;
    if (!mark) return { pool: chat.slice(-40), len: len, mark: 0, every: every };
    const from = Math.max(0, Math.min(mark - 1, len));
    const pool = chat.slice(from).slice(-40);
    return { pool: pool, len: len, mark: mark, every: every, fresh: len - mark };
}

function charStateMark(len) {
    const s = settings();
    s.charStateMarks = s.charStateMarks || {};
    s.charStateMarks[chatKey()] = len;
    persist();
}

async function detectCharChanges(force) {
    resetLLMCancel();
    const s = settings();
    if (!force && s.charStateAuto === false) return null;
    if (charStateBusy) return null;
    const dp = charStatePool();
    if (!dp.mark && !force) { charStateMark(dp.len); return null; }   // 第一次自动检测：以当前楼层为基线，不扫历史
    if (!force && (dp.len - dp.mark) < dp.every) return null;
    const recent = dp.pool.map(function (m) {
        const t = String(m.mes || m.message || '');
        return t ? ('[' + (m.is_user ? '玩家' : 'AI') + '] ' + t) : '';
    }).filter(Boolean).join(NL2).slice(0, 14000);
    if (!recent.trim()) return null;

    charStateBusy = true;
    try {
        const st = charStateCur();
        const curLines = Object.keys(st).map(function (k) {
            const v = String(st[k] || '').replace(/\n+/g, ' ').trim();
            return v ? (k + '：' + v) : '';
        }).filter(Boolean).join(NL2) || '（空）';
        const prompt = [
            '你是剧情状态记录员。读最近的剧情，找出角色发生的【长期变化】。',
            '长期变化 = 会持续影响后续剧情的状态：怀孕/受孕、关系确立或破裂、身份暴露（如妖怪/魅魔身份被知道）、身体变化（如长出尾巴）、立场变化、重要承诺。',
            '不要记录临时情绪、当前动作、场景描写、一次性事件。',
            '【已有记录】',
            curLines,
            '【最近剧情】',
            recent,
            '【输出要求】严格输出 JSON，不要代码块：',
            '{"changes":[{"name":"角色名","change":"一句话的长期变化（写清事实即可）"}]}',
            '规则：1) 只写【已有记录】里还没有的新变化；2) 没有新变化就输出 {"changes":[]}；3) name 用剧情里的角色名，2~6 字；4) 不要写露骨细节。',
        ].join(NL2);
        const raw = await callLLM(prompt);
        const j = parseLoose(raw) || {};
        const changes = Array.isArray(j.changes) ? j.changes : [];
        let added = 0;
        const st2 = charStateCur();
        for (const ch of changes) {
            const nm = String(ch.name || '').trim();
            const tx = String(ch.change || '').trim();
            if (!nm || !tx || nm.length > 12 || tx.length > 200) continue;
            const old = String(st2[nm] || '').trim();
            if (old.indexOf(tx) >= 0) continue;
            st2[nm] = old ? old.replace(/[；;]\s*$/, '') + '；' + tx : tx;
            added++;
        }
        charStateMark(dp.len);
        if (added) {
            try { await writeCharStateToBook(); } catch (e) { console.warn('[命运织机] 人物变化写入世界书失败', e); }
            const nmList = [...new Set(changes.map(function (c) { return String(c.name || '').trim(); }).filter(Boolean))];
            try { toast('人物变化 +' + added + ' 条：' + nmList.join('、'), null, 5000); } catch (e) { }
            try {
                const detail = changes.map(function (c) {
                    const nm = String(c.name || '').trim();
                    const tx = String(c.change || '').trim();
                    return nm + '：' + tx.slice(0, 40) + (tx.length > 40 ? '…' : '');
                }).filter(Boolean).slice(0, 3).join('；');
                galNotice('人物变化 +' + added + ' 条 —— ' + detail + '（点击查看）', 'charstate', 12000);
            } catch (e) { /* ignore */ }
            try { if (state.tab === 'charstate') render(); } catch (e) { }
        }
        console.log('[命运织机] 人物变化检测：新增 ' + added + ' 条（楼层 ' + dp.len + '）');
        return { added: added, len: dp.len };
    } catch (e) {
        console.warn('[命运织机] 人物变化检测失败', e);
        return null;
    } finally {
        charStateBusy = false;
    }
}

// ── 剧情时间自动追踪：从最新 AI 回复里解析时间并自动更新（不用手动改）──
function cnNum2(s) {
    if (s == null) return NaN;
    s = String(s).trim();
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    const map = { '零': 0, '〇': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
    if (s === '十') return 10;
    if (s.indexOf('十') >= 0) {
        const parts = s.split('十');
        const a = parts[0] ? (map[parts[0]] === undefined ? NaN : map[parts[0]]) : 1;
        const b = parts[1] ? (map[parts[1]] === undefined ? NaN : map[parts[1]]) : 0;
        if (!isFinite(a) || !isFinite(b)) return NaN;
        return a * 10 + b;
    }
    let out = 0;
    for (const ch of s) { if (map[ch] === undefined) return NaN; out = out * 10 + map[ch]; }
    return out;
}
function pad2(n) { n = Number(n) || 0; return (n < 10 ? '0' : '') + n; }
function storyTimeFormat(y, m, d, hh, mi) {
    const date = new Date(y, m - 1, d, hh, mi, 0, 0);
    const mm = date.getMonth() + 1, dd = date.getDate(), H = date.getHours(), M = date.getMinutes();
    const MON = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][mm] || String(mm);
    const xun = dd <= 10 ? '上旬' : (dd <= 20 ? '中旬' : '下旬');
    const period = H < 5 ? '凌晨' : H < 7 ? '清晨' : H < 9 ? '早晨' : H < 11 ? '上午' : H < 13 ? '中午' : H < 15 ? '午后' : H < 17 ? '下午' : H < 19 ? '傍晚' : H < 23 ? '夜里' : '深夜';
    return date.getFullYear() + '-' + pad2(mm) + '-' + pad2(dd) + ' ' + pad2(H) + ':' + pad2(M) + '（' + MON + '月' + xun + '·' + period + '）';
}
function detectStoryTimeFromText(rawText, cur) {
    let text = String(rawText || '');
    const gm = text.match(/<game>([\s\S]*?)<\/game>/i);
    const scene = gm ? gm[1] : text;
    const head = scene.slice(0, 600);
    let y = 0, mo = 0, d = 0, hh = NaN, mi = NaN;
    const dm = String(cur || '').match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dm) { y = +dm[1]; mo = +dm[2]; d = +dm[3]; }
    const tm = String(cur || '').match(/(\d{1,2})[:：](\d{2})/);
    if (tm) { hh = +tm[1]; mi = +tm[2]; }
    // 明确日期
    for (const m of head.matchAll(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]/g)) { y = +m[1]; mo = +m[2]; d = +m[3]; }
    // 相对天数（第二天/次日/翌日/隔天/第N天/一周后/N天后）
    let dayJump = 0;
    for (const m of head.matchAll(/(?:第\s*([0-9零一二三四五六七八九十]{1,3})\s*天|(?:次|翌|隔)\s*[日天])/g)) {
        if (m[1] != null) { const n = cnNum2(m[1]); if (n > 1) dayJump = Math.max(dayJump, n - 1); }
        else dayJump = Math.max(dayJump, 1);
    }
    for (const m of head.matchAll(/(?:一|几|数|[0-9一二三四五六七八九十]{1,3})\s*(?:天|日)\s*后|一\s*周\s*后/g)) {
        const nm = (m[0].match(/^[0-9零一二三四五六七八九十]+/) || ['一'])[0];
        if (/周/.test(m[0])) dayJump = Math.max(dayJump, 7);
        else if (/几|数/.test(m[0])) dayJump = Math.max(dayJump, 3);
        else { const n = cnNum2(nm); if (n > 0) dayJump = Math.max(dayJump, n); }
    }
    // 时刻（阿拉伯 22:50 / 中文 十点五十分 / 十点半）
    let clock = null;
    for (const m of head.matchAll(/(\d{1,2})[:：](\d{2})/g)) {
        if (+m[1] <= 24 && +m[2] < 60) clock = { h: +m[1], m: +m[2], at: m.index };
    }
    for (const m of head.matchAll(/([0-9零一二三四五六七八九十]{1,3})\s*点\s*(半|整|([0-9零一二三四五六七八九十]{1,3})\s*分?)?/g)) {
        const h2 = cnNum2(m[1]);
        if (!(h2 >= 0 && h2 <= 24)) continue;
        let mi2 = 0;
        if (m[2] === '半') mi2 = 30; else if (m[2] === '整') mi2 = 0; else if (m[3]) mi2 = cnNum2(m[3]);
        if (!(mi2 >= 0 && mi2 < 60)) mi2 = 0;
        if (!clock || m.index > clock.at) clock = { h: h2, m: mi2, at: m.index };
    }
    // 时段词
    const periods = [['凌晨', 3], ['清晨', 6], ['早上', 7], ['早晨', 7], ['上午', 9], ['中午', 12], ['午后', 14], ['下午', 15], ['傍晚', 18], ['黄昏', 18], ['晚上', 20], ['夜晚', 21], ['夜里', 22], ['深夜', 23], ['午夜', 0]];
    let period = null;
    for (const pw of periods) {
        const i2 = head.lastIndexOf(pw[0]);
        if (i2 >= 0 && (!period || i2 > period.at)) period = { w: pw[0], h: pw[1], at: i2 };
    }
    if (!y) { const now = new Date(); y = now.getFullYear(); mo = now.getMonth() + 1; d = now.getDate(); }
    let newH = hh, newM = mi;
    if (clock) {
        newH = clock.h; newM = clock.m;
        // 时段 + 钟点：晚上/夜里/下午的「十点」= 22:00 / 15:00…（没说时段就不猜）
        if (period) {
            const pm = /下午|午后|傍晚|黄昏|晚上|夜晚|夜里|深夜/.test(period.w);
            if (pm && newH < 12) newH += 12;
            if (/午夜/.test(period.w) && newH === 12) newH = 0;
            if (!pm && /凌晨/.test(period.w) && newH === 12) newH = 0;
            if (newH === 24) newH = 0;
        }
    } else if (period) { newH = period.h; newM = 0; }
    if (!isFinite(newH)) return '';
    // 过夜推测：当前是夜里/深夜，但场景已经写到清晨/早上（且没有明说第二天）→ 视为次日
    let jump = dayJump;
    if (!jump && period && /凌晨|清晨|早上|早晨/.test(period.w) && (hh >= 20 || hh < 5)) jump = 1;
    const base = new Date(y, mo - 1, d, isFinite(hh) ? hh : newH, isFinite(mi) ? mi : 0, 0, 0);
    const curTime = base.getTime();
    base.setDate(base.getDate() + (jump || 0));
    base.setHours(newH, newM, 0, 0);
    if (!jump && base.getTime() < curTime) return '';   // 没有跨天时，不把时间往回退（避免沿用旧时间戳）
    return storyTimeFormat(base.getFullYear(), base.getMonth() + 1, base.getDate(), base.getHours(), base.getMinutes());
}

let storyTimeBusy = false;
async function autoUpdateStoryTime() {
    resetLLMCancel();
    if (storyTimeBusy) return '';
    const chat = live().chat || [];
    let text = '';
    for (let i = chat.length - 1; i >= 0; i--) {
        const m = chat[i];
        if (m && !m.is_user && !m.is_system && String(m.mes || '').trim()) { text = String(m.mes); break; }
    }
    if (!text) return '';
    const cur = String(settings().storyTime || '');
    const next = detectStoryTimeFromText(text, cur);
    if (!next || next === cur) return '';
    storyTimeBusy = true;
    try {
        settings().storyTime = next;
        persist();
        try { await writeCharStateToBook(); } catch (e) { console.warn('[命运织机] 剧情时间写入世界书失败', e); }
        try {
            const el = $('ac-cs-time');
            const ae = document.activeElement;
            if (el && ae !== el && !(ae && ae.classList && ae.classList.contains('ac-cs-ta'))) el.value = next;
            const note = $('ac-cs-time-note');
            if (note) note.textContent = '自动更新：已开启 · 最近一次自动识别：' + next;
        } catch (e) { }
        console.log('[命运织机] 剧情时间自动更新：' + (cur || '(空)') + ' → ' + next);
    } finally {
        storyTimeBusy = false;
    }
    return next;
}

function viewCharState() {
    const s = settings();
    const list = charStateList();
    const st = list.st || {};
    const names = list.names || [];
    const bk = effectiveBook() || '(未选)';
    const entryName = String(s.charStateEntry || '人物变化记录（命运织机）');
    let h = '<h2>人物变化</h2>';
    h += '<div class="ac-card"><div class="h">当前剧情时间<span class="i">自动识别</span></div>' +
        '<div class="hint">每轮 AI 回复后会自动从剧情里识别时间（几点、第二天、过夜…），写进世界书常驻条目，AI 每轮都能看到，不会再自己编日期或沿用旧日期。' +
        '识别错的时候可以直接在这里改。</div>' +
        '<div style="display:flex;gap:8px;align-items:center;margin-top:10px">' +
        '<input class="ac-input" id="ac-cs-time" value="' + esc(String(s.storyTime || '')) + '" ' +
        'placeholder="例：2025-08-26 22:52（八月下旬·深夜）" style="flex:1 1 auto;min-width:0;box-sizing:border-box" />' +
        '<button class="ac-btn" id="ac-cs-time-save" style="flex:0 0 auto">更正时间</button>' +
        '</div>' +
        '<div class="hint" id="ac-cs-time-note" style="margin-top:8px">自动更新：已开启 · 每次 AI 回复后自动识别剧情时间</div>' +
        '</div>';
    h += '<div class="ac-card"><div class="h">长期状态记录</div>' +
        '<div class="hint">记录角色的<b>长期变化</b>（怀孕、关系变化、身份暴露、身体变化…）。保存后会写进世界书的常驻条目，AI 每一轮都能看到。' +
        '它和出场频率无关，也不受数据库本体自动更新影响。</div>' +
        '<div class="hint" style="margin-top:6px">目标世界书：<b>' + esc(bk) + '</b><br>写入条目：<b>' + esc(entryName) + '</b>（常驻 / 系统注入）</div>' +
        '<div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap">' +
        '<label class="ac-sw" style="margin:0"><input type="checkbox" id="ac-cs-auto"' + (s.charStateAuto !== false ? ' checked' : '') + ' /><span></span></label>' +
        '<span style="font-size:13px">自动检测</span>' +
        '<span style="opacity:.85">每</span>' +
        '<input class="ac-input" id="ac-cs-every" type="number" min="1" max="50" value="' + (Number(s.charStateEvery) || 3) + '" style="width:64px" />' +
        '<span style="opacity:.85">楼检测一次，自动追加</span>' +
        '<button class="ac-btn" id="ac-cs-detect">立即检测一次</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">' +
        '<button class="ac-btn pri" id="ac-cs-save">保存并写入世界书</button>' +
        '<button class="ac-btn" id="ac-cs-onlysave">只保存（暂不写世界书）</button>' +
        '<button class="ac-btn" id="ac-cs-reload">重新读取角色清单</button>' +
        '</div><div class="hint" id="ac-cs-status" style="margin-top:8px"></div></div>';
    h += '<div class="ac-card"><div class="h">角色变化</div>' +
        (names.length ? names.map(function (n) {
            const v = String(st[n] || '');
            return '<div style="margin-bottom:12px">' +
                '<div style="font-weight:600;margin-bottom:4px">' + esc(n) + '</div>' +
                '<textarea class="ac-input ac-cs-ta" data-cs="' + esc(n) + '" rows="2" ' +
                'placeholder="例：长期变化/状态（怀孕、关系变化、身份暴露、身体变化……）" ' +
                'style="width:100%;min-height:48px;resize:vertical;box-sizing:border-box">' + esc(v) + '</textarea></div>';
        }).join('') : '<div class="ac-empty">还没读到角色。点上面的「重新读取角色清单」。</div>');
    h += '</div>';
    return h;
}

function wireCharState() {
    const setStatus = function (txt, ok) {
        const el = $('ac-cs-status');
        if (el) el.innerHTML = '<span style="color:' + (ok ? '#8fd9b6' : '#ffa0a0') + '">' + esc(txt) + '</span>';
    };
    const collect = function () {
        const st = {};
        document.querySelectorAll('.ac-cs-ta').forEach(function (ta) {
            const n = String(ta.dataset.cs || '');
            const v = String(ta.value || '').trim();
            if (n && v) st[n] = v;
        });
        return st;
    };
    const save = async function (write) {
        try {
            charStateSet(collect());
            const tEl = $('ac-cs-time');
            if (tEl) settings().storyTime = String(tEl.value || '').trim();
            persist();
            if (!write) { setStatus('已保存到设置（还没写世界书）', true); return; }
            setStatus('正在写入世界书…', true);
            const r = await writeCharStateToBook();
            setStatus('已写入「' + r.book + '」→「' + r.name + '」（' + r.lines + ' 个角色的变化）', true);
        } catch (e) { setStatus('失败：' + (e && e.message ? e.message : e), false); }
    };
    const b1 = $('ac-cs-save');
    if (b1) b1.addEventListener('click', function () { save(true); });
    const b2 = $('ac-cs-onlysave');
    if (b2) b2.addEventListener('click', function () { save(false); });
    // 「更正时间」：只改时间并立即写世界书
    const bTime = $('ac-cs-time-save');
    if (bTime) bTime.addEventListener('click', async function () {
        const tEl = $('ac-cs-time');
        if (!tEl) return;
        try {
            settings().storyTime = String(tEl.value || '').trim();
            persist();
            setStatus('正在写入时间…', true);
            const r = await writeCharStateToBook();
            const note = $('ac-cs-time-note');
            if (note) note.textContent = '已更正：' + settings().storyTime;
            setStatus('时间已更正并写入「' + r.book + '」', true);
        } catch (e) { setStatus('失败：' + (e && e.message ? e.message : e), false); }
    });
    const b3 = $('ac-cs-reload');
    if (b3) b3.addEventListener('click', async function () {
        setStatus('重新读取中…', true);
        try { await refreshDirCache(); render(); } catch (e) { setStatus('读取失败：' + (e && e.message ? e.message : e), false); }
    });
    // 自动检测开关 / 间隔 / 立即检测
    const auto = $('ac-cs-auto');
    if (auto) auto.addEventListener('change', function () {
        settings().charStateAuto = !!auto.checked;
        persist();
        setStatus(auto.checked ? '已开启自动检测（每 ' + (Number(settings().charStateEvery) || 3) + ' 楼）' : '已关闭自动检测', true);
    });
    const every = $('ac-cs-every');
    if (every) every.addEventListener('change', function () {
        const v = Math.max(1, Math.min(50, Number(every.value) || 3));
        every.value = String(v);
        settings().charStateEvery = v;
        persist();
        setStatus('自动检测间隔：每 ' + v + ' 楼', true);
    });
    const detect = $('ac-cs-detect');
    if (detect) detect.addEventListener('click', async function () {
        if (charStateBusy) { setStatus('正在检测中，请稍等…', true); return; }
        // 检测前先把「已修改但未保存」的也保存掉
        try {
            charStateSet(collect());
            persist();
        } catch (e) { }
        setStatus('正在让模型检测最近剧情的变化…（最长约 1 分钟）', true);
        const r = await detectCharChanges(true);
        let msg, ok;
        if (!r) { msg = '没有可检测的内容（没打开聊天？）或检测失败，详见控制台 [命运织机] 日志'; ok = false; }
        else if (r.added) { msg = '检测完成：新增 ' + r.added + ' 条人物变化，已自动写入世界书'; ok = true; }
        else { msg = '检测完成：最近剧情没有新的长期变化'; ok = true; }
        try { render(); } catch (e) { }
        setStatus(msg, ok);
    });
}

// ── 挂载 ─────────────────────────────────────────
jQuery(async () => {
    try { state.books = await listBooks(); } catch (e) { console.warn('[命运织机] 读列表失败', e); }

    // 魔杖菜单里加一项。酒馆可能还没建好菜单，所以带重试
    (function mountMenu(tries) {
        tries = tries || 0;
        const menu = document.getElementById('extensionsMenu');
        if (!menu) {
            if (tries < 40) return setTimeout(function () { mountMenu(tries + 1); }, 250);
            console.warn('[命运织机] 等不到 extensionsMenu，仍可用 /ml 或 /织机 打开');
            return;
        }
        if (document.getElementById('ac_wand_btn')) return;
        const btn = document.createElement('div');
        btn.id = 'ac_wand_btn';
        btn.classList.add('list-group-item', 'flex-container', 'flexGap5');
        btn.innerHTML = '<div class="fa-solid fa-user-pen extensionsMenuExtensionButton"></div><span>' + esc(TITLE) + '</span>';
        btn.addEventListener('click', openPanel);
        menu.appendChild(btn);
        console.log('[命运织机] 已加入魔杖菜单');
    })();

    // 正文结尾符号清理（显示层）
    installRenderCleaner();

    // 斜杠命令：不用找菜单也能开
    try {
        const SP = ctx.SlashCommandParser, SC = ctx.SlashCommand;
        if (SP && SC && SC.fromProps) {
            const mk = function (name, alias, help) {
                return SP.addCommandObject(SC.fromProps({
                    name: name,
                    aliases: alias,
                    helpString: help,
                    callback: function () { openPanel(); return ''; },
                }));
            };
            mk('织机', ['ml', 'fateloom'], '打开 ' + SHORT + ' 面板');
            try {
                SP.addCommandObject(SC.fromProps({
                    name: '群像',
                    aliases: ['ensemble'],
                    helpString: '开关群像模式（不围绕 {{user}} 展开，多角色群像演绎）',
                    callback: function () {
                        const s = settings();
                        s.ensemble = !s.ensemble;
                        persist();
                        try { applyEnsemble(); } catch (e) { /* ignore */ }
                        toast('群像模式：' + (s.ensemble ? '已开启' : '已关闭'), null, 3000);
                        try { render(); } catch (e) { /* ignore */ }
                        return '';
                    },
                }));
            } catch (e) { console.warn('[命运织机] /群像 注册失败', e); }
            console.log('[命运织机] 斜杠命令已注册：/织机  /ml  /fateloom');
        }
    } catch (e) { console.warn('[命运织机] 斜杠命令注册失败', e); }

    // 对话结束 → 自动检测新人物并生成模板
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs && evt && evt.MESSAGE_RECEIVED) {
            evs.on(evt.MESSAGE_RECEIVED, () => scheduleAuto());
            // 人物变化：每 N 楼自动检测一次（默认 3 楼）
            evs.on(evt.MESSAGE_RECEIVED, function () {
                setTimeout(function () { try { detectCharChanges(false); } catch (e) { /* ignore */ } }, 3000);
            });
            // 剧情时间：每轮 AI 回复后自动识别并更新（写进世界书常驻条目）
            evs.on(evt.MESSAGE_RECEIVED, function () {
                setTimeout(function () { try { autoUpdateStoryTime(); } catch (e) { /* ignore */ } }, 2500);
            });
            if (evt.GENERATION_STARTED) {
                evs.on(evt.GENERATION_STARTED, (type) => {
                    try { applyEnsemble(); applyPlay(); applyCleanRule(); applyAdvance(); } catch (e) { /* ignore */ }
                    const gtype = String(type || 'normal');
                    const isQuietGen = (gtype === 'quiet' || gtype === 'dryrun');
                    try {
                        if (state.gal) {
                            if (isQuietGen) {
                                // 记忆库/总结等扩展的静默生成：不算主生成，Galgame 不要抢状态
                                state.gal.quietGen = true;
                            } else {
                                state.gal.mainGen = true;
                                state.gal.genStarted = true;
                                state.gal.awaitingAt = Date.now();
                                state.gal.quietGen = false;
                            }
                        }
                    } catch (e) { /* ignore */ }
                    galDiag('gen_started', { type: gtype });
                    try {
                        if (!isQuietGen && state.gal && document.getElementById('ac-gal-overlay') && document.getElementById('ac-gal-overlay').classList.contains('on')) {
                            galHideInteractions();
                            try { galHint('✍️ AI 正在写…', true); } catch (e) { /* ignore */ }
                            galStartExternalWatch();
                            galUpdateStopBtn();
                        }
                    } catch (e) { /* ignore */ }
                    runDirector();
                });
                if (evt.STREAM_TOKEN_RECEIVED) {
                    evs.on(evt.STREAM_TOKEN_RECEIVED, function () {
                        try { if (state.gal && state.gal.awaiting) galStreamTick(); else { try { galExternalTick(); } catch (e) { /* ignore */ } } } catch (e) { /* ignore */ }
                    });
                }
                if (evt.GENERATION_ENDED) {
                    evs.on(evt.GENERATION_ENDED, function () {
                        try {
                            try { if (state.gal) state.gal.quietGen = false; } catch (e) { /* ignore */ }
                            const st = state.gal;
                            if (!st || !st.awaiting) {
                                try { galStopExternalWatch(); } catch (e) { /* ignore */ }
                                try {
                                    if (document.getElementById('ac-gal-overlay') && document.getElementById('ac-gal-overlay').classList.contains('on')) {
                                        setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 700);
                                    }
                                } catch (e) { /* ignore */ }
                                return;
                            }
                            if (st.regenSelf) {
                                setTimeout(function () {
                                    try {
                                        const st3 = state.gal;
                                        if (!st3 || !st3.regenSelf) return;
                                        st3.awaiting = false;
                                        st3.regenSelf = false;
                                        st3.busy = false;
                                        st3.sent = false;
                                        galStopPolling();
                                        galUpdateStopBtn();
                                        try { galLoad(); } catch (e) { /* ignore */ }
                                    } catch (e) { /* ignore */ }
                                }, 600);
                                return;
                            }
                            const last = galLastAiMessage();
                            const idx = last ? (ctx.chat || []).indexOf(last) : -1;
                            if (idx > (st.sendMesIndex == null ? -1 : st.sendMesIndex)) {
                                st.awaiting = false;
                                st.busy = false;
                                galStopPolling();
                                setTimeout(function () { try { galLoad(); } catch (e) { /* ignore */ } }, 400);
                            } else if (st.mainGen) {
                                // 主生成结束了但没等到新正文：等 2.5 秒确认（可能还有收尾）
                                setTimeout(function () {
                                    try {
                                        const st2 = state.gal;
                                        if (!st2 || !st2.awaiting) return;
                                        const last2 = galLastAiMessage();
                                        const idx2 = last2 ? (ctx.chat || []).indexOf(last2) : -1;
                                        if (idx2 > (st2.sendMesIndex == null ? -1 : st2.sendMesIndex)) return;
                                        if (galIsActuallyGenerating()) return;
                                        st2.awaiting = false;
                                        st2.sent = false;
                                        st2.busy = false;
                                        st2.mainGen = false;
                                        galStopPolling();
                                        galUpdateStopBtn();
                                        galHint('⚠️ 这次没生成出正文（可能被中断），点「用这句推进」重试', false);
                                    } catch (e) { /* ignore */ }
                                }, 2500);
                            }
                            try { galUpdateStopBtn(); } catch (e) { /* ignore */ }
                        } catch (e) { /* ignore */ }
                    });
                }
                console.log('[命运织机] 已挂载出场导演');
            }
            console.log('[命运织机] 已挂载对话结束检测 / 人物变化自动检测');
        }
    } catch (e) { console.warn('[命运织机] 事件挂载失败', e); }

    // 生成结束后自动检查一次（任何扩展/主 API 的生成都算）
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs && evt && evt.GENERATION_ENDED) {
            evs.on(evt.GENERATION_ENDED, function () {
                state.lastGenEndAt = Date.now();
                try { if (state.gal) state.gal.quietGen = false; } catch (e) { /* ignore */ }
                galDiag('gen_ended', {});
                galScheduleAutoFix(1500);
                setTimeout(function () { try { galTagCheckSoon(); } catch (e) { /* ignore */ } }, 1400);
            });
        }
        // 记录最后一个流式正文 token 的时间（判断“真的没新字”用）
        if (evs && evt && evt.STREAM_TOKEN_RECEIVED) {
            evs.on(evt.STREAM_TOKEN_RECEIVED, function () { state.lastTokenAt = Date.now(); });
        }
    } catch (e) { /* ignore */ }

    // 切换聊天时重新注入群像模式
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs && evt && evt.CHAT_CHANGED) {
            evs.on(evt.CHAT_CHANGED, function () {
                setTimeout(function () {
                    try { applyEnsemble(); applyPlay(); applyCleanRule(); applyAdvance(); } catch (e) { /* ignore */ }
                    try { galHideChatSpeakerTags(); } catch (e) { /* ignore */ }
                }, 500);
            });
        }
    } catch (e) { /* ignore */ }

    // 聊天显示层隐藏【角色名】：标注（不改聊天记录）
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs) {
            const hide = function (mesId) { setTimeout(function () { try { galHideChatSpeakerTags(mesId); } catch (e) { /* ignore */ } }, 30); };
            if (evt && evt.CHARACTER_MESSAGE_RENDERED) evs.on(evt.CHARACTER_MESSAGE_RENDERED, hide);
            if (evt && evt.MESSAGE_UPDATED) evs.on(evt.MESSAGE_UPDATED, hide);
            if (evt && evt.MESSAGE_SWIPED) evs.on(evt.MESSAGE_SWIPED, hide);
            if (evt && evt.MESSAGE_RECEIVED) evs.on(evt.MESSAGE_RECEIVED, function () { hide(); });
            setTimeout(function () { try { galHideChatSpeakerTags(); } catch (e) { /* ignore */ } }, 2500);
        }
    } catch (e) { /* ignore */ }

    // 首次加载：以当前楼层作为人物变化的检测基线（不扫历史）
    try {
        const marks = settings().charStateMarks || {};
        if (!marks[chatKey()]) charStateMark((live().chat || []).length);
    } catch (e) { /* ignore */ }

    try { applyTheme(); } catch (e) { console.warn('[命运织机] 配色应用失败', e); }
    ensurePanel();
    try { ensureMini(); } catch (e) { console.warn('[命运织机] 浮动小面板创建失败', e); }
    try { watchCharacter(); } catch (e) { console.warn('[命运织机] 切换监听启动失败', e); }
    console.log('[命运织机] v' + VERSION + ' 已加载 · 世界书 ' + state.books.length + ' 本');
});
})();
