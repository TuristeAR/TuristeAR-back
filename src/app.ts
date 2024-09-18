import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

app.get('/', (_req, res) => {
  res.status(200).send('TuristeAR API');
});

export default app;
