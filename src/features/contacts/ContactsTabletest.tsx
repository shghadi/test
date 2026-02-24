"use client";

import {
  Contact,
  useCreateContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useUpdateContactMutation,
} from "@/services/contactsApi";
import { Button, message, Popconfirm, Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import ContactFormModal from "./CotactsFormModal";
import { ContactFormValues } from "./schema";

export default function ContactTable() {
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();
  const [createContact, { isLoading: creating }] = useCreateContactMutation();
  const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();
  const [editing, setEditing] = useState<Contact | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editFilter, setEditFilter] = useState<"all" | "edited" | "notEdited">(
    "all",
  );
  const { data, isError, isLoading, isFetching } = useGetContactsQuery(
    editFilter,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const close = () => {
    setOpen(false);
    setEditing(null);
  };
  const onDelete = async (id: number) => {
    try {
      await deleteContact(id).unwrap();
      message.success("delete");
    } catch {
      message.error("error delete");
    }
  };

  const submit = async (values: ContactFormValues) => {
    try {
      if (editing) {
        await updateContact({ id: editing.id, ...values });
        message.success("update ok");
      } else {
        await createContact(values);
        message.success("create ok");
      }
      close();
    } catch {
      message.error("error service");
    }
  };
  const columns: ColumnsType<Contact> = [
    { title: "name", dataIndex: "name" },
    {
      title: "phone",
      dataIndex: "phone",
    },
    { title: "email", dataIndex: "email" },
    {
      title: "status",
      dataIndex: "edited",
      render: (v: boolean) => (v ? <Tag>Edited</Tag> : <Tag>normal</Tag>),
    },
    {
      title: "action",
      key: "action",
      render: (_, record) => {
        <>
          <Button
            onClick={() => {
              setEditing(record);
              setOpen(true);
            }}
          >
            edit
          </Button>
          <Popconfirm
            title="delete"
            okText="ok"
            cancelText="no"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger loading={deleting}>
              delete
            </Button>
          </Popconfirm>
        </>;
      },
    },
  ];

  if (isError) {
    return <h3>error service get</h3>;
  }
  return (
    <>
      <Button
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
        type="primary"
      >
        add
      </Button>

      <Select
        value={editFilter}
        onChange={setEditFilter}
        options={[
          { value: "all", label: "all" },
          { value: "edited", label: "edited" },
          { value: "notEdited", label: "notEdited" },
        ]}
      />

      <Table<Contact>
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={isLoading || isFetching}
        pagination={{ pageSize: 10 }}
      />

      <ContactFormModal
        open={open}
        onClose={close}
        onSubmit={submit}
        initial={editing}
        loading={creating || updating}
      />
    </>
  );
}
