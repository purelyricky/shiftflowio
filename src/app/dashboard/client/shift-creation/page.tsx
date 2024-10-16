import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ShiftManagementComponent } from "@/components/Client/shift-management";

export default function ShiftCreationPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Shift Creation">
        <ShiftManagementComponent />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
