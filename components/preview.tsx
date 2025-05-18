"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import "react-quill/dist/quill.bubble.css"  // <-- Usar CSS para modo preview

interface PreviewProps {
    value: string
}

export const Preview = ({ value }: PreviewProps) => {
    const ReactQuill = useMemo(() => dynamic(
        () => import("react-quill").then(mod => mod.default),
        { 
            ssr: false,
            loading: () => <div className="h-[200px] bg-gray-100 animate-pulse" />
        }
    ), [])

    return (
        <ReactQuill 
            theme="bubble"  // <-- Usar theme "bubble" para preview
            value={value}
            readOnly
        />
    )
}