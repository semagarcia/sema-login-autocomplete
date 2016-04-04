/*
 * Esta función se ejecutará cada vez que se reinicia/recarga la extensión.
 * Así, se setea el listener asociado a cuando se actualiza la URL y coincide con
 * la entrada del content_script, y ejecutará el fichero js indicado.
 */

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action && request.action === 'inject') {
		chrome.tabs.executeScript(null, {
		    code: 'var request = ' + JSON.stringify(request)
		}, function() {
			chrome.tabs.executeScript(null, { file: "libs/jquery.js" }, function() {
		    	chrome.tabs.executeScript(null, { file : 'browser/browser-inject.js' });
		    });
		});
	} else if(request.action && request.action === 'copyToFile') {
		var a = document.createElement("a");
	    var file = new Blob([request.content], { type: 'text/plain' });
	    a.href = URL.createObjectURL(file);
	    a.download = 'semaSLA exported configuration.json';
	    a.click();
	} else if(request.action && request.action === 'copyToClipboard') {
		var copyFrom = document.createElement("textarea");
		copyFrom.textContent = request.content;
		document.body.appendChild(copyFrom);
		copyFrom.focus();
		copyFrom.select();
		document.execCommand('Copy');
		document.body.removeChild(copyFrom);
	}

	return true;
});

chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
      });


/*chrome.browserAction.onClicked.addListener(function(activeTab) {
	console.log('BrowserAction clicked: ', activeTab);
    chrome.tabs.sendMessage(activeTab.id, {action: "XXX"}); // Send a message to content_scipt

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	console.log("tabs.query");
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
		});
});*/
