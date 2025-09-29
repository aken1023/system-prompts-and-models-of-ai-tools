import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/collections/[id]/items - 添加提示語到收藏集
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: collectionId } = params
    const body = await request.json()
    const { promptId, note, order } = body

    // 驗證必需字段
    if (!promptId) {
      return NextResponse.json(
        { success: false, error: '缺少提示語 ID' },
        { status: 400 }
      )
    }

    // 驗證收藏集存在
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    })

    if (!collection) {
      return NextResponse.json(
        { success: false, error: '收藏集不存在' },
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

    // 檢查是否已經在收藏集中
    const existingItem = await prisma.collectionItem.findUnique({
      where: {
        collectionId_promptId: {
          collectionId,
          promptId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: '提示語已在收藏集中' },
        { status: 409 }
      )
    }

    // 如果沒有指定順序，設為最後
    let itemOrder = order
    if (itemOrder === undefined) {
      const lastItem = await prisma.collectionItem.findFirst({
        where: { collectionId },
        orderBy: { order: 'desc' }
      })
      itemOrder = lastItem ? lastItem.order + 1 : 0
    }

    const collectionItem = await prisma.collectionItem.create({
      data: {
        collectionId,
        promptId,
        note,
        order: itemOrder
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
      data: collectionItem
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding item to collection:', error)
    return NextResponse.json(
      { success: false, error: '添加到收藏集失敗' },
      { status: 500 }
    )
  }
}

// GET /api/collections/[id]/items - 獲取收藏集中的項目
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: collectionId } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.collectionItem.findMany({
        where: { collectionId },
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
        },
        orderBy: { order: 'asc' },
        skip,
        take: limit
      }),
      prisma.collectionItem.count({
        where: { collectionId }
      })
    ])

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching collection items:', error)
    return NextResponse.json(
      { success: false, error: '獲取收藏集項目失敗' },
      { status: 500 }
    )
  }
}