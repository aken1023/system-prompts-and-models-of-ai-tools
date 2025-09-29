import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { ToolsGrid } from '@/components/home/tools-grid'
import { StatsSection } from '@/components/home/stats-section'
import { CTASection } from '@/components/home/cta-section'
import { SearchBar } from '@/components/search/search-bar'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              探索頂尖 AI 工具的{' '}
              <span className="gradient-text">系統提示詞</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              探索、分析並學習來自 Claude、GPT、Cursor 等 30+ 個 AI 工具的提示詞。
              專業的提示詞工程洞察平台。
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar />
            </div>

            {/* Quick Stats */}
            <div className="mt-10 flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-semibold text-2xl text-gray-900 dark:text-white">30+</span>
                <p>AI 工具</p>
              </div>
              <div>
                <span className="font-semibold text-2xl text-gray-900 dark:text-white">20,000+</span>
                <p>提示詞行數</p>
              </div>
              <div>
                <span className="font-semibold text-2xl text-gray-900 dark:text-white">100+</span>
                <p>技巧方法</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-500 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              熱門 AI 工具
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              探索最受歡迎的 AI 編程助手和工具的系統提示詞
            </p>
          </div>
          <ToolsGrid />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <FeaturesSection />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <CTASection />
        </div>
      </section>
    </div>
  )
}