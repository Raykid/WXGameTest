import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";
import { BindFor, BindIf, BindOn, BindValue } from "olympus-r/engine/injector/Injector";
import IPromptPanel, { IPromptParams } from "olympus-r/engine/panel/IPromptPanel";
import PanelMediator from "olympus-r/engine/panel/PanelMediator";

@EgretMediatorClass("EgretPrompt", "skins.PromptSkin")
export class EgretPrompt extends PanelMediator implements IPromptPanel
{
    @BindValue("text", scope=>scope.title || "")
    public txt_title:eui.Label;
    @BindValue("text", scope=>scope.msg || "")
    public txt_content:eui.Label;
    @BindIf(scope=>!scope.handlers || scope.handlers.length === 0)
    @BindOn(egret.TouchEvent.TOUCH_TAP, scope=>scope.$this.close())
    public btn_close:eui.Button;
    @BindFor(["btn", "of", scope=>scope.handlers])
    @BindValue({
        "labelDisplay.text": scope=>scope.btn.text
    })
    @BindOn(egret.TouchEvent.TOUCH_TAP, scope=>{
        scope.btn.handler && scope.btn.handler(scope.btn.data);
        scope.$this.close();
    })
    public lst_buttons:eui.DataGroup;

    public onOpen():void
    {
        this.viewModel = {
            // 这里列出所有被绑定的属性
            msg: null,
            title: null,
            handlers: null
        };
    }

    public update(params:IPromptParams):void
    {
        for(let key in params)
        {
            this.viewModel[key] = params[key];
        }
    }
}