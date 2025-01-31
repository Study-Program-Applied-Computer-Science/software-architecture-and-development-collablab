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
  
  export default {
    name: "adminAnalytics",
    components: { Navbar },
    setup() {
      const toast = useToast(); 
  
      // Report generating fun
      const generateReport = async () => {
  try {
    console.log("Checking logs before generating report...");
    const logsResponse = await analyticsClient.get("/admin/logs/check");

    console.log("Logs Count:", logsResponse.data.logsCount);

    if (logsResponse.data.logsCount === 0) {
      toast.info("There are no recent logs.");
      return;
    }

    console.log("Requesting Report...");
    const response = await analyticsClient.get("/admin/report", {
      responseType: "blob",
    });

    if (!response || !response.data) {
      throw new Error("Empty response from the server.");
    }

    console.log("📥 Report received. Downloading...");
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "analytics-report.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Report downloaded successfully!");
  } catch (error) {
    console.error("Error generating report:", error.response?.data || error);
    let errorMessage = error.response?.data?.message || "Failed to generate report.";
    toast.error(errorMessage);
  }
};

  
      // Delate logs fun
      const deleteLogs = async () => {
        try {
          const confirmation = confirm("Are you sure you want to delete all logs?");
          if (!confirmation) return;
  
          await analyticsClient.delete("/admin/logs");
          toast.success("All logs deleted successfully!");
        } catch (error) {
          console.error("Error deleting logs:", error);
          let errorMessage = error.response?.data?.message || "Failed to delete logs.";
          toast.error(errorMessage);
        }
      };
  
      return { generateReport, deleteLogs };
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