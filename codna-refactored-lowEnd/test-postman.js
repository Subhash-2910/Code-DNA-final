const code = `
function calculate(a, b) {
  return a + b;
}
`;
fetch("https://co-dna-fullproject.onrender.com/analyze-debt", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "*/*",
    "User-Agent": "PostmanRuntime/7.39.0"
  },
  body: JSON.stringify({ code })
}).then(async res => {
  console.log("Status:", res.status);
  console.log(await res.text());
}).catch(console.error);
