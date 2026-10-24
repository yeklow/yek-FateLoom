// 从 index.js + style.css 生成酒馆助手单文件版
// 用法：node build-script.mjs
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const idx = fs.readFileSync(DIR + 'index.js', 'utf8').replace(/\r\n/g, '\n');
const css = fs.readFileSync(DIR + 'style.css', 'utf8').replace(/\r\n/g, '\n');
const mf = JSON.parse(fs.readFileSync(DIR + 'manifest.json', 'utf8'));
const ver = mf.version || '0.0.0';
const name = mf.display_name || 'yek命运织机';

// 去掉 ES 模块的 import/export 行（沙箱里用 shim 代替 getContext）
const body = idx
  .split('\n')
  .filter(l => !/^import\s/.test(l) && !/^export\s/.test(l))
  .join('\n')
  .trimEnd();

const out = `/* ═══════════════════════════════════════════════════════════
 * ${name} v${ver} —— 酒馆助手（Tavern Helper）单文件版
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
        throw new Error("${name}：找不到酒馆上下文，请确认已装酒馆助手（JS-Slash-Runner）");
    };

    // ── 注入样式 ──
    const CSS = ${JSON.stringify(css)};
    (function injectCss() {
        const id = "ac-style-script";
        const old = DOC.getElementById(id);
        if (old) old.remove();
        const st = DOC.createElement("style");
        st.id = id;
        st.textContent = CSS;
        (DOC.head || DOC.documentElement).appendChild(st);
    })();

${body}
})();
`;

fs.writeFileSync(DIR + 'yek-FateLoom.script.js', out.replace(/\n/g, '\r\n'), 'utf8');
console.log('  已生成 yek-FateLoom.script.js  v' + ver + '  ' + Math.round(out.length / 1024) + ' KB');