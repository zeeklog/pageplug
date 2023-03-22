import { ObjectsRegistry } from "../../../../../support/Objects/Registry";

let dataSet: any;
const agHelper = ObjectsRegistry.AggregateHelper,
  ee = ObjectsRegistry.EntityExplorer,
  propPane = ObjectsRegistry.PropertyPane,
  table = ObjectsRegistry.Table,
  deployMode = ObjectsRegistry.DeployMode;

describe("Verify various Table property bugs", function () {
  before(() => {
    cy.fixture("example").then(function (data: any) {
      dataSet = data;
    });
    cy.fixture("tablev1NewDsl").then((val: any) => {
      agHelper.AddDsl(val);
    });
  });

  it("1. Adding Data to Table Widget", function () {
    ee.SelectEntityByName("Table1", "Widgets");
    propPane.UpdatePropertyFieldValue(
      "Table Data",
      JSON.stringify(dataSet.TableURLColumnType),
    );
    agHelper.ValidateNetworkStatus("@updateLayout", 200);
    agHelper.PressEscape();
  });

  it("2. Bug 13299 - Verify Display Text does not contain garbage value for URL column type when empty", function () {
    ee.SelectEntityByName("Table1", "Widgets");
    table.ChangeColumnType("image", "URL");
    propPane.UpdatePropertyFieldValue(
      "Display Text",
      `{{currentRow.image.toString().includes('7') ? currentRow.image.toString().split('full/')[1] : "" }}`,
    );

    deployMode.DeployApp();

    //table.SelectTableRow(1)

    table.ReadTableRowColumnData(0, 0).then(($cellData) => {
      expect($cellData).to.eq("1376499.jpg");
    });

    table.ReadTableRowColumnData(1, 0).then(($cellData) => {
      expect($cellData).to.eq("https://wallpaperaccess.com/full/1688623.jpg");
    });

    table.ReadTableRowColumnData(2, 0).then(($cellData) => {
      expect($cellData).to.eq("2117775.jpg");
    });

    table.ReadTableRowColumnData(3, 0).then(($cellData) => {
      expect($cellData).to.eq("https://wallpaperaccess.com/full/812632.jpg");
    });

    table.AssertURLColumnNavigation(
      0,
      0,
      "https://wallpaperaccess.com/full/1376499.jpg",
    );
    table.AssertURLColumnNavigation(
      3,
      0,
      "https://wallpaperaccess.com/full/812632.jpg",
    );

    deployMode.NavigateBacktoEditor();
  });

  it("3. Bug 13299 - Verify Display Text does not contain garbage value for URL column type when null", function () {
    ee.SelectEntityByName("Table1", "Widgets");
    agHelper.GetNClick(table._columnSettings("image"));

    propPane.UpdatePropertyFieldValue(
      "Display Text",
      `{{currentRow.image.toString().includes('7') ? currentRow.image.toString().split('full/')[1] : null }}`,
    );

    deployMode.DeployApp();

    table.ReadTableRowColumnData(0, 0).then(($cellData) => {
      expect($cellData).to.eq("1376499.jpg");
    });

    table.ReadTableRowColumnData(1, 0).then(($cellData) => {
      expect($cellData).to.eq("https://wallpaperaccess.com/full/1688623.jpg");
    });

    table.ReadTableRowColumnData(2, 0).then(($cellData) => {
      expect($cellData).to.eq("2117775.jpg");
    });

    table.ReadTableRowColumnData(3, 0).then(($cellData) => {
      expect($cellData).to.eq("https://wallpaperaccess.com/full/812632.jpg");
    });

    table.AssertURLColumnNavigation(
      1,
      0,
      "https://wallpaperaccess.com/full/1688623.jpg",
    );
    table.AssertURLColumnNavigation(
      2,
      0,
      "https://wallpaperaccess.com/full/2117775.jpg",
    );

    deployMode.NavigateBacktoEditor();
  });

  it("4. Bug 13299 - Verify Display Text does not contain garbage value for URL column type when undefined", function () {
    ee.SelectEntityByName("Table1", "Widgets");
    agHelper.GetNClick(table._columnSettings("image"));

    propPane.UpdatePropertyFieldValue(
      "Display Text",
      `{{currentRow.image.toString().includes('7') ? currentRow.image.toString().split('full/')[1] : undefined }}`,
    );

    deployMode.DeployApp();

    table.ReadTableRowColumnData(0, 0).then(($cellData) => {
      expect($cellData).to.eq("1376499.jpg");
    });

    table.ReadTableRowColumnData(1, 0).then(($cellData) => {
      expect($cellData).to.eq("https://wallpaperaccess.com/full/1688623.jpg");
    });

    table.ReadTableRowColumnData(2, 0).then(($cellData) => {
      expect($cellData).to.eq("2117775.jpg");
    });

    table.ReadTableRowColumnData(3, 0).then(($cellData) => {
      expect($cellData).to.eq("https://wallpaperaccess.com/full/812632.jpg");
    });

    table.AssertURLColumnNavigation(
      0,
      0,
      "https://wallpaperaccess.com/full/1376499.jpg",
    );
    table.AssertURLColumnNavigation(
      3,
      0,
      "https://wallpaperaccess.com/full/812632.jpg",
    );

    deployMode.NavigateBacktoEditor();
  });

  it("should allow ISO 8601 format date and not throw a disallowed validation error", () => {
    ee.SelectEntityByName("Table1", "Widgets");
    propPane.UpdatePropertyFieldValue(
      "Table Data",
      '[{ "dateValue": "2023-02-02T13:39:38.367857Z" }]',
    );
    cy.wait(500);

    propPane.OpenTableColumnSettings("dateValue");
    // select date option from column type setting field
    cy.get(".t--property-control-columntype").click();
    cy.get('[data-cy="t--dropdown-option-Date"]').click();

    // select ISO 8601 date format
    cy.get(".t--property-control-originaldateformat").click();
    cy.contains("ISO 8601").click();

    cy.get(".t--property-control-originaldateformat")
      .find(".t--js-toggle")
      .click();
    // we should not see an error after ISO 8061 is selected
    cy.get(
      ".t--property-control-originaldateformat .t--codemirror-has-error",
    ).should("not.exist");
    //check the selected format value
    cy.get(".t--property-control-originaldateformat").contains(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );
    //give a corrupted date format

    propPane.UpdatePropertyFieldValue(
      "Original Date Format",
      "YYYY-MM-DDTHH:mm:ss.SSSsZ",
    );
    //we should now see an error with an incorrect date format
    cy.get(
      ".t--property-control-originaldateformat .t--codemirror-has-error",
    ).should("exist");
  });
});
