"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { PromptDialog } from './prompt-dialog'

interface Prompt {
  id: string
  content: string
  version: string
  type: string
  language: string
  viewCount: number
  createdAt: string
  tool: {
    id: string
    name: string
    slug: string
  }
}

export function PromptsManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/prompts?${params}`)
      const data = await response.json()

      if (data.success) {
        setPrompts(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個提示語嗎？')) return

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPrompts()
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
      alert('刪除失敗')
    }
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingPrompt(null)
    fetchPrompts()
  }

  useEffect(() => {
    fetchPrompts()
  }, [page])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchPrompts()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜尋提示語..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          新增提示語
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">載入中...</div>
      ) : (
        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{prompt.tool.name}</CardTitle>
                    <CardDescription>
                      版本 {prompt.version} • {prompt.language}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{prompt.type}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {prompt.viewCount}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm line-clamp-3">{prompt.content}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      建立於 {new Date(prompt.createdAt).toLocaleDateString('zh-TW')}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(prompt)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(prompt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      <PromptDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        prompt={editingPrompt}
      />
    </div>
  )
}