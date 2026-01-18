import express from 'express';
import { submissionRouter } from './routers/submission-router.js';
import { contestRouter } from './routers/contest-router.js';
import { AuthRouter } from './routers/auth-router.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use("/api/submission",submissionRouter);
app.use("/api/contest",contestRouter);
app.use("/api/auth",AuthRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});