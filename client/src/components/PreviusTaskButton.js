import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const PreviousTaskButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 2 
      }}
    >
      <Button
        variant="contained"
        color="secondary"  // Gives the button a nice color
        onClick={handleBack}
        startIcon={<ArrowBack />} // Adds the icon to the left side
        sx={{
          padding: '10px 20px', // Adds extra padding for a larger button
          fontSize: '16px', // Makes the text a bit bigger
          borderRadius: '8px', // Adds rounded corners to the button
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Adds subtle shadow
          transition: 'all 0.3s ease', // Smooth transition effect
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', // Enhances shadow on hover
            backgroundColor: '#f50057', // Changes background color on hover
          },
        }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default PreviousTaskButton;
