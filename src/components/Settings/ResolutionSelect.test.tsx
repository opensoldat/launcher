import React from "react";
import { mount } from "enzyme";

import ResolutionSelect from "./ResolutionSelect";
import Select from "../Common/Select";
import IntegerInput from "../Common/IntegerInput";

test("Renders 2 IntegerInputs after selecting 'custom' option", () => {
    const wrapper = mount(
        <ResolutionSelect resolution={{ width: 800, height: 600 }} />
    )

    const select = wrapper.find(Select);

    select.simulate("focus");
    select.simulate("keyDown", { key: "ArrowDown", keyCode: 40, code: 40 });

    const customOption = wrapper.findWhere(x => {
        return x.children().length === 1 && x.children().html() === "Custom...";
    }).hostNodes();
    customOption.simulate("click");

    const integerInputs = wrapper.find(IntegerInput);
    expect(integerInputs.length).toEqual(2);

    const widthInput = integerInputs.find("input[name='resolution-width']").getDOMNode<HTMLInputElement>();
    expect(widthInput.value).toEqual("800");
    const heightInput = integerInputs.find("input[name='resolution-height']").getDOMNode<HTMLInputElement>();
    expect(heightInput.value).toEqual("600");
});

test("Preselects 'Match display' option when resolution width is 0", () => {
    const wrapper = mount(
        <ResolutionSelect resolution={{ width: 0, height: 600 }} />
    )
    // Make sure we rerender before making assertions on DOM.
    wrapper.update();
    expect(wrapper.text().includes("Match display")).toEqual(true);
});

test("Preselects 'Match display' option when resolution height is 0", () => {
    const wrapper = mount(
        <ResolutionSelect resolution={{ width: 800, height: 0 }} />
    )
    // Make sure we rerender before making assertions on DOM.
    wrapper.update();
    expect(wrapper.text().includes("Match display")).toEqual(true);
});

test("Preselects 'Custom...' option when resolution is not common", () => {
    const wrapper = mount(
        <ResolutionSelect resolution={{ width: 456, height: 567 }} />
    )
    // Make sure we rerender before making assertions on DOM.
    wrapper.update();
    expect(wrapper.text().includes("Custom...")).toEqual(true);
});

test("Preselects new option when reference to resolution prop changes", () => {
    const wrapper = mount(
        <ResolutionSelect resolution={{ width: 800, height: 600 }} />
    )

    wrapper.update();
    expect(wrapper.text().includes("1600 x 900")).toEqual(false);
    wrapper.setProps({
        resolution: {
            width: 1600,
            height: 900
        }
    });
    expect(wrapper.text().includes("1600 x 900")).toEqual(true);
});