import express, { Express, Request, Response } from 'express';
import textRouter from "./api/text/textHandler";


const port = 8000; //process.env.PORT;

const app: Express = express();
app.use("/api/v1", textRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});