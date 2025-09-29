"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react'

interface Tool {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
  logo?: string
  status: string
  category: {
    id: string
    name: string
    slug: string
  }
  _count: {
    prompts: number
  }
  createdAt: string
}

export function ToolsManager() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchTools = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/tools?${params}`)
      const data = await response.json()

      if (data.success) {
        setTools(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTools()
  }, [page])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchTools()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'DEPRECATED':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '活躍'
      case 'DEPRECATED':
        return '已棄用'
      case 'ARCHIVED':
        return '已歸檔'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜尋 AI 工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新增工具
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">載入中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {tool.logo && (
                      <img
                        src={tool.logo}
                        alt={tool.name}
                        className="w-8 h-8 rounded"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.category.name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(tool.status)}>
                    {getStatusText(tool.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {tool.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{tool._count.prompts} 個提示語</span>
                  <span>
                    建立於 {new Date(tool.createdAt).toLocaleDateString('zh-TW')}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    {tool.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(tool.website, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            上一頁
          </Button>
          <span className="flex items-center px-4">
            第 {page} 頁，共 {totalPages} 頁
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            下一頁
          </Button>
        </div>
      )}
    </div>
  )
}