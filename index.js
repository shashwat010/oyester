const connectToMongo=require('./db');
const express = require('express');
const cors = require('cors')

const passport = require('passport');

connectToMongo();

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.use(passport.initialize());

app.use('/auth',require('./routes/authentication'))
app.use('/task',require('./routes/task'))

app.listen(port, () => {
  console.log(`oyester backend listening at http://localhost:${port}`)
})