'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Copy, 
  Download, 
  Eye, 
  Calendar, 
  FileText, 
  Globe,
  ChevronRight
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { PromptViewer } from './prompt-viewer'

interface Prompt {
  id: string
  type: string
  content: string
  language: string
  version: string
  source?: string
  isOfficial: boolean
  createdAt: string
  viewCount: number
  downloadCount: number
}

interface PromptsGridProps {
  prompts: Prompt[]
}

export function PromptsGrid({ prompts }: PromptsGridProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [filter, setFilter] = useState<'all' | 'en' | 'zh-TW'>('all')

  const filteredPrompts = prompts.filter(prompt => {
    if (filter === 'all') return true
    return prompt.language === filter
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'SYSTEM': '系統提示詞',
      'AGENT': '代理提示詞',
      'TOOL_DEFINITION': '工具定義',
      'MEMORY': '記憶管理',
      'PLANNING': '規劃策略',
      'WORKFLOW': '工作流程'
    }
    return labels[type] || type
  }

  const getLanguageLabel = (language: string) => {
    const labels: Record<string, string> = {
      'en': '英文',
      'zh-TW': '繁體中文',
      'zh-CN': '簡體中文'
    }
    return labels[language] || language
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: 顯示 toast 通知
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">尚無提示詞</h3>
        <p className="text-muted-foreground">此工具還沒有任何提示詞資料。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          全部 ({prompts.length})
        </Button>
        <Button
          variant={filter === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('en')}
        >
          英文 ({prompts.filter(p => p.language === 'en').length})
        </Button>
        <Button
          variant={filter === 'zh-TW' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('zh-TW')}
        >
          繁體中文 ({prompts.filter(p => p.language === 'zh-TW').length})
        </Button>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="group hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {getTypeLabel(prompt.type)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getLanguageLabel(prompt.language)}
                    </Badge>
                    {prompt.isOfficial && (
                      <Badge variant="default" className="text-xs">
                        官方
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">
                    {getTypeLabel(prompt.type)} v{prompt.version}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Preview */}
              <div className="bg-muted/50 rounded-lg p-3">
                <pre className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                  {prompt.content.substring(0, 150)}
                  {prompt.content.length > 150 && '...'}
                </pre>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(prompt.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{prompt.viewCount} 次瀏覽</span>
                </div>
                {prompt.source && (
                  <div className="flex items-center gap-1 col-span-2">
                    <Globe className="w-4 h-4" />
                    <span>{prompt.source}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedPrompt(prompt)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      查看詳情
                    </Button>
                  </DialogTrigger>
                  <DialogContent 
                    className="max-w-6xl max-h-[95vh] overflow-y-auto"
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        {getTypeLabel(prompt.type)} v{prompt.version}
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        {getLanguageLabel(prompt.language)} • {prompt.source}
                      </DialogDescription>
                      <div className="text-xs text-muted-foreground mt-2">
                        💡 提示：點擊右上角 ✕ 按鈕或按 ESC 鍵關閉視窗
                      </div>
                    </DialogHeader>
                    
                    <div className="mt-6">
                      {selectedPrompt && (
                        <PromptViewer prompt={selectedPrompt} />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(prompt.content)}
                >
                  <Copy className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: 實作下載功能
                    const blob = new Blob([prompt.content], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${prompt.type.toLowerCase()}_${prompt.version}.txt`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            沒有找到符合條件的提示詞。
          </p>
        </div>
      )}
    </div>
  )
}