'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Copy, 
  Download, 
  Check, 
  Eye, 
  Calendar, 
  FileText,
  Code2,
  Hash
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

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

interface PromptViewerProps {
  prompt: Prompt
}

export function PromptViewer({ prompt }: PromptViewerProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadPrompt = () => {
    const blob = new Blob([prompt.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prompt.type.toLowerCase()}_v${prompt.version}_${prompt.language}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLanguageLabel = (language: string) => {
    const labels: Record<string, string> = {
      'en': '英文',
      'zh-TW': '繁體中文',
      'zh-CN': '簡體中文'
    }
    return labels[language] || language
  }

  const wordCount = prompt.content.split(/\s+/).filter(word => word.length > 0).length
  const lineCount = prompt.content.split('\n').length
  const charCount = prompt.content.length

  return (
    <div className="space-y-4">
      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">字數</div>
            <div className="font-medium">{wordCount.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">行數</div>
            <div className="font-medium">{lineCount.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">字符數</div>
            <div className="font-medium">{charCount.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">瀏覽次數</div>
            <div className="font-medium">{prompt.viewCount}</div>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="space-y-3 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            語言: {getLanguageLabel(prompt.language)}
          </Badge>
          <Badge variant="outline">
            版本: {prompt.version}
          </Badge>
          {prompt.isOfficial && (
            <Badge variant="default">
              官方版本
            </Badge>
          )}
          {prompt.source && (
            <Badge variant="outline">
              來源: {prompt.source}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>建立於 {formatDate(prompt.createdAt)}</span>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-3 flex-shrink-0">
        <Button onClick={copyToClipboard} className="flex-1" size="lg">
          {copied ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              已複製到剪貼簿
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 mr-2" />
              複製完整內容
            </>
          )}
        </Button>
        <Button variant="outline" onClick={downloadPrompt} size="lg">
          <Download className="w-5 h-5 mr-2" />
          下載檔案
        </Button>
      </div>

      {/* Content - 使用固定高度和完全可控的滾動 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg">提示詞內容</h4>
          <div className="text-sm text-muted-foreground">
            {charCount.toLocaleString()} 字元
          </div>
        </div>
        <div 
          className="w-full h-[60vh] border-2 border-border rounded-lg bg-muted/30 overflow-auto"
          style={{ maxHeight: '60vh', minHeight: '400px' }}
        >
          <div className="p-6">
            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed text-foreground">
              {prompt.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Analysis (Future Feature) */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h4 className="font-semibold mb-2">分析洞察</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• 複雜度分析功能即將推出</p>
          <p>• 提示詞技巧識別</p>
          <p>• 可讀性評分</p>
          <p>• 相似提示詞推薦</p>
        </div>
      </div>
    </div>
  )
}