import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ToolHeader } from '@/components/tools/tool-header'
import { PromptsGrid } from '@/components/tools/prompts-grid'
import { ToolStats } from '@/components/tools/tool-stats'
import { RelatedTools } from '@/components/tools/related-tools'

interface ToolPageProps {
  params: {
    slug: string
  }
}

async function getToolData(slug: string) {
  try {
    const tool = await prisma.tool.findUnique({
      where: { slug },
      include: {
        category: true,
        prompts: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!tool) {
      return null
    }

    // Parse JSON fields
    const features = tool.features ? JSON.parse(tool.features) : []
    const tags = tool.tags ? JSON.parse(tool.tags) : []

    return {
      ...tool,
      features,
      tags
    }
  } catch (error) {
    console.error('Error fetching tool data:', error)
    return null
  }
}

async function getRelatedTools(categoryId: string, currentToolId: string) {
  try {
    return await prisma.tool.findMany({
      where: {
        categoryId,
        id: {
          not: currentToolId
        }
      },
      take: 3,
      include: {
        _count: {
          select: {
            prompts: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching related tools:', error)
    return []
  }
}

export async function generateMetadata({ params }: ToolPageProps) {
  const tool = await getToolData(params.slug)
  
  if (!tool) {
    return {
      title: '工具不存在',
      description: '找不到指定的 AI 工具'
    }
  }

  return {
    title: `${tool.name} - AI 提示詞庫`,
    description: tool.description || `探索 ${tool.name} 的系統提示詞和最佳實踐`,
    keywords: [tool.name, 'AI 提示詞', '系統提示詞', ...tool.tags]
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const tool = await getToolData(params.slug)

  if (!tool) {
    notFound()
  }

  const relatedTools = await getRelatedTools(tool.categoryId, tool.id)

  return (
    <div className="w-full bg-gradient-to-b from-background to-muted/20">
      {/* Tool Header */}
      <ToolHeader tool={tool} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Tool Stats */}
            <ToolStats tool={tool} />

            {/* Prompts Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">系統提示詞</h2>
                <div className="text-sm text-muted-foreground">
                  共 {tool.prompts.length} 個提示詞
                </div>
              </div>
              <PromptsGrid prompts={tool.prompts} />
            </section>

            {/* Features & Tags */}
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">主要功能</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature: string) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">標籤</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool Info */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">工具資訊</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">分類</div>
                  <div className="font-medium">{tool.category.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">狀態</div>
                  <div className="font-medium">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      tool.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {tool.status === 'ACTIVE' ? '活躍' : '已棄用'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">提示詞數量</div>
                  <div className="font-medium">{tool.prompts.length}</div>
                </div>
                {tool.website && (
                  <div>
                    <div className="text-sm text-muted-foreground">官方網站</div>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      訪問官網
                    </a>
                  </div>
                )}
                {tool.githubUrl && (
                  <div>
                    <div className="text-sm text-muted-foreground">GitHub</div>
                    <a
                      href={tool.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      查看源碼
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <RelatedTools tools={relatedTools} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}