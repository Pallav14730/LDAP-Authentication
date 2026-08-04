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
  Checkbox,
  ListItemText,
} from '@mui/material';

import Grid from '@mui/material/Grid';

import AssessmentIcon from '@mui/icons-material/Assessment';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import {
  ReportsTable,
  ReportRow,
} from './reports-table';


// ===============================
// Interfaces
// ===============================

interface Tower {
  tower_id: number;
  tower_name: string;
}

interface Application {
  application_id: number;
  application_name: string;
  tower_id: number;
}


// ===============================
// Reports Page
// ===============================

export function ReportsPage(): React.JSX.Element {

  // ===============================
  // State
  // ===============================

  const [rows, setRows] = React.useState<ReportRow[]>([]);

  const [loading, setLoading] = React.useState(false);

  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  const [towerId, setTowerId] = React.useState('');
  const [applicationId, setApplicationId] = React.useState('');

  const [towers, setTowers] = React.useState<Tower[]>([]);

  const [applications, setApplications] = React.useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] =
    React.useState<any[]>([]);

  // Multiple selected users
  const [usernames, setUserNames] = React.useState<string[]>([]);

  // Selected users
  const [selectedUserNames, setSelectedUserNames] =
    React.useState<string[]>([]);

  // Show report only after Preview
  const [showReport, setShowReport] = React.useState(false);


  // ===============================
  // Load Towers
  // ===============================

  const fetchTowers = async () => {

    try {

      const response = await fetch(
        'http://localhost:3000/api/towers'
      );

      const result = await response.json();

      if (result.success) {
        setTowers(result.data);
      }

    } catch (err) {

      console.error(
        'Error loading towers:',
        err
      );

    }
  };


  // ===============================
  // Load Resources
  // ===============================

  const fetchResources = async () => {

    try {

      const response = await fetch(
        'http://localhost:3000/api/resources'
      );

      const result = await response.json();

      if (result.success) {

        setApplications(result.data);

        setFilteredApplications(
          result.data
        );
      }

    } catch (err) {

      console.error(
        'Error loading resources:',
        err
      );

    }
  };


  // ===============================
  // Load Master Data
  // ===============================

  React.useEffect(() => {

    fetchTowers();
    fetchResources();

  }, []);


  // ===============================
  // Filter Applications by Tower
  // ===============================

  React.useEffect(() => {

    if (!towerId) {

      setFilteredApplications([]);

      setApplicationId('');

      setUserNames([]);

      setSelectedUserNames([]);

      setShowReport(false);

      return;
    }


    const filtered = applications.filter(
      (item: any) =>
        Number(item.tower_id) ===
        Number(towerId)
    );


    // Remove duplicate applications
    const uniqueApplications =
      filtered.filter(
        (
          app: any,
          index: number,
          self: any[]
        ) =>
          index ===
          self.findIndex(
            (a: any) =>
              Number(a.application_id) ===
              Number(app.application_id)
          )
      );


    setFilteredApplications(
      uniqueApplications
    );

    setApplicationId('');

    setUserNames([]);

    setSelectedUserNames([]);

    setShowReport(false);

  }, [towerId, applications]);


  // ===============================
  // Filter Users by Tower + Application
  // ===============================

  React.useEffect(() => {

    if (!towerId || !applicationId) {

      setUserNames([]);

      setSelectedUserNames([]);

      return;
    }


    const filteredUsers =
      applications.filter(
        (item: any) =>
          Number(item.tower_id) ===
            Number(towerId) &&

          Number(item.application_id) ===
            Number(applicationId)
      );


    const uniqueUsers =
      Array.from(
        new Set(
          filteredUsers
            .map(
              (item: any) =>
                item.user_name
            )
            .filter(Boolean)
        )
      );


    setUserNames(
      uniqueUsers
    );

    setSelectedUserNames([]);

  }, [
    towerId,
    applicationId,
    applications,
  ]);


  // ===============================
  // Hide previous report when filter changes
  // ===============================

  React.useEffect(() => {

    setShowReport(false);

  }, [
    fromDate,
    toDate,
    towerId,
    applicationId,
    selectedUserNames,
  ]);


  // ===============================
  // Preview Report
  // ===============================

  const handlePreview = async () => {

    if (!fromDate || !toDate) {

      alert(
        'Please select From Date and To Date'
      );

      return;
    }


    if (!towerId) {

      alert(
        'Please select Tower'
      );

      return;
    }


    if (!applicationId) {

      alert(
        'Please select Application'
      );

      return;
    }


    try {

      setLoading(true);


      // Base API URL
      let url =
        `http://localhost:3000/api/report` +
        `?fromDate=${fromDate}` +
        `&toDate=${toDate}` +
        `&towerId=${towerId}` +
        `&applicationId=${applicationId}`;


      // Add selected users
      if (
        selectedUserNames.length > 0
      ) {

        selectedUserNames.forEach(
          (name) => {

            url +=
              `&user_name=${encodeURIComponent(
                name
              )}`;

          }
        );

      }


      console.log(
        'Report API URL:',
        url
      );


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          'Failed to fetch report'
        );

      }


      const result =
        await response.json();


      console.log(
        'Report Response:',
        result
      );


      // Your backend returns rows directly
      setRows(result);

      setShowReport(true);

    } catch (err) {

      console.error(
        'Error loading report:',
        err
      );

      alert(
        'Unable to load report'
      );

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // Download Excel
  // ===============================

  const handleDownload = async () => {

    if (!rows.length) {

      alert(
        'Please preview the report first.'
      );

      return;
    }


    // Backend already filtered the data,
    // so export the rows directly.
    const exportRows = rows;


    const workbook =
      new ExcelJS.Workbook();


    workbook.creator =
      'RL Reports';


    const worksheet =
      workbook.addWorksheet(
        'Effort Report'
      );


    // ===============================
    // Excel Columns
    // ===============================

    worksheet.columns = [

      {
        header: 'Effort Date',
        key: 'effort_date',
        width: 18,
      },

      {
        header: 'User Name',
        key: 'user_name',
        width: 25,
      },

      {
        header: 'Application',
        key: 'application_name',
        width: 25,
      },

      {
        header: 'Activity',
        key: 'activity',
        width: 25,
      },

      {
        header: 'Sub Activity',
        key: 'sub_activity',
        width: 25,
      },

      {
        header: 'Description',
        key: 'description',
        width: 40,
      },

      {
        header: 'Effort Hours',
        key: 'effort_hours',
        width: 18,
      },

    ];


    // ===============================
    // Add Data
    // ===============================

    exportRows.forEach(
      (row: any) => {

        worksheet.addRow({

          effort_date:
            row.effort_date,

          user_name:
            row.user_name,

          application_name:
            row.application_name,

          activity:
            row.activity,

          sub_activity:
            row.sub_activity,

          description:
            row.description,

          effort_hours:
            row.effort_hours,

        });

      }
    );


    // ===============================
    // Header Style
    // ===============================

    const headerRow =
      worksheet.getRow(1);


    headerRow.height = 25;


    headerRow.eachCell(
      (cell) => {

        cell.font = {

          bold: true,

          color: {
            argb: 'FFFFFFFF',
          },

          size: 11,

        };


        cell.fill = {

          type: 'pattern',

          pattern: 'solid',

          fgColor: {
            argb: 'FF8DC63F',
          },

        };


        cell.alignment = {

          horizontal: 'center',

          vertical: 'middle',

        };


        cell.border = {

          top: {
            style: 'thin',
          },

          left: {
            style: 'thin',
          },

          bottom: {
            style: 'thin',
          },

          right: {
            style: 'thin',
          },

        };

      }
    );


    // ===============================
    // Data Cell Style
    // ===============================

    worksheet.eachRow(
      (row, rowNumber) => {

        if (rowNumber === 1) {
          return;
        }


        row.eachCell(
          (cell) => {

            cell.alignment = {

              horizontal: 'center',

              vertical: 'middle',

              wrapText: true,

            };


            cell.border = {

              top: {
                style: 'thin',
              },

              left: {
                style: 'thin',
              },

              bottom: {
                style: 'thin',
              },

              right: {
                style: 'thin',
              },

            };

          }
        );

      }
    );


    // ===============================
    // Auto Column Width
    // ===============================

    worksheet.columns.forEach(
      (column) => {

        let maxLength = 10;


        column.eachCell?.(
          {
            includeEmpty: true,
          },

          (cell) => {

            const value =
              cell.value
                ? cell.value.toString()
                : '';


            maxLength =
              Math.max(
                maxLength,
                value.length
              );

          }
        );


        column.width =
          Math.min(
            maxLength + 3,
            50
          );

      }
    );


    // ===============================
    // Download
    // ===============================

    const buffer =
      await workbook.xlsx.writeBuffer();


    saveAs(

      new Blob(
        [buffer],

        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      ),

      `Effort_Report_${new Date()
        .toISOString()
        .split('T')[0]}.xlsx`

    );

  };


  // ===============================
  // JSX
  // ===============================

  return (

    <Box>

      <Card
        sx={{
          border:
            '1px solid rgba(141,198,63,0.22)',

          boxShadow:
            '0 2px 12px rgba(141,198,63,0.08)',

          borderRadius: 3,

          overflow: 'hidden',
        }}
      >

        {/* Header */}

        <Box
          sx={{
            p: 2,

            display: 'flex',

            justifyContent:
              'space-between',

            alignItems:
              'center',

            background:
              'linear-gradient(135deg,#8dc63f,#3a8f2f)',
          }}
        >

          <Box
            sx={{
              display: 'flex',

              alignItems:
                'center',

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

                  fontSize:
                    '1.1rem',
                }}
              >
                RL Reports
              </Typography>


              <Typography
                sx={{
                  color:
                    'rgba(255,255,255,0.8)',

                  fontSize:
                    '0.85rem',
                }}
              >
                Generate Effort Reports
              </Typography>

            </Box>

          </Box>

        </Box>


        <CardContent>

          <Grid
            container
            spacing={2}
          >

            {/* From Date */}

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >

              <TextField

                fullWidth

                type="date"

                size="small"

                label="From Date"

                value={fromDate}

                onChange={(e) => {

                  setFromDate(
                    e.target.value
                  );

                }}

                InputLabelProps={{
                  shrink: true,
                }}

              />

            </Grid>


            {/* To Date */}

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >

              <TextField

                fullWidth

                type="date"

                size="small"

                label="To Date"

                value={toDate}

                onChange={(e) => {

                  setToDate(
                    e.target.value
                  );

                }}

                InputLabelProps={{
                  shrink: true,
                }}

              />

            </Grid>


            {/* Tower */}

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >

              <TextField

                fullWidth

                select

                size="small"

                label="Tower"

                value={towerId}

                onChange={(e) => {

                  setTowerId(
                    e.target.value
                  );

                }}

              >

                <MenuItem value="">

                  Select Tower

                </MenuItem>


                {towers.map(
                  (tower) => (

                    <MenuItem

                      key={
                        tower.tower_id
                      }

                      value={
                        tower.tower_id
                      }

                    >

                      {
                        tower.tower_name
                      }

                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Application */}

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >

              <TextField

                fullWidth

                select

                size="small"

                label="Application"

                value={
                  applicationId
                }

                onChange={(e) => {

                  setApplicationId(
                    e.target.value
                  );

                }}

              >

                <MenuItem value="">

                  Select Application

                </MenuItem>


                {filteredApplications.map(
                  (app: any) => (

                    <MenuItem

                      key={
                        app.application_id
                      }

                      value={
                        app.application_id
                      }

                    >

                      {
                        app.application_name
                      }

                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* User Name Multi Select */}

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >

              <TextField

                fullWidth

                select

                size="small"

                label="User Name"

                value={
                  selectedUserNames
                }

                SelectProps={{

                  multiple: true,

                  renderValue:
                    (selected) => {

                      const users =
                        selected as string[];


                      if (
                        users.length ===
                        0
                      ) {

                        return 'All Users';

                      }


                      return users.join(
                        ', '
                      );

                    },

                }}

                onChange={(e) => {

                  const value =
                    e.target.value;


                  const selected =
                    typeof value ===
                    'string'

                      ? value.split(',')

                      : value;


                  // All Users
                  if (
                    selected.includes(
                      '__ALL__'
                    )
                  ) {

                    setSelectedUserNames(
                      []
                    );

                  } else {

                    setSelectedUserNames(
                      selected
                    );

                  }

                }}

              >

                {/* All Users */}

                <MenuItem
                  value="__ALL__"
                >

                  <Checkbox
                    checked={
                      selectedUserNames.length ===
                      0
                    }
                  />

                  <ListItemText
                    primary="All Users"
                  />

                </MenuItem>


                {/* Users */}

                {usernames.map(
                  (name) => (

                    <MenuItem
                      key={name}
                      value={name}
                    >

                      <Checkbox
                        checked={
                          selectedUserNames.includes(
                            name
                          )
                        }
                      />

                      <ListItemText
                        primary={name}
                      />

                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* Preview Button */}

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >

              <Button

                fullWidth

                variant="contained"

                startIcon={
                  loading
                    ? (
                      <Ci
