import Box from "@mui/material/Box";
import MUISwipeableDrawer, {
  type SwipeableDrawerProps as MUISwipeableDrawerProps,
} from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import React from "react";

import { useToucheDevice } from "../hook/useTouchDevice";

const Puller = styled(Box)({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ":hover": {
    backgroundColor: grey[600],
  },
});

const StyledBox = styled(Box)({
  backgroundColor: "#fff",
});

export type SwipeableDrawerProps = Pick<
  MUISwipeableDrawerProps,
  `onClose` | `onOpen` | `open` | `style`
> & {
  children: React.ReactNode;
  drawerBleeding: number;
  heading: React.ReactNode;
};

export const SwipeableDrawer = (props: SwipeableDrawerProps) => {
  const { drawerBleeding } = props;
  const touchDevice = useToucheDevice();
  return (
    <MUISwipeableDrawer
      anchor="bottom"
      disableSwipeToOpen={false}
      elevation={1}
      onClose={props.onClose}
      onOpen={props.onOpen}
      open={props.open}
      style={props.style}
      swipeAreaWidth={drawerBleeding}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        style: {
          height: `calc(50% - ${drawerBleeding}px)`,
          overflow: "visible",
          ...(!touchDevice && {
            pointerEvents: `unset`,
          }),
        },
      }}
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
        <Puller onClick={props.open ? props.onClose : props.onOpen} />
        <Typography component="h2" sx={{ padding: 2, color: "text.secondary" }}>
          {props.heading}
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
        {props.children}
      </StyledBox>
    </MUISwipeableDrawer>
  );
};
