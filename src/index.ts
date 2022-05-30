export type PluginOption = |
    "defaultHead" | "defaultBodyBottom" | "defaultBodyTop" |
    "deferHead" | "deferBodyBottom" | "deferBodyTop" |
    "asyncHead" | "asyncBodyBottom" | "asyncBodyTop";

export interface BasePluginOptions {
    asynchronous?: boolean;
    selector: string;
    position: PluginOption;
}

interface PluginOptions extends BasePluginOptions {
    onMounted?: (pluginId: string) => void;
    onUnmounted?: (pluginId: string) => void;
}

function createPlugin(options: PluginOptions) {
    const { selector, position } = options;
    console.log("createPlugin", selector, position);
}

const plugin = createPlugin({
    selector: "#asynchronous-plugin",
    position: "defaultBodyBottom"
});

console.log("asynchronous plugin", plugin);

export default createPlugin
