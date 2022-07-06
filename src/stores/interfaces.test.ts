import { setImmediate } from "timers";
import InterfacesStore from "./interfaces";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";

describe("Select options", () => {
    let clientLaunchSettingsStore: ClientLaunchSettingsStore;
    const flushPromises = (): Promise<NodeJS.Immediate> => new Promise(setImmediate);
    const defaultInterface = "storm";

    beforeAll(() => {
        window.soldat.interfaces = {
            listArchivesNames: jest.fn().mockReturnValue(
                Promise.resolve([
                    "archive1",
                    "archive2"
                ])
            ),
            listDirectoriesNames: jest.fn().mockReturnValue(
                Promise.resolve([
                    "directory1",
                    "directory2"
                ])
            )
        };
    
        clientLaunchSettingsStore = new ClientLaunchSettingsStore();
    });

    test("Include only archive and default interfaces when local mount is disabled", async () => {
        clientLaunchSettingsStore.localMount = false;
        const interfacesStore = new InterfacesStore(clientLaunchSettingsStore);

        interfacesStore.loadInterfaces();
        await flushPromises();

        expect(interfacesStore.selectOptions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    value: "archive1"
                }),
                expect.objectContaining({
                    value: "archive2"
                }),
                expect.objectContaining({
                    value: defaultInterface
                })
            ])
        );

        expect(interfacesStore.selectOptions).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    value: "directory1"
                })
            ])
        );
    });

    test("Include only archive and directory interfaces when local mount is enabled", async () => {
        clientLaunchSettingsStore.localMount = true;
        const interfacesStore = new InterfacesStore(clientLaunchSettingsStore);

        interfacesStore.loadInterfaces();
        await flushPromises();

        expect(interfacesStore.selectOptions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    value: "archive1"
                }),
                expect.objectContaining({
                    value: "archive2"
                }),
                expect.objectContaining({
                    value: "directory1"
                }),
                expect.objectContaining({
                    value: "directory2"
                })
            ])
        );

        expect(interfacesStore.selectOptions).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    value: defaultInterface
                })
            ])
        );
    });

    test("Refresh when local mount is toggled", async () => {
        clientLaunchSettingsStore.localMount = true;
        const interfacesStore = new InterfacesStore(clientLaunchSettingsStore);

        interfacesStore.loadInterfaces();
        await flushPromises();

        expect(interfacesStore.selectOptions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    value: "directory1"
                })
            ])
        );
        expect(interfacesStore.selectOptions).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    value: defaultInterface
                })
            ])
        );

        clientLaunchSettingsStore.localMount = false;
        expect(interfacesStore.selectOptions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    value: defaultInterface
                })
            ])
        );
        expect(interfacesStore.selectOptions).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({
                    value: "directory1"
                })
            ])
        );
    });
});