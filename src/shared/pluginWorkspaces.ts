import { GLOBAL_PLUGIN_WORKSPACE_PROPERTY } from "./pluginFlags";

interface PluginWorkspace { }

export let pluginWorkspaces: Map<string, PluginWorkspace> | undefined = initGlobalPluginWorkspaces();
function initGlobalPluginWorkspaces(): Map<string, PluginWorkspace> {
    // @ts-ignore
    const oldPluginWorkspaces = window[GLOBAL_PLUGIN_WORKSPACE_PROPERTY];
    window[GLOBAL_PLUGIN_WORKSPACE_PROPERTY] = oldPluginWorkspaces || new Map<string, PluginWorkspace>();
    return window[GLOBAL_PLUGIN_WORKSPACE_PROPERTY];
}

export function registerPluginWorkspace(pluginName: string, pluginWorkspace: PluginWorkspace) {
    pluginWorkspaces!.set(pluginName, pluginWorkspace)
}