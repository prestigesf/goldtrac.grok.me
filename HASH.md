# Hash glue

GoldTracReceiptV1 payload_hash, chain_root, smt_root are 64 lowercase hex with no 0x prefix.

DeadlineSF historically emitted 0x-prefixed hashes in an UNSIGNED envelope.
If a Deadline line still has 0x, strip it before it is a GoldTrac leaf or Verify fails shape.
