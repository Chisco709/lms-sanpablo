import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backgroundsVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-500/20 border border-sky-500/30",
                success: "bg-emerald-500/20 border border-emerald-500/30",
                warning: "bg-yellow-500/20 border border-yellow-500/30",
                info: "bg-blue-500/20 border border-blue-500/30",
            },
            size: {
                default: "p-3",
                sm: "p-2",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
)

const iconVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-400",
                success: "text-emerald-400",
                warning: "text-yellow-400",
                info: "text-blue-400",
            },
            size: {
                default: "h-6 w-6",
                sm: "h-4 w-4",
            }
        },
        defaultVariants: {
            variant: "success",
            size: "default",
        }
    }
)

type BackgroundVariants = VariantProps<typeof backgroundsVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariants, IconVariantsProps {
    icon: LucideIcon;
}

export const IconBadge = ({
    icon: Icon,
    variant,
    size,
}: IconBadgeProps) => {
    return <div className={cn(backgroundsVariants({ variant, size }))}>
        <Icon className={cn(iconVariants({ variant, size }))}/>
    </div>
}