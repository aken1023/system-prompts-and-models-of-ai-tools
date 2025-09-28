import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ide' },
      update: {},
      create: {
        name: 'IDE & Editors',
        slug: 'ide',
        description: 'AI-powered code editors and development environments',
        icon: 'Code2',
        order: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'cli' },
      update: {},
      create: {
        name: 'CLI Tools',
        slug: 'cli',
        description: 'Command line interfaces and terminal tools',
        icon: 'Terminal',
        order: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'platform' },
      update: {},
      create: {
        name: 'Platforms',
        slug: 'platform',
        description: 'Development platforms and collaborative environments',
        icon: 'Globe',
        order: 3
      }
    }),
    prisma.category.upsert({
      where: { slug: 'agent' },
      update: {},
      create: {
        name: 'AI Agents',
        slug: 'agent',
        description: 'Autonomous AI agents for complex tasks',
        icon: 'Bot',
        order: 4
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ui-ux' },
      update: {},
      create: {
        name: 'UI/UX Tools',
        slug: 'ui-ux',
        description: 'User interface and experience design tools',
        icon: 'Palette',
        order: 5
      }
    })
  ])

  console.log('✅ Categories created')

  // Create tools
  const tools = [
    {
      name: 'Claude Code',
      slug: 'claude-code',
      description: 'Interactive CLI tool that helps users with software engineering tasks',
      categorySlug: 'cli',
      website: 'https://claude.ai/code',
      features: ['Defensive Security', 'Task Management', 'Code Style', 'Tool Calling'],
      tags: ['CLI', 'Security', 'Engineering']
    },
    {
      name: 'Cursor',
      slug: 'cursor',
      description: 'AI-powered code editor with advanced prompting capabilities',
      categorySlug: 'ide',
      website: 'https://cursor.sh',
      features: ['Code Generation', 'Pair Programming', 'Tool Calling', 'File Management'],
      tags: ['IDE', 'Code Generation', 'AI Assistant']
    },
    {
      name: 'v0',
      slug: 'v0',
      description: 'AI-powered UI generation platform by Vercel',
      categorySlug: 'ui-ux',
      website: 'https://v0.dev',
      features: ['UI Generation', 'React Components', 'Design Systems'],
      tags: ['UI', 'React', 'Components']
    },
    {
      name: 'Windsurf',
      slug: 'windsurf',
      description: 'Advanced AI agent for complex development tasks',
      categorySlug: 'agent',
      website: 'https://codeium.com/windsurf',
      features: ['Multi-step Tasks', 'File Management', 'Code Analysis', 'Planning'],
      tags: ['Agent', 'Multi-step', 'Complex Tasks']
    },
    {
      name: 'Replit',
      slug: 'replit',
      description: 'Collaborative coding environment with integrated AI',
      categorySlug: 'platform',
      website: 'https://replit.com',
      features: ['Collaboration', 'Multi-language', 'Real-time', 'Cloud IDE'],
      tags: ['Platform', 'Collaboration', 'Cloud']
    },
    {
      name: 'Devin AI',
      slug: 'devin',
      description: 'Autonomous software engineer',
      categorySlug: 'agent',
      website: 'https://devin.ai',
      features: ['Autonomous', 'Full-stack', 'Planning', 'End-to-end'],
      tags: ['Agent', 'Autonomous', 'Full-stack']
    }
  ]

  for (const toolData of tools) {
    const category = categories.find(c => c.slug === toolData.categorySlug)
    if (!category) continue

    await prisma.tool.upsert({
      where: { slug: toolData.slug },
      update: {},
      create: {
        name: toolData.name,
        slug: toolData.slug,
        description: toolData.description,
        categoryId: category.id,
        website: toolData.website,
        features: toolData.features,
        tags: toolData.tags,
        status: 'ACTIVE'
      }
    })
  }

  console.log('✅ Tools created')

  // Import prompts from existing files
  await importPromptsFromFiles()

  console.log('✅ Database seed completed!')
}

async function importPromptsFromFiles() {
  console.log('📁 Importing prompts from existing files...')

  const promptMappings = [
    {
      toolSlug: 'claude-code',
      filePath: './Claude Code/claude-code-system-prompt.txt',
      type: 'SYSTEM',
      version: '1.0'
    },
    {
      toolSlug: 'cursor',
      filePath: './Cursor Prompts/Agent Prompt.txt',
      type: 'AGENT',
      version: '1.0'
    },
    {
      toolSlug: 'cursor',
      filePath: './Cursor Prompts/Chat Prompt.txt',
      type: 'SYSTEM',
      version: '1.0'
    },
    {
      toolSlug: 'v0',
      filePath: './v0 Prompts and Tools/Prompt.txt',
      type: 'SYSTEM',
      version: '1.0'
    },
    {
      toolSlug: 'windsurf',
      filePath: './Windsurf/Prompt Wave 11.txt',
      type: 'AGENT',
      version: '11.0'
    },
    {
      toolSlug: 'replit',
      filePath: './Replit/Prompt.txt',
      type: 'SYSTEM',
      version: '1.0'
    },
    {
      toolSlug: 'devin',
      filePath: './Devin AI/Prompt.txt',
      type: 'SYSTEM',
      version: '1.0'
    }
  ]

  for (const mapping of promptMappings) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug: mapping.toolSlug }
      })

      if (!tool) {
        console.log(`⚠️  Tool not found: ${mapping.toolSlug}`)
        continue
      }

      const filePath = path.join(process.cwd(), mapping.filePath)
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${mapping.filePath}`)
        continue
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const hash = generateSimpleHash(content)

      await prisma.prompt.upsert({
        where: { hash },
        update: {},
        create: {
          toolId: tool.id,
          content,
          hash,
          type: mapping.type as any,
          version: mapping.version,
          language: 'en',
          source: 'Official Repository',
          isOfficial: true,
          verifiedAt: new Date()
        }
      })

      console.log(`✅ Imported prompt for ${tool.name}`)
    } catch (error) {
      console.error(`❌ Error importing prompt for ${mapping.toolSlug}:`, error)
    }
  }
}

function generateSimpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })