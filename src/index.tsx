/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { configure as configureMobX } from "mobx";

import App from "./components/App";

configureMobX({
    /* MobX observables should only be changed in actions, so that MobX can
     * optimize reactions (such as calculating @computed values), and skip
     * some unnecessary rerenders of React components.
     * Since it's only a matter of performance, I decided not to follow this
     * rule that strictly. This approach allows more freedom when changing state,
     * and prevents redundant setter methods.
     * Ideally, at some point this option should be re-enabled.
     */
    enforceActions: "never"
});

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);