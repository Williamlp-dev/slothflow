import { User2, ChevronUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function NavUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <User2 className="mr-2 size-4" />
          Olá, Nome
          <ChevronUp className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Ir para loja</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
