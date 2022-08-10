import AppBar from "@mui/material/AppBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Drawer, { type DrawerProps } from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListIcon from "@mui/icons-material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PlaceIcon from "@mui/icons-material/Place";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

import {
  GoogleMap,
  Marker,
  geoPositionToLatLng,
  latLngsToBounds,
} from "../components/GoogleMap";
import { SwipeableDrawer } from "../components/SwipeableDrawer";
import {
  useBarcodeDetectorAPI,
  useBarcodeDetect,
} from "../hook/useBarcodeDetectorAPI";
import { useHashParam } from "../hook/useHashParam";
import {
  notificationsDeniedAlert,
  useNotifications,
} from "../hook/useNotifications";
import { useVideoStream, VideoStream } from "../hook/useVideoStream";
import { BarcodeDetectorAPI } from "../types/BarcodeDetectorAPI";
import classes from "./demo.module.scss";
import { Manifest, Sample } from "./demo.types";

let uid = 1;
const getUID = () => `${uid++}`;

const manifest: Manifest = {
  name: `Driver's manifest`,
  points: [
    {
      // https://www.google.com/maps/place/Texas+MedClinic+Urgent+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x865b4cd39f7a07c9:0xa15deeaa90aea3a0!8m2!3d30.1543849!4d-97.7921189!15sCg5tZWRpY2FsIGNsaW5pY5IBDm1lZGljYWxfY2xpbmlj
      address: `9900 S I-35 Frontage Rd, Austin, TX 78748, United States`,
      location: { latitude: 30.154404231387915, longitude: -97.7921276235864 },
      name: `Texas MedClinic Urgent Care`,
      itemsTake: [
        { id: getUID(), name: `Sample 1` },
        {
          id: getUID(),
          name: `Sample 2`,
        },
      ],
    },
    // https://www.google.com/maps/place/CommUnityCare:+Hancock+Walk-In+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x8644ca100a302fd1:0xbd37f0344afa07bf!8m2!3d30.2999081!4d-97.7173376!15sCg5tZWRpY2FsIGNsaW5pY5IBDm1lZGljYWxfY2xpbmlj
    {
      address: `1000 E 41st St Ste 925, Austin, TX 78751, United States`,
      location: { latitude: 30.300015906935606, longitude: -97.71746991416332 },
      name: `CommUnityCare: Hancock Walk-In Care`,
      itemsTake: [{ id: getUID(), name: `Sample 3` }],
    },
    // https://www.google.com/maps/place/Thrive+Medical+Clinic/@30.3159419,-97.774961,12z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x8644cdede707bcaf:0x97709b8943e460b9!8m2!3d30.4079023!4d-97.7039959!15sCg5tZWRpY2FsIGNsaW5pY5IBGWZhbWlseV9wcmFjdGljZV9waHlzaWNpYW4
    {
      address: `2217 Park Bend Dr Suite #210, Austin, TX 78758, United States`,
      location: { latitude: 30.411805655976455, longitude: -97.70530677228606 },
      name: `Thrive Medical Clinic`,
      itemsGive: [{ id: getUID(), name: `Sample 4` }],
    },
  ],
};

const manifestLatLng = manifest.points.map(({ location }) =>
  geoPositionToLatLng({ coords: location as any })
);

const addLat = (latLng: google.maps.LatLngLiteral, n: number) => ({
  ...latLng,
  lat: latLng.lat + n,
});

type NavDrawerProps = Pick<DrawerProps, `onClose` | `open`>;

const NavDrawer = (props: NavDrawerProps) => {
  const notifications = useNotifications();
  const onNotificationClick =
    notifications.permission === `default`
      ? () =>
          notifications.requestPermission!().then(
            notifications.sendPersistentNotification,
            notificationsDeniedAlert
          )
      : notifications.permission === `denied`
      ? notificationsDeniedAlert
      : notifications.sendPersistentNotification;
  return (
    <Drawer anchor="left" open={props.open} onClose={props.onClose}>
      <Toolbar>
        <IconButton
          aria-label="menu"
          color="inherit"
          edge="start"
          onClick={props.onClose as any}
          size="large"
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {manifest.name}
        </Typography>
      </Toolbar>
      <Divider />
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
        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            disabled={notifications.permission === `unsupported`}
            onClick={onNotificationClick}
          >
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <ListItemText
              primary="Send Notification"
              secondary={
                notifications.permission === `unsupported`
                  ? `The Notification API is not supported in this browser`
                  : notifications.permission === `default`
                  ? `You will be prompted for notification permissions`
                  : notifications.permission === `denied`
                  ? `The notifications are denied ☹️`
                  : `A notification will be dispatched`
              }
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton href="/">
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText
              primary="PWA Documentation"
              secondary="Leaves this demo app"
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

const ProofOfPickupDialog = (props: {
  barcodeDetectorAPI: BarcodeDetectorAPI;
  onDismiss: () => void;
  onScan: (barcodeData: string) => void;
  sample?: Sample;
  videoStream: VideoStream;
}) => {
  const { barcodeDetect, barcodeDetectResult } = useBarcodeDetect(
    props.barcodeDetectorAPI
  );
  const firstDetectedBarcode: string | undefined =
    barcodeDetectResult && `detectedBarcodes` in barcodeDetectResult
      ? barcodeDetectResult.detectedBarcodes[0]?.rawValue
      : undefined;
  const { videoEl, videoRef, videoState } = props.videoStream;
  React.useEffect(() => {
    if (props.sample && videoState === `OK` && videoRef.current) {
      const intervalId = window.setInterval(() => {
        barcodeDetect(videoRef.current!);
      }, 200);
      return () => window.clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoState]);

  return (
    <Dialog
      keepMounted={true}
      onClose={props.onDismiss}
      open={Boolean(props.sample)}
    >
      <DialogTitle>Scan barcode of {props.sample?.name}</DialogTitle>
      <DialogContent className={classes.proofOfPickupContent}>
        {videoEl}
        <div
          data-detected={Boolean(firstDetectedBarcode)}
          className={classes.detectedBarcode}
        >
          {firstDetectedBarcode || `None detected`}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onDismiss}>Close</Button>
        <Button
          disabled={!firstDetectedBarcode}
          onClick={() => props.onScan(firstDetectedBarcode!)}
        >
          Scan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const proofOfPickups = new Map<string, string>();

const PickupSampleList = (props: { items: Sample[] }) => {
  const barcodeDetectorAPI = useBarcodeDetectorAPI();
  const videoStream = useVideoStream(
    Math.min(
      320,
      typeof window === `undefined`
        ? Number.POSITIVE_INFINITY
        : Math.trunc(window.innerWidth * 0.7)
    ),
    `environment`
  );
  const [pickupSample, setPickupSample] = React.useState<Sample>();
  const clearPickupSample = () => {
    videoStream.pauseVideo();
    setPickupSample(undefined);
  };

  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        subheader={
          <ListSubheader component="div">Pickup Samples</ListSubheader>
        }
      >
        {props.items.map((sample) => {
          return (
            <React.Fragment key={sample.id}>
              <List component="div" disablePadding>
                {proofOfPickups.has(sample.id) ? (
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <CheckBoxIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={sample.name}
                      secondary={`Obtained, barcode: ${proofOfPickups.get(
                        sample.id
                      )}`}
                    />
                  </ListItem>
                ) : (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => {
                      videoStream.startVideo();
                      setPickupSample(sample);
                    }}
                  >
                    <ListItemIcon>
                      <CheckBoxOutlineBlankIcon />
                    </ListItemIcon>
                    <ListItemText primary={sample.name} />
                  </ListItemButton>
                )}
              </List>
            </React.Fragment>
          );
        })}
      </List>
      {barcodeDetectorAPI &&
        (`error` in barcodeDetectorAPI ? (
          <Dialog open={Boolean(pickupSample)} onClose={clearPickupSample}>
            <DialogTitle>
              The Barcode scanning is not supported in this browser
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To proof pickup, we need to scan a barcode. This feature is not
                supported in this browser. You might test other web browser.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={clearPickupSample}>Close</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <ProofOfPickupDialog
            barcodeDetectorAPI={barcodeDetectorAPI}
            onDismiss={clearPickupSample}
            onScan={(barcode) => {
              proofOfPickups.set(pickupSample!.id, barcode);
              clearPickupSample();
            }}
            sample={pickupSample}
            videoStream={videoStream}
          />
        ))}
    </>
  );
};

const proofOfDeliveries = new Map<string, string>();

const DeliverSampleList = (props: { items: Sample[] }) => {
  const [deliverSample, setDeliverSample] = React.useState<Sample>();
  const clearDeliverSample = () => {
    setDeliverSample(undefined);
  };

  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        subheader={
          <ListSubheader component="div">Deliver Samples</ListSubheader>
        }
      >
        {props.items.map((sample) => {
          return (
            <React.Fragment key={sample.id}>
              <List component="div" disablePadding>
                {proofOfDeliveries.has(sample.id) ? (
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <CheckBoxIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={sample.name}
                      secondary={`Accepted by: ${proofOfDeliveries.get(
                        sample.id
                      )}`}
                    />
                  </ListItem>
                ) : (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => {
                      setDeliverSample(sample);
                    }}
                  >
                    <ListItemIcon>
                      <CheckBoxOutlineBlankIcon />
                    </ListItemIcon>
                    <ListItemText primary={sample.name} />
                  </ListItemButton>
                )}
              </List>
            </React.Fragment>
          );
        })}
      </List>
      {deliverSample && (
        <Dialog open={true} onClose={clearDeliverSample}>
          <DialogTitle>Deliver {deliverSample.name}</DialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const acceptedBy: string = (
                (event.target as HTMLFormElement).elements[
                  `acceptedBy` as any
                ] as HTMLInputElement
              ).value;
              proofOfDeliveries.set(deliverSample.id, acceptedBy);
              clearDeliverSample();
            }}
          >
            <DialogContent>
              <DialogContentText>
                <TextField
                  label="Name of recipient"
                  name="acceptedBy"
                  required
                  variant="standard"
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={clearDeliverSample}>Close</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
};

const DRAWER_BLEEDING = 56;

const Demo = () => {
  const hashParam = useHashParam();
  const selectedPoint = manifest.points[hashParam as any];
  const [swipeableDrawerOpen, setSwipeableDrawerOpen] = React.useState(false);
  React.useEffect(() => {
    setSwipeableDrawerOpen(Boolean(selectedPoint));
  }, [selectedPoint]);
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
      <GoogleMap
        className={classes.map}
        zoom={17}
        {...(hashParam
          ? {
              // shift the center slightly up to prevent overlay of the point by
              // SwipeableDrawer - poor hack, do not use in production ;)
              center: addLat(
                manifestLatLng[hashParam as any],
                swipeableDrawerOpen ? -0.0015 : 0
              ),
            }
          : { bounds: latLngsToBounds(manifestLatLng) })}
      >
        {manifestLatLng.map((pointPosition, idx) => (
          <Marker key={idx} position={pointPosition} />
        ))}
      </GoogleMap>
      {selectedPoint && (
        <SwipeableDrawer
          drawerBleeding={DRAWER_BLEEDING}
          heading={selectedPoint.name}
          open={swipeableDrawerOpen}
          onClose={() => setSwipeableDrawerOpen(false)}
          onOpen={() => setSwipeableDrawerOpen(true)}
        >
          {selectedPoint.itemsTake && (
            <PickupSampleList items={selectedPoint.itemsTake} />
          )}
          {selectedPoint.itemsGive && (
            <DeliverSampleList items={selectedPoint.itemsGive} />
          )}
        </SwipeableDrawer>
      )}
    </div>
  );
};

export default Demo;
