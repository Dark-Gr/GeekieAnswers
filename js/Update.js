var currentInstalledVersion = chrome.runtime.getManifest().version;
var updateDownloadUrl;
var notifiedVersion;

async function getReleaseInfo() { // https://stackoverflow.com/questions/25107774/how-do-i-send-an-http-get-request-from-a-chrome-extension
    var res = await fetch("https://api.github.com/repos/Dark-Gr/GeekieAnswers/releases");
    var text = await res.text();

    return JSON.parse(text)[0];
}

function checkIfReleaseIsNewer(data) {
    var releaseVersion = data.tag_name.replace("v", "");

    var values = releaseVersion.split(".");
    var currentVersionValues = currentInstalledVersion.split(".");

    for(let i = 0; i < values.length; i++) {
        if(values[i] && currentVersionValues[i]) {
            var releaseV = +values[i];
            var currentV = +currentVersionValues[i];

            if(releaseV > currentV) return true;
        }
    }

    return false;
}

function notifyUser(version, isPrerelease) {
    chrome.notifications.create("GeekieAnswers_update", {
        type: "basic",
        iconUrl: "/img/icon_128.png",
        title: "Nova versão disponível",
        message: `Uma nova versão do GeekieAnswes está disponível (${version})${isPrerelease ? ", é uma versão Beta" : ""}!`,
        priority: 2,
        buttons: [
            {
                title: "Ver atualização"
            }
        ]
    });
}

async function checkUpdate() {
    var data = await getReleaseInfo();
    if(notifiedVersion && data.tag_name === notifiedVersion) {
        setTimeout(checkUpdate, 5 * 60 * 1000); // 5 minute
        return;
    }

    var isReleaseNewer = checkIfReleaseIsNewer(data);
    if(isReleaseNewer) {
        updateDownloadUrl = data.html_url;
        notifyUser(data.tag_name, data.prerelease);
        notifiedVersion = data.tag_name;
    }

    setTimeout(checkUpdate, 5 * 60 * 1000); // 5 minute
}

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    if(notificationId === "GeekieAnswers_update") {
        chrome.tabs.create({ url: updateDownloadUrl })
    }
});

checkUpdate();