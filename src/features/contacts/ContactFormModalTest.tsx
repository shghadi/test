"use client";

import { Form, Input, Modal } from "antd";
import { ContactFormValues, contactSchema } from "./schema";
import { Contact } from "@/services/contactsApi";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export default function ContactFormModaltest({
  open,
  onClose,
  onSubmit,
  initial,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ContactFormValues) => void;
  initial?: Contact | null;
  loading?: boolean;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        phone: initial?.phone ?? "",
        email: initial?.email ?? "",
      });
    }
  }, [open, initial, reset]);

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        okText=""
        cancelText=""
        confirmLoading={loading}
        title={initial ? "ویرایش" : "افزودن"}
        okButtonProps={{ htmlType: "submit", form: "contact-form" }}
      >
        <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
          <Form layout="vertical">
            <Form.Item
              label="نام"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="تلفن"
              validateStatus={errors.phone ? "error" : ""}
              help={errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                render={(field) => <Input {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="ایمیل"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={(field) => <Input {...field} />}
              />
            </Form.Item>
          </Form>
        </form>
      </Modal>
    </>
  );
}
