import { Card, CardContent, Grid2, Typography } from '@mui/material'
import React from 'react'

const ReportCard = ({icon,statement,data}) => {
  return (
  <>
   <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item>
                 {icon}
                </Grid2>
                <Grid2 item xs>
                  <Typography variant="h6">{statement}</Typography>
                  <Typography variant="h4" color="text.secondary">
                   {data}
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
  </>
  )
}

export default ReportCard