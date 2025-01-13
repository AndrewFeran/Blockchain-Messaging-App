// for now the implementation of this function will only return true or false if the user is found in the database
import { DB } from "https://deno.land/x/sqlite/mod.ts";

export async function newChat(req: Request) {
    // check for errors
    if (req.method != "GET") {
        const body = JSON.stringify({ message: "Method Not Allowed" });
        return new Response(body, {
        status: 405
        });
    }

    // get the data
    const { searchParams: query } = await new URL(req.url);
    const username = await query.get("username");

    // open the db
    const db = new DB("./database.db");

    try {
        // check if user exists
        const queryResult1 = [...db.query(`SELECT 1 FROM users WHERE username = ?`, [username])];
        if (queryResult1.length == 0) {
          return new Response(JSON.stringify({ message: "User not found" }), { status: 409 });
        }

        return new Response(JSON.stringify({ message: "Success"}), { status: 200 });
    }
    catch (err) { // something went wrong
        console.error("DB err:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
    finally { // close database connection
        db.close();
    }
}