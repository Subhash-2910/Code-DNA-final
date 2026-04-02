const fs = require('fs');
const content = fs.readFileSync('src/api.ts', 'utf8');

fetch("https://co-dna-fullproject.onrender.com/analyze-debt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: content })
}).then(async res => {
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response length:", text.length);
  if (text.includes('"AI unavailable"')) {
    console.log("Got AI unavailable fallback!");
  } else {
    console.log("Success! Full output:", text.substring(0, 500) + "...");
  }
}).catch(console.error);
