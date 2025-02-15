import { Button } from "@heroui/react";
import { auth, signOut } from "@/auth";
import { FaRegSmile } from "react-icons/fa";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-3xl">Hell app</h1>
      <div className="text-xl">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          {session && (
            <Button
              type="submit"
              color="primary"
              variant="bordered"
              startContent={<FaRegSmile size={20} />}
            >
              Sign OUt
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
