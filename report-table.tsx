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
} from '@mui/material';

export interface ReportRow {
  id: number;
  date: string;
  associate: string;
  tower: string;
  application: string;
  activity: string;
  subActivity: string;
  effort: number;
}

interface ReportsTableProps {
  rows: ReportRow[];
}

export function ReportsTable({
  rows,
}: ReportsTableProps): React.JSX.Element {

  const totalHours = rows.reduce(
    (sum, row) => sum + Number(row.effort),
    0
  );

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

        <Table>

          <TableHead>

            <TableRow
              sx={{
                background:
                  'linear-gradient(135deg,#8dc63f,#3a8f2f)',
              }}
            >
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                Date
              </TableCell>

              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                Associate
              </TableCell>

              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                Tower
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

              <TableCell
                align="center"
                sx={{ color: '#fff', fontWeight: 700 }}
              >
                Hours
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {rows.length === 0 ? (

              <TableRow>

                <TableCell colSpan={7} align="center">

                  No Records Found

                </TableCell>

              </TableRow>

            ) : (

              rows.map((row) => (

                <TableRow key={row.id} hover>

                  <TableCell>{row.date}</TableCell>

                  <TableCell>{row.associate}</TableCell>

                  <TableCell>{row.tower}</TableCell>

                  <TableCell>{row.application}</TableCell>

                  <TableCell>{row.activity}</TableCell>

                  <TableCell>{row.subActivity}</TableCell>

                  <TableCell align="center">

                    <Chip
                      label={`${row.effort} hrs`}
                      color="success"
                      variant="outlined"
                    />

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >

          <Typography fontWeight={700}>
            Total Associates : {new Set(rows.map(r => r.associate)).size}
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
