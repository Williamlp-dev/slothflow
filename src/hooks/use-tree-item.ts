import { useMemo } from "react"
import type { Note, Folder } from "@/types"

interface TreeItemData {
  id: string
  name: string
  type: "folder" | "note"
  level: number
  isSelected?: boolean
  isExpanded?: boolean
  data: Note | Folder
}

export function useTreeItem(data: TreeItemData) {
  return useMemo(() => ({
    getId: () => data.id,
    getItemName: () => data.name,
    getItemData: () => data.data,
    isFolder: () => data.type === "folder",
    isExpanded: () => data.isExpanded ?? false,
    isSelected: () => data.isSelected ?? false,
    isFocused: () => false,
    isDragTarget: () => false,
    isMatchingSearch: () => false,
    getItemMeta: () => ({ level: data.level }),
    getProps: () => ({}),
  }), [data])
}