'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜尋 AI 提示詞、工具、技巧..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20 h-12 text-base"
        />
        <div className="absolute right-2 flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button type="submit" size="sm">
            搜尋
          </Button>
        </div>
      </div>
      
      {/* Quick suggestions */}
      <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg p-4 hidden group-focus-within:block">
        <div className="text-sm text-muted-foreground mb-2">熱門搜尋：</div>
        <div className="flex flex-wrap gap-2">
          {['Claude', 'Cursor', '系統提示詞', '程式碼生成', '規劃'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}