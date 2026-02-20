"use client";

import { Form, Input, Modal } from "antd";
import { ContactFormValues, contactSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact } from "@/services/contactsApi";
import { useEffect } from "react";

export default function ContactFormModal({
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
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "" },
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
    <Modal
      title={initial ? "ویرایش" : "افزودن"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={loading}
      okText="ثبت"
      cancelText="لغو"
    >
      <Form layout="vertical">
        <Form.Item
          label="نام"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Input {...register("name")} />
        </Form.Item>
        <Form.Item
          label="تلفن"
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.message}
        >
          <Input {...register("phone")} />
        </Form.Item>
        <Form.Item
          label="ایمیل"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Input {...register("email")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
