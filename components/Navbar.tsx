"use client";
import React, { useEffect } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
type MenuItem = Required<MenuProps>["items"][number];
const Navbar = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  function getItem(
    title: React.ReactNode,
    link: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    const key = link;
    const label = <Link href={`${link}`}>{title}</Link>;
    return {
      key,
      icon,
      children,
      label,
      title,
      type,
    } as MenuItem;
  }
  const items: MenuItem[] = [
    getItem("Dashboard", "/", <PieChartOutlined />),
    getItem("Students", "/students", <DesktopOutlined />),
    getItem("About", "/about", <ContainerOutlined />),
    getItem("About", "/spam", <ContainerOutlined />),
  ];
  //lấy url hiện tại cứ chuyển url là nó được gọi không cần phải render
  const pathname = usePathname();
  //hàm lấy ra mảng key của url đó , ex : ['students'] để truyền vào selectedKey trigger menu chọn item đó
  const [, selectedMenuKeys] = getSelectedMenus(items, pathname);

  return (
    <div className='grid min-h-screen grid-cols-4'>
      <div className='col-span-1 w-full h-full'>
        {selectedMenuKeys && (
          <Menu
            defaultSelectedKeys={selectedMenuKeys}
            selectedKeys={selectedMenuKeys}
            mode='inline'
            theme='light'
            items={items}
          />
        )}
      </div>
      <main className='col-span-3 h-full py-4 px-3'> {children}</main>
    </div>
  );
};
const getSelectedMenus = (
  menus: MenuItem[],
  pathname: string
): [ItemType[] | undefined, string[] | undefined] => {
  if (!menus) return [undefined, undefined];
  let newPathname = pathname;
  // kiểm tra pathname để hiển thị cho đúng vd /students hoặc /students/123 thì cũng active tab students lên vì ở dưới mình đang gán = /students
  // pathname.length bằng 1 thì cho -1 để không cắt vì nếu cắt là rỗng luôn vì '/' thì ra lastIndex = 0
  var lastIndex = pathname.length === 1 ? -1 : pathname.lastIndexOf("/");
  // phải check cả lastIndex !=0 vì '/students' cũng ra lastIndex = 0 đó
  if (lastIndex !== -1 && lastIndex !== 0) {
    newPathname = pathname.substring(0, lastIndex);
  }

  // lọc ra thằng những thằng trong item menu có key trùng với pathname lấy từ url
  let selectedMenus = menus.filter((a) => {
    return a?.key && newPathname === a?.key.toString();
  });
  //map ra mảng có chứa key đó
  let selectedMenuKeys = selectedMenus.map((a) => a?.key?.toString() as string);

  return [selectedMenus, selectedMenuKeys];
};
export default Navbar;
