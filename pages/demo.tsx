import { Global } from "@emotion/react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer, { type DrawerProps } from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import ListIcon from "@mui/icons-material/List";
import MenuIcon from "@mui/icons-material/Menu";
import PlaceIcon from "@mui/icons-material/Place";
import React from "react";

import {
  Map,
  Marker,
  geoPositionToLatLng,
  latLngsToBounds,
} from "../components/GoogleMap";
import { SwipeableDrawer } from "../components/SwipeableDrawer";
import { useHashParam } from "../hook/useHashParam";
import classes from "./demo.module.scss";
import { Manifest } from "./demo.types";

const manifest: Manifest = {
  name: `Example round`,
  points: [
    {
      // https://www.google.com/maps/place/Texas+MedClinic+Urgent+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x865b4cd39f7a07c9:0xa15deeaa90aea3a0!8m2!3d30.1543849!4d-97.7921189!15sCg5tZWRpY2FsIGNsaW5pY5IBDm1lZGljYWxfY2xpbmlj
      address: `9900 S I-35 Frontage Rd, Austin, TX 78748, United States`,
      location: { latitude: 30.154404231387915, longitude: -97.7921276235864 },
      name: `Texas MedClinic Urgent Care`,
    },
    // https://www.google.com/maps/place/CommUnityCare:+Hancock+Walk-In+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x8644ca100a302fd1:0xbd37f0344afa07bf!8m2!3d30.2999081!4d-97.7173376!15sCg5tZWRpY2FsIGNsaW5pY5IBDm1lZGljYWxfY2xpbmlj
    {
      address: `1000 E 41st St Ste 925, Austin, TX 78751, United States`,
      location: { latitude: 30.300015906935606, longitude: -97.71746991416332 },
      name: `CommUnityCare: Hancock Walk-In Care`,
    },
    // https://www.google.com/maps/place/Thrive+Medical+Clinic/@30.3159419,-97.774961,12z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x8644cdede707bcaf:0x97709b8943e460b9!8m2!3d30.4079023!4d-97.7039959!15sCg5tZWRpY2FsIGNsaW5pY5IBGWZhbWlseV9wcmFjdGljZV9waHlzaWNpYW4
    {
      address: `2217 Park Bend Dr Suite #210, Austin, TX 78758, United States`,

      location: { latitude: 30.411805655976455, longitude: -97.70530677228606 },
      name: `Thrive Medical Clinic`,
    },
  ],
};

const manifestLatLng = manifest.points.map(({ location }) =>
  geoPositionToLatLng({ coords: location as any })
);

type NavDrawerProps = Pick<DrawerProps, `onClose` | `open`>;

const NavDrawer = (props: NavDrawerProps) => {
  return (
    <Drawer anchor="left" open={props.open} onClose={props.onClose}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href={`#`}
            onClick={props.onClose as any}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>
        </ListItem>
        <Divider />
        {manifest.points.map(({ address, name }, index) => (
          <ListItem key={address} disablePadding>
            <ListItemButton
              component="a"
              href={`#${index}`}
              onClick={props.onClose as any}
            >
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

const drawerBleeding = 56;

const Demo = () => {
  const hashParam = useHashParam();
  const selectedPoint = manifest.points[hashParam as any];
  const [swipeableDrawerOpen, setSwipeableDrawerOpen] = React.useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = React.useState(false);
  return (
    <div className={classes.root}>
      <NavDrawer open={navDrawerOpen} onClose={() => setNavDrawerOpen(false)} />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            aria-label="menu"
            color="inherit"
            edge="start"
            onClick={() => setNavDrawerOpen(true)}
            size="large"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {manifest.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Map
        className={classes.map}
        bounds={selectedPoint ? undefined : latLngsToBounds(manifestLatLng)}
        center={!selectedPoint ? undefined : manifestLatLng[hashParam as any]}
        zoom={17}
      >
        {manifestLatLng.map((pointPosition, idx) => (
          <Marker key={idx} position={pointPosition} />
        ))}
      </Map>
      {selectedPoint && (
        <SwipeableDrawer
          drawerBleeding={drawerBleeding}
          heading={selectedPoint.name}
          open={swipeableDrawerOpen}
          onClose={() => setSwipeableDrawerOpen(false)}
          onOpen={() => setSwipeableDrawerOpen(true)}
        >
          <Skeleton variant="rectangular" height="100%" />
        </SwipeableDrawer>
      )}
    </div>
  );
};

export default Demo;
