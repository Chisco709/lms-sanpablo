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
        >
          Titulo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
        return <div>{formatted}</div>
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Publicado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        // Basado en chapters-list: compara estrictamente con true
        const isPublished = row.getValue("isPublished") === true;
        return (
            <Badge className={cn(
                "bg-slate-500 text-white",
                isPublished && "bg-sky-700"
            )}>
                {isPublished ? "Publicado" : "Borrador"}
            </Badge>
        );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
        const { id } = row.original;
        // El DropdownMenu solo se usa en client, así que useRouter está disponible
        const router = require("next/navigation").useRouter?.() || null;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onSelect={() => {
                            if (router) router.push(`/teacher/courses/${id}`);
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
