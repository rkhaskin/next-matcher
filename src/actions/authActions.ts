"use server";

import { LoginSchema } from "@/lib/schemas/loginSchema";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { prisma } from "@/prisma";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
export const signInUser = async (
  data: LoginSchema
): Promise<ActionResult<string>> => {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(result);

    return { status: "success", data: "Logged in" };
  } catch (error) {
    console.log("error");
    if (error instanceof AuthError) {
      switch (error.type) {
        case CredentialsSignin.type:
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
};

export const registerUser = async (
  data: RegisterSchema
): Promise<ActionResult<User>> => {
  try {
    // do a zod server side validation
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return {
        status: "error",
        error: validated.error.errors,
      };
    }

    const { email, name, password } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        status: "error",
        error: "User already exists",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    return {
      status: "success",
      data: newUser,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      error: "Something went wrong",
    };
  }
};

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
