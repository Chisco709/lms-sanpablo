"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Course } from "@prisma/client"
import { ArrowUpDown, Badge, Link, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return (
        <div className="font-medium text-white max-w-[200px] truncate">
          {title}
        </div>
      )
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const price = parseFloat(row.getValue("price") || "0")
        const formatted = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
        return <div className="font-medium text-green-400">{formatted}</div>
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        const isPublished = row.getValue("isPublished") === true;
        return (
            <Badge className={cn(
                "bg-slate-600 text-slate-200 border-slate-500",
                isPublished && "bg-green-600 text-white border-green-500"
            )}>
                {isPublished ? "Publicado" : "Borrador"}
            </Badge>
        );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
        const { id } = row.original;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-slate-800 border-slate-700"
                >
                    <DropdownMenuLabel className="text-slate-300">
                      Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                        className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                        onClick={() => {
                            window.location.href = `/teacher/courses/${id}`;
                        }}
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        <span>Editar curso</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
  }
]
