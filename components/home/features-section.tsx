import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Download,
  Code2,
  BookOpen,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: '智能搜尋',
    description: '跨 30+ 個 AI 工具的語義搜尋，具備智能過濾和分類功能。'
  },
  {
    icon: BarChart3,
    title: 'AI 分析',
    description: '深度分析提示詞，包括複雜度評分、可讀性指標和技巧識別。'
  },
  {
    icon: Code2,
    title: '並排比較',
    description: '比較不同工具的提示詞，了解變化和最佳實踐。'
  },
  {
    icon: BookOpen,
    title: '收藏集',
    description: '將提示詞整理成自訂收藏集，並與社群分享。'
  },
  {
    icon: Download,
    title: '匯出與 API',
    description: '以多種格式下載提示詞或透過完整的 REST API 存取。'
  },
  {
    icon: Users,
    title: '社群驅動',
    description: '貢獻新提示詞、改進內容，並與其他提示詞工程師互動。'
  },
  {
    icon: Shield,
    title: '驗證來源',
    description: '所有提示詞均經過驗證，來源為官方文檔或逆向工程。'
  },
  {
    icon: Zap,
    title: '即時更新',
    description: '追蹤 AI 工具提示詞的變化和更新。'
  },
  {
    icon: Sparkles,
    title: '提示詞工程洞察',
    description: '從最佳實踐中學習，詳細分解提示詞工程技巧。'
  }
]

export function FeaturesSection() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          提示詞工程的完整解決方案
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          全面的工具和洞察，助您精通 AI 提示詞工程
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}