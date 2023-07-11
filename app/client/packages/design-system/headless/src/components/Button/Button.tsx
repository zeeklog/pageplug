<<<<<<< HEAD
import React, { forwardRef } from "react";
import { useFocusableRef } from "@react-spectrum/utils";
import classNames from "classnames";
import { FocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { useButton } from "@react-aria/button";
import { useHover } from "@react-aria/interactions";
import type { RefObject } from "react";
=======
import type { RefObject } from "react";
import React, { forwardRef } from "react";
import { mergeProps } from "@react-aria/utils";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { useFocusableRef } from "@react-spectrum/utils";
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
import type { FocusableRef } from "@react-types/shared";
import type { ButtonProps as SpectrumButtonProps } from "@react-types/button";

export interface ButtonProps extends SpectrumButtonProps {
  className?: string;
}

export type ButtonRef = FocusableRef<HTMLElement>;

export const Button = forwardRef((props: ButtonProps, ref: ButtonRef) => {
  const { autoFocus, children, className, isDisabled } = props;
  const domRef = useFocusableRef(ref) as RefObject<HTMLButtonElement>;
  const { buttonProps, isPressed } = useButton(props, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled });
<<<<<<< HEAD

  return (
    <FocusRing autoFocus={autoFocus} focusRingClass="focus-ring">
      <button
        {...mergeProps(buttonProps, hoverProps)}
        className={classNames(className, {
          "is-disabled": isDisabled,
          "is-active": isPressed || isActive,
          "is-hovered": isHovered || isHover,
        })}
        ref={domRef}
      >
        {children}
      </button>
    </FocusRing>
=======
  const { focusProps, isFocusVisible } = useFocusRing({ autoFocus });

  return (
    <button
      {...mergeProps(buttonProps, hoverProps, focusProps)}
      className={className}
      data-active={isPressed ? "" : undefined}
      data-disabled={isDisabled ? "" : undefined}
      data-focused={isFocusVisible ? "" : undefined}
      data-hovered={isHovered ? "" : undefined}
      ref={domRef}
    >
      {children}
    </button>
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  );
});
