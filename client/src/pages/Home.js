import React, { useEffect } from "react";
import Card from "../components/utils/Card";
import { PiGraduationCapLight } from "react-icons/pi";
import { BiMessage } from "react-icons/bi";
import { PiCurrencyCircleDollarThin } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { Box, Grid } from "@mui/material";
import { useAdminContext } from "../context/AdminContext";

const Home = () => {
  const { student, courses, getAlldata, getAllCourses } = useAdminContext();

  useEffect(() => {
    getAlldata();  // Fetch students
    getAllCourses();  // Fetch courses
  }, [getAlldata, getAllCourses]);

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card
            icon={<PiGraduationCapLight size={35} />}
            content="Students"
            data={student ? student.length : 0}
            backgroundColor="#F0F9FF"
            linkTo="/students"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            icon={<BiMessage size={35} />}
            content="Course"
            data={courses ? courses.length : 0}
            iconColor="#EE95C5"
            backgroundColor="#FEF6FB"
            linkTo="/course"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            icon={<PiCurrencyCircleDollarThin size={35} />}
            content="Payments"
            data="556,000"
            iconColor="#F6C762"
            backgroundColor="#FEFBEC"
            linkTo="/payment"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            icon={<CiUser size={35} />}
            content="Users"
            data="3"
            iconColor="#FFFFFF"
            backgroundColor="#FEAF00"
            linkTo="/users"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
