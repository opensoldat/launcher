import ControlsWrapperStore from "./controlsWrapper";
import GraphicsSettingsStore from "./graphics";
import PlayerSettingsStore from "./player";
import SoundSettingsStore from "./sound";

class ClientSettingsStore {
    controlsWrapperStore = new ControlsWrapperStore();
    graphicsSettingsStore = new GraphicsSettingsStore();
    playerSettingsStore = new PlayerSettingsStore();
    soundSettingsStore = new SoundSettingsStore();
}

export default ClientSettingsStore;