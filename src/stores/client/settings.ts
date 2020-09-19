import ControlsSettingsStore from "./controlsSettings";
import GraphicsSettingsStore from "./graphicsSettings";
import PlayerSettingsStore from "./playerSettings";
import SoundSettingsStore from "./soundSettings";

class ClientSettingsStore {
    controlsSettingsStore = new ControlsSettingsStore();
    graphicsSettingsStore = new GraphicsSettingsStore();
    playerSettingsStore = new PlayerSettingsStore();
    soundSettingsStore = new SoundSettingsStore();
}

export default ClientSettingsStore;