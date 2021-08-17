const express = require('express');
const router = require('./src/routes/index');

const app = express();
var cors = require('cors');
const schedule = require('node-schedule');
const { updatedDateTransactions } = require('./utilsServer/updatedDate');
const { updatedPaymentStatus } = require('./utilsServer/updatePaymentStatus');

const port = process.env.PORT || 5000;

schedule.scheduleJob('0 0 * * *', () => {
   updatedDateTransactions();
   updatedPaymentStatus();
});

app.use(express.json());
app.use(cors());

app.use('/api/v1', router);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
   console.log(`Your server is running on ${port}`);
});
