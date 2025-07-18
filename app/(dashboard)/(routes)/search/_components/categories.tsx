"use client";

import {
  FcGlobe,
  FcSupport,
  FcSportsMode,
  FcManager,
  FcMultipleDevices,
  FcMindMap,
  FcMusic,
  FcBusinessContact,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<string, IconType> = {
  "Primera Infancia": FcSupport,
  "Inglés": FcGlobe,
  "Pedagogía": FcManager,
  "Educación": FcBusinessContact,
  "Desarrollo Infantil": FcSportsMode,
  "Psicología Infantil": FcMindMap,
  "Metodologías de Enseñanza": FcMultipleDevices,
  "Estimulación Temprana": FcMusic,
  "Cuidado Infantil": FcSupport,
  "Desarrollo Cognitivo": FcMindMap,
};

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
  );
}; 