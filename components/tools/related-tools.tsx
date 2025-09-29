import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ExternalLink } from 'lucide-react'

interface RelatedTool {
  id: string
  name: string
  slug: string
  description?: string
  features?: string
  _count: {
    prompts: number
  }
}

interface RelatedToolsProps {
  tools: RelatedTool[]
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">相關工具</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{tool.name}</h4>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </div>
              
              {tool.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>{tool._count.prompts} 個提示詞</span>
                </div>
                
                {tool.features && (
                  <Badge variant="outline" className="text-xs">
                    {JSON.parse(tool.features).length} 功能
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}