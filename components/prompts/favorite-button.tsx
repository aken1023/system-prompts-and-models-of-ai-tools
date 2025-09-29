"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  promptId: string
  userId?: string
  initialFavorited?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function FavoriteButton({ 
  promptId, 
  userId = 'user_demo_id', // 模擬用戶 ID，實際應用中應從認證狀態獲取
  initialFavorited = false,
  className,
  size = 'default'
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // 防止觸發父元素的點擊事件
    e.stopPropagation()

    if (loading) return

    setLoading(true)

    try {
      if (isFavorited) {
        // 取消收藏
        const response = await fetch(`/api/favorites?userId=${userId}&promptId=${promptId}`, {
          method: 'DELETE'
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorited(false)
        } else {
          alert(data.error || '取消收藏失敗')
        }
      } else {
        // 添加收藏
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            promptId
          })
        })

        const data = await response.json()
        if (data.success) {
          setIsFavorited(true)
        } else {
          alert(data.error || '添加收藏失敗')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('操作失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size={size}
      onClick={handleToggleFavorite}
      disabled={loading}
      className={cn(
        "flex items-center gap-2",
        isFavorited && "bg-red-500 hover:bg-red-600 text-white",
        className
      )}
    >
      <Heart 
        className={cn(
          size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
          isFavorited && "fill-current"
        )} 
      />
      {size !== 'sm' && (
        <span>{isFavorited ? '已收藏' : '收藏'}</span>
      )}
    </Button>
  )
}