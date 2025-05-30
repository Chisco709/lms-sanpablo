"use client"

import { Category } from "@prisma/client"
import { IconType } from "react-icons"
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
  FcElectronics,
  FcAutomotive,
  FcBusiness
} from "react-icons/fc"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
  // Categorías técnicas en español
  "Técnico en Computación": FcMultipleDevices,
  "Técnico en Electrónica": FcElectronics,
  "Técnico en Mecánica": FcEngineering,
  "Técnico en Electricidad": FcEngineering,
  "Técnico en Soldadura": FcEngineering,
  "Técnico en Refrigeración": FcEngineering,
  "Técnico en Automotriz": FcAutomotive,
  "Técnico en Construcción": FcBusiness,
  // Categorías antiguas por compatibilidad
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Filming": FcFilmReel,
  "Engineering": FcEngineering,
}

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
} 