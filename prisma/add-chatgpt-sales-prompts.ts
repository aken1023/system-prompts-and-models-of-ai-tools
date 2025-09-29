import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding ChatGPT for Sales prompts...')

  // First, create Business category if it doesn't exist
  const businessCategory = await prisma.category.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      name: 'Business',
      slug: 'business',
      description: 'AI tools for business, sales, marketing, and productivity',
      icon: 'Briefcase',
      order: 5
    }
  })

  console.log('✅ Business category created/updated')

  // Create ChatGPT tool if it doesn't exist
  const chatgptTool = await prisma.tool.upsert({
    where: { slug: 'chatgpt' },
    update: {},
    create: {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'OpenAI\'s conversational AI assistant for various business tasks',
      categoryId: businessCategory.id,
      website: 'https://chat.openai.com',
      features: JSON.stringify([
        'Text Generation',
        'Code Generation',
        'Analysis',
        'Writing',
        'Research',
        'Problem Solving'
      ]),
      tags: JSON.stringify(['AI', 'Chat', 'Business', 'Productivity']),
      status: 'ACTIVE'
    }
  })

  console.log('✅ ChatGPT tool created/updated')

  // Define all the prompts from the markdown file
  const salesPrompts = [
    {
      title: 'Create Strategic Account Plan',
      content: `Create an account plan for [customer name]. Use these inputs: company profile, known priorities, current product usage, stakeholders, and renewal date. Output a structured plan with goals, risks, opportunities, and next steps.`,
      translation: '為 [客戶名稱] 建立一個客戶計畫。使用以下輸入：公司簡介、已知優先事項、目前產品使用情況、利害關係人以及續約日期。以結構化計畫的形式輸出，包含目標、風險、機會和後續步驟。',
      type: 'BUSINESS',
      useCase: 'Strategic Account Planning'
    },
    {
      title: 'Territory Planning Framework',
      content: `Create a territory planning guide for our next fiscal year. Inputs: team headcount, target industries, regions, and historical revenue. Recommend allocation method and sample coverage plan.`,
      translation: '為我們的下一個財政年度建立一份區域規劃指南。輸入：團隊人數、目標產業、地區和歷史收入。建議分配方法和範例覆蓋計畫。',
      type: 'BUSINESS',
      useCase: 'Territory Planning'
    },
    {
      title: 'Customer Prioritization by Company Characteristics',
      content: `I have this list of accounts: [paste sample]. Prioritize them based on [criteria: industry, size, funding, tech stack]. Output a ranked list with reasons why.`,
      translation: '我有這份客戶名單：[貼上範例]。根據 [標準：產業、規模、資金、技術堆疊] 對他們進行優先排序。輸出一份帶有原因說明的排名清單。',
      type: 'BUSINESS',
      useCase: 'Account Prioritization'
    },
    {
      title: 'High-Potential Account Scoring',
      content: `Score accounts based on [insert rules—e.g., company size, engagement score, intent signals]. Data: [Upload account list]. Output top 10 ranked accounts with their score and a note explaining why.`,
      translation: '根據 [插入規則，例如：公司規模、參與度分數、意圖信號] 對客戶進行評分。資料：[上傳客戶名單]。輸出排名前 10 的客戶及其分數，並附上解釋原因的說明。',
      type: 'BUSINESS',
      useCase: 'Account Scoring'
    },
    {
      title: 'Regional Market Entry Planning',
      content: `I'm evaluating market entry into [region/country] for our [SaaS solution]. Research local buying behaviors, competitive landscape, economic conditions, and regulatory concerns. Format as a go/no-go market readiness summary with citations and action steps.`,
      translation: '我正在評估我們的 [SaaS 解決方案] 進入 [地區/國家] 的市場。研究當地的購買行為、競爭格局、經濟狀況和法規問題。以「進入/不進入」市場準備度摘要的形式呈現，並附上引文和行動步驟。',
      type: 'BUSINESS',
      useCase: 'Market Research'
    },
    {
      title: 'Competitor Analysis Battlecard',
      content: `Create a battlecard for [competitor name]. Use these notes: [insert positioning data]. Include strengths, weaknesses, how we win, and quick talk track. Output as table format.`,
      translation: '為 [競爭對手名稱] 建立一張比較分析卡。使用以下筆記：[插入定位資料]。包括優勢、劣勢、我們的致勝之道和快速談話要點。以表格格式輸出。',
      type: 'BUSINESS',
      useCase: 'Competitive Analysis'
    },
    {
      title: 'Competitive Positioning Analysis',
      content: `I'm preparing a competitive battlecard for [competitor name]. Research their pricing model, product positioning, recent customer wins/losses, and sales motion. Compare it to ours based on these strengths: [insert]. Output a 1-page summary with citations.`,
      translation: '我正在為 [競爭對手名稱] 準備一張競爭比較分析卡。研究他們的定價模型、產品定位、最近的客戶贏/輸情況以及銷售動態。根據我們的這些優勢進行比較：[插入]。輸出一頁帶有引文的摘要。',
      type: 'BUSINESS',
      useCase: 'Competitive Intelligence'
    },
    {
      title: 'Sales Enablement One-Pager',
      content: `Create a one-pager to help reps pitch [product name] to [persona]. Include key benefits, features, common use cases, and competitor differentiators. Format as copy-ready enablement doc.`,
      translation: '建立一份單頁文件，幫助銷售代表向 [人物誌] 推銷 [產品名稱]。包括主要優點、功能、常見使用案例和競爭對手差異化因素。格式化為可直接使用的賦能文件。',
      type: 'BUSINESS',
      useCase: 'Sales Enablement'
    },
    {
      title: 'Sales Objection Handling',
      content: `Create rebuttals to these common objections: [insert 2–3 objections]. Make them sound natural and confident, and include a backup stat or story where useful. Output as list.`,
      translation: '針對這些常見的異議建立反駁：[插入 2-3 個異議]。讓它們聽起來自然且自信，並在有用時加入佐證數據或故事。以清單形式輸出。',
      type: 'BUSINESS',
      useCase: 'Objection Handling'
    },
    {
      title: 'Customer Proof Research',
      content: `Research recent online reviews, social mentions, and testimonials about [our product OR competitor product]. Focus on what customers are praising or criticizing. Summarize top 5 quotes, what persona each came from, and where it was posted. Include links.`,
      translation: '研究關於 [我們的產品或競爭對手產品] 的近期線上評論、社交媒體提及和推薦。專注於客戶稱讚或批評的內容。總結前 5 條引述、每條引述來自哪個人物誌以及發布位置。附上連結。',
      type: 'BUSINESS',
      useCase: 'Customer Research'
    }
  ]

  // Add all sales prompts
  for (const promptData of salesPrompts) {
    const fullContent = `# ${promptData.title}

**Use Case:** ${promptData.useCase}

**English Prompt:**
${promptData.content}

**中文翻譯:**
${promptData.translation}`

    const hash = crypto.createHash('sha256').update(fullContent).digest('hex')

    await prisma.prompt.upsert({
      where: { hash },
      update: {
        content: fullContent,
        updatedAt: new Date()
      },
      create: {
        content: fullContent,
        type: promptData.type,
        language: 'en',
        version: '1.0',
        toolId: chatgptTool.id,
        hash,
        source: 'ChatGPT for Sales (業務銷售).md',
        isOfficial: false,
        viewCount: Math.floor(Math.random() * 100),
        downloadCount: Math.floor(Math.random() * 50),
        metadata: JSON.stringify({
          title: promptData.title,
          useCase: promptData.useCase,
          category: 'Sales',
          hasTranslation: true
        })
      }
    })
  }

  console.log(`✅ Added ${salesPrompts.length} ChatGPT for Sales prompts`)

  // Also add Customer Success prompts
  const customerSuccessPrompts = [
    {
      title: 'Customer Success Organization Benchmarking',
      content: `Benchmark the CS org structure for companies like ours in [industry, size]. Focus on roles per customer segment and ratio to revenue. Output as a comparison table with notes on headcount ratios.`,
      translation: '針對 [產業、規模] 中與我們類似的公司，對其客戶成功組織結構進行基準化。專注於每個客戶區隔的角色以及與收入的比率。以比較表的形式輸出，並附上關於員工人數比率的說明。',
      type: 'BUSINESS',
      useCase: 'CS Organization Design'
    },
    {
      title: 'Industry Success Metrics Benchmarking',
      content: `Research top 3 success metrics used for customer health scoring in the [industry] sector. Include CSAT, NRR, usage frequency, or other emerging benchmarks. Output as a table comparing metric, source, and benchmark value with citations.`,
      translation: '研究 [產業] 領域用於客戶健康評分的前 3 大成功指標。包括客戶滿意度 (CSAT)、淨收入留存率 (NRR)、使用頻率或其他新興的基準。以表格形式輸出，比較指標、來源和基準值，並附上引文。',
      type: 'BUSINESS',
      useCase: 'Success Metrics'
    },
    {
      title: 'Customer Success Tech Stack Evaluation',
      content: `Research typical Customer Success tech stacks for companies in early-stage, growth-stage, and enterprise. Include categories (e.g., CRM, Success Platform, Analytics). Output a comparison chart with examples and usage notes.`,
      translation: '研究早期、成長期和企業級公司的典型客戶成功技術堆疊。包括類別 (例如：客戶關係管理、成功平台、分析工具)。輸出一份比較圖表，包含範例和使用說明。',
      type: 'BUSINESS',
      useCase: 'Tech Stack Analysis'
    },
    {
      title: 'Executive Email Updates',
      content: `Write a weekly update email for [executive stakeholder at customer]. Use these internal notes from this week's call and usage metrics: [paste here]. Output should be a short, polished email with 3 bullets.`,
      translation: '為 [客戶端的高階利害關係人] 撰寫一封每週更新的電子郵件。使用本週通話的內部筆記和使用指標：[在此貼上]。輸出應為一封簡短、精煉的電子郵件，包含 3 個要點。',
      type: 'BUSINESS',
      useCase: 'Executive Communication'
    },
    {
      title: 'QBR Preparation',
      content: `Summarize the top wins, risks, and product usage highlights for [Customer Name] ahead of our QBR. Use their latest health score, usage trends, and support ticket history. Format as a bulleted prep doc for internal review.`,
      translation: '在我們的季報 (QBR) 之前，為 [客戶名稱] 總結最重要的成功、風險和產品使用亮點。使用他們最新的健康分數、使用趨勢和支援票證歷史記錄。格式化為供內部審查的項目符號準備文件。',
      type: 'BUSINESS',
      useCase: 'QBR Preparation'
    }
  ]

  // Add Customer Success prompts
  for (const promptData of customerSuccessPrompts) {
    const fullContent = `# ${promptData.title}

**Use Case:** ${promptData.useCase}

**English Prompt:**
${promptData.content}

**中文翻譯:**
${promptData.translation}`

    const hash = crypto.createHash('sha256').update(fullContent).digest('hex')

    await prisma.prompt.upsert({
      where: { hash },
      update: {
        content: fullContent,
        updatedAt: new Date()
      },
      create: {
        content: fullContent,
        type: promptData.type,
        language: 'en',
        version: '1.0',
        toolId: chatgptTool.id,
        hash,
        source: 'ChatGPT for Sales (業務銷售).md',
        isOfficial: false,
        viewCount: Math.floor(Math.random() * 100),
        downloadCount: Math.floor(Math.random() * 50),
        metadata: JSON.stringify({
          title: promptData.title,
          useCase: promptData.useCase,
          category: 'Customer Success',
          hasTranslation: true
        })
      }
    })
  }

  console.log(`✅ Added ${customerSuccessPrompts.length} ChatGPT for Customer Success prompts`)
  console.log('✅ All ChatGPT prompts added successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })