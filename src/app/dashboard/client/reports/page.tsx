import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ClientReportsPageComponent } from "@/components/Client/client-reports-page";

export default function Page() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Reports">
        <ClientReportsPageComponent />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
