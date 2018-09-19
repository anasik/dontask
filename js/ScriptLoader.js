"use strict";
//exports.__esModule = true;
    function ScriptLoader(container) {
        if (container === void 0) { container = document.head; }
        this.pendingScripts = [];
        this.embeddedScripts = [];
        this.container = container;
        if (!ScriptLoader.dummyScriptNode)
            ScriptLoader.dummyScriptNode = document.createElement("script");
    }
    ScriptLoader.prototype.stateChange = function () {
        if (this.pendingScripts.length === 0) {
            if (console && console.log)
                console.log("Got ready state for a non existent script: ", this);
            return;
        }
        var firstScript = this.pendingScripts[0];
        while (firstScript && firstScript.readyState === 'loaded') {
            firstScript.onreadystatechange = null;
            this.container.appendChild(firstScript);
            this.pendingScripts.shift();
            firstScript = this.pendingScripts[0];
        }
        if (this.pendingScripts.length === 0) {
            this.runEmbeddedScripts();
        }
    };
    ScriptLoader.prototype.loadSources = function (scripts) {
        if (scripts instanceof Array) {
            for (var i = 0; i < scripts.length; i++) {
                this.loadSource(scripts[i]);
            }
        }
        else {
            this.loadSource(scripts);
        }
    };
    ScriptLoader.prototype.loadTags = function (scripts) {
        if (scripts instanceof Array) {
            for (var i = 0; i < scripts.length; i++) {
                this.loadElement(scripts[i]);
            }
        }
        else {
            this.loadElement(scripts);
        }
    };
    ScriptLoader.prototype.loadSource = function (source) {
        var _this = this;
        if ('async' in ScriptLoader.dummyScriptNode) {
            var script_1 = document.createElement('script');
            script_1.async = false;
            this.pendingScripts.push(script_1);
            script_1.addEventListener('load', function (e) { return _this.onScriptLoaded(script_1); });
            script_1.src = source;
            this.container.appendChild(script_1);
        }
        else if (ScriptLoader.dummyScriptNode.readyState) { // IE<10
            var script = document.createElement('script');
            this.pendingScripts.push(script);
            script.onreadystatechange = this.stateChange;
            script.src = source;
        }
        else {
            var script_2 = document.createElement('script');
            script_2.defer = true;
            this.pendingScripts.push(script_2);
            script_2.addEventListener('load', function (e) { return _this.onScriptLoaded(script_2); });
            script_2.src = source;
            this.container.appendChild(script_2);
        }
    };
    ScriptLoader.prototype.loadElement = function (tag) {
        if (tag.src) {
            this.loadSource(tag.src);
            return;
        }
        var script = document.createElement('script');
        script.text = tag.text;
        this.embeddedScripts.push(script);
    };
    ScriptLoader.prototype.onScriptLoaded = function (script) {
        this.pendingScripts.pop();
        if (this.pendingScripts.length === 0) {
            this.runEmbeddedScripts();
        }
    };
    ScriptLoader.prototype.runEmbeddedScripts = function () {
        for (var i = 0; i < this.embeddedScripts.length; i++) {
            this.container.appendChild(this.embeddedScripts[i]);
        }
        while (this.embeddedScripts.length > 0) {
            this.embeddedScripts.pop();
        }
    };
