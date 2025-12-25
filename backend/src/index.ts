import express from 'express';
import chatRoutes from './routes/chatRoutes'

const app = express();

app.use(express.json());

app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Hello world'});
})

app.listen(3000, () => {
    console.log('App is listening at port 3000')
})