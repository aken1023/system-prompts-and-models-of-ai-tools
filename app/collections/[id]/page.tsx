"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2, 
  Plus,
  FileText,
  Eye,
  Download,
  Clock,
  Users,
  Globe,
  Lock
} from 'lucide-react'
import Link from 'next/link'

interface CollectionItem {
  id: string
  note?: string
  order: number
  createdAt: string
  prompt: {
    id: string
    content: string
    version: string
    type: string
    language: string
    viewCount: number
    downloadCount: number
    isOfficial: boolean
    tool: {
      id: string
      name: string
      slug: string
      logo?: string
    }
  }
}

interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name?: string
    username?: string
    image?: string
  }
  items: CollectionItem[]
}

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCollection(params.id as string)
    }
  }, [params.id])

  const fetchCollection = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/collections/${id}`)
      const data = await response.json()

      if (data.success) {
        setCollection(data.data)
      } else {
        alert('收藏集不存在')
        router.push('/collections')
      }
    } catch (error) {
      console.error('Error fetching collection:', error)
      alert('載入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!collection) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${collection.name} - AI 提示語收藏集`,
          text: collection.description,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('連結已複製到剪貼板')
      }
    } catch (error) {
      console.error('Share failed:', error)
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

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>收藏集不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/collections')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回收藏集
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{collection.name}</h1>
                <Badge variant={collection.isPublic ? "default" : "secondary"}>
                  {collection.isPublic ? (
                    <><Globe className="h-3 w-3 mr-1" />公開</>
                  ) : (
                    <><Lock className="h-3 w-3 mr-1" />私人</>
                  )}
                </Badge>
              </div>
              
              {collection.description && (
                <p className="text-muted-foreground mb-4">{collection.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {collection.user.image ? (
                    <img
                      src={collection.user.image}
                      alt={collection.user.name || '用戶'}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  <span>{collection.user.name || collection.user.username || '匿名用戶'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{collection.items.length} 個提示語</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>更新於 {new Date(collection.updatedAt).toLocaleDateString('zh-TW')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                分享
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                編輯
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                添加提示語
              </Button>
            </div>
          </div>
        </div>

        {/* Collection Items */}
        {collection.items.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">收藏集是空的</h3>
            <p className="text-muted-foreground mb-4">
              開始添加一些提示語到這個收藏集吧
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              添加提示語
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {collection.items.map((item, index) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      {item.prompt.tool.logo && (
                        <img
                          src={item.prompt.tool.logo}
                          alt={item.prompt.tool.name}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{item.prompt.tool.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          版本 {item.prompt.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {getTypeLabel(item.prompt.type)}
                      </Badge>
                      {item.prompt.isOfficial && (
                        <Badge variant="default">官方</Badge>
                      )}
                    </div>
                  </div>

                  {item.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>筆記：</strong>{item.note}
                      </p>
                    </div>
                  )}

                  <div className="bg-muted p-4 rounded mb-4">
                    <p className="text-sm line-clamp-3">{item.prompt.content}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{item.prompt.viewCount} 次查看</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{item.prompt.downloadCount} 次下載</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>添加於 {new Date(item.createdAt).toLocaleDateString('zh-TW')}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/admin/prompts/${item.prompt.id}`}>
                        <Button variant="outline" size="sm">
                          查看詳情
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}