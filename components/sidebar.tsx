"use client"

import { useState, useEffect } from "react"
import {
  Inbox,
  Send,
  FileText,
  Trash,
  AlertTriangle,
  Users,
  Briefcase,
  Star,
  Search,
  Menu,
  X,
  AlertCircle,
  Clock,
  Mail,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { EmailFolder, EmailMood } from "@/types/email"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"

interface SidebarProps {
  currentFolder: EmailFolder
  onFolderChange: (folder: EmailFolder) => void
  folderCounts: Record<EmailFolder, number>
  moodCounts: Record<EmailMood, number>
  starredCount: number
  searchQuery: string
  onSearchChange: (query: string) => void
  className?: string
  isLoading?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

export function Sidebar({
  currentFolder,
  onFolderChange,
  folderCounts,
  moodCounts,
  starredCount,
  searchQuery,
  onSearchChange,
  className,
  isLoading = false,
  onCollapseChange,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      const shouldCollapse = window.innerWidth < 768
      setIsCollapsed(shouldCollapse)
      if (onCollapseChange) {
        onCollapseChange(shouldCollapse)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [onCollapseChange])

  const folders = [
    { id: "Inbox" as EmailFolder, icon: Inbox, label: "Inbox" },
    { id: "Sent" as EmailFolder, icon: Send, label: "Sent" },
    { id: "Drafts" as EmailFolder, icon: FileText, label: "Drafts" },
    { id: "Trash" as EmailFolder, icon: Trash, label: "Trash" },
    { id: "Spam" as EmailFolder, icon: AlertTriangle, label: "Spam" },
    { id: "Social" as EmailFolder, icon: Users, label: "Social" },
    { id: "Work" as EmailFolder, icon: Briefcase, label: "Work" },
  ]

  const moods = [
    { id: "Urgent" as EmailMood, icon: AlertCircle, label: "Urgent" },
    { id: "Early" as EmailMood, icon: Clock, label: "Early" },
    { id: "Late" as EmailMood, icon: Mail, label: "Late" },
    { id: "Neutral" as EmailMood, icon: Info, label: "Neutral" },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState)
    }
  }

  const handleFolderChange = (folder: EmailFolder) => {
    onFolderChange(folder)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Collapse toggle button (desktop) */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex fixed bottom-4 left-4 z-50"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        animate={{
          width: isCollapsed ? "64px" : "256px",
        }}
        transition={{ duration: 0.2 }}
      >
        <div className={cn("p-4", isCollapsed ? "hidden" : "block")}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search emails..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)] pb-10">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {!isCollapsed && <h2 className="px-4 text-lg font-semibold tracking-tight">Folders</h2>}
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    currentFolder === folder.id && "bg-gray-100 dark:bg-gray-800",
                    isCollapsed && "px-2 justify-center",
                  )}
                  onClick={() => handleFolderChange(folder.id)}
                >
                  <folder.icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                  {!isCollapsed && <span>{folder.label}</span>}
                  {!isCollapsed && folderCounts[folder.id] > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {folderCounts[folder.id]}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            <div className="space-y-1 mt-6">
              {!isCollapsed && <h2 className="px-4 text-lg font-semibold tracking-tight">Filters</h2>}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  currentFolder === "Starred" && "bg-gray-100 dark:bg-gray-800",
                  isCollapsed && "px-2 justify-center",
                )}
                onClick={() => handleFolderChange("Starred" as EmailFolder)}
              >
                <Star className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                {!isCollapsed && <span>Starred</span>}
                {!isCollapsed && starredCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {starredCount}
                  </Badge>
                )}
              </Button>
            </div>

            {!isCollapsed && (
              <div className="space-y-1 mt-6">
                <h2 className="px-4 text-lg font-semibold tracking-tight">Filters by Mood</h2>
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    className="w-full px-4 py-1 flex items-center justify-between text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => onFolderChange(`Mood:${mood.id}` as EmailFolder)}
                    aria-label={`Filter by ${mood.label} mood`}
                  >
                    <div className="flex items-center">
                      <mood.icon className="mr-2 h-4 w-4" />
                      {mood.label}
                    </div>
                    <Badge variant="outline">{moodCounts[mood.id] || 0}</Badge>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center mt-6">
                <Spinner />
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </>
  )
}
