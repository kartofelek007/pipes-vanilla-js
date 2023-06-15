import {tileTypes} from "./tile-types";
import EventObserver from "./eventObserver";

export default class Pipe {
    constructor({icon, type, inactive = false, active}) {
        this.signals = {
            onRotateEnd: new EventObserver()
        };

        this._check = false;
        this._icon = icon;
        this._type = type;
        this._points = this._getPipePoints();
        this._pipeTypesGroup = this._getPipeTypesGroup();
        this._active = active;
        this._inactive = inactive;
        this._draggable = false;

        this._DOM = {};
        this._DOM.div = Pipe.generateHTML(this._active, this._inactive, this._type);
        this.bindEvents();
    }

    _getPipeTypesGroup() {
        return tileTypes.find(pipe => pipe.type === this._type).types;
    }

    _getPipePoints() {
        return tileTypes.find(tile => tile.type === this._type).points;
    }

    changePipe() {
        const min = Math.min(...this._pipeTypesGroup);
        const max = Math.max(...this._pipeTypesGroup);

        this._type++;

        if (this._type > max) {
            this._type = min;
        }

        this._pipeTypesGroup = this._getPipeTypesGroup();
        this._points = this._getPipePoints();
        this._DOM.div.dataset.type = this._type;
    }

    _clickOnTile(e) {
        if (!this._inactive) {
            const rotate = parseInt(getComputedStyle(this._DOM.div).getPropertyValue("--rotate"));
            this._DOM.div.style.setProperty("--rotate", `${rotate + 90}deg`)

            this.changePipe();

            this._DOM.div.addEventListener("transitionend", e => {
                this.signals.onRotateEnd.emit(this._DOM.div);
            }, {once: true})
        }
    }

    static generateHTML(active, inactive, type) {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="pipe-inside">
                <div class="pipe-active-textures">
                    <div class="pipe-active-texture1"></div>
                    <div class="pipe-active-texture2"></div>
                </div>
            </div>
        `;

        div.classList.add("pipe");

        if (active) {
            div.classList.add("pipe-active");
        }
        if (inactive) {
            div.dataset.inactive = true;
        }
        div.dataset.type = type;

        return div;
    }

    get check() {
        return this._check;
    }

    set check(isCheck) {
        this._check = isCheck;
    }

    get points() {
        return this._points;
    }

    set points(newPoints) {
        if (typeof newPoints === "string") this._points = newPoints;
    }

    set active(isActive) {
        this._active = isActive;
        if (this._active) {
            this._DOM.div.classList.add("pipe-active");
        } else {
            this._DOM.div.classList.remove("pipe-active");
        }
    }

    get active() {
        return this._active;
    }

    get div() {
        return this._DOM.div;
    }

    set inactive(isInactive) {
        this._DOM.div.dataset.inactive = isInactive;
        this._inactive = isInactive;
    }

    set icon(icon) {
        this._icon = icon;
    }

    get icon() {
        return this._icon;
    }

    get type() {
        return this._type;
    }

    get inactive() {
        return this._inactive;
    }

    set draggable(isDrag) {
        this._DOM.div.draggable = isDrag;
        this._draggable = isDrag;
    }

    get draggable() {
        return this._draggable;
    }

    bindEvents() {
        this._clickOnTile = this._clickOnTile.bind(this);
        this._DOM.div.addEventListener("click", this._clickOnTile);
    }

    unbindEvents() {
        this._DOM.div.removeEventListener("click", this._clickOnTile);
    }
}