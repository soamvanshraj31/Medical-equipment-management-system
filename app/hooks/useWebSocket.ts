import { useState, useEffect, useRef } from 'react'

export function useWebSocket(url: string) {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting')
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        setConnectionStatus('Open')
        console.log('WebSocket connected')
      }

      ws.current.onmessage = (event) => {
        setLastMessage(event)
      }

      ws.current.onclose = () => {
        setConnectionStatus('Closed')
        console.log('WebSocket disconnected')
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000)
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('Error')
      }
    }

    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return {
    lastMessage,
    connectionStatus,
    sendMessage
  }
} 