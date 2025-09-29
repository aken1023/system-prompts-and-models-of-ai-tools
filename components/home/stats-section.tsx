import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Users, Download, Zap } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '2.5M+',
    label: '月瀏覽量',
    description: '開發者每月探索提示詞次數'
  },
  {
    icon: Users,
    value: '50K+',
    label: '活躍用戶',
    description: '使用我們平台的提示詞工程師'
  },
  {
    icon: Download,
    value: '1M+',
    label: '下載次數',
    description: '提示詞下載和使用次數'
  },
  {
    icon: Zap,
    value: '99.9%',
    label: '穩定性',
    description: '提示詞庫的可靠存取率'
  }
]

export function StatsSection() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          全球開發者信賴的平台
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          加入數千名依賴我們提示詞庫的開發者行列
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}