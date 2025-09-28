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
        Ready to level up your prompt engineering?
      </h2>
      
      <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        Join thousands of developers who use our platform to discover, analyze, and improve their AI prompts.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/signup">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            Get Started for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
            View Pricing
          </Button>
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-white/70">
        No credit card required • Cancel anytime • 14-day free trial
      </div>
    </div>
  )
}