import type { RefObject } from "react";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import type { TextInputProps } from "design-system-old";
import { Button, InputWrapper } from "design-system-old";
import { Input, Icon } from "design-system";

import type { ContainerOrientation } from "constants/WidgetConstants";
import { Colors } from "constants/Colors";
import { ControlIcons } from "icons/ControlIcons";
import { FormIcons } from "icons/FormIcons";
import useInteractionAnalyticsEvent from "utils/hooks/useInteractionAnalyticsEvent";

type ControlWrapperProps = {
  orientation?: ContainerOrientation;
  isAction?: boolean;
};

export const ControlWrapper = styled.div<ControlWrapperProps>`
  display: ${(props) =>
    props.orientation === "HORIZONTAL" ? "flex" : "block"};
  justify-content: space-between;
  align-items: center;
  flex-direction: ${(props) =>
    props.orientation === "VERTICAL" ? "column" : "row"};
  padding-top: 4px;
  &:not(:last-of-type) {
    padding-bottom: 4px;
  }
  & > label {
    margin-bottom: ${(props) => props.theme.spaces[1]}px;
  }
  &&& > label:first-of-type {
    display: block;
  }
  &&& > label {
    display: inline-block;
  }
  &:focus-within .reset-button {
    display: block;
  }
`;

export const StyledDynamicInput = styled.div`
  width: 100%;
  &&& {
    input {
      border: none;
      color: ${(props) => props.theme.colors.textOnDarkBG};
      background: ${(props) => props.theme.colors.paneInputBG};
      &:focus {
        border: none;
        color: ${(props) => props.theme.colors.textOnDarkBG};
        background: ${(props) => props.theme.colors.paneInputBG};
      }
    }
  }
`;

export const FieldWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledIcon = styled(Icon)`
  padding: 0;
  position: absolute;
  margin-right: 15px;
  cursor: move;
  z-index: 1;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
`;

/* Used in Draggable List Card component in Property pane */
export const StyledActionContainer = styled.div`
  position: absolute;
  right: 0px;
  margin-right: 10px;
  display: flex;
`;

export const StyledNavigateToFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: auto;
`;

export const StyledDividerContainer = styled.div`
  width: 1%;
  margin-top: 9px;
`;

export const StyledNavigateToFieldsContainer = styled.div`
  width: 95%;
`;

const StyledInputWrapper = styled.div`
  width: 100%;

  &:focus ${InputWrapper} {
    border: 1px solid var(--appsmith-input-focus-border-color);
  }
`;

const CommonIconStyles = css`
  padding: 0;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const InputGroup = React.forwardRef((props: TextInputProps, ref) => {
  let inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLInputElement>(null);
  const { dispatchInteractionAnalyticsEvent } =
    useInteractionAnalyticsEvent<HTMLInputElement>(false, wrapperRef);

  if (ref) inputRef = ref as React.RefObject<HTMLInputElement>;

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        if (document.activeElement === wrapperRef?.current) {
          dispatchInteractionAnalyticsEvent({ key: e.key });
          inputRef?.current?.focus();
          e.preventDefault();
        }
        break;
      case "Escape":
        if (document.activeElement === inputRef?.current) {
          dispatchInteractionAnalyticsEvent({ key: e.key });
          wrapperRef?.current?.focus();
          e.preventDefault();
        }
        break;
      case "Tab":
        if (document.activeElement === wrapperRef?.current) {
          dispatchInteractionAnalyticsEvent({
            key: `${e.shiftKey ? "Shift+" : ""}${e.key}`,
          });
        }
        break;
    }
  };

  return (
    <div className="w-full" ref={wrapperRef} tabIndex={0}>
      <Input ref={inputRef} {...props} size="md" tabIndex={-1} />
    </div>
  );
});

export const StyledInputGroup = React.forwardRef(
  (props: TextInputProps, ref) => {
    let inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLInputElement>(null);
    const { dispatchInteractionAnalyticsEvent } =
      useInteractionAnalyticsEvent<HTMLInputElement>(false, wrapperRef);

    if (ref) inputRef = ref as RefObject<HTMLInputElement>;

    useEffect(() => {
      window.addEventListener("keydown", handleKeydown);
      return () => {
        window.removeEventListener("keydown", handleKeydown);
      };
    }, []);

    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          if (document.activeElement === wrapperRef?.current) {
            dispatchInteractionAnalyticsEvent({ key: e.key });
            inputRef?.current?.focus();
            e.preventDefault();
          }
          break;
        case "Escape":
          if (document.activeElement === inputRef?.current) {
            dispatchInteractionAnalyticsEvent({ key: e.key });
            wrapperRef?.current?.focus();
            e.preventDefault();
          }
          break;
        case "Tab":
          if (document.activeElement === wrapperRef?.current) {
            dispatchInteractionAnalyticsEvent({
              key: `${e.shiftKey ? "Shift+" : ""}${e.key}`,
            });
          }
          break;
      }
    };

    return (
      <StyledInputWrapper ref={wrapperRef} tabIndex={0}>
        <InputGroup ref={inputRef} {...props} tabIndex={-1} width="auto" />
      </StyledInputWrapper>
    );
  },
);

StyledInputGroup.displayName = "StyledInputGroup";

export const StyledPropertyPaneButton = styled(Button)`
  margin-top: 4px;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;

  &&& svg {
    width: 14px;
    height: 14px;
    path {
      fill: ${Colors.GREY_8};
      stroke: ${Colors.GREY_8};
    }
  }
`;

export const StyledDragIcon = styled(ControlIcons.DRAG_CONTROL)`
  padding: 0;
  position: absolute;
  margin-right: 15px;
  cursor: move;
  z-index: 1;
  left: 4px;
  && svg {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    path {
      fill: ${(props) => props.theme.colors.propertyPane.iconColor};
    }
  }
`;

export const StyledDeleteIcon = styled(FormIcons.DELETE_ICON)`
  ${CommonIconStyles}

  && svg {
    width: 16px;
    height: 16px;
    position: relative;
    path {
      fill: ${(props) => props.theme.colors.propertyPane.iconColor};
    }
  }
`;

export const StyledEditIcon = styled(ControlIcons.SETTINGS_CONTROL)`
  ${CommonIconStyles}

  && svg {
    width: 16px;
    height: 16px;
    position: relative;
    path {
      fill: ${(props) => props.theme.colors.propertyPane.iconColor};
    }
  }
`;
