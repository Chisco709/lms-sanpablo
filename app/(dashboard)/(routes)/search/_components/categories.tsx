"use client"

import { Category } from "@prisma/client"
import { 
  Music, 
  Camera, 
  Dumbbell, 
  Calculator, 
  Monitor, 
  Video, 
  Wrench, 
  GraduationCap, 
  Globe, 
  BookOpen, 
  Plus,
  Lightbulb 
} from "lucide-react"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<string, any> = {
  "Música": Music,
  "Fotografía": Camera,
  "Fitness": Dumbbell,
  "Contabilidad": Calculator,
  "Informática": Monitor,
  "Filmación": Video,
  "Ingeniería": Wrench,
  "Educación": GraduationCap,
  "Idiomas": Globe,
  "Literatura": BookOpen,
  "Matemáticas": Plus,
  "Ciencias": Lightbulb,
}

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name] || GraduationCap}
          value={item.id}
        />
      ))}
    </div>
  )
} 