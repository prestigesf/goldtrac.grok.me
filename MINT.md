# Mint

An event becomes a leaf.

## Doors

1. PrestigeMCP — `tools/call` through the proxy. GoldTrac mints after the call. JSON-RPC bytes are not rewritten. Disable with `--no-goldtrac`.
2. CLI — `npx tsx src/goldtrac-cli-mint.ts --app deadlinesf --payload evidence.json`

`seal_goldtrac.py` in DeadlineSF only wraps. It is not a mint until CLI or MCP writes `sig`.

## Order

```
event
  → check kid is live (not on revoke.json)
  → SHA-256 the payload          → payload_hash
  → append into the sparse Merkle tree → smt_root
  → bind to last tip             → chain_root
  → ML-DSA-65 sign the leaf      → sig
  → write one JSONL line
```

`alg` is always `ML-DSA-65`.
`app` is `prestige-mcp` | `deadlinesf` | `billrosetta` | `bopcart`.
`tsa` / `tsa_time` are null unless a TSA is wired.

Signer today: SOFTWARE. Not a FIPS 140-3 module.

Engine: prestigesf/prestige-mcp
