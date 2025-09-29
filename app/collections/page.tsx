"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  BookmarkIcon, 
  Users, 
  Lock,
  Globe,
  FileText,
  Star,
  Clock
} from 'lucide-react'
import { CollectionDialog } from '@/components/collections/collection-dialog'
import Link from 'next/link'

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
  _count: {
    items: number
  }
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('public')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        isPublic: activeTab === 'public' ? 'true' : 'false',
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/collections?${params}`)
      const data = await response.json()

      if (data.success) {
        setCollections(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    fetchCollections()
  }

  useEffect(() => {
    fetchCollections()
  }, [page, activeTab])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchCollections()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const getCollectionIcon = (isPublic: boolean) => {
    return isPublic ? Globe : Lock
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">提示語收藏集</h1>
          <p className="text-xl text-muted-foreground mb-6">
            發現和創建精心策劃的 AI 提示語收藏集
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookmarkIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-muted-foreground">總收藏集</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">活躍創作者</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">112</div>
                    <div className="text-sm text-muted-foreground">公開收藏集</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">1.2K</div>
                    <div className="text-sm text-muted-foreground">收藏提示語</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="public" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                公開收藏集
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                我的收藏集
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜尋收藏集..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新增收藏集
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="text-center py-12">載入中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {collections.map((collection) => {
              const IconComponent = getCollectionIcon(collection.isPublic)
              
              return (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-lg line-clamp-1">
                            {collection.name}
                          </CardTitle>
                        </div>
                        <Badge variant={collection.isPublic ? "default" : "secondary"}>
                          {collection.isPublic ? '公開' : '私人'}
                        </Badge>
                      </div>
                      {collection.description && (
                        <CardDescription className="line-clamp-2">
                          {collection.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{collection._count.items} 個提示語</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(collection.updatedAt).toLocaleDateString('zh-TW')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {collection.user.image ? (
                          <img
                            src={collection.user.image}
                            alt={collection.user.name || '用戶'}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-3 w-3" />
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {collection.user.name || collection.user.username || '匿名用戶'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && collections.length === 0 && (
          <div className="text-center py-12">
            <BookmarkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">尚無收藏集</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'public' ? '暫無公開的收藏集' : '您還沒有創建任何收藏集'}
            </p>
            {activeTab === 'private' && (
              <Button onClick={() => setDialogOpen(true)}>
                創建您的第一個收藏集
              </Button>
            )}
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

        <CollectionDialog
          open={dialogOpen}
          onClose={handleDialogClose}
        />
      </div>
    </div>
  )
}