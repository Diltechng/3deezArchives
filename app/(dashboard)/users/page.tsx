"use client"
import ContentHeader from "@/features/shared/components/ContentHeader";
import { api } from "@/features/shared/lib/api";
import { cn } from "@/features/shared/lib/utils";
import { GetUsersResponse } from "@/shared/contracts/users";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const UsersPage = () => {
  const LIMIT = 10;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [activeDateFilter, setActiveDateFilter] = useState("");
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const { isLoading: isLoadingUsers, error: usersError, data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        limit: String(LIMIT),
        page: String(currentPage)
      });

      const response = await api.get(`/users?${searchParams}`);

      const result: GetUsersResponse = response.data;
      
      setTotalAdmins(result.meta?.totalAdmins ?? 0);
      setTotalStaffs(result.meta?.totalStaffs ?? 0);
      setTotalUsers(result.meta?.pagination.total ?? 0);
      
      return result;
    }
  });

  function clearFilters() {
    updateFilter({
      key: "category",
      value: ""
    }, {
      key: "from",
      value: ""
    }, {
      key: "to",
      value: ""
    });
    setActiveDateFilter("")
  }


  function updateFilter(...items: { 
    key: "category" | "search" | "from" | "to";
    value: string;
  }[]) {
    const params = new URLSearchParams(searchParams.toString());
    
    for (const { key, value } of items) {
      if (!value) {
        params.delete(key);
      } else if (value === "all") {
        return clearFilters();
      } else {
        params.set(key, value);
      }
    }

    router.replace(`${pathname}?${params}`);
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    setCurrentPage(1);
    updateFilter({ key: "search", value: term });
  }, 300);

  return (
    <div>
      <ContentHeader title="Users" subtitle={`${totalUsers} members · ${totalAdmins} admins · ${totalStaffs} staff`}>
        <button 
          className="button-primary"
          onClick={() => {}}
        >
          ADD USER
        </button>
      </ContentHeader>
      <div className="input-core mb-4">
        <input
          className="w-full"
          placeholder="Search users..."
          defaultValue={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {usersData?.data?.length && <table className="w-full text-[12px]">
          <thead>
            <tr>
              {["MEMBER", "ROLE", "UPLOADS", "LAST ACTIVE", "STATUS", "ACTIONS"].map(title =>
                <th
                  key={title}
                  className="font-mono text-[9px] tracking-[0.08rem] py-2 px-3 text-left border-b border-border text-text-3 bg-surface-2"
                >
                  {title}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {usersData.data.map((user: any) => {
              const isAdmin = user.role === "admin";
              const isActive = user.status === "active";
              
              const fullNameArr = user.fullName.split(" ");
              const avatarText = `${fullNameArr[0][0]}${fullNameArr[fullNameArr.length-1][0]}`

              return(
                <tr key={user.id}>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="flex gap-2 items-center">
                      <div className={cn(
                        "flex justify-center items-center rounded-full w-7 aspect-square text-[10px] border",
                        isAdmin? "text-accent border-accent bg-accent/20"
                        : "text-text-2 border-border-2 bg-surface-3"
                      )}>
                        {avatarText.toUpperCase()}
                      </div>
                      <div>
                        <div>
                          {user.fullName ?? "-"}
                        </div>
                        <div className="font-[10px] text-text-3">
                          {user.email ?? "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={cn(
                        "py-0.75 px-2 rounded-[3px] tracking-[0.08rem] text-[9px] border",
                        isAdmin? "text-accent border-accent bg-accent/20"
                        : "text-accent-3 border-accent-3 bg-accent-3/20"
                      )}
                    >
                      {user.role?.toUpperCase() ?? "-"}
                    </span>
                  </td>
                  <td className={cn(
                    "py-2.5 px-3 text-[11px]",
                    isAdmin? "text-accent"
                    : "text-text-2"
                  )}>
                    {user.postsCount ?? "-"}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-text-3">
                    {user.lastActive ?? "-"}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className={cn(
                      "flex items-center gap-1.25 text-[10px]",
                      isActive && "text-accent-3"
                    )}>
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{user.status?.replace(/^./, (c: string) => c.toUpperCase()) ?? "-"}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1.5">
                      <button className="flex justify-center items-center h-6.5 w-6.5 rounded-lg border text-text-2 border-border-2 hover:border-accent">

                      </button>
                      <button className="flex justify-center items-center h-6.5 w-6.5 rounded-lg border text-text-2 border-border-2 hover:border-accent">

                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>}
      </div>
    </div>
  );
}

export default UsersPage;