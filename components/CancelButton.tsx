"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CancelButton() {
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    setLoading(true)
    await fetch("/api/subscription/cancel/", { method: "POST" })
    setLoading(false)
    router.refresh()
  }

  if (!confirmed) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-muted-foreground hover:text-destructive text-xs"
        onClick={() => setConfirmed(true)}
      >
        Cancel subscription
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Are you sure?</span>
      <Button
        size="sm"
        variant="destructive"
        disabled={loading}
        onClick={handleCancel}
      >
        {loading ? "Cancelling..." : "Yes, cancel"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setConfirmed(false)}
      >
        Never mind
      </Button>
    </div>
  )
}