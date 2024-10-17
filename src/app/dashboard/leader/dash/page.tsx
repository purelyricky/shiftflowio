import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ShiftLeaderDashboardV2 } from "@/components/ShiftLeader/shift-leader-dashboard-v2";

export default function Page() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Dashboard">
        <ShiftLeaderDashboardV2 />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
