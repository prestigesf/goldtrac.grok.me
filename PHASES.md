# Phases

## Phase 0 — claim
GoldTrac is the spine. Four apps sit on one receipt. Not a pile of scripts.

## Phase 1 — lattice only (11 Sep 2026)
prestige-mcp: mintGoldTracReceipt export fixed (ff364ac, 8f7082e).
CLI: npx tsx src/goldtrac-cli-mint.ts --demo
goldtrac.3: public key publication, chain-tip witness, lattice-only homepage, verify page.
alg = ML-DSA-65. No ECDSA on the live mint path.

## Phase 2 — witness
witness/public-key.json, tip.json, revoke.json.
sign_backend: SOFTWARE. fips_140_module: false.
Revoke list starts empty on purpose.

## Phase 3 — one schema
GoldTracReceiptV1 nine fields for prestige-mcp, deadlinesf, billrosetta, bopcart.
Deadline UNSIGNED envelope is not a leaf until sig exists.
0x prefix on Deadline hashes is glue, not schema.

## Phase 4 — public face (19 Sep 2026)
Field landing. Outlined GoldTrac. Ivory type. Hover fill.
Leaf mark 18px = receipt, not decoration.
Verify / Spec / Leaf / Schema pages.
Foil motion: Stokes drag, snap to word, no bounce.
Design tokens, components, slots, gold-lock filter.

## Phase 5 — operator surface
PrestigeMCP page: run snippet, paste jsonl, check shape.
Proxy is still a process. App does not start it.

## Phase 6 — public repo split (19 Sep 2026)
goldtrac.grok.me public. goldtrac.3 private deposit. prestige-mcp private engine.
quantumrain.grok.me is Control Plane. GoldTrac leaf replay there is DEMO FIXTURE.

## Not a phase yet
HSM / enclave. FIPS 140-3 module. TSA live. Browser ML-DSA verify. BillRosetta or BopCart mint in production.
