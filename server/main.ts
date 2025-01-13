
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { signup } from "./routes/signup.ts";
import { login } from "./routes/login.ts";
import { newChat } from "./routes/newChat.ts";

// ensure relevant tables
const db = new DB("database.db");
db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    verification_hash TEXT,
    token TEXT
  )
`);
db.close();

Deno.serve(async (req) => {
  // determine the function call based on the url
  switch (new URL(req.url).pathname) {
    case "/signup":
      return await signup(req);
    case "/login":
      return await login(req);
    case "/newchat":
      return await newChat(req);
  }

  // url doesn't exist
  return new Response(JSON.stringify({ message: "Not Found" }), { status: 404 });
});
