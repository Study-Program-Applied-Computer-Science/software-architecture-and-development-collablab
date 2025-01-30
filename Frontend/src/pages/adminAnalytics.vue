<template>
    <div class="admin-analytics-page">
      <Navbar />
      <div class="sectionHeading">
        <h1>Admin Analytics Dashboard</h1>
      </div>
      <div class="content">
        <div class="buttons">
          <!-- Button to Generate Report -->
          <button @click="generateReport" class="btn btn-primary">
            Generate Report
          </button>
          
          <!-- Button to Delete Logs -->
          <button @click="deleteLogs" class="btn btn-danger">
            Delete Logs
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { apiClient } from "@/api/index";
  import Navbar from "../components/Navbar.vue";
  
  export default {
    name: "adminAnalytics",
    components: {
      Navbar,
    },
    methods: {
      // Call API to generate and download the report
      async generateReport() {
        try {
          const response = await apiClient.get("/analytics/admin/report", {
            responseType: "blob", // Required for file download
          });
  
          // Create a blob and trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "analytics-report.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          this.$toast.success("Report generated successfully!");
        } catch (error) {
          console.error("Error generating report:", error);
          this.$toast.error("Failed to generate report.");
        }
      },
  
      // Call API to delete logs
      async deleteLogs() {
        try {
          const confirmation = confirm("Are you sure you want to delete all logs?");
          if (!confirmation) return;
  
          await apiClient.delete("/analytics/admin/logs");
          this.$toast.success("All logs deleted successfully!");
        } catch (error) {
          console.error("Error deleting logs:", error);
          this.$toast.error("Failed to delete logs.");
        }
      },
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