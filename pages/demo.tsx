import { Global } from "@emotion/react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import negate from "lodash/negate";
import React from "react";

import { useToucheDevice } from "../hook/useTouchDevice";

import classes from "./demo.module.scss";
import { manifest } from "./demo.data";

const toggle = negate(Boolean);

const drawerBleeding = 56;

const manifestLatLng = manifest.points.map(({ location }) =>
  geoPositionToLatLng({ coords: location as any })
);

import {
  Map,
  Marker,
  geoPositionToLatLng,
  latLngsToBounds,
} from "../components/GoogleMap";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ":hover": {
    backgroundColor: grey[600],
  },
}));

const Demo = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const touchDevice = useToucheDevice();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Medical Courier
          </Typography>
        </Toolbar>
      </AppBar>
      <Map
        className={classes.map}
        bounds={latLngsToBounds(manifestLatLng)}
        zoom={17}
      >
        {manifestLatLng.map((pointPosition, idx) => (
          <Marker key={idx} position={pointPosition} />
        ))}
      </Map>
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={
          touchDevice
            ? undefined
            : {
                style: { pointerEvents: `unset`, userSelect: `none` },
              }
        }
        hideBackdrop={true}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller onClick={() => setDrawerOpen(toggle)} />
          <Typography
            component="h2"
            sx={{ padding: 2, color: "text.secondary" }}
          >
            Manifest
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Skeleton variant="rectangular" height="100%" />
        </StyledBox>
      </SwipeableDrawer>
    </div>
  );
};

export default Demo;
