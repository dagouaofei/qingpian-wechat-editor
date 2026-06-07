import {
  parseHarvestWechatCompatibilityMode,
  type HarvestWechatCompatibilityMode,
} from "@/core/wechat-compatibility/harvest-compat-mode";

function readModeField(value: unknown): HarvestWechatCompatibilityMode | null {
  if (typeof value !== "string") return null;
  return parseHarvestWechatCompatibilityMode(value);
}

export function readHarvestCompatibilityModeFromDefinition(
  definitionJson: unknown,
): HarvestWechatCompatibilityMode | null {
  if (typeof definitionJson !== "object" || definitionJson === null) {
    return null;
  }

  const record = definitionJson as Record<string, unknown>;
  const harvestMeta = record.harvestMeta;
  if (typeof harvestMeta === "object" && harvestMeta !== null) {
    const fromHarvestMeta = readModeField(
      (harvestMeta as Record<string, unknown>).wechatCompatibilityMode,
    );
    if (fromHarvestMeta) return fromHarvestMeta;
  }

  const meta = record.meta;
  if (typeof meta === "object" && meta !== null) {
    const fromMeta = readModeField((meta as Record<string, unknown>).wechatCompatibilityMode);
    if (fromMeta) return fromMeta;
  }

  return null;
}

export function readHarvestCompatibilityModeFromCompatibilityJson(
  compatibilityJson: unknown,
): HarvestWechatCompatibilityMode | null {
  if (typeof compatibilityJson !== "object" || compatibilityJson === null) {
    return null;
  }
  return readModeField((compatibilityJson as Record<string, unknown>).wechatCompatibilityMode);
}
