"use client";

import React from "react";
import { CompaniesFilters } from "@/components/dashboard/integrations/integrations-filters";
import { ReportsPage } from "@/components/dashboard/integrations/reports-page";

export default function Page(): React.JSX.Element {
  const [userRole, setUserRole] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadLoggedInUser = async () => {
    try {
      const token = localStorage.getItem("custom-auth-token");

      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      // Logged-in user information from token
      const loggedInUser = JSON.parse(token);

      console.log("Logged-in user from token:", loggedInUser);

      // Get all users
      const usersResponse = await fetch(
        "http://localhost:3005/api/users"
      );

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const userResult = await usersResponse.json();

      console.log("Users API response:", userResult);

      // Depending on your API response structure
      const users = userResult.data || userResult;

      // Find logged-in user
      const currentUser = users.find(
        (user: any) =>
          user.email_id?.toLowerCase() ===
          loggedInUser.email_id?.toLowerCase()
      );

      if (!currentUser) {
        console.error("Logged-in user not found");
        setLoading(false);
        return;
      }

      console.log("Current user:", currentUser);

      // Get user's role
      const role = Number(currentUser.user_role);

      console.log("Current user role:", role);

      setUserRole(role);
    } catch (error) {
      console.error("Error loading logged-in user:", error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLoggedInUser();
  }, []);

  // Don't render anything while checking user
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Other dashboard content */}

      {/* Only user_role === 1 can access Reports */}
      {userRole === 1 && <ReportsPage />}
    </>
  );
}
