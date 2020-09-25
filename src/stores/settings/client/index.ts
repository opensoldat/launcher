import ControlsWrapperStore from "./controlsWrapper";
import GameSettingsStore from "./game";
import GraphicsSettingsStore from "./graphics";
import PlayerSettingsStore from "./player";
import SoundSettingsStore from "./sound";

class ClientSettingsStore {
    controlsWrapperStore = new ControlsWrapperStore();
    gameSettingsStore = new GameSettingsStore();
    graphicsSettingsStore = new GraphicsSettingsStore();
    playerSettingsStore = new PlayerSettingsStore();
    soundSettingsStore = new SoundSettingsStore();
}

export default ClientSettingsStore;