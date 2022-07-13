import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import ResolutionSelect from "./ResolutionSelect";

test("Renders 2 inputs for width and height after selecting 'custom' option", () => {
    const width = 800, height = 600;
    render(<ResolutionSelect resolution={{ width, height }} />);

    const currOption = screen.getByText(`${width} x ${height}`);
    // Couldn't find a better way to open the select
    fireEvent.focus(currOption);
    fireEvent.keyDown(currOption, { key: "ArrowDown" });

    const customOption = screen.getByText("Custom...");
    fireEvent.click(customOption);

    const widthInput = screen.getByDisplayValue(width) as HTMLInputElement;
    const heightInput = screen.getByDisplayValue(height) as HTMLInputElement;

    expect(widthInput.value).toEqual(`${width}`);
    expect(heightInput.value).toEqual(`${height}`);
});

test("Preselects 'Match display' option when resolution width is 0", () => {
    render(<ResolutionSelect resolution={{ width: 0, height: 600 }} />);
    expect(screen.queryByText("Match display")).not.toBeNull();
});

test("Preselects 'Match display' option when resolution height is 0", () => {
    render(<ResolutionSelect resolution={{ width: 800, height: 0 }} />);
    expect(screen.queryByText("Match display")).not.toBeNull();
});

test("Preselects 'Custom...' option when resolution is not common", () => {
    render(<ResolutionSelect resolution={{ width: 456, height: 567 }} />);
    expect(screen.queryByText("Custom...")).not.toBeNull();
});

test("Preselects new option when reference to resolution prop changes", () => {
    const { rerender } = render(<ResolutionSelect resolution={{ width: 800, height: 600 }} />);
    expect(screen.queryByText("1600 x 900")).toBeNull();
    rerender(<ResolutionSelect resolution={{ width: 1600, height: 900 }} />);
    expect(screen.queryByText("1600 x 900")).not.toBeNull();
});