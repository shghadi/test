import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل 2 کراکتر باشد"),
  phone: z
    .string()
    .min(8, "شماره تلفن کوتاه است")
    .max(15, "شماره تلفن طولانی است"),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
