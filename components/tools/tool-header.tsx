'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, Download, Share2 } from 'lucide-react'

interface ToolHeaderProps {
  tool: {
    id: string
    name: string
    description?: string | null
    website?: string | null
    githubUrl?: string | null
    status: string
    category: {
      name: string
    }
    features: string[]
    tags: string[]
    prompts: any[]
  }
}

export function ToolHeader({ tool }: ToolHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-blue-100 text-sm mb-6">
            <span>AI 工具</span>
            <span>/</span>
            <span>{tool.category.name}</span>
            <span>/</span>
            <span className="text-white font-medium">{tool.name}</span>
          </div>

          {/* Tool Info */}
          <div className="flex items-start gap-6">
            {/* Tool Icon/Logo */}
            <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {tool.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Tool Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">{tool.name}</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tool.category.name}
                </Badge>
              </div>

              {tool.description && (
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  {tool.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {tool.website && (
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <a href={tool.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      訪問官網
                    </a>
                  </Button>
                )}

                {tool.githubUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Star className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    // TODO: 實作下載功能
                    console.log('Download prompts')
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下載提示詞
                </Button>

                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    // TODO: 實作分享功能
                    navigator.share?.({
                      title: `${tool.name} - AI 提示詞庫`,
                      text: tool.description,
                      url: window.location.href
                    }).catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href)
                    })
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {tool.prompts.length}
              </div>
              <div className="text-blue-100 text-sm">提示詞數量</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {tool.features.length}
              </div>
              <div className="text-blue-100 text-sm">主要功能</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {tool.prompts.filter(p => p.language === 'zh-TW').length}
              </div>
              <div className="text-blue-100 text-sm">中文提示詞</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {tool.status === 'ACTIVE' ? '✓' : '✗'}
              </div>
              <div className="text-blue-100 text-sm">
                {tool.status === 'ACTIVE' ? '活躍維護' : '已棄用'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}