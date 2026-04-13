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
    content: '蛋白质文章内容...',
    contentEn: 'Protein article content...',
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
    content: '减脂饮食文章内容...',
    contentEn: 'Fat loss diet content...',
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
    content: '女性力量训练文章内容...',
    contentEn: 'Women strength training content...',
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

