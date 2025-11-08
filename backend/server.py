import sqlite3
from typing import Annotated
from fastapi.params import Depends
from pydantic import BaseModel
import sqlite_vec
import fastembed
import fastapi

sqlite_schema = "schema.sql"
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

class Pantry(BaseModel):
    rowid: int
    name: str
    quantity: int
    expire_at: str
    bought_at: str

class Trash(BaseModel):
    rowid: int
    name: str
    quantity: int
    trashed_at: str

class Edge(BaseModel):
    trash_id: int
    item_id: int
    probability: float

class Used(BaseModel):
    item_id: int

with open(sqlite_schema, "r") as f:
    SCHEMA = f.read()

def get_session():
    conn = sqlite3.connect(sqlite_file_name)
    cur = conn.cursor()
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)
    _ = cur.executescript(SCHEMA)
    return conn

app = fastapi.FastAPI()

@app.get("/pantry")
async def pantry():
    conn = get_session()
    cur = conn.cursor()
    cur.row_factory = lambda cur, row: row
    _ = cur.execute("""
        SELECT * FROM pantry
        LEFT JOIN used ON pantry.rowid = used.item_id
        WHERE used.item_id IS NULL
    """)
    pantry = list[Pantry]()
    for row in cur:
        pantry.append(Pantry(**row))
    return pantry

@app.post("/pantry")
async def add_pantry(item: Pantry):
    conn = get_session()
    cur = conn.cursor()
    _ = cur.execute("""
        INSERT INTO pantry (name, quantity, expire_at, bought_at)
        VALUES (?, ?, ?, ?)
    """, (item.name, item.quantity, item.expire_at, item.bought_at))
    conn.commit()
