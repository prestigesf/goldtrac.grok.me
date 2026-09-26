const LIVE = new Set(["did:goldtrac:demo:abc123"]);
const REVOKED = new Set(["did:goldtrac:demo:revoked"]);
const APPS = new Set(["prestigemcp", "deadlinesf", "billrosetta", "bopcart"]);
const HEX = /^[0-9a-f]{64}$/;
const FIELDS = ["kid", "seq", "ts", "payload_hash", "chain_root", "smt_root", "sig", "tsa", "app"];
const SEED = "goldtrac-demo-stream";

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64(bytes) {
  let s = "";
  bytes.forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s);
}

async function demoChain() {
  const genesis = await sha256Hex(SEED);
  let prev = genesis;
  const lines = [];
  for (let i = 0; i < 2; i++) {
    const payload = await sha256Hex(`demo-payload-${i}`);
    const chain = await sha256Hex(`${prev}:${payload}`);
    const smt = await sha256Hex(`smt:${chain}`);
    const sig = b64(new Uint8Array(3309).fill(i + 7));
    lines.push(JSON.stringify({
      kid: "did:goldtrac:demo:abc123",
      seq: i + 1,
      ts: "2026-09-26T00:23:03Z",
      payload_hash: payload,
      chain_root: chain,
      smt_root: smt,
      sig,
      tsa: { issuer: "goldtrac-tsa-1", serial: "0x4f2a" },
      app: "prestigemcp",
    }));
    prev = chain;
  }
  document.querySelector("#receipts").value = lines.join("\n");
}

function check(list, name, ok, detail) {
  const li = document.createElement("article");
  li.className = `check ${ok ? "ok" : "bad"}`;
  li.innerHTML = `<strong>${ok ? "VALID" : "TAMPERED"} · ${name}</strong><p>${detail}</p>`;
  list.appendChild(li);
  return ok;
}

async function run() {
  const list = document.querySelector("#checks");
  list.innerHTML = "";
  const raw = document.querySelector("#receipts").value.trim();
  const lines = raw ? raw.split(/\n+/).filter(Boolean) : [];
  let ok = true;
  let rows = [];
  try {
    rows = lines.map((line) => JSON.parse(line));
    ok = check(list, "Parses as JSONL", true, "Each line is a well-formed JSON receipt.") && ok;
  } catch {
    check(list, "Parses as JSONL", false, "A line is not JSON.");
    return;
  }
  if (!rows.length) {
    check(list, "Parses as JSONL", false, "Paste at least one receipt.");
    return;
  }
  const shaped = rows.every((r) => FIELDS.every((f) => f in r) && HEX.test(r.payload_hash) && HEX.test(r.chain_root) && HEX.test(r.smt_root) && Number.isInteger(r.seq) && APPS.has(r.app) && r.tsa && r.tsa.issuer && r.tsa.serial);
  ok = check(list, "Nine-field schema", shaped, "kid · seq · ts · payload_hash · chain_root · smt_root · sig · tsa · app") && ok;
  const live = rows.every((r) => LIVE.has(r.kid) && !REVOKED.has(r.kid));
  ok = check(list, "kid liveness", live, "Key ID resolves against the demo key directory; revoked keys are rejected.") && ok;
  const hashes = rows.every((r) => HEX.test(r.payload_hash) && HEX.test(r.chain_root) && HEX.test(r.smt_root));
  ok = check(list, "Hash formats", hashes, "payload_hash, chain_root, and smt_root are 64-char lowercase SHA-256 hex.") && ok;
  let bound = true;
  let prev = await sha256Hex(SEED);
  const ordered = [...rows].sort((a, b) => a.seq - b.seq);
  for (let i = 0; i < ordered.length; i++) {
    const expect = await sha256Hex(`${prev}:${ordered[i].payload_hash}`);
    if (ordered[i].chain_root !== expect || (i && ordered[i].seq !== ordered[i - 1].seq + 1)) bound = false;
    prev = ordered[i].chain_root;
  }
  ok = check(list, "Chain binding", bound, "chain_rootₙ = SHA-256(chain_rootₙ₋₁ : payload_hashₙ), back to the demo genesis, with monotonic seq.") && ok;
  const sigOk = rows.every((r) => {
    try { return atob(r.sig).length === 3309; } catch { return false; }
  });
  ok = check(list, "Signature structure", sigOk, "sig decodes as base64 with the ML-DSA-65 length (3309 bytes). The signature itself is not checked here.") && ok;
  const tsOk = rows.every((r) => !Number.isNaN(Date.parse(r.ts)) && r.tsa.issuer && r.tsa.serial);
  ok = check(list, "Timestamp authority", tsOk, "ts parses as RFC 3339 and tsa carries an issuer and serial.") && ok;
  const banner = document.querySelector("#verdict");
  banner.textContent = ok ? "VALID" : "TAMPERED";
}

document.querySelector("#demo").addEventListener("click", demoChain);
document.querySelector("#run").addEventListener("click", run);
document.querySelector("#clear").addEventListener("click", () => {
  document.querySelector("#receipts").value = "";
  document.querySelector("#checks").innerHTML = "";
  document.querySelector("#verdict").textContent = "";
});
