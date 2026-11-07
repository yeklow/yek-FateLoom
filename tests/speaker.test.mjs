// FateLoom 说话人识别回归测试（node --test tests/speaker.test.mjs）
import test from 'node:test';
import assert from 'node:assert/strict';
import { galV2Resolve } from '../speaker-engine.js';

const N = (name, key, user = false) => ({ name, key, user });
const BASE = [
    N('顾言', '顾言', true),
    N('林晚', '林晚'),
    N('林凛', '林凛'),
    N('林小满', '林小满'),
    N('林小满', '小满'),
    N('林小满', '满儿'),
];

const CASES = [
    {
        name: '旁白宾语「生完小满没多少天」不能判成小满自称',
        names: BASE,
        segs: ['林晚嗔怪地白了他一眼：', '“你这孩子，妈这才生完小满没多少天，身子还没养利索呢。”'],
        expect: ['', '林晚'],
    },
    {
        name: '名字表外的新角色：从「小满站在防滑垫上…小声问道：」抽取',
        names: [N('顾言', '顾言', true), N('林晚', '林晚')],
        segs: ['林晚替他把外套袖口理平。小满站在门口，*脸颊红扑扑地转向洗手台边的顾言，小声问道*：', '“爸爸，小满已经把外套乖乖穿好啦～”'],
        expect: ['', '小满'],
    },
    {
        name: '旁白里的名词不能被当成角色名（亮面皮革）',
        names: [N('顾言', '顾言', true), N('林晚', '林晚')],
        segs: ['林晚坐在亮面皮革沙发上。*她轻轻抿了抿嘴，林晚小声嘟囔道*：“真拿你没办法……”'],
        expect: ['林晚'],
    },
    {
        name: '连续纯台词不瞎轮转（旁白打断后拒答）',
        names: BASE,
        segs: ['林晚说道：“先把牛奶喝了。”', '小满摇摇头：“我不喝。”', '客厅里的挂钟敲响了八下，窗外下起了淅淅沥沥的小雨。', '“快去洗漱吧。”'],
        expect: ['林晚', '林小满', '', ''],
    },
    {
        name: '男主（user）的台词不标名字',
        names: BASE,
        segs: ['顾言把毛巾搭在肩上，低声笑道：', '“那就依你，今晚早点休息。”'],
        expect: ['', ''],
    },
    {
        name: '剧情推进（男主行动）不标名字',
        names: BASE,
        segs: ['剧情推进：顾言捏了捏林晚的脸颊，贴在她耳边低声笑道：“那我现在就抱你上楼？”'],
        expect: [''],
    },
    {
        name: '内心 <details> 直接取 summary 名字',
        names: BASE,
        segs: ['<details><summary>内心-小满</summary>*爸爸今天会不会留下陪小满睡觉呢……*</details>'],
        expect: ['林小满'],
    },
    {
        name: '喊对方名字（呼语）不当成对方说话',
        names: BASE,
        segs: ['“小满！你又光着脚在地上跑！”'],
        expect: [''],
    },
    {
        name: '引号中间的名字 + 动作词 → 中置归属',
        names: BASE,
        segs: ['“今天天气真好呀，”小满转过身看向林晚，“妈妈我们出去玩吧！”'],
        expect: ['林小满'],
    },
    {
        name: '模型标注【角色名】优先',
        names: BASE,
        segs: ['【林晚】：“你这孩子，真拿你没办法。”'],
        expect: ['林晚'],
    },
    {
        name: '模型标注【user】不显示名字',
        names: BASE,
        segs: ['【顾言】：“那我就当你是答应了。”'],
        expect: [''],
    },
    {
        name: '内心之后紧跟的台词还是同一个人',
        names: BASE,
        segs: ['<details><summary>内心-林晚</summary>*这孩子怎么又提这种要求……*</details>', '“你这孩子，刚帮妈把话说开，怎么嘴里就说出这种话。”'],
        expect: ['林晚', '林晚'],
    },
    {
        name: '上一段旁白没有引导时用叙事焦点弱回退',
        names: BASE,
        segs: ['林晚坐在沙发边，抬起头看了他一眼。', '“真是拿你没办法……”'],
        expect: ['', '林晚'],
    },
    {
        name: '纯旁白 → 空',
        names: BASE,
        segs: ['主卧室的床前，暖黄的灯光安安静静地铺在地板上。'],
        expect: [''],
    },
    {
        name: '场景分隔段不产生说话人',
        names: BASE,
        segs: ['---', '“走吧，回房间。”'],
        expect: ['', ''],
    },
    {
        name: '小满台词（名字表含林小满别名）',
        names: BASE,
        segs: ['“唔……外套刚披上来的时候有点凉凉的呀……”', '小满小声嘟囔了一句，等林晚站起身把皮衣提上来。'],
        expect: ['林小满', ''],
    },
    {
        name: '林凛台词不被小满自称规则抢走',
        names: BASE,
        segs: ['*林凛伸手帮他理了理衣领*：', '“小满刚才说得真好听。不过明天早上，小满要记得早点起床哦。”'],
        expect: ['', '林凛'],
    },
    {
        name: '旁白句首主语「小满站在…问道：」→ 小满',
        names: BASE,
        segs: ['小满站在防滑垫上，用两根手指揪着毛衣下摆，小声问道：', '“爸爸现在带小满回房间休息吗？”'],
        expect: ['', '林小满'],
    },
    {
        name: '多段真实消息片段（林晚 line 1）',
        names: BASE,
        segs: [
            '*客厅里，暖黄色的灯光洒在沙发上，林晚抬起头*：',
            '“你这孩子，怎么嘴里就说出这种话来。”',
        ],
        expect: ['', '林晚'],
    },
    {
        name: '未知角色安全过滤（排除身体部位/名词）',
        names: [N('顾言', '顾言', true), N('林晚', '林晚')],
        segs: ['林晚垂着眼睫不敢看他，手指捏住衣角*：', '“唔……这件事实在是不能让你乱动……”'],
        expect: ['', '林晚'],
    },
];

for (const c of CASES) {
    test(c.name, () => {
        const got = galV2Resolve(c.segs, c.names);
        assert.deepEqual(got, c.expect);
    });
}
