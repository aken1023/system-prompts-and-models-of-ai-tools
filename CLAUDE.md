# CLAUDE.md - AI Prompt Library SaaS System

這個文件為 Claude Code 提供在開發 AI Prompt Library SaaS 系統時的完整指引。

## 🎯 專案概述

**AI Prompt Library** 是一個專業的 SaaS 平台，用於收集、管理、分析和分享各種 AI 工具的系統提示詞（System Prompts）。

### 核心價值
- 🔍 **探索與發現**：瀏覽 30+ AI 工具的提示詞設計
- 📊 **分析與比較**：對比不同工具的提示策略
- 🚀 **學習與應用**：從最佳實踐中學習，改進自己的 AI 應用
- 🤝 **協作與分享**：社群驅動的提示詞優化

## 🏗️ 系統架構

### 技術棧
```yaml
Frontend:
  - Framework: Next.js 14 (App Router)
  - UI Library: shadcn/ui + Tailwind CSS
  - State Management: Zustand
  - Authentication: NextAuth.js
  - Search: Algolia / MeiliSearch
  - Analytics: Vercel Analytics

Backend:
  - API: Next.js API Routes + tRPC
  - Database: PostgreSQL (Supabase)
  - ORM: Prisma
  - Cache: Redis (Upstash)
  - File Storage: S3 (AWS/Cloudflare R2)
  - Queue: BullMQ

DevOps:
  - Hosting: Vercel
  - Monitoring: Sentry
  - CI/CD: GitHub Actions
```

## 📦 資料庫架構

### 核心資料表

```prisma
// AI 工具
model Tool {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  website     String?
  logo        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  prompts     Prompt[]
  versions    ToolVersion[]
  
  @@index([slug])
  @@index([categoryId])
}

// 提示詞
model Prompt {
  id          String   @id @default(cuid())
  tool        Tool     @relation(fields: [toolId], references: [id])
  toolId      String
  version     String
  type        PromptType @default(SYSTEM)
  content     String   @db.Text
  metadata    Json?
  language    String   @default("en")
  hash        String   @unique // SHA-256 hash for deduplication
  source      String?  // GitHub, official docs, reverse engineering
  verifiedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  analyses    Analysis[]
  comparisons ComparisonPrompt[]
  favorites   Favorite[]
  comments    Comment[]
  
  @@index([toolId])
  @@index([type])
  @@index([hash])
}

// 提示詞分析
model Analysis {
  id          String   @id @default(cuid())
  prompt      Prompt   @relation(fields: [promptId], references: [id])
  promptId    String
  
  // 分析指標
  wordCount   Int
  complexity  Float    // 1-10 scale
  readability Float    // Flesch reading ease
  sentiment   Json     // positive, negative, neutral percentages
  
  // 關鍵特徵
  keyTopics   String[] // extracted topics
  techniques  String[] // identified prompt engineering techniques
  patterns    String[] // common patterns detected
  
  // AI 生成的洞察
  summary     String   @db.Text
  strengths   String[] 
  weaknesses  String[]
  suggestions String[]
  
  analyzedAt  DateTime @default(now())
  
  @@unique([promptId])
}

// 使用者系統
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          UserRole  @default(FREE)
  
  // 訂閱資訊
  subscription  Subscription?
  credits       Int       @default(10) // API credits for free users
  
  // 活動記錄
  favorites     Favorite[]
  collections   Collection[]
  apiKeys       ApiKey[]
  comments      Comment[]
  contributions Contribution[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// 收藏集
model Collection {
  id          String   @id @default(cuid())
  name        String
  description String?
  isPublic    Boolean  @default(false)
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  prompts     CollectionPrompt[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([isPublic])
}

enum PromptType {
  SYSTEM
  AGENT
  TOOL_DEFINITION
  MEMORY
  PLANNING
  OTHER
}

enum UserRole {
  FREE
  PRO
  ENTERPRISE
  ADMIN
}
```

## 🎨 前端功能模組

### 1. 首頁 Dashboard
```typescript
// 功能需求
- 熱門提示詞展示（趨勢算法）
- 最新更新的工具
- 社群精選收藏集
- 搜尋快速入口
- 分類瀏覽卡片
```

### 2. 探索頁面 `/explore`
```typescript
interface ExploreFeatures {
  search: {
    fullText: boolean      // 全文搜索
    filters: {
      tools: string[]       // 工具篩選
      categories: string[]  // 分類篩選
      types: PromptType[]   // 類型篩選
      dateRange: DateRange  // 時間範圍
    }
    sorting: 'relevance' | 'newest' | 'popular' | 'trending'
  }
  
  view: {
    modes: 'grid' | 'list' | 'compact'
    pagination: boolean
    infiniteScroll: boolean
  }
}
```

### 3. 提示詞詳情頁 `/prompt/[id]`
```typescript
interface PromptDetailFeatures {
  display: {
    syntaxHighlighting: boolean  // 語法高亮
    lineNumbers: boolean         // 行號顯示
    copyButton: boolean          // 一鍵複製
    downloadOptions: string[]    // 下載格式: txt, md, json
  }
  
  analysis: {
    metrics: boolean             // 顯示分析指標
    aiInsights: boolean          // AI 洞察
    similarPrompts: boolean      // 相似提示詞推薦
  }
  
  interaction: {
    favorite: boolean            // 收藏功能
    comment: boolean             // 評論功能
    share: boolean               // 分享功能
    version: boolean             // 版本歷史
  }
}
```

### 4. 比較工具 `/compare`
```typescript
interface CompareFeatures {
  selection: {
    maxItems: 4                  // 最多比較數量
    modes: 'side-by-side' | 'unified' | 'diff'
  }
  
  analysis: {
    commonPatterns: boolean      // 共同模式識別
    differences: boolean         // 差異高亮
    metrics: boolean             // 指標對比圖表
  }
}
```

### 5. API 文檔 `/api-docs`
```typescript
interface APIEndpoints {
  public: {
    'GET /api/prompts': 'List prompts'
    'GET /api/prompts/:id': 'Get prompt details'
    'GET /api/tools': 'List AI tools'
    'GET /api/search': 'Search prompts'
  }
  
  authenticated: {
    'POST /api/favorites': 'Add to favorites'
    'GET /api/collections': 'Get user collections'
    'POST /api/analyze': 'Analyze prompt (uses credits)'
  }
  
  pro: {
    'GET /api/export': 'Bulk export'
    'POST /api/compare': 'Advanced comparison'
    'GET /api/analytics': 'Usage analytics'
  }
}
```

## 💰 商業模式

### 訂閱方案
```yaml
Free:
  - 瀏覽公開提示詞
  - 基本搜尋功能
  - 每月 10 次 AI 分析
  - 建立 1 個私人收藏集

Pro ($19/月):
  - 無限 AI 分析
  - 進階搜尋篩選
  - 批量下載功能
  - 無限收藏集
  - API 訪問 (1000 requests/月)
  - 版本歷史追蹤
  - 優先客服支援

Enterprise ($99/月):
  - Pro 所有功能
  - 無限 API 訪問
  - 自訂分析模型
  - 團隊協作功能
  - SSO 整合
  - SLA 保證
  - 專屬客戶經理
```

## 🚀 開發指南

### 環境設定
```bash
# 必要環境變數 (.env.local)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_KEY="..."

# Redis (Upstash)
REDIS_URL="..."
REDIS_TOKEN="..."

# AI 服務
OPENAI_API_KEY="..."           # 用於分析功能
ANTHROPIC_API_KEY="..."        # 備用 AI 服務

# 搜尋服務
ALGOLIA_APP_ID="..."
ALGOLIA_API_KEY="..."
ALGOLIA_INDEX_NAME="prompts"

# 支付 (Stripe)
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="..."

# 監控
SENTRY_DSN="..."
VERCEL_ANALYTICS_ID="..."
```

### 開發命令
```bash
# 安裝依賴
npm install

# 資料庫設定
npx prisma generate
npx prisma db push
npx prisma db seed          # 載入初始資料

# 開發伺服器
npm run dev                  # http://localhost:3000

# 測試
npm run test                 # 單元測試
npm run test:e2e            # E2E 測試
npm run test:coverage       # 測試覆蓋率

# 建置
npm run build
npm run start               # 生產模式

# 程式碼品質
npm run lint                # ESLint
npm run format              # Prettier
npm run type-check          # TypeScript
```

### 資料導入流程
```typescript
// scripts/import-prompts.ts
async function importPrompts() {
  const directories = await fs.readdir('./source-data')
  
  for (const dir of directories) {
    // 1. 讀取工具資訊
    const toolInfo = await parseToolInfo(dir)
    
    // 2. 建立或更新工具記錄
    const tool = await prisma.tool.upsert({
      where: { slug: toolInfo.slug },
      update: { ...toolInfo },
      create: { ...toolInfo }
    })
    
    // 3. 處理提示詞檔案
    const promptFiles = await getPromptFiles(dir)
    for (const file of promptFiles) {
      const content = await fs.readFile(file, 'utf-8')
      const hash = createHash('sha256').update(content).digest('hex')
      
      // 4. 避免重複
      await prisma.prompt.upsert({
        where: { hash },
        update: { content, updatedAt: new Date() },
        create: {
          toolId: tool.id,
          content,
          hash,
          type: detectPromptType(content),
          version: extractVersion(file)
        }
      })
    }
    
    // 5. 觸發分析任務
    await analyzeQueue.add('analyze-tool', { toolId: tool.id })
  }
}
```

## 🎯 關鍵功能實作

### 1. AI 分析引擎
```typescript
// services/analysis.service.ts
export class AnalysisService {
  async analyzePrompt(promptId: string) {
    const prompt = await getPrompt(promptId)
    
    // 基礎指標
    const metrics = {
      wordCount: prompt.content.split(/\s+/).length,
      readability: calculateReadability(prompt.content),
      complexity: await estimateComplexity(prompt.content)
    }
    
    // AI 深度分析
    const insights = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{
        role: "system",
        content: ANALYSIS_SYSTEM_PROMPT
      }, {
        role: "user",
        content: `Analyze this prompt: ${prompt.content}`
      }],
      tools: analysisTools,
      temperature: 0.3
    })
    
    return {
      metrics,
      insights: parseInsights(insights),
      patterns: detectPatterns(prompt.content),
      techniques: identifyTechniques(prompt.content)
    }
  }
}
```

### 2. 智慧搜尋
```typescript
// services/search.service.ts
export class SearchService {
  async search(query: string, filters: SearchFilters) {
    // 向量搜尋 (語義相似度)
    const embedding = await createEmbedding(query)
    const semanticResults = await vectorSearch(embedding, filters)
    
    // 全文搜尋 (關鍵字匹配)
    const textResults = await algolia.search(query, {
      filters: buildAlgoliaFilters(filters),
      facets: ['tool', 'type', 'category']
    })
    
    // 混合排序
    return mergeAndRankResults(semanticResults, textResults)
  }
}
```

### 3. 版本追蹤
```typescript
// services/version.service.ts
export class VersionService {
  async trackChanges(toolId: string) {
    // 定期檢查官方來源
    const latestContent = await fetchOfficialPrompt(toolId)
    const currentVersion = await getCurrentVersion(toolId)
    
    if (hasChanged(latestContent, currentVersion)) {
      // 建立新版本
      await createNewVersion({
        toolId,
        content: latestContent,
        changes: detectChanges(currentVersion, latestContent),
        version: incrementVersion(currentVersion.version)
      })
      
      // 通知訂閱用戶
      await notifySubscribers(toolId, 'version-update')
    }
  }
}
```

## 🔒 安全最佳實踐

### API 安全
```typescript
// middleware/rateLimit.ts
export const rateLimits = {
  free: { requests: 100, window: '1h' },
  pro: { requests: 1000, window: '1h' },
  enterprise: { requests: 10000, window: '1h' }
}

// middleware/auth.ts
export const requireAuth = async (req: Request) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new UnauthorizedError()
  return session
}

// middleware/cors.ts
export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}
```

### 資料保護
```typescript
// 敏感資訊過濾
const sanitizePrompt = (content: string) => {
  // 移除 API keys, tokens, passwords
  return content.replace(SENSITIVE_PATTERN, '[REDACTED]')
}

// 加密儲存
const encryptSensitiveData = async (data: string) => {
  return await encrypt(data, process.env.ENCRYPTION_KEY)
}
```

## 📊 監控與分析

### 關鍵指標
```typescript
// 業務指標
- MAU (Monthly Active Users)
- 付費轉換率
- API 使用量
- 熱門提示詞排名
- 用戶參與度 (收藏、評論、分享)

// 技術指標
- API 響應時間 (p50, p95, p99)
- 錯誤率
- 資料庫查詢效能
- 快取命中率
- CDN 頻寬使用
```

### 錯誤處理
```typescript
// 統一錯誤處理
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

// Sentry 整合
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // 過濾敏感資訊
    return sanitizeEvent(event)
  }
})
```

## 🚦 部署檢查清單

### 上線前檢查
- [ ] 所有環境變數已設定
- [ ] 資料庫已初始化並建立索引
- [ ] Redis 快取已連接
- [ ] 搜尋索引已建立
- [ ] SSL 證書已配置
- [ ] CDN 已設定
- [ ] 監控告警已設置
- [ ] 備份策略已實施
- [ ] 安全掃描已通過
- [ ] 效能測試已完成

### 持續維護
- 每日：檢查錯誤日誌、監控指標
- 每週：更新提示詞資料、分析用戶行為
- 每月：效能優化、安全更新、功能迭代

## 📝 注意事項

1. **版權考量**：確保收集的提示詞符合各工具的使用條款
2. **資料準確性**：建立驗證機制，確保提示詞的真實性
3. **社群管理**：制定明確的社群指南和內容審核政策
4. **可擴展性**：設計時考慮未來支援更多 AI 工具和語言
5. **用戶隱私**：遵守 GDPR 等隱私法規

---

*此文件會隨著專案發展持續更新，請定期查看最新版本。*