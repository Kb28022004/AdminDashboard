import React from "react";

import { Grid, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReportCard from "../components/utils/ReportCard";

const Reports = () => {
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          {/* Report Card 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              icon={<AccessTimeIcon fontSize="large" color="primary" />}
              statement="Total Hours Worked"
              data="1,234 hrs"
            />
          </Grid>

          {/* Report Card 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              icon={<BarChartIcon fontSize="large" color="secondary" />}
              statement="Tasks Completed"
              data="567"
            />
          </Grid>

          {/* Report Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              icon={<TrendingUpIcon fontSize="large" color="success" />}
              statement="Productivity"
              data="85 %"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Reports;
