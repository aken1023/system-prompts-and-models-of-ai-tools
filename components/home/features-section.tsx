import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Download,
  Code2,
  BookOpen,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Semantic search across 30+ AI tools with intelligent filtering and categorization.'
  },
  {
    icon: BarChart3,
    title: 'AI Analysis',
    description: 'Deep analysis of prompts including complexity scores, readability metrics, and technique identification.'
  },
  {
    icon: Code2,
    title: 'Side-by-Side Compare',
    description: 'Compare prompts from different tools to understand variations and best practices.'
  },
  {
    icon: BookOpen,
    title: 'Collections',
    description: 'Organize prompts into custom collections and share with the community.'
  },
  {
    icon: Download,
    title: 'Export & API',
    description: 'Download prompts in multiple formats or access via our comprehensive REST API.'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Contribute new prompts, improvements, and engage with other prompt engineers.'
  },
  {
    icon: Shield,
    title: 'Verified Sources',
    description: 'All prompts are verified and sourced from official documentation or reverse engineering.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Track changes and updates to AI tool prompts as they evolve over time.'
  },
  {
    icon: Sparkles,
    title: 'Prompt Engineering Insights',
    description: 'Learn from the best with detailed breakdowns of prompt engineering techniques.'
  }
]

export function FeaturesSection() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Everything you need for prompt engineering
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Comprehensive tools and insights to master AI prompt engineering
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}