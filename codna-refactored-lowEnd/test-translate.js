const code = "console.log('hello');";
fetch("https://co-dna-fullproject.onrender.com/translate-code", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: code, target_language: "Python" })
}).then(async res => {
  console.log(res.status, res.statusText);
  try {
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(await res.text());
  }
}).catch(console.error);
