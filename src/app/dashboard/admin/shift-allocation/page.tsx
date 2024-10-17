import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ShiftAllocation } from "@/components/Admin/shift-allocation";

export default function Page() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Shift Allocation">
        <ShiftAllocation />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
