PRAGMA FOREIGN_KEYS=ON;

CREATE TABLE pantry (
    rowid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiration DATE NOT NULL,
    bought_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trash (
    rowid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    item_id INTEGER NOT NULL FOREIGN KEY REFERENCES pantry(rowid),
    quantity INTEGER NOT NULL,
    trashed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE edges (
    trash_id INTEGER NOT NULL FOREIGN KEY REFERENCES trash(rowid),
    item_id INTEGER NOT NULL FOREIGN KEY REFERENCES pantry(rowid),
    probability REAL NOT NULL,
    
    PRIMARY KEY (trash_id, item_id)
);

CREATE VIRTUAL TABLE pantry_vec using vec0(
  embedding float[32]
);
