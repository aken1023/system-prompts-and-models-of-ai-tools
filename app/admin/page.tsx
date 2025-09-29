"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Settings, FileText, Wrench } from 'lucide-react'
import { PromptsManager } from '@/components/admin/prompts-manager'
import { ToolsManager } from '@/components/admin/tools-manager'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('prompts')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">管理後台</h1>
          <p className="text-muted-foreground">管理提示語和 AI 工具</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              提示語管理
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              工具管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts">
            <PromptsManager />
          </TabsContent>

          <TabsContent value="tools">
            <ToolsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}