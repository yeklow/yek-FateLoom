// ═══════════════════════════════════════════════════════════
// yek命运织机 v0.6 —— 出场导演 + LLM 扫世界书
// ═══════════════════════════════════════════════════════════
import { getContext } from '../../../extensions.js';

const MODULE = 'AUTO-Character';   // 设置存储键，不要改（改了会丢配置）
const TITLE = 'yek命运织机';       // 界面显示名
const SHORT = '命运织机';
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
    "扶她": "同时具备女性与男性生殖结构。写清她怎么对待这件事：隐瞒、坦然、还是只在独处时显露；以及这给她带来的心理负担或支配优势。",
    "双性": "两性特征并存但偏向一方。写明她的生理细节与她对外界的说法，别人知不知道、她怕不怕被发现。",
    "药娘": "正在或已经通过药物改变身体。写清服药多久、身体变化到哪一步、停药会怎样，以及她对这副身体的复杂心情。",
    "伪娘": "生理男性、外表与举止女性化。写清他的伪装术、被识破的风险、以及他享受还是抗拒这个身份。",
    "雄堕": "原本强势或男性化的一方逐步屈服。写清她的抗拒过程、被攻破的关键点、屈服后残留的骄傲。",
    "雌堕": "原本强势的女性逐步被驯化。写清她失去主导权的节点、身体比理智先投降的表现。",
    "性别转换": "曾经是另一个性别。写清转换的经过、残留的旧习惯、以及新旧身份之间的撕扯。",
    "雌化": "身体逐步女性化。写清变化的速度、她如何掩饰、哪些变化最让她难以接受。",
    "雄化": "身体逐步男性化。同样写清变化过程与她对此的态度。",
    "兽人": "具有完整兽类特征的人形。写清物种、毛色、耳尾的形态与情绪变化、兽性如何影响判断。",
    "半兽": "部分兽化。写清哪一部分是兽、哪些还像人、以及两者带来的矛盾。",
    "魔物娘": "非人种族的女性。写清种族特性、与人类的差异、被人类社会的态度。",
    "吸血鬼": "不死的吸血种。写清她的饮血需求、惧光程度、对鲜血与肉体的双重欲望。",
    "精灵": "长命的精灵种。写清她的年龄带来的疏离感、对人类短暂生命的看法。",
    "人偶": "被制作或被改造的人偶。写清她的关节、缝隙、被摆布的屈辱与残留的自我。",
    "机械体": "机械或半机械的身体。写清哪些部分是机械、机械的反应与人类的差别、她的违和感。",
    "异种": "明显非人的存在。写清外形、交流方式、与人类完全不同的价值判断。",
    "触手": "以触手为主要的身体延伸。写清触手的数量、质感、控制方式，以及被触手触碰时的反应。",
    "卵生": "以产卵方式繁殖。写清产卵的周期、身体负担、以及她对这件事的羞耻或认命。",
    "产卵": "会产出卵。写清触发条件、过程、以及产后的虚弱。",
    "催眠": "可被催眠或她擅长催眠。写清催眠的方式、进入状态的征兆、清醒后的残留与遗忘。",
    "洗脑": "记忆或人格被改写。写清被改写前后人格的差异、偶尔浮现的碎片。",
    "认知修改": "她会下意识改写别人的认知。写清改写范围、代价、以及被改写者的违和感。",
    "时间停止": "在时间暂停中行动。写清她是否保有记忆、暂停时长、以及期间的肆意与事后的空虚。",
    "身体改造": "经过刻意的身体改造。写清改造的部位、目的、留下的痕迹与她对此的态度。",
    "巨物": "对巨大之物有强烈偏好或承受力。写清她的偏好表现、身体适应与心理挣扎。",
    "扩张": "身体被刻意撑开。写清适应过程、极限、以及她对这种变化的上瘾。",
    "感官共享": "能共享他人的感官。写清共享的方式、范围、以及共享时她的失控。",
    "触觉强化": "触觉远超常人。写清强化的来源、日常的折磨（连布料摩擦都难忍）、以及被触碰时的过载。",
    "疼痛快感": "痛感会转化为快感。写清转化机制、她能承受的阈值、以及主动求痛的倾向。",
    "附身": "能附身或曾被附身。写清附身条件、意识共存的状态、以及双方争夺控制权时的表现。",
    "分身": "能分出多个自己。写清分身的独立性、共享记忆的程度、以及被分身背叛的恐惧。",
    "灵魂交换": "意识曾与别人交换。写清交换的触发、错位的记忆、以及换回后的不适。",
    "驯化": "被当作牲畜般调教。写清驯化的阶段、她保留的尊严、以及彻底屈服后的表现。",
    "监禁": "被长期关押。写清囚室的细节、她维持理智的方式、对自由既渴望又恐惧的矛盾。",
    "捆绑": "惯于被束缚。写清绳结的方式、束缚时的姿态、以及解开后残留的痕迹与惯性。",
    "烙印": "身上有被烙下的印记。写清位置、形状、她如何遮掩、以及被看见时的反应。",
    "改造纹": "身上的纹路有特殊作用。写清纹路的样式、激活条件、以及激活时的反应。",
    "巨乳": "胸部丰满到影响日常。写清重量感、衣着上的处理、以及她自己对这个部位的看法。",
    "爆乳": "夸张的超常尺寸。写清行动上的不便、他人目光、以及她惯用的掩饰方式。",
    "超乳": "极端尺寸，几乎改变生活形态。写清身体负担与心理上的双重重量。",
    "贫乳": "胸部平坦。写清她是否在意、如何被调侃、以及她的应对姿态。",
    "巨臀": "臀部丰满醒目。写清走动时的存在感、衣着选择、以及她对此的自觉。",
    "肉感": "体态丰腴有肉。写清触感、她对自己身材的接受度。",
    "骨感": "瘦到能看见骨形。写清体重、她维持这种体型的代价。",
    "长腿": "腿型修长。写清比例、惯常的站姿与走路姿态。",
    "黑长直": "乌黑长发垂至腰际。写清发质、打理习惯、以及头发在动作中的表现。",
    "异色瞳": "两眼颜色不同。写清颜色、她是否遮掩、被注视时的反应。",
    "眼镜娘": "常戴眼镜。写清镜框样式、推镜框的小动作、摘下眼镜后的反差。",
    "兽耳": "有人或兽的耳朵。写清耳形、情绪时耳朵的动作、被摸耳朵的反应。",
    "角": "头上有角。写清角的形态、是否会被看到、以及角被触碰时的敏感。",
    "尾巴": "有尾巴。写清尾形、情绪时尾巴的动向、以及尾巴不受控制时的破绽。",
    "翅膀": "有可展开的翼。写清翼展、收起时的隐藏方式。",
    "机械义肢": "部分肢体是机械。写清部位、功能、以及金属与血肉交界处的不适。",
    "人偶关节": "关节是人偶式的球型结构。写清活动范围、活动时的咔嗒声。",
    "黑丝": "日常穿黑色丝袜。写清厚度、她换洗的频率、以及被注视时的反应。",
    "白丝": "日常穿白色丝袜。同上，注意白色更容易脏带来的紧张感。",
    "制服": "以制服为主要着装。写清具体制服种类、穿着的场合、下班后是否还穿。",
    "和服": "惯穿和服或浴衣。写清纹样、穿脱的繁琐、以及和服下的空洞感。",
    "内衣": "对内衣有执念。写清款式偏好、成套的习惯、以及被看见时的羞耻。",
    "项圈": "戴着项圈。写清材质、是否带铃铛、被牵动时的反应。",
    "手铐": "手铐作为日常或道具。写清她的角色（佩戴者还是施加者）。",
    "绳索": "绳缚是她的日常或爱好。写清绳的材质、绑法、留下的痕迹。",
    "眼罩": "常戴眼罩。写清遮住的部位、摘下后的反差。",
    "口球": "口部被限制。写清造型、无法说话时她如何表达。",
    "冷娇": "外冷内热。写清她表面的冷淡措辞、以及关心时的笨拙表达。",
    "傲娇": "嘴上不认、行动上诚实。写清她的反话模式与露馅的瞬间。",
    "病娇": "爱意带占有与破坏。写清她的执念对象、越界的征兆、以及发病时的语气变化。",
    "天然呆": "反应慢半拍、常误解。写清她的误会模式与迟钝带来的可爱或危险。",
    "高冷": "疏离少言。写清她的沉默与偶尔透露的柔软。",
    "毒舌": "嘴上不饶人。写清她的刻薄方式与刀子嘴下的真实态度。",
    "腹黑": "表面温和、内里算计。写清她的算计手法与被看穿时的从容。",
    "忠犬": "绝对的依顺。写清她的服从方式与分离焦虑。",
    "母性": "本能的照顾欲。写清她照顾人的细节与越界的边界。",
    "女王": "惯于支配。写清她的命令口吻、对被支配者的要求。",
    "疯批": "情绪极端不稳定。写清她的失控征兆与失控时的行为。",
    "闷骚": "表面正经、内里渴望。写清她的压抑与泄露的破绽。",
    "敏感体质": "全身都是敏感带。写清被碰到时的过度反应与她试图忍耐的样子。",
    "易湿": "稍有刺激就湿透。写清她如何掩饰、以及被发现时的羞耻。",
    "潮吹": "极易失禁式高潮。写清触发条件与事后的狼狈。",
    "痉挛体质": "高潮后身体抽搐不止。写清持续时长与恢复过程。",
    "绝顶失神": "高潮时意识断片。写清失神的样子与醒来后的空白。",
    "泌乳": "会分泌乳汁。写清触发条件、量、以及她对此的复杂心情。",
    "发情期": "有周期性发情。写清周期、前兆、以及期间的失控。",
    "信息素": "会散发信息素。写清气味、对周围人的影响、她是否自知。",
    "体香": "自带特殊体味。写清气味类型与别人闻到的反应。",
    "体温偏高": "体温高于常人。写清触感、对冷天的偏爱。",
    "失语": "情动时说不出话。写清她只能用动作表达的样子。",
    "成瘾": "对某种刺激成瘾。写清成瘾对象、戒断反应。",
    "人妻": "已婚。写清丈夫是谁、婚姻状态如何，以及她在家与在外的两副面孔。",
    "熟女": "年长的成熟女性。写清年龄感、阅历带来的从容与疲惫。",
    "未亡人": "丧夫。写清丧夫多久、守寡的日常、以及被触碰时的负罪感。",
    "义母": "并非生母的母职身份。写清这层关系的由来与边界。",
    "义姐": "并非血缘的姐姐。写清相处年数与越界的分寸。",
    "女教师": "教师身份。写清科目、学生眼中的形象、以及公私两面的差别。",
    "护士": "医疗从业。写清工作场合、职业化的温柔与私下的冷淡。",
    "女仆": "服侍他人。写清雇佣关系、服侍内容与她的自我定位。",
    "邻家阿姨": "住在附近的长辈女性。写清邻里往来、她惯用的称呼。",
    "年上": "比对方年长。写清年龄差与由此产生的照顾或压制。",
    "年下": "比对方年轻。写清年龄差与由此产生的依赖或反叛。",
    "主仆": "明确的主从关系。写清谁主谁仆、日常的服从方式、以及关系可能的翻转。",
    "师生": "教育关系。写清身份差、越界的分寸、以及被发现的风险。",
    "依存": "心理上离不开对方。写清依存的起点、分离时的反应。",
    "占有": "强烈的独占欲。写清她的占有表现、以及别人靠近时的敌意。",
    "背德": "明知不该却停不下。写清她的道德挣扎与屈服时刻。",
    "禁断": "被明确禁止的关系。写清禁忌的来源与她越界的理由。",
    "调教": "存在明确的调教关系。写清阶段、方式、以及她逐步改变的过程。",
    "夜袭": "惯于在夜里主动接近。写清她的时机选择与潜入方式。",
    "偷窥": "习惯窥视。写清对象、方式、以及被发现的风险。",
    "隔墙": "隔着一道墙。写清墙那侧的声音、她的反应。",
    "醉酒": "酒后失态。写清酒量、醉后的行为、以及醒来后的记忆空白。",
    "浴室": "浴室是重要的场景。写清空间细节与在此发生的事。",
    "露出": "有暴露倾向。写清场合、心理、以及被看见时的反应。",
    "寡妇": "丈夫已故。写清守寡多久、怎么维持体面、独处时的空落，以及被靠近时的负罪与渴望。",
    "继母": "后来进入这个家庭的母亲。写清进门多久、与孩子的关系从什么时候开始变味。",
    "养母": "非亲生但把她养大。写清收养经过、她对「母亲」这个身份的执念。",
    "实妹": "同父母所出的妹妹。写清年龄差、平时的相处、越界时的羞耻。",
    "双子": "双胞胎之一。写清与另一人的差异、从小被比较的习惯、两人共享的秘密。",
    "教授": "学术身份。写清专业、课堂上的威严、私下对学生的态度。",
    "医生": "治病的人。写清科室、面对病人时的职业冷静，以及藏在冷静底下的控制欲。",
    "管家": "打理宅邸的人。写清服务的方式、与主人之间那层恰到好处的距离。",
    "OL": "公司职员。写清职位、职场里的台风、下班之后的落差。",
    "秘书": "贴身助理。写清工作内容、与上司的默契、公私界限在哪。",
    "巫女": "神职身份。写清神社的日常、与俗世的割裂、仪轨养出的禁欲气质。",
    "修女": "教会身份。写清戒律、她对信仰与身体的反复挣扎。",
    "偶像": "公众人物。写清人设、台下真实的那一面、被认出来时的风险。",
    "主播": "靠镜头生活。写清直播内容、关播之后的落差。",
    "摄影师": "以旁观为业。写清她看人的方式、取景时的专注。",
    "女警": "执法身份。写清辖区、办案时的强势、下班之后软下来的样子。",
    "女军官": "军队身份。写清军阶、命令式的口吻、营区外的另一面。",
    "老板娘": "店铺经营者。写清店是什么店、招呼客人的熟练、独处时的疲惫。",
    "房东": "出租房屋的人。写清房子、收租的方式、与房客的分寸。",
    "青梅竹马": "从小一起长大。写清相处多少年、熟到失礼的程度。",
    "上司": "职场上司。写清管理风格、对下属施压的方式。",
    "部下": "职场下属。写清服从的方式、被使唤时的表情。",
    "下属": "归她管的人。写清承担的具体工作、向上汇报时的姿态。",
    "学生会长": "校内最高。写清权力范围、用规章压人的习惯。",
    "图书管理员": "与书为伴。写清馆内的规矩、安静环境里的暧昧。",
    "列车员": "车上的服务者。写清线路、查票时不得不近身的距离。",
    "侦探": "查案的人。写清手段、对真相的执拗。",
    "杀手": "以杀为业。写清手法、对死亡的态度、以及她唯一脆弱的那一刻。",
    "佣兵": "战场谋生。写清战绩、身上的旧伤、对安稳日子的陌生。",
    "微乳": "胸部小而平。写清她是否在意、被提起时的反应。",
    "丰满": "整体圆润有肉。写清触感，以及她对自己身形的自得或困扰。",
    "肌肉": "有明显的肌肉线条。写清训练痕迹、力量感，以及她怎么看自己的身体。",
    "短身": "身材娇小。写清身高带来的视角差、被当成小孩时的反应。",
    "短发": "利落的短发。写清长度、打理方式、跑动起来的样子。",
    "双马尾": "两侧扎起。写清扎法、动起来的样子、被拽住时的反应。",
    "单马尾": "一侧扎起。写清扎的位置、松紧、散开之后的反差。",
    "卷发": "蓬松卷曲。写清卷度、打理要花多久、受潮之后的形状。",
    "银发": "银白发色。写清发质、她是否遮掩、被注视时的反应。",
    "单片眼镜": "只戴一侧。写清佩戴习惯、镜片反光遮住的表情。",
    "美人痣": "有颗很显眼的痣。写清位置、别人注意到时她的反应。",
    "雀斑": "脸上有雀斑。写清分布、她是否用妆盖住。",
    "胎记": "与生俱来的印记。写清位置形状、她对此的讳莫如深。",
    "疤痕": "身上有疤。写清来历、遮掩的方式、被问起时的回避。",
    "纹身": "有刺青。写清图案位置、被看见的风险。",
    "精灵耳": "长而尖的耳。写清耳形、是否用头发遮、被碰到时的反应。",
    "獠牙": "明显的尖牙。写清笑起来的样子、进食时的暗示。",
    "鳞片": "局部有鳞。写清覆盖的范围、触感、她的羞于示人。",
    "触角": "头上有触角。写清形态、被触碰时的敏感、情绪起伏时的动作。",
    "过膝袜": "长度到大腿。写清袜口勒出的痕、走路时不得不分心。",
    "吊带袜": "带夹的丝袜。写清穿脱的繁琐、吊带弹动的声响。",
    "渔网袜": "网眼丝袜。写清密度、皮肤透过网眼的观感。",
    "水手服": "制服的一种。写清领巾、裙长、她穿的场合。",
    "浴衣": "和式便服。写清花纹、腰带、走起来的下摆风险。",
    "旗袍": "中式贴身裙。写清开衩高度、走动时的约束。",
    "蕾丝": "大量蕾丝装饰。写清质地、贴肤时的痒。",
    "丁字裤": "极简的内裤。写清穿着时的心理负担、日常的摩擦感。",
    "开裆": "下装是开裆设计。写清她穿这种衣服的理由与场合。",
    "围裙": "只围着围裙。写清这种状态下的距离感、做家务时的暴露。",
    "泳装": "泳装。写清款式、沾水之后贴在身上。",
    "紧身衣": "全身紧身。写清材质带来的束缚、曲线毕露的自知。",
    "皮衣": "皮革质感。写清气味、贴合度、动作摩擦的声响。",
    "高跟鞋": "常穿高跟。写清跟高、走路姿态、脱下来之后的放松。",
    "面纱": "遮面的纱。写清遮住的范围、揭开时的仪式感。",
    "耳饰": "耳环耳钉。写清数量、晃动、被拉扯时的疼。",
    "乳环": "有穿环。写清款式、穿的时候多疼、被牵动时的反应。",
    "脐环": "有肚脐环。写清样式、露腰时的存在感。",
    "温柔": "待人和煦。写清她温柔的具体细节，以及温柔背后的界限。",
    "羞怯": "容易脸红。写清她紧张的征兆、被逗时越说越小声。",
    "弱气": "不敢拒绝。写清她勉强答应时的表情、事后独自懊悔的样子。",
    "强势": "处处要主导。写清她施压的方式、被反制时的反应。",
    "冷静": "情绪极稳。写清她面不改色的本事、真正被破防的那一刻。",
    "癫狂": "情绪激烈外放。写清她的高亢、失控时的用词。",
    "伪善": "表面善意、底下算计。写清她善意里的算计、被拆穿时的从容。",
    "隐忍": "什么都往肚子里咽。写清忍耐的表现、崩溃的临界点。",
    "黏人": "离不开人。写清她贴人的方式、被拒绝之后怎么办。",
    "疏离": "一直保持距离。写清她的回避方式、偶尔靠近时有多珍贵。",
    "慵懒": "什么都懒得动。写清她的懒散姿态、被逼着动起来的不情愿。",
    "洁癖": "对脏极度敏感。写清清洁仪式、被弄脏时的崩溃。",
    "急躁": "没什么耐心。写清她催促的方式、被打断时的火气。",
    "困倦": "总像没睡够。写清睡相、被叫醒时的迷糊。",
    "前后辈": "有资历差。写清谁是谁的前辈、敬语怎么用、越界时的失礼感。",
    "医患": "医患关系。写清诊疗内容、专业距离下的亲密。",
    "债主": "有金钱纠葛。写清欠了多少、还债的方式、她的立场。",
    "陌生人": "本来毫无关系。写清初遇的场景、后来接近的理由。",
    "三角": "三个人之间的张力。写清第三人是谁、她站在什么位置。",
    "单恋": "单方面的倾慕。写清她暗示的方式、没被回应时的自我说服。",
    "嫉妒": "酸意很重。写清她针对的是谁、发作时的言行。",
    "保护欲": "想把人护住。写清她保护的方式、过度时的窒息感。",
    "利用": "有明确目的。写清她利用什么、被识破时的应变。",
    "共犯": "一起守着秘密。写清秘密是什么、彼此的信赖与钳制。",
    "复仇": "带着旧怨。写清仇怨的由来、她打算怎么还。",
    "交换": "有来有往的交换。写清换的是什么、心里记的账。",
    "拉锯": "反复争夺上风。写清她什么时候占先、什么时候退。",
    "旧情": "曾经在一起过。写清分开多久、重逢时的试探。",
    "婚外": "已婚者的越界。写清配偶的存在、她对风险的意识。",
    "秘密关系": "见不得光的关系。写清保密的代价、被发现会失去什么。",
    "电车": "通勤车厢。写清时段、拥挤程度、她在这种环境里的紧张。",
    "更衣室": "换衣服的空间。写清布局、被人撞见时的反应。",
    "图书馆": "安静的场所。写清书架之间的角落、压低声音的交谈。",
    "泳池": "有水的地方。写清泳衣、湿发、水从皮肤上滑过。",
    "露天": "户外没遮挡。写清她挑这种地方的理由、风声与风险。",
    "雨中": "下雨的场景。写清淋湿之后的样子、衣物贴在身上。",
    "停电": "一片漆黑。写清她对黑暗的态度、感官被放大的反应。",
    "办公室": "工作场所。写清门有没有锁、加班时段、被撞见的风险。",
    "夜班": "整层只有她。写清班有多长、困倦、深夜的安静。",
    "值夜": "守夜。写清守在哪里、什么都没发生的那种静。",
    "出差": "人在外地。写清同行的是谁、陌生城市里的放纵。",
    "同床": "睡一张床。写清睡姿、谁先越界。",
    "偷听": "听墙角。写清她听见了什么、听完之后什么反应。",
    "监视": "长期盯着。写清她用的东西、耐心、被发现的可能性。",
    "电话": "只靠声音。写清通话的时机、声音里露出的破绽。",
    "直播": "对着镜头。写清观众有多少、关掉之后的反差。",
    "录像": "被拍下来。写清留存的风险、她怎么看这些录像。",
    "镜前": "对着镜子。写清她怎么审视自己、从镜中被注视时的反应。",
    "窗外": "事情在窗外发生。写清窗的位置、能看见什么、她站在哪。",
    "痉挛": "事后抽搐不止。写清持续多久、她恢复的样子。",
    "漏尿": "控制不住漏出来。写清触发条件、事后的羞耻。",
    "乳汁": "会分泌乳汁。写清量和触发条件、她自己的看法。",
    "发情": "会进入发情状态。写清前兆、期间对身体的控制力。",
    "汗湿": "极容易出汗。写清气味、衣服贴在身上的细节。",
    "颤抖": "一紧张就抖。写清哪一处先抖、她怎么掩饰。",
    "失禁": "完全失控。写清诱因、她崩溃的样子。",
    "昏厥": "会晕过去。写清阈值、醒来后的空白。",
    "依赖性": "离不开所依赖的人。写清依赖的表现、被抽离时的反应。"
};

const LEN = {
    char: [1200, 2200],
    body: [600, 1200],
    sex: [900, 1800],
    guide: [400, 900],
};

const SYSTEM = "你是角色卡转世界书条目的转换器。把一个人物做成世界书里正式的、能被 AI 认知并主动调用的角色。\n\n【铁律】\n① 种族不改：素材里是什么种族就是什么，人类不改魅魔。\n② 设定照搬：素材写过的外貌、体型、服装、说话方式、口癖、行为习惯，一字不改。\n③ 素材没写的，允许按基调合理补全，但要补得像样、自成一体，不要敷衍留空。\n④ 世界以主卡为准：能和现有世界观融合就融合，实在冲突的丢弃。\n⑤ keys 里任何一项都不能含空格，一项一个词。**keys 必须包含角色名本身**（这是触发她的关键），再加 1~2 个昵称或别称。\n\n【关系是硬要求 · 关系到她能不能自然出场】\n- rel_user 必须写具体：不是「陌生人」「路过的人」，而是「同一栋楼的邻居，常在楼下碰见」这种\n- rel_list 至少要有一个具体的人，who 必须是「已存在」名单里的名字\n- how 要写清「这个人为什么会提到她」，例如：同事、同学、母子、老邻居\n- 如果素材里她跟谁都不认识，就给她安排一个既有的连接点（同一个单位、同一栋楼、同一条街），\n  不要写成孤立的人 —— 孤立的人没法被自然地提及\n\n【三条的边界，不要写重】\n- 角色卡 = 人设：基调、身份、背景、性格、语言、习惯动作。外貌只写发型面部、日常服饰、标志物，\n  以及一句整体轮廓（如丰腴、纤细），不写尺寸、不写私处。\n- 身体配置 = 身体：尺寸、形状、质感、私处、非人形态。所有身体细节都写在这里。\n- 性癖档案 = 性：敏感带、弱点、偏好、癖好、技巧。不重复身体配置里的数字。\n\n【关于 body（第2条·身体配置）】\n1:1 复刻下面这个格式，字段一个都不能少：\n<body_configuration character=\"名字\">\n整体身材: - 类型: [...]        整体比例: - 比例: [...]\n胸部: - 尺寸 / 形状 / 乳头与乳晕\n腰部: - 特征 / 腰臀比          臀部: - 形状 / 质感\n私处: - 小穴(毛发/形态/颜色/敏感度/名器说法/特征) - 菊穴(形态/颜色/名器说法/特征)\n腿部: - 形态                  肌肉线条: - 清晰度 / 分布\n其他体态特征: - 皮肤颜色 / 皮肤质感 / 皮肤特征 / 体态\n半妖形态: - 姿态名称 / 具体显化 / 整体气场   （纯人类角色写「无」，不要编造非人形态）\n</body_configuration>\n\n【关于 sex（第3条·性癖档案）】\n1:1 复刻下面这个格式：\n<sexual_profile character=\"名字\">\n性标签(总结性): \"[...]\"\nA. 敏感带: 敏感度评级 + 6 个部位（耳垂与颈部/背部与脊柱沟/胸部/腰腹与侧腹/大腿内侧/私密地带），每条写「等级 - 说明」\nB. 性弱点: 主要生理弱点 + 刺激方式 / 次要生理弱点 + 刺激方式 / 精神言语弱点 + 触发词句 + 触发反应\nC. 性格与偏好: NSFW场景表现 + 主动被动倾向 + 表达方式 + 喜好的性风格(节奏/氛围) + 喜好的性姿势(2~3 个)\nD. 特殊癖好: 接受度评级 + 6 项左右（每项标 仅幻想/愿意尝试/喜爱/痴迷）\nE. 特殊性技巧: 1~2 个，每个写 技巧名称 + 技巧效果\n</sexual_profile>\n\n写这两条时要结合本角色的种族、权能、体型来设计，不要写成通用模板。\n【关于 appear（第4条·出场时机）· 非常重要】\n这一条决定新角色能不能自然出场。不要写成时间轴，写成【介入机会】：\n- hooks：给 4~6 个「信号 → 她怎么出现」，signal 是正文里可能出现的场景、物件、话题、或别人的一句话\n- 不要出现具体时刻（07:30 这类），因为那是主角的行程，不是她的\n- threads：她能挂靠到哪些既有事件线上（例如：便利店夜班 ←→ 主角深夜买东西）\n- presence：她不在场时怎么被感知（群消息、传闻、留下的东西）\n- rules：在场硬约束（每轮最多 3 人在场、只 1 个主场）\n- appearKeys 必须是【场景词】不是她的名字：便利店、收银台、夜班、巷口\n- dispatch：只写一行，会追加进世界书里共用的「出场调度表」。格式：场景信号 → 名字（定位；可由谁带进来）\n  例：便利店夜班 → 佐野澪（收银台后先抬眼；可由秦丽提起）\n【输出：严格 JSON，不要代码块，字段一个都不能少】\n{\n \"position\": {\"race\":\"\",\"relation\":\"\",\"informed\":\"\",\"timing\":\"\",\"tone\":\"\"},\n \"character\": {\n   \"name\": \"\",\n   \"nickname\": \"昵称1, 昵称2\",\n   \"tone\": \"一个定位词——一句说明\",\n   \"gender\": \"\", \"age\": \"\", \"race\": \"\", \"job\": \"\", \"tags\": \"三个短标签, 逗号分隔\",\n   \"rel_user\": \"与{{user}}的关系\",\n   \"informed\": \"知道什么、不知道什么\",\n   \"timing\": \"什么场景时段会自然出现\",\n   \"rel_list\": [{\"who\": \"必须是「已存在」名单或主角身边出现过的人里的名字\", \"how\": \"关系一句话，要能说明她为什么会被这个人提起\"}],\n   \"bg_origin\": \"出身，一段\",\n   \"bg_residence\": \"居住，一段\",\n   \"bg_exp1_title\": \"\", \"bg_exp1_text\": \"\",\n   \"bg_exp2_title\": \"\", \"bg_exp2_text\": \"\",\n   \"bg_exp3_title\": \"\", \"bg_exp3_text\": \"\",\n   \"ap_body\": \"身形与体格\",\n   \"ap_face\": \"发型与面部\",\n   \"ap_clothes\": \"日常服饰\",\n   \"ap_mark\": \"标志物\",\n   \"ap_habits\": \"2~3 个下意识小动作\",\n   \"sp_pace\": \"语速与音量\",\n   \"sp_quirk\": \"口癖\",\n   \"sp_call\": \"如何称呼{{user}}\",\n   \"sp_ex1\": \"台词\", \"sp_ex2\": \"台词\", \"sp_ex3\": \"台词\",\n   \"pe_surface\": \"别人看到的\",\n   \"pe_inner\": \"实际驱动的\",\n   \"pe_bottom\": \"什么情况下会翻脸或退缩\",\n   \"core\": [{\"tag\":\"行为内核名\",\"desc\":\"一段说明\"}],\n   \"traces\": [\"场景细节1\",\"场景细节2\",\"场景细节3\"]\n },\n \"body\": {\n   \"type\":\"整体类型\",\"ratio\":\"整体比例\",\"chest_size\":\"尺寸如38G\",\"chest_shape\":\"形状\",\"nipple\":\"乳头与乳晕\",\n   \"waist\":\"腰部特征\",\"whr\":\"腰臀比\",\"hip_shape\":\"臀形\",\"hip_texture\":\"臀部质感\",\n   \"pube\":\"毛发\",\"vulva_shape\":\"小穴形态\",\"vulva_color\":\"小穴颜色\",\"vulva_sensitivity\":\"小穴敏感度\",\"vulva_name\":\"名器说法\",\"vulva_feature\":\"小穴内部特征\",\n   \"anus_shape\":\"菊穴形态\",\"anus_color\":\"菊穴颜色\",\"anus_name\":\"菊穴名器说法\",\"anus_feature\":\"菊穴特征\",\n   \"legs\":\"腿部形态\",\"muscle_clarity\":\"肌肉清晰度\",\"muscle_spread\":\"肌肉分布\",\n   \"skin_color\":\"皮肤颜色\",\"skin_texture\":\"皮肤质感\",\"skin_feature\":\"皮肤特征\",\"posture\":\"体态\",\n   \"demi_name\":\"非人形态的姿态名称（人类角色填无）\",\"demi_manifest\":\"具体显化\",\"demi_aura\":\"整体气场\"\n },\n \"sex\": {\n   \"tag\":\"性标签（一句话总结）\",\n   \"sensitive\":[{\"part\":\"耳垂与颈部\",\"level\":\"高\",\"desc\":\"为什么敏感\"}],\n   \"weak_main\":\"主要生理弱点\",\"weak_main_how\":\"刺激方式\",\n   \"weak_sub\":\"次要生理弱点\",\"weak_sub_how\":\"刺激方式\",\n   \"weak_mind\":\"精神/言语弱点\",\"weak_mind_trigger\":\"触发词句/情景\",\"weak_mind_reaction\":\"触发反应\",\n   \"nsfw_behavior\":\"NSFW场景表现\",\"active_passive\":\"主动/被动倾向\",\"express\":\"表达方式\",\n   \"rhythm\":\"喜欢的节奏\",\"atmosphere\":\"喜欢的氛围\",\n   \"positions\":[{\"name\":\"姿势名\",\"why\":\"为什么喜欢\"}],\n   \"kinks\":[{\"name\":\"癖好名\",\"level\":\"仅幻想/愿意尝试/喜爱/痴迷\"}],\n   \"skills\":[{\"name\":\"技巧名称\",\"effect\":\"技巧效果\"}]\n }, },\n \"guide\": [{\"name\":\"行为路线短名\",\"trigger\":\"触发条件\",\"action\":\"动作表现\",\"detail\":\"重点细节\"}],\n \"appear\": {\"hooks\":[{\"signal\":\"正文出现什么信号（场景/物件/话题/别人的一句话）\",\"how\":\"她怎么出现\",\"first\":\"她的第一反应\",\"turn\":\"可能往哪儿走\"}],\"threads\":[\"可以挂靠的现有事件线\"],\"presence\":[\"她不在场时怎么被感知\"],\"rules\":[\"在场硬约束\"],\"never\":\"什么情况下她绝对不会出现\"},\n \"appearKeys\": [\"场景词1\",\"场景词2\"],\n \"dispatch\": \"一行，格式：场景信号 → 名字（一句话定位；可由谁带进来）\",\n \"keys\": [\"角色名\",\"昵称\"],\n \"coreUpdates\": [{\"entry\":\"人物关系速览\",\"change\":\"要追加的一行\"}],\n \"warnings\": [\"说明\"]\n}";

const DETECT_SYSTEM = "你是「新人物探测器」。读一段角色扮演正文，找出应该被做成世界书角色的人物。\n\n【要求】\n1. 只列真正作为人物出现过的（有称呼、有动作、有对话），不要列地点、物品、组织。\n2. 排除这些已经在世界书里的人：<已存在>\n3. 排除 {{user}} 和纯泛指的路人（「有人」「路人」这种没有任何指代信息的）。\n4. 有些人只被身份指代、整段没出现名字，例如「那个店员」「老太太」「穿和服的女人」「管理员的老婆」。\n   这类也要列出来：\n   - name 填最简短的指代（4 字以内，如「店员」「老太太」）\n   - alias 填正文里用过的其他说法（数组，如 [\"收银员\",\"那个女孩\"]）\n   - unnamed 填 true\n5. 有名字的人 unnamed 填 false，alias 填昵称或别的叫法（没有就给空数组）。\n6. 每个人给一句为什么值得做成角色。\n\n【输出】严格 JSON，不要代码块：\n{\"candidates\":[{\"name\":\"\",\"alias\":[],\"unnamed\":false,\"reason\":\"\",\"confidence\":\"high|medium|low\"}],\n \"director\":{\"name\":\"\",\"why\":\"\"}}\n\n【director 字段 · 顺带判断谁该出场】\n如果输入里给了 <可出场> 列表，从中挑一个最适合在本轮正文里出现的人。\n- 只挑场景真的对得上的：他走进厨房，就挑常在厨房的人；没对上就填空字符串\n- 不要为了让人出场而硬凑，空着是正常结果\n- name 必须和 <可出场> 列表里的名字完全一致\n- 本轮已经在场、或刚刚才出现过的，不要选\n- why 写一句话理由，引用正文里的具体细节\n";

const DEFAULTS = {
    targetBook: '', source: 'chat', name: '', idea: '', backups: {},
    // API 配置（独立于酒馆主 API）
    apiMode: 'custom',          // custom = 用自己的端点；main = 跟随酒馆主 API
    transport: 'server',        // server = 酒馆服务器中转（推荐）；browser = 浏览器直连
    apiUrl: 'https://api.deepseek.com',
    apiKey: 'sk-c2e9944ab038426b96969f39ac5c4113',
    model: 'deepseek-flash',
    maxTokens: 6000,
    temperature: 0.7,
    headers: 'x-opencode-session: auto-char-ext',
    autoGenerate: true,
    autoWrite: false,      // 生成后直接写入，不审核
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
    dirScan: {},              // LLM 扫世界书的缓存（按书 + 指纹）
    autoScan: true,            // 正则一条都认不出时，自动用 LLM 扫一次

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
function settings() {
    const holder = store();
    if (!holder[MODULE]) holder[MODULE] = structuredClone(DEFAULTS);
    const s = holder[MODULE];
    for (const k of Object.keys(DEFAULTS)) if (s[k] === undefined) s[k] = structuredClone(DEFAULTS[k]);
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

async function callLLM(prompt) {
    const s = settings();
    if (s.apiMode === 'main') {
        const raw = await ctx.generateQuietPrompt({ quietPrompt: prompt, responseLength: s.maxTokens, removeReasoning: true });
        return String(raw || '');
    }

    let base = apiBase();
    if (!base) throw new Error('还没填端点 URL');

    // ── 通道一：走酒馆服务器中转（绕开浏览器跨域/代理问题） ──
    if (s.transport !== 'browser') {
        const sid = await ensureSecret();

        const res = await fetch('/api/backends/chat-completions/generate', {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({
                chat_completion_source: 'custom',
                custom_url: base,
                custom_include_headers: resolveHeaders(),
                secret_id: sid || undefined,
                model: s.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: Number(s.maxTokens) || 6000,
                temperature: Number(s.temperature) || 0.7,
                stream: false,
            }),
        });
        const text = await res.text();
        let j = null;
        try { j = JSON.parse(text); } catch (e) { }
        if (j && j.error) throw new Error(friendlyNetError('端点报错：' + (j.error.message || JSON.stringify(j.error).slice(0, 200))));
        if (!res.ok) throw new Error(friendlyNetError('HTTP ' + res.status + ' ' + text.slice(0, 200)));
        const ch = j?.choices?.[0]?.message;
        if (!ch) throw new Error('返回里没有内容：' + text.slice(0, 200));
        return String(ch.content || ch.reasoning_content || '');
    }

    // ── 通道二：浏览器直连（要求端点允许跨域） ──
    base += '/chat/completions';

    const body = {
        model: s.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: Number(s.maxTokens) || 6000,
        temperature: Number(s.temperature) || 0.7,
    };
    let res;
    try {
        res = await fetch(base, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(s.apiKey || '').trim(),
            },
            body: JSON.stringify(body),
        });
    } catch (e) {
        throw new Error('连不上端点（可能是跨域被拦截，或 URL 写错）：' + (e.message || e));
    }
    const text = await res.text();
    if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + text.slice(0, 200));
    let j;
    try { j = JSON.parse(text); } catch { throw new Error('返回的不是 JSON：' + text.slice(0, 160)); }
    const choice = j.choices?.[0]?.message;
    return String(choice?.content || choice?.reasoning_content || '');
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
const state = { autoScanBusy: false, bookFix: null, bookFixUndo: null, tab: 'add', plan: null, books: [], candidates: [], detecting: false, detectedFor: '', detectError: '', drafts: [], genBusy: false, curAlias: [], existingNames: new Set(), updateChars: [], updateChar: null, updatePlan: null, updateDiff: null };

// ── 手动检测（只找人不生成） ─────────────────────
async function detectCandidates(force) {
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
        const recent = dp.pool.map(m => String(m.mes || m.message || '')).filter(Boolean).join(NL2).slice(0, 12000);
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
        state.existingNames = new Set();
        if (useBook) {
            try {
                const d = await getBook(useBook);
                const es = Object.values(d.entries || {});
                for (const e of es) {
                    const c = String(e.comment || '');
                    if (/^(TavernDB|AUTO-)/.test(c)) continue;
                    state.existingNames.add(c);
                    for (const k of (e.key || [])) state.existingNames.add(String(k));
                }
            } catch (e) { console.warn('[命运织机] 读世界书失败，无法排除已有角色', e); }
        }
        // 当前角色卡和 persona 也算已有
        try {
            const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
            if (ch && ch.name) state.existingNames.add(String(ch.name));
            const _lc4 = live(); if (_lc4.name2) state.existingNames.add(String(_lc4.name2));
        } catch (e) { /* ignore */ }
        for (const dr of (state.drafts || [])) if (dr.name) state.existingNames.add(String(dr.name));
        const existing = [...state.existingNames].slice(0, 200).join('、');

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

        const prompt = activeDetect().replace('<已存在>', existing || '（无）') + NL2 + genderRule() + NL2 +
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
        state.candidates = ((jj && jj.candidates) || [])
            .filter(c => c && c.name && String(c.name).trim().length <= 12)
            .filter(c => {
                const n = String(c.name).trim();
                if (!n) return false;
                if (state.existingNames.has(n)) return false;
                for (const x of state.existingNames) { if (x && x.indexOf(n) >= 0) return false; }
                return true;
            })
            .slice(0, 10)
            .map(c => ({ name: String(c.name).trim(), alias: Array.isArray(c.alias) ? c.alias.map(String) : [], unnamed: !!c.unnamed, reason: String(c.reason || ''), confidence: String(c.confidence || 'medium') }));
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
    const cache = await refreshDirCache(book);
    const data = await getBook(book);
    const es = Object.values(data.entries || {});
    const scanChars = (((settings().dirScan || {})[book] || {}).chars) || [];

    const out = [];
    for (const ch of ((cache && cache.chars) || [])) {
        const n = ch.name;
        const scanHit = scanChars.find(function (x) { return x && x.name === n; });
        const llmEntries = (scanHit && Array.isArray(scanHit.entries)) ? scanHit.entries.map(String) : [];
        // 把条目名还原成「主名」：去掉 角色卡 / NSFW档案 前缀和 _行为落地指南 后缀
        const subjOf = function (c) {
            let s2 = String(c || "").replace(/^(?:角色卡|NSFW档案|身体配置|性癖档案)\s*/, "");
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
            // 互相包含也算同一个（夏梦 ↔ 魅魔母亲夏梦）
            if (sj.indexOf(n) >= 0 || n.indexOf(sj) >= 0) return true;
            // 「柳玉性格补充」「浅草-猫妖-（人设核心）」这类：名字后面跟分隔符
            if (c.length > n.length && c.indexOf(n) === 0 && /^[\s_\-—（(【\[]/.test(c.slice(n.length))) return true;
            return false;
        });
        if (!mine.length) continue;
        out.push({
            name: n,
            count: mine.length,
            chars: mine.reduce(function (a, e) { return a + String(e.content || "").length; }, 0),
            entries: mine.map(function (e) { return { comment: String(e.comment), content: String(e.content || ""), keys: e.key || [] }; }),
        });
    }
    return out.sort(function (a, b) { return a.name.localeCompare(b.name, "zh"); });
}
// ── 对话结束后自动检测 + 生成 ─────────────────────
let autoTimer = null;
let autoBusy = false;

function scheduleAuto() {
    if (!settings().autoGenerate) return;
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = setTimeout(() => { autoRun(); }, 2500);
}

async function autoRun() {
    if (autoBusy) return;
    if (!settings().autoGenerate) return;
    const dp = detectPool();

    autoBusy = true;
    try {
        const book = effectiveBook() || state.books[0];
        if (!book) return;

        // 1) 找候选人
        const d = await getBook(book);
        const es = Object.values(d.entries || {});
        const known = new Set();
        for (const e of es) {
            const c = String(e.comment || '');
            if (!/^(TavernDB|AUTO-)/.test(c)) known.add(c);
            for (const k of (e.key || [])) known.add(String(k));
        }
        for (const dr of (state.drafts || [])) known.add(dr.name);

        const recent = dp.pool.map(m => String(m.mes || m.message || '')).filter(Boolean).join(NL2).slice(0, 12000);
        if (!recent.trim()) return;

        const prompt = activeDetect().replace('<已存在>', [...known].slice(0, 150).join('、') || '（无）') + NL2 + genderRule() + NL2 + '===== 正文 =====' + NL2 + recent;
        const raw = await callLLM(prompt);
        const jj = parseLoose(raw);
        const cands = ((jj && jj.candidates) || [])
            .filter(c => c && c.name && String(c.name).trim().length <= 12)
            .filter(c => !known.has(String(c.name).trim()))
            .slice(0, 2);
        markDetect();
        if (!cands.length) return;

        // 2) 直接生成模板
        state.genBusy = true;
        const prog = toastProgress('检测到 ' + cands.length + ' 个新人物，正在生成模板…');
        if (state.tab === 'add') render();

        for (let ci = 0; ci < cands.length; ci++) {
            const c = cands[ci];
            const nm = String(c.name).trim();
            prog.acUpdate('正在生成模板：' + nm + '（' + (ci + 1) + '/' + cands.length + '）');
            state.drafts = state.drafts || [];
            try {
                const plan = await generatePlan({ book, name: nm, aliases: c.alias, idea: settings().idea, source: 'chat' });
                if (settings().autoWrite) {
                    prog.acUpdate('世界书条目更新中：' + nm);
                    const r = await writePlan(book, plan);
                    state.drafts.unshift({ name: nm, plan, t: Date.now(), written: r });
                } else {
                    state.drafts.unshift({ name: nm, plan, t: Date.now() });
                }
                state.drafts = state.drafts.slice(0, 5);
            } catch (e) {
                state.drafts.unshift({ name: nm, error: e.message || String(e), t: Date.now() });
                state.drafts = state.drafts.slice(0, 5);
            }
        }
        state.genBusy = false;
        const good = (state.drafts || []).filter(x => x.plan);
        const wrote = good.filter(x => x.written).length;
        if (settings().autoWrite) {
            prog.acDone(wrote ? ('世界书更新完毕：已写入 ' + wrote + ' 个角色') : '世界书未更新：全部失败');
        } else {
            prog.acDone(good.length ? ('模板已生成 ' + good.length + ' 个，等你审核') : '没有可生成的人物');
        }
        if (good.length) toast(settings().autoWrite
            ? '已自动写入 ' + good.filter(x => x.written).length + ' 个角色：' + good.filter(x => x.written).map(x => x.name).join('、')
            : '检测到 ' + good.length + ' 个可添加人物，模板已生成：' + good.map(x => x.name).join('、'),
            () => { state.tab = 'add'; render(); });
        if (state.tab === 'add') render();
    } catch (e) {
        state.genBusy = false;
        console.warn('[命运织机] 自动检测失败', e);
    } finally {
        autoBusy = false;
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
          <div class="title">yek命运织机</div>
          <button class="hbtn" id="ac-close" title="关闭面板"><i class="fa-solid fa-xmark"></i><span>关闭</span></button>
        </div>
        <div id="ac-body">
          <div id="ac-side">
            <div class="g">主功能</div>
            <div class="it" data-tab="add">添加角色</div>
            <div class="it" data-tab="update">更新角色</div>
            <div class="it" data-tab="director">出场导演</div>
            <div class="it" data-tab="api">API 配置</div>
            <div class="it" data-tab="overview">概览</div>
            <div class="g">数据</div>
            <div class="it" data-tab="backups">备份</div>
            <div class="g">高级</div>
            <div class="it" data-tab="prompt" id="ac-tab-prompt" style="display:none">提示词</div>
            <div class="it" id="ac-advanced">切换到高级模式</div>
          </div>
          <div id="ac-main"></div>
        </div>
      </div>`;
    document.body.appendChild(o);
    $('ac-close').addEventListener('click', closePanel);
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

function openPanel() {
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
    state.tab = 'add';
    render();
    detectCandidates(false);
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
function renderInner() {
    const adv = !!settings().advanced;
    const pt = $('ac-tab-prompt');
    if (pt) pt.style.display = adv ? '' : 'none';
    const ab = $('ac-advanced');
    if (ab) ab.textContent = adv ? '退出高级模式' : '切换到高级模式';
    if (!adv && state.tab === 'prompt') state.tab = 'add';
    document.querySelectorAll('#ac-side .it[data-tab]').forEach(it => it.classList.toggle('on', it.dataset.tab === state.tab));
    const m = $('ac-main');
    if (state.tab === 'add') m.innerHTML = viewAdd();
    if (state.tab === 'overview') { m.innerHTML = viewOverview(); refreshOverview(); return; }
    if (state.tab === 'backups') { m.innerHTML = viewBackups(); wireBackups(); return; }
    if (state.tab === 'update') {
        m.innerHTML = '<h2>更新角色</h2><div class="ac-card"><div class="ac-empty">读取中…</div></div>';
        viewUpdate().then(function (html) {
            if (state.tab !== 'update') return;
            m.innerHTML = html;
            wireUpdate();
        }).catch(function (e) {
            m.innerHTML = '<div class="ac-card"><div class="h">读取失败</div><div class="ac-warn">' + esc(e.message || e) + '</div></div>';
        });
        return;
    }
    if (state.tab === 'director') {
        m.innerHTML = viewDirector();
        wireDirector();
        if (!state.dirCache) { refreshDirCache().then(function () { if (state.tab === 'director') render(); }).catch(function () {}); }
        return;
    }
    if (state.tab === 'api') { m.innerHTML = viewApi(); wireApi(); return; }
    if (state.tab === 'prompt') { m.innerHTML = viewPrompt(); wirePrompt(); return; }
    wireAdd();
}

function viewAdd() {
    const s = settings();
    const cv = state.candidates || [];
    const dr = state.drafts || [];
    const okDrafts = dr.filter(x => x.plan);
    const banner = (function () {
        let h = '';
        if (state.genBusy) {
            h += '<div class="ac-card"><div class="h">检测到新人物，正在生成模板…</div></div>';
        } else if (okDrafts.length) {
            h += '<div class="ac-card"><div class="h">检测到 ' + okDrafts.length + ' 个可添加人物（模板已生成）' +
                '<span class="i" style="cursor:pointer" id="ac-redetect">重新检测</span></div>';
            h += okDrafts.map((x, i) =>
                '<div class="ac-draft"><span class="tag">已生成</span><span class="nm">' + esc(x.name) + (x.unnamed ? ' <span class="tag">未命名</span>' : '') + '</span>' +
                '<button class="ac-btn" data-load="' + i + '">查看/编辑</button></div>').join('');
            const errs = dr.filter(x => x.error);
            if (errs.length) h += errs.map(x => '<div class="ac-warn">⚠ ' + esc(x.name) + ' 生成失败：' + esc(x.error) + '</div>').join('');
            h += '<div class="hint">点「查看/编辑」把模板载入下面的编辑区。</div></div>';
        } else if (state.detecting) {
            h += '<div class="ac-card"><div class="h">正在检测可添加人物…</div></div>';
        } else if (state.detectError) {
            h += '<div class="ac-card"><div class="h">检测失败</div><div class="ac-warn">' + esc(state.detectError) + '</div></div>';
        } else if (cv.length) {
            h += '<div class="ac-card"><div class="h">检测到 ' + cv.length + ' 个可添加人物' +
                '<span class="i" style="cursor:pointer" id="ac-redetect">重新检测</span></div>';
            h += cv.map(c => '<div class="ac-row" data-cand="' + esc(c.name) + '" data-alias="' + esc((c.alias || []).join('、')) + '">' +
                '<span class="c">' + esc(c.name) +
                (c.unnamed ? ' <span class="tag">未命名</span>' : '') +
                (c.confidence === 'high' ? ' <span class="dot">●</span>' : '') + '</span>' +
                '<span class="n">' + esc(c.reason).slice(0, 40) + '</span></div>').join('');
            h += '<div class="hint">点一个名字，自动填进下面的「人物名」。</div></div>';
        }
        return h;
    })();    const xpHtml = (function () {
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
            <span>对话结束后自动检测并生成模板</span>
          </label>
          <div class="hint">每轮回复结束自动扫描，检测到新人就把模板生成好。</div>

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
        s.targetBook = v; persist();
        $('ac-bookstate').innerHTML = '当前写入目标：<b>' + esc(v) + '</b>';
        setMsg('已切换到「' + v + '」', 'ok');
        toast('写入目标已切换为「' + v + '」');
    });
    $('ac-bookreload')?.addEventListener('click', async () => {
        const btnEl = $('ac-bookreload');
        if (btnEl) btnEl.textContent = '…';
        try {
            state.books = await listBooks();
            if (!s.targetBook && state.books.length) s.targetBook = state.books[0];
            persist();
            render();
            setMsg('已读取到 ' + state.books.length + ' 本世界书', 'ok');
        } catch (e) { setMsg('读取失败：' + e.message, 'err'); }
    });
    document.querySelectorAll('[data-cand]').forEach(row => row.addEventListener('click', () => {
        const nm = row.dataset.cand;
        state.curAlias = (row.dataset.alias || '').split('、').map(x => x.trim()).filter(Boolean);
        if ($('ac-name')) { $('ac-name').value = nm; s.name = nm; persist(); }
        if (state.curAlias.length) setMsg('已填入「' + nm + '」，素材会同时搜：' + state.curAlias.join('、'), 'ok');
    }));
    $('ac-redetect')?.addEventListener('click', () => detectCandidates(true));
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
function buildBodyYaml(b, name) {
    if (!b) return '';
    const L = [];
    const put = function (indent, k, v) { if (v !== undefined && v !== null && String(v).trim()) L.push(indent + k + ': [' + String(v).trim() + ']'); };
    L.push('<body_configuration character="' + Y(name) + '">');
    L.push('整体身材:'); put('  - ', '类型', b.type);
    L.push(''); L.push('整体比例:'); put('  - ', '比例', b.ratio);
    L.push(''); L.push('胸部:');
    put('  - ', '尺寸', b.chest_size); put('  - ', '形状', b.chest_shape); put('  - ', '乳头与乳晕', b.nipple);
    L.push(''); L.push('腰部:'); put('  - ', '特征', b.waist); put('  - ', '腰臀比', b.whr);
    L.push(''); L.push('臀部:'); put('  - ', '形状', b.hip_shape); put('  - ', '质感', b.hip_texture);
    L.push(''); L.push('私处:');
    L.push('  - 小穴:');
    put('    - ', '毛发', b.pube); put('    - ', '形态', b.vulva_shape); put('    - ', '颜色', b.vulva_color);
    put('    - ', '敏感度', b.vulva_sensitivity); put('    - ', '名器说法', b.vulva_name); put('    - ', '特征', b.vulva_feature);
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
    const out = [
        { comment: "角色卡 " + nm, content: buildCharacterYaml(c), keys, constant: false },
        { comment: "身体配置 " + nm, content: (plan.bodyText && plan.bodyText.trim()) ? plan.bodyText : buildBodyYaml(plan.body || {}, nm), keys, constant: false },
        { comment: "性癖档案 " + nm, content: (plan.sexText && plan.sexText.trim()) ? plan.sexText : buildSexYaml(plan.sex || {}, nm), keys, constant: false },
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
    const map = [LEN.char, LEN.body, LEN.sex, LEN.guide, LEN.appear];
    const out = [];
    ents.forEach((e, i) => {
        const n = charCount(e.content);
        const [lo, hi] = map[i] || [0, 99999];
        const bad = n < lo || n > hi;
        out.push({ name: e.comment, n, lo, hi, bad, no: n < lo });
    });
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
    const traitText = (n.traits || []).join('\n');
    const willText = (n.willSay || []).join('\n');

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
    const s = settings();
    const book = $('ac-book') ? $('ac-book').value : s.targetBook;
    const name = $('ac-name') ? $('ac-name').value.trim() : '';
    const idea = $('ac-idea') ? $('ac-idea').value.trim() : '';
    if (!book) return setMsg('没有可选的世界书');
    if (s.source === 'chat' && !name) return setMsg('请填人物名');

    setMsg('分析中…这一步要几十秒');
    if ($('ac-analyze')) $('ac-analyze').disabled = true;
    state.plan = null;
    renderResult();

    try {
        const plan = await generatePlan({ book, name, aliases: state.curAlias, idea, source: s.source });
        state.plan = plan;
        renderResult();
        setMsg('分析完成，检查后点下面的「写入世界书」', 'ok');
    } catch (e) {
        setMsg('失败：' + (e.message || e), 'err');
    } finally {
        if ($('ac-analyze')) $('ac-analyze').disabled = false;
    }
}

// 生成一份模板（分析 / 自动检测都用它）
async function generatePlan(opt) {
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
    const existing = Object.values(entries).map(e => String(e.comment || '')).join('、');
    const coreInfo = CORE_NAMES.map(nm => {
        const e = Object.values(entries).find(x => String(x.comment) === nm);
        return e ? ('### ' + nm + '\n' + String(e.content).slice(0, 800)) : ('### ' + nm + '\n(不存在)');
    }).join(NL2);

    const prompt = [
        activeSystem(), '', '===== 输入 =====', sourceBlock, '',
        '【目标世界书已有条目名（避免重名）】' + existing.slice(0, 1500), '',
        '【六条核心条目当前内容】', coreInfo, '',
        xpRule(xps),
        genderRule(),
        '【字数要求】三条都要写足：角色卡 ' + LEN.char[0] + '~' + LEN.char[1] + ' 字，NSFW档案 ' + LEN.nsfw[0] + '~' + LEN.nsfw[1] + ' 字，行为落地指南 ' + LEN.guide[0] + '~' + LEN.guide[1] + ' 字（按中文字符计）。',
        '低于下限说明内容太薄，要补细节；超过上限要压缩。宁可具体，不要空话。',
        existingEntries.length ? ('【该角色在世界书里的现有设定（请在此基础上更新，不要推翻和正文一致的部分）】\n' +
            existingEntries.map(function (e) { return '### ' + e.comment + '\n' + String(e.content || '').slice(0, 3000); }).join('\n\n')) : '',
        existingEntries.length ? '请在现有设定上更新，保留仍然成立的内容，补充新出现的细节，输出完整的新版本。' : '',
        '请把「' + targetName + '」做成本世界里一个正式角色，严格按 JSON 模板输出。',
    ].join('\n');

    let plan = null, lastErr = '模型没有返回可解析的 JSON';
    for (let i = 0; i < 3 && !plan; i++) {
        let raw = '';
        try { raw = await callLLM(prompt); } catch (e) { lastErr = e.message || String(e); break; }
        const p = parseLoose(raw);
        if (p && (p.character || p.entries)) plan = p;
    }
    if (!plan) throw new Error(lastErr);

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
    return { added, updated, coreChanged, missing: [...new Set(missing)], appear: appearChanged, edited, name: (plan.character || {}).name || '' };
}

// ── 写入 ─────────────────────────────────────────
async function doWrite() {
    collectPlan();
    const s = settings();
    const book = $('ac-book') ? $('ac-book').value : s.targetBook;
    if (!state.plan) return setMsg('先分析', 'err', 'ac-msg2');

    setMsg('写入中…', '', 'ac-msg2');
    const prog = toastProgress('世界书条目更新中…');
    try {
        const r = await writePlan(book, state.plan);
        prog.acDone('世界书更新完毕：新增 ' + r.added + ' 条' + (r.updated ? '，更新 ' + r.updated + ' 条' : ''));
        const lw = checkLengths(state.plan).filter(x => x.bad).map(x => x.name + ' ' + x.n + '字');
        const lengthWarn = lw.length ? '（字数偏离目标：' + lw.join('、') + '）' : '';
        if (r.edited && r.edited.length) toast('注意：' + r.edited.length + ' 条是你手改过的，已被覆盖：' + r.edited.join('、'), null, 12000);
        setMsg('已写入「' + book + '」：新增 ' + r.added + ' · 更新 ' + r.updated + ' · 改核心 ' + r.coreChanged +
            (r.missing.length ? '（跳过不存在的核心条目：' + r.missing.join('、') + '）' : '') + lengthWarn, 'ok', 'ac-msg2');
        if ($('ac-write')) $('ac-write').disabled = true;
        state.drafts = (state.drafts || []).filter(d => d.name !== r.name);
        render();
    } catch (e) {
        prog.acDone('写入失败：' + (e.message || e), 8000);
        setMsg('写入失败：' + (e.message || e), 'err', 'ac-msg2');
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
      <div class="ac-card"><div class="h">环境</div>
        <div class="ac-stat" id="ac-stat"><div><div class="k">世界书</div><div class="v">…</div></div></div>
      </div>
      <div class="ac-card"><div class="h">当前</div>
        <div class="ac-pos" id="ac-cur">读取中…</div>
      </div>`;
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
          <div class="hint">只存在你自己的酒馆设置里，不会外传。</div>
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
        out.textContent = '测试中…';
        try {
            const r = await callLLM('只回复两个字：可以');
            out.textContent = '✅ 连接成功\n\n返回：' + String(r).slice(0, 300);
        } catch (e) {
            out.textContent = '❌ 失败\n\n' + (e.message || e);
        }
    });
}

// ── 更新已有角色 ─────────────────────────────────
async function viewUpdate() {
    const book = effectiveBook() || state.books[0];
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
        '<div class="hint">当前这本里找到 ' + chars.length + ' 个角色。</div></div>';

    h += '<div class="ac-card"><div class="h">选择要更新的角色</div>';
    const anyYaml = chars.some(function (c) { return (c.entries || []).some(function (e) { return /<character>|<NSFW档案>|^character:/m.test(String(e.content || '')); }); });
    if (!chars.length) h += '<div class="ac-empty">这本书里没认出任何角色。<br>去「出场导演」页点「LLM 扫描角色」，或手动加名字再回来。</div>';
    else {
        if (!anyYaml) h += '<div class="hint" style="color:#ffd479;margin-bottom:10px">认出的 ' + chars.length +
            ' 个用的是手写条目，不是织机格式。选中一个人 → 点下面的「升级成织机格式」，以她现在的条目当素材重新生成 4 条标准条目（原文不动）。</div>';
        h += chars.map(function (c) {
            return '<div class="ac-row ac-upick" data-name="' + esc(c.name) + '">' +
                '<span class="c">' + (c.name === picked ? '<span class="dot">●</span> ' : '') + esc(c.name) + '</span>' +
                '<span class="n">' + c.count + ' 条 · ' + c.chars + ' 字</span></div>';
        }).join('');
    }
    h += '</div>';

    if (picked) {
        h += '<div class="ac-card"><div class="h">重新分析「' + esc(picked) + '」</div>' +
            '<div class="hint" style="margin-bottom:10px">会先收集正文里她的描写，再结合她现有的设定，生成更新版。</div>' +
            '<button class="ac-btn pri" id="ac-upd-run">重新分析</button>' +
            '<button class="ac-btn" id="ac-upd-upgrade" style="margin-left:8px">升级成织机格式</button>' +
            '<div class="ac-msg" id="ac-upd-msg"></div></div>';
    }

    if (state.updateDiff && state.updateDiff.length) h += renderUpdateDiff();

    return h;
}

function renderUpdateDiff() {
    const rows = state.updateDiff.map(function (d, i) {
        const dt = d.newLen - d.oldLen;
        const sign = dt > 0 ? '+' : '';
        return '<div class="ac-ec">' +
            '<div class="h"><input type="checkbox" class="ac-uck" data-i="' + i + '"' + (d.take ? ' checked' : '') + ' />' +
            '<span>' + esc(d.comment) + '</span>' +
            '<span class="len">' + d.oldLen + ' → ' + d.newLen + ' 字（' + sign + dt + '）</span></div>' +
            (d.edited ? '<div class="ac-warn" style="margin-top:6px">⚠ 这条你手改过，更新会覆盖掉你的修改（可在「备份」页撤销）</div>' : '') +
            '<div style="font-size:12px;color:#6f8080;margin-top:6px;">' + (d.take ? '将更新为新版' : '保留原版') + '</div>' +
            '</div>';
    }).join('');

    return '<div class="ac-card"><div class="h">对比 <span class="i">勾选要更新的条目</span></div>' +
        rows +
        '<button class="ac-btn pri big" id="ac-upd-apply" style="margin-top:12px;">应用更新</button>' +
        '<div class="ac-msg" id="ac-upd-msg2"></div></div>';
}

function wireUpdate() {
    $('ac-upd-book')?.addEventListener('change', function (e) {
        settings().targetBook = e.target.value;
        settings().followCharBook = false;
        state.updateChar = null; state.updateDiff = null;
        persist(); render();
    });
    document.querySelectorAll('.ac-upick').forEach(function (r) {
        r.addEventListener('click', function () {
            const name = r.dataset.name;
            const c = (state.updateChars || []).find(function (x) { return x.name === name; });
            state.updateChar = c || null;
            state.updateDiff = null;
            render();
        });
    });
    $('ac-upd-run')?.addEventListener('click', runUpdate);
    document.querySelectorAll('.ac-uck').forEach(function (ck) {
        ck.addEventListener('change', function () {
            const i = Number(ck.dataset.i);
            if (state.updateDiff[i]) state.updateDiff[i].take = ck.checked;
            render();
        });
    });
    $('ac-upd-apply')?.addEventListener('click', applyUpdate);
    $('ac-upd-upgrade')?.addEventListener('click', function () { runUpgrade(); });
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
        prog.acDone("升级失败：" + (e.message || e), 8000);
        msg("失败：" + (e.message || e), "err");
    }
    if (btn) btn.disabled = false;
}

async function runUpdate() {
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
        prog.acDone('更新失败：' + (e.message || e), 8000);
        msg('失败：' + (e.message || e), 'err');
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
        prog.acDone('应用失败：' + (e.message || e), 8000);
        msg('失败：' + (e.message || e), 'err');
    }
}
// 出场导演：每轮生成前算出该让谁出场，只注入一小段提示
// ═══════════════════════════════════════════════════════════
const DIR_KEY = 'AC-DIRECTOR';

// 当前聊天的出场记录 { 名字: 最后出现楼层 }
function dirLog() {
    const s = settings();
    s.dirLog = s.dirLog || {};
    const k = chatKey();
    return s.dirLog[k] || (s.dirLog[k] = {});
}

// ═══════════════════════════════════════════════════════════
// LLM 扫世界书：让它判断哪些条目属于同一个人物
// ═══════════════════════════════════════════════════════════
const SCAN_PROMPT = [
  '你在分析一本 SillyTavern 世界书的条目清单，任务是「把条目归并成人物」。',
  '',
  '【判断规则】',
  '1. 同一个人分散在多条条目里（如「柳玉」「柳玉性格补充」「柳玉_胸部」）要合并成一个。',
  '2. 只列真正的人物。世界观、故事基调、地图、行动路线、人物关系速览、数据表、提示词、',
  '   包裹标记这类不是人物，不要列。',
  '3. name 用最常用的称呼，2~8 个字，不要带修饰（不要「角色卡 柳玉」，只要「柳玉」）。',
  '4. {{user}} 和主角本人不要列。',
  '5. 拿不准是不是人物的，宁可不列。',
  '',
  '【输出】严格 JSON，不要代码块：',
  '{"characters":[{"name":"柳玉","role":"英语老师兼班主任","entries":["柳玉","柳玉性格补充"]}]}',
  '',
  'entries 列出属于她的全部条目名（必须和清单里一模一样）。',
].join('\n');

// 用条目清单算个指纹，内容变了才需要重扫
function scanHash(vals) {
    const s2 = vals.map(function (e) { return String(e.comment || ''); }).sort().join('|');
    let h = 5381;
    for (let i = 0; i < s2.length; i++) h = ((h << 5) + h + s2.charCodeAt(i)) | 0;
    return String(h) + ':' + String(s2.length);
}

// 调 LLM 扫一遍
async function llmScanCharacters(force) {
    const book = settings().targetBook;
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
        const line = '- ' + c + (ks ? ' | keys: ' + ks : '');
        if (total + line.length > 8000) break;
        lines.push(line);
        total += line.length;
    }
    if (!lines.length) throw new Error('这本书没有可分析的条目');

    const prompt = SCAN_PROMPT + String.fromCharCode(10, 10) + '【条目清单】' + String.fromCharCode(10) + lines.join(String.fromCharCode(10));

    const raw = await callLLM(prompt);
    const j = parseLoose(raw);
    const chars = ((j && j.characters) || [])
        .filter(function (x) { return x && x.name && String(x.name).trim().length <= 10; })
        .map(function (x) {
            return {
                name: String(x.name).trim(),
                role: String(x.role || '').trim(),
                entries: Array.isArray(x.entries) ? x.entries.map(String) : [],
            };
        });

    if (!chars.length) throw new Error('模型没认出任何人物');

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
        if (/设定|档案|表格|规则|关系|其他|NPC|说明|用法|索引|介入|在场|时段|族|表$/.test(s2)) return "";
        return s2;
    };

    // 可信度：3 = 角色卡 / 手动填的，2 = 行动路线，1 = 从条目名猜的
    const namePri = new Map();
    const markerNames = new Set();
    const addName = function (raw, pri) {
        const nm0 = cleanName(raw);
        if (!nm0) return;
        if (/^(TavernDB|ACU-)/i.test(nm0)) return;
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

    for (const e of vals) {
        const c = String(e.comment || "");
        if (/^(TavernDB|ACU-)/i.test(c)) continue;
        // ① 「名字（备注）」—— 最常见的写法：苏芊语（母亲）/ 顾婉清（青梅）/ 凌晓（小混混）
        const pr = c.match(/^\s*([\u4e00-\u9fa5A-Za-z]{2,4})\s*[（(]\s*([^）)]{1,10})\s*[)）]\s*$/);
        if (pr) {
            const NOISE = /世界观|背景|体态|体型|文风|判断|设定|规则|说明|系统|地图|地理|时间|关系|概要|简介|总结|提示|格式|顺序|插入|深度|概率|语料|其他|备注|序章|开场|结局|尺寸|参数|选项|状态|数值|衣着|穿着|样例|示例|模板|参考/i;
            if (!NOISE.test(pr[1]) && !NOISE.test(pr[2])) { addName(pr[1], 3); markerNames.add(pr[1]); continue; }
        }
        // ② 显式标记：浅草-猫妖-（人设核心） / 玉藻 人设核心 / 白练华（身体设定）
        const mk = c.match(/^\s*(.+?)[\s_\-—·（(【\[]*(人设核心|人设|身体设定|身体|瑟瑟设定|瑟瑟|性癖|NSFW)/i);
        if (mk) {
            const head0 = mk[1].split(/[_\-—·]/)[0].trim();
            if (head0 && head0.length >= 2 && head0.length <= 8) { addName(head0, 4); markerNames.add(head0); continue; }
        }
        // ③ 插件自己的规范命名
        let m = c.match(/^(?:角色卡|身体配置|性癖档案|NSFW档案)\s*[:：]?\s*(.+)$/);
        if (m) { addName(m[1], 3); continue; }
        m = c.match(/^(.+?)[_\-—]?(?:行为落地指南|出场时机|介入机会)$/);
        if (m) { addName(m[1], 2); continue; }
        if (/人设|核心|设定/.test(c)) addName(c.split(/[_\-—（(【[]/)[0], 1);
    }

    if (tl) {
        const body0 = String(tl.content || "");
        for (const m0 of body0.matchAll(/(?:◇|【)\s*([^\s—】]+)/g)) addName(m0[1], 2);
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
    const names = new Set(keptNames);
    // 这个名字是从哪儿认出来的（显示在界面上，方便判断该不该勾）
    const srcOf = function (n) {
        if (llmNames.get(n)) return 'LLM';
        if ((settings().directorCharsExtra || []).indexOf(n) >= 0) return '手动';
        if (vals.some(function (e) { return String(e.comment) === '角色卡 ' + n || String(e.comment) === 'NSFW档案 ' + n; })) return '角色卡';
        if (markerNames.has(n)) return '条目名';
        if (namePri.get(n) === 4) return '关系速览';
        if (namePri.get(n) === 2) return '行动路线';
        return '条目名';
    };
    for (const n of names) {
        let scenes = [];
        let hint = '';
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
                        }                        if (!hint) hint = line.slice(arrow + 1).trim();
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
        const myKeys = [];
        const scanHit = llmNames.get(n);
        const scanEntries = scanHit ? (scanHit.entries || []) : [];
        for (const e of vals) {
            const c3 = String(e.comment || '');
            if (scanEntries.indexOf(c3) >= 0 || c3 === '角色卡 ' + n || c3 === '身体配置 ' + n || c3 === '性癖档案 ' + n || c3 === 'NSFW档案 ' + n || c3 === n + '_行为落地指南' || c3 === n + '_出场时机') {
                for (const k3 of (e.key || [])) if (k3) myKeys.push(String(k3));
            }
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
        chars.push({ name: n, scenes: [...new Set(scenes)], hint: hint, presence: presenceText, keys: [...new Set(myKeys)], relations: [...new Set(relList)], knownToUser: knownToUser, source: srcOf(n) });
    }

    // 读数据库维护的「重要角色表」：谁在场、谁在哪（比数楼层准）
    const dbCast = {};
    let dbPlace = '';
    try {
        // 表头和数据可能分在不同条目里：先全局找一次表头，再按列号解析所有数据行
        const dbEntries = vals.filter(function (e) { return /^TavernDB-ACU-CustomExport-重要角色表/.test(String(e.comment || '')); });
        let iName = 1, iPlace = 6, iPresent = 7, foundHeader = false;
        for (const e of dbEntries) {
            for (const line of String(e.content || '').split('\n')) {
                const cells = line.split('|').map(function (x) { return x.trim(); });
                const a = cells.indexOf('姓名');
                if (a > 0) {
                    iName = a;
                    const p = cells.findIndex(function (x) { return /所在地点|^地点|位置/.test(x); });
                    const q = cells.findIndex(function (x) { return /在场状态|^在场/.test(x); });
                    if (p > 0) iPlace = p;
                    if (q > 0) iPresent = q;
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

    // 数据库里有、我们这边没有的，也要能推荐（否则像秦丽这种人永远出不来）
    const have = new Set(chars.map(function (c) { return c.name; }));
    const npcPool = [];
    for (const n of Object.keys(dbCast)) {
        if (have.has(n)) continue;
        let dup = false;
        for (const h of have) { if (h.indexOf(n) >= 0 || n.indexOf(h) >= 0) { dup = true; break; } }
        if (dup) continue;
        npcPool.push({ name: n, scenes: [], hint: '', dbOnly: true, npc: true });
    }
    // 次要 NPC 也全部保留（界面上让用户勾选），只是默认不启用
    chars.push.apply(chars, npcPool);
    // 手动勾选覆盖自动判断；没勾过的按「是不是 NPC」决定
    const picks = settings().directorPick || {};
    for (const ch of chars) {
        ch.enabled = (picks[ch.name] !== undefined) ? !!picks[ch.name] : !ch.npc;
    }

    state.dirCache = { book: book, chars: chars, dbCast: dbCast, dbPlace: dbPlace, rosterFound: rosterFound, npcSkipped: 0, at: Date.now() };
    // 自动兜底：一个角色都没认出来，说明命名完全不合规范 —— 让模型读一遍条目
    const sc0 = (settings().dirScan || {})[book];
    const scanHashNow = (function () {
        try { return scanHash(vals); } catch (e) { return ""; }
    })();
    if (settings().autoScan !== false
        && !chars.length
        && !state.autoScanBusy
        && !(state.autoScanFailed && state.autoScanFailed[scanHashNow])
        && String(settings().apiKey || "").trim()
        && !(sc0 && sc0.hash === scanHashNow)) {
        state.autoScanBusy = true;
        console.log("[命运织机] 规则认不出任何角色，自动调用 LLM 扫描…");
        const prog = (typeof toastProgress === "function") ? toastProgress("认不出角色，正在让模型扫一遍这本书…") : null;
        llmScanCharacters(false).then(function () {
            state.autoScanBusy = false;
            if (prog) prog.acDone("模型扫描完成");
            return refreshDirCache(book);
        }).then(function () {
            try { renderMini(false); } catch (e) {}
            try { if ($("ac-overlay") && $("ac-overlay").style.display !== "none") render(); } catch (e) {}
        }).catch(function (e) {
            state.autoScanBusy = false;
                state.autoScanFailed = state.autoScanFailed || {};
                state.autoScanFailed[scanHashNow] = true;   // 这本书别再自动试了
            if (prog) prog.acDone("自动扫描失败：" + (e.message || e), 8000);
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
    // 数据库的表可能只写「夏凛」，而我们叫「魅魔妹妹夏凛」——按包含关系匹配
    const dbOf = function (n) {
        if (dbCast[n]) return dbCast[n];
        for (const k of Object.keys(dbCast)) {
            if (k && (n.indexOf(k) >= 0 || k.indexOf(n) >= 0)) return dbCast[k];
        }
        return null;
    };
    const recent = texts.slice(-3).join('\n');
    const gapNeed = Math.max(1, Number(s.directorGap) || 8);

    // 空闲检测：最近一楼是否在打斗/激烈冲突里
    if (s.directorIdleOnly) {
        const busy = /战斗|打斗|交手|争吵|怒吼|咆哮|危险|鲜血|受伤|追逐|逃亡|尖叫/;
        if (busy.test(texts[n - 1] || '')) return { skip: true, why: '当前场景在激烈冲突里，不插人' };
    }

    // 每个人：上次出现楼层（从记录里取，没有就从正文里找最后一次提到）
    const rows = active.map(function (c) {
        let last = log[c.name] !== undefined ? log[c.name] : -1;
        if (last < 0) {
            for (let i = n - 1; i >= 0; i--) {
                if (texts[i].indexOf(c.name) >= 0) { last = i; break; }
            }
        }
        const gap = last < 0 ? n : (n - 1 - last);
        const sceneHit = (c.scenes || []).filter(function (w) { return w && recent.indexOf(w) >= 0; });
        return { name: c.name, hint: c.hint, gap: gap, last: last, hit: sceneHit, scenes: c.scenes || [] };
    });

    // 数据库说他在场的，直接从候选里剔除（他已经在这个画面里了）
    const inScene = rows.filter(function (r) { const d = dbOf(r.name); return d && d.present; }).map(function (r) { return r.name; });
    const eligible0 = rows.filter(function (r) { return !inScene.includes(r.name); });
    const eligible = eligible0.filter(function (r) { return r.gap >= gapNeed; });
    // 严格按间隔门槛：没到门槛的人一律不进候选（否则刚出现过的人会被反复推荐）
    const pool = eligible;
    if (!pool.length) return { skip: true, why: '所有人都在间隔门槛内，这一轮不推荐', all: rows };

    // 场景命中优先；命中里挑间隔最大的
    const matched = pool.filter(function (r) { return r.hit.length > 0; });
    const chance = s.directorAllowRandom ? Math.max(0, Math.min(100, Number(s.directorChance) || 0)) : 0;
    let pick = null;

    if (matched.length) {
        // 场景真的有对上的人：从命中里挑间隔最大的
        pick = matched.sort(function (a, b) { return b.hit.length - a.hit.length || b.gap - a.gap; })[0];
    } else if (chance > 0 && Math.random() * 100 < chance) {
        // 用户明确开了「随机偶遇」才硬插，并且只从最久没出场的人里挑
        const far = function (n) { const d = dbOf(n); return !!(d && d.place && dbPlace && d.place !== dbPlace); };
        const near = pool.filter(function (r) { return !far(r.name); });
        const base = near.length ? near : pool;
        const maxGap = Math.max.apply(null, base.map(function (r) { return r.gap; }));
        const top = base.filter(function (r) { return r.gap >= maxGap - 1; });
        pick = top[Math.floor(Math.random() * top.length)];
    } else {
        // 没有场景命中：不让她出场，但可以让世界记得她（轻提）
        const mildNeed = gapNeed * 2;
        // 只对「已经出场过、后来冷了」的人轻提。
        // 从没出场过的人不能被轻提 —— 主角根本不认识她（否则一条短信、一件外套都会很突兀）
        const knownToStory = function (r) {
            if (r.last >= 0) return true;              // 本聊天里被提到过
            const cc = active.find(function (x) { return x.name === r.name; });
            if (cc && cc.knownToUser) return true;     // 角色卡里写了她和主角有关系
            const d = dbOf(r.name);
            return !!(d && (d.place || d.relations && d.relations.length));   // 数据库记过她 = 剧情里出现过
        };
        const cold = pool.filter(function (r) {
            return r.gap >= mildNeed && knownToStory(r) && ((r.scenes || []).length || r.hint);
        });
        if (cold.length) {
            const maxG = Math.max.apply(null, cold.map(function (r) { return r.gap; }));
            const top = cold.filter(function (r) { return r.gap >= maxG - 1; });
            return { mild: true, pick: top[Math.floor(Math.random() * top.length)], all: rows };
        }
        return { skip: true, why: '没有人的场景对得上，也没有「已经出场过但久未出现」的人，这一轮不推荐', all: rows };
    }

    if (!pick) return { skip: true, why: '没有可推荐的人', all: rows };
    return { pick: pick, all: rows, skipped: rows.length - pool.length };
}

// 生成注入文本
function directorText(res) {
    if (!res || !res.pick) return '';
    const p = res.pick;
    const L = [];
    L.push('[出场提示] ' + p.name + '（' + p.gap + ' 楼未出场）' + (p.trig && p.trig !== p.name ? '　关键词：' + p.trig : ''));
    if (p.hit && p.hit.length) L.push('当前场景提到了：' + p.hit.join('、') + '，适合让她介入。');
    else if ((p.scenes || []).length) L.push('她通常在：' + p.scenes.slice(0, 4).join('、') + '（场景对得上才用）。');
    if (p.hint) L.push('她的出场方式：' + p.hint.slice(0, 90));
    L.push('如果她此刻出现会显得突兀，就完全忽略本提示 —— 宁可这一轮没人出场。');
    return L.join(String.fromCharCode(10));
}
// 一条「不在场」提示，是否需要有人在场才能成立
// 需要：白练华说「…」、文博抱怨「…」、苏雅提起「…」
// 不需要：冰箱里的餐盒、桌上一碗汤、门口的便签、手机上的一条消息
function segmentName(seg) {
    const s2 = String(seg || '').trim();
    const i2 = s2.indexOf(':');
    const i3 = s2.indexOf('：');
    const cut = i2 >= 0 ? i2 : i3;
    const nm = (cut > 0 ? s2.slice(0, cut) : s2).trim();
    return (nm && nm.length <= 8 && !/^[-|\s]*$/.test(nm)) ? nm : '';
}

function presenceNeedsSpeaker(s) {
    const str = String(s || '');
    if (/短信|消息|便签|字条|电话|微信|群|快递|留言|来路不明/.test(str)) return null;   // 通讯/物件类
    const m = str.match(/^([^\s「」『』]{2,7}?)(说|提到|提起|转述|抱怨|问|告诉|聊|一句)[「"『]/);
    return m ? m[1] : null;   // 返回说话人，需要他在场
}
// 轻提：不让她出场，只让世界记得她
function directorMildText(p) {
    const L = [];
    // 名字放在开头括号里：既能被世界书扫描看到，又不打断阅读
    L.push('[存在感提示] ' + p.name + '（' + p.gap + ' 楼未出场）' + (p.trig && p.trig !== p.name ? '　关键词：' + p.trig : ''));
    L.push('这一场不必让她出场。');
    const sp = p.presenceSpeak || [];
    const tr = p.presenceTrace || [];
    if (sp.length) {
        L.push('如果顺手，可以让在场的' + sp[0].replace(/(说|提到|提起|转述|抱怨|问|告诉|聊|一句)[「"『].*$/, '') + '自然地提一句她 —— 一句带过，别像在念设定。');
    }
    if (tr.length) {
        L.push('（她留下的痕迹：' + tr.slice(0, 3).join('；') + '）');
    }
    if (!sp.length && !tr.length) L.push('（一件属于她的东西，或一条她发来的消息）');
    L.push('不要让不认识她的人提到她，也不要让她本人出现。');
    L.push('如果连痕迹都不好安排，就完全忽略本提示。');
    return L.join(String.fromCharCode(10));
}
// 每轮生成前调用（同步）
function runDirector() {
    try {
        const s = settings();
        if (!s.director) { clearDirector(); return; }
        if (!ctx.setExtensionPrompt) return;

        // 注入的这个词必须真的在某个条目的 keys 里，否则扫不到
        const triggerOf = function (nm5) {
            const c5 = ((state.dirCache && state.dirCache.chars) || []).find(function (x) { return x.name === nm5; });
            const ks = (c5 && c5.keys) || [];
            if (!ks.length) return nm5;
            if (ks.indexOf(nm5) >= 0) return nm5;
            for (const k5 of ks) { if (nm5.indexOf(k5) >= 0 || k5.indexOf(nm5) >= 0) return k5; }
            return ks[0];
        };

        const pos = s.directorPos === "before" ? 2 : (s.directorPos === "in_prompt" ? 0 : 1);
        const depth = Math.max(0, Number(s.directorDepth) || 4);

        // 一档：模型在检测时顺带给的判断（同一次请求，不额外花钱）
        const sg = state.dirSuggestion;
        const fresh = sg && sg.name && (Date.now() - (sg.at || 0) < 15 * 60 * 1000);
        if (fresh) {
            const c = ((state.dirCache && state.dirCache.chars) || []).find(function (x) { return x.name === sg.name; });
            sg.trig = triggerOf(sg.name);
            const text2 = [
                "[出场提示] " + sg.name + "（这一场适合出现）" + (sg.trig && sg.trig !== sg.name ? "　关键词：" + sg.trig : ""),
                sg.why ? ("理由：" + sg.why) : "",
                (c && (c.scenes || []).length) ? ("她通常在：" + c.scenes.slice(0, 4).join("、")) : "",
                (c && c.hint) ? ("她的出场方式：" + String(c.hint).slice(0, 90)) : "",
                "如果她此刻出现会显得突兀，就完全忽略本提示 —— 宁可这一轮没人出场。",
            ].filter(Boolean).join(String.fromCharCode(10));
            ctx.setExtensionPrompt(DIR_KEY, text2, pos, depth, true, 0);
            state.dirLast = { at: Date.now(), name: sg.name, text: text2, gap: 0, by: "llm" };
            state.dirSuggestion = null;
            console.log("[命运织机] 导演（模型判断）：" + sg.name);
            toastDirector('llm', sg.name, 0);
            return;
        }

        // 二档 / 三档：本地计算
        const res = directorPick();
        if (!res) { clearDirector(); return; }

        // 轻提：不让她出场，只让世界记得她
        if (res.mild && res.pick) {
            const cm = ((state.dirCache && state.dirCache.chars) || []).find(function (x) { return x.name === res.pick.name; });
            res.pick.presenceText = (cm && cm.presence) ? cm.presence : "";
            res.pick.trig = triggerOf(res.pick.name);
            const mt = directorMildText(res.pick);
            ctx.setExtensionPrompt(DIR_KEY, mt, pos, depth, true, 0);
            state.dirLast = { at: Date.now(), name: res.pick.name, text: mt, gap: res.pick.gap, by: "mild" };
            console.log("[命运织机] 导演轻提：" + res.pick.name + "（" + res.pick.gap + " 楼未出场，只提及不出场）");
            toastDirector('mild', res.pick.name, res.pick.gap);
            return;
        }

        if (res.skip || !res.pick) { clearDirector(); return; }

        // 正常出场：场景词命中
        res.pick.trig = triggerOf(res.pick.name);
        const text = directorText(res);
        if (!text) { clearDirector(); return; }
        ctx.setExtensionPrompt(DIR_KEY, text, pos, depth, true, 0);
        state.dirLast = { at: Date.now(), name: res.pick.name, text: text, gap: res.pick.gap, by: "script" };
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
    h += '<div class="ac-f"><label>建议间隔（楼）</label><input type="number" id="ac-dir-gap" value="' + (s.directorGap || 8) + '" min="1" max="200" />' +
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
    h += '<div class="ac-f" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;max-width:660px">' +
        '<label style="margin:0">只在空闲场景出手</label>' +
        '<label class="ac-sw"><input type="checkbox" id="ac-dir-idle"' + (s.directorIdleOnly ? ' checked' : '') + ' /><span></span></label>' +
        '</div>';
    h += '<div class="hint" style="margin-top:4px">最近一楼在打斗、争吵、逃亡这类激烈情节时，不插人。</div>';
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
        '<input type="text" id="ac-pick-add" placeholder="手动加一个名字（例如 柳玉）" style="flex:1 1 auto" />' +
        '<button class="ac-btn" id="ac-pick-addbtn">添加</button>' +
        '</div>' +
        ((settings().directorCharsExtra || []).length ? '<div class="hint" style="margin-bottom:8px">已手动添加：' + (settings().directorCharsExtra || []).map(function (x) { return esc(x) + ' <a href="#" data-delname="' + esc(x) + '" style="color:#e08">×</a>'; }).join('、') + '</div>' : '') +
        '<div class="hint" id="ac-pick-msg" style="margin-bottom:8px">自动认不出来的人，在这里手填。' +
        '填完会按名字去世界书里找她的条目（包含匹配，所以填「柳玉」能找到「柳玉性格补充」）。</div>' +
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

    h += '<div class="ac-card"><div class="h">这一轮的预览</div>' +
        '<button class="ac-btn pri" id="ac-dir-preview">预览</button>' +
        '<div class="ac-msg" id="ac-dir-msg"></div>' +
        (last ? '<div class="hint" style="margin-top:10px">来源：' + (last.by === 'llm' ? '<b style="color:#8fd9b6">模型判断</b>（检测时顺带挑的）' : last.by === 'mild' ? '<b style="color:#7dd3fc">轻提</b>（不出场，只提及）' : '<b style="color:#ffd479">脚本</b>（场景词命中）') + '</div>' +
            '<div class="ac-view" style="margin-top:8px;max-height:220px">' + esc(last.text) + '</div>' : '') +
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
        settings().targetBook = bk.value;
        state.dirCache = null;
        persist();
        refreshDirCache().then(function () { render(); }).catch(function () {});
    });
    bind('ac-dir-gap', 'directorGap', true);
    const rnd = $('ac-dir-rand');
    if (rnd) rnd.addEventListener('change', function () { settings().directorAllowRandom = rnd.checked; persist(); render(); });
    bind('ac-dir-chance', 'directorChance', true);
    bind('ac-dir-depth', 'directorDepth', true);
    bind('ac-dir-pos', 'directorPos', false);
    const ntf = $('ac-dir-notify');
    if (ntf) ntf.addEventListener('change', function () { settings().directorNotify = ntf.checked; persist(); });
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
            prog.acDone('扫描失败：' + (e.message || e), 8000);
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
        } catch (e) { prog.acDone('读取失败：' + (e.message || e), 8000); }
        rf.disabled = false;
        render();
    });

    const pv = $('ac-dir-preview');
    if (pv) pv.addEventListener('click', function () {
        const m = $('ac-dir-msg');
        const res = directorPick();
        if (!res) { if (m) { m.className = 'ac-msg err'; m.textContent = '还没有素材，先点「重新读取」'; } return; }
        if (res.skip) { if (m) { m.className = 'ac-msg err'; m.textContent = res.why; } return; }
        if (!res.pick) { if (m) { m.className = 'ac-msg err'; m.textContent = '没有可推荐的人'; } return; }
        const text = directorText(res);
        state.dirLast = { at: Date.now(), name: res.pick.name, text: text, gap: res.pick.gap };
        if (m) { m.className = 'ac-msg ok'; m.textContent = '这一轮会推荐：' + res.pick.name; }
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
                prog.acDone('撤销失败：' + (e.message || e), 8000);
                btn.disabled = false;
            }
        });
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
function entryBelongsTo(comment, name) {
    const c = String(comment || '');
    if (!c || !name) return false;
    if (/^(TavernDB|ACU-)/i.test(c)) return false;
    let s = c.replace(/^(?:角色卡|NSFW档案|身体配置|性癖档案)\s*/, '');
    s = s.replace(/_(?:行为落地指南|出场时机)$/, '').trim();
    if (s === name) return true;
    if (s.indexOf(name) >= 0 || name.indexOf(s) >= 0) return true;
    if (c.length > name.length && c.indexOf(name) === 0 && /^[\s_\-—（(【\[]/.test(c.slice(name.length))) return true;
    return false;
}

// 从条目名推测它该叫什么（推测不出来就返回空）
function guessStdName(comment, name, style) {
    const marker = (style === 'marker');
    const c = String(comment || '');
    if (/^(?:角色卡|NSFW档案|身体配置|性癖档案)\s/.test(c)) return '';   // 已经规范了
    if (c === name) return '';                                          // 就是名字本身，不动
    if (!entryBelongsTo(c, name)) return '';
    if (/瑟瑟|性癖|NSFW|色情/i.test(c)) return marker ? (name + '（瑟瑟设定）') : ('性癖档案 ' + name);
    if (/身体|肉体|体型|身材/i.test(c)) return marker ? (name + '（身体设定）') : ('身体配置 ' + name);
    if (/人设|核心|设定|角色卡/i.test(c)) return marker ? (name + '（人设核心）') : ('角色卡 ' + name);
    return '';
}

// 分析：能补哪些关键词、能规范哪些条目名
async function analyzeBookFix(book, style) {
    const cache = await refreshDirCache(book);
    const data = await getBook(book);
    const vals = Object.values(data.entries || {});
    const chars = (cache && cache.chars) || [];

    const keyFixes = [];    // 缺名字关键词的条目
    const renames = [];     // 可以规范化的条目名

    for (const ch of chars) {
        const n = ch.name;
        const mine = vals.filter(function (e) { return entryBelongsTo(String(e.comment || ''), n); });
        for (const e of mine) {
            const keys = Array.isArray(e.key) ? e.key.map(String) : [];
            if (keys.indexOf(n) < 0) {
                keyFixes.push({ uid: e.uid, comment: String(e.comment || ''), name: n });
            }
            const std = guessStdName(String(e.comment || ''), n, style);
            if (std && std !== String(e.comment)) {
                renames.push({ uid: e.uid, from: String(e.comment || ''), to: std, name: n });
            }
        }
    }
    return { keyFixes: keyFixes, renames: renames, chars: chars.length };
}

// 执行修复
async function applyBookFix(book, doKeys, doRenames) {
    const fx = state.bookFix;
    if (!fx) throw new Error('先分析一次');

    const data = await getBook(book);
    const ent = data.entries || {};
    const undo = [];    // 记下改了什么，方便撤销
    let nKeys = 0;
    let nNames = 0;

    if (doKeys) {
        for (const f of fx.keyFixes) {
            const e = ent[f.uid];
            if (!e) continue;
            const keys = Array.isArray(e.key) ? e.key.map(String) : [];
            if (keys.indexOf(f.name) >= 0) continue;
            undo.push({ uid: f.uid, key: keys.slice(), comment: String(e.comment || '') });
            e.key = [f.name].concat(keys);      // 名字放第一位，保证一定命中
            nKeys++;
        }
    }
    if (doRenames) {
        const done = new Set(undo.map(function (u) { return u.uid; }));
        for (const r of fx.renames) {
            const e = ent[r.uid];
            if (!e) continue;
            if (String(e.comment) !== r.from) continue;
            if (!done.has(r.uid)) {
                undo.push({ uid: r.uid, key: (Array.isArray(e.key) ? e.key.map(String) : []), comment: String(e.comment || '') });
            }
            e.comment = r.to;
            nNames++;
        }
    }

    if (!undo.length) return { nKeys: 0, nNames: 0 };
    await putBook(book, data);
    state.bookFixUndo = { book: book, items: undo, at: Date.now() };
    state.bookFix = null;
    await refreshDirCache();
    return { nKeys: nKeys, nNames: nNames, undoable: undo.length };
}

// 撤销上一次修复
async function undoBookFix() {
    const u = state.bookFixUndo;
    if (!u) throw new Error('没有可撤销的修复');
    const data = await getBook(u.book);
    const ent = data.entries || {};
    for (const it of u.items) {
        const e = ent[it.uid];
        if (!e) continue;
        e.key = it.key;
        e.comment = it.comment;
    }
    await putBook(u.book, data);
    state.bookFixUndo = null;
    await refreshDirCache();
    return u.items.length;
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

async function onCharacterSwitched() {
    const s = settings();
    const book = boundBook();
    const _lc = live(); const ch = _lc.characters && _lc.characters[_lc.characterId];
    const cname = (ch && ch.name) || "";

    // 跟随角色卡：把它绑定的世界书设为当前目标
    if (s.followCharBook !== false && book && book !== s.targetBook) {
        s.targetBook = book;
        persist();
    }
    // 换人了，导演的缓存必须作废，否则还在用上一个人的人设
    state.dirCache = null;
    state.bookFix = null;
    state.dirLast = null;

    if (s.director && s.targetBook) {
        try { await refreshDirCache(); } catch (e) { console.warn("[命运织机] 切书后读素材失败", e); }
    }
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
        lastCharKey = k;
        if (first) return;            // 首次加载不算切换
        onCharacterSwitched();
    };
    tick();
    setInterval(tick, 1500);
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
function ensureMini() {
    if (document.getElementById("ac-mini")) return;
    const d = document.createElement("div");
    d.id = "ac-mini";
    d.innerHTML = '<div id="ac-mini-body" style="display:none">' +
        '<div class="mini-h"><span>角色清单</span><b id="ac-mini-book" style="color:#8fa0a0;font-weight:400;font-size:11px;margin-right:6px"></b><b id="ac-mini-n">0/0</b>' +
        '<button id="ac-mini-x" title="收起">×</button></div>' +
        '<div class="mini-l" id="ac-mini-list"></div>' +
        '<div class="mini-f"><button class="ac-btn" id="ac-mini-open">打开完整面板</button>' +
        '<button class="ac-btn" id="ac-mini-reload">重新读取</button></div></div>' +
        '<div id="ac-mini-btn" title="yek命运织机"><i class="fa-solid fa-user-pen"></i>' +
        '<span id="ac-mini-count">0</span></div>';
    document.body.appendChild(d);

    document.getElementById("ac-mini-btn").addEventListener("click", function () {
        const b = document.getElementById("ac-mini-body");
        const open = b.style.display === "none";
        b.style.display = open ? "block" : "none";
        if (open) renderMini(true);
    });
    document.getElementById("ac-mini-x").addEventListener("click", function () {
        document.getElementById("ac-mini-body").style.display = "none";
    });
    document.getElementById("ac-mini-open").addEventListener("click", function () {
        document.getElementById("ac-mini-body").style.display = "none";
        openPanel();
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
    const chars = (state.dirCache && state.dirCache.chars) || [];
    const on = chars.filter(function (c) { return c.enabled !== false; }).length;
    if (cnt) cnt.textContent = String(on);
    const bk = document.getElementById("ac-mini-book");
    if (bk) bk.textContent = effectiveBook() || '(未选书)';
    if (num) num.textContent = on + "/" + chars.length;
    if (!chars.length) {
        list.innerHTML = '<div class="mini-e">还没有素材。先选目标世界书，或点下面的「重新读取」。</div>';
        return;
    }
    list.innerHTML = chars.map(function (c) {
        const chk = c.enabled !== false ? " checked" : "";
        const tag = c.npc ? "数据库" : (c.source || "");
        return '<label class="mini-r"><input type="checkbox" data-mpick="' + esc(c.name) + '"' + chk + ' />' +
            '<span class="mini-n">' + esc(c.name) + '</span>' +
            '<span class="mini-t">' + esc(tag) + '</span></label>';
    }).join("");
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
        btn.innerHTML = '<div class="fa-solid fa-user-pen extensionsMenuExtensionButton"></div><span>yek命运织机</span>';
        btn.addEventListener('click', openPanel);
        menu.appendChild(btn);
        console.log('[命运织机] 已加入魔杖菜单');
    })();

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
            mk('织机', ['ml', 'fateloom'], '打开 yek命运织机面板');
            console.log('[命运织机] 斜杠命令已注册：/织机  /ml  /fateloom');
        }
    } catch (e) { console.warn('[命运织机] 斜杠命令注册失败', e); }

    // 对话结束 → 自动检测新人物并生成模板
    try {
        const evs = ctx.eventSource, evt = ctx.event_types;
        if (evs && evt && evt.MESSAGE_RECEIVED) {
            evs.on(evt.MESSAGE_RECEIVED, () => scheduleAuto());
            if (evt.GENERATION_STARTED) {
                evs.on(evt.GENERATION_STARTED, () => runDirector());
                console.log('[命运织机] 已挂载出场导演');
            }
            console.log('[命运织机] 已挂载对话结束检测');
        }
    } catch (e) { console.warn('[命运织机] 事件挂载失败', e); }

    ensurePanel();
    try { ensureMini(); } catch (e) { console.warn('[命运织机] 浮动小面板创建失败', e); }
    try { watchCharacter(); } catch (e) { console.warn('[命运织机] 切换监听启动失败', e); }
    console.log('[命运织机] v0.6.0 已加载 · 世界书 ' + state.books.length + ' 本');
});