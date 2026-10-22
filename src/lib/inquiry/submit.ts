import { createServerFn } from "@tanstack/react-start";
import {
  INQUIRY_FIELD_ERROR,
  INQUIRY_SAVE_ERROR,
  fieldErrorsFromZod,
  inquirySchema,
  type InquiryFieldErrors,
  type InquiryInput,
  type NotifyStatus,
} from "./schema.ts";

export type InquirySubmitResult =
  | { ok: true; id: number; notify: NotifyStatus }
  | { ok: false; message: string; fieldErrors?: InquiryFieldErrors };

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input: InquiryInput) => input)
  .handler(async ({ data }): Promise<InquirySubmitResult> => {
    const parsed = inquirySchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        message: INQUIRY_FIELD_ERROR,
        fieldErrors: fieldErrorsFromZod(parsed.error),
      };
    }

    try {
      const { saveInquiry } = await import("./persist.server.ts");
      const saved = await saveInquiry(parsed.data);
      return { ok: true, id: saved.id, notify: saved.notify };
    } catch (err) {
      console.error(
        "[inquiry] failed to store submission",
        err instanceof Error ? err.message : "unknown error",
      );
      return { ok: false, message: INQUIRY_SAVE_ERROR };
    }
  });
