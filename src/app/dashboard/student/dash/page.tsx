import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { WorkerDashboardComponent } from "@/components/Student/worker-dashboard";

export default function DashboardPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Dashboard">
        <WorkerDashboardComponent />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
