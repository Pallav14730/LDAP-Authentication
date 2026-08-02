'use client';

import * as React from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import AssessmentIcon from '@mui/icons-material/Assessment';

export function ReportsPage(): React.JSX.Element {

  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  const [tower, setTower] = React.useState('');
  const [application, setApplication] = React.useState('');
  const [associate, setAssociate] = React.useState('');

  const handlePreview = () => {
    console.log({
      fromDate,
      toDate,
      tower,
      application,
      associate,
    });

    // TODO:
    // Call Preview API
  };

  const handleDownload = () => {
    console.log('Download Excel');

    // TODO:
    // Call Download API
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
          alignItems: 'center',
          gap: 2,
        }}
      >

        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: '#ffffff',
            color: '#3a8f2f',
            border: '2px solid rgba(255,255,255,.5)',
          }}
        >
          <AssessmentIcon />
        </Avatar>

        <Box>

          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            RL Reports
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,.8)',
            }}
          >
            Download Tower Wise RL Report
          </Typography>

        </Box>

      </Box>

      <CardContent>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Tower"
              value={tower}
              onChange={(e) => setTower(e.target.value)}
            >
              <MenuItem value="">
                Select Tower
              </MenuItem>

              <MenuItem value="Corp & Commercial">
                Corp & Commercial
              </MenuItem>

              <MenuItem value="Retail Banking">
                Retail Banking
              </MenuItem>

            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Application"
              value={application}
              onChange={(e) => setApplication(e.target.value)}
            >
              <MenuItem value="">
                Select Application
              </MenuItem>

              <MenuItem value="Centricity">
                Centricity
              </MenuItem>

              <MenuItem value="Clarity">
                Clarity
              </MenuItem>

            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Associate"
              value={associate}
              onChange={(e) => setAssociate(e.target.value)}
            >
              <MenuItem value="">
                All Associates
              </MenuItem>
            </TextField>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >

          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            sx={{
              borderColor: '#8dc63f',
              color: '#3a8f2f',
            }}
          >
            Preview
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              background:
                'linear-gradient(135deg,#8dc63f,#3a8f2f)',
            }}
          >
            Download Excel
          </Button>

        </Box>

      </CardContent>

    </Card>

  );

}
