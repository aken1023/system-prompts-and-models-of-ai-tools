import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Users, Download, Zap } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '2.5M+',
    label: 'Monthly Views',
    description: 'Developers exploring prompts monthly'
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
    description: 'Prompt engineers using our platform'
  },
  {
    icon: Download,
    value: '1M+',
    label: 'Downloads',
    description: 'Prompts downloaded and used'
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable access to prompt library'
  }
]

export function StatsSection() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Trusted by developers worldwide
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Join thousands of developers who rely on our prompt library
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}