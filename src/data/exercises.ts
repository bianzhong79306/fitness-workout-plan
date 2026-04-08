import { Exercise } from '@/types/exercise';

export const exercises: Exercise[] = [
  // ==================== 胸部动作 ====================
  {
    id: 'push-up',
    name: '俯卧撑',
    nameEn: 'Push-up',
    description: '经典的上肢训练动作，主要锻炼胸肌、三头肌和肩部。',
    muscles: ['chest', 'arms', 'shoulders'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双手与肩同宽，手掌位于肩膀正下方',
      '身体保持一条直线，核心收紧',
      '下降时吸气，推起时呼气',
      '全程保持颈部自然，不要抬头或低头'
    ],
    mistakes: [
      '塌腰或撅臀',
      '手臂外展角度过大（应约45度）',
      '下降深度不够',
      '呼吸节奏混乱'
    ],
    alternatives: ['knee-push-up', 'incline-push-up', 'diamond-push-up']
  },
  {
    id: 'knee-push-up',
    name: '跪姿俯卧撑',
    nameEn: 'Knee Push-up',
    description: '俯卧撑的简化版本，适合初学者。',
    muscles: ['chest', 'arms'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '膝盖着地，小腿交叉抬起',
      '双手与肩同宽',
      '保持上半身挺直',
      '控制下降速度'
    ],
    mistakes: [
      '臀部过高或过低',
      '手肘外展过大'
    ],
    alternatives: ['push-up', 'wall-push-up']
  },
  {
    id: 'diamond-push-up',
    name: '钻石俯卧撑',
    nameEn: 'Diamond Push-up',
    description: '双手呈钻石形，重点刺激三头肌和胸肌内侧。',
    muscles: ['arms', 'chest'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双手拇指和食指相触形成钻石形',
      '置于胸部正下方',
      '手肘贴近身体',
      '下降时胸部接近双手'
    ],
    mistakes: [
      '手肘外展',
      '核心松弛'
    ],
    alternatives: ['push-up', 'narrow-push-up']
  },
  {
    id: 'incline-push-up',
    name: '上斜俯卧撑',
    nameEn: 'Incline Push-up',
    description: '双手撑在高处，降低难度，适合初学者。',
    muscles: ['chest', 'shoulders'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'chair',
    tips: [
      '双手撑在椅子或床沿',
      '身体保持一条直线',
      '胸部靠近支撑物'
    ],
    mistakes: [
      '臀部撅起',
      '身体下沉不够'
    ],
    alternatives: ['push-up', 'knee-push-up']
  },
  {
    id: 'decline-push-up',
    name: '下斜俯卧撑',
    nameEn: 'Decline Push-up',
    description: '双脚抬高，增加难度，重点刺激上胸。',
    muscles: ['chest', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'chair',
    tips: [
      '双脚放在椅子或床沿上',
      '双手撑地，身体呈下斜角度',
      '胸部靠近地面',
      '保持核心收紧'
    ],
    mistakes: [
      '臀部过高或下塌',
      '下降深度不够'
    ],
    alternatives: ['push-up', 'pike-push-up']
  },
  {
    id: 'wide-push-up',
    name: '宽距俯卧撑',
    nameEn: 'Wide Push-up',
    description: '双手宽于肩，重点刺激胸肌外侧。',
    muscles: ['chest', 'shoulders'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双手宽于肩1.5倍距离',
      '手肘角度约45度',
      '胸部贴近地面',
      '保持核心稳定'
    ],
    mistakes: [
      '手肘过于外展（90度）',
      '核心松弛'
    ],
    alternatives: ['push-up', 'incline-push-up']
  },
  {
    id: 'wall-push-up',
    name: '墙壁俯卧撑',
    nameEn: 'Wall Push-up',
    description: '最简单的俯卧撑变体，适合初学者。',
    muscles: ['chest', 'arms', 'shoulders'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'wall',
    tips: [
      '面对墙壁站立，双手撑墙',
      '与肩同宽或略宽',
      '屈肘靠近墙壁',
      '推回起始位置'
    ],
    mistakes: [
      '身体过于直立',
      '手肘外展过大'
    ],
    alternatives: ['incline-push-up', 'knee-push-up']
  },

  // ==================== 腿部动作 ====================
  {
    id: 'squat',
    name: '深蹲',
    nameEn: 'Squat',
    description: '最有效的下肢训练动作之一，锻炼股四头肌、臀大肌和腘绳肌。',
    muscles: ['legs', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双脚与肩同宽，脚尖略微外展',
      '下蹲时膝盖朝向脚尖方向',
      '臀部向后坐，像坐椅子一样',
      '下蹲至大腿与地面平行',
      '起身时臀部发力'
    ],
    mistakes: [
      '膝盖内扣',
      '重心前移，脚跟离地',
      '弯腰驼背',
      '下蹲深度不够'
    ],
    alternatives: ['sumo-squat', 'goblet-squat']
  },
  {
    id: 'lunge',
    name: '弓步蹲',
    nameEn: 'Lunge',
    description: '单腿训练动作，提高腿部力量和平衡能力。',
    muscles: ['legs', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '一脚向前迈出一大步',
      '下蹲至后膝盖接近地面',
      '前膝盖不超过脚尖',
      '躯干保持直立'
    ],
    mistakes: [
      '步幅过小或过大',
      '身体前倾',
      '膝盖内扣'
    ],
    alternatives: ['reverse-lunge', 'walking-lunge']
  },
  {
    id: 'reverse-lunge',
    name: '反向弓步蹲',
    nameEn: 'Reverse Lunge',
    description: '向后迈步的弓步蹲，对膝盖更友好。',
    muscles: ['legs', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '站立，一脚向后迈出一大步',
      '下蹲至后膝盖接近地面',
      '前大腿与地面平行',
      '推起回到起始位置'
    ],
    mistakes: [
      '前膝盖超过脚尖',
      '身体前倾'
    ],
    alternatives: ['lunge', 'walking-lunge']
  },
  {
    id: 'walking-lunge',
    name: '行走弓步蹲',
    nameEn: 'Walking Lunge',
    description: '交替前进的弓步蹲，增加动态稳定性。',
    muscles: ['legs', 'glutes'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '向前迈步下蹲',
      '后腿蹬地向前迈下一步',
      '保持躯干稳定',
      '交替进行'
    ],
    mistakes: [
      '膝盖内扣',
      '身体摇晃'
    ],
    alternatives: ['lunge', 'reverse-lunge']
  },
  {
    id: 'side-lunge',
    name: '侧弓步蹲',
    nameEn: 'Side Lunge',
    description: '侧面弓步蹲，锻炼内收肌和臀中肌。',
    muscles: ['legs', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '向侧面迈出一大步',
      '屈膝下蹲，另一腿伸直',
      '膝盖朝向脚尖方向',
      '推起回到起始位置'
    ],
    mistakes: [
      '膝盖内扣',
      '躯干过度前倾'
    ],
    alternatives: ['sumo-squat', 'curtsy-lunge']
  },
  {
    id: 'bulgarian-split-squat',
    name: '保加利亚分腿蹲',
    nameEn: 'Bulgarian Split Squat',
    description: '单腿训练之王，极大刺激臀腿。',
    muscles: ['legs', 'glutes'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'chair',
    tips: [
      '后脚放在椅子或沙发上',
      '前脚向前迈出适当距离',
      '下蹲至后膝盖接近地面',
      '前大腿与地面平行'
    ],
    mistakes: [
      '前膝盖超过脚尖',
      '躯干过度前倾',
      '后脚位置不当'
    ],
    alternatives: ['lunge', 'single-leg-squat']
  },
  {
    id: 'sumo-squat',
    name: '相扑深蹲',
    nameEn: 'Sumo Squat',
    description: '宽站距深蹲，重点刺激臀部和内收肌。',
    muscles: ['legs', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双脚宽于肩，脚尖外展45度',
      '下蹲时膝盖沿脚尖方向',
      '臀部向后下方坐',
      '大腿与地面平行'
    ],
    mistakes: [
      '膝盖内扣',
      '上半身过度前倾'
    ],
    alternatives: ['squat', 'goblet-squat']
  },
  {
    id: 'jump-squat',
    name: '跳跃深蹲',
    nameEn: 'Jump Squat',
    description: '爆发力深蹲，增加心肺和力量训练。',
    muscles: ['legs', 'glutes'],
    difficulty: 'intermediate',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '深蹲到底后爆发力跳起',
      '空中充分伸展身体',
      '落地时屈膝缓冲',
      '连续进行'
    ],
    mistakes: [
      '落地时膝盖锁死',
      '蹲得不够深',
      '核心松弛'
    ],
    alternatives: ['squat', 'squat-pulse']
  },
  {
    id: 'wall-sit',
    name: '靠墙静蹲',
    nameEn: 'Wall Sit',
    description: '静态等长收缩训练，增强腿部耐力。',
    muscles: ['legs'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'wall',
    tips: [
      '背部贴墙',
      '大腿与地面平行',
      '膝盖呈90度',
      '保持静止，时间越长越好'
    ],
    mistakes: [
      '膝盖超过脚尖',
      '背部离开墙面'
    ],
    alternatives: ['squat-hold', 'isometric-squat']
  },
  {
    id: 'calf-raise',
    name: '提踵',
    nameEn: 'Calf Raise',
    description: '小腿训练经典动作。',
    muscles: ['legs'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双脚与肩同宽',
      '脚尖着地，脚跟抬起',
      '顶峰收缩1-2秒',
      '缓慢下放'
    ],
    mistakes: [
      '动作过快',
      '幅度不够'
    ],
    alternatives: ['single-leg-calf-raise', 'seated-calf-raise']
  },
  {
    id: 'single-leg-calf-raise',
    name: '单腿提踵',
    nameEn: 'Single Leg Calf Raise',
    description: '单腿小腿训练，增加难度和稳定性。',
    muscles: ['legs'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '单脚站立',
      '另一脚抬起',
      '脚尖着地抬起脚跟',
      '顶峰收缩后缓慢下放'
    ],
    mistakes: [
      '借力跳跃',
      '幅度不够'
    ],
    alternatives: ['calf-raise', 'donkey-calf-raise']
  },

  // ==================== 臀部动作 ====================
  {
    id: 'glute-bridge',
    name: '臀桥',
    nameEn: 'Glute Bridge',
    description: '仰卧抬臀动作，激活和强化臀部肌肉。',
    muscles: ['glutes', 'core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双膝弯曲，脚掌踩地',
      '臀部发力将髋部抬起',
      '顶峰时身体呈一条直线',
      '顶峰收缩臀部1-2秒'
    ],
    mistakes: [
      '过度挺腰',
      '臀部没有完全抬起',
      '大腿后侧代偿过多'
    ],
    alternatives: ['single-leg-glute-bridge', 'hip-thrust']
  },
  {
    id: 'single-leg-glute-bridge',
    name: '单腿臀桥',
    nameEn: 'Single Leg Glute Bridge',
    description: '单腿臀桥，增加难度，更好地孤立臀部。',
    muscles: ['glutes', 'core'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，一脚抬起',
      '另一脚踩地发力',
      '臀部抬起至身体呈直线',
      '顶峰收缩臀部'
    ],
    mistakes: [
      '髋部旋转',
      '过度挺腰'
    ],
    alternatives: ['glute-bridge', 'hip-thrust']
  },
  {
    id: 'side-lying-leg-raise',
    name: '侧卧抬腿',
    nameEn: 'Side Lying Leg Raise',
    description: '侧卧抬腿，锻炼臀中肌和臀小肌。',
    muscles: ['glutes', 'legs'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '侧卧，下方手臂支撑头部',
      '上方腿伸直抬起',
      '保持脚尖朝前',
      '缓慢下放'
    ],
    mistakes: [
      '身体晃动',
      '抬腿过高导致代偿'
    ],
    alternatives: ['clam-shell', 'fire-hydrant']
  },
  {
    id: 'clam-shell',
    name: '蚌式开合',
    nameEn: 'Clam Shell',
    description: '侧卧开合腿动作，强化臀中肌。',
    muscles: ['glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '侧卧，双膝弯曲并拢',
      '双脚保持接触',
      '上方膝盖向上打开',
      '臀部发力，缓慢合拢'
    ],
    mistakes: [
      '双脚分开',
      '身体旋转'
    ],
    alternatives: ['side-lying-leg-raise', 'fire-hydrant']
  },
  {
    id: 'fire-hydrant',
    name: '消防栓式',
    nameEn: 'Fire Hydrant',
    description: '四足跪姿侧抬腿，锻炼臀部和核心。',
    muscles: ['glutes', 'core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '四足跪姿，双手在肩下',
      '一腿向侧面抬起',
      '保持膝盖90度弯曲',
      '臀部发力，缓慢下放'
    ],
    mistakes: [
      '身体旋转',
      '抬腿时拱腰'
    ],
    alternatives: ['clam-shell', 'donkey-kick']
  },
  {
    id: 'donkey-kick',
    name: '驴踢',
    nameEn: 'Donkey Kick',
    description: '四足跪姿后踢腿，锻炼臀大肌。',
    muscles: ['glutes', 'core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '四足跪姿，双手在肩下',
      '一脚向后上方踢起',
      '保持膝盖弯曲',
      '脚底朝向天花板'
    ],
    mistakes: [
      '腰部下塌',
      '过度伸展背部'
    ],
    alternatives: ['fire-hydrant', 'single-leg-glute-bridge']
  },
  {
    id: 'hip-thrust',
    name: '臀推',
    nameEn: 'Hip Thrust',
    description: '靠背臀桥，臀部训练王牌动作。',
    muscles: ['glutes'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'chair',
    tips: [
      '上背靠在椅子边缘',
      '双脚踩地与肩同宽',
      '臀部发力向上推起',
      '顶峰时小腿垂直地面'
    ],
    mistakes: [
      '推起时过度挺腰',
      '脚跟离地',
      '下放时臀部着地'
    ],
    alternatives: ['glute-bridge', 'single-leg-glute-bridge']
  },

  // ==================== 核心动作 ====================
  {
    id: 'plank',
    name: '平板支撑',
    nameEn: 'Plank',
    description: '最经典的核心训练动作，增强核心稳定性和耐力。',
    muscles: ['core', 'shoulders'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '前臂撑地，肘部在肩膀正下方',
      '身体从头到脚呈一条直线',
      '核心持续收紧',
      '保持自然呼吸，不要憋气'
    ],
    mistakes: [
      '臀部过高或下塌',
      '肩膀耸起',
      '憋气',
      '腰部下沉'
    ],
    alternatives: ['knee-plank', 'side-plank']
  },
  {
    id: 'knee-plank',
    name: '跪姿平板支撑',
    nameEn: 'Knee Plank',
    description: '平板支撑的简化版本。',
    muscles: ['core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '前臂撑地，膝盖着地',
      '身体从头到膝呈直线',
      '核心收紧',
      '保持呼吸'
    ],
    mistakes: [
      '臀部过高',
      '腰部下塌'
    ],
    alternatives: ['plank', 'wall-plank']
  },
  {
    id: 'side-plank',
    name: '侧平板支撑',
    nameEn: 'Side Plank',
    description: '侧向平板支撑，锻炼腹斜肌。',
    muscles: ['core'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '侧卧，前臂撑地',
      '身体呈一条直线',
      '髋部抬起不触地',
      '保持呼吸'
    ],
    mistakes: [
      '髋部下沉',
      '身体前倾或后仰'
    ],
    alternatives: ['plank', 'side-plank-with-rotation']
  },
  {
    id: 'crunch',
    name: '卷腹',
    nameEn: 'Crunch',
    description: '基础腹肌训练动作，主要锻炼腹直肌。',
    muscles: ['core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双膝弯曲，双手轻触耳侧',
      '卷起上背部，下背部贴地',
      '呼气时卷起，吸气时下放',
      '用腹肌发力，不要用手拉头'
    ],
    mistakes: [
      '用手拉头颈部',
      '下背部离地',
      '动作过快'
    ],
    alternatives: ['bicycle-crunch', 'reverse-crunch']
  },
  {
    id: 'reverse-crunch',
    name: '反向卷腹',
    nameEn: 'Reverse Crunch',
    description: '下腹部训练动作。',
    muscles: ['core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双腿抬起呈90度',
      '臀部离开地面向胸部卷起',
      '缓慢下放',
      '下背部贴地'
    ],
    mistakes: [
      '动作过快借力',
      '腰部过度抬起'
    ],
    alternatives: ['crunch', 'leg-raise']
  },
  {
    id: 'bicycle-crunch',
    name: '自行车卷腹',
    nameEn: 'Bicycle Crunch',
    description: '卷腹变体，锻炼腹直肌和腹斜肌。',
    muscles: ['core'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双手轻触耳侧',
      '一腿屈膝，另一腿伸直',
      '对侧肘触碰膝盖',
      '交替进行'
    ],
    mistakes: [
      '用手拉头',
      '动作过快'
    ],
    alternatives: ['crunch', 'russian-twist']
  },
  {
    id: 'leg-raise',
    name: '仰卧举腿',
    nameEn: 'Leg Raise',
    description: '下腹部训练王牌动作。',
    muscles: ['core'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双腿并拢伸直',
      '下腹发力抬起双腿至垂直',
      '缓慢下放至接近地面',
      '下背部始终贴地'
    ],
    mistakes: [
      '下背部离地',
      '动作过快借力',
      '腿下放过多'
    ],
    alternatives: ['reverse-crunch', 'hanging-leg-raise']
  },
  {
    id: 'dead-bug',
    name: '死虫式',
    nameEn: 'Dead Bug',
    description: '核心稳定性训练动作，安全有效。',
    muscles: ['core'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双臂垂直指向天花板',
      '双腿抬起呈90度',
      '对侧手臂和腿缓慢下放',
      '下背部始终贴地'
    ],
    mistakes: [
      '下背部离地',
      '动作过快'
    ],
    alternatives: ['bird-dog', 'plank']
  },
  {
    id: 'bird-dog',
    name: '猎鸟狗式',
    nameEn: 'Bird Dog',
    description: '核心稳定性和平衡训练，同时锻炼背部。',
    muscles: ['core', 'back', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '四足跪姿，双手在肩下',
      '对侧手臂和腿同时伸出',
      '保持身体稳定',
      '缓慢收回'
    ],
    mistakes: [
      '身体晃动',
      '腰部下塌或拱起'
    ],
    alternatives: ['dead-bug', 'superman']
  },
  {
    id: 'mountain-climber',
    name: '登山跑',
    nameEn: 'Mountain Climber',
    description: '高强度核心和有氧训练动作。',
    muscles: ['core', 'legs', 'shoulders'],
    difficulty: 'intermediate',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '双手撑地，身体呈俯卧撑姿势',
      '交替将膝盖拉向胸部',
      '保持核心稳定，臀部不要起伏',
      '加快速度提高强度'
    ],
    mistakes: [
      '臀部过高或下塌',
      '核心松弛',
      '动作幅度不够'
    ],
    alternatives: ['slow-mountain-climber', 'cross-body-mountain-climber']
  },
  {
    id: 'russian-twist',
    name: '俄罗斯转体',
    nameEn: 'Russian Twist',
    description: '锻炼腹斜肌的经典动作。',
    muscles: ['core'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '坐姿，双膝弯曲，双脚离地',
      '身体后倾约45度',
      '双手合十，左右转体触碰地面',
      '保持核心收紧'
    ],
    mistakes: [
      '双脚着地降低难度',
      '转动幅度不够',
      '背部弯曲'
    ],
    alternatives: ['weighted-russian-twist', 'bicycle-crunch']
  },
  {
    id: 'v-up',
    name: 'V字仰卧起坐',
    nameEn: 'V-up',
    description: '高强度腹肌训练，同时锻炼上下腹。',
    muscles: ['core'],
    difficulty: 'advanced',
    type: 'strength',
    equipment: 'none',
    tips: [
      '仰卧，双臂过头',
      '同时抬起双腿和上半身',
      '手触碰脚踝',
      '缓慢下放'
    ],
    mistakes: [
      '动作过快借力',
      '下背部离地过多'
    ],
    alternatives: ['crunch', 'leg-raise']
  },

  // ==================== 有氧动作 ====================
  {
    id: 'burpee',
    name: '波比跳',
    nameEn: 'Burpee',
    description: '全身性高强度训练动作，结合力量和有氧。',
    muscles: ['full-body'],
    difficulty: 'advanced',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '从站立开始，下蹲双手撑地',
      '双脚后跳成俯卧撑姿势',
      '做一个俯卧撑（可选）',
      '双脚跳回，向上跳起',
      '落地后立即开始下一个'
    ],
    mistakes: [
      '动作不连贯',
      '核心松弛',
      '落地过重'
    ],
    alternatives: ['half-burpee', 'burpee-without-push-up']
  },
  {
    id: 'half-burpee',
    name: '半波比跳',
    nameEn: 'Half Burpee',
    description: '简化版波比跳，不含俯卧撑。',
    muscles: ['full-body'],
    difficulty: 'intermediate',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '站立，下蹲双手撑地',
      '双脚后跳成平板支撑',
      '双脚跳回，站起',
      '不含俯卧撑和跳跃'
    ],
    mistakes: [
      '动作过慢',
      '核心松弛'
    ],
    alternatives: ['burpee', 'squat-thrust']
  },
  {
    id: 'jumping-jack',
    name: '开合跳',
    nameEn: 'Jumping Jack',
    description: '简单有效的有氧热身动作。',
    muscles: ['full-body'],
    difficulty: 'beginner',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '站立，双脚并拢，双手放体侧',
      '跳起时双脚分开，双手头顶击掌',
      '再跳回起始位置',
      '保持节奏均匀'
    ],
    mistakes: [
      '落地过重',
      '动作幅度不够'
    ],
    alternatives: ['step-jack', 'low-impact-jumping-jack']
  },
  {
    id: 'high-knees',
    name: '高抬腿',
    nameEn: 'High Knees',
    description: '原地跑步变体，提高心率，锻炼腿部。',
    muscles: ['legs', 'core'],
    difficulty: 'beginner',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '原地跑步，膝盖抬至髋部高度',
      '手臂配合摆动',
      '保持核心稳定',
      '前脚掌着地'
    ],
    mistakes: [
      '膝盖高度不够',
      '上半身过度前倾'
    ],
    alternatives: ['marching-in-place', 'butt-kicks']
  },
  {
    id: 'butt-kicks',
    name: '后踢腿跑',
    nameEn: 'Butt Kicks',
    description: '原地跑步变体，脚后跟踢向臀部。',
    muscles: ['legs'],
    difficulty: 'beginner',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '原地跑步，脚后跟踢向臀部',
      '保持上身直立',
      '手臂自然摆动'
    ],
    mistakes: [
      '速度过慢',
      '身体前倾'
    ],
    alternatives: ['high-knees', 'marching-in-place']
  },
  {
    id: 'skater-hop',
    name: '滑冰跳',
    nameEn: 'Skater Hop',
    description: '侧向跳跃，锻炼腿部和平衡。',
    muscles: ['legs', 'glutes'],
    difficulty: 'intermediate',
    type: 'cardio',
    equipment: 'none',
    tips: [
      '向右跳，左腿后摆',
      '左臂前摆保持平衡',
      '然后向左跳，右侧相反',
      '模仿滑冰动作'
    ],
    mistakes: [
      '跳跃幅度过小',
      '核心不稳'
    ],
    alternatives: ['side-lunge', 'lateral-hop']
  },

  // ==================== 背部动作 ====================
  {
    id: 'superman',
    name: '超人式',
    nameEn: 'Superman',
    description: '俯卧抬臂抬腿，强化下背部和臀部。',
    muscles: ['back', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '俯卧，双臂向前伸直',
      '同时抬起双臂和双腿',
      '保持2-3秒后缓慢下放',
      '收紧臀部和下背部'
    ],
    mistakes: [
      '抬得过高导致腰部压力',
      '动作过快'
    ],
    alternatives: ['swimmer', 'bird-dog']
  },
  {
    id: 'swimmer',
    name: '游泳式',
    nameEn: 'Swimmer',
    description: '俯卧交替抬臂抬腿，锻炼背部和臀部。',
    muscles: ['back', 'glutes'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '俯卧，双臂向前伸直',
      '对侧手臂和腿交替抬起',
      '保持核心稳定',
      '持续交替'
    ],
    mistakes: [
      '动作过快',
      '腰部过度弯曲'
    ],
    alternatives: ['superman', 'bird-dog']
  },
  {
    id: 'doorframe-row',
    name: '门框划船',
    nameEn: 'Doorframe Row',
    description: '利用门框进行的背部训练动作。',
    muscles: ['back', 'arms'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'doorframe',
    tips: [
      '双手抓住门框两侧',
      '身体后倾，手臂伸直',
      '用手臂和背部发力拉起身体',
      '肩胛骨后缩'
    ],
    mistakes: [
      '仅用手臂发力',
      '身体摇摆'
    ],
    alternatives: ['table-row', 'towel-row']
  },
  {
    id: 'cat-cow',
    name: '猫牛式',
    nameEn: 'Cat-Cow',
    description: '瑜伽动作，伸展和活动脊椎。',
    muscles: ['back', 'core'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '四足跪姿',
      '吸气时塌腰抬头（牛式）',
      '呼气时拱背低头（猫式）',
      '配合呼吸缓慢进行'
    ],
    mistakes: [
      '动作过快',
      '呼吸不配合'
    ],
    alternatives: ['child-pose', 'bird-dog']
  },

  // ==================== 肩部动作 ====================
  {
    id: 'pike-push-up',
    name: '屈体俯卧撑',
    nameEn: 'Pike Push-up',
    description: '倒立俯卧撑的简化版，锻炼肩部。',
    muscles: ['shoulders', 'arms'],
    difficulty: 'intermediate',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双手撑地，臀部抬起呈倒V形',
      '屈肘降低头顶向地面',
      '推起回到起始位置',
      '保持臀部高抬'
    ],
    mistakes: [
      '臀部下塌',
      '手肘外展过大'
    ],
    alternatives: ['handstand-push-up', 'dumbbell-shoulder-press']
  },
  {
    id: 'arm-circles',
    name: '手臂画圈',
    nameEn: 'Arm Circles',
    description: '简单的肩部热身和训练动作。',
    muscles: ['shoulders'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '双臂侧平举至肩高',
      '小幅度向前画圈',
      '然后向后画圈',
      '保持手臂伸直'
    ],
    mistakes: [
      '手臂下垂',
      '画圈过大导致肩部不适'
    ],
    alternatives: ['shoulder-taps', 'pike-push-up']
  },
  {
    id: 'shoulder-taps',
    name: '肩部轻拍',
    nameEn: 'Shoulder Taps',
    description: '平板支撑变体，锻炼肩部和核心稳定性。',
    muscles: ['shoulders', 'core', 'arms'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '手掌平板支撑姿势',
      '一手离地触碰对侧肩膀',
      '交替进行',
      '保持身体稳定不晃动'
    ],
    mistakes: [
      '臀部摇摆',
      '核心松弛'
    ],
    alternatives: ['plank', 'plank-up-down']
  },

  // ==================== 手臂动作 ====================
  {
    id: 'tricep-dip',
    name: '三头肌臂屈伸',
    nameEn: 'Tricep Dip',
    description: '利用椅子或沙发锻炼肱三头肌。',
    muscles: ['arms'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'chair',
    tips: [
      '双手撑在椅子边缘，手指朝前',
      '双腿前伸或弯曲',
      '屈肘降低身体',
      '推起回到起始位置'
    ],
    mistakes: [
      '手肘外展',
      '下降过深导致肩部压力',
      '动作过快'
    ],
    alternatives: ['bench-dip', 'chair-dip']
  },
  {
    id: 'floor-tricep-dip',
    name: '地面三头肌臂屈伸',
    nameEn: 'Floor Tricep Dip',
    description: '地面版三头肌训练，更简单。',
    muscles: ['arms'],
    difficulty: 'beginner',
    type: 'strength',
    equipment: 'none',
    tips: [
      '坐在地面，膝盖弯曲',
      '双手在臀部两侧撑地',
      '臀部抬离地面',
      '屈肘降低后推起'
    ],
    mistakes: [
      '臀部坐回地面',
      '手肘外展'
    ],
    alternatives: ['tricep-dip', 'diamond-push-up']
  },

  // ==================== 拉伸动作 ====================
  {
    id: 'downward-dog',
    name: '下犬式',
    nameEn: 'Downward Dog',
    description: '经典瑜伽姿势，伸展全身后侧链。',
    muscles: ['legs', 'shoulders'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '四足跪姿开始',
      '臀部向上推起',
      '身体呈倒V形',
      '脚跟尽量贴地'
    ],
    mistakes: [
      '背部拱起',
      '肩膀耸起'
    ],
    alternatives: ['cat-cow', 'forward-fold']
  },
  {
    id: 'childs-pose',
    name: '婴儿式',
    nameEn: 'Child\'s Pose',
    description: '放松姿势，伸展背部和髋部。',
    muscles: ['back', 'legs'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '跪姿，臀部坐向脚跟',
      '双臂向前伸直',
      '额头触地',
      '深呼吸放松'
    ],
    mistakes: [
      '臀部离地',
      '肩膀紧张'
    ],
    alternatives: ['cat-cow', 'downward-dog']
  },
  {
    id: 'hip-flexor-stretch',
    name: '髋屈肌拉伸',
    nameEn: 'Hip Flexor Stretch',
    description: '跪姿拉伸髋屈肌群。',
    muscles: ['legs'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '单膝跪地，前脚呈弓步',
      '臀部向前推',
      '感受后腿髋部前侧拉伸',
      '保持30秒'
    ],
    mistakes: [
      '前膝盖超过脚尖',
      '后背过度伸展'
    ],
    alternatives: ['pigeon-pose', 'lunge-stretch']
  },
  {
    id: 'hamstring-stretch',
    name: '腘绳肌拉伸',
    nameEn: 'Hamstring Stretch',
    description: '坐姿前屈拉伸大腿后侧。',
    muscles: ['legs'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '坐姿，双腿向前伸直',
      '上半身前倾',
      '双手触碰脚踝或脚尖',
      '保持背部尽量平直'
    ],
    mistakes: [
      '膝盖弯曲',
      '动作过快弹震'
    ],
    alternatives: ['standing-hamstring-stretch', 'forward-fold']
  },
  {
    id: 'quad-stretch',
    name: '股四头肌拉伸',
    nameEn: 'Quad Stretch',
    description: '站立拉伸大腿前侧。',
    muscles: ['legs'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '站立，一手扶墙保持平衡',
      '一脚向后弯曲，手抓住脚踝',
      '脚跟拉向臀部',
      '感受大腿前侧拉伸'
    ],
    mistakes: [
      '膝盖过度后伸',
      '身体前倾'
    ],
    alternatives: ['kneeling-quad-stretch', 'lying-quad-stretch']
  },
  {
    id: 'chest-stretch',
    name: '胸部拉伸',
    nameEn: 'Chest Stretch',
    description: '门口胸部拉伸，改善含胸驼背。',
    muscles: ['chest'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'doorframe',
    tips: [
      '站在门口',
      '前臂贴在门框上',
      '身体前倾穿过门口',
      '感受胸部拉伸'
    ],
    mistakes: [
      '拉伸过猛',
      '肩膀耸起'
    ],
    alternatives: ['doorway-stretch', 'wall-chest-stretch']
  },
  {
    id: 'seated-spinal-twist',
    name: '坐姿脊柱扭转',
    nameEn: 'Seated Spinal Twist',
    description: '坐姿扭转，伸展背部和臀部。',
    muscles: ['back', 'glutes'],
    difficulty: 'beginner',
    type: 'stretch',
    equipment: 'none',
    tips: [
      '坐姿，一腿弯曲跨过另一腿',
      '对侧手臂抵住膝盖',
      '身体向弯曲腿方向扭转',
      '保持30秒换边'
    ],
    mistakes: [
      '扭转过猛',
      '臀部离地'
    ],
    alternatives: ['supine-spinal-twist', 'russian-twist']
  }
];

// 按肌群分组
export const exercisesByMuscle = exercises.reduce((acc, exercise) => {
  exercise.muscles.forEach(muscle => {
    if (!acc[muscle]) {
      acc[muscle] = [];
    }
    acc[muscle].push(exercise);
  });
  return acc;
}, {} as Record<string, Exercise[]>);

// 按难度分组
export const exercisesByDifficulty = {
  beginner: exercises.filter(e => e.difficulty === 'beginner'),
  intermediate: exercises.filter(e => e.difficulty === 'intermediate'),
  advanced: exercises.filter(e => e.difficulty === 'advanced'),
};

// 根据 ID 获取动作
export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

// 根据条件筛选动作
export function filterExercises(options: {
  muscles?: string[];
  difficulty?: string;
  type?: string;
  equipment?: string;
}): Exercise[] {
  return exercises.filter(exercise => {
    if (options.muscles && options.muscles.length > 0) {
      if (!options.muscles.some(m => exercise.muscles.includes(m as any))) {
        return false;
      }
    }
    if (options.difficulty && exercise.difficulty !== options.difficulty) {
      return false;
    }
    if (options.type && exercise.type !== options.type) {
      return false;
    }
    if (options.equipment && exercise.equipment !== options.equipment) {
      return false;
    }
    return true;
  });
}

// 动作总数
export const totalExercises = exercises.length;