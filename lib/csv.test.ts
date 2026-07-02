import { describe, expect, it } from "vitest";
import { escapeCsvCell, rowsToCsv } from "./csv";

describe("escapeCsvCell", () => {
  it("returns an empty string for null or undefined", () => {
    expect(escapeCsvCell(null)).toBe("");
    expect(escapeCsvCell(undefined)).toBe("");
  });

  it("returns plain numbers and strings unchanged", () => {
    expect(escapeCsvCell(42)).toBe("42");
    expect(escapeCsvCell("hello")).toBe("hello");
  });

  it("wraps values containing a comma in double quotes", () => {
    expect(escapeCsvCell("Paris, France")).toBe('"Paris, France"');
  });

  it("wraps values containing a newline in double quotes", () => {
    expect(escapeCsvCell("line1\nline2")).toBe('"line1\nline2"');
  });

  it("escapes double quotes by doubling them, and wraps the result", () => {
    expect(escapeCsvCell('He said "hi"')).toBe('"He said ""hi"""');
  });

  it("does not wrap a plain value with no special characters", () => {
    expect(escapeCsvCell("simple-value_123")).toBe("simple-value_123");
  });
});

describe("rowsToCsv", () => {
  const columns = [
    { key: "id", header: "ID" },
    { key: "label", header: "Label" },
  ];

  it("produces only the header row (with BOM) when there are no rows", () => {
    const csv = rowsToCsv([], columns);
    expect(csv).toBe("\uFEFFID,Label");
  });

  it("includes a UTF-8 BOM prefix for Excel compatibility", () => {
    const csv = rowsToCsv([{ id: "1", label: "Test" }], columns);
    expect(csv.startsWith("\uFEFF")).toBe(true);
  });

  it("renders one CSV line per row, in column order", () => {
    const rows = [
      { id: "1", label: "Créneau A" },
      { id: "2", label: "Créneau, avec virgule" },
    ];
    const csv = rowsToCsv(rows, columns);
    const lines = csv.replace("\uFEFF", "").split("\n");

    expect(lines).toEqual([
      "ID,Label",
      "1,Créneau A",
      '2,"Créneau, avec virgule"',
    ]);
  });

  it("renders missing keys as empty cells instead of throwing", () => {
    const csv = rowsToCsv([{ id: "1" }], columns);
    expect(csv.replace("\uFEFF", "")).toBe("ID,Label\n1,");
  });
});
