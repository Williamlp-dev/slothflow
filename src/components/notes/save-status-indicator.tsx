import React from 'react'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface SaveStatusIndicatorProps {
  status: SaveStatus
}

const statusConfig = {
  saving: { text: 'Salvando...', color: 'blue', animate: true },
  saved: { text: 'Salvo', color: 'green', animate: false },
  error: { text: 'Erro ao salvar', color: 'red', animate: false },
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  if (status === 'idle') return null

  const config = statusConfig[status]

  return (
    <div className={`fixed top-4 right-4 flex items-center gap-2 text-sm text-${config.color}-400 bg-gray-800/80 px-3 py-1.5 rounded-lg backdrop-blur-sm`}>
      <div className={`w-2 h-2 bg-${config.color}-400 rounded-full ${config.animate ? 'animate-pulse' : ''}`}></div>
      {config.text}
    </div>
  )
}