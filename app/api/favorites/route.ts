import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/favorites - 獲取用戶收藏的提示語
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用戶 ID' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        include: {
          prompt: {
            include: {
              tool: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logo: true,
                  category: {
                    select: {
                      name: true,
                      slug: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.favorite.count({ where: { userId } })
    ])

    return NextResponse.json({
      success: true,
      data: favorites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: '獲取收藏失敗' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - 添加收藏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, promptId } = body

    // 驗證必需字段
    if (!userId || !promptId) {
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

    // 驗證提示語存在
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    })

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: '提示語不存在' },
        { status: 404 }
      )
    }

    // 檢查是否已經收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId,
          promptId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: '已經收藏過此提示語' },
        { status: 409 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        promptId
      },
      include: {
        prompt: {
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: favorite
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating favorite:', error)
    return NextResponse.json(
      { success: false, error: '添加收藏失敗' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - 取消收藏
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const promptId = searchParams.get('promptId')

    if (!userId || !promptId) {
      return NextResponse.json(
        { success: false, error: '缺少必需參數' },
        { status: 400 }
      )
    }

    // 檢查收藏是否存在
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId,
          promptId
        }
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: '收藏不存在' },
        { status: 404 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_promptId: {
          userId,
          promptId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: '已取消收藏'
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, error: '取消收藏失敗' },
      { status: 500 }
    )
  }
}