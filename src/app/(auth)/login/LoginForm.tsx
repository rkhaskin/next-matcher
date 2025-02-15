"use client";

import { signInUser } from "@/actions/authActions";
import { LoginSchema, loginSchema } from "@/lib/schemas/loginSchema";
import { Card, CardHeader, CardBody, Input, Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitHandler = async (data: LoginSchema) => {
    const result = await signInUser(data);
    if (result.status === "success") {
      router.push("/members");
    } else {
      toast.error(result.error as string);
    }
  };

  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        {/* text-secondary comes fro nextui. https://nextui-themegen.netlify.app/ */}
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>
        </div>
        <p className="text-neutral-500">Welcome back to NextMatch</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="space-y-4">
            <Input
              label="Email"
              variant="bordered"
              defaultValue=""
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register("email")}
            />
            <Input
              defaultValue=""
              type="password"
              label="Password"
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
            />
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              color="secondary"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
