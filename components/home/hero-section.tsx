import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/search-bar'
import Link from 'next/link'
import { ArrowRight, Github, Star } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-bg">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* GitHub Star Badge */}
          <div className="mb-8 flex justify-center">
            <Link
              href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>在 GitHub 上給我們星星</span>
              <Star className="h-4 w-4" />
            </Link>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Discover AI{' '}
            <span className="gradient-text">System Prompts</span>{' '}
            from Leading Tools
          </h1>
          
          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore, analyze, and learn from 30+ AI tools including Claude, GPT, Cursor, and more. 
            Professional platform for prompt engineering insights with 20,000+ lines of prompts.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="w-full sm:w-auto">
                探索提示詞
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                查看 API 文檔
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-sm text-muted-foreground">AI Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">20K+</div>
              <div className="text-sm text-muted-foreground">Lines of Prompts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Techniques</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5K+</div>
              <div className="text-sm text-muted-foreground">GitHub Stars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-500 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  )
}