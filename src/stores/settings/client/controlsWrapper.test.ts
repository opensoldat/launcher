import { CommonGameCommands, KeyBinding } from "src/types";
import ControlsWrapperStore from "./controlsWrapper"

test("Clears out all duplicate keys when setting new key", () => {
    const controlsWrapper = new ControlsWrapperStore();
    controlsWrapper.restoreDefaults();

    const newKey = "CTRL+X";
    controlsWrapper.controlsSettings.bindings.push(
        {
            id: "test",
            command: CommonGameCommands.DropWeapon,
            key: newKey
        },
        {
            id: "test2",
            command: CommonGameCommands.Fire,
            key: newKey
        }
    );
    controlsWrapper.customBindings.bindings.push(
        {
            id: "test3",
            command: "test command",
            key: newKey
        },
        {
            id: "test4",
            command: "test command 2",
            key: newKey
        },
        {
            id: "test5",
            command: "test cmd",
            key: "CTRL+Y"
        }
    );

    controlsWrapper.setBindingKey("test5", newKey);

    const filterByNewKey = (binding: KeyBinding): boolean => binding.key === newKey;

    const commonBindingsWithNewKey = controlsWrapper.controlsSettings.bindings.filter(
        filterByNewKey
    );
    const customBindingsWithNewKey = controlsWrapper.customBindings.bindings.filter(
        filterByNewKey
    );

    expect(commonBindingsWithNewKey.length).toEqual(0);
    expect(customBindingsWithNewKey.length).toEqual(1);
    expect(customBindingsWithNewKey[0].key).toEqual(newKey);
})