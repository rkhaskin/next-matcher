"use client";

import { signOutUser } from "@/actions/authActions";
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type Props = {
  user: Session["user"];
};

export const UserMenu = ({ user }: Props) => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={user?.name || "User Avatar"}
          size="sm"
          src={user?.image || "/images/user.png"}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="User actions menu">
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            as="span"
            className="h-14 flex flex-row"
            aria-label="User name"
            key={user?.email || "User"}
          >
            Signed in as {user?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem as={Link} href="/members/edit" key={"Edit Profile"}>
          Edit Profile
        </DropdownItem>
        <DropdownItem
          color="danger"
          key={"Log Out"}
          onPress={async () => signOutUser()}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
