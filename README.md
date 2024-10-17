<<<<<<< HEAD
=======
# Project Structure and Development Guide

Here's a detailed explanation of the project structure, how each part functions, what files are hosted where, and what to consider when making changes. This will help you maintain, extend, and modify your project effectively:

## Project Structure Overview

```
src/
├── components/
│   ├── Admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Settings.tsx
│   │   └── ...               // Other components specific to admin
│   ├── Client/
│   │   ├── ClientDashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Profile.tsx
│   │   └── ...               // Other components specific to client
│   ├── Common/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AuthForm.tsx
│   │   └── ...               // Shared components used across roles
│   ├── ShiftLeader/
│   ├── Gateman/
│   └── Student/
│
├── context/
│   ├── AuthContext.tsx       // Context for user authentication
│   ├── UserProvider.tsx      // Context provider for user state management
│   └── ...                   // Other global context files
│
├── hooks/
│   ├── useAuth.ts            // Custom hook for handling authentication
│   ├── useSidebar.ts         // Custom hook for managing sidebar state
│   └── ...                   // Other custom hooks
│
├── layouts/
│   ├── AdminLayout.tsx       // Layout wrapper for admin-specific pages
│   ├── ClientLayout.tsx      // Layout wrapper for client-specific pages
│   ├── ShiftLeaderLayout.tsx // Layout wrapper for shift leader-specific pages
│   ├── GatemanLayout.tsx     // Layout wrapper for gateman-specific pages
│   ├── StudentLayout.tsx     // Layout wrapper for student-specific pages
│   └── MainLayout.tsx        // Main layout for landing page and public pages
│
├── app/
│   ├── api/                  // API route handlers (e.g., for email sending)
│   ├── auth/
│   │   ├── login.tsx         // Login page for all users
│   │   ├── register.tsx      // Registration page for new users
│   │   └── ...               // Other authentication-related pages
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── index.tsx     // Admin dashboard homepage
│   │   │   ├── users/
│   │   │   │   └── page.tsx  // Admin's user management page
│   │   │   ├── settings/
│   │   │   │   └── page.tsx  // Admin's settings page
│   │   ├── client/
│   │   │   ├── index.tsx     // Client dashboard homepage
│   │   │   ├── orders/
│   │   │   │   └── page.tsx  // Client's orders page
│   │   │   └── profile/
│   │   │       └── page.tsx  // Client's profile page
│   │   ├── shiftleader/
│   │   │   └── ...           // Shift leader-specific pages
│   │   ├── gateman/
│   │   │   └── ...           // Gateman-specific pages
│   │   ├── student/
│   │   │   └── ...           // Student-specific pages
│   │   └── ...
│   ├── index.tsx             // Main landing page
│   └── ...
│
├── styles/
│   ├── globals.css           // Global styles for the app, including Tailwind imports
│   └── ...                   // Other style files
│
├── utils/
│   ├── api.ts                // Functions for interacting with Appwrite and SendGrid
│   ├── constants.ts          // Any constant values (e.g., role names, API URLs)
│   └── helpers.ts            // Utility functions for general use
│
├── types/
│   ├── user.ts               // TypeScript types and interfaces for user roles
│   └── ...                   // Other shared types
│
└── appwrite/                 // Configuration files related to Appwrite
    ├── client.ts             // Client setup for Appwrite SDK
    └── ...                   // Other Appwrite-related configurations
```

## Detailed Breakdown of the Structure

### 1. `components/` Folder
- **Purpose**: Contains all reusable UI components, organized by user roles and shared components.
- **Usage**:
  - **Role-Specific Folders (`Admin`, `Client`, `ShiftLeader`, `Gateman`, `Student`)**: Each folder contains components that are specific to a user role, such as `AdminDashboard.tsx` or `ClientDashboard.tsx`.
  - **`Common/` Folder**: Holds components that are used across different parts of the application, like `Sidebar.tsx` (which dynamically renders based on user role), `Header.tsx`, and `AuthForm.tsx`.
  - **Changes**: When modifying or adding new components for a specific user role, add them in the respective folder (e.g., `components/Admin/` for admin-specific components). Shared components should be placed in `Common/`.

### 2. `context/` Folder
- **Purpose**: Manages global application state using React Context, such as authentication state and user data.
- **Files**:
  - **`AuthContext.tsx`**: Stores authentication state and methods like login, logout, and user role management.
  - **`UserProvider.tsx`**: Wraps the entire app and provides user data to all components.
  - **Changes**: Add new context files here if you need to manage other global states (e.g., theme settings).

### 3. `hooks/` Folder
- **Purpose**: Stores custom React hooks for reusable logic.
- **Examples**:
  - **`useAuth.ts`**: Manages authentication logic, e.g., checking if a user is logged in.
  - **`useSidebar.ts`**: Custom logic for toggling and managing the sidebar state.
  - **Changes**: Add new hooks here if you find repeating logic across components.

### 4. `layouts/` Folder
- **Purpose**: Defines reusable layout components for different user roles.
- **Files**:
  - **`AdminLayout.tsx`, `ClientLayout.tsx`, etc.**: Wrap pages with role-specific layouts, ensuring consistent UI (like sidebar placement).
  - **`MainLayout.tsx`**: Used for public pages like the landing page.
  - **Changes**: Modify these files if you want to change the general structure (e.g., layout changes) of a specific user's dashboard.

### 5. `pages/` Folder
- **Purpose**: Contains all the Next.js routes for the application.
- **Structure**:
  - **`auth/` Folder**: Contains `login.tsx` and `register.tsx` pages, handling the user login and registration.
  - **`dashboard/` Folder**: Subfolders for each user role, with each role having its own set of pages (e.g., `admin`, `client`). Each subfolder's `index.tsx` serves as the homepage for that role.
  - **Changes**: Add or modify pages under the relevant role's subfolder when adding new views (e.g., a new page for viewing reports by admins).

### 6. `styles/` Folder
- **Purpose**: Manages global styles, including Tailwind CSS configuration.
- **Files**:
  - **`globals.css`**: Contains the base Tailwind imports and any custom global styles.
  - **Changes**: Add new global styles here. Use Tailwind classes in components for most styling needs.

### 7. `utils/` Folder
- **Purpose**: Contains utility functions for API interactions, constants, and helper functions.
- **Examples**:
  - **`api.ts`**: Centralizes API calls to Appwrite and SendGrid.
  - **`constants.ts`**: Stores fixed values, like user role names.
  - **Changes**: Add new utility functions here as needed to keep your components clean.

### 8. `types/` Folder
- **Purpose**: Stores TypeScript types and interfaces.
- **Files**:
  - **`user.ts`**: Contains type definitions for user objects, roles, etc.
  - **Changes**: Add new types or modify existing ones as your app's data models evolve.

### 9. `appwrite/` Folder
- **Purpose**: Manages configurations related to Appwrite, like setting up the client.
- **Files**:
  - **`client.ts`**: Sets up the Appwrite client SDK for interacting with the backend.
  - **Changes**: Modify if you need to update the Appwrite setup, like changing the endpoint or project ID.

## How to Make Changes

1. **Adding a New Page for a Role**: Add the `.tsx` file under the relevant role's folder in `pages/dashboard/[role]/`.
2. **Modifying the Sidebar**: Update the `Sidebar.tsx` in `components/Common/` to change the menu items or icons for a specific role.
3. **Changing Layout Structure**: Modify the layout files in `layouts/` to adjust the general structure of the dashboards.
4. **Adding a New API Interaction**: Add new functions in `utils/api.ts` for API calls related to new features.
5. **Updating Authentication Logic**: Modify `AuthContext.tsx` and `useAuth.ts` for changes in login flows or user roles.

This structure is designed to keep role-specific logic separated, making it easier to scale and maintain. It also allows for consistent styling and layouts while keeping shared functionality centralized.
