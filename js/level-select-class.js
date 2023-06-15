import {Page} from "./page-class";
import levels from "./levels";
import EventObserver from "./eventObserver";

export class LevelSelect extends Page {
    constructor() {
        super();
        this._DOM = {};
        this.signals = {
            onLevelSelect: new EventObserver(),
        };
        this._levelUnlocked = [0]; //levele odblokowane

        this._render();
        this.hide();
    }

    _render() {
        this._DOM.div = document.createElement("div");
        this._DOM.div.classList.add("level-select");
        this._DOM.div.innerHTML = `
            <h2 class="level-select-title">
                Wybierz poziom
            </h2>
            <div class="level-select-buttons"></div>
        `;
        this._DOM.buttonsCnt = this._DOM.div.querySelector(".level-select-buttons");
        this._renderButtons();
        document.body.append(this._DOM.div);
    }

    _renderButtons() {
        this._DOM.buttonsCnt.innerHTML = "";
        const fragment = new DocumentFragment();
        levels.forEach((level, i) => {
            const button = document.createElement("button");
            button.classList.add("level-select-button");
            button.disabled = !this._levelUnlocked.includes(i);
            button.innerHTML = `
                <span>poziom</span>
                <strong>${i + 1}</strong>
            `;
            fragment.append(button);
        });
        this._DOM.buttonsCnt.append(fragment);
        this._bindEvents();
    }

    _bindEvents() {
        const buttons = this._DOM.div.querySelectorAll(".level-select-button");
        buttons.forEach((btn, i) => {
            btn.addEventListener("click", e => {
                this.hide();
                this.signals.onLevelSelect.emit(i);
            })
        })
    }

    show() {
        this._DOM.div.style.display = "flex";
    }

    hide() {
        this._DOM.div.style.display = "none";
    }

    unlockLevel(levelNr) {
        if (!this._levelUnlocked.includes(levelNr)) {
            this._levelUnlocked.push(levelNr);
            this._renderButtons();
            return true;
        }
        return false;
    }
}