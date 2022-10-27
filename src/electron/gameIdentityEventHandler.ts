import { GameInstance } from "./gameInstance";
import GameVault from "./gameVault";
import InternalEventBus from "./internalEventBus";
import { GameIdentityEvent, InternalEventIds } from "./internalEvents";

class GameIdentityEventHandler {
  private readonly eventBus: InternalEventBus;
  private readonly gameVault: GameVault;

  constructor(eventBus: InternalEventBus, gameVault: GameVault) {
    this.eventBus = eventBus;
    this.gameVault = gameVault;

    this.handleGameIdentityEvent = this.handleGameIdentityEvent.bind(this);

    this.eventBus.on(
      InternalEventIds.ReceivedGameIdentity,
      this.handleGameIdentityEvent
    );
  }

  private handleGameIdentityEvent(event: GameIdentityEvent) {
    let gameInstance = this.gameVault.getByProcessId(event.processId);
    if (gameInstance) {
      gameInstance.ipcSocket = event.socket;
    } else {
      gameInstance = new GameInstance(event.processType, null, event.socket);
      this.gameVault.addInstance(gameInstance);
    }
  }
}

export default GameIdentityEventHandler;
