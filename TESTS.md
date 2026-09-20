# Tests and breakages called out in this project

## Engine (prestige-mcp)
- mintGoldTracReceipt imported from a file that did not export it. Compile break. Fixed on main ff364ac then 8f7082e.
- CLI on a clean tree fails if the payload file is missing. --demo added so mint runs without a file (8f7082e).
- tools/call mints after the call. JSON-RPC result is not rewritten. --no-goldtrac / PRESTIGE_GOLDTRAC=0 disables.

## Proxy behavior someone listed (not all verified in this chat)
- Upstream returns malformed JSON / gateway 502: log to stderr, do not invent a body.
- prestige_expand_tools with unknown tool name: 404, do not forward.
- Schema cache over 1000 tools: evict LRU.
Those three were a punch list from another model. Treat as tests to write, not as passing CI, until they live in prestige-mcp.

## Receipt shape
- Object must have exactly the nine fields.
- alg must be ML-DSA-65.
- app must be one of the four.
- payload_hash, chain_root, smt_root: 64 lowercase hex, no 0x.
- kid matches published public-key.json and is not on revoke.json.
- PLACEHOLDER_NOT_A_REAL_SIGNATURE is schema-only. Crypto verify is not in the browser yet.

## Deadline
- seal_goldtrac.py wrap ≠ mint.
- Decision API hashed HTML + letter ≠ GoldTrac unless the same kid is on the leaf.
- 0x hashes fail Verify until stripped.

## Site
- Chat preview dropping HTML is not a product test. GitHub files are.
- Hero using the wrong photo fails the slot rule (hero = field.jpg only).
- Three different leaf pictures fail the standard. One hang-leaf at 18px.
