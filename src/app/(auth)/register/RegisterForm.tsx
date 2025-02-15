"use client";

import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { Card, CardHeader, CardBody, Input, Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { registerUser } from "@/actions/authActions";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmitHandler = async (data: RegisterSchema) => {
    const result = await registerUser(data);

    if (result.status === "success") {
      console.log("User Registered successfully");
    } else {
      // check if array or string
      if (Array.isArray(result.error)) {
        result.error.forEach((e) => {
          const fieldName = e.path.join(",") as "name" | "email" | "password";
          setError(fieldName, { message: e.message });
        });
      } else {
        setError("root.serverError", { message: result.error });
      }
    }
  };

  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        {/* text-secondary comes fro nextui. https://nextui-themegen.netlify.app/ */}
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
        </div>
        <p className="text-neutral-500">Welcome to NextMatch</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="space-y-4">
            <Input
              label="Name"
              variant="bordered"
              defaultValue=""
              isInvalid={!!errors.name}
              errorMessage="Please enter a valid name"
              {...register("name")}
            />
            <Input
              label="Email"
              variant="bordered"
              defaultValue=""
              isInvalid={!!errors.email}
              errorMessage="Please enter a valid email"
              {...register("email")}
            />
            <Input
              defaultValue=""
              type="password"
              label="Password"
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
              {...register("password")}
            />
            {errors.root?.serverError && (
              <p className="text-danger text-sm">
                {errors.root.serverError.message}
              </p>
            )}
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              color="secondary"
              type="submit"
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
