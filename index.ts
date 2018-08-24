/// <reference types="olympus-r"/>
/// <reference types="olympus-r-egret"/>
/// <reference path="egret/libs/modules/egret/egret.d.ts"/>
/// <reference path="egret/libs/modules/assetsmanager/assetsmanager.d.ts"/>
/// <reference path="egret/libs/modules/eui/eui.d.ts"/>
/// <reference path="egret/libs/modules/tween/tween.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>

import EgretBridge from "olympus-r-egret/EgretBridge";
import NetMessage from "olympus-r/engine/net/NetMessage";
import Olympus, { core } from "olympus-r/Olympus";
import GetServerResponseCommand from "./src/command/GetServerResponseCommand";
import NetworkErrorCommand from "./src/command/NetworkErrorCommand";
import { EgretPrompt } from "./src/component/Prompt";
import Homepage from "./src/module/Homepage/Homepage";

Olympus.startup({
    bridges: [
        new EgretBridge({
            width: 720,
            height: 1280,
            pathPrefix: "egret/",
            container: "#rootEgret",
            backgroundColor: 0xffffff,
            scaleMode: egret.StageScaleMode.FIXED_NARROW,
            renderMode: 1,
            maskData: {
                loadingAlpha: 0
            },
            promptClass: EgretPrompt,
            hasAssetsVersion: false,
        }),
    ],
    firstModule: Homepage,
    loadElement: "#loading",
    onInited: () => {
        // 注册网络错误命令
        core.mapCommand(NetMessage.NET_ERROR, NetworkErrorCommand);
        // 注册服务器返回命令
        core.mapCommand(NetMessage.NET_RESPONSE, GetServerResponseCommand);
    }
});