import * as React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "../constants/WidgetConstants";
import RadioGroupComponent from "../editorComponents/RadioGroupComponent";
import { ActionPayload } from "../constants/ActionConstants";

class RadioGroupWidget extends BaseWidget<RadioGroupWidgetProps, WidgetState> {
  getPageView() {
    return (
      <RadioGroupComponent
        style={this.getPositionStyle()}
        widgetId={this.props.widgetId}
        key={this.props.widgetId}
        label={this.props.label}
        defaultOptionValue={this.props.defaultOptionValue}
        options={this.props.options}
      />
    );
  }

  getWidgetType(): WidgetType {
    return "RADIO_BUTTON_WIDGET";
  }
}

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupWidgetProps extends WidgetProps {
  label: string;
  options: RadioOption[];
  defaultOptionValue: string;
  onOptionSelected?: ActionPayload[];
}

export default RadioGroupWidget;
