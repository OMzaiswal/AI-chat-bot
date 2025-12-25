import express from 'express';

const app = express();


app.get('/', (req, res) => {
    res.json({message: 'Hello world'});
})

app.listen(3000, () => {
    console.log('App is listening at port 3000')
})