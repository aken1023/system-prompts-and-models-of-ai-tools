"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Copy, Download, Eye, ExternalLink } from 'lucide-react'
import { FavoriteButton } from '@/components/prompts/favorite-button'
import { AddToCollectionButton } from '@/components/prompts/add-to-collection-button'

interface Prompt {
  id: string
  content: string
  version: string
  type: string
  language: string
  viewCount: number
  downloadCount: number
  source?: string
  sourceUrl?: string
  isOfficial: boolean
  createdAt: string
  updatedAt: string
  tool: {
    id: string
    name: string
    slug: string
    description?: string
    website?: string
    logo?: string
    category: {
      name: string
      slug: string
    }
  }
}

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPrompt(params.id as string)
    }
  }, [params.id])

  const fetchPrompt = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prompts/${id}`)
      const data = await response.json()

      if (data.success) {
        setPrompt(data.data)
      } else {
        alert('提示語不存在')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error fetching prompt:', error)
      alert('載入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!prompt) return

    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleDownload = () => {
    if (!prompt) return

    const element = document.createElement('a')
    const file = new Blob([prompt.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${prompt.tool.slug}-${prompt.version}-prompt.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDelete = async () => {
    if (!prompt || !confirm('確定要刪除這個提示語嗎？')) return

    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
      alert('刪除失敗')
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'SYSTEM': '系統提示',
      'AGENT': '代理提示',
      'TOOL_DEFINITION': '工具定義',
      'MEMORY': '記憶提示',
      'PLANNING': '規劃提示',
      'OTHER': '其他'
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>載入中...</div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>提示語不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回管理頁面
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{prompt.tool.name}</h1>
              <p className="text-muted-foreground">版本 {prompt.version}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? '已複製' : '複製'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                下載
              </Button>
              <FavoriteButton promptId={prompt.id} size="sm" />
              <AddToCollectionButton promptId={prompt.id} size="sm" />
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                編輯
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                刪除
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>提示語內容</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                    {prompt.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>工具資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {prompt.tool.logo && (
                    <img
                      src={prompt.tool.logo}
                      alt={prompt.tool.name}
                      className="w-12 h-12 rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{prompt.tool.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {prompt.tool.category.name}
                    </p>
                  </div>
                </div>
                
                {prompt.tool.description && (
                  <p className="text-sm">{prompt.tool.description}</p>
                )}

                {prompt.tool.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(prompt.tool.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    訪問官網
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>提示語屬性</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">類型</span>
                  <Badge variant="secondary">{getTypeLabel(prompt.type)}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">語言</span>
                  <span className="text-sm">{prompt.language}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">官方</span>
                  <Badge variant={prompt.isOfficial ? "default" : "secondary"}>
                    {prompt.isOfficial ? '是' : '否'}
                  </Badge>
                </div>

                {prompt.source && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">來源</span>
                    <span className="text-sm">{prompt.source}</span>
                  </div>
                )}

                {prompt.sourceUrl && (
                  <div>
                    <span className="text-sm text-muted-foreground">來源網址</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 ml-2"
                      onClick={() => window.open(prompt.sourceUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>統計資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">查看次數</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="text-sm">{prompt.viewCount}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">下載次數</span>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span className="text-sm">{prompt.downloadCount}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">建立時間</span>
                  <span className="text-sm">
                    {new Date(prompt.createdAt).toLocaleDateString('zh-TW')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">更新時間</span>
                  <span className="text-sm">
                    {new Date(prompt.updatedAt).toLocaleDateString('zh-TW')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}