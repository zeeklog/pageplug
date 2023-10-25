import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";
import type { SnipingModeProperty, PropertyUpdates } from "widgets/constants";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "输入框",
  iconSVG: IconSVG,
  searchTags: ["input"],
  needsMeta: true,
  hideCard: true,
  isDeprecated: true,
  replacement: "INPUT_WIDGET_V2",
  defaults: {
    inputType: "TEXT",
    rows: 4,
    label: "",
    labelPosition: LabelPosition.Left,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    columns: 20,
    widgetName: "Input",
    version: 1,
    defaultText: "",
    iconAlign: "left",
    autoFocus: false,
    labelStyle: "",
    resetOnSubmit: true,
    isRequired: false,
    isDisabled: false,
    allowCurrencyChange: false,
    animateLoading: false,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
    setterConfig: Widget.getSetterConfig(),
  },
  methods: {
    getSnipingModeUpdates: (
      propValueMap: SnipingModeProperty,
    ): PropertyUpdates[] => {
      return [
        {
          propertyPath: "defaultText",
          propertyValue: propValueMap.data,
          isDynamicPropertyPath: true,
        },
      ];
    },
  },
};

export default Widget;
