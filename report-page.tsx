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

import { ReportsTable, ReportRow } from './reports-table';

interface Tower {
  tower_id: number;
  tower_name: string;
}

interface Application {
  application_id: number;
  application_name: string;
}

export function ReportsPage(): React.JSX.Element {
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  const [towerId, setTowerId] = React.useState('');
  const [applicationId, setApplicationId] = React.useState('');

  const [towers, setTowers] = React.useState<Tower[]>([]);
  const [applications, setApplications] = React.useState<Application[]>([]);

  const [rows, setRows] = React.useState<ReportRow[]>([]);

React.useEffect(() => {
  fetchTowers();
}, []);

const fetchTowers = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/towers'
    );

    const data = await response.json();

    setTowers(data);
  } catch (err) {
    console.error(err);
  }
};
React.useEffect(() => {
  if (towerId) {
    fetchApplications(towerId);
  } else {
    setApplications([]);
    setApplicationId('');
  }
}, [towerId]);

const fetchApplications = async (towerId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/resources/applications/${towerId}`
    );

    const data = await response.json();

    setApplications(data);
  } catch (err) {
    console.error(err);
  }
};
const handlePreview = async () => {

  if (
    !fromDate ||
    !toDate ||
    !towerId ||
    !applicationId
  ) {
    alert('Please fill all fields.');
    return;
  }

  try {

    setLoading(true);

    const response = await fetch(

      `http://localhost:3000/api/report?fromDate=${fromDate}&toDate=${toDate}&towerId=${towerId}&applicationId=${applicationId}`

    );

    const data = await response.json();

    setRows(data);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

};
const handleDownload = () => {

  console.log("Download Excel");

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
        background:
          'linear-gradient(135deg,#8dc63f 0%,#3a8f2f 100%)',
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
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.8rem',
            }}
          >
            Preview & Download Resource Loading Reports
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
            onChange={(e) =>
              setFromDate(e.target.value)
            }
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
            onChange={(e) =>
              setToDate(e.target.value)
            }
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
            onChange={(e) =>
              setTowerId(e.target.value)
            }
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
            onChange={(e) =>
              setApplicationId(e.target.value)
            }
          >
            <MenuItem value="">
              Select Application
            </MenuItem>

            {applications.map((app) => (
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
              fontWeight: 600,
            }}
          >
            {loading ? 'Loading...' : 'Preview'}
          </Button>
        </Grid>

      </Grid>

      {/* Report Preview */}

      <Box sx={{ mt: 3 }}>
        <ReportsTable rows={rows} />
      </Box>

    </CardContent>

  </Card>
);
}











  const [loading, setLoading] = React.useState(false);
