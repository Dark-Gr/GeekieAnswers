class Updater {
    private currentVersion: string;
    private notifiedVersion: string;

    constructor() {
        this.currentVersion = chrome.runtime.getManifest().version;
    }

    private async getLatestVersionInfo(): Promise<{ tag_name: string, html_url: string, prerelease: boolean }> {
        var res = await fetch("https://api.github.com/repos/Dark-Gr/GeekieAnswers/releases");
        var text = await res.text();

        return JSON.parse(text)[0];
    }

    private checkIfVersionIsNewer(version: string) {
        var v = version.replace("v", "").split("-")[0];

        var values = v.split(".");
        var installedValues = this.currentVersion.split(".");

        //if(values.length > installedValues.length && +values[1] > 0) return true;

        for(let i = 0; i < (values.length > installedValues.length ? values : installedValues).length; i++) {
            if(values[i] && installedValues[i]) {
                var value1 = +values[i];
                var value2 = +installedValues[i];

                if(value1 > value2) return true;
            } else {
                if(values[i] && !installedValues[i] && +values[i] > 0) return true;
                if(installedValues[i] && !values[i] && +installedValues[i] > 0) return false;
            }
        }

        return false;
    }

    private notifyUser(version: string, preRelease: boolean) {
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

    public async checkUpdate() {
        var info = await this.getLatestVersionInfo();
        if(this.notifiedVersion && info.tag_name == this.notifiedVersion) {
            setTimeout(() => this.checkUpdate(), 5 * 60 * 1000);
            return;
        }

        if(this.checkIfVersionIsNewer(info.tag_name)) {
            downloadURL = info.html_url;
            this.notifyUser(info.tag_name, info.prerelease);
            this.notifiedVersion = info.tag_name;
        }

        setTimeout(() => this.checkUpdate(), 5 * 60 * 1000);
    }
}

var updater = new Updater();
updater.checkUpdate();

var downloadURL: string;

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if(notificationId == "GeekieAnswers_update") chrome.tabs.create({ url: downloadURL });
});