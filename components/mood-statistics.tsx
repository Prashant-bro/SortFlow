"use client"

import { AlertTriangle, Clock, Mail, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { EmailMood } from "@/types/email"

interface MoodStatisticsProps {
  moodCounts: Record<EmailMood, number>
  total: number
}

export function MoodStatistics({ moodCounts, total }: MoodStatisticsProps) {
  const moods = [
    { id: "Urgent" as EmailMood, icon: AlertTriangle, label: "Urgent", color: "bg-red-500" },
    { id: "Early" as EmailMood, icon: Clock, label: "Early", color: "bg-green-500" },
    { id: "Late" as EmailMood, icon: Mail, label: "Late", color: "bg-yellow-500" },
    { id: "Neutral" as EmailMood, icon: Info, label: "Neutral", color: "bg-gray-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {moods.map((mood) => {
            const count = moodCounts[mood.id] || 0
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0

            return (
              <div key={mood.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <mood.icon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {count} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className={mood.color} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
