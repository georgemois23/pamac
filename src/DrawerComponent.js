import { Button, IconButton, Box, Typography, Link, Drawer } from "@mui/material";
import { LuInfo } from "react-icons/lu";
import { SlSocialLinkedin } from "react-icons/sl";
import { LiaGithub } from "react-icons/lia";
import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

function DrawerComponent() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const iconSize = useMediaQuery(theme.breakpoints.up("sm")) ? 40 : 25;
  const iconSize1 = useMediaQuery(theme.breakpoints.up("sm")) ? 50 : 35;

  return (
    <>
      {/* Icon button to trigger the drawer */}
      <IconButton
  aria-label="Info"
  onClick={() => setOpen(true)}
  sx={{
    position: "fixed",
    bottom: 0,
    right: 10,
    color: "primary.main !important",  // Ensures color remains visible
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1) !important",  // Hover background
      color: "primary.dark !important", // Hover color for contrast
    },
    "&:focus": { backgroundColor: "transparent !important" },
  }}
>
  <LuInfo />
</IconButton>


      {/* Drawer Component */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: "2rem" },
        }}
      >
        <Box textAlign="center" mt={2}>
          <Typography variant="h1" fontSize={{ xs: 50, sm: 70, md: 90, lg: 100 }}>
            PAMAC
          </Typography>
        </Box>

        <Box textAlign="center" mt={4}>
          <Typography fontSize={{ xs: 20, sm: 25, md: 30, lg: 35 }}>
            This site was created in React.js by Moysiadis George
          </Typography>

          <Typography fontSize={{ xs: 20, sm: 25, md: 30, lg: 35 }} fontWeight="bold" mt={4}>
            Social
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            border="2px solid"
            borderRadius="10px"
            mt={2}
            padding={2}
            width={{ xs: "80vw", sm: "60vw" }}
            mx="auto"
          >
            {/* LinkedIn Section */}
            <Box textAlign="center">
              <Typography fontSize={{ xs: 20, sm: 25, md: 30, lg: 35 }}>
                Visit my LinkedIn account
              </Typography>
              <Link href="https://www.linkedin.com/in/george-moysiadis/" target="_blank">
                <SlSocialLinkedin size={iconSize} />
              </Link>
            </Box>

            {/* GitHub Section */}
            <Box textAlign="center">
              <Typography fontSize={{ xs: 20, sm: 25, md: 30, lg: 35 }}>
                Visit my GitHub account
              </Typography>
              <Link href="https://github.com/georgemois23/" target="_blank">
                <LiaGithub size={iconSize1} />
              </Link>
            </Box>
          </Box>
        </Box>

        <Box textAlign="center" mt={4}>
          <Button variant="outlined" size="large" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
