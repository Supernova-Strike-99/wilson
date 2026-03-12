-- StudyDeck — SQLite Schema
-- Run: sqlite3 studydeck.db < schema.sql

CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE,
    password_hash TEXT,
    settings    TEXT DEFAULT '{}',  -- JSON blob
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subjects (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    title       TEXT NOT NULL,
    code        TEXT DEFAULT '',
    color       TEXT DEFAULT 'indigo',
    emoji       TEXT DEFAULT '📚',
    teacher     TEXT DEFAULT '',
    credits     INTEGER DEFAULT 3,
    semester    TEXT DEFAULT '',
    pinned      INTEGER DEFAULT 0,
    archived    INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_subjects_user ON subjects(user_id);

CREATE TABLE IF NOT EXISTS class_events (
    id              TEXT PRIMARY KEY,
    subject_id      TEXT NOT NULL,
    title           TEXT NOT NULL,
    weekdays        TEXT DEFAULT '[]',  -- JSON array of ints
    start_time      TEXT NOT NULL,
    end_time        TEXT NOT NULL,
    location        TEXT DEFAULT '',
    is_online       INTEGER DEFAULT 0,
    start_week      INTEGER DEFAULT 1,
    end_week        INTEGER DEFAULT 16,
    recurrence_rule TEXT DEFAULT 'WEEKLY',
    exceptions      TEXT DEFAULT '[]',  -- JSON array of date strings
    created_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
CREATE INDEX idx_events_subject ON class_events(subject_id);

CREATE TABLE IF NOT EXISTS occurrences (
    id              TEXT PRIMARY KEY,
    class_event_id  TEXT NOT NULL,
    date            TEXT NOT NULL,
    start_datetime  TEXT NOT NULL,
    end_datetime    TEXT NOT NULL,
    status          TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled','cancelled')),
    is_adhoc        INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (class_event_id) REFERENCES class_events(id)
);
CREATE INDEX idx_occ_date ON occurrences(date);
CREATE INDEX idx_occ_event ON occurrences(class_event_id);

CREATE TABLE IF NOT EXISTS attendance (
    id              TEXT PRIMARY KEY,
    occurrence_id   TEXT NOT NULL,
    user_id         TEXT NOT NULL,
    status          TEXT NOT NULL CHECK(status IN ('present','absent','late','excused')),
    marked_at       TEXT DEFAULT (datetime('now')),
    note            TEXT DEFAULT '',
    FOREIGN KEY (occurrence_id) REFERENCES occurrences(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_att_occ ON attendance(occurrence_id);
CREATE INDEX idx_att_user ON attendance(user_id);

CREATE TABLE IF NOT EXISTS notes (
    id              TEXT PRIMARY KEY,
    subject_id      TEXT,
    occurrence_id   TEXT,
    user_id         TEXT NOT NULL,
    title           TEXT DEFAULT '',
    content_blocks  TEXT DEFAULT '[]',  -- JSON
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_notes_subject ON notes(subject_id);

CREATE TABLE IF NOT EXISTS tasks (
    id              TEXT PRIMARY KEY,
    subject_id      TEXT NOT NULL,
    user_id         TEXT NOT NULL,
    title           TEXT NOT NULL,
    due_date        TEXT DEFAULT '',
    priority        TEXT DEFAULT 'p2' CHECK(priority IN ('p1','p2','p3')),
    status          TEXT DEFAULT 'todo' CHECK(status IN ('todo','done')),
    created_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_tasks_subject ON tasks(subject_id);

CREATE TABLE IF NOT EXISTS sync_log (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       TEXT NOT NULL,
    action          TEXT NOT NULL CHECK(action IN ('create','update','delete')),
    payload         TEXT DEFAULT '{}',
    synced_at       TEXT DEFAULT (datetime('now')),
    conflict        TEXT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
