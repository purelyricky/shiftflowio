import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { HrAttendanceTracking } from "@/components/Client/hr-attendance-tracking";

export default function AttendanceTrackingPage() {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Attendance Tracking">
        <HrAttendanceTracking />
      </ContentLayout>
    </AdminPanelLayout>
  );
}
