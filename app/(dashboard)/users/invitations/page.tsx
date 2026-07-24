"use client"

import ContentHeader from "@/features/shared/components/ContentHeader";
import StateCard from "@/features/shared/components/StateCard";
import useModal from "@/features/shared/hooks/useModal";
import useSearchFilters from "@/features/shared/hooks/useSearchFilters";
import { api } from "@/features/shared/lib/api";
import InvitationsTable from "@/features/invitations/components/InvitationsTable";
import InvitationsTableRow, { InvitationsTableRowSkeleton } from "@/features/invitations/components/InvitationsTableRow";
import InviteUserForm from "@/features/invitations/components/InviteUserForm";
import { useQuery } from "@tanstack/react-query";
import { Inbox, SearchX, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Can from "@/features/permissions/components/Can";
import { PERMISSIONS } from "@/shared/constants/permissions";

const InvitationsPage = () => {
  const LIMIT = 10;
  const { openFormModal } = useModal();

  const { hasFilters, values, updateFilters } = useSearchFilters<"search">();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitations, setTotalInvitations] = useState(0);

  const handleSearch = useDebouncedCallback((term: string) => {
    setCurrentPage(1);
    updateFilters({ key: "search", value: term });
  }, 300);

  const { isLoading: isLoadingInvitations, error: invitationsError, data: invitationsData } = useQuery({
    queryKey: ["invitations", values],
    queryFn: async () => {
      console.log(values);
      const searchParams = new URLSearchParams({
        ...values,
        limit: String(LIMIT),
        page: String(currentPage),
      });

      const response = await api.get(`/invitations?${searchParams}`);

      setTotalInvitations(response.data.meta.pagination.total);
      
      return response.data;
    }
  })

  return (
    <div className="flex flex-col flex-1">
      <ContentHeader title="Invitations" subtitle={`${totalInvitations} active invitations`}>
        <Can permission={PERMISSIONS.USERS_INVITE}>
          <button 
            className="button-primary uppercase"
            onClick={() => openFormModal(InviteUserForm, {
              title: "Invite User",
              subtitle: "Grant access to the archives",
            })}
          >
            Invite User
          </button>
        </Can>
      </ContentHeader>
      <div className="input-core mb-4">
        <input
          className="w-full"
          placeholder="Search invitations..."
          defaultValue={values.search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      {isLoadingInvitations
        ? (
          <InvitationsTable>
            {Array.from({ length: 3 }).map((_, i) => <InvitationsTableRowSkeleton key={i} />)}
          </InvitationsTable>
        ): invitationsData?.data?.length
          ? (
            <div className="overflow-auto rounded-lg border border-border bg-surface">
              <InvitationsTable>
                {invitationsData.data.map((i: any) => <InvitationsTableRow key={i.id} invitation={i} />)}
              </InvitationsTable>
            </div>
          ): invitationsError
            ? <StateCard icon={{ component: TriangleAlert }} title="Couldn't Load Invitations" subtitle="
                    Something went wrong while fetching your invitations. Please try again.
                " />
            : (hasFilters
              ? (
                <StateCard icon={{ component: SearchX, color: "accent" }} title="No Results Found" subtitle="
                    We couldn't find anything matching your current search and filters.
                    Try adjusting your filters or clearing them to see more results.
                " />
              ): (
                <StateCard icon={{ component: Inbox, color: "accent" }} title="No Invitations" subtitle="
                  There are currently no invitations.
                " />
              )
            )
      }
    </div>
  )
}

export default InvitationsPage;