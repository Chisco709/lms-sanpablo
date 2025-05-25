import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CourseProgressProps {
  value: number
  variant?: "default" | "success"
  size?: "default" | "sm"
}

const colorByVariant = {
  default: "text-yellow-400",
  success: "text-green-400",
}

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
}

export const CourseProgress = ({
  value,
  variant,
  size,
}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2 bg-gray-800" value={value} variant={variant} />
      <p
        className={cn(
          "font-medium mt-2",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Completado
      </p>
    </div>
  )
} 