var m;
cc.Class({
    extends: cc.Component,

    properties: {
        oauthLoginServer: 'http://106.14.40.93:7777/userapi/WeixinLogin',
        appKey: '6E48B235-CB00-6938-C86A-77391E8FC40A',
        appSecret: 'f1a438eedd0c0509a879d803ae1be661',
        privateKey: 'B9A4CE3881E124A12088CD19592E6342'
    },

    // use this for initialization
    onLoad: function () {
         m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
       if(cc.sys.isMobile){
            console.log('shouji');
            this.agentManager = anysdk.agentManager;
            this.agentManager.init(this.appKey, this.appSecret, this.privateKey, this.oauthLoginServer);
            this.userPlugin = this.agentManager.getUserPlugin();
            console.log(this.userPlugin);
            this.iapPlugin = this.agentManager.getIAPPlugin();
            this.sharePlugin = this.agentManager.getSharePlugin();
            if(this.userPlugin){
                this.userPlugin.setListener(this.onUserResult, this);
            }
            if(this.iapPlugin){
                this.iapPlugin.setListener(this.onPayResult, this);
            }
            if(this.sharePlugin){
                this.sharePlugin.setListener(this.onShareResult, this);
            }
       }
    },
    
    login:function(btnGroup) {
        this.btnGroup = btnGroup;
        console.log('123');
        console.log(this.userPlugin);
        if(this.userPlugin){
            console.log('1234');
            this.userPlugin.login();
        }
    },
    
    pay () {
        if(this.iapPlugin){
            var info = {
                'Product_Id': '107196',                    //商品唯一标示符
                'Product_Name': '金币',            //商品名称
                'Product_Price': '0.1',                    //商品单价
                'Product_Count': '1',                      //商品数量
                'Product_Desc': 'three hearts',            //商品描述 
                'Coin_Name': '金币',                      //虚拟币名称
                'Coin_Rate': '1',                          //虚拟币兑换率
                'Role_Id': m.Userid,    //角色唯一标示符
                'Role_Name': m.name,                      //角色名称
                'Role_Grade': m.lv,                         //角色等级
                'Role_Balance': m.yuanbao,  //虚拟币余额
                'Vip_Level': m.Power,                          //VIP等级
                'Party_Name': 'null',                      //工会名称
                'Server_Id': '1',                          //服务器唯一标示符
                'Server_Name': '1',                        //服务器名称
                'EXT': 'Cocos Creator'                     //扩展字段
            };
            this.iapPlugin.payForProduct(info);
        }
    },
    
    share () {
        if(this.sharePlugin){
            var info = {
                'title' : 'Dark Slash',                   // 标题名称
                'titleUrl' : 'http://www.cocos.com',      // 标题链接
                'site' : 'Dark Slash',                    // 标题网站名
                'siteUrl' : 'http://www.cocos.com',       // 标题网站链接
                'text' : '暗黑斩游戏制作演示 - Cocos Creator制造',//分享内容
                'comment' : '无',                                 //评论
                'description': '暗黑斩游戏制作演示 - Cocos Creator制造', //描述
                'imageTitle': 'Dark Slash',                              //图片标题
                'imageUrl': 'http://veewo.com/promo/img/darkslash_web_web_banner.png', //分享图片链接
                'url': 'http://www.veewo.com/games/?name=darkslash',       //分享链接
            };
            this.sharePlugin.share(info);
        }
    },
    
    onUserResult (code, msg){
        cc.log('########## USER RESULT ########## code: ' + code + ',msg: ' + msg);
        switch(code)
        {
        case anysdk.UserActionResultCode.kInitSuccess://用户系统初始化成功
            //do
            break;
        case anysdk.UserActionResultCode.kInitFail://用户系统初始化失败
            //do
            break;
        case anysdk.UserActionResultCode.kLoginSuccess://用户系统登录成功
            console.log('########## LOGIN SUCCESS ##########');
            TipsManager.init.showTips('账号登录成功...');//________________________________-____________________________________________________________________________________
            var self = this;
            // var xhr = new XMLHttpRequest();
            // //var abc = "phone="+this.userText.string+"&passwd="+this.pwText.string;
            // xhr.open("POST", "http://192.168.0.100:7777/userapi/WeixinLogin");
            // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
            // xhr.send({ userId: this.userPlugin.getUserID()});
            // xhr.onreadystatechange = function () {
            // if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400)) {
            
            Network.send('http://192.168.0.100:7777/userapi/WeixinLogin', { userId: this.userPlugin.getUserID()}, function (data) {
                PlayerInfo.set(data.playerInfo);
                console.log("人物信息：");
                console.log(data.playerInfo);
                cc.eventManager.pauseTarget(self.btnGroup, true);
                cc.director.loadScene('PlayGame');
            });
            break;
        case anysdk.UserActionResultCode.kLoginNetworkError://用户系统网络错误
        case anysdk.UserActionResultCode.kLoginNoNeed://用户系统无需登录
        case anysdk.UserActionResultCode.kLoginFail://用户系统登录失败
            TipsManager.init.showTips('账户登录出错,请重新登录...');
            break;
        case anysdk.UserActionResultCode.kLoginCancel://用户系统登录取消
            TipsManager.init.showTips('账户取消登录...');
            break;
        default:
            break;
        }
    },

    onPayResult (code, msg) {
        cc.log('########## PAY RESULT ########## code: ' + code + ',msg: ' + msg);
        switch(code){
            case anysdk.PayResultCode.kPaySuccess:// 支付系统支付成功
                console.log('########## PAY SUCCESS ##########');
                TipsManager.init.showTips('支付成功...')
                break;
            case anysdk.PayResultCode.kPayCancel:// 支付系统支付取消
                TipsManager.init.showTips('支付取消...');
                break;
            case anysdk.PayResultCode.kPayFail:// 支付系统支付失败
            case anysdk.PayResultCode.kPayNetworkError:// 支付系统网络错误
            case anysdk.PayResultCode.kPayProductionInforIncomplete:// 支付系统支付信息不完整
                TipsManager.init.showTips('支付失败，请重试...');
                break;
            case anysdk.PayResultCode.kPayInitSuccess:// 支付系统初始化成功
                //do
                break;
            case anysdk.PayResultCode.kPayInitFail:// 支付系统初始化失败
                //do
                 break;
            case anysdk.PayResultCode.kPayNowPaying:// 支付系统正在支付中
                //do
                break;
            default:
                break;
            }
    },
    
    onShareResult:function(code, msg){
        cc.log('########## Share RESULT ########## code: ' + code + ',msg: ' + msg);
        switch(code){
            case anysdk.ShareResultCode.kShareSuccess://分享系统分享成功
                TipsManager.init.showTips('分享成功...');
                break;
            case anysdk.ShareResultCode.kShareFail://分享系统分享失败
            case anysdk.ShareResultCode.kShareCancel://分享系统分享取消
            case anysdk.ShareResultCode.kShareNetworkError://分享系统分享网络出错
                TipsManager.init.showTips('分享失败，请重试...');
                break;         
            default:
                break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
