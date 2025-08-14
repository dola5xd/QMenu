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
    <main className="w-screen min-h-screen px-6 py-10 font-cairo md:px-20 bg-background">
      <div className="h-full max-w-6xl mx-auto my-auto space-y-8">
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
