<template>
  <div class="admin-analytics-page">
    
    <Navbar />

    
    <div class="sectionHeading">
      <h1>Admin Analytics Dashboard</h1>
    </div>

   
    <div class="content">
      <div class="buttons">
        <button @click="generateReport" class="btn btn-primary" :disabled="isLoading">
          Generate Report
        </button>
        <button @click="deleteLogs" class="btn btn-danger" :disabled="isLoading">
          Delete Logs
        </button>
      </div>

      <div class="falling-container">
        <span v-for="(veg, index) in vegetables"
          :key="index"
          class="vegetable"
          :style="veg.style">
          {{ veg.icon }}
        </span>
      </div>
      
    
    </div>
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
    const vegetables = ref([]);

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
        startAnimation();

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
        isLoading.value = true;
        startAnimation();

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
      } finally {
        isLoading.value = false;
      }
    };

    // Falling Vegetables Animation
    const startAnimation = () => {
      vegetables.value = []; // Clear previous animation

      const vegIcons = ["🍅", "🥕", "🌽", "🥒", "🍆", "🧅", "🥦"  ]; // Available vegetables

      for (let i = 0; i < 10; i++) {
        vegetables.value.push({
          icon: vegIcons[Math.floor(Math.random() * vegIcons.length)],
          style: {
            left: `${Math.random() * 80}%`, // Random horizontal position
            animationDuration: `${1.5 + Math.random() * 2}s`, // Random fall speed
          },
        });
      }

      // Clear vegetables after 3 seconds
      setTimeout(() => {
        vegetables.value = [];
      }, 3000);
    };

    return { generateReport, deleteLogs, isLoading, vegetables };
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
  border: #ff8c00 solid 2px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px auto;
  flex: 1;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 80px;
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

.falling-container {
  position: absolute;
  width: 50%;
  height: 200px;
  overflow: hidden;
}

.vegetable {
  position: absolute;
  top: -50px;
  font-size: 30px;
  animation: fall ease-in infinite;
}

@keyframes fall {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(200px);
    opacity: 0;
  }
}
</style>
