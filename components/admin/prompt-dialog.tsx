"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Tool {
  id: string
  name: string
  slug: string
}

interface Prompt {
  id: string
  toolId: string
  version: string
  type: string
  content: string
  language: string
  source?: string
  sourceUrl?: string
  isOfficial: boolean
}

interface PromptDialogProps {
  open: boolean
  onClose: () => void
  prompt?: Prompt | null
}

const PROMPT_TYPES = [
  { value: 'SYSTEM', label: '系統提示' },
  { value: 'AGENT', label: '代理提示' },
  { value: 'TOOL_DEFINITION', label: '工具定義' },
  { value: 'MEMORY', label: '記憶提示' },
  { value: 'PLANNING', label: '規劃提示' },
  { value: 'OTHER', label: '其他' }
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '簡體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' }
]

export function PromptDialog({ open, onClose, prompt }: PromptDialogProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    toolId: '',
    version: '1.0',
    type: 'SYSTEM',
    content: '',
    language: 'en',
    source: '',
    sourceUrl: '',
    isOfficial: false
  })

  const isEditing = !!prompt

  useEffect(() => {
    if (open) {
      fetchTools()
      if (prompt) {
        setFormData({
          toolId: prompt.toolId,
          version: prompt.version,
          type: prompt.type,
          content: prompt.content,
          language: prompt.language,
          source: prompt.source || '',
          sourceUrl: prompt.sourceUrl || '',
          isOfficial: prompt.isOfficial
        })
      } else {
        setFormData({
          toolId: '',
          version: '1.0',
          type: 'SYSTEM',
          content: '',
          language: 'en',
          source: '',
          sourceUrl: '',
          isOfficial: false
        })
      }
    }
  }, [open, prompt])

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/tools?limit=100')
      const data = await response.json()
      if (data.success) {
        setTools(data.data)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.toolId || !formData.content.trim()) {
      alert('請填寫必需字段')
      return
    }

    setLoading(true)

    try {
      const url = isEditing ? `/api/prompts/${prompt.id}` : '/api/prompts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        onClose()
      } else {
        alert(data.error || '操作失敗')
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
      alert('操作失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? '編輯提示語' : '新增提示語'}</DialogTitle>
          <DialogDescription>
            {isEditing ? '更新提示語資訊' : '建立新的提示語'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="toolId">AI 工具 *</Label>
              <Select
                value={formData.toolId}
                onValueChange={(value) => setFormData({ ...formData, toolId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇 AI 工具" />
                </SelectTrigger>
                <SelectContent>
                  {tools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="version">版本 *</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="例如: 1.0, v2.1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">類型</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROMPT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">語言</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="content">提示語內容 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="輸入提示語內容..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">來源</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="例如: 官方文檔, GitHub"
              />
            </div>

            <div>
              <Label htmlFor="sourceUrl">來源網址</Label>
              <Input
                id="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOfficial"
              checked={formData.isOfficial}
              onChange={(e) => setFormData({ ...formData, isOfficial: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isOfficial">官方提示語</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '處理中...' : (isEditing ? '更新' : '建立')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}