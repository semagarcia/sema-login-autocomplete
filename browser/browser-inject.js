(function(){
	// Check if the selector find a coincidence
	var usernameNode = (request && request.userSelector) ? $(request.userSelector) : '',
		passwordNode = (request && request.passSelector) ? $(request.passSelector) : '',
		userFound = true,
		passFound = true,
		LOG_PREFIX = '[SEMA-SLA] ';
	
	console.log(LOG_PREFIX + 'Injecting credentials...');
	
	//	Inject username
	if(usernameNode && usernameNode.length > 0) {
		$(usernameNode[0]).val(request.username);  // Inject user
	} else {
		userFound = false;
	}

	// Inject password
	if(passwordNode && passwordNode.length > 0) {
		$(passwordNode[0]).val(request.password);  // Inject pass
	} else {
		passFound = false;
	}

	// Check if some field has not been injected
	if(!userFound && !passFound) {
		alert(LOG_PREFIX + chrome.i18n.getMessage('msgInjectNotFound'));
	} else if(!userFound && passFound) {
		alert(LOG_PREFIX + chrome.i18n.getMessage('msgInjectUsernameNotFound'));
	} else if(userFound && !passFound) {
		alert(LOG_PREFIX + chrome.i18n.getMessage('msgInjectPasswordNotFound'));
	}
})();