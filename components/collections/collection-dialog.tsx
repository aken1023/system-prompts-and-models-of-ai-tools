"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
}

interface CollectionDialogProps {
  open: boolean
  onClose: () => void
  collection?: Collection | null
}

export function CollectionDialog({ open, onClose, collection }: CollectionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  })

  const isEditing = !!collection

  useEffect(() => {
    if (open) {
      if (collection) {
        setFormData({
          name: collection.name,
          description: collection.description || '',
          isPublic: collection.isPublic
        })
      } else {
        setFormData({
          name: '',
          description: '',
          isPublic: false
        })
      }
    }
  }, [open, collection])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('請填寫收藏集名稱')
      return
    }

    setLoading(true)

    try {
      // 模擬用戶 ID（實際應用中應從認證狀態獲取）
      const userId = 'user_demo_id'
      
      const url = isEditing ? `/api/collections/${collection.id}` : '/api/collections'
      const method = isEditing ? 'PUT' : 'POST'

      const payload = isEditing ? formData : { ...formData, userId }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        onClose()
      } else {
        alert(data.error || '操作失敗')
      }
    } catch (error) {
      console.error('Error saving collection:', error)
      alert('操作失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? '編輯收藏集' : '新增收藏集'}</DialogTitle>
          <DialogDescription>
            {isEditing ? '更新收藏集資訊' : '建立新的提示語收藏集'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">收藏集名稱 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：開發者工具提示語"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="簡單描述這個收藏集的用途..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isPublic">公開此收藏集</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            公開的收藏集可以被其他用戶查看和使用
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '處理中...' : (isEditing ? '更新' : '建立')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}