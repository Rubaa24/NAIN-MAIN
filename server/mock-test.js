import express from "express";
import Database from "better-sqlite3";

const app = express();
app.use(express.json());

const db = new Database("nain.db");

db.exec("CREATE TABLE IF NOT EXISTS conversations ( id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, profile TEXT, created_at TEXT NOT NULL, conversation_json TEXT NOT NULL )");

app.post("/api/mock-test", (req, res) => {
const { name = "Test Candidate", role = "Software Engineer", answer = "I know Python basics." } = req.body;

const id = "mock-" + Date.now();
const createdAt = new Date().toISOString();

const conversation = {
id,
name,
role,
turns: [
{
question: "What programming languages do you know?",
answer
}
]
};

db.prepare("INSERT INTO conversations (id, name, role, profile, created_at, conversation_json) VALUES (?, ?, ?, ?, ?, ?)").run(
id,
name,
role,
"Mock test profile",
createdAt,
JSON.stringify(conversation)
);

res.json({ ok: true, message: "Mock interview saved!", id });
});

app.get("/api/mock-test/:id", (req, res) => {
const row = db.prepare(
"SELECT * FROM conversations WHERE id = ?"
).get(req.params.id);

if (!row) return res.status(404).json({ error: "Not found" });

res.json({
...row,
conversation: JSON.parse(row.conversation_json)
});
});

app.listen(8788, () => {
console.log("Mock test server running at http://localhost:8788");
});