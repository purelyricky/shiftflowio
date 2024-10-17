// Import the necessary components
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AdminDashboardComponent } from "@/components/Admin/admin-dashboard"; // Import the AdminDashboardComponent

// Export the component as the default export
export default function WorkersPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Workers">
        <AdminDashboardComponent /> {/* Add the AdminDashboardComponent here */}
      </ContentLayout>
    </AdminPanelLayout>
  );
}
