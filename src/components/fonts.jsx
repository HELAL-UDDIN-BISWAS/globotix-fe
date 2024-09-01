import { Hind, Leckerli_One, Montserrat } from "next/font/google";

const FontMontserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const FontHind = Hind({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

const FontLeckerli = Leckerli_One({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});
export { FontHind, FontMontserrat, FontLeckerli };
