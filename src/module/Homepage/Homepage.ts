import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";
import { BindOn, BindValue, SubMediator } from "olympus-r/engine/injector/Injector";
import { panelManager } from 'olympus-r/engine/panel/PanelManager';
import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import { EgretTopBar, ITopBarScene } from "../../component/Topbar";

@EgretMediatorClass("Homepage", "skins.HomepageSkin")
export default class Homepage extends SceneMediator implements ITopBarScene
{
    @SubMediator
    private _topBar:EgretTopBar;

    public topBarText:string = "首页";

    @BindValue("text", scope=>scope.curText)
    public txt:eui.Label;
    @BindOn(egret.TouchEvent.TOUCH_TAP, scope=>scope.onClickBtn())
    public btn:eui.Button;

    /**
     * 这个方法返回模块依赖的Egret资源组
     * 
     * @returns {string[]} 
     * @memberof Homepage
     */
    public listAssets():string[]
    {
        return ["homepage"];
    }

    public onOpen(data?:any):void
    {
        // 请这里设置ViewModel
        this.viewModel = {
            curText: "欢迎使用Olympus",
            onClickBtn: ()=>{
                panelManager.confirm("欢迎你！");
            }
        };
    }
}
