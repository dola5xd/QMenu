import { getServerSession } from "next-auth";
import { authOptions, DBUser } from "@/_lib/authOptions";
import { getUserByID } from "@/_utils/api";
import { redirect } from "next/navigation";
import AccountForm from "./_components/AccountForm";
import { NavUser } from "@/_components/ui/NavUser";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const user: DBUser | null = await getUserByID(userId!);

  if (!user) redirect("/login");

  return (
    <main className="font-cairo px-6 md:px-20 py-10 w-screen bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 my-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your profile information
            </p>
          </div>
          <NavUser user={user} />
        </div>

        <AccountForm user={user} />
      </div>
    </main>
  );
}
//
