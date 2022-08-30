import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import {
  InlineEditingSaveOptions,
  TableWidgetProps,
} from "widgets/TableWidgetV2/constants";
import {
  totalRecordsCountValidation,
  uniqueColumnNameValidation,
  updateColumnOrderHook,
  updateInlineEditingSaveOptionHook,
  updateInlineEditingOptionDropdownVisibilityHook,
} from "../propertyUtils";
import {
  createMessage,
  TABLE_WIDGET_TOTAL_RECORD_TOOLTIP,
} from "@appsmith/constants/messages";
import panelConfig from "./PanelConfig";
import { composePropertyUpdateHook } from "widgets/WidgetUtils";

export default {
  sectionName: "属性",
  children: [
    {
      helpText:
        "表格数组数据",
      propertyName: "tableData",
      label: "数据",
      controlType: "INPUT_TEXT",
      placeholderText: '[{ "name": "John" }]',
      inputType: "ARRAY",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.OBJECT_ARRAY,
        params: {
          default: [],
        },
      },
      evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
    },
    {
      helpText: "表格数据列定义",
      propertyName: "primaryColumns",
      controlType: "PRIMARY_COLUMNS_V2",
      label: "数据列",
      updateHook: composePropertyUpdateHook([
        updateColumnOrderHook,
        updateInlineEditingOptionDropdownVisibilityHook,
      ]),
      dependencies: [
        "columnOrder",
        "childStylesheet",
        "inlineEditingSaveOption",
        "textColor",
        "textSize",
        "fontStyle",
        "cellBackground",
        "verticalAlignment",
        "horizontalAlignment",
      ],
      isBindProperty: false,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fn: uniqueColumnNameValidation,
          expected: {
            type: "Unique Column Names",
            example: "abc",
            autocompleteDataType: AutocompleteDataType.STRING,
          },
        },
      },
      panelConfig,
    },
    {
      propertyName: "inlineEditingSaveOption",
      helpText: "Choose the save experience to save the edited cell",
      label: "Update Mode",
      controlType: "DROP_DOWN",
      isBindProperty: true,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps) => {
        return (
          !props.showInlineEditingOptionDropdown &&
          !Object.values(props.primaryColumns).find(
            (column) => column.isEditable,
          )
        );
      },
      dependencies: [
        "primaryColumns",
        "columnOrder",
        "childStylesheet",
        "showInlineEditingOptionDropdown",
      ],
      options: [
        {
          label: "Row level",
          value: InlineEditingSaveOptions.ROW_LEVEL,
        },
        {
          label: "Custom",
          value: InlineEditingSaveOptions.CUSTOM,
        },
      ],
      updateHook: updateInlineEditingSaveOptionHook,
    },
    {
      helpText:
        "Assigns a unique column which helps maintain selectedRows and triggeredRows based on value",
      propertyName: "primaryColumnId",
      dependencies: ["primaryColumns"],
      label: "Primary key column",
      controlType: "PRIMARY_COLUMNS_DROPDOWN",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.TEXT },
    },
    {
      propertyName: "defaultSearchText",
      label: "Default Search Text",
      controlType: "INPUT_TEXT",
      placeholderText: "{{appsmith.user.name}}",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.TEXT },
    },
    {
      helpText: "Selects row(s) by default",
      propertyName: "defaultSelectedRowIndices",
      label: "Default Selected Rows",
      controlType: "INPUT_TEXT",
      placeholderText: "[0]",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY,
        params: {
          children: {
            type: ValidationTypes.NUMBER,
            params: {
              min: -1,
              default: -1,
            },
          },
        },
      },
      hidden: (props: TableWidgetProps) => {
        return !props.multiRowSelection;
      },
      dependencies: ["multiRowSelection"],
    },
    {
      helpText: "Selects row by default",
      propertyName: "defaultSelectedRowIndex",
      label: "Default Selected Row",
      controlType: "INPUT_TEXT",
      placeholderText: "0",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.NUMBER,
        params: {
          min: -1,
          default: -1,
        },
      },
      hidden: (props: TableWidgetProps) => {
        return props.multiRowSelection;
      },
      dependencies: ["multiRowSelection"],
    },
    {
      propertyName: "compactMode",
      helpText: "Selects row height",
      label: "Default Row Height",
      controlType: "DROP_DOWN",
      defaultValue: "DEFAULT",
      isBindProperty: true,
      isTriggerProperty: false,
      options: [
        {
          label: "Short",
          value: "SHORT",
        },
        {
          label: "Default",
          value: "DEFAULT",
        },
        {
          label: "Tall",
          value: "TALL",
        },
      ],
    },
    {
      helpText:
        "Bind the Table.pageNo property in your API and call it onPageChange",
      propertyName: "serverSidePaginationEnabled",
      label: "服务端分页",
      controlType: "SWITCH",
      isBindProperty: false,
      isTriggerProperty: false,
    },
    {
      helpText: createMessage(TABLE_WIDGET_TOTAL_RECORD_TOOLTIP),
      propertyName: "totalRecordsCount",
      label: "Total Record Count",
      controlType: "INPUT_TEXT",
      placeholderText: "Enter total record count",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fn: totalRecordsCountValidation,
          expected: {
            type: "Number",
            example: "10",
            autocompleteDataType: AutocompleteDataType.STRING,
          },
        },
      },
      hidden: (props: TableWidgetProps) => !!!props.serverSidePaginationEnabled,
      dependencies: ["serverSidePaginationEnabled"],
    },
    {
      helpText: "控制组件的显示/隐藏",
      propertyName: "isVisible",
      isJSConvertible: true,
      label: "是否显示",
      controlType: "SWITCH",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.BOOLEAN,
      },
    },
    {
      propertyName: "animateLoading",
      label: "加载时显示动画",
      controlType: "SWITCH",
      helpText: "组件依赖的数据加载时显示加载动画",
      defaultValue: true,
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      helpText: "Controls sorting in View Mode",
      propertyName: "isSortable",
      isJSConvertible: true,
      label: "Sortable",
      controlType: "SWITCH",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.BOOLEAN,
        params: {
          default: true,
        },
      },
    },
    {
      propertyName: "multiRowSelection",
      label: "Enable multi row selection",
      controlType: "SWITCH",
      isBindProperty: false,
      isTriggerProperty: false,
    },
    {
      propertyName: "enableClientSideSearch",
      label: "Enable client side search",
      controlType: "SWITCH",
      isBindProperty: false,
      isTriggerProperty: false,
    },
  ],
};
