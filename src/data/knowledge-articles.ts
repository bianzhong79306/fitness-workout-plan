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
];

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

  {
    id: '4',
    slug: 'progressive-overload',
    title: '渐进超负荷：持续进步的核心法则',
    titleEn: 'Progressive Overload: The Core Principle of Continuous Gains',
    category: 'training_principle',
    categoryZh: '训练原理',
    categoryEn: 'Training Principles',
    summary: '为什么训练要不断增加重量？掌握渐进超负荷原理，让你的每一次训练都产生实际效果。',
    summaryEn: 'Why should you constantly increase weight in training? Master the principle of progressive overload to make every session count.',
    content: `
![Progressive Overload](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200)

# 渐进超负荷：持续进步的核心法则

## 什么是渐进超负荷？

渐进超负荷（Progressive Overload）是力量训练和肌肉增长的**第一性原理**。简单来说：**为了让身体持续适应和变强，你必须持续给它更大的刺激。**

这不是什么高深理论，而是人体的基本生存机制。当你的肌肉面对比上次更大的负荷时，它会认为"环境变危险了，我需要变得更强来应对"。于是，肌肉蛋白质合成增加，肌纤维变粗，力量提升。

## 为什么很多人练了没效果？

健身房里常见这样的场景：
- 小明练卧推，三个月了还是用 60kg 做 10 次
- 小红跑步，半年了还是同样的速度和距离
- 小李做深蹲，重量从来没变过

**结果：身体早就适应了，不再进步。**

人体是高效的适应机器。当你第一次举起 20kg，肌肉会受到强烈刺激。但连续十次后，身体已经习惯了，刺激效果大打折扣。如果不增加负荷，肌肉就没有理由继续增长。

## 如何实现渐进超负荷？

### 方法一：增加重量（最常用）

这是最直接的方式。

| 周次 | 重量 | 次数 | 备注 |
|------|------|------|------|
| 1 | 60kg | 8次 | 基础重量 |
| 2 | 62.5kg | 8次 | +2.5kg |
| 3 | 65kg | 8次 | +2.5kg |
| 4 | 65kg | 10次 | 增加次数 |
| 5 | 67.5kg | 8次 | 再增重量 |

**关键**：每次增幅 2.5-5kg，不要贪多。

### 方法二：增加次数

当重量暂时无法增加时，先增加次数。

- 上周：60kg × 8 次
- 本周：60kg × 10 次
- 下周：60kg × 12 次
- 再下周：62.5kg × 8 次（然后重新开始循环）

### 方法三：增加组数

从 3 组增加到 4 组，训练容量直接提升 33%。

适合：基础期或恢复训练阶段。

### 方法四：缩短休息时间

- 原来休息 90 秒，现在休息 60 秒
- 代谢压力增加，肌肉耐力提升
- 注意：力量训练不建议休息太短

### 方法五：改善动作质量

同样的重量，动作做标准了，难度翻倍。

- 深蹲：从半蹲到全蹲
- 卧推：从弹胸到控制触胸
- 硬拉：从圆背到脊柱中立

## 实际应用示例

### 新手期（0-6 个月）

**每次训练都尝试增加重量**，哪怕只加 1-2kg。

这个阶段神经适应快，力量增长快，是建立习惯的最佳时期。

### 进阶期（6-12 个月）

**采用双周递进**：
- 第一周：增加次数（8→10→12）
- 第二周：增加重量，回到 8 次

### 成熟期（1 年以上）

**周期化训练**：
- 积累期（4周）：高容量，中等重量
- 强化期（3周）：中等容量，高重量
- 实现期（1周）：测试极限
- 减载期（1周）：恢复

## 常见误区

### ❌ 每次都要冲极限

渐进超负荷不等于每次都举最大重量。稳定的、可控的进步比偶尔的冲击更有效。

### ❌ 忽视恢复

超负荷需要超量恢复。如果睡眠不足、营养不够，增加负荷只会导致过度训练。

### ❌ 只关注重量

动作变形换来的重量增长没有意义，还增加受伤风险。宁可重量轻一点，也要保证动作标准。

### ❌ 线性思维

进步不是一条直线。会有平台期，会有退步，这是正常的。关键是长期趋势向上。

## 记录与追踪

**必须记录你的训练数据**，否则无法判断是否真正在进步。

推荐记录：
- 日期
- 动作名称
- 重量
- 组数 × 次数
- 主观感受（RPE 1-10）

可以使用 FitPlan Pro 的训练日志功能，自动追踪你的进步曲线。

## 总结

渐进超负荷不是选择，而是必然。想要持续进步，就必须持续给身体新的刺激。

记住这个公式：

> **刺激 → 适应 → 新的刺激 → 新的适应**

停止增加负荷，就等于停止进步。
    `,
    contentEn: `
![Progressive Overload](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200)

# Progressive Overload: The Core Principle of Continuous Gains

## What is Progressive Overload?

Progressive overload is the **first principle** of strength training and muscle growth. Simply put: **To make your body continuously adapt and grow stronger, you must consistently give it greater stimulus.**

This isn't complex theory—it's basic human survival mechanism. When your muscles face heavier load than last time, they interpret it as "the environment became more dangerous, I need to get stronger to handle it." As a result, muscle protein synthesis increases, muscle fibers thicken, and strength improves.

## Why Many People Train Without Results?

Common scenes in gyms:
- Mike benches 60kg for 10 reps for three months straight
- Sarah runs the same distance at the same pace for half a year
- David squats the same weight every session

**Result: The body adapted long ago and stopped progressing.**

The human body is an efficient adaptation machine. When you first lift 20kg, muscles receive strong stimulus. But after ten sessions, the body is used to it and the stimulus effect diminishes significantly. Without increasing load, muscles have no reason to keep growing.

## How to Implement Progressive Overload?

### Method 1: Increase Weight (Most Common)

The most direct approach.

| Week | Weight | Reps | Notes |
|------|--------|------|-------|
| 1 | 60kg | 8 reps | Base weight |
| 2 | 62.5kg | 8 reps | +2.5kg |
| 3 | 65kg | 8 reps | +2.5kg |
| 4 | 65kg | 10 reps | Increase reps |
| 5 | 67.5kg | 8 reps | Increase weight again |

**Key**: Increase by 2.5-5kg each time, don't be greedy.

### Method 2: Increase Reps

When weight can't increase temporarily, increase reps first.

- Last week: 60kg × 8 reps
- This week: 60kg × 10 reps
- Next week: 60kg × 12 reps
- Following week: 62.5kg × 8 reps (then restart the cycle)

### Method 3: Increase Sets

Going from 3 sets to 4 sets increases training volume by 33%.

Suitable for: Foundation phase or recovery training.

### Method 4: Reduce Rest Time

- Previously rested 90 seconds, now rest 60 seconds
- Metabolic stress increases, muscular endurance improves
- Note: Not recommended for pure strength training

### Method 5: Improve Movement Quality

Same weight, but with proper form doubles the difficulty.

- Squat: From half squat to full depth
- Bench press: From bouncing to controlled touch
- Deadlift: From rounded back to neutral spine

## Practical Application Examples

### Beginner Phase (0-6 months)

**Try to increase weight every session**, even if just 1-2kg.

This phase has rapid neural adaptation and strength gains—it's the best time to build habits.

### Intermediate Phase (6-12 months)

**Use bi-weekly progression**:
- Week 1: Increase reps (8→10→12)
- Week 2: Increase weight, return to 8 reps

### Advanced Phase (1+ years)

**Periodized training**:
- Accumulation (4 weeks): High volume, moderate weight
- Intensification (3 weeks): Moderate volume, heavy weight
- Realization (1 week): Test limits
- Deload (1 week): Recovery

## Common Mistakes

### ❌ Going to Failure Every Time

Progressive overload doesn't mean maxing out every session. Consistent, controllable progress is more effective than occasional max attempts.

### ❌ Ignoring Recovery

Overload requires supercompensation. Without adequate sleep and nutrition, increasing load only leads to overtraining.

### ❌ Focusing Only on Weight

Weight gained through poor form is meaningless and increases injury risk. Better to use lighter weight with proper form.

### ❌ Linear Thinking

Progress isn't a straight line. There will be plateaus and setbacks—this is normal. The key is the long-term upward trend.

## Recording and Tracking

**You must record your training data**, otherwise you can't determine if you're actually progressing.

Recommended records:
- Date
- Exercise name
- Weight
- Sets × Reps
- Subjective feeling (RPE 1-10)

Use FitPlan Pro's training log feature to automatically track your progress curve.

## Summary

Progressive overload isn't optional—it's mandatory. To keep progressing, you must continuously give your body new stimulus.

Remember this formula:

> **Stimulus → Adaptation → New Stimulus → New Adaptation**

Stop increasing load, and you stop progressing.
    `,
    tags: ['渐进超负荷', 'progressive-overload', '训练原理', '增肌', '力量增长'],
    relatedExercises: ['squat', 'bench-press', 'deadlift'],
    isPremium: false,
    createdAt: '2026-04-12',
  },
  // ==================== 动作技术 ====================
  {
    id: '5',
    slug: 'squat-complete-guide',
    title: '深蹲完全指南：从入门到精通',
    titleEn: 'The Complete Squat Guide: From Beginner to Advanced',
    category: 'specialized',
    categoryZh: '专项训练',
    categoryEn: 'Specialized Training',
    summary: '深蹲被称为动作之王。掌握正确的深蹲技术，安全有效地训练下肢和核心。',
    summaryEn: 'The squat is called the king of exercises. Master proper squat technique for safe and effective lower body and core training.',
    content: `
![Squat](https://images.unsplash.com/photo-1574680096145-d05b0e9b2e3a?w=1200)

# 深蹲完全指南：从入门到精通

深蹲被称为"动作之王"，不是没有道理的。它是唯一能同时刺激下肢所有肌群、核心稳定系统、甚至上身的复合动作。但深蹲也是技术门槛最高的动作之一，做错不仅没效果，还伤膝盖伤腰。

这篇指南，带你从 0 到 1 掌握完美深蹲。

## 为什么要练深蹲？

### 高效性：一个动作练全身

| 目标肌群 | 参与程度 | 作用 |
|----------|----------|------|
| 股四头肌 | ★★★★★ | 主要发力肌群，伸膝 |
| 臀大肌 | ★★★★☆ | 髋伸展，起身时发力 |
| 腘绳肌 | ★★★☆☆ | 髋伸展，稳定膝关节 |
| 内收肌 | ★★★☆☆ | 维持膝盖轨迹 |
| 竖脊肌 | ★★★☆☆ | 维持脊柱中立 |
| 腹横肌 | ★★★☆☆ | 核心稳定，腹内压 |
| 小腿肌群 | ★★☆☆☆ | 踝关节稳定 |

**结论**：深蹲是最高效的下肢训练动作，没有之一。

### 功能性：生活必需动作

从椅子上站起来、上厕所、搬重物...日常生活中你每天都在"深蹲"。练好深蹲，生活质量直接提升。

### 代谢收益：燃脂神器

大肌群参与 = 高能量消耗。深蹲后的过量氧耗（EPOC）能持续燃脂 24-48 小时。

## 深蹲的生物力学

### 关节活动度要求

- **踝关节**：背屈 15-20°（蹲不下去通常是这里受限）
- **膝关节**：屈曲 120-140°（全蹲需要）
- **髋关节**：屈曲 100-120°（久坐人群通常受限）

**自测**：面对墙站立，脚尖离墙 10cm，膝盖能碰到墙吗？不能说明踝关节受限。

### 力矩分析

深蹲时，杠铃重量 × 力臂 = 关节力矩。

- **膝盖前移越多** → 膝关节力矩越大 → 股四头肌压力越大
- **臀部后坐越多** → 髋关节力矩越大 → 臀大肌压力越大

**结论**：站距和蹲法决定练哪里。

## 完美深蹲的 5 个关键点

### 1. 站距：与肩同宽或略宽

![Stance](https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800)

**标准站距**：
- 双脚与肩同宽或略宽（1.2-1.5 倍肩宽）
- 脚尖外展 15-30°（因人而异）

**判断标准**：下蹲时膝盖能对准脚尖方向，不内扣。

### 2. 脊柱中立：核心收紧

**错误**：弓背（腰椎超伸）或圆背（腰椎屈曲）

**正确**：
- 挺胸，肩胛骨下沉
- 想象胸骨向上顶
- 全程保持腰椎自然曲度

**技巧**：深蹲前深吸一口气，屏住，腹内压增加 40%，脊柱稳定性大幅提升。

### 3. 膝盖轨迹：对准脚尖

**错误**：膝盖内扣（最常见错误）

![Knee Valgus](https://images.unsplash.com/photo-1581009146145-b5ef050c149e?w=800)

**危害**：
- 前交叉韧带（ACL）压力暴增
- 半月板磨损
- 髌骨轨迹异常

**纠正方法**：
- 站距加宽
- 脚尖外展角度增大
- 想象"把地面撕开"
- 加强臀中肌（蚌式开合、侧卧抬腿）

### 4. 深度：至少大腿平行地面

![Depth](https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800)

**平行深蹲**：大腿与地面平行，髋关节略低于膝关节

**全蹲**（Olympic Squat）：髋关节低于膝关节，腘绳肌贴小腿

**建议**：
- 健康人群：全蹲收益最大
- 膝关节问题：平行蹲即可
- 初学者：先掌握平行蹲，再尝试全蹲

### 5. 呼吸：瓦式呼吸法

**步骤**：
1. 站直，深吸一口气（吸到肚子里，不是胸腔）
2. 屏住呼吸，收紧核心（像有人要打你肚子）
3. 下蹲
4. 起身到最高点，呼气
5. 重复

**注意**：大重量时全程屏气，小重量可以在顶端换气。

## 常见错误与纠正

### 错误 1：膝盖过度前移

**表现**：下蹲时膝盖超过脚尖很多

**问题**：膝关节剪切力增大

**解决**：
- 想象"臀部向后坐"，不是"膝盖向前跪"
- 高杠位改低杠位（杠铃放在斜方肌下部）
- 穿举重鞋（后跟垫高）

### 错误 2：身体过度前倾

**表现**：蹲下去变成"早安式"弯腰

**问题**：腰椎压力巨大

**解决**：
- 改善踝关节活动度
- 穿举重鞋
- 减少下蹲深度（先练箱式深蹲）

### 错误 3：脚跟离地

**表现**：下蹲时脚跟抬起，重心前移

**问题**：稳定性丧失，膝关节压力增大

**解决**：
- 穿举重鞋
- 脚下垫 2.5kg 片
- 改善踝关节活动度

### 错误 4：屁股眨眼（Butt Wink）

**表现**：蹲到最低点时骨盆后倾，腰椎屈曲

**问题**：腰椎间盘压力暴增

**解决**：
- 减少下蹲深度到不眨眼的程度
- 改善髋关节活动度
- 加强核心稳定性

## 深蹲变式：不同目标不同选择

### 高杠深蹲（High Bar）

**杠铃位置**：斜方肌上部

**特点**：
- 躯干较直立
- 膝盖前移较多
- 股四头肌刺激更大

**适合**：举重运动员、股四头肌专项训练

### 低杠深蹲（Low Bar）

**杠铃位置**：斜方肌下部，三角肌后束上方

**特点**：
- 躯干前倾较多
- 臀部后坐更多
-  posterior chain（后链）刺激更大

**适合**：力量举、臀部专项训练

### 前蹲（Front Squat）

**杠铃位置**：三角肌前束，锁骨前方

**特点**：
- 躯干最直立
- 股四头肌刺激最大
- 上背部要求高

**适合**：举重、股四头肌专项训练

### 箱式深蹲（Box Squat）

**特点**：坐到箱子上，释放髋部屈肌张力

**好处**：
- 学习正确的坐姿启动
- 改善离心控制
- 适合初学者找感觉

## 训练计划安排

### 初学者（0-3 个月）

**频率**：每周 2 次

**安排**：
- 第 1 天：箱式深蹲 3×8，徒手深蹲 2×15
- 第 3 天：高杠深蹲 3×8，腿举 3×12

**重量**：从空杆（20kg）开始，每周增加 2.5kg

### 进阶者（3-12 个月）

**频率**：每周 2 次

**安排**：
- 第 1 天（重）：低杠深蹲 5×5
- 第 3 天（轻）：前蹲 3×8，罗马尼亚硬拉 3×10

**重量**：采用线性递增或周期化训练

### 高级者（1 年以上）

**频率**：每周 1-2 次

**安排**：
- 周期化训练
- 大重量日：1-3 次 × 3-5 组
- 容量日：8-12 次 × 3-4 组

**重量**：85-95% 1RM

## 安全提示

### 必须热身

**推荐流程**：
1. 5 分钟低强度有氧（慢跑、单车）
2. 动态拉伸（腿摆、深蹲转体）
3. 空杆深蹲 2×10
4. 正式组前 2-3 组热身（50%、70%、85% 重量）

### 使用保护装备

- **举重鞋**：后跟垫高，改善踝关节活动度
- **护膝**：保暖 + 心理安慰（大重量时）
- **腰带**：腹内压辅助（1.5 倍体重以上考虑）
- **护腕**：低杠深蹲时手腕压力大

### 知道什么时候停

**立即停止的信号**：
- 膝盖疼痛（不是肌肉酸胀）
- 腰部刺痛
- 头晕、恶心
- 动作完全变形

**记住**：一次逞强可能毁掉半年训练。

## 总结

深蹲是动作之王，但也是技术之王。掌握这 5 个关键点：

1. 站距合适
2. 脊柱中立
3. 膝盖对准脚尖
4. 深度到位
5. 呼吸正确

从空杆开始，每周增加一点点，一年后你会感谢现在的自己。

> **深蹲不会辜负你，只要你认真对待它。**
    `,
    contentEn: `
![Squat](https://images.unsplash.com/photo-1574680096145-d05b0e9b2e3a?w=1200)

# The Complete Squat Guide: From Beginner to Advanced

The squat is called the "king of exercises" for good reason. It's the only compound movement that simultaneously stimulates all lower body muscle groups, core stability systems, and even upper body. But squatting also has one of the highest technical barriers—do it wrong and you get no results plus injured knees and back.

This guide takes you from 0 to 1, mastering the perfect squat.

## Why Squat?

### Efficiency: One Exercise, Full Body

| Target Muscle | Involvement | Function |
|---------------|-------------|----------|
| Quadriceps | ★★★★★ | Primary mover, knee extension |
| Glutes | ★★★★☆ | Hip extension, power out of hole |
| Hamstrings | ★★★☆☆ | Hip extension, knee stability |
| Adductors | ★★★☆☆ | Maintain knee tracking |
| Erector Spinae | ★★★☆☆ | Maintain spinal neutrality |
| Transverse Abdominis | ★★★☆☆ | Core stability, intra-abdominal pressure |
| Calves | ★★☆☆☆ | Ankle stability |

**Conclusion**: Squat is the most efficient lower body exercise, period.

### Functionality: Essential Daily Movement

Standing up from a chair, using the toilet, lifting heavy objects... you "squat" every day in life. Master the squat, improve your quality of life directly.

### Metabolic Benefit: Fat Burning Machine

Large muscle groups involved = high energy expenditure. Excess post-exercise oxygen consumption (EPOC) from squats continues burning fat for 24-48 hours.

## Squat Biomechanics

### Joint Mobility Requirements

- **Ankle**: 15-20° dorsiflexion (can't squat deep? Usually limited here)
- **Knee**: 120-140° flexion (full squat requires)
- **Hip**: 100-120° flexion (sedentary people usually limited)

**Self-test**: Stand facing a wall, toes 10cm from wall, can your knee touch? No = ankle limitation.

### Moment Arm Analysis

During squat: Barbell weight × moment arm = joint moment.

- **More knee forward** → Greater knee moment → More quadriceps stress
- **More hip back** → Greater hip moment → More glute stress

**Conclusion**: Stance and squat style determine what you train.

## 5 Keys to Perfect Squat

### 1. Stance: Shoulder Width or Slightly Wider

![Stance](https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800)

**Standard Stance**:
- Feet shoulder width or slightly wider (1.2-1.5× shoulder width)
- Toes pointing out 15-30° (varies by individual)

**Judgment Standard**: When squatting, knees track over toes, not caving inward.

### 2. Neutral Spine: Core Tight

**Wrong**: Arching (hyperextension) or rounding (flexion)

**Right**:
- Chest up, shoulder blades down
- Imagine sternum pushing upward
- Maintain natural lumbar curve throughout

**Tip**: Take a deep breath before squatting, hold it—intra-abdominal pressure increases 40%, spinal stability greatly improved.

### 3. Knee Tracking: Over Toes

**Wrong**: Knee valgus (most common error)

![Knee Valgus](https://images.unsplash.com/photo-1581009146145-b5ef050c149e?w=800)

**Danger**:
- ACL stress skyrockets
- Meniscus wear
- Patellar tracking issues

**Correction Methods**:
- Wider stance
- Increase toe-out angle
- Imagine "ripping the floor apart"
- Strengthen gluteus medius (clamshells, side-lying leg raises)

### 4. Depth: At Least Thigh Parallel

![Depth](https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800)

**Parallel Squat**: Thigh parallel to ground, hip joint slightly below knee joint

**Full Squat** (Olympic): Hip below knee, hamstrings touch calves

**Recommendations**:
- Healthy individuals: Full squat for maximum benefit
- Knee issues: Parallel is sufficient
- Beginners: Master parallel first, then attempt full squat

### 5. Breathing: Valsalva Maneuver

**Steps**:
1. Stand tall, take deep breath (into belly, not chest)
2. Hold breath, brace core (like someone will punch your stomach)
3. Squat down
4. Stand up to top, exhale
5. Repeat

**Note**: Hold breath throughout for heavy weights, breathe at top for