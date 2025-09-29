import Link from 'next/link'
import { Sparkles, Github, Twitter } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    產品: [
      { name: '功能特色', href: '/features' },
      { name: '方案定價', href: '/pricing' },
      { name: 'API', href: '/api-docs' },
      { name: '更新日誌', href: '/changelog' },
    ],
    資源: [
      { name: '文檔', href: '/docs' },
      { name: '部落格', href: '/blog' },
      { name: '社群', href: '/community' },
      { name: '技術支援', href: '/support' },
    ],
    公司: [
      { name: '關於我們', href: '/about' },
      { name: '聯絡我們', href: '/contact' },
      { name: '隱私政策', href: '/privacy' },
      { name: '服務條款', href: '/terms' },
    ],
    聯繫: [
      { name: 'GitHub', href: 'https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools', external: true },
      { name: 'Discord', href: 'https://discord.gg/NwzrWErdMU', external: true },
      { name: 'Twitter', href: 'https://twitter.com/aipromptlib', external: true },
    ],
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">提示詞庫</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              專業的 AI 提示詞收集與分析平台
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/aipromptlib"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm">{category}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI 提示詞庫. 保留所有權利.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                隱私政策
              </Link>
              <Link href="/terms" className="hover:text-primary">
                服務條款
              </Link>
              <Link href="/cookies" className="hover:text-primary">
                Cookie 政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}