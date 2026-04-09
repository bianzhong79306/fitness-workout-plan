// AI 计划生成服务

// 阿里云 Coding Plan API 配置（Wenwen AI 不稳定）
const AI_CONFIG = {
  baseUrl: 'https://coding.dashscope.aliyuncs.com/v1',
  model: 'qwen3.5-plus',  // 速度快、成本低
  // API Key 从环境变量读取
  apiKey: process.env.WENWEN_AI_API_KEY || '',
};

// 用户输入参数
export interface AIPlanInput {
  goal: 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance' | 'general';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableDays: number;          // 每周可训练天数
  sessionDuration: number;         // 每次训练时长（分钟）
  equipment: string[];             // 可用器械
  targetMuscles?: string[];        // 目标肌群（可选）
  limitations?: string[];          // 身体限制/伤病（可选）
  language: 'zh' | 'en';
}

// 生成的训练计划
export interface GeneratedPlan {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  goal: string;
  difficulty: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessions: GeneratedSession[];
}

// 单次训练课程
export interface GeneratedSession {
  sessionNumber: number;
  name: string;
  nameEn: string;
  durationMinutes: number;
  exercises: GeneratedExercise[];
}

// 训练动作
export interface GeneratedExercise {
  exerciseId?: string;             // 匹配到的动作库 ID
  name: string;
  nameEn: string;
  sets: number;
  reps: string;                    // "12" or "15-20" or "30s"
  restSeconds: number;
  notes?: string;
}

/**
 * 调用 AI 生成训练计划
 */
export async function generateWorkoutPlan(input: AIPlanInput): Promise<GeneratedPlan> {
  if (!AI_CONFIG.apiKey) {
    throw new Error('AI API Key not configured');
  }

  const prompt = buildPrompt(input);

  // 设置 25 秒超时（Cloudflare Edge Function 限制）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(input.language),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('AI returned empty response');
    }

    // 解析 JSON 响应
    const plan = parseAIResponse(content, input);
    return plan;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API timeout - request took too long');
    }
    console.error('AI plan generation failed:', error);
    throw error;
  }
}

/**
 * 构建系统提示词
 */
function getSystemPrompt(language: 'zh' | 'en'): string {
  if (language === 'zh') {
    return `你是一位专业的健身教练和训练计划设计专家。你的任务是根据用户的需求生成个性化的训练计划。

你需要输出一个 JSON 格式的训练计划，包含以下字段：
- name: 计划名称（中文）
- nameEn: 计划名称（英文）
- description: 计划描述（中文，50-100字）
- descriptionEn: 计划描述（英文）
- goal: 目标类型 (muscle_gain/fat_loss/strength/endurance/general)
- difficulty: 难度等级 (beginner/intermediate/advanced)
- durationWeeks: 计划周期（周数）
- sessionsPerWeek: 每周训练次数
- sessions: 训练课程数组

每个训练课程包含：
- sessionNumber: 课程编号
- name: 课程名称（中文）
- nameEn: 课程名称（英文）
- durationMinutes: 预计时长
- exercises: 动作数组

每个动作包含：
- name: 动作名称（中文）
- nameEn: 动作名称（英文）
- sets: 组数
- reps: 每组次数或时长（如 "12", "15-20", "30s"）
- restSeconds: 组间休息秒数
- notes: 动作要点提示（可选）

请确保：
1. 计划科学合理，适合用户的健身水平
2. 动作安排遵循渐进超负荷原则
3. 包含适当的热身和拉伸建议
4. 只输出 JSON，不要有其他文字`;
  }

  return `You are a professional fitness coach and workout plan design expert. Your task is to generate personalized workout plans based on user requirements.

Output a JSON-formatted workout plan with the following fields:
- name: Plan name (Chinese)
- nameEn: Plan name (English)
- description: Plan description (Chinese, 50-100 chars)
- descriptionEn: Plan description (English)
- goal: Goal type (muscle_gain/fat_loss/strength/endurance/general)
- difficulty: Difficulty level (beginner/intermediate/advanced)
- durationWeeks: Plan duration in weeks
- sessionsPerWeek: Sessions per week
- sessions: Array of training sessions

Each session contains:
- sessionNumber: Session number
- name: Session name (Chinese)
- nameEn: Session name (English)
- durationMinutes: Estimated duration
- exercises: Array of exercises

Each exercise contains:
- name: Exercise name (Chinese)
- nameEn: Exercise name (English)
- sets: Number of sets
- reps: Reps per set or duration (e.g., "12", "15-20", "30s")
- restSeconds: Rest between sets
- notes: Tips or notes (optional)

Ensure:
1. Plan is scientifically sound and appropriate for user's fitness level
2. Progressive overload principle is applied
3. Include appropriate warm-up and stretching suggestions
4. Output ONLY JSON, no other text`;
}

/**
 * 构建用户提示词
 */
function buildPrompt(input: AIPlanInput): string {
  const goalMap: Record<string, string> = {
    muscle_gain: input.language === 'zh' ? '增肌' : 'Muscle Gain',
    fat_loss: input.language === 'zh' ? '减脂' : 'Fat Loss',
    strength: input.language === 'zh' ? '力量提升' : 'Strength',
    endurance: input.language === 'zh' ? '耐力提升' : 'Endurance',
    general: input.language === 'zh' ? '综合健身' : 'General Fitness',
  };

  const levelMap: Record<string, string> = {
    beginner: input.language === 'zh' ? '初学者' : 'Beginner',
    intermediate: input.language === 'zh' ? '中级' : 'Intermediate',
    advanced: input.language === 'zh' ? '高级' : 'Advanced',
  };

  const equipmentList = input.equipment.length > 0
    ? input.equipment.join(', ')
    : (input.language === 'zh' ? '徒手/无器械' : 'No equipment/Bodyweight');

  const prompt = input.language === 'zh'
    ? `请为以下用户生成一个个性化训练计划：

目标：${goalMap[input.goal]}
健身水平：${levelMap[input.fitnessLevel]}
每周可训练天数：${input.availableDays}天
每次训练时长：${input.sessionDuration}分钟
可用器械：${equipmentList}
${input.targetMuscles?.length ? `重点部位：${input.targetMuscles.join(', ')}` : ''}
${input.limitations?.length ? `身体限制：${input.limitations.join(', ')}` : ''}

请输出 JSON 格式的训练计划。`
    : `Generate a personalized workout plan for the following user:

Goal: ${goalMap[input.goal]}
Fitness Level: ${levelMap[input.fitnessLevel]}
Available Days per Week: ${input.availableDays} days
Session Duration: ${input.sessionDuration} minutes
Available Equipment: ${equipmentList}
${input.targetMuscles?.length ? `Focus Areas: ${input.targetMuscles.join(', ')}` : ''}
${input.limitations?.length ? `Physical Limitations: ${input.limitations.join(', ')}` : ''}

Output the workout plan in JSON format.`;

  return prompt;
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(content: string, input: AIPlanInput): GeneratedPlan {
  // 提取 JSON（处理可能的 markdown 包裹）
  let jsonStr = content;
  
  // 移除可能的 markdown 代码块标记
  if (content.includes('```json')) {
    jsonStr = content.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || content;
  } else if (content.includes('```')) {
    jsonStr = content.match(/```\s*([\s\S]*?)\s*```/)?.[1] || content;
  }

  // 清理 JSON 字符串
  jsonStr = jsonStr.trim();

  try {
    const plan = JSON.parse(jsonStr) as GeneratedPlan;
    
    // 验证和补充字段
    if (!plan.goal) plan.goal = input.goal;
    if (!plan.difficulty) plan.difficulty = input.fitnessLevel;
    if (!plan.sessionsPerWeek) plan.sessionsPerWeek = input.availableDays;
    
    return plan;
  } catch (e) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse AI response as JSON');
  }
}