"use client";

import { Layout, Menu } from "antd";
import { HomeOutlined, ContactsOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Sider, Content, Header } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const selectedKey = pathname === "/" ? "home" : pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <p style={{ color: "white", padding: 16, fontWeight: 700 }}>
          Dashboard
        </p>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => router.push(key === "home" ? "/" : key)}
          items={[
            {
              key: "home",
              icon: <HomeOutlined />,
              label: "home",
            },
            {
              key: "/contacts",
              icon: <ContactsOutlined />,
              label: "contacts",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "white", paddingInline: 16 }}>
          panel managment
        </Header>
        <Content style={{ margin: 16 }}> {children}</Content>
      </Layout>
    </Layout>
  );
}
