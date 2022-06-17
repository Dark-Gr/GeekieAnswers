class QuestionInfo {
    constructor() {
        this.item = document.getElementsByClassName("item")[0];
        this.isHomeWork = window.location.href.includes("homework");
        this.choices = this.getChoices();
        this.correctChoice = this.getCorrectChoiceDiv();
        var solutionObjects = this.item.getElementsByClassName("solution");
        this.solutionObject = solutionObjects[solutionObjects.length - 1];
    }
    getCorrectChoiceDiv() {
        var id = angular.element(this.item).scope()["item"]["correctChoiceId"];
        for (var i = 0; i < this.choices.length; i++) {
            var choice = this.choices[i];
            var choiceId = angular.element(choice).scope()["choice"]["id"];
            if (choiceId == id)
                return choice;
        }
        return null;
    }
    getChoices() {
        var output = [];
        var elements = this.item.getElementsByClassName("choices")[0].getElementsByClassName("choice");
        for (var i = 0; i < elements.length; i++) {
            var e = elements[i];
            output[i] = e;
        }
        return output;
    }
    isSolutionVisible() {
        return angular.element(this.item).scope()["isSolutionVisible"]();
    }
    isHomework() {
        return this.isHomeWork;
    }
    getCorrectChoice() {
        return this.correctChoice;
    }
    getSolutionObject() {
        return this.solutionObject;
    }
}
class UIManager {
    constructor(elementToAppend, correctIcon) {
        this.buttonList = null;
        this.showSolutionButton = null;
        this.showAnswerButton = null;
        this.elementToAppend = elementToAppend;
        this.correctIcon = correctIcon;
        this.answerShown = false;
        this.solutionShown = false;
        this.setup = false;
    }
    setupUI() {
        this.uiArea = document.createElement("div");
        this.title = document.createElement("h1");
        this.buttonList = document.createElement("ul");
        this.showSolutionButton = document.createElement("button");
        this.showAnswerButton = document.createElement("button");
        var ulSolution = document.createElement("li");
        var ulAnswer = document.createElement("li");
        this.showSolutionButton.innerHTML = "Mostrar Solução";
        this.showAnswerButton.innerHTML = "Mostrar Resposta";
        this.uiArea.id = "GeekieAnswersUI";
        this.title.innerHTML = "GeekieAnswers";
        this.showSolutionButton.style.marginRight = "20px";
        ulSolution.appendChild(this.showSolutionButton);
        ulAnswer.appendChild(this.showAnswerButton);
        this.buttonList.appendChild(ulSolution);
        this.buttonList.appendChild(ulAnswer);
        this.uiArea.appendChild(this.title);
        this.uiArea.appendChild(this.buttonList);
        this.elementToAppend.appendChild(this.uiArea);
        this.createMark();
        this.setCallbacks();
        this.setup = true;
    }
    createMark() {
        this.mark = document.createElement("div");
        var text = document.createElement("p");
        var icon = document.createElement("img");
        this.mark.id = "GeekieAnswersChoiceMark";
        text.innerHTML = "Resposta correta";
        icon.src = this.correctIcon;
        this.mark.appendChild(text);
        this.mark.appendChild(icon);
    }
    setCallbacks() {
        this.showSolutionButton.addEventListener("click", (ev) => this.toggleSolution(geekieAnswers.getInfo().getSolutionObject()));
        this.showAnswerButton.addEventListener("click", (ev) => this.toggleAnswer(geekieAnswers.getInfo().getCorrectChoice()));
    }
    toggleSolution(solutionObject) {
        if (solutionObject.classList.contains("ng-hide")) {
            solutionObject.classList.remove("ng-hide");
            this.showSolutionButton.innerHTML = "Esconder Solução";
            this.solutionShown = true;
        }
        else {
            solutionObject.classList.add("ng-hide");
            this.showSolutionButton.innerHTML = "Mostrar Solução";
            this.solutionShown = false;
        }
    }
    toggleAnswer(answerObject) {
        var existingMark = document.getElementById("GeekieAnswersChoiceMark");
        if (existingMark) {
            if (existingMark.classList.contains("ng-hide")) {
                existingMark.classList.remove("ng-hide");
                this.getOptionText(answerObject).style.filter = "invert(67%) sepia(57%) saturate(571%) hue-rotate(80deg) brightness(93%) contrast(84%)";
                this.showAnswerButton.innerHTML = "Esconder Resposta";
                this.answerShown = true;
            }
            else {
                existingMark.classList.add("ng-hide");
                this.getOptionText(answerObject).style.filter = "none";
                this.showAnswerButton.innerHTML = "Mostrar Resposta";
                this.answerShown = false;
            }
        }
        else {
            this.mark.classList.remove("ng-hide");
            this.getOptionText(answerObject).style.filter = "invert(67%) sepia(57%) saturate(571%) hue-rotate(80deg) brightness(93%) contrast(84%)";
            answerObject.getElementsByClassName("geekieui-custom-form")[0].getElementsByClassName("radio-container")[0].getElementsByClassName("radio")[0].appendChild(this.mark);
            this.showAnswerButton.innerHTML = "Esconder Resposta";
            this.answerShown = true;
        }
    }
    getOptionText(choice) {
        var text = choice.getElementsByClassName("geekieui-custom-form")[0].getElementsByClassName("radio-container")[0].getElementsByClassName("radio")[0].getElementsByClassName("content")[0].children[0];
        return text;
    }
    update(solutionVisible) {
        if (this.answerShown && this.showAnswerButton.innerHTML != "Esconder Resposta")
            this.showAnswerButton.innerHTML = "Esconder Resposta";
        else if (this.showAnswerButton.innerHTML != "Mostrar Resposta")
            this.showAnswerButton.innerHTML = "Mostrar Resposta";
        if ((this.solutionShown || solutionVisible))
            this.showSolutionButton.innerHTML = "Esconder Solução";
        else
            this.showSolutionButton.innerHTML = "Mostrar Solução";
    }
    destroy() {
        if (this.setup) {
            this.showSolutionButton.remove();
            this.showAnswerButton.remove();
            this.buttonList.remove();
            this.title.remove();
            this.uiArea.remove();
            this.showSolutionButton = null;
            this.showAnswerButton = null;
            this.buttonList = null;
            this.title = null;
            this.uiArea = null;
            this.setup = false;
        }
    }
    isSetup() {
        return this.setup;
    }
}
class GeekieAnswers {
    constructor(correctIcon) {
        this.stepElement = document.getElementsByClassName("step")[0];
        this.uiManager = new UIManager(this.stepElement, correctIcon);
        this.observer = new MutationObserver((mutators) => this.update(mutators));
        this.observer.observe(this.stepElement, { childList: true, subtree: true, characterData: true, attributes: true });
        this.update();
    }
    update(mutators) {
        if (mutators) {
            for (var i = 0; i < mutators.length; i++) {
                var m = mutators[i];
                if (m.target instanceof HTMLButtonElement)
                    return;
            }
        }
        if (document.getElementsByClassName("item")[0]) {
            this.info = new QuestionInfo();
            if (!this.uiManager.isSetup())
                this.uiManager.setupUI();
            this.uiManager.update(this.info.isSolutionVisible());
        }
        else
            this.uiManager.destroy();
    }
    getInfo() {
        return this.info;
    }
}
var geekieAnswers;
document.addEventListener("loadGeekieAnswers", (event) => {
    if (document.getElementsByClassName("item")[0]) {
        var scope = angular.element(document.getElementsByClassName("item")[0]).scope();
        if ("diagnosis" in scope && scope["diagnosis"]["recommendedByGeekie"])
            return;
    }
    geekieAnswers = new GeekieAnswers(event.detail["correctMarkIcon"]);
});
//# sourceMappingURL=AnswerResolver.js.map