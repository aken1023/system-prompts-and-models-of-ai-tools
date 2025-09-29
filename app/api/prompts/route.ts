import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

// GET /api/prompts - 獲取提示語列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const toolId = searchParams.get('toolId')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (toolId) {
      where.toolId = toolId
    }
    
    if (type) {
      where.type = type
    }
    
    if (search) {
      where.OR = [
        { content: { contains: search } },
        { tool: { name: { contains: search } } }
      ]
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        include: {
          tool: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: {
                select: {
                  name: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.prompt.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: prompts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { success: false, error: '獲取提示語失敗' },
      { status: 500 }
    )
  }
}

// POST /api/prompts - 創建新提示語
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      toolId,
      version,
      type = 'SYSTEM',
      content,
      metadata,
      language = 'en',
      source,
      sourceUrl,
      isOfficial = false
    } = body

    // 驗證必需字段
    if (!toolId || !content || !version) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      )
    }

    // 生成內容 hash
    const hash = createHash('sha256').update(content).digest('hex')

    // 檢查是否已存在相同內容的提示語
    const existingPrompt = await prisma.prompt.findUnique({
      where: { hash }
    })

    if (existingPrompt) {
      return NextResponse.json(
        { success: false, error: '相同內容的提示語已存在' },
        { status: 409 }
      )
    }

    // 驗證工具存在
    const tool = await prisma.tool.findUnique({
      where: { id: toolId }
    })

    if (!tool) {
      return NextResponse.json(
        { success: false, error: '指定的工具不存在' },
        { status: 404 }
      )
    }

    const prompt = await prisma.prompt.create({
      data: {
        toolId,
        version,
        type,
        content,
        metadata: metadata ? JSON.stringify(metadata) : null,
        language,
        hash,
        source,
        sourceUrl,
        isOfficial
      },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: prompt
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { success: false, error: '創建提示語失敗' },
      { status: 500 }
    )
  }
}