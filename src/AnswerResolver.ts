class QuestionInfo {
    private correctChoice: HTMLDivElement;
    private solutionObject: HTMLDivElement;
    private isHomeWork: boolean;
    private choices: HTMLDivElement[];
    private item: HTMLDivElement;

    constructor() {
        this.item = document.getElementsByClassName("item")[0] as HTMLDivElement;
        this.isHomeWork = window.location.href.includes("homework");
        this.choices = this.getChoices();
        this.correctChoice = this.getCorrectChoiceDiv();

        var solutionObjects = this.item.getElementsByClassName("solution");
        this.solutionObject = solutionObjects[solutionObjects.length - 1] as HTMLDivElement;
    }

    private getCorrectChoiceDiv(): HTMLDivElement {
        var id = angular.element(this.item).scope()["item"]["correctChoiceId"];

        for(var i = 0; i < this.choices.length; i++) {
            var choice = this.choices[i];

            var choiceId = angular.element(choice).scope()["choice"]["id"];
            if(choiceId == id) return choice;
        }

        return null;
    }

    private getChoices(): HTMLDivElement[] {
        var output = [];
        var elements = (this.item.getElementsByClassName("choices")[0] as HTMLDivElement).getElementsByClassName("choice");

        for(var i = 0; i < elements.length; i++) {
            var e = elements[i] as HTMLDivElement;
            output[i] = e;
        }

        return output;
    }

    public isSolutionVisible(): boolean {
        return angular.element(this.item).scope()["isSolutionVisible"]();
    }

    public isHomework() {
        return this.isHomeWork;
    }

    public getCorrectChoice() {
        return this.correctChoice;
    }

    public getSolutionObject() {
        return this.solutionObject;
    }
}

class UIManager {
    private uiArea: HTMLDivElement | null;
    private title: HTMLHeadingElement | null;
    private buttonList: HTMLUListElement | null;
    private showSolutionButton: HTMLButtonElement | null;
    private showAnswerButton: HTMLButtonElement | null;
    private elementToAppend: Element;

    private mark: HTMLDivElement;

    private setup: boolean;
    private correctIcon: string;

    private answerShown: boolean;
    private solutionShown: boolean;

    constructor(elementToAppend: Element, correctIcon: string) {
        this.buttonList = null;
        this.showSolutionButton = null;
        this.showAnswerButton = null;

        this.elementToAppend = elementToAppend;
        this.correctIcon = correctIcon;

        this.answerShown = false;
        this.solutionShown = false;

        this.setup = false;
    }

    public setupUI() {
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
        this.title.innerHTML = "GeekieAnswers"

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

    private createMark() {
        this.mark = document.createElement("div");

        var text = document.createElement("p");
        var icon = document.createElement("img");

        this.mark.id = "GeekieAnswersChoiceMark";

        text.innerHTML = "Resposta correta";
        icon.src = this.correctIcon;

        this.mark.appendChild(text);
        this.mark.appendChild(icon);
    }

    private setCallbacks() {
        this.showSolutionButton.addEventListener("click", (ev) => this.toggleSolution(geekieAnswers.getInfo().getSolutionObject()));
        this.showAnswerButton.addEventListener("click", (ev) => this.toggleAnswer(geekieAnswers.getInfo().getCorrectChoice()));
    }

    public toggleSolution(solutionObject: HTMLDivElement) {
        if(solutionObject.classList.contains("ng-hide")) {
            solutionObject.classList.remove("ng-hide");

            this.showSolutionButton.innerHTML = "Esconder Solução";
            this.solutionShown = true;
        } else {
            solutionObject.classList.add("ng-hide");

            this.showSolutionButton.innerHTML = "Mostrar Solução";
            this.solutionShown = false;
        }
    }

    public toggleAnswer(answerObject: HTMLDivElement) {
        var existingMark = document.getElementById("GeekieAnswersChoiceMark");

        if(existingMark) {
            if(existingMark.classList.contains("ng-hide")) { 
                existingMark.classList.remove("ng-hide"); 
                this.getOptionText(answerObject).style.filter = "invert(67%) sepia(57%) saturate(571%) hue-rotate(80deg) brightness(93%) contrast(84%)"; 

                this.showAnswerButton.innerHTML = "Esconder Resposta";
                this.answerShown = true;
            } else { 
                existingMark.classList.add("ng-hide"); 
                this.getOptionText(answerObject).style.filter = "none";

                this.showAnswerButton.innerHTML = "Mostrar Resposta";
                this.answerShown = false;
            }
        } else {
            this.mark.classList.remove("ng-hide");
            this.getOptionText(answerObject).style.filter = "invert(67%) sepia(57%) saturate(571%) hue-rotate(80deg) brightness(93%) contrast(84%)"; 

            answerObject.getElementsByClassName("geekieui-custom-form")[0].getElementsByClassName("radio-container")[0].getElementsByClassName("radio")[0].appendChild(this.mark);

            this.showAnswerButton.innerHTML = "Esconder Resposta";
            this.answerShown = true;
        }
    }

    private getOptionText(choice: Element) {
        var text = choice.getElementsByClassName("geekieui-custom-form")[0].getElementsByClassName("radio-container")[0].getElementsByClassName("radio")[0].getElementsByClassName("content")[0].children[0] as HTMLSpanElement;
        return text;
    }

    public update(solutionVisible: boolean) {
        if(this.answerShown && document.getElementById("GeekieAnswersChoiceMark") && document.getElementById("GeekieAnswersChoiceMark").classList.contains("ng-hide")) this.showAnswerButton.innerHTML = "Esconder Resposta";
        else this.showAnswerButton.innerHTML = "Mostrar Resposta";

        if((this.solutionShown || solutionVisible)) this.showSolutionButton.innerHTML = "Esconder Solução";
        else this.showSolutionButton.innerHTML = "Mostrar Solução";
    }

    public destroy() {
        if(this.setup) {
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

    public isSetup() {
        return this.setup;
    }
}

class GeekieAnswers {
    private info: QuestionInfo;
    private uiManager: UIManager;
    private stepElement: Element;
    private observer: MutationObserver;

    constructor(correctIcon: string) {
        this.stepElement = document.getElementsByClassName("step")[0];

        this.uiManager = new UIManager(this.stepElement, correctIcon);

        this.observer = new MutationObserver((mutators) => this.update(mutators));
        this.observer.observe(this.stepElement, { childList: true, subtree: true, characterData: true, attributes: true });

        this.update();
    }

    public update(mutators?: MutationRecord[]) {
        if(mutators) {
            for(var i = 0; i < mutators.length; i++) {
                var m = mutators[i];
                if(m.target instanceof HTMLButtonElement) return;
            }
        }

        if(document.getElementsByClassName("item")[0]) {
            this.info = new QuestionInfo();
            if(!this.uiManager.isSetup()) this.uiManager.setupUI();

            this.uiManager.update(this.info.isSolutionVisible());
        } else this.uiManager.destroy();
    }

    public getInfo() {
        return this.info;
    }
}

var geekieAnswers: GeekieAnswers;

document.addEventListener("loadGeekieAnswers", (event: CustomEvent) => {
    if(document.getElementsByClassName("item")[0]) {
        var scope = angular.element(document.getElementsByClassName("item")[0]).scope();
        if("diagnosis" in scope && scope["diagnosis"]["recommendedByGeekie"]) return;
    }

    geekieAnswers = new GeekieAnswers(event.detail["correctMarkIcon"]);
});