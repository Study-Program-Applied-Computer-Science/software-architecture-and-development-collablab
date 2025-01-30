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
  import { analyticsClient } from "@/api/index";
  import Navbar from "../components/Navbar.vue";
  
  export default {
    name: "adminAnalytics",
    components: {
      Navbar,
    },
    data() {
      return {
        recipeId: 'exampleRecipeId', // Replace with actual recipe ID
        userId: 'exampleUserId', // Replace with actual user ID
      };
    },
    methods: {
      // Call API to generate and download the report
      async generateReport() {
        try {

           // Check if there are any recent logs
      const logsResponse = await analyticsClient.get("/admin/logs/check");
      if (logsResponse.data.logsCount === 0) {
        this.$toast.info("There are no recent logs.");
        return;
      }

          const response = await analyticsClient.get("/admin/report", {
            responseType: "blob", // Important for file downloads
          });
  
          if (!response || !response.data) {
            throw new Error("Empty response from the server.");
          }
  
          // Create a URL for the Blob response
          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "analytics-report.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          this.$toast.success("Report downloaded successfully!");
        } catch (error) {
          console.error("Error generating report:", error);
  
          let errorMessage = "Failed to generate report.";
  
          if (error.response && error.response.data) {
            errorMessage = error.response.data.message || "Server error occurred.";
          } else if (error.message) {
            errorMessage = error.message;
          }
  
          this.$toast.error(errorMessage);
        }
      },
  
      // Log Recipe View
      async logRecipeView(recipeId, userId) {
        try {
          await analyticsClient.post("/log-view", { recipeId, userId });
          this.$toast.success("View logged successfully!");
        } catch (error) {
          console.error("Error logging view:", error);
  
          let errorMessage = "Failed to log view.";
  
          if (error.response && error.response.data) {
            errorMessage = error.response.data.message || "Server error occurred.";
          } else if (error.message) {
            errorMessage = error.message;
          }
  
          this.$toast.error(errorMessage);
        }
      },
  
      // Call API to delete logs
      async deleteLogs() {
        try {
          const confirmation = confirm("Are you sure you want to delete all logs?");
          if (!confirmation) return;
  
          await analyticsClient.delete("/admin/logs");
          this.$toast.success("All logs deleted successfully!");
        } catch (error) {
          console.error("Error deleting logs:", error);
  
          let errorMessage = "Failed to delete logs.";
  
          if (error.response && error.response.data) {
            errorMessage = error.response.data.message || "Server error occurred.";
          } else if (error.message) {
            errorMessage = error.message;
          }
  
          this.$toast.error(errorMessage);
        }
      },
    },
    mounted() {
      this.logRecipeView(this.recipeId, this.userId);
    }
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