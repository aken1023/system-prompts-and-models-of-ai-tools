import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Globe, 
  Star, 
  Download,
  BarChart3,
  Clock,
  Users,
  Tag
} from 'lucide-react'

interface ToolStatsProps {
  tool: {
    prompts: any[]
    features: string[]
    tags: string[]
    createdAt: string | Date
    updatedAt: string | Date
  }
}

export function ToolStats({ tool }: ToolStatsProps) {
  const totalPrompts = tool.prompts.length
  const englishPrompts = tool.prompts.filter(p => p.language === 'en').length
  const chinesePrompts = tool.prompts.filter(p => p.language === 'zh-TW').length
  const officialPrompts = tool.prompts.filter(p => p.isOfficial).length
  const totalViews = tool.prompts.reduce((sum, p) => sum + (p.viewCount || 0), 0)
  const totalDownloads = tool.prompts.reduce((sum, p) => sum + (p.downloadCount || 0), 0)

  const stats = [
    {
      icon: FileText,
      label: '總提示詞數',
      value: totalPrompts,
      description: `${officialPrompts} 個官方版本`
    },
    {
      icon: Globe,
      label: '語言支援',
      value: `${englishPrompts + chinesePrompts}`,
      description: `英文 ${englishPrompts} / 中文 ${chinesePrompts}`
    },
    {
      icon: Users,
      label: '總瀏覽量',
      value: totalViews.toLocaleString(),
      description: '所有提示詞累計瀏覽'
    },
    {
      icon: Download,
      label: '下載次數',
      value: totalDownloads.toLocaleString(),
      description: '用戶下載使用次數'
    },
    {
      icon: Tag,
      label: '功能特色',
      value: tool.features.length,
      description: '主要功能數量'
    },
    {
      icon: BarChart3,
      label: '活躍度',
      value: totalPrompts > 0 ? '高' : '低',
      description: '基於提示詞數量和更新頻率'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.label}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}