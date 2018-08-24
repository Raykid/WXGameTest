require('./weapp-adapter.js');
require('./platform.js');
require("js/egret.min.js");
require("js/eui.min.js");
require("js/assetsmanager.min.js");
require("js/tween.min.js");
require("js/game.min.js");
require("js/default.thm.js");
require('./egret.wxgame.js');

// 启动微信小游戏本地缓存，如果开发者不需要此功能，只需注释即可
require('./library/image.js');
require('./library/text.js');

// 启动Olympus主程序
require('./index_wxgame.js');