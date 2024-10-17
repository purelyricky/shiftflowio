import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ReportsPageComponent } from "@/components/Admin/reports-page";

export default function ReportsPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Reports">
        <ReportsPageComponent />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
