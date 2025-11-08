AI model given an itemized list of inputs and outputs and matching them to each other. It needs to keep track of the "pantry" and "trash" items to allow modification, but largely it's handled by the AI

Pantry {
    ...Receipt { ...items }
}
Trash {
    ...Batch { ...items }
}

PantryPennies

1. whole -> whole
2. whole -> partial
3. whole -> dish (transformer description -> ingredient distribution)
  - But this can be decomposed back to the original whole -> partial problem

Invariant: Corresponding pantry item always exists before trash item
- The time of the trash batch is always after the latest pantry item

```sql
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
```



Could do vss, using distance as a metric of probability that they're referring to the same thing. Build a model/estimate over time of how much is spent/wasted

Do we actually need to match outputs to inputs? Ingredient estimation is already extant. Well it determines how much is left
