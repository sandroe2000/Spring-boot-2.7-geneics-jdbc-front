var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../../base/browser/dom.js';
import { HoverAction } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
const $ = dom.$;
let EditorHoverStatusBar = class EditorHoverStatusBar extends Disposable {
    get hasContent() {
        return this._hasContent;
    }
    constructor(_keybindingService) {
        super();
        this._keybindingService = _keybindingService;
        this.actions = [];
        this._hasContent = false;
        this.hoverElement = $('div.hover-row.status-bar');
        this.hoverElement.tabIndex = 0;
        this.actionsElement = dom.append(this.hoverElement, $('div.actions'));
    }
    addAction(actionOptions) {
        const keybinding = this._keybindingService.lookupKeybinding(actionOptions.commandId);
        const keybindingLabel = keybinding ? keybinding.getLabel() : null;
        this._hasContent = true;
        const action = this._register(HoverAction.render(this.actionsElement, actionOptions, keybindingLabel));
        this.actions.push(action);
        return action;
    }
    append(element) {
        const result = dom.append(this.actionsElement, element);
        this._hasContent = true;
        return result;
    }
};
EditorHoverStatusBar = __decorate([
    __param(0, IKeybindingService)
], EditorHoverStatusBar);
export { EditorHoverStatusBar };
