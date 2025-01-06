import { Search } from "@mui/icons-material";
import { AppBar, IconButton, InputBase, Toolbar, Tooltip } from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";
import { useAdminContext } from "../context/AdminContext";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const Header = () => {
  const { openSidebar, setopenSidebar } = useAdminContext();

  return (
    <AppBar
      sx={{
        position: "static",
        boxShadow: "none",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        {/* left side  */}
        <FlexBetween>
          <IconButton sx={{ color: "#C4C4C4" }}>
            {openSidebar ? (
              <Tooltip title="close the sidebar">
                <ArrowCircleLeftIcon
                  onClick={() => setopenSidebar((prev) => !prev)}
                />
              </Tooltip>
            ) : (
              <Tooltip title="open the sidebar">
                <ArrowCircleRightIcon
                  onClick={() => setopenSidebar((prev) => !prev)}
                />
              </Tooltip>
            )}
          </IconButton>
        </FlexBetween>

        <FlexBetween
          borderRadius="9px"
          background="#E5E5E5"
          p="0.1rem 1.5rem"
          border="1px solid #E5E5E5"
        >
          <InputBase
            sx={{
              borderRadius: "8px",
              color: "#C4C4C4",
              background: "#FFFFFF",
            }}
            placeholder="Search..."
          />
          <IconButton sx={{ color: "#C4C4C4" }}>
            <Search />
          </IconButton>
        </FlexBetween>
        {/* <IconButton onClick={()=>{handleMode()}} sx={{ color: "#C4C4C4" }}>
            <Notifications />
          </IconButton> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
