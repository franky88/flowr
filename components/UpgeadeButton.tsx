"use client"
import { Button } from "@/components/ui/button"
import { usePlanLimit } from "@/context/PlanLimitContext"
import { useSubscription } from "@/hooks/useSubscription"

export function UpgradeButton({ className }: { className?: string }) {
  const { triggerUpgrade } = usePlanLimit()
  const { plan } = useSubscription()

  if (plan !== "free") return null

  return (
    <Button
      className={className}
      onClick={() => triggerUpgrade("Upgrade to Pro to unlock more features.")}
    >
      Upgrade to Pro
    </Button>
  )
}