import type { NextApiRequest } from "next"
import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiResponse } from "next"

interface SocketServer extends HTTPServer {
  io?: SocketIOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`)

      // Handle client requests for real-time updates
      socket.on("subscribe-robot-status", (robotId) => {
        console.log(`Client ${socket.id} subscribed to robot status for ${robotId}`)
        socket.join(`robot-status-${robotId}`)
      })

      socket.on("subscribe-tasks", () => {
        console.log(`Client ${socket.id} subscribed to task updates`)
        socket.join("tasks")
      })

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`)
      })
    })
  }
  res.end()
}

export default SocketHandler
