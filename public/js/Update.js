var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Updater {
    constructor() {
        this.currentVersion = chrome.runtime.getManifest().version;
    }
    getLatestVersionInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield fetch("https://api.github.com/repos/Dark-Gr/GeekieAnswers/releases");
            var text = yield res.text();
            return JSON.parse(text)[0];
        });
    }
    checkIfVersionIsNewer(version) {
        var v = version.replace("v", "").split("-")[0];
        var values = v.split(".");
        var installedValues = this.currentVersion.split(".");
        //if(values.length > installedValues.length && +values[1] > 0) return true;
        for (let i = 0; i < (values.length > installedValues.length ? values : installedValues).length; i++) {
            if (values[i] && installedValues[i]) {
                var value1 = +values[i];
                var value2 = +installedValues[i];
                if (value1 > value2)
                    return true;
            }
            else {
                if (values[i] && !installedValues[i] && +values[i] > 0)
                    return true;
                if (installedValues[i] && !values[i] && +installedValues[i] > 0)
                    return false;
            }
        }
        return false;
    }
    notifyUser(version, preRelease) {
        chrome.notifications.create("GeekieAnswers_update", {
            type: "basic",
            title: "Atualização para o GeekieAnswers",
            iconUrl: "/public/img/icon_128.png",
            message: `Uma nova versão ${preRelease ? "beta " : ""}do GeekieAnswers está disponível! (${version})`,
            priority: 2,
            buttons: [
                {
                    title: "Ver atualização"
                }
            ]
        });
    }
    checkUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            var info = yield this.getLatestVersionInfo();
            if (this.notifiedVersion && info.tag_name == this.notifiedVersion) {
                setTimeout(() => this.checkUpdate(), 5 * 60 * 1000);
                return;
            }
            if (this.checkIfVersionIsNewer(info.tag_name)) {
                downloadURL = info.html_url;
                this.notifyUser(info.tag_name, info.prerelease);
                this.notifiedVersion = info.tag_name;
            }
            setTimeout(() => this.checkUpdate(), 5 * 60 * 1000);
        });
    }
}
var updater = new Updater();
updater.checkUpdate();
var downloadURL;
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId == "GeekieAnswers_update")
        chrome.tabs.create({ url: downloadURL });
});
//# sourceMappingURL=Update.js.map