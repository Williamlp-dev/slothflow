import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AddNoteButton() {
  return (
    <Button
      className="rounded-full"
      variant="outline"
      size="icon"
      aria-label="Add new item"
    >
      <PlusIcon size={16} aria-hidden="true" />
    </Button>
  )
}
