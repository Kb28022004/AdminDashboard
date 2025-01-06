import React from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Payment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile view

  const data = [
    {
      Name: "Karan",
      PaymentScheduled: "First",
      BillNumber: 124587,
      AmountPaid: "INR 55,241",
      BalanceAmount: "INR 5,241",
      Date: "22-10-2024",
    },
    {
      Name: "Karan",
      PaymentScheduled: "First",
      BillNumber: 124587,
      AmountPaid: "INR 55,241",
      BalanceAmount: "INR 5,241",
      Date: "22-10-2024",
    },
    {
      Name: "Karan",
      PaymentScheduled: "First",
      BillNumber: 124587,
      AmountPaid: "INR 55,241",
      BalanceAmount: "INR 5,241",
      Date: "22-10-2024",
    },
  ];

  return (
    <Box
      sx={{
        margin: isMobile ? theme.spacing(1) : theme.spacing(2),
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        padding: isMobile ? theme.spacing(1) : theme.spacing(2),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            marginLeft: isMobile ? theme.spacing(1) : theme.spacing(2),
            fontFamily: "Montserrat",
            fontWeight: "700",
            fontSize: isMobile
              ? theme.typography.h6.fontSize
              : theme.typography.h5.fontSize,
          }}
          variant="h5"
        >
          Payment Details
        </Typography>
      </Box>

      <Box sx={{ marginTop: isMobile ? theme.spacing(1) : theme.spacing(2) }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: isMobile ? 1 : 4,
            margin: isMobile ? theme.spacing(1) : theme.spacing(2),
            overflowX: isMobile ? "auto" : "visible",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "700" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Payment Schedule</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Bill Number</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Amount Paid</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Balance Paid</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.PaymentScheduled}</TableCell>
                  <TableCell>{row.BillNumber}</TableCell>
                  <TableCell>{row.AmountPaid}</TableCell>
                  <TableCell>{row.BalanceAmount}</TableCell>
                  <TableCell>{row.Date}</TableCell>
                  <TableCell>
                    <MdRemoveRedEye
                      style={{
                        cursor: "pointer",
                        color: "#FEAF00",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Payment;
