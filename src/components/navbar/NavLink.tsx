"use client";

import { NavbarItem } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavLinkProps = {
  label: string;
  href: string;
};

const NavLink = ({ label, href }: NavLinkProps) => {
  const pathName = usePathname();
  return (
    <NavbarItem isActive={pathName === href}>
      <Link href={href} className={pathName === href ? "active" : ""}>
        {label}
      </Link>
    </NavbarItem>
  );
};

export default NavLink;
