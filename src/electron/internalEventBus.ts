import TypedEmitter from "typed-emitter";
import { InternalEvents } from "./internalEvents";

// Initially I thought there would be more events to send through the main process,
// but in the end this may be too much. Seems like we are only emitting events from
// GameIpcServer, so we could turn that class into an EventEmitter.
type InternalEventBus = TypedEmitter<InternalEvents>;

export default InternalEventBus;