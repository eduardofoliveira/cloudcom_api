import express from 'express';

import routes from './routes/api';
// import VerifyPublishPipedrive from './service/verifyPublishPipedrive';
// import VerifyRunningCalls from './service/verifyRunningCalls';
// import PipedriveUpload from './service/pipedriveUploadFile';

const app = express();
const port = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.listen(port, async () => {
  process.stdout.write(`Server started on port ${port}\r\n`);
  // const verifyPublishPipedrive = new VerifyPublishPipedrive();
  // const verifyRunningCalls = new VerifyRunningCalls();
  // const pipedriveUpload = new PipedriveUpload();

  // await verifyRunningCalls.execute();
  // await verifyPublishPipedrive.execute();
  // await pipedriveUpload.execute();

  // setInterval(async () => {
  //   await verifyRunningCalls.execute();
  //   await verifyPublishPipedrive.execute();
  //   await pipedriveUpload.execute();
  // }, 60000);
});
