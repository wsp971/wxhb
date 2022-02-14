export { };
let waitOpenHB:AutoJs.UiObject[] = [];
let auto:any;

function main() {
  wakeUpScreen();
  lanchWX();
  limit();
  threads.start(function () {
    while (true) {
        console.log('寻找红包')
        lookHB();
        sleep(100);
    }
  });
  threads.start(function () {
    while (true) {
        console.log('点击红包')
        clickHb();
        sleep(100);
    }
  });
  threads.start(function () {
    while (true) {
        console.log('领取红包')
        openHB();
        sleep(100);
    }
  });
  threads.start(function () {
    while (true) {
        console.log('返回继续抢！！');
        backToContinue();
        sleep(500);
    }
  });
}
main();

/** 唤醒屏幕 */
function wakeUpScreen() {
  const isOn = device.isScreenOn();
  if (!isOn) {
    device.wakeUp();
  }
  console.log('屏幕正常点亮');
}

/** 启动微信 */
function lanchWX() {
  auto.waitFor();
  console.log('启动微信');
  launchApp('微信');
  sleep(1000);
}

/**
 * 解除不可以点击微信等app限制
 */
function limit() {
  // @ts-ignore
  importClass(com.stardust.autojs.core.accessibility.AccessibilityBridge.WindowFilter);
  // @ts-ignore
  let bridge = runtime.accessibilityBridge;
  // @ts-ignore
  let bridgeField = runtime.getClass().getDeclaredField("accessibilityBridge");
  let configField = bridgeField.getType().getDeclaredField("mConfig");
  configField.setAccessible(true);
  configField.set(bridge, configField.getType().newInstance());
  // @ts-ignore
  bridge.setWindowFilter(new JavaAdapter(AccessibilityBridge$WindowFilter, {
    filter: function (info: any) {
      return true;
    }
  }));
}

/**
 * 检索红包方法
 */

function lookHB(){
    const hbSelector = className('android.widget.FrameLayout').longClickable(true).clickable(true).drawingOrder(2);
    const hbs = hbSelector.find().filter(block =>{
    const wxhb = block.findOne(text('微信红包'));
    const expire = block.findOne(text('已过期'));
    const hasReceived = block.findOne(text('已领取'));
    const hasNoHB = block.findOne(text('已被领完'));
    // console.log(`是否红包${wxhb !==null},是否过期：${expire !==null},是否领取：${hasReceived!==null}，是否已领取:${hasNoHB!==null}`);
    if(!wxhb){
      // 过滤不是红包的聊天块
      return false
    }
    // 过滤 过期的，已领取的，点击过之后显示已领光的
    if(expire || hasReceived || hasNoHB){
      return false
    }
    return true;
  });
  console.log('有几个未点击的红包',hbs?.length);
  waitOpenHB = hbs;
}
34
/** 点击红包 */
function clickHb(){
  if(waitOpenHB[0]){
    waitOpenHB[0].click();
  }
  // waitOpenHB[0].click();
  // waitOpenHB.forEach(hb => {
  //     hb.click();
  //     sleep(50);
  // });
}

/** 领取红包 */
function openHB(){
  const openButton = desc('开').className('android.widget.Button').clickable(true);
  openButton.findOne(50)?.click();
}

function backToContinue(){
  if(text('手慢了，红包派完了').exists()){
    desc('关闭').findOne().click();
    return;
  }
  if(descContains('已存入零钱').exists()){
    back();
    return;
  }
}


/**  */



