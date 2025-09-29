import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ExternalLink } from 'lucide-react'

async function getTools() {
  try {
    return await prisma.tool.findMany({
      include: {
        category: true,
        _count: {
          select: {
            prompts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return []
  }
}

export const metadata = {
  title: 'AI 工具總覽 - AI 提示詞庫',
  description: '瀏覽所有收錄的 AI 工具及其系統提示詞'
}

export default async function ToolsPage() {
  const tools = await getTools()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">AI 工具總覽</h1>
            <p className="text-xl text-blue-100">
              探索 {tools.length} 個 AI 工具的系統提示詞和最佳實踐
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const features = tool.features ? JSON.parse(tool.features) : []
            const tags = tool.tags ? JSON.parse(tool.tags) : []
            
            return (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {tool.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {tool.category.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {tool._count.prompts} 個提示詞
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {tool.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    )}
                    
                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {features.slice(0, 3).map((feature: string) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{features.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        <span>{tool._count.prompts} 提示詞</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <span>查看詳情</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">尚無工具資料</h3>
            <p className="text-muted-foreground">資料庫中還沒有任何 AI 工具資料。</p>
          </div>
        )}
      </div>
    </div>
  )
}