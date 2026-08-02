'use client';

import * as React from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';

import Grid from '@mui/material/Grid';

import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import AssessmentIcon from '@mui/icons-material/Assessment';

import {
  ReportsTable,
  ReportRow,
} from './reports-table';

interface Tower {
  tower_id: number;
  tower_name: string;
}

interface Application {
  application_id: number;
  application_name: string;
  tower_id: number;
}

export function ReportsPage(): React.JSX.Element {

  const [rows, setRows] = React.useState<ReportRow[]>([]);

  const [loading, setLoading] = React.useState(false);

  const [fromDate, setFromDate] = React.useState('');

  const [toDate, setToDate] = React.useState('');

  const [towerId, setTowerId] = React.useState('');

  const [applicationId, setApplicationId] = React.useState('');

  const [towers, setTowers] = React.useState<Tower[]>([]);

  const [applications, setApplications] =
    React.useState<Application[]>([]);

  const [filteredApplications, setFilteredApplications] =
    React.useState<Application[]>([]);


// -------------------------
// Load Towers
// -------------------------
const fetchTowers = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/towers");
    const result = await response.json();

    if (result.success) {
      setTowers(result.data);
    }
  } catch (err) {
    console.error("Error loading towers", err);
  }
};

// -------------------------
// Load Applications
// -------------------------
const fetchApplications = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/towers/applications"
    );

    const result = await response.json();

    if (result.success) {
      setApplications(result.data);
      setFilteredApplications(result.data);
    }
  } catch (err) {
    console.error("Error loading applications", err);
  }
};

// -------------------------
// Load Master Data
// -------------------------
React.useEffect(() => {
  fetchTowers();
  fetchApplications();
}, []);

// -------------------------
// Filter Applications
// -------------------------
React.useEffect(() => {

  if (!towerId) {
    setFilteredApplications(applications);
    return;
  }

  const filtered = applications.filter(
    (app) => Number(app.tower_id) === Number(towerId)
  );

  setFilteredApplications(filtered);

  setApplicationId("");

}, [towerId, applications]);

// -------------------------
// Preview Report
// -------------------------
const handlePreview = async () => {

  if (!fromDate || !toDate) {
    alert("Please select From Date and To Date");
    return;
  }

  if (!towerId) {
    alert("Please select Tower");
    return;
  }

  if (!applicationId) {
    alert("Please select Application");
    return;
  }

  try {

    setLoading(true);

    const response = await fetch(

      `http://localhost:3000/api/report?fromDate=${fromDate}&toDate=${toDate}&towerId=${towerId}&applicationId=${applicationId}`

    );

    const result = await response.json();

    if (result.success) {
      setRows(result.data);
    } else {
      setRows([]);
    }

  } catch (err) {

    console.error(err);

    alert("Unable to load report");

  } finally {

    setLoading(false);

  }

};

// -------------------------
// Download Excel
// -------------------------
const handleDownload = async () => {

  if (rows.length === 0) {
    alert("Please preview the report first.");
    return;
  }

  alert("Excel download will be connected in the next step.");

};

return (
  <Card
    sx={{
      border: '1px solid rgba(141,198,63,0.22)',
      boxShadow: '0 2px 12px rgba(141,198,63,0.08)',
      borderRadius: 3,
      overflow: 'hidden',
    }}
  >
    {/* Header */}
    <Box
      sx={{
        background: 'linear-gradient(135deg,#8dc63f 0%,#3a8f2f 100%)',
        px: 3,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#fff',
            color: '#3a8f2f',
            width: 44,
            height: 44,
          }}
        >
          <AssessmentIcon />
        </Avatar>

        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            RL Reports
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.8rem',
            }}
          >
            Preview Resource Loading Report
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
        sx={{
          bgcolor: '#fff',
          color: '#3a8f2f',
          fontWeight: 700,
          '&:hover': {
            bgcolor: '#f5f5f5',
          },
        }}
      >
        Download Excel
      </Button>
    </Box>

    <CardContent>

      <Grid container spacing={2}>

        {/* From Date */}

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Grid>

        {/* To Date */}

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Grid>

        {/* Tower */}

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            size="small"
            label="Tower"
            value={towerId}
            onChange={(e) => setTowerId(e.target.value)}
          >
            <MenuItem value="">
              Select Tower
            </MenuItem>

            {towers.map((tower) => (
              <MenuItem
                key={tower.tower_id}
                value={tower.tower_id}
              >
                {tower.tower_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Application */}

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            size="small"
            label="Application"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          >
            <MenuItem value="">
              Select Application
            </MenuItem>

            {filteredApplications.map((app) => (
              <MenuItem
                key={app.application_id}
                value={app.application_id}
              >
                {app.application_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Preview Button */}

        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              loading ? (
                <CircularProgress size={18} />
              ) : (
                <PreviewIcon />
              )
            }
            onClick={handlePreview}
            disabled={loading}
            sx={{
              borderColor: '#8dc63f',
              color: '#3a8f2f',
              fontWeight: 700,
            }}
          >
            {loading ? 'Loading...' : 'Preview'}
          </Button>
        </Grid>

      </Grid>

      <Box sx={{ mt: 3 }}>
        <ReportsTable rows={rows} />
      </Box>

    </CardContent>

  </Card>
);
}

