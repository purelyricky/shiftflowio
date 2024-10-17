import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { WorkerClockIn } from "@/components/Gateman/worker-clock-in";

export default function DashboardPage() {
  return (
    <div>
      <AdminPanelLayout>
        <ContentLayout title="Dashboard">
          <WorkerClockIn />
        </ContentLayout>
      </AdminPanelLayout>
    </div>
  );
}
