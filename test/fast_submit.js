import fetch from "node-fetch";

const loginURL = "http://localhost:3000/login";

async function simulateFastSubmit() {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(loginURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=usuario@valido.com&password=1234"
    });

    console.log(`Envío ${i + 1}: ${res.status}`);
    const text = await res.text();
    console.log(text.substring(0, 80), "...");
  }
}

simulateFastSubmit();
