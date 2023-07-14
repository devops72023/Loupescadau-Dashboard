import express from 'express';
import Cors from 'cors';
import mongoose from 'mongoose'; 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware'
config();

const app = express();

// DB connection
try{
  const db = await mongoose.connect(
    process.env.MONGO_DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  console.log("db connected")
}catch(err) {
    console.log(process.env.MONGO_DB_URI);
    console.log(`Error connecting to the database:\n ${err}`);
  };

const server = http.createServer(app);
const io = new Server(
  server, 
  {
    cors: {
        origin : '*'
    }
  }
);
  
io.on("connection", socket => {
  
  console.log('User Connected :' + socket.id);
  socket.emit('connection-success', {
    status: "connection-success",
    socketId: socket.id
  })

  socket.on('sdp' , sdp => {
      // console.log(sdp)
      socket.broadcast.emit('sdp' , sdp);
  });

  socket.on('candidate', candidate => {
      console.log(" outside candidate", candidate);
      socket.broadcast.emit('candidate',candidate);
  })

  socket.on('join-room', data => {
      socket.join(data);
      console.log('User with ID : ', socket.id ,' joined room: ',data );
  });

  socket.on('send-message', data => {
      socket.to(data.room).emit('recieved-message', data);
  })

  socket.on("disconnect", () => {
      console.log(" disconnected socket " + socket.id);
  });

});

// Import different routes
import AuthRouter from './Routes/Auth.js';
import userRoute from './Routes/Users.js';
import productsRouter from './Routes/Products.js';
import categoryRouter from './Routes/Category.js';
import settingRouter from './Routes/Setting.js';
import couponRouter from './Routes/Coupon.js';
import ordersRoute from './Routes/Orders.js';
import adminRouter from './Routes/Admin.js';

// The cors middleware configuration.
const corsOptions = {
    origin: '*', // Allow requests from a specific origin
    methods: '*', // Allow only specified HTTP methods
    allowedHeaders: '*', // Allow only specified headers
  };

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(Cors(corsOptions));
app.use(express.static(path.join(__dirname, 'Assets')))
app.use('/assets', express.static(path.join(__dirname, '/dist/assets')))


app.use('/api/auth', AuthRouter);
app.use('/api/users', userRoute);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/settings', settingRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/orders', ordersRoute)
app.use('/api/admin', adminRouter)

// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname+'/dist/index.html'));
// });

app.use(
  '*', // Specify the endpoint in your Express server to proxy requests
  createProxyMiddleware({
    target: 'http://localhost:5173', // Specify the address of your Vite server
    changeOrigin: true,
    secure: false,
  })
);

server.listen(8080, () => console.log('Server listening on port 3000'));