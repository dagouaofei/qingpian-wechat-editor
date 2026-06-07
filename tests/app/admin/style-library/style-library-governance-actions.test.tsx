import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  hideFromUserPoolAction,
  restoreToUserSelectableAction,
  markDeprecatedAction,
  restoreFromDeprecatedAction,
  rollbackLastDistributionAction,
} = vi.hoisted(() => ({
  hideFromUserPoolAction: vi.fn(),
  restoreToUserSelectableAction: vi.fn(),
  markDeprecatedAction: vi.fn(),
  restoreFromDeprecatedAction: vi.fn(),
  rollbackLastDistributionAction: vi.fn(),
}));

vi.mock("@/app/admin/style-library/actions", () => ({
  hideFromUserPoolAction,
  restoreToUserSelectableAction,
  markDeprecatedAction,
  restoreFromDeprecatedAction,
  rollbackLastDistributionAction,
}));

import {
  StyleLibraryGovernanceActions,
  submitGovernanceForm,
} from "@/app/admin/style-library/style-library-governance-actions";

function createFormWithReason(reason: string): HTMLFormElement {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.name = "reason";
  input.value = reason;
  form.appendChild(input);
  document.body.appendChild(form);
  return form;
}

const SUCCESS_DISTRIBUTION = {
  userSelectable: false,
  defaultEligible: false,
  release1Required: false,
  hidden: true,
  deprecated: false,
  cacheVersion: 2,
};

describe("submitGovernanceForm", () => {
  it("resets the saved form reference after a successful action", async () => {
    const form = createFormWithReason("manual local test hide");
    const run = vi.fn().mockResolvedValue({
      ok: true,
      action: "hide_from_user_pool",
      distribution: SUCCESS_DISTRIBUTION,
    });

    const result = await submitGovernanceForm({
      form,
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      run,
    });

    expect(result.ok).toBe(true);
    expect(run).toHaveBeenCalledWith(
      "heading_teal_section_label_html_paste_candidate",
      "manual local test hide",
    );
    expect((form.querySelector('input[name="reason"]') as HTMLInputElement).value).toBe("");
  });

  it("does not reset the form when the action fails", async () => {
    const form = createFormWithReason("should fail");
    const run = vi.fn().mockResolvedValue({
      ok: false,
      code: "restore_blocked_by_quality",
      message: "Restore blocked",
    });

    const result = await submitGovernanceForm({
      form,
      runtimeVariantId: "heading_magazine_left_bar",
      run,
    });

    expect(result.ok).toBe(false);
    expect((form.querySelector('input[name="reason"]') as HTMLInputElement).value).toBe(
      "should fail",
    );
  });

  it.each([
    ["hide-from-pool", hideFromUserPoolAction],
    ["restore-user-selectable", restoreToUserSelectableAction],
    ["mark-deprecated", markDeprecatedAction],
    ["restore-from-deprecated", restoreFromDeprecatedAction],
    ["rollback-distribution", rollbackLastDistributionAction],
  ] as const)(
    "resets without crashing for governance operation %s",
    async (_operationId, actionMock) => {
      const form = createFormWithReason("manual local test");
      actionMock.mockResolvedValueOnce({
        ok: true,
        action: _operationId,
        distribution: SUCCESS_DISTRIBUTION,
      });

      await expect(
        submitGovernanceForm({
          form,
          runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
          run: actionMock,
        }),
      ).resolves.toMatchObject({ ok: true });

      expect((form.querySelector('input[name="reason"]') as HTMLInputElement).value).toBe("");
    },
  );
});

describe("StyleLibraryGovernanceActions", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    hideFromUserPoolAction.mockResolvedValue({
      ok: true,
      action: "hide_from_user_pool",
      distribution: SUCCESS_DISTRIBUTION,
    });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.body.querySelectorAll("form").forEach((form) => form.remove());
  });

  it("clears the reason field after a successful hide submit without throwing", async () => {
    await act(async () => {
      root.render(
        <StyleLibraryGovernanceActions
          runtimeVariantId="heading_teal_section_label_html_paste_candidate"
          writeEnabled
          writeProtectionMessage="Write actions are temporarily protected until S10-STORY-008 admin login."
        />,
      );
    });

    const form = container.querySelector(
      '[data-testid="admin-governance-form-hide-from-pool"]',
    ) as HTMLFormElement;
    const input = form.querySelector('input[name="reason"]') as HTMLInputElement;
    input.value = "manual local test hide";

    await act(async () => {
      form.requestSubmit();
      await Promise.resolve();
    });

    expect(hideFromUserPoolAction).toHaveBeenCalledWith(
      "heading_teal_section_label_html_paste_candidate",
      "manual local test hide",
    );
    expect(input.value).toBe("");
    expect(
      container.querySelector('[data-testid="admin-governance-feedback-success"]'),
    ).not.toBeNull();
  });
});
