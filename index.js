const express = require('express')
const http = require('http')
const cors = require('cors')
const { ExpressPeerServer } = require('peer')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

io.listen(4000)
const uuid = require('uuid')

app.use(express.json())

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    // credentials: true
  })
)

io.on('connection', (socket) => {
  // console.log(socket.id)
  const roomId = uuid.v4()
  socket.emit('connection', roomId)

  socket.on('join-room', (data) => {
    const { room, userId } = data
    socket.join(roomId)
    socket.to(userId).emit('user-connected', userId)
    console.log(room, userId)
  })
})
const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use('/peerjs', peerServer)

peerServer.on('connection', (client) => {
  console.log(client.id, 'client connected')
})
peerServer.on('disconnect', (client) => {
  console.log(client.id, 'client disconnected')
})

app.get('/', (req, res, next) =>
  res.send('Express Server is not runnning  fine')
)

app.get('/:room', (req, res) => {
  // const id = uuidv4()
  const { room } = req.params
  res.send(room)
})

const PORT = 8000
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
