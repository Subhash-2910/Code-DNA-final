const code = "console.log('hello');";
fetch("https://co-dna-fullproject.onrender.com/analyze-debt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code })
}).then(async res => {
  console.log(res.status, res.statusText);
  try {
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(await res.text());
  }
}).catch(console.error);
