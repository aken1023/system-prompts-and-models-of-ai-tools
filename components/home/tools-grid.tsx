import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

const popularTools = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Interactive CLI tool for software engineering tasks',
    category: 'CLI',
    promptCount: 5,
    logo: '/logos/claude.svg',
    features: ['Defensive Security', 'Task Management', 'Code Style']
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered code editor with advanced prompting',
    category: 'IDE',
    promptCount: 8,
    logo: '/logos/cursor.svg',
    features: ['Code Generation', 'Pair Programming', 'Tool Calling']
  },
  {
    id: 'v0',
    name: 'v0',
    description: 'AI-powered UI generation platform',
    category: 'UI/UX',
    promptCount: 3,
    logo: '/logos/v0.svg',
    features: ['UI Generation', 'React Components', 'Design Systems']
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'Advanced AI agent for complex development tasks',
    category: 'Agent',
    promptCount: 12,
    logo: '/logos/windsurf.svg',
    features: ['Multi-step Tasks', 'File Management', 'Code Analysis']
  },
  {
    id: 'replit',
    name: 'Replit',
    description: 'Collaborative coding environment with AI',
    category: 'Platform',
    promptCount: 6,
    logo: '/logos/replit.svg',
    features: ['Collaboration', 'Multi-language', 'Real-time']
  },
  {
    id: 'devin',
    name: 'Devin AI',
    description: 'Autonomous software engineer',
    category: 'Agent',
    promptCount: 4,
    logo: '/logos/devin.svg',
    features: ['Autonomous', 'Full-stack', 'Planning']
  }
]

export function ToolsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {popularTools.map((tool) => (
        <Link key={tool.id} href={`/tools/${tool.id}`}>
          <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {tool.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {tool.promptCount} prompts
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {tool.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1">
                {tool.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}