import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { encodeHex } from "jsr:@std/encoding/hex";

export async function signup(req: Request) {
  // check for errors
  if (req.method != "POST") {
    const body = JSON.stringify({ message: "Method Not Allowed" });
    return new Response(body, {
      status: 405
    });
  }

  // get the data
  const data = await req.json();

  // open the db
  const db = new DB("./database.db");

  try {
    // check if user already exists
    const queryResult = [...db.query(`SELECT 1 FROM users WHERE username = ?`, [data.username])];
    if (queryResult.length > 0) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    const hashedPassword = encodeHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data.password)));
    // Step 1: Convert the hashed password string into a Uint8Array
    const hexToUint8Array = (hex: string): Uint8Array =>
      new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const hashedPasswordUint8 = hexToUint8Array(hashedPassword);

    // Import the hashed password as an HMAC key
    const key = await crypto.subtle.importKey(
      "raw", // Specify the format as "raw"
      hashedPasswordUint8, // Use the Uint8Array version of the hashed password
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    // Step 2: Generate the keyed hash for the string
    const encoder = new TextEncoder();
    const textData = encoder.encode(Deno.env.get("VERIFICATION_STRING"));
    const hmacBuffer = await crypto.subtle.sign("HMAC", key, textData);

    // Convert the HMAC result to a hexadecimal string
    const hmacArray = Array.from(new Uint8Array(hmacBuffer));
    const hmacHex = hmacArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const token = crypto.randomUUID();

    // create user
    db.query(`INSERT INTO users (username, verification_hash, token) VALUES (?, ?, ?)`,
      [data.username, hmacHex, token]);

    // return status
    return new Response(JSON.stringify({ message: "User created successfully", token: token }), { status: 201 });
  }
  catch (err) { // something went wrong
    console.error("DB err:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
  finally { // close database connection
    db.close();
  }
}