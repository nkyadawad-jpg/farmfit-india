import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "FARMFIT Decision Engine API",
      timestamp: new Date().toISOString(),
      governance: "Aligned with MoA&FW, CACP, Agmarknet & IMD Open Data standards"
    });
  });

  // Data sources registry endpoint
  app.get("/api/datasources", (_req, res) => {
    res.json({
      sources: [
        {
          id: "cacp_msp",
          name: "Commission for Agricultural Costs & Prices (CACP)",
          organization: "Ministry of Agriculture & Farmers Welfare, GoI",
          coverage: "23 Mandated MSP Crops & Cost of Cultivation (A2, A2+FL, C2)",
          status: "LATEST_AVAILABLE",
          lastPublished: "2024-06-19",
          referenceUrl: "https://cacp.dacnet.nic.in/",
          updateFrequency: "Seasonal (Kharif/Rabi Notification)",
          officialGazette: "GoI Notification No. 1-1/2024-CACP"
        },
        {
          id: "agmarknet",
          name: "Agmarknet APMC Market Price & Arrivals",
          organization: "Directorate of Marketing & Inspection (DMI), GoI",
          coverage: "Over 3,200+ regulated wholesale APMC mandis across India",
          status: "LATEST_AVAILABLE",
          lastPublished: "Daily Trading Feeds",
          referenceUrl: "https://agmarknet.gov.in/",
          updateFrequency: "Daily on market working days"
        },
        {
          id: "imd_agromet",
          name: "India Meteorological Department (IMD) - National Agromet Advisory",
          organization: "Ministry of Earth Sciences, GoI",
          coverage: "District-level 5-7 day weather forecasts & agro-advisories",
          status: "LATEST_AVAILABLE",
          lastPublished: "Bi-weekly bulletins (Tuesdays & Fridays)",
          referenceUrl: "https://mausam.imd.gov.in/",
          updateFrequency: "Daily / Bi-weekly"
        },
        {
          id: "shc_portal",
          name: "Soil Health Card Portal",
          organization: "Department of Agriculture & Farmers Welfare, GoI",
          coverage: "Macro & Micronutrient norms, Soil Orders across Indian districts",
          status: "LATEST_AVAILABLE",
          lastPublished: "Cycle-II Norms",
          referenceUrl: "https://soilhealth.dac.gov.in/",
          updateFrequency: "Periodic / State Agricultural University baseline"
        },
        {
          id: "des_production",
          name: "Directorate of Economics and Statistics (DES)",
          organization: "Ministry of Agriculture & Farmers Welfare, GoI",
          coverage: "Advance Estimates of Area, Production and Yield of Principal Crops",
          status: "LATEST_AVAILABLE",
          lastPublished: "2023-24 (Final) & 2024-25 (Advance Estimates)",
          referenceUrl: "https://desagri.gov.in/",
          updateFrequency: "Quarterly Advance Estimates"
        },
        {
          id: "apeda_trade",
          name: "APEDA & DGCIS Trade Statistics",
          organization: "Ministry of Commerce and Industry, GoI",
          coverage: "Agricultural commodities exports, export tariffs & import trends",
          status: "LATEST_AVAILABLE",
          lastPublished: "Monthly Trade Statistics",
          referenceUrl: "https://apeda.gov.in/",
          updateFrequency: "Monthly"
        }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FARMFIT Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
