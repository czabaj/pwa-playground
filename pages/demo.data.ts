import { Manifest } from "./demo.types";

export const manifest: Manifest = {
  name: `Example round`,
  points: [
    {
      // https://www.google.com/maps/place/Texas+MedClinic+Urgent+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x865b4cd39f7a07c9:0xa15deeaa90aea3a0!8m2!3d30.1543849!4d-97.7921189!15sCg5tZWRpY2FsIGNsaW5pY5IBDm1lZGljYWxfY2xpbmlj
      location: { latitude: 30.2185343, longitude: -97.8484321 },
    },
    //https://www.google.com/maps/place/CommUnityCare:+Hancock+Walk-In+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x8644ca100a302fd1:0xbd37f0344afa07bf!8m2!3d30.2999081!4d-97.7173376!15sCg5tZWRpY2FsIGNsaW5pY5IBDm1lZGljYWxfY2xpbmlj
    { location: { latitude: 30.2997453, longitude: -97.7173803 } },
    // https://www.google.com/maps/place/Texas+MedClinic+Urgent+Care/@30.2185343,-97.8484321,11.59z/data=!4m9!1m2!2m1!1smedical+clinic!3m5!1s0x8644cc2266be0e53:0xb75a816b09c1d902!8m2!3d30.4163734!4d-97.7046128!15sCg5tZWRpY2FsIGNsaW5pY1oQIg5tZWRpY2FsIGNsaW5pY5IBEnVyZ2VudF9jYXJlX2NlbnRlcpoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VOemFrNVRaVkJuRUFF
    { location: { latitude: 30.4163948, longitude: -97.7048319 } },
  ],
};
