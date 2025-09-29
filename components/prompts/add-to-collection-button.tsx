"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BookmarkPlus, Plus } from 'lucide-react'
import { CollectionDialog } from '@/components/collections/collection-dialog'

interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  _count: {
    items: number
  }
}

interface AddToCollectionButtonProps {
  promptId: string
  userId?: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function AddToCollectionButton({ 
  promptId, 
  userId = 'user_demo_id', // 模擬用戶 ID，實際應用中應從認證狀態獲取
  className,
  size = 'default'
}: AddToCollectionButtonProps) {
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false)

  const fetchCollections = async () => {
    try {
      const response = await fetch(`/api/collections?userId=${userId}&limit=50`)
      const data = await response.json()
      if (data.success) {
        setCollections(data.data)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  useEffect(() => {
    if (open) {
      fetchCollections()
    }
  }, [open])

  const handleAddToCollection = async () => {
    if (!selectedCollection) {
      alert('請選擇一個收藏集')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/collections/${selectedCollection}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          promptId,
          note: note.trim() || undefined
        })
      })

      const data = await response.json()
      if (data.success) {
        setOpen(false)
        setSelectedCollection('')
        setNote('')
        alert('已成功添加到收藏集')
      } else {
        alert(data.error || '添加失敗')
      }
    } catch (error) {
      console.error('Error adding to collection:', error)
      alert('添加失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleNewCollectionClose = () => {
    setShowNewCollectionDialog(false)
    fetchCollections() // 重新載入收藏集列表
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={className}
          >
            <BookmarkPlus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
            {size !== 'sm' && <span className="ml-2">加入收藏集</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加到收藏集</DialogTitle>
            <DialogDescription>
              選擇一個收藏集來保存這個提示語
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="collection">選擇收藏集</Label>
              <div className="flex gap-2">
                <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="選擇收藏集" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{collection.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({collection._count.items})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCollectionDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="note">個人筆記（可選）</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="為這個提示語添加一些個人筆記..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddToCollection} disabled={loading}>
                {loading ? '添加中...' : '添加'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CollectionDialog
        open={showNewCollectionDialog}
        onClose={handleNewCollectionClose}
      />
    </>
  )
}