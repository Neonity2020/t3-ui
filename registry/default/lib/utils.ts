import { type CxOptions, cx } from "class-variance-authority";
import { extendTailwindMerge } from "tailwind-merge";

// Register the extra font sizes extracted from T3 Code's theme so tailwind-merge
// does not treat text-2xs etc. as colors.
const twMerge = extendTailwindMerge({
  extend: {
    theme: { text: ["2xs", "3xs", "4xs", "5xs"] },
  },
});

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs));
}
