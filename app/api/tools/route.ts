import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tools - 獲取工具列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'ACTIVE'

    const skip = (page - 1) * limit

    const where: any = { status }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const [tools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              prompts: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.tool.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: tools,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { success: false, error: '獲取工具列表失敗' },
      { status: 500 }
    )
  }
}

// POST /api/tools - 創建新工具
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      categoryId,
      website,
      logo,
      githubUrl,
      features,
      tags
    } = body

    // 驗證必需字段
    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      )
    }

    // 檢查 slug 是否已存在
    const existingTool = await prisma.tool.findUnique({
      where: { slug }
    })

    if (existingTool) {
      return NextResponse.json(
        { success: false, error: 'slug 已存在' },
        { status: 409 }
      )
    }

    // 驗證分類存在
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: '指定的分類不存在' },
        { status: 404 }
      )
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        website,
        logo,
        githubUrl,
        features: features ? JSON.stringify(features) : JSON.stringify([]),
        tags: tags ? JSON.stringify(tags) : JSON.stringify([])
      },
      include: {
        category: {
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
      data: tool
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json(
      { success: false, error: '創建工具失敗' },
      { status: 500 }
    )
  }
}