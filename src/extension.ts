'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const gunControllers : GunController[] = [
        new IntelliSenseGunController(vscode.workspace.getConfiguration())
    ]

    let gunsOff = vscode.commands.registerCommand('withoutGuns.gunsOff', () => {
        vscode.window.showInformationMessage('We just took your guns. That\'s for your own good.');
        gunControllers.forEach(gunController => gunController.takeTheGun());
    });

    let gunsOn = vscode.commands.registerCommand('withoutGuns.gunsOn', () => {
        vscode.window.showInformationMessage('You got your guns back. Be careful what you do with them.');
        gunControllers.forEach(gunController => gunController.giveTheGunBack());
    });

   context.subscriptions.push(gunsOff);
   context.subscriptions.push(gunsOn);
}

interface GunController {
    takeTheGun();
    giveTheGunBack();
}

class IntelliSenseGunController implements GunController {
    private readonly configuration: vscode.WorkspaceConfiguration;

    private readonly initialQuickSuggestions : boolean;
    private readonly initialWordBasedSuggestions : boolean;
    private readonly initialParameterHints : boolean;
    private readonly initialsuggestOnTriggerCharacters : boolean;

    constructor(configuration : vscode.WorkspaceConfiguration) {
        this.configuration = configuration;

        this.initialQuickSuggestions = configuration.get("editor.quickSuggestions");
        this.initialWordBasedSuggestions = configuration.get("editor.wordBasedSuggestions");
        this.initialParameterHints = configuration.get("editor.parameterHints");
        this.initialsuggestOnTriggerCharacters = configuration.get("editor.suggestOnTriggerCharacters");
    }

    takeTheGun() {
        this.configuration.update("editor.quickSuggestions", false);
        this.configuration.update("editor.wordBasedSuggestions", false);
        this.configuration.update("editor.parameterHints", false);
        this.configuration.update("editor.suggestOnTriggerCharacters", false);
    }

    giveTheGunBack() {
        this.configuration.update("editor.quickSuggestions", this.initialQuickSuggestions);
        this.configuration.update("editor.wordBasedSuggestions", this.initialWordBasedSuggestions);
        this.configuration.update("editor.parameterHints", this.initialParameterHints);
        this.configuration.update("editor.suggestOnTriggerCharacters", this.initialsuggestOnTriggerCharacters);
    }
}