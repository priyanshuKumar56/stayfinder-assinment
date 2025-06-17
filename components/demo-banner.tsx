import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DemoBanner() {
  const hasRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (hasRealSupabase) return null

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> This is running with mock data. To use real data, configure your Supabase
        environment variables.
        <br />
        <strong>Demo Login:</strong> sarah.chen@email.com / password123 (Host) | mike.johnson@email.com / password123
        (Guest)
      </AlertDescription>
    </Alert>
  )
}
