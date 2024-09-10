const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const app = express()
const db = require('./db');

dotenv.config();
app.use(cors())
app.use(bodyParser.json())
db();

const mainRouter = require('./routes/index');
const PORT = process.env.PORT || 3000;

app.use('/api/v1', mainRouter);

app.listen(PORT, ()=>{
  console.log(`backend is running on port ${PORT}`);
})
