import BaseWidget, { WidgetProps } from "widgets/BaseWidget";
import { WidgetTypes } from "constants/WidgetConstants";
import ContainerWidget, { ContainerWidgetProps } from "widgets/ContainerWidget";
import TextWidget, { TextWidgetProps } from "widgets/TextWidget";
import InputWidget, { InputWidgetProps } from "widgets/InputWidget";
import CheckboxWidget, { CheckboxWidgetProps } from "widgets/CheckboxWidget";
import RadioGroupWidget, {
  RadioGroupWidgetProps,
} from "widgets/RadioGroupWidget";
import WidgetFactory from "./WidgetFactory";
import React from "react";
import ButtonWidget, { ButtonWidgetProps } from "widgets/ButtonWidget";
import DropdownWidget, { DropdownWidgetProps } from "widgets/DropdownWidget";
import ImageWidget, { ImageWidgetProps } from "widgets/ImageWidget";
import TableWidget, { TableWidgetProps } from "widgets/TableWidget";
import TabsWidget, {
  TabsWidgetProps,
  TabContainerWidgetProps,
} from "widgets/TabsWidget";
import ModalWidget, { ModalWidgetProps } from "widgets/ModalWidget";
import RichTextEditorWidget, {
  RichTextEditorWidgetProps,
} from "widgets/RichTextEditorWidget";
import ChartWidget, { ChartWidgetProps } from "widgets/ChartWidget";
import MapWidget, { MapWidgetProps } from "widgets/MapWidget";

import FilePickerWidget, {
  FilePickerWidgetProps,
} from "widgets/FilepickerWidget";
import DatePickerWidget, {
  DatePickerWidgetProps,
} from "widgets/DatePickerWidget";
import FormWidget from "widgets/FormWidget";
import FormButtonWidget, {
  FormButtonWidgetProps,
} from "widgets/FormButtonWidget";
import IconWidget, { IconWidgetProps } from "widgets/IconWidget";

import CanvasWidget from "widgets/CanvasWidget";

class WidgetBuilderRegistry {
  static registerWidgetBuilders() {
    WidgetFactory.registerWidgetBuilder(
      "CONTAINER_WIDGET",
      {
        buildWidget(
          widgetData: ContainerWidgetProps<WidgetProps>,
        ): JSX.Element {
          return <ContainerWidget {...widgetData} />;
        },
      },
      ContainerWidget.getPropertyValidationMap(),
      ContainerWidget.getDerivedPropertiesMap(),
      ContainerWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "TEXT_WIDGET",
      {
        buildWidget(widgetData: TextWidgetProps): JSX.Element {
          return <TextWidget {...widgetData} />;
        },
      },
      TextWidget.getPropertyValidationMap(),
      TextWidget.getDerivedPropertiesMap(),
      TextWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "BUTTON_WIDGET",
      {
        buildWidget(widgetData: ButtonWidgetProps): JSX.Element {
          return <ButtonWidget {...widgetData} />;
        },
      },
      ButtonWidget.getPropertyValidationMap(),
      ButtonWidget.getDerivedPropertiesMap(),
      ButtonWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "INPUT_WIDGET",
      {
        buildWidget(widgetData: InputWidgetProps): JSX.Element {
          return <InputWidget {...widgetData} />;
        },
      },
      InputWidget.getPropertyValidationMap(),
      InputWidget.getDerivedPropertiesMap(),
      InputWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "CHECKBOX_WIDGET",
      {
        buildWidget(widgetData: CheckboxWidgetProps): JSX.Element {
          return <CheckboxWidget {...widgetData} />;
        },
      },
      CheckboxWidget.getPropertyValidationMap(),
      CheckboxWidget.getDerivedPropertiesMap(),
      CheckboxWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "DROP_DOWN_WIDGET",
      {
        buildWidget(widgetData: DropdownWidgetProps): JSX.Element {
          return <DropdownWidget {...widgetData} />;
        },
      },
      DropdownWidget.getPropertyValidationMap(),
      DropdownWidget.getDerivedPropertiesMap(),
      DropdownWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "RADIO_GROUP_WIDGET",
      {
        buildWidget(widgetData: RadioGroupWidgetProps): JSX.Element {
          return <RadioGroupWidget {...widgetData} />;
        },
      },
      RadioGroupWidget.getPropertyValidationMap(),
      RadioGroupWidget.getDerivedPropertiesMap(),
      RadioGroupWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "IMAGE_WIDGET",
      {
        buildWidget(widgetData: ImageWidgetProps): JSX.Element {
          return <ImageWidget {...widgetData} />;
        },
      },
      ImageWidget.getPropertyValidationMap(),
      ImageWidget.getDerivedPropertiesMap(),
      ImageWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "TABLE_WIDGET",
      {
        buildWidget(widgetData: TableWidgetProps): JSX.Element {
          return <TableWidget {...widgetData} />;
        },
      },
      TableWidget.getPropertyValidationMap(),
      TableWidget.getDerivedPropertiesMap(),
      TableWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "FILE_PICKER_WIDGET",
      {
        buildWidget(widgetData: FilePickerWidgetProps): JSX.Element {
          return <FilePickerWidget {...widgetData} />;
        },
      },
      FilePickerWidget.getPropertyValidationMap(),
      FilePickerWidget.getDerivedPropertiesMap(),
      FilePickerWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "DATE_PICKER_WIDGET",
      {
        buildWidget(widgetData: DatePickerWidgetProps): JSX.Element {
          return <DatePickerWidget {...widgetData} />;
        },
      },
      DatePickerWidget.getPropertyValidationMap(),
      DatePickerWidget.getDerivedPropertiesMap(),
      DatePickerWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "TABS_WIDGET",
      {
        buildWidget(
          widgetProps: TabsWidgetProps<TabContainerWidgetProps>,
        ): JSX.Element {
          return <TabsWidget {...widgetProps} />;
        },
      },
      TabsWidget.getPropertyValidationMap(),
      TabsWidget.getDerivedPropertiesMap(),
      TabsWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.MODAL_WIDGET,
      {
        buildWidget(widgetProps: ModalWidgetProps): JSX.Element {
          return <ModalWidget {...widgetProps} />;
        },
      },
      BaseWidget.getPropertyValidationMap(),
      BaseWidget.getDerivedPropertiesMap(),
      BaseWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "RICH_TEXT_EDITOR_WIDGET",
      {
        buildWidget(widgetData: RichTextEditorWidgetProps): JSX.Element {
          return <RichTextEditorWidget {...widgetData} />;
        },
      },
      RichTextEditorWidget.getPropertyValidationMap(),
      RichTextEditorWidget.getDerivedPropertiesMap(),
      RichTextEditorWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "CHART_WIDGET",
      {
        buildWidget(widgetData: ChartWidgetProps): JSX.Element {
          return <ChartWidget {...widgetData} />;
        },
      },
      ChartWidget.getPropertyValidationMap(),
      ChartWidget.getDerivedPropertiesMap(),
      ChartWidget.getTriggerPropertyMap(),
    );
    WidgetFactory.registerWidgetBuilder(
      "FORM_WIDGET",
      {
        buildWidget(
          widgetProps: ContainerWidgetProps<WidgetProps>,
        ): JSX.Element {
          return <FormWidget {...widgetProps} />;
        },
      },
      FormWidget.getPropertyValidationMap(),
      FormWidget.getDerivedPropertiesMap(),
      FormWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "FORM_BUTTON_WIDGET",
      {
        buildWidget(widgetProps: FormButtonWidgetProps): JSX.Element {
          return <FormButtonWidget {...widgetProps} />;
        },
      },
      FormButtonWidget.getPropertyValidationMap(),
      FormButtonWidget.getDerivedPropertiesMap(),
      FormButtonWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      "MAP_WIDGET",
      {
        buildWidget(widgetProps: MapWidgetProps): JSX.Element {
          return <MapWidget {...widgetProps} />;
        },
      },
      MapWidget.getPropertyValidationMap(),
      MapWidget.getDerivedPropertiesMap(),
      MapWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.CANVAS_WIDGET,
      {
        buildWidget(
          widgetData: ContainerWidgetProps<WidgetProps>,
        ): JSX.Element {
          return <CanvasWidget {...widgetData} />;
        },
      },
      CanvasWidget.getPropertyValidationMap(),
      CanvasWidget.getDerivedPropertiesMap(),
      CanvasWidget.getTriggerPropertyMap(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.ICON_WIDGET,
      {
        buildWidget(widgetProps: IconWidgetProps): JSX.Element {
          return <IconWidget {...widgetProps} />;
        },
      },
      IconWidget.getPropertyValidationMap(),
      IconWidget.getDerivedPropertiesMap(),
      IconWidget.getTriggerPropertyMap(),
    );
  }
}

export default WidgetBuilderRegistry;
