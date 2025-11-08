PRAGMA FOREIGN_KEYS=ON;

/*
 * Pantry items
 */
CREATE TABLE IF NOT EXISTS pantry (
    rowid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiration DATE NOT NULL,
    bought_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
 * Trash items
 */
CREATE TABLE IF NOT EXISTS trash (
    rowid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    item_id INTEGER NOT NULL REFERENCES pantry(rowid),
    quantity INTEGER NOT NULL,
    trashed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
 * Edges between trash and pantry items
 */
CREATE TABLE IF NOT EXISTS edges (
    trash_id INTEGER NOT NULL REFERENCES trash(rowid),
    item_id INTEGER NOT NULL REFERENCES pantry(rowid),
    probability REAL NOT NULL,
    
    PRIMARY KEY (trash_id, item_id)
);

/*
 * Items considered out of the pantry
 */
CREATE TABLE IF NOT EXISTS used (
    item_id INTEGER NOT NULL REFERENCES pantry(rowid)
);

/*
 * VSS index for connecting trash to pantry entries
 */
CREATE VIRTUAL TABLE IF NOT EXISTS pantry_vec using vec0(
  embedding float[32]
);
