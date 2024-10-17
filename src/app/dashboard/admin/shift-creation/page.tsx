import { ShiftManagementComponent } from "@/components/Admin/shift-management";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function ShiftCreationPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Shift Creation">
        <ShiftManagementComponent />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
