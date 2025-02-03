<template>
  <div class="admin-analytics-page">
    <!-- Navbar -->
    <Navbar />

    <!-- Page Heading -->
    <div class="sectionHeading">
      <h1>Admin Analytics Dashboard</h1>
    </div>

    <!-- Page Content -->
    <div class="content">
      <div class="buttons">
        <button @click="generateReport" class="btn btn-primary">Generate Report</button>
        <button @click="deleteLogs" class="btn btn-danger">Delete Logs</button>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import { useToast } from "vue-toast-notification";
import { analyticsClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue"; 
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";

export default {
  name: "AdminAnalytics",
  components: { Navbar, Footer }, // Register Footer component

  setup() {
    const toast = useToast();
    const router = useRouter();
    const isLoading = ref(false);
    const logsExist = ref(false);

    onMounted(async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const payload = jwtDecode(token);
        const userRole = payload.user?.role;

        if (userRole !== "admin") {
          router.push("/");
          return;
        }
        await checkLogs();
      } catch (error) {
        router.push("/login");
      }
    });

    const checkLogs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const logsResponse = await analyticsClient.get("/admin/logs/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const logsCount = logsResponse.data.logsCount?.length
          ? logsResponse.data.logsCount[0].totalLogs
          : 0;
        logsExist.value = logsCount > 0;
        return logsExist.value;
      } catch (error) {
        toast.error("Failed to fetch logs.");
        return false;
      }
    };

    const generateReport = async () => {
      try {
        isLoading.value = true;
        await checkLogs();
        if (!logsExist.value) {
          toast.info("There are no recent logs.");
          return;
        }

        const token = localStorage.getItem("authToken");
        const response = await analyticsClient.get("/admin/report", {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        });
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers["content-type"] })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "analytics-report.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report downloaded successfully!");
      } catch (error) {
        toast.error("Failed to generate report.");
      } finally {
        isLoading.value = false;
      }
    };

    const deleteLogs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const confirmation = confirm("Are you sure you want to delete all logs?");
        if (!confirmation) return;

        const response = await analyticsClient.delete("/admin/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(response.data.message);
        logsExist.value = false;
      } catch (error) {
        toast.error("Failed to delete logs.");
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
  min-height: 100vh; /* Full viewport height */
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
  margin: 20px auto;
  flex: 1; /* Makes content take available space */
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

/* Footer styling to ensure it stays at the bottom */
.footer {
  background-color: #333;
  color: #fff;
  padding: 2rem;
  text-align: center;
}
</style>
