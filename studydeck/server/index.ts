import express from 'express';
import cors from 'cors';
import subjectsRouter from './routes/subjects';
import classEventsRouter from './routes/classEvents';
import attendanceRouter from './routes/attendance';
import analyticsRouter from './routes/analytics';
import importExportRouter from './routes/importExport';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Routes
app.use('/api/v1/subjects', subjectsRouter);
app.use('/api/v1/class-events', classEventsRouter);
app.use('/api/v1', attendanceRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1', importExportRouter);
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => {
  console.log(`\n  🎓 StudyDeck API running at http://localhost:${PORT}\n`);
});

export default app;
