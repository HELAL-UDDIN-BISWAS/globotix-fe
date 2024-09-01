import * as React from "react";

import { cn } from "@/utils/cn";
import { Text as RText } from "@radix-ui/themes";

const Text = React.forwardRef(function Text(
  { children, as, className, dangerouslySetInnerHTML, size, ...rest },
  ref
) {
  const textProps = {
    ref: ref,
    as: as || "p",
    className: cn(className, "font-rethinks"),
    size: size || "2",
    ...rest,
  };

  if (children) {
    return /*#__PURE__*/ React.createElement(RText, textProps, children);
  } else if (dangerouslySetInnerHTML) {
    return /*#__PURE__*/ React.createElement(RText, {
      ...textProps,
      dangerouslySetInnerHTML: dangerouslySetInnerHTML,
    });
  } else {
    return /*#__PURE__*/ React.createElement(RText, textProps);
  }
});

Text.displayName = "Text";

export { Text };
