'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  TableContainer,
  Paper,
} from '@mui/material';

export interface ReportRow {
  effort_date: string;
  user_name: string;
  application_name: string;
  activity: string;
  sub_activity: string;
  description: string;
  effort_hours: number;
}

interface ReportsTableProps {
  rows: ReportRow[];
  username: string;
}

export function ReportsTable({
  rows,
  username,
}: ReportsTableProps): React.JSX.Element {

  // Filter rows based on selected username
  const filteredRows = username
    ? rows.filter((row) => row.user_name === username)
    : rows;

  const totalHours = filteredRows.reduce(
    (sum, row) => sum + Number(row.effort_hours),
    0
  );

  const totalAssociates = new Set(
    filteredRows.map((row) => row.user_name)
  ).size;

  return (
    <Card
      sx={{
        mt: 3,
        border: '1px solid rgba(141,198,63,0.22)',
        boxShadow: '0 2px 12px rgba(141,198,63,0.08)',
        borderRadius: 3,
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: '#3a8f2f',
            fontWeight: 700,
          }}
        >
          Report Preview
        </Typography>

        <TableContainer component={Paper}>

          <Table>

            <TableHead>

              <TableRow
                sx={{
                  background:
                    'linear-gradient(135deg,#8dc63f,#3a8f2f)',
                }}
              >

                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                  Effort Date
                </TableCell>

                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                  User Name
                </TableCell>

                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                  Application
                </TableCell>

                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                  Activity
                </TableCell>

                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                  Sub Activity
                </TableCell>

                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                  Description
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: '#fff', fontWeight: 700 }}
                >
                  Hours
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {filteredRows.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No Records Found
                  </TableCell>

                </TableRow>

              ) : (

                filteredRows.map((row, index) => (

                  <TableRow key={index} hover>

                    <TableCell>
                      {row.effort_date}
                    </TableCell>

                    <TableCell>
                      {row.user_name}
                    </TableCell>

                    <TableCell>
                      {row.application_name}
                    </TableCell>

                    <TableCell>
                      {row.activity}
                    </TableCell>

                    <TableCell>
                      {row.sub_activity}
                    </TableCell>

                    <TableCell>
                      {row.description}
                    </TableCell>

                    <TableCell align="center">

                      <Chip
                        label={`${row.effort_hours} hrs`}
                        color="success"
                        variant="outlined"
                      />

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </TableContainer>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >

          <Typography fontWeight={700}>
            Total Associates : {totalAssociates}
          </Typography>

          <Typography
            fontWeight={700}
            color="#3a8f2f"
          >
            Total Hours : {totalHours}
          </Typography>

        </Box>

      </CardContent>
    </Card>
  );
}


















"use client";

import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TableContainer,
  Paper,
  Box,
} from "@mui/material";

export interface ReportRow {
  effort_date?: string;
  created_at?: string;

  user_name?: string;
  rl_user_id?: number | string;

  application_id?: number | string;
  application_name?: string;

  group_id?: number | string;
  group_name?: string;

  activity?: string;
  sub_activity?: string;
  description?: string;

  effort_hours?: number | string;
}

interface ReportsTableProps {
  rows: ReportRow[];
  username?: string;
}

export function ReportsTable({
  rows,
  username = "",
}: ReportsTableProps) {
  /*
   * If username is provided, filter by it.
   * If username is empty / "All Users", show all rows.
   */
  const filteredRows =
    username &&
    username !== "All Users"
      ? rows.filter(
          (row) => row.user_name === username
        )
      : rows;

  // Total effort hours
  const totalHours = filteredRows.reduce(
    (sum, row) =>
      sum + Number(row.effort_hours || 0),
    0
  );

  // Total unique associates
  const totalAssociates = new Set(
    filteredRows
      .map((row) => row.user_name)
      .filter(Boolean)
  ).size;

  return (
    <Card
      sx={{
        mt: 3,
        border: "1px solid rgba(141,198,63,0.22)",
        boxShadow:
          "0 2px 12px rgba(141,198,63,0.08)",
        borderRadius: 3,
      }}
    >
      <CardContent>
        {/* ========================= */}
        {/* TITLE */}
        {/* ========================= */}

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "#3a8f2f",
            fontWeight: 700,
          }}
        >
          Report Preview
        </Typography>

        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 500,
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #8dc63f, #388f2f)",
                }}
              >
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Effort Date
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  User Name
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Group
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Application
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Activity
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Sub Activity
                </TableCell>

                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Description
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Hours
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ========================= */}
            {/* BODY */}
            {/* ========================= */}

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 4,
                      color: "text.secondary",
                    }}
                  >
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, index) => (
                  <TableRow
                    key={`${row.rl_user_id ?? "user"}-${
                      row.application_id ?? "app"
                    }-${row.effort_date ?? row.created_at ?? index}-${
                      index
                    }`}
                    hover
                  >
                    {/* Effort Date */}
                    <TableCell>
                      {formatDate(
                        row.effort_date ??
                          row.created_at
                      )}
                    </TableCell>

                    {/* User Name */}
                    <TableCell>
                      {row.user_name || "-"}
                    </TableCell>

                    {/* Group */}
                    <TableCell>
                      {row.group_name || "-"}
                    </TableCell>

                    {/* Application */}
                    <TableCell>
                      {row.application_name || "-"}
                    </TableCell>

                    {/* Activity */}
                    <TableCell>
                      {row.activity || "-"}
                    </TableCell>

                    {/* Sub Activity */}
                    <TableCell>
                      {row.sub_activity || "-"}
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      {row.description || "-"}
                    </TableCell>

                    {/* Hours */}
                    <TableCell align="center">
                      <Chip
                        label={`${Number(
                          row.effort_hours || 0
                        ).toFixed(2)} hrs`}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography fontWeight={700}>
            Total Associates: {totalAssociates}
          </Typography>

          <Typography
            fontWeight={700}
            color="#3a8f2f"
          >
            Total Hours: {totalHours.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ================================= */
/* DATE FORMATTER                    */
/* ================================= */

function formatDate(dateValue?: string) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
