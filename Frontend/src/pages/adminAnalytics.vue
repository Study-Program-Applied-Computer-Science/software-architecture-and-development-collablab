<script>
import { useToast } from "vue-toast-notification"; 
import { analyticsClient } from "@/api/index";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

export default {
  name: "adminAnalytics",
  components: { Navbar },

  setup() {
    const toast = useToast(); 
    const router = useRouter();

    // Ensure only Admins can access this page
    onMounted(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Access denied: Please log in as admin");
        router.push("/login");
        return;
      }

      try {
        // Decoding JWT
        const payload = JSON.parse(atob(token.split(".")[1])); 
        const user = payload.user;

        if (!user || user.role !== "admin") {
          console.error("Access denied: Admins only");
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Invalid token format");
        router.push("/login");
        return;
      }
    });

    // Report generating function
    const generateReport = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Checking logs before generating report...");
        const logsResponse = await analyticsClient.get("/admin/logs/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Logs Count:", logsResponse.data.logsCount);
        if (logsResponse.data.logsCount === 0) {
          toast.info("There are no recent logs.");
          return;
        }

        console.log("Requesting Report...");
        const response = await analyticsClient.get("/admin/report", {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
          throw new Error("Empty response from the server.");
        }

        console.log("Report received. Downloading...");
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

    return { generateReport };
  },
};
</script>
