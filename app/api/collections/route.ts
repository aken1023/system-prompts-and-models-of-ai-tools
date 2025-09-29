import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/collections - 獲取收藏集列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const userId = searchParams.get('userId')
    const isPublic = searchParams.get('isPublic')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (isPublic !== null && isPublic !== undefined) {
      where.isPublic = isPublic === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.collection.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: collections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { success: false, error: '獲取收藏集失敗' },
      { status: 500 }
    )
  }
}

// POST /api/collections - 創建新收藏集
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      isPublic = false,
      userId
    } = body

    // 驗證必需字段
    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      )
    }

    // 驗證用戶存在
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用戶不存在' },
        { status: 404 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        isPublic,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: collection
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { success: false, error: '創建收藏集失敗' },
      { status: 500 }
    )
  }
}