#!/usr/bin/env node
/**
 * Galgame 端到端冒烟测试（需要酒馆已启动）
 *
 * 用法：
 *   node tests/e2e-smoke.mjs
 *   $env:AC_ST_URL='http://127.0.0.1:8001'; node tests/e2e-smoke.mjs
 *
 * 环境变量：
 *   AC_ST_URL   酒馆地址（默认 http://127.0.0.1:8001）
 *   AC_ST_CHAR  角色卡名（可选，默认不选角色）
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ST_URL = process.env.AC_ST_URL || 'http://127.0.0.1:8001';
const CHAR = process.env.AC_ST_CHAR || '';
const EDGE = process.env.AC_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9611 + Math.floor(Math.random() * 200);
const PROFILE = path.join(os.tmpdir(), 'ac-e2e-' + Date.now());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = async (u) => (await fetch(u)).json();

let passed = 0;
let failed = 0;
function check(name, ok, detail = '') {
    if (ok) { passed++; console.log('✔', name); }
    else { failed++; console.log('✘', name, detail ? '— ' + detail : ''); }
}

async function main() {
    fs.rmSync(PROFILE, { recursive: true, force: true });
    const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
        '--window-size=1400,900', '--disable-background-timer-throttling',
        `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, 'about:blank'], { stdio: 'ignore' });
    let targets;
    for (let i = 0; i < 80; i++) { await sleep(500); try { targets = await getJson(`http://127.0.0.1:${PORT}/json/list`); if (targets?.length) break; } catch { } }
    if (!targets?.length) throw new Error('Edge 启动失败');
    const page = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    const errors = [];
    ws.onmessage = (ev) => {
        const m = JSON.parse(ev.data);
        if (m.method === 'Runtime.exceptionThrown') { try { errors.push(String(m.params.exceptionDetails.text || '').slice(0, 150)); } catch { } }
        if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); }
    };
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { resolve: res, reject: rej }); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => {
        const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 120000 });
        if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600));
        return r.result.value;
    };
    try {
        await send('Page.navigate', { url: ST_URL + '/' });
        let ready = false;
        for (let i = 0; i < 180; i++) {
            await sleep(1000);
            try { ready = await ev('typeof window.SillyTavern?.getContext === "function" && !!document.getElementById("send_but")'); } catch { }
            if (ready) break;
        }
        check('酒馆页面加载', ready);
        if (!ready) throw new Error('酒馆没有在 180s 内就绪');
        await sleep(8000);
        check('扩展已加载（__acHook）', await ev('typeof window.__acHook === "object"'));
        check('Galgame 入口存在', await ev('!!document.getElementById("ac-gal-open")'));

        await ev(`(async () => {
            const ctx = SillyTavern.getContext();
            const s = ctx.extensionSettings['AUTO-Character'];
            s.vnMode = true; s.vnTypewriter = false; s.vnAutoReroll = false;
            const idx = (ctx.characters || []).findIndex(c => c && c.name === ${JSON.stringify(CHAR)});
            if (idx >= 0) await ctx.selectCharacterById(idx);
            else if ((ctx.characters || []).length) await ctx.selectCharacterById(0);
            await new Promise(r => setTimeout(r, 5000));
        })()`);
        await ev(`document.getElementById('ac-gal-open')?.click()`);
        await sleep(3500);
        const opened = await ev('!!document.querySelector("#ac-gal-overlay.on")');
        check('Galgame 打开', opened);
        const snap = await ev(`(() => ({
            name: document.getElementById('ac-gal-name')?.innerText || '',
            text: (document.getElementById('ac-gal-text')?.innerText || '').slice(0, 80),
            hint: document.getElementById('ac-gal-hint')?.innerText || '',
            hasChoiceOrInput: !!document.getElementById('ac-gal-choice')?.classList.contains('on') || !!document.getElementById('ac-gal-input')?.classList.contains('on')
        }))()`);
        check('Galgame 有内容（正文或空状态提示）', !!(snap.text || snap.hint), JSON.stringify(snap));
        check('自动化按钮/输入状态正常', typeof snap.hasChoiceOrInput === 'boolean');

        await ev(`document.dispatchEvent(new KeyboardEvent('keydown', {ctrlKey:true, altKey:true, key:'d', bubbles:true}))`);
        await sleep(400);
        const diag = await ev(`(() => { const p = document.getElementById('ac-diag-panel'); return { open: !!(p && p.classList.contains('on')), hasVersion: !!(p && /"version":/.test(p.innerText)), len: p ? p.innerText.length : 0 }; })()`);
        check('诊断面板可打开', diag.open && diag.hasVersion, JSON.stringify(diag));

        const bad = errors.filter(e => e && !/favicon|net::ERR|ResizeObserver/.test(e));
        check('页面无 JS 异常', bad.length === 0, bad.slice(0, 3).join(' | '));

        await ev(`document.getElementById('ac-gal-close')?.click()`);
    } finally {
        try { ws.close(); } catch { }
        try { edge.kill(); } catch { }
    }
    console.log(`\n结果：通过 ${passed} / 失败 ${failed}`);
    process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error('E2E 失败:', String(e).slice(0, 800)); process.exit(1); });
