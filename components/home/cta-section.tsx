import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  return (
    <div className="mx-auto max-w-4xl text-center text-white">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
        <Sparkles className="h-8 w-8" />
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
        準備提升您的提示詞工程技能了嗎？
      </h2>
      
      <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        加入數千名開發者，使用我們的平台來探索、分析和改進您的 AI 提示詞。
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/explore">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            免費開始探索
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/api-docs">
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
            查看 API 文檔
          </Button>
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-white/70">
        無需信用卡 • 完全免費 • 開源項目
      </div>
    </div>
  )
}