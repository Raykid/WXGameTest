import { EgretMediatorClass } from 'olympus-r-egret/egret/injector/Injector';
import { BindOn } from 'olympus-r/engine/injector/Injector';
import IMediator from 'olympus-r/engine/mediator/IMediator';
import Mediator from 'olympus-r/engine/mediator/Mediator';
import { moduleManager } from 'olympus-r/engine/module/ModuleManager';
import IScene from 'olympus-r/engine/scene/IScene';
import { sceneManager } from 'olympus-r/engine/scene/SceneManager';
import SceneMessage from 'olympus-r/engine/scene/SceneMessage';
import { core } from 'olympus-r/Olympus';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-20
 * @modify date 2017-10-20
 * 
 * 顶部栏组件中介者
*/
export interface ITopBarScene extends IScene {
    /**
     * 获取显示在TopBar上的文字
     * 
     * @type {string}
     * @memberof ITopBarModule
     */
    readonly topBarText?: string;

    /**
     * 文字颜色，RGB，默认为0xffffff
     * 
     * @type {number}
     * @memberof ITopBarScene
     */
    readonly topBarTextColor?: number;

    /**
     * 获取顶部栏背景色，ARGB，默认为0x1a000000，即透明度为10%的黑色
     * 
     * @type {number}
     * @memberof ITopBarScene
     */
    readonly topBarBgColor?: number;

    /**
     * 返回回调
     * 
     * @type {Function}
     * @memberof ITopBarScene
     */
    readonly backHandler?:Function;
}

/** 更新TopBar属性事件，参数可以有三个，分别是title、titleColor、bgColor */
export const UPDATE_TOPBAR_MESSAGE:string = "updateTopbarMessage";
/** 向TopBar中添加一个对象的事件 */
export const ADD_TOPBAR_ITEM_MESSAGE:string = "addTopbarItemMessage";
/** 插入一个后退回调，可以阻止后退操作 */
export const REGISTER_BACK_HANDLER_MESSAGE:string = "registerBackHandlerMessage";

export abstract class BaseTopBar extends Mediator {
    private _topBarText: string;
    private _topBarTextColor: number;
    private _topBarBgColor: number;

    protected get topBarText(): string {
        if (this._topBarText != null) return this._topBarText;
        let scene: ITopBarScene = sceneManager.currentScene as ITopBarScene;
        if (scene) {
            let text:string = scene.topBarText;
            if(text) return text;
        }

        return "";
    }

    protected get topBarTextColor(): number {
        if (this._topBarTextColor != null) return this._topBarTextColor;
        let scene: ITopBarScene = sceneManager.currentScene as ITopBarScene;
        if (scene) {
            let color:number = scene.topBarTextColor;
            if(color !== undefined && color !== null) return color;
        }

        return 0xffffff;
    }

    protected get topBarBGColor(): number {
        if (this._topBarBgColor != null) return this._topBarBgColor;
        let scene: ITopBarScene = sceneManager.currentScene as ITopBarScene;
        if (scene) {
            let color:number = scene.topBarBgColor;
            if(color !== undefined && color !== null) return color;
        }

        return 0x00000000;
    }

    protected get backButtonVisible(): boolean {
        return (sceneManager.activeCount > 1);
    }

    protected abstract updateView(): void;
    protected abstract updateButton(): void;

    private _backHandler:(callback:()=>void)=>void;
    protected onBack(): void {

        let scene: ITopBarScene = sceneManager.currentScene as ITopBarScene;
        if (scene && scene.backHandler) {
            scene.backHandler();
            return;
        }

        
        if (this._backHandler == null) {
            this.doBack();
        } else {
            this._backHandler(()=>{
                this.doBack();
            });
        }
    }

    protected doBack():void
    {
        // 如果模块数大于1个，则关闭当前模块
        if (moduleManager.activeCount > 1) {
            // 首先将模块关闭到所依赖的模块
            moduleManager.open(this.root);
            // 然后关闭当前模块
            moduleManager.close(this.root);

        }
    }

    private onChangeScene(to: IMediator): void {
        if (this.root.containsMediator(to)) {
            this.bridge.addChild(this.bridge.frameLayer, this.skin);
            this.updateView();
            this.updateButton();
        }
        else {
            this.bridge.removeChild(this.bridge.frameLayer, this.skin);
        }
    }

    private onSceneStackChange(): void {
        this.updateButton();
    }

    private onUpdateTopbar(title?: string, titleColor?: number, bgColor?: number): void {
        this._topBarText = title;
        this._topBarTextColor = titleColor;
        this._topBarBgColor = bgColor;
        this.updateView();
    }

    private onAddTopbarItem(item:any):void
    {
        this.bridge.addChild(this.skin, item);
    }

    private onRegisterBackHandler(backHandler:(callback:()=>void)=>void):void
    {
        this._backHandler = backHandler;
    }

    public onOpen(data?: any): void {
        super.onOpen(data);
        core.listen(SceneMessage.SCENE_BEFORE_CHANGE, this.onChangeScene, this);
        core.listen(SceneMessage.SCENE_STACK_CHANGE, this.onSceneStackChange, this);
        this.root.listen(UPDATE_TOPBAR_MESSAGE, this.onUpdateTopbar, this);
        this.root.listen(ADD_TOPBAR_ITEM_MESSAGE, this.onAddTopbarItem, this);
        this.root.listen(REGISTER_BACK_HANDLER_MESSAGE, this.onRegisterBackHandler, this);
    }

    public dispose(): void {
        this._backHandler = null;
        core.unlisten(SceneMessage.SCENE_BEFORE_CHANGE, this.onChangeScene, this);
        core.unlisten(SceneMessage.SCENE_STACK_CHANGE, this.onSceneStackChange, this);
        this.root.unlisten(UPDATE_TOPBAR_MESSAGE, this.onUpdateTopbar, this);
        this.root.unlisten(ADD_TOPBAR_ITEM_MESSAGE, this.onAddTopbarItem, this);
        this.root.unlisten(REGISTER_BACK_HANDLER_MESSAGE, this.onRegisterBackHandler, this);
        super.dispose();
    }
}

@EgretMediatorClass("EgretTopBar", "skins.TopBarSkin")
export class EgretTopBar extends BaseTopBar {
    public itm_bg: eui.Rect;
    @BindOn(egret.TouchEvent.TOUCH_TAP, "$this.onBack()")
    public btn_back: eui.Button;
    public txt_name: eui.Label;

    public listAssets(): string[] {
        return ["common"];
    }

    public onOpen(data?: any): void {
        super.onOpen(data);

        this.skin.touchEnabled=false;
        // 拉伸宽度
        this.skin.width = this.bridge.root.stage.stageWidth;
        // 回退按钮初始不显示
        this.btn_back.visible = false;
    }

    protected updateView(): void {
        // 更新文字
        this.txt_name.text = this.topBarText;
        this.txt_name.x = (this.txt_name.stage.stageWidth - this.txt_name.width) * 0.5;
        // 更新文字颜色
        this.txt_name.textColor = this.topBarTextColor;
        // 更新背景色
        let argb: number = this.topBarBGColor;
        this.itm_bg.fillAlpha = (argb >>> 24) / 255;
        this.itm_bg.fillColor = argb & 0xffffff;
    }

    protected updateButton(): void {
        // 更新按钮
        this.btn_back.visible = this.backButtonVisible;
    }
}