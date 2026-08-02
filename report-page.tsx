'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { ReportsTable, ReportRow } from './reports-table';

export function ReportsPage(): React.JSX.Element {
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [rows, setRows] = React.useState<ReportRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handlePreview = async () => {
    if (!fromDate || !toDate) {
      alert('Please select From Date and To Date');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/api/report?fromDate=${fromDate}&toDate=${toDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();

      setRows(data);
    } catch (error) {
      console.error(error);
      alert('Unable to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // We'll implement Excel download next
    alert('Excel Download Coming Next');
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
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: '#fff',
              color: '#3a8f2f',
            }}
          >
            <AssessmentIcon />
          </Avatar>

          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            RL Reports
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            bgcolor: '#fff',
            color: '#3a8f2f',
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From Date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To Date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            alignItems="center"
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              disabled={loading}
              sx={{
                height: 40,
                borderColor: '#8dc63f',
                color: '#3a8f2f',
              }}
            >
              {loading ? 'Loading...' : 'Preview'}
            </Button>
          </Grid>

        </Grid>

        <ReportsTable rows={rows} />

      </CardContent>
    </Card>
  );
}
