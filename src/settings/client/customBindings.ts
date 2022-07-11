import { action, observable, toJS, makeObservable } from "mobx";
import shortid from "shortid";

import { SoldatConfig } from "src/api/soldat/configs/types";
import { KeyBinding } from "src/types";

const defaultCustomBindings: KeyBinding[] = [
    { key: "ALT+0", command: 'say "Stick around!"' },
    { key: "ALT+1", command: 'smoke' },
    { key: "ALT+2", command: 'tabac' },
    { key: "ALT+3", command: 'takeoff' },
    { key: "ALT+4", command: 'victory' },
    { key: "ALT+5", command: 'say "What the hell are you?"' },
    { key: "ALT+6", command: 'say "If it bleeds, we can kill it"' },
    { key: "ALT+7", command: 'say "I\'m gonna have me some fun!"' },
    { key: "ALT+8", command: 'say "Bleed, bastard."' },
    { key: "ALT+9", command: 'say "Medic!"' },
    { key: "ALT+A", command: 'say "Die!"' },
    { key: "ALT+B", command: 'say "Son of a bitch!"' },
    { key: "ALT+C", command: 'say "It\'s over Johnny"' },
    { key: "ALT+D", command: 'say "Anytime..."' },
    { key: "ALT+E", command: 'say "No!"' },
    { key: "ALT+F", command: 'say "Yes, Sir!"' },
    { key: "ALT+G", command: 'say "I\'ll be back!"' },
    { key: "ALT+H", command: 'say "Get the flag!"' },
    { key: "ALT+I", command: 'say "OK"' },
    { key: "ALT+J", command: 'say "Help!"' },
    { key: "ALT+K", command: 'say "Sniper!"' },
    { key: "ALT+L", command: 'say "Heavy Machine Gun ahead!"' },
    { key: "ALT+M", command: 'say "Take Cover!"' },
    { key: "ALT+N", command: 'say "I need backup!"' },
    { key: "ALT+O", command: 'say "Follow me!"' },
    { key: "ALT+P", command: 'say "Kiss the ground soldier!"' },
    { key: "ALT+Q", command: 'say "On your feet soldier!"' },
    { key: "ALT+R", command: 'say "Come on!"' },
    { key: "ALT+S", command: 'say "Yeah"' },
    { key: "ALT+T", command: 'say "Return the flag!"' },
    { key: "ALT+U", command: 'say "Hurraaaa!!!"' },
    { key: "ALT+V", command: 'say "I am the law!"' },
    { key: "ALT+W", command: 'say "Engage at will!!!"' },
    { key: "ALT+X", command: 'say "I ain\'t got time to bleed!"' },
    { key: "ALT+Y", command: 'say "You\'re one ugly mother fu**er!"' },
    { key: "ALT+Z", command: 'say "Got it!"' }
].map(binding => {
    return {
        id: shortid.generate(),
        ...binding
    }
})

// This could probably extend Array<KeyBinding>, as it's just a collection
// of bindings. Not sure how it would interact with MobX though.
class CustomBindings {
    @observable bindings: KeyBinding[];

    constructor(config?: SoldatConfig) {
        makeObservable(this);
        if (config == null) {
            this.bindings = defaultCustomBindings;
            return;
        }

        this.bindings = config.bindings.map(configBinding => {
            return {
                id: shortid.generate(),
                ...configBinding
            }
        });
    }

    toConfig(): SoldatConfig {
        return {
            bindings: toJS(this.bindings),
            cvars: null
        };
    }

    @action addEmpty(): void {
        this.bindings.unshift({
            id: shortid.generate(),
            command: "",
            key: ""
        });
    }

    @action delete(bindingId: string): void {
        const index = this.bindings.findIndex(
            binding => binding.id === bindingId
        );

        if (index !== -1) {
            this.bindings.splice(index, 1);
        }
    }

    getById(bindingId: string): KeyBinding {
        return this.bindings.find(
            binding => binding.id === bindingId
        );
    }

    @action setCommand(bindingId: string, newCommand: string): void {
        const binding = this.getById(bindingId);
        if (binding != null) {
            binding.command = newCommand;
        }
    }
}

export default CustomBindings;