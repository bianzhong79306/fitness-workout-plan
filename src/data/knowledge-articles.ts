// 训练知识库文章数据
// 文章来源：AI生成初稿 + 人工审核

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  category: 'training_principle' | 'periodization' | 'population_guide' | 'specialized';
  categoryZh: string;
  categoryEn: string;
  summary: string;
  summaryEn: string;
  content: string; // Markdown 格式
  contentEn: string;
  tags: string[];
  relatedExercises: string[];
  isPremium: boolean;
  createdAt: string;
}

export const KNOWLEDGE_CATEGORIES = {
  training_principle: { zh: '训练原理', en: 'Training Principles' },
  periodization: { zh: '周期化训练', en: 'Periodization' },
  population_guide: { zh: '人群指南', en: 'Population Guides' },
  specialized: { zh: '专项训练', en: 'Specialized Training' },
};

// 知识库文章数据 - 专业健身知识，面向全球用户

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  // ==================== 训练原理 ====================
  {
    id: '1',
    slug: 'muscle-building-principles',
    title: '增肌的科学原理',
    titleEn: 'Scientific Principles of Muscle Building',
    category: 'training_principle',
    categoryZh: '训练原理',
    categoryEn: 'Training Principles',
    summary: '了解肌肉增长的生理机制，包括机械张力、代谢压力和肌肉损伤三大原理。',
    summaryEn: 'Understand the physiological mechanisms of muscle growth, including mechanical tension, metabolic stress, and muscle damage.',
    content: `
# 增肌的科学原理

## 肌肉增长的三大机制

科学研究表明，肌肉增长主要通过以下三种机制实现：

### 1. 机械张力（Mechanical Tension）

当肌肉受到外部负荷时，会产生机械张力。这种张力会激活肌肉细胞内的信号通路，促进蛋白质合成。

**要点**：
- 使用适当的重量（60-80% 1RM）
- 控制动作速度，保持张力
- 确保完整的动作行程

### 2. 代谢压力（Metabolic Stress）

当肌肉在高强度训练时，会积累代谢产物如乳酸、氢离子等，这种代谢压力会刺激肌肉生长。

**要点**：
- 较高的训练容量（8-15次/组）
- 较短的休息时间（60-90秒）
- 多组数训练

### 3. 肌肉损伤（Muscle Damage）

训练造成的微小肌肉损伤会触发修复过程，在这个过程中肌肉会变得更大更强。

**要点**：
- 新动作更容易造成损伤
- 离心收缩（下放阶段）更易损伤
- 适当的恢复时间很重要

## 增肌训练建议

| 因素 | 建议 |
|------|------|
| 训练频率 | 每周2-3次同一肌群 |
| 组数 | 每肌群10-20组/周 |
| 次数范围 | 6-15次/组 |
| 休息时间 | 60-90秒 |
| 进度 | 每周增加重量或次数 |

## 营养配合

- **蛋白质**：每公斤体重1.6-2.2g
- **热量**：每日额外增加300-500卡路里
- **碳水化合物**：训练前后补充充足
    `,
    contentEn: `
# Scientific Principles of Muscle Building

## Three Mechanisms of Muscle Growth

Scientific research shows muscle growth occurs through three main mechanisms:

### 1. Mechanical Tension

When muscles are subjected to external load, mechanical tension is created. This activates signaling pathways within muscle cells, promoting protein synthesis.

**Key Points**:
- Use appropriate weight (60-80% 1RM)
- Control movement speed, maintain tension
- Ensure full range of motion

### 2. Metabolic Stress

During high-intensity training, metabolic products like lactate accumulate, creating metabolic stress that stimulates muscle growth.

**Key Points**:
- Higher training volume (8-15 reps/set)
- Shorter rest periods (60-90 seconds)
- Multiple sets

### 3. Muscle Damage

Training causes microscopic muscle damage, triggering repair processes where muscles become bigger and stronger.

**Key Points**:
- New exercises cause more damage
- Eccentric contractions cause more damage
- Adequate recovery time is crucial

## Muscle Building Recommendations

| Factor | Recommendation |
|--------|----------------|
| Frequency | 2-3 times per week per muscle |
| Sets | 10-20 sets per muscle/week |
| Rep Range | 6-15 reps/set |
| Rest Time | 60-90 seconds |
| Progression | Increase weight or reps weekly |

## Nutritional Support

- **Protein**: 1.6-2.2g per kg body weight
- **Calories**: Extra 300-500 calories daily
- **Carbohydrates**: Adequate before and after training
    `,
    tags: ['增肌', 'muscle-building', '训练原理'],
    relatedExercises: ['push-up', 'squat', 'glute-bridge'],
    isPremium: false,
    createdAt: '2026-04-11',
  },
  {
    id: '2',
    slug: 'fat-loss-principles',
    title: '减脂的科学原理',
    titleEn: 'Scientific Principles of Fat Loss',
    category: 'training_principle',
    categoryZh: '训练原理',
    categoryEn: 'Training Principles',
    summary: '理解脂肪燃烧的生理机制，以及如何通过训练和饮食实现有效减脂。',
    summaryEn: 'Understand the physiological mechanisms of fat burning and how to achieve effective fat loss through training and diet.',
    content: `
# 减脂的科学原理

## 减脂的核心原理

减脂的本质是：**热量消耗 > 热量摄入**

### 基础代谢率（BMR）

即使不运动，身体也需要消耗能量来维持基本功能：
- 呼吸、心跳
- 维持体温
- 细胞修复

**影响因素**：
- 年龄：随年龄增长BMR下降
- 性别：男性通常BMR较高
- 肌肉量：肌肉越多，BMR越高

### 活动消耗

包括日常活动和运动：
- 日常活动（走路、站立等）
- 结构化训练（健身、跑步等）

### 减脂训练策略

1. **力量训练**：增加肌肉量，提高BMR
2. **HIIT训练**：短时间内高强度消耗
3. **有氧训练**：直接消耗脂肪

## 减脂饮食建议

| 因素 | 建议 |
|------|------|
| 热量缺口 | 300-500卡路里/天 |
| 蛋白质 | 每公斤体重1.8-2.2g |
| 碳水化合物 | 根据训练量调整 |
| 脂肪 | 占总热量20-30% |

## 常见误区

- ❌ 只做有氧，不做力量
- ❌ 过度削减热量
- ❌ 完全不吃碳水
- ✅ 力量+有氧组合最佳
    `,
    contentEn: `
# Scientific Principles of Fat Loss

## Core Principle of Fat Loss

The essence of fat loss: **Calories Burned > Calories Consumed**

### Basal Metabolic Rate (BMR)

Even without exercise, the body needs energy for basic functions:
- Breathing, heartbeat
- Temperature maintenance
- Cell repair

**Factors Affecting BMR**:
- Age: BMR decreases with age
- Gender: Men typically have higher BMR
- Muscle mass: More muscle = higher BMR

### Activity Expenditure

Includes daily activities and exercise:
- Daily activities (walking, standing, etc.)
- Structured training (gym, running, etc.)

### Fat Loss Training Strategies

1. **Strength Training**: Increase muscle mass, raise BMR
2. **HIIT Training**: High intensity in short time
3. **Cardio Training**: Direct fat consumption

## Fat Loss Nutrition Recommendations

| Factor | Recommendation |
|--------|----------------|
| Calorie Deficit | 300-500 calories/day |
| Protein | 1.8-2.2g per kg body weight |
| Carbohydrates | Adjust based on training |
| Fat | 20-30% of total calories |

## Common Mistakes

- ❌ Only cardio, no strength training
- ❌ Excessive calorie cutting
- ️ Complete carb elimination
- ✅ Strength + cardio combination is best
    `,
    tags: ['减脂', 'fat-loss', '训练原理'],
    relatedExercises: ['burpee', 'mountain-climber'],
    isPremium: false,
    createdAt: '2026-04-11',
  },
  {
    id: '3',
    slug: 'beginner-guide',
    title: '新手入门指南',
    titleEn: 'Beginner\'s Guide to Fitness',
    category: 'population_guide',
    categoryZh: '人群指南',
    categoryEn: 'Population Guides',
    summary: '健身新手如何开始？从动作选择、训练频率到注意事项，一站式入门指南。',
    summaryEn: 'How to start fitness as a beginner? From exercise selection to training frequency and precautions, a complete beginner\'s guide.',
    content: `
# 新手入门指南

## 第一步：设定目标

开始健身前，先明确你的目标：
- 增肌塑形
- 减脂瘦身
- 增强力量
- 提升体能

不同目标需要不同的训练策略。

## 第二步：选择适合的计划

作为新手，推荐：
- **频率**：每周3-4次
- **时长**：每次30-45分钟
- **内容**：全身训练或分部位训练

## 第三步：学习正确动作

最重要的一步！错误的动作会导致：
- 效果不佳
- 受伤风险
- 形成错误习惯

建议：
1. 从轻重量开始
2. 专注于动作标准
3. 请教练或有经验者指导

## 第四步：循序渐进

新手容易犯的错误：
- 急于加重量
- 训练过量
- 忽视休息

正确的做法：
- 每周增加不超过5%
- 听从身体信号
- 保证充足睡眠

## 推荐新手动作

| 肌群 | 动作 | 难度 |
|------|------|------|
| 胸部 | 平板支撑俯卧撑 | 初级 |
| 背部 | 引体向上（辅助） | 初级 |
| 腿部 | 深蹲 | 初级 |
| 核心 | 平板支撑 | 初级 |
    `,
    contentEn: `
# Beginner's Guide to Fitness

## Step 1: Set Your Goals

Before starting fitness, clarify your goals:
- Muscle building
- Fat loss
- Strength enhancement
- Fitness improvement

Different goals require different training strategies.

## Step 2: Choose Appropriate Plan

As a beginner, recommended:
- **Frequency**: 3-4 times per week
- **Duration**: 30-45 minutes each session
- **Content**: Full body or split training

## Step 3: Learn Correct Form

The most important step! Incorrect form leads to:
- Poor results
- Injury risk
- Wrong habits

Recommendations:
1. Start with light weight
2. Focus on proper form
3. Get guidance from coach or experienced person

## Step 4: Progressive Training

Common beginner mistakes:
- Rushing to add weight
- Overtraining
- Ignoring rest

Correct approach:
- Increase no more than 5% weekly
- Listen to body signals
- Ensure adequate sleep

## Recommended Beginner Exercises

| Muscle Group | Exercise | Level |
|--------------|----------|-------|
| Chest | Push-ups | Beginner |
| Back | Assisted pull-ups | Beginner |
| Legs | Squats | Beginner |
| Core | Plank | Beginner |
    `,
    tags: ['新手', 'beginner', '入门指南'],
    relatedExercises: ['push-up', 'squat', 'plank'],
    isPremium: false,
    createdAt: '2026-04-11',
  },
  {
    id: '6',
    slug: 'protein-guide',
    title: '蛋白质完全指南：增肌减脂的核心营养',
    titleEn: 'The Complete Protein Guide: Core Nutrition for Muscle Building and Fat Loss',
    category: 'training_principle',
    categoryZh: '训练原理',
    categoryEn: 'Training Principles',
    summary: '蛋白质是肌肉生长的建筑材料。掌握蛋白质摄入时机、来源选择和分配策略，最大化训练效果。',
    summaryEn: 'Protein is the building material for muscle growth. Master protein timing, source selection, and distribution strategies to maximize training results.',
    content: `
# 蛋白质完全指南：增肌减脂的核心营养

蛋白质是肌肉生长的基石。无论你是想增肌还是减脂，蛋白质摄入都至关重要。

## 为什么蛋白质如此重要？

### 1. 肌肉合成的基础

肌肉组织主要由蛋白质构成。当你训练时，肌肉纤维受到微小损伤，蛋白质提供氨基酸来修复和重建这些纤维，使肌肉变得更大更强。

### 2. 防止肌肉流失

减脂期如果蛋白质摄入不足，身体会分解肌肉来获取能量。充足的蛋白质可以保护你的肌肉，让你减掉的是脂肪而非肌肉。

### 3. 增强饱腹感

蛋白质比碳水化合物和脂肪更能让你感到饱足。高蛋白饮食可以自然减少你的食欲，有助于减脂。

## 你需要多少蛋白质？

| 目标 | 每日推荐摄入量 |
|------|----------------|
| 维持健康 | 0.8g/kg体重 |
| 增肌 | 1.6-2.2g/kg体重 |
| 减脂保肌 | 1.8-2.4g/kg体重 |

**例子**：70kg的人增肌期每天需要112-154g蛋白质。

## 优质蛋白质来源

### 动物蛋白（完全蛋白）

| 来源 | 每100g蛋白质含量 |
|------|------------------|
| 鸡胸肉 | 31g |
| 牛肉 | 26g |
| 鱼类 | 20-25g |
| 鸡蛋 | 13g（每个约6g） |
| 牛奶 | 3.4g |

### 植物蛋白

| 来源 | 每100g蛋白质含量 |
|------|------------------|
| 豆类 | 20-25g |
| 坚果 | 15-20g |
| 豆腐 | 8-15g |
| 豆浆 | 2-3g |

**建议**：动物蛋白氨基酸更完整，植物蛋白需要多样化搭配。

## 蛋白质摄入时机

### 训练前（1-2小时）
摄入20-30g蛋白质，为训练提供氨基酸储备。

### 训练后（30分钟内）
这是肌肉合成最活跃的时期。摄入25-40g快速吸收的蛋白质（如乳清蛋白），配合碳水化合物效果更好。

### 全天分配
每餐都应有蛋白质，而非一顿吃太多。每餐20-40g，分3-5餐摄入。

## 蛋白质补剂

### 乳清蛋白
- 吸收快，适合训练后
- 每勺约20-25g蛋白质

### 酪蛋白
- 吸收慢，适合睡前
- 持续释放氨基酸，防止夜间肌肉分解

### 大豆蛋白
- 适合素食者
- 氨基酸完整度略低于动物蛋白

## 常见误区

❌ "吃太多蛋白质伤肾"
健康人群摄入高蛋白（2g/kg以内）不会伤肾。有肾病的人需遵医嘱。

❌ "只有吃肉才有蛋白质"
豆类、坚果、谷物都含蛋白质，植物蛋白也能满足需求。

❌ "蛋白质补剂必需"
补剂只是方便的选择，从食物获取蛋白质更经济、更健康。

## 总结要点

1. 增肌期：1.6-2.2g/kg体重
2. 减脂期：1.8-2.4g/kg体重
3. 每餐都分配蛋白质
4. 训练后及时补充
5. 食物优于补剂
    `,
    contentEn: `
# The Complete Protein Guide: Core Nutrition for Muscle Building and Fat Loss

Protein is the foundation of muscle growth. Whether you want to build muscle or lose fat, protein intake is crucial.

## Why Protein Matters?

### 1. Foundation of Muscle Synthesis

Muscle tissue is primarily made of protein. When you train, muscle fibers undergo microscopic damage. Protein provides amino acids to repair and rebuild these fibers, making muscles bigger and stronger.

### 2. Prevent Muscle Loss

During fat loss, insufficient protein intake causes the body to break down muscle for energy. Adequate protein protects your muscle, ensuring you lose fat, not muscle.

### 3. Increases Satiety

Protein makes you feel fuller than carbohydrates or fats. High-protein diets naturally reduce appetite, aiding fat loss.

## How Much Protein Do You Need?

| Goal | Daily Recommended Intake |
|------|-------------------------|
| Maintenance | 0.8g/kg body weight |
| Muscle Building | 1.6-2.2g/kg body weight |
| Fat Loss (preserve muscle) | 1.8-2.4g/kg body weight |

**Example**: A 70kg person building muscle needs 112-154g protein daily.

## Quality Protein Sources

### Animal Protein (Complete)

| Source | Protein per 100g |
|--------|------------------|
| Chicken breast | 31g |
| Beef | 26g |
| Fish | 20-25g |
| Eggs | 13g (~6g each) |
| Milk | 3.4g |

### Plant Protein

| Source | Protein per 100g |
|--------|------------------|
| Beans | 20-25g |
| Nuts | 15-20g |
| Tofu | 8-15g |
| Soy milk | 2-3g |

**Tip**: Animal protein has more complete amino acids. Plant proteins need variety.

## Protein Timing

### Pre-Training (1-2 hours)
Consume 20-30g protein to provide amino acid reserve.

### Post-Training (within 30 min)
This is peak muscle synthesis period. Take 25-40g fast-absorbing protein (like whey) with carbs.

### Throughout Day
Protein at every meal, not all at once. 20-40g per meal, spread across 3-5 meals.

## Protein Supplements

### Whey Protein
- Fast absorption, ideal post-training
- ~20-25g per scoop

### Casein
- Slow absorption, good before bed
- Continuous amino acid release, prevents nighttime muscle breakdown

### Soy Protein
- Suitable for vegetarians
- Slightly less complete than animal protein

## Common Misconceptions

❌ "Too much protein damages kidneys"
Healthy people can handle high protein (up to 2g/kg) safely. Those with kidney disease should follow medical advice.

❌ "Only meat has protein"
Beans, nuts, grains all contain protein. Plant protein can meet needs too.

❌ "Supplements are necessary"
Supplements are just convenient. Food sources are more economical and healthier.

## Key Takeaways

1. Muscle building: 1.6-2.2g/kg body weight
2. Fat loss: 1.8-2.4g/kg body weight
3. Distribute protein across meals
4. Refuel promptly post-training
5. Food first, supplements second
    `,
    tags: ['蛋白质', 'protein', '营养', '增肌', '减脂'],
    relatedExercises: ['squat', 'bench-press', 'deadlift'],
    isPremium: false,
    createdAt: '2026-04-13',
  },
  {
    id: '7',
    slug: 'fat-loss-diet',
    title: '减脂期饮食策略：吃饱也能瘦',
    titleEn: 'Fat Loss Diet Strategy: Lose Weight Without Starving',
    category: 'training_principle',
    categoryZh: '训练原理',
    categoryEn: 'Training Principles',
    summary: '减脂不需要挨饿。掌握热量缺口、营养分配和饮食时机，健康可持续地降低体脂。',
    summaryEn: 'Fat loss does not require starvation. Master calorie deficit, nutrient distribution, and meal timing for healthy, sustainable body fat reduction.',
    content: `
# 减脂期饮食策略：吃饱也能瘦

减脂不等于挨饿。科学的饮食策略让你在吃饱的同时，稳步降低体脂。

## 核心原则：热量缺口

减脂的根本是：**消耗 > 摄入**

### 什么是热量缺口？

每日热量缺口300-500卡路里是最健康的范围。过大的缺口会导致：
- 肌肉流失
- 代谢下降
- 容易反弹

### 如何计算你的需求？

1. 计算基础代谢率（BMR）
2. 加上活动消耗
3. 减去300-500卡

**简单估算**：
- 男性维持热量 ≈ 体重(kg) × 35
- 女性维持热量 ≈ 体重(kg) × 30

减脂期从维持热量减去400卡左右。

## 营养分配

### 蛋白质：最高优先级

减脂期蛋白质摄入要**更高**，防止肌肉流失。

**推荐**：每公斤体重1.8-2.4g

### 碳水化合物：训练的燃料

碳水不是敌人，关键是选择和时间。

| 类型 | 适合时机 |
|------|----------|
| 复合碳水（燕麦、糙米） | 全天 |
| 简单碳水（水果） | 训练前后 |

**技巧**：训练日多吃碳水，休息日减少碳水。

### 脂肪：不要完全剔除

脂肪是激素合成必需品。占总热量20-30%。

**优质脂肪来源**：
- 橄榄油
- 坚果
- 鱼类
- 鸡蛋

## 餐食安排

### 一日三餐模板（减脂期）

**早餐**：
- 2个鸡蛋 + 燕麦 + 牛奶
- 约30g蛋白质

**午餐**：
- 150g鸡胸肉 + 糙米 + 蔬菜
- 约40g蛋白质

**晚餐**：
- 100g鱼肉 + 蔬菜沙拉
- 约25g蛋白质

**加餐（可选）**：
- 蛋白粉摇摇杯
- 或希腊酸奶

### 进食顺序

1. 先吃蔬菜（增加饱腹感）
2. 再吃蛋白质
3. 最后吃碳水

这个顺序可以自然减少热量摄入。

## 实用技巧

### 增加饱腹感的方法

- 每餐先喝一杯水
- 多吃高纤维蔬菜
- 选择固体食物而非液体
- 慢慢吃，细嚼慢咽

### 避免隐形热量

| 来源 | 隐形热量 |
|------|----------|
| 饮料 | 含糖饮料200+卡 |
| 调料 | 沙拉酱100+卡 |
| 油炸 | 热量翻倍 |
| 酒精 | 每100ml约70卡 |

### 间歇断食（可选）

16:8断食：每天16小时不进食，8小时进食窗口。

适合人群：
- 进食控制困难的人
- 早上不饿的人

不适合：
- 有胃病的人
- 孕妇
- 青少年

## 减脂周期

### 推荐周期

减脂不应持续太久。建议4-8周后休息2周，让代谢恢复。

### 监测指标

- 每周体重变化：0.5-1kg
- 体脂率测量
- 照片对比
- 腰围测量

**重要**：体重不是唯一指标，体脂率和体形更重要。

## 总结要点

1. 热量缺口300-500卡
2. 蛋白质加量（1.8-2.4g/kg）
3. 每餐先蔬菜后碳水
4. 避免隐形热量
5. 4-8周后休息
    `,
    contentEn: `
# Fat Loss Diet Strategy: Lose Weight Without Starving

Fat loss does not equal starvation. Scientific diet strategies let you feel full while steadily reducing body fat.

## Core Principle: Calorie Deficit

Fat loss fundamental: **Burn more than you consume**

### What is Calorie Deficit?

Daily deficit of 300-500 calories is the healthy range. Larger deficits cause:
- Muscle loss
- Metabolism drop
- Easy rebound

### Calculate Your Needs

1. Calculate Basal Metabolic Rate (BMR)
2. Add activity expenditure
3. Subtract 300-500 calories

**Simple Estimate**:
- Male maintenance ≈ weight(kg) × 35
- Female maintenance ≈ weight(kg) × 30

Subtract ~400 calories for fat loss.

## Nutrient Distribution

### Protein: Highest Priority

During fat loss, protein intake should be **higher** to prevent muscle loss.

**Recommendation**: 1.8-2.4g per kg body weight

### Carbohydrates: Training Fuel

Carbs are not enemies. Key is choice and timing.

| Type | Best Timing |
|------|------------|
| Complex carbs (oats, brown rice) | Throughout day |
| Simple carbs (fruit) | Pre/post-training |

**Technique**: More carbs on training days, less on rest days.

### Fat: Don't Eliminate

Fat is essential for hormone synthesis. 20-30% of total calories.

**Quality Fat Sources**:
- Olive oil
- Nuts
- Fish
- Eggs

## Meal Structure

### Daily Template (Fat Loss)

**Breakfast**:
- 2 eggs + oats + milk
- ~30g protein

**Lunch**:
- 150g chicken breast + brown rice + vegetables
- ~40g protein

**Dinner**:
- 100g fish + vegetable salad
- ~25g protein

**Snack (optional)**:
- Protein shake
- Or Greek yogurt

### Eating Order

1. Vegetables first (increase fullness)
2. Protein next
3. Carbs last

This order naturally reduces calorie intake.

## Practical Tips

### Increase Satiety

- Drink water before meals
- Eat high-fiber vegetables
- Choose solid over liquid foods
- Eat slowly, chew thoroughly

### Avoid Hidden Calories

| Source | Hidden Calories |
|--------|----------------|
| Drinks | Sugary drinks 200+ cal |
| Condiments | Salad dressing 100+ cal |
| Fried foods | Doubles calories |
| Alcohol | ~70 cal per 100ml |

### Intermittent Fasting (Optional)

16:8 fasting: 16 hours no eating, 8-hour eating window.

Suitable for:
- Those struggling with portion control
- Those not hungry in morning

Not suitable for:
- People with stomach issues
- Pregnant women
- Adolescents

## Fat Loss Cycle

### Recommended Cycle

Fat loss shouldn't last too long. After 4-8 weeks, rest 2 weeks to restore metabolism.

### Monitoring Metrics

- Weekly weight change: 0.5-1kg
- Body fat measurement
- Photo comparison
- Waist measurement

**Important**: Weight isn't the only metric. Body fat and shape matter more.

## Key Takeaways

1. Calorie deficit 300-500 cal
2. Increase protein (1.8-2.4g/kg)
3. Vegetables before carbs each meal
4. Avoid hidden calories
5. Rest after 4-8 weeks
    `,
    tags: ['减脂', 'fat-loss', '饮食', '营养', '热量'],
    relatedExercises: ['cardio', 'hiit'],
    isPremium: true,
    createdAt: '2026-04-13',
  },
  {
    id: '8',
    slug: 'women-strength-training',
    title: '女性力量训练指南：打破偏见，塑造力量',
    titleEn: "Women Strength Training Guide: Break Stereotypes, Build Power",
    category: 'population_guide',
    categoryZh: '人群指南',
    categoryEn: 'Population Guides',
    summary: '女性不需要害怕力量训练。科学证明，力量训练让女性更健康、更有活力、身材更好。',
    summaryEn: "Women don't need to fear strength training. Science proves strength training makes women healthier, more energetic, and better shaped.",
    content: `
# 女性力量训练指南：打破偏见，塑造力量

很多女性担心力量训练会让自己变得"太壮"、"肌肉太大"。这是最大的误解。

科学真相：女性力量训练不会让你变成"金刚芭比"，反而会让你身材更好、更健康。

## 为什么女性不会练出"大肌肉"？

### 1. 激素差异

女性的睾酮水平只有男性的1/10到1/20。睾酮是肌肉生长的关键激素。没有足够的睾酮，很难练出大块肌肉。

### 2. 基因差异

女性的肌肉纤维类型和数量与男性不同，天生肌量上限较低。

**结论**：即使很努力训练，女性也很难练出"太大的肌肉"。你看到的那些女健美运动员，用了极极端的方法。

## 力量训练对女性的好处

### 身体层面

| 好处 | 说明 |
|------|------|
| 增强代谢 | 肌肉消耗更多热量，更容易保持身材 |
| 改善体态 | 紧致肌肉让身材线条更好 |
| 强化骨骼 | 预防骨质疏松 |
| 减少脂肪 | 力量训练消耗脂肪效率高 |

### 健康层面

- 降低心血管疾病风险
- 改善胰岛素敏感性
- 减少慢性疼痛
- 提升整体活力

### 心理层面

- 增强自信心
- 改善情绪
- 提升抗压能力

## 女性训练要点

### 不要害怕大重量

"小重量多次数"对女性来说效率很低。适当的挑战重量才能刺激肌肉生长。

**建议**：
- 选择能做8-12次的重量
- 每组最后几次应该有挑战感

### 关注全身发展

女性常只关注臀部和腹部，忽略其他部位。全身均衡发展才能有好体态。

**重点部位**：
- 腿部：深蹲、硬拉
- 背部：划船、引体向上
- 核心：平板支撑
- 胸部：俯卧撑

### 不要只做有氧

很多女性只跑步、跳操，不做力量训练。这会导致：
- 肌肉流失
- 身体松弛
- 代谢下降

**正确做法**：有氧 + 力量结合

## 常见误区

❌ "力量训练会让女生变成男的"
完全错误。力量训练不会改变你的性别特征。

❌ "女生应该只做小重量"
小重量效率低。适当重量才有效。

❌ "力量训练危险"
正确指导下比跑步更安全。

❌ "练了两天就怕肌肉太大"
肌肉生长需要数月甚至数年。不是几天的事。

## 给女性的训练建议

### 初学者（0-3个月）

每周2-3次，每次30-40分钟

**推荐动作**：
- 深蹲 3×12
- 硬拉 3×10
- 俯卧撑 3×10（可膝盖着地）
- 平板支撑 3×30秒

### 进阶者（3-6个月）

每周3-4次，开始分化训练

**分化方案**：
- 第1天：腿部
- 第2天：上身
- 第3天：核心 + 有氧

### 关于饮食

不需要极端节食。

- 蛋白质：每公斤体重1.2-1.6g
- 热量：维持或略少
- 不要恐惧碳水

## 总结要点

1. 女性不会轻易练出大肌肉
2. 力量训练让身材更好
3. 不要害怕适当重量
4. 全身均衡发展
5. 有氧 + 力量结合

**记住**：力量训练是女性最好的投资，让你年轻、健康、自信。
    `,
    contentEn: `
# Women Strength Training Guide: Break Stereotypes, Build Power

Many women worry strength training will make them "too bulky" or "too muscular." This is the biggest misconception.

Scientific truth: Strength training won't make you a "bodybuilder." Instead, it will improve your shape and health.

## Why Women Won't Build "Big Muscles"

### 1. Hormonal Differences

Women have 1/10 to 1/20 the testosterone levels of men. Testosterone is crucial for muscle growth. Without enough testosterone, building large muscles is very difficult.

### 2. Genetic Differences

Women have different muscle fiber types and quantities, with naturally lower muscle mass ceiling.

**Conclusion**: Even with dedicated training, women rarely build "too large muscles." Those female bodybuilders you see used extreme methods.

## Benefits of Strength Training for Women

### Physical

| Benefit | Explanation |
|---------|-------------|
| Boosts metabolism | Muscles burn more calories, easier to maintain figure |
| Improves posture | Toned muscles create better body lines |
| Strengthens bones | Prevents osteoporosis |
| Reduces fat | Strength training burns fat efficiently |

### Health

- Lower cardiovascular disease risk
- Improve insulin sensitivity
- Reduce chronic pain
- Increase overall vitality

### Psychological

- Boost confidence
- Improve mood
- Enhance stress resilience

## Training Tips for Women

### Don't Fear Heavy Weights

"Light weight, many reps" is inefficient for women. Proper challenging weight stimulates muscle growth.

**Recommendation**:
- Choose weight you can do 8-12 reps
- Last few reps should feel challenging

### Focus on Full Body

Women often focus only on glutes and abs, ignoring other areas. Balanced full-body development creates good posture.

**Key Areas**:
- Legs: Squats, deadlifts
- Back: Rows, pull-ups
- Core: Planks
- Chest: Push-ups

### Don't Only Do Cardio

Many women only run, skip, dance—no strength training. This causes:
- Muscle loss
- Body looseness
- Metabolism drop

**Right Approach**: Combine cardio + strength

## Common Misconceptions

❌ "Strength training makes women masculine"
Completely wrong. Strength training won't change your gender characteristics.

❌ "Women should only use light weights"
Light weights are inefficient. Proper weight is effective.

❌ "Strength training is dangerous"
With proper guidance, safer than running.

❌ "Afraid of getting too muscular after 2 days"
Muscle growth takes months or years. Not a few days.

## Training Recommendations for Women

### Beginners (0-3 months)

2-3 times per week, 30-40 minutes each

**Recommended Exercises**:
- Squat 3×12
- Deadlift 3×10
- Push-up 3×10 (can use knees)
- Plank 3×30 sec

### Intermediate (3-6 months)

3-4 times per week, start split training

**Split Plan**:
- Day 1: Legs
- Day 2: Upper body
- Day 3: Core + cardio

### About Diet

No need for extreme dieting.

- Protein: 1.2-1.6g per kg body weight
- Calories: Maintenance or slightly less
- Don't fear carbs

## Key Takeaways

1. Women won't easily build large muscles
2. Strength training improves body shape
3. Don't fear appropriate weights
4. Balanced full-body development
5. Combine cardio + strength

**Remember**: Strength training is women's best investment—keeping you young, healthy, and confident.
    `,
    tags: ['女性', 'women', '力量训练', '健身', '健康'],
    relatedExercises: ['squat', 'deadlift', 'bench-press'],
    isPremium: false,
    createdAt: '2026-04-13',
  }];

// 获取所有文章
export function getAllArticles(): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES;
}

// 按分类获取文章
export function getArticlesByCategory(category: string): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES.filter(article => article.category === category);
}

// 获取免费文章
export function getFreeArticles(): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES.filter(article => !article.isPremium);
}

// 按slug获取文章
export function getArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find(article => article.slug === slug);
}

// 按id获取文章
export function getArticleById(id: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find(article => article.id === id);
}

