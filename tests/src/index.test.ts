import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { WarehouseCLI } from "../../src/cli/WarehouseCLI";

describe("WarehouseCLI", () => {
  let cli: WarehouseCLI;

  beforeEach(() => {
    cli = new WarehouseCLI();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("viewInventory logs inventory stock levels", () => {
    cli.viewInventory();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Inventory Stock Levels")
    );
  });

  it("viewSuppliers logs supplier info", () => {
    cli.viewSuppliers();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Suppliers")
    );
  });
});
