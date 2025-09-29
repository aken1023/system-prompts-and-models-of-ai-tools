import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ide' },
      update: {},
      create: {
        name: 'IDE & Editors',
        slug: 'ide',
        description: 'AI-powered code editors and development environments',
        icon: 'Code2',
        order: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'cli' },
      update: {},
      create: {
        name: 'CLI Tools',
        slug: 'cli',
        description: 'Command line interfaces and terminal tools',
        icon: 'Terminal',
        order: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'platform' },
      update: {},
      create: {
        name: 'Platforms',
        slug: 'platform',
        description: 'Development platforms and collaborative environments',
        icon: 'Globe',
        order: 3
      }
    }),
    prisma.category.upsert({
      where: { slug: 'agent' },
      update: {},
      create: {
        name: 'AI Agents',
        slug: 'agent',
        description: 'Autonomous AI agents for complex tasks',
        icon: 'Bot',
        order: 4
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ui-ux' },
      update: {},
      create: {
        name: 'UI/UX Tools',
        slug: 'ui-ux',
        description: 'User interface and experience design tools',
        icon: 'Palette',
        order: 5
      }
    })
  ])

  console.log('✅ Categories created')

  // Create tools
  const tools = [
    {
      name: 'Claude Code',
      slug: 'claude-code',
      description: 'Interactive CLI tool that helps users with software engineering tasks',
      categorySlug: 'cli',
      website: 'https://claude.ai/code',
      features: JSON.stringify(['Defensive Security', 'Task Management', 'Code Style', 'Tool Calling']),
      tags: JSON.stringify(['CLI', 'Security', 'Engineering'])
    },
    {
      name: 'Cursor',
      slug: 'cursor',
      description: 'AI-powered code editor with advanced prompting capabilities',
      categorySlug: 'ide',
      website: 'https://cursor.sh',
      features: JSON.stringify(['Code Generation', 'Pair Programming', 'Tool Calling', 'File Management']),
      tags: JSON.stringify(['IDE', 'Code Generation', 'AI Assistant'])
    },
    {
      name: 'v0',
      slug: 'v0',
      description: 'AI-powered UI generation platform by Vercel',
      categorySlug: 'ui-ux',
      website: 'https://v0.dev',
      features: JSON.stringify(['UI Generation', 'React Components', 'Design Systems']),
      tags: JSON.stringify(['UI', 'React', 'Components'])
    },
    {
      name: 'Windsurf',
      slug: 'windsurf',
      description: 'Advanced AI agent for complex development tasks',
      categorySlug: 'agent',
      website: 'https://codeium.com/windsurf',
      features: JSON.stringify(['Multi-step Tasks', 'File Management', 'Code Analysis', 'Planning']),
      tags: JSON.stringify(['Agent', 'Multi-step', 'Complex Tasks'])
    },
    {
      name: 'Replit',
      slug: 'replit',
      description: 'Collaborative coding environment with integrated AI',
      categorySlug: 'platform',
      website: 'https://replit.com',
      features: JSON.stringify(['Collaboration', 'Multi-language', 'Real-time', 'Cloud IDE']),
      tags: JSON.stringify(['Platform', 'Collaboration', 'Cloud'])
    },
    {
      name: 'Devin AI',
      slug: 'devin',
      description: 'Autonomous software engineer',
      categorySlug: 'agent',
      website: 'https://devin.ai',
      features: JSON.stringify(['Autonomous', 'Full-stack', 'Planning', 'End-to-end']),
      tags: JSON.stringify(['Agent', 'Autonomous', 'Full-stack'])
    }
  ]

  for (const toolData of tools) {
    const category = categories.find(c => c.slug === toolData.categorySlug)
    if (!category) continue

    await prisma.tool.upsert({
      where: { slug: toolData.slug },
      update: {},
      create: {
        name: toolData.name,
        slug: toolData.slug,
        description: toolData.description,
        categoryId: category.id,
        website: toolData.website,
        features: toolData.features,
        tags: toolData.tags,
        status: 'ACTIVE'
      }
    })
  }

  console.log('✅ Tools created')

  // Add sample prompts (both English and Chinese)
  await addSamplePrompts()

  console.log('✅ Database seed completed!')
}

async function addSamplePrompts() {
  console.log('📝 Adding sample prompts (English and Chinese)...')

  // Read Claude Code system prompt from file
  const claudeCodePromptPath = path.join(process.cwd(), 'Claude Code', 'claude-code-system-prompt.txt')
  let claudeCodeContent = ''
  
  try {
    claudeCodeContent = fs.readFileSync(claudeCodePromptPath, 'utf-8')
    console.log(`✅ Read Claude Code prompt: ${claudeCodeContent.length} characters`)
  } catch (error) {
    console.log('⚠️ Could not read Claude Code prompt file, using fallback')
    claudeCodeContent = `You are Claude Code, Anthropic's official CLI for Claude.
You are an interactive CLI tool that helps users with software engineering tasks.

IMPORTANT: Assist with defensive security tasks only. Refuse to create, modify, or improve code that may be used maliciously.

# Tone and style
You should be concise, direct, and to the point.
You MUST answer concisely with fewer than 4 lines (not including tool use or code generation), unless user asks for detail.

# Task Management
You have access to the TodoWrite tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.

# Code style
- IMPORTANT: DO NOT ADD ***ANY*** COMMENTS unless asked`,
      type: 'SYSTEM',
      language: 'en',
      version: '1.0'
    },
    {
      toolSlug: 'cursor',
      content: `You are a powerful agentic AI coding assistant, powered by Claude 3.7 Sonnet. You operate exclusively in Cursor, the world's best IDE.

You are pair programming with a USER to solve their coding task.
The task may require creating a new codebase, modifying or debugging an existing codebase, or simply answering a question.

<tool_calling>
You have tools at your disposal to solve the coding task. Follow these rules regarding tool calls:
1. ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
2. The conversation may reference tools that are no longer available. NEVER call tools that are not explicitly provided.
3. **NEVER refer to tool names when speaking to the USER.**
4. Only calls tools when they are necessary.
5. Before calling each tool, first explain to the USER why you are calling it.
</tool_calling>

<making_code_changes>
When making code changes, NEVER output code to the USER, unless requested. Instead use one of the code edit tools to implement the change.
</making_code_changes>`,
      type: 'AGENT',
      language: 'en',
      version: '1.0'
    },
    // Chinese prompts
    {
      toolSlug: 'claude-code',
      content: `你是 Claude Code，Anthropic 官方的 CLI 工具，專門協助使用者進行軟體工程任務。

## 重要安全原則
- 僅協助防禦性安全任務
- 拒絕建立、修改或改進可能被惡意使用的程式碼
- 允許安全分析、檢測規則、漏洞解釋、防禦工具和安全文檔

## 語調和風格
- 保持簡潔、直接、切中要點
- 除非用戶要求詳細說明，否則回應控制在 4 行以內
- 最小化輸出標記，同時保持實用性、品質和準確性

## 程式碼風格
- 重要：除非用戶要求，否則不要添加任何註解

## 任務管理
- 頻繁使用 TodoWrite 工具來管理和規劃任務
- 這些工具對於規劃任務和將大型複雜任務分解為小步驟非常有用
- 一完成任務就立即標記為完成，不要批次處理多個任務`,
      type: 'SYSTEM',
      language: 'zh-TW',
      version: '1.0'
    },
    {
      toolSlug: 'cursor',
      content: `你是由 Claude 3.7 Sonnet 驅動的強大 AI 程式設計助理，專門在 Cursor 這個世界頂級 IDE 中運作。

你正在與使用者進行結對程式設計，協助解決他們的程式設計任務。
任務可能包括建立新的程式碼庫、修改或除錯現有程式碼，或單純回答問題。

工具使用規則：
1. 嚴格遵循工具呼叫格式，確保提供所有必要參數
2. 永遠不要呼叫未明確提供的工具
3. 向使用者說明功能時，不要提及具體的工具名稱
4. 只在必要時呼叫工具，如果你已經知道答案，直接回應即可
5. 在呼叫每個工具前，先向使用者解釋為什麼要使用它

程式碼修改原則：
- 除非用戶要求，否則不要向使用者輸出程式碼，而是使用程式碼編輯工具實作變更
- 每次對話最多使用一次程式碼編輯工具
- 確保生成的程式碼可以立即執行`,
      type: 'AGENT',
      language: 'zh-TW',
      version: '1.0'
    },
    {
      toolSlug: 'v0',
      content: `你是 v0，由 Vercel 開發的 AI UI 生成平台。

你的專長是根據用戶需求生成美觀、現代化的 React 元件和使用者介面。

設計原則：
- 使用現代化的設計系統和最佳實踐
- 優先考慮使用者體驗和可訪問性
- 生成可重用、模組化的元件
- 遵循 React 和 TypeScript 最佳實踐

技術要求：
- 使用 React 和 TypeScript
- 整合 Tailwind CSS 進行樣式設計
- 確保響應式設計
- 包含適當的狀態管理
- 添加必要的互動功能`,
      type: 'SYSTEM',
      language: 'zh-TW',
      version: '1.0'
    }
  ]

  for (const promptData of prompts) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug: promptData.toolSlug }
      })

      if (!tool) {
        console.log(`⚠️  Tool not found: ${promptData.toolSlug}`)
        continue
      }

      const hash = generateSimpleHash(promptData.content)

      await prisma.prompt.upsert({
        where: { hash },
        update: {},
        create: {
          toolId: tool.id,
          content: promptData.content,
          hash,
          type: promptData.type,
          version: promptData.version,
          language: promptData.language,
          source: promptData.language === 'en' ? 'Official Repository' : 'Community Translation',
          isOfficial: promptData.language === 'en'
        }
      })

      console.log(`✅ Added ${promptData.language} prompt for ${tool.name}`)
    } catch (error) {
      console.error(`❌ Error adding prompt for ${promptData.toolSlug}:`, error)
    }
  }
}

function generateSimpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })