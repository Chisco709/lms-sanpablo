import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants: {
            variant: {
                warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
                success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    }
)

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string
};

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}

export const Banner = ({
    label,
    variant
}: BannerProps) => {
    
    const Icon = iconMap[variant || "warning"]

    return (
        <div className={cn(bannerVariants({variant}))}>
        <Icon className="h-4 w-4 mr-2"/>
        {label}
        </div>
    )
}