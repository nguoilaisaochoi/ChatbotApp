import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
const Logo = (props) => (
  <Svg
    width={262}
    height={262}
    viewBox="0 0 262 262"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={262} height={262} fill="url(#pattern0_1_4)" />
    <Defs>
      <Pattern id="pattern0_1_4" patternContentUnits="objectBoundingBox" width={1} height={1}>
        <Use xlinkHref="#image0_1_4" transform="scale(0.00381679)" />
      </Pattern>
      <Image
        id="image0_1_4"
        width={262}
        height={262}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default Logo;
