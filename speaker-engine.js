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
export function galStripSpeakerTag(t) {
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
export function galV2Resolve(segs, names) {
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
