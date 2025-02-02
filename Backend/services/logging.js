const { createLogger, format, transports } = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");
const { getCorrelationId } = require("./correlationId"); // Function to retrieve the correlation ID

// Define custom log levels
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
};
// Elasticsearch transport configuration
const esTransport = (appName) => {
  let transporter = {
    level: "info", // Minimum log level to send to Elasticsearch
    clientOpts: {
      node: "https://4c353ad6c55846c7bb2afd9c6d4616b0.europe-west3.gcp.cloud.es.io:9243",
      auth: {
        username: "elastic",
        password: "QYPhGhp9zOVbre2iNNqzukhZ",
      },
    },
    indexPrefix: "api-gateway-logs", // Logs will be stored in indices like "api-gateway-logs-YYYY.MM.DD"
    transformer: (logData) => ({
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString(),
      correlationId: getCorrelationId() || "N/A",
      appName, // Add additional metadata if needed
    }),
  };
  return transporter;
};

// Create a logger instance
const logger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new ElasticsearchTransport(esTransport('api-gateway'))
  ],
});

module.exports = logger;
