import React from "react";
import ReactSelect, {Props as ReactSelectProps, StylesConfig, ThemeConfig } from "react-select";
import { SelectOption } from "src/types";

/* This is a wrapper for react-select. It provides styling compatible
 * with our app's design, at least in the context of forms. Styling
 * might not work for some fancy react-select's features, like multi-select,
 * but I didn't test those scenarios. So, keep that in mind if you decide
 * to reuse this component.
 * 
 * Also, if you want to use this component inside a parent that has
 * the "overflow" css property set to auto/scroll, you probably want to
 * pass menuPosition prop set to "fixed". This will make sure your
 * dropdown doesn't get hidden below parent's boundaries, and stays on top.
 * An alternative would be to pass menuPortalTarget prop (likely set to "document.body")
 * 
 * There is still a minor issue with select's menu not adjusting its
 * width on the fly when you resize window, but I think it's not critical:
 * it still gets resized as soon as you hover an option. Maybe forcing a
 * rerender on window's resize would do the trick.
 */

/* I was unhappy with the type of "value" prop that react-select expects (basically
 * you have to pass an object with "value" and "label" properties, but we only really
 * care about the value. Also, by default react-select doesn't seem to support
 * the classic "name" property, that is really helpful for identifying which
 * select changed inside a form. So, here is a custom wrapper for that.
 * Names of those props are not ideal, but that's because we can't override
 * ReactSelectProps' properties...
 * Doesn't support multi-selects as of now, would probably be best to allow
 * regular usage of react-select too for such scenarios, but it's not necessary yet.
 */
interface SelectProps extends ReactSelectProps {
    selectedValue: string;
    onSelectedChange: (newSelectedValue: string, fieldName: string) => void;
    options: SelectOption[];

    name?: string;
}

const Select: React.FC<SelectProps> = props => {
    const customStyles: StylesConfig<SelectOption, boolean> = {
        container: (defaultStyles) => ({
            ...defaultStyles,
            width: "100%"
        }),
        control: (defaultStyles) => ({
            ...defaultStyles,
            boxShadow: "none",
            minHeight: "2rem",
            height: "2rem",
            fontSize: "1em",
            // For some reason, all transitions are set to 100ms by default,
            // which leads to laggy behavior when setting visibility to hidden...
            // The lag was noticeable with select fields inside tooltips.
            transition: "visibility 0s"
        }),
        indicatorsContainer: (defaultStyles) => ({
            ...defaultStyles,
            height: "2rem"
        }),
        indicatorSeparator: () => ({
            display: "none"
        }),
        input: (defaultStyles) => ({
            ...defaultStyles,
            padding: 0,
            margin: 0
        }),
        menu: (defaultStyles) => ({
            ...defaultStyles,
            fontSize: "1em",
            marginTop: 0,
            marginBottom: 0
        }),
        menuList: (defaultStyles) => ({
            ...defaultStyles,
            paddingTop: 0,
            paddingBottom: 0
        }),
        option: (defaultStyles) => ({
            ...defaultStyles,
            color: "black",
            fontSize: "1em"
        }),
        singleValue: (defaultStyles) => ({
            ...defaultStyles,
            height: "100%",
            lineHeight: "2rem",
            textAlign: "center",
            verticalAlign: "middle"
        }),
        valueContainer: (defaultStyles) => ({
            ...defaultStyles,
            height: "2rem",
            padding: "0px 4px",
            justifyContent: "center"
        })
    };

    const customTheme: ThemeConfig = (defaultTheme) => ({
        ...defaultTheme,
        borderRadius: 0,
        // See https://github.com/JedWatson/react-select/issues/3692#issuecomment-523425096
        // for a somewhat decent explanation of what the colors mean...
        colors: {
            ...defaultTheme.colors,
            primary: "#d4d4d4",
            primary25: "#e8e8e8",
            primary50: "#bdbdbd",
            neutral20: "#cccccc",
            neutral30: "#b3b3b3"
        }
    })

    const getSelectedOption = (selectedValue: string): SelectOption => {
        return props.options.find(option => option.value === selectedValue);
    }

    const handleChange = (option: SelectOption): void => {
        props.onSelectedChange(option.value, props.name);
    }

    return (
        <ReactSelect
            options={props.options}
            value={getSelectedOption(props.selectedValue)}
            onChange={handleChange}

            styles={customStyles}
            theme={customTheme}
                        
            isSearchable={props.isSearchable || false}
            {...props} />
    )
}

export default Select;