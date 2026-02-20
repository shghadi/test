"use client";

import { Button, message, Popconfirm, Space, Table } from "antd";
import ContactFormModal from "./CotactsFormModal";
import {
  Contact,
  useCreateContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useUpdateContactMutation,
} from "@/services/contactsApi";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { ContactFormValues } from "./schema";

export default function ContactsTable() {
  const { data, isLoading, isError } = useGetContactsQuery();
  const [createContact, { isLoading: creating }] = useCreateContactMutation();
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const columns: ColumnsType<Contact> = [
    { title: "نام", dataIndex: "name" },
    { title: "تلفن", dataIndex: "phone" },
    { title: "ایمیل", dataIndex: "email" },
    {
      title: "عملیات",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditing(record);
              setOpen(true);
            }}
          >
            ویرایش
          </Button>

          <Popconfirm
            title="حذف شود؟"
            okText="بله"
            cancelText="خیر"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger loading={deleting}>
              حذف
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const onDelete = async (id: number) => {
    try {
      await deleteContact(id).unwrap();
      message.success("حذف شد");
    } catch {
      message.error("خطا در حذف");
    }
  };
  const submit = async (values: ContactFormValues) => {
    try {
      if (editing) {
        await updateContact({ id: editing.id, ...values }).unwrap();
        message.success("ویرایش شد");
      } else {
        await createContact(values).unwrap();
        message.success("اضافه شد");
      }
      close();
    } catch (e) {
      message.error("خطا در ذخیره");
    }
  };

  if (isError) {
    return (
      <div style={{ background: "white", padding: 16, borderRadius: 12 }}>
        خطا در دریافت داده‌ها. مطمئن شو json-server روشن است (پورت 4000).
      </div>
    );
  }
  return (
    <div>
      <div>
        <h2>Contacts</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          افزوودن
        </Button>
      </div>
      <div>
        <Table<Contact>
          rowKey="id"
          loading={isLoading}
          dataSource={data ?? []}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>
      <ContactFormModal
        open={open}
        onClose={close}
        onSubmit={submit}
        initial={editing}
        loading={creating || updating}
      />
    </div>
  );
}
