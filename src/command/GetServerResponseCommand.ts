import Command from "olympus-r/core/command/Command";
import ResponseData from "olympus-r/engine/net/ResponseData";
import { panelManager } from "olympus-r/engine/panel/PanelManager";

export default class GetServerResponseCommand extends Command {
    public exec(): void {
        const response: ResponseData = this.msg["params"][0];
        if (!response["success"]) {
            // 网络请求失败时弹出提示
            panelManager.alert(response.__params.info);
        }
    }
}
