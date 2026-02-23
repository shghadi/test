"use client";

import { Button, message, Popconfirm, Select, Space, Table, Tag } from "antd";
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
  const [createContact, { isLoading: creating }] = useCreateContactMutation();
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();

  const [editedFilter, setEditedFilter] = useState<
    "all" | "edited" | "notEdited"
  >("all");

  // ✅ اول دیتا را بگیر (بک‌اند فیلتر می‌کند)
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetContactsQuery(editedFilter, {
    refetchOnMountOrArgChange: true,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

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
    } catch {
      message.error("خطا در ذخیره");
    }
  };

  const columns: ColumnsType<Contact> = [
    { title: "نام", dataIndex: "name" },
    { title: "تلفن", dataIndex: "phone" },
    { title: "ایمیل", dataIndex: "email" },
    {
      title: "وضعیت",
      dataIndex: "edited",
      render: (v: boolean) => (v ? <Tag>Edited</Tag> : <Tag>Normal</Tag>),
    },
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

  if (isError) {
    return (
      <div style={{ background: "white", padding: 16, borderRadius: 12 }}>
        خطا در دریافت داده‌ها. مطمئن شو json-server روشن است.
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
          افزودن
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "12px 0",
        }}
      >
        <span>فیلتر:</span>
        <Select
          value={editedFilter}
          onChange={setEditedFilter}
          style={{ width: 220 }}
          options={[
            { value: "all", label: "همه" },
            { value: "edited", label: "فقط ویرایش‌شده‌ها" },
            { value: "notEdited", label: "فقط ویرایش‌نشده‌ها" },
          ]}
        />
      </div>

      <Table<Contact>
        rowKey="id"
        loading={isLoading || isFetching}
        // ✅ دیتا مستقیم از بک‌اند می‌آید
        dataSource={data ?? []}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

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