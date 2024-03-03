import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { getUsers, usersColumns } from "@/services/getUsers.service";

export function Users() {
  return (
    <main className="dark:bg-black w-full min-h-screen">
      <div
        className="w-full flex items-center justify-between px-48 py-8 border-b border-b-zinc-700"
      >
        <h2 className="dark:text-white text-4xl">Users</h2>

        <div>
          <Button>
            Add
          </Button>
        </div>
      </div>
      
      <div className="px-48 py-12">
        <DataTable columns={usersColumns} data={getUsers()} />
      </div>
    </main>
  )
}