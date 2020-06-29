const express = require('express')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
  console.log('Request Type:', req.method);
  console.log('Request URL:', req.originalUrl);
  console.log('Request URL:', req.body);
  res.send()
})

app.listen(90, () => {
  console.log('Running at port 90')
})
