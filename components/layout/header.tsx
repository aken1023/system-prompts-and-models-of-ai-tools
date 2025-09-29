'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Code2, 
  Users,
  Menu,
  X 
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: '探索',
      href: '/explore',
      icon: Search,
      description: '瀏覽所有 AI 提示詞'
    },
    {
      name: '工具',
      href: '/tools',
      icon: Code2,
      description: '查看所有 AI 工具'
    },
    {
      name: '比較',
      href: '/compare',
      icon: Sparkles,
      description: '並排比較提示詞'
    },
    {
      name: '收藏集',
      href: '/collections',
      icon: BookOpen,
      description: '社群收藏集'
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden sm:inline">
                AI 提示詞庫
              </span>
              <span className="font-bold text-xl sm:hidden">
                提示詞庫
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/api-docs">
                <Button variant="outline">API 文檔</Button>
              </Link>
              <Link href="/explore">
                <Button>開始探索</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="border-t pt-4 flex flex-col gap-2">
                <Link href="/api-docs" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    API 文檔
                  </Button>
                </Link>
                <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    開始探索
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}