import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

// GET /api/prompts/[id] - 獲取單個提示語
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            website: true,
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
    })

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: '提示語不存在' },
        { status: 404 }
      )
    }

    // 增加查看次數
    await prisma.prompt.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      data: prompt
    })
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { success: false, error: '獲取提示語失敗' },
      { status: 500 }
    )
  }
}

// PUT /api/prompts/[id] - 更新提示語
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      version,
      type,
      content,
      metadata,
      language,
      source,
      sourceUrl,
      isOfficial
    } = body

    // 檢查提示語是否存在
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id }
    })

    if (!existingPrompt) {
      return NextResponse.json(
        { success: false, error: '提示語不存在' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (version !== undefined) updateData.version = version
    if (type !== undefined) updateData.type = type
    if (language !== undefined) updateData.language = language
    if (source !== undefined) updateData.source = source
    if (sourceUrl !== undefined) updateData.sourceUrl = sourceUrl
    if (isOfficial !== undefined) updateData.isOfficial = isOfficial
    if (metadata !== undefined) {
      updateData.metadata = metadata ? JSON.stringify(metadata) : null
    }

    // 如果內容更新，需要重新計算 hash
    if (content !== undefined) {
      const hash = createHash('sha256').update(content).digest('hex')
      
      // 檢查新內容是否與其他提示語重複
      const duplicatePrompt = await prisma.prompt.findFirst({
        where: {
          hash,
          id: { not: id }
        }
      })

      if (duplicatePrompt) {
        return NextResponse.json(
          { success: false, error: '相同內容的提示語已存在' },
          { status: 409 }
        )
      }

      updateData.content = content
      updateData.hash = hash
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: updateData,
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
    })
  } catch (error) {
    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { success: false, error: '更新提示語失敗' },
      { status: 500 }
    )
  }
}

// DELETE /api/prompts/[id] - 刪除提示語
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 檢查提示語是否存在
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id }
    })

    if (!existingPrompt) {
      return NextResponse.json(
        { success: false, error: '提示語不存在' },
        { status: 404 }
      )
    }

    await prisma.prompt.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '提示語已刪除'
    })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { success: false, error: '刪除提示語失敗' },
      { status: 500 }
    )
  }
}