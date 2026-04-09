// AI 计划生成服务 - 简化版，快速响应

// Wenwen AI 中转站配置
const AI_CONFIG = {
  baseUrl: 'https://breakout.wenwen-ai.com/v1',
  model: 'claude-haiku-4-5-20251001',
  apiKey: process.env.WENWEN_AI_API_KEY || '',
};

export interface AIPlanInput {
  goal: 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance' | 'general';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableDays: number;
  sessionDuration: number;
  equipment: string[];
  language: 'zh' | 'en';
}

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

export interface GeneratedSession {
  sessionNumber: number;
  name: string;
  nameEn: string;
  durationMinutes: number;
  exercises: GeneratedExercise[];
}

export interface GeneratedExercise {
  name: string;
  nameEn: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

/**
 * 调用 AI 生成训练计划 - 简化版
 */
export async function generateWorkoutPlan(input: AIPlanInput): Promise<GeneratedPlan> {
  if (!AI_CONFIG.apiKey) {
    throw new Error('AI API Key not configured');
  }

  // 简化的 prompt
  const prompt = input.language === 'zh'
    ? `生成${input.availableDays}天/周的${input.goal === 'muscle_gain' ? '增肌' : input.goal === 'fat_loss' ? '减脂' : '综合'}训练计划JSON。难度${input.fitnessLevel}，每次${input.sessionDuration}分钟。器械：${input.equipment.join(',') || '徒手'}。

输出格式示例：
{"name":"增肌计划","nameEn":"Muscle Plan","description":"适合初学者","descriptionEn":"For beginners","goal":"muscle_gain","difficulty":"beginner","durationWeeks":4,"sessionsPerWeek":3,"sessions":[{"sessionNumber":1,"name":"胸部","nameEn":"Chest","durationMinutes":45,"exercises":[{"name":"俯卧撑","nameEn":"Push-up","sets":3,"reps":"12","restSeconds":60}]}]}

直接输出JSON，不要解释。`
    : `Generate a ${input.availableDays}-day/week ${input.goal} workout plan JSON. Level: ${input.fitnessLevel}, ${input.sessionDuration}min sessions. Equipment: ${input.equipment.join(',') || 'bodyweight'}.

Output format:
{"name":"Muscle Plan","nameEn":"Muscle Plan","description":"For beginners","descriptionEn":"For beginners","goal":"muscle_gain","difficulty":"beginner","durationWeeks":4,"sessionsPerWeek":3,"sessions":[{"sessionNumber":1,"name":"Chest","nameEn":"Chest","durationMinutes":45,"exercises":[{"name":"Push-up","nameEn":"Push-up","sets":3,"reps":"12","restSeconds":60}]}]}

Output JSON only, no explanation.`;

  // 设置 20 秒超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.5,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('AI returned empty response');
    }

    return parseAIResponse(content, input);

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API timeout - request took too long (20s limit)');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(content: string, input: AIPlanInput): GeneratedPlan {
  let jsonStr = content;

  // 移除 markdown 代码块
  if (content.includes('```json')) {
    jsonStr = content.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || content;
  } else if (content.includes('```')) {
    jsonStr = content.match(/```\s*([\s\S]*?)\s*```/)?.[1] || content;
  }

  jsonStr = jsonStr.trim();

  try {
    const plan = JSON.parse(jsonStr) as GeneratedPlan;
    
    // 补充缺失字段
    if (!plan.goal) plan.goal = input.goal;
    if (!plan.difficulty) plan.difficulty = input.fitnessLevel;
    if (!plan.sessionsPerWeek) plan.sessionsPerWeek = input.availableDays;
    if (!plan.durationWeeks) plan.durationWeeks = 4;
    
    return plan;
  } catch {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse AI response');
  }
}