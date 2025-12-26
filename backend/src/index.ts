import express from 'express';
import chatRoutes from './routes/chatRoutes'
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Hello world'});
})

app.listen(3000, () => {
    console.log('App is listening at port 3000')
})