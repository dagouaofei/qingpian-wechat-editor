import { describe, expect, it } from "vitest";

import { stableJsonChecksum } from "@/server/style-admin/import/checksum";

describe("stableJsonChecksum", () => {
  it("is stable regardless of key order", () => {
    const a = stableJsonChecksum({ b: 1, a: { z: 2, y: 3 } });
    const b = stableJsonChecksum({ a: { y: 3, z: 2 }, b: 1 });
    expect(a).toBe(b);
  });
});
