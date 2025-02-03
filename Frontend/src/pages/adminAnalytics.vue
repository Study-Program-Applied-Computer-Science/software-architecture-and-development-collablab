<template>
  <div class="admin-analytics-page">
    <Navbar />
    <div class="sectionHeading">
      <h1>Admin Analytics Dashboard</h1>
    </div>
    <div class="content">
      <div class="buttons">
        <button @click="generateReport" class="btn btn-primary">Generate Report</button>
        <button @click="deleteLogs" class="btn btn-danger">Delete Logs</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toast-notification";
import { analyticsClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";

export default {
  name: "AdminAnalytics",
  components: { Navbar },

  setup() {
    const toast = useToast();
    const router = useRouter();
    const isLoading = ref(false);
    const logsExist = ref(false); // Track if logs exist

    // ✅ Ensure only Admins can access this page
    onMounted(async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("⚠️ No token found. Redirecting to login.");
        router.push("/login");
        return;
      }

      try {
        const payload = jwtDecode(token);
        const userRole = payload.user?.role;

        console.log("🔍 Checking Admin Access:", userRole);

        if (userRole !== "admin") {
          console.error("❌ Access denied: Admins only.");
          router.push("/");
          return;
        }

        // ✅ Fetch latest logs count when page loads
        await checkLogs();
      } catch (error) {
        console.error("⚠️ Invalid token format. Redirecting to login.");
        router.push("/login");
      }
    });

   // ✅ Fetch latest logs count before any action
const checkLogs = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const logsResponse = await analyticsClient.get("/admin/logs/check", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📊 Raw Logs Count Response:", logsResponse.data);

    // ✅ Extract `totalLogs` count from MongoDB aggregation result
    const logsCount = logsResponse.data.logsCount?.length ? logsResponse.data.logsCount[0].totalLogs : 0;
    
    logsExist.value = logsCount > 0;
    console.log("📊 Final Processed Logs Count:", logsCount);
    
    return logsExist.value;
  } catch (error) {
    console.error("❌ Error checking logs:", error.response?.data || error);
    toast.error("Failed to fetch logs.");
    return false;
  }
};

    const generateReport = async () => {
  try {
    isLoading.value = true;

    // ✅ Fetch latest logs count
    await checkLogs();
    
    if (!logsExist.value) {
      toast.info("There are no recent logs.");
      return;
    }

    console.log("📥 Requesting Report...");
    const token = localStorage.getItem("authToken");
    const response = await analyticsClient.get("/admin/report", {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response || !response.data) {
      throw new Error("⚠️ Empty response from the server.");
    }

    console.log("📥 Report received. Downloading...");
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "analytics-report.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("📂 Report downloaded successfully!");
  } catch (error) {
    console.error("❌ Error generating report:", error.response?.data || error);
    let errorMessage = error.response?.data?.message || "Failed to generate report.";
    toast.error(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

    // ✅ Delete Logs Function
    const deleteLogs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("⚠️ No token found. Cannot delete logs.");
          return;
        }

        const confirmation = confirm("Are you sure you want to delete all logs?");
        if (!confirmation) return;

        console.log("🗑️ Deleting logs...");
        const response = await analyticsClient.delete("/admin/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Logs deleted successfully:", response.data);
        toast.success(response.data.message);

        logsExist.value = false; // ✅ Ensure logs do not exist after deletion
      } catch (error) {
        console.error("❌ Error deleting logs:", error.response?.data || error);
        let errorMessage = error.response?.data?.message || "Failed to delete logs.";
        toast.error(errorMessage);
      }
    };

    return { generateReport, deleteLogs, isLoading };
  },
};
</script>

<style scoped>
.admin-analytics-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.sectionHeading {
  text-align: center;
  padding: 1rem;
  font-size: 24px;
  font-weight: bold;
}

.content {
  width: 100%;
  max-width: 900px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style>
