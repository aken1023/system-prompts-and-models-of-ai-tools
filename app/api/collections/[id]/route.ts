import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/collections/[id] - 獲取單個收藏集
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        items: {
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
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!collection) {
      return NextResponse.json(
        { success: false, error: '收藏集不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: collection
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { success: false, error: '獲取收藏集失敗' },
      { status: 500 }
    )
  }
}

// PUT /api/collections/[id] - 更新收藏集
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, isPublic } = body

    // 檢查收藏集是否存在
    const existingCollection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!existingCollection) {
      return NextResponse.json(
        { success: false, error: '收藏集不存在' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (isPublic !== undefined) updateData.isPublic = isPublic

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData,
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
    })
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { success: false, error: '更新收藏集失敗' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id] - 刪除收藏集
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 檢查收藏集是否存在
    const existingCollection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!existingCollection) {
      return NextResponse.json(
        { success: false, error: '收藏集不存在' },
        { status: 404 }
      )
    }

    await prisma.collection.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '收藏集已刪除'
    })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { success: false, error: '刪除收藏集失敗' },
      { status: 500 }
    )
  }
}