"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter,
  SlidersHorizontal,
  FileText,
  Eye,
  Download,
  Star,
  Clock,
  Grid3X3,
  List,
  ArrowUpDown
} from 'lucide-react'
import Link from 'next/link'

interface Prompt {
  id: string
  content: string
  version: string
  type: string
  language: string
  viewCount: number
  downloadCount: number
  isOfficial: boolean
  createdAt: string
  tool: {
    id: string
    name: string
    slug: string
    logo?: string
    category: {
      name: string
      slug: string
    }
  }
}

interface Tool {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

const PROMPT_TYPES = [
  { value: '', label: '所有類型' },
  { value: 'SYSTEM', label: '系統提示' },
  { value: 'AGENT', label: '代理提示' },
  { value: 'TOOL_DEFINITION', label: '工具定義' },
  { value: 'MEMORY', label: '記憶提示' },
  { value: 'PLANNING', label: '規劃提示' },
  { value: 'OTHER', label: '其他' }
]

const LANGUAGES = [
  { value: '', label: '所有語言' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '簡體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' }
]

const SORT_OPTIONS = [
  { value: 'newest', label: '最新' },
  { value: 'popular', label: '最受歡迎' },
  { value: 'trending', label: '趨勢' },
  { value: 'downloads', label: '下載次數' }
]

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTool, setSelectedTool] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isOfficial, setIsOfficial] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: viewMode === 'grid' ? '12' : '20',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTool && { toolId: selectedTool }),
        ...(selectedType && { type: selectedType }),
        ...(selectedLanguage && { language: selectedLanguage })
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

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedTool('')
    setSelectedCategory('')
    setSelectedType('')
    setSelectedLanguage('')
    setIsOfficial('')
    setPage(1)
  }

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [page, selectedTool, selectedType, selectedLanguage, sortBy, viewMode])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchPrompts()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const getTypeLabel = (type: string) => {
    const typeOption = PROMPT_TYPES.find(t => t.value === type)
    return typeOption?.label || type
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">探索提示語</h1>
          <p className="text-xl text-muted-foreground">
            發現並學習各種 AI 工具的精選提示語
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Main Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜尋提示語內容、工具名稱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                篩選器
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">AI 工具</label>
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇工具" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">所有工具</SelectItem>
                      {tools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">類型</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇類型" />
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
                  <label className="text-sm font-medium mb-2 block">語言</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇語言" />
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

                <div>
                  <label className="text-sm font-medium mb-2 block">排序</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    重置篩選
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">載入中...</div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-muted-foreground">
                找到 {prompts.length} 個提示語
              </div>
            </div>

            {/* Prompts Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {prompts.map((prompt) => (
                  <Link key={prompt.id} href={`/admin/prompts/${prompt.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {prompt.tool.logo && (
                              <img
                                src={prompt.tool.logo}
                                alt={prompt.tool.name}
                                className="w-6 h-6 rounded"
                              />
                            )}
                            <CardTitle className="text-base line-clamp-1">
                              {prompt.tool.name}
                            </CardTitle>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(prompt.type)}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {prompt.tool.category.name} • v{prompt.version}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-muted p-3 rounded text-xs">
                          <p className="line-clamp-3">{prompt.content}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{prompt.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{prompt.downloadCount}</span>
                            </div>
                          </div>
                          {prompt.isOfficial && (
                            <Badge variant="default" className="text-xs">
                              官方
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {prompts.map((prompt) => (
                  <Link key={prompt.id} href={`/admin/prompts/${prompt.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {prompt.tool.logo && (
                              <img
                                src={prompt.tool.logo}
                                alt={prompt.tool.name}
                                className="w-8 h-8 rounded"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold">{prompt.tool.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {prompt.tool.category.name} • v{prompt.version}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {getTypeLabel(prompt.type)}
                            </Badge>
                            {prompt.isOfficial && (
                              <Badge variant="default">官方</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded mb-4">
                          <p className="text-sm line-clamp-2">{prompt.content}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{prompt.viewCount} 次查看</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{prompt.downloadCount} 次下載</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(prompt.createdAt).toLocaleDateString('zh-TW')}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty State */}
            {prompts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">未找到提示語</h3>
                <p className="text-muted-foreground mb-4">
                  嘗試調整您的搜尋條件或篩選器
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  重置篩選
                </Button>
              </div>
            )}

            {/* Pagination */}
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
          </>
        )}
      </div>
    </div>
  )
}