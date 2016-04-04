(function(){
	// Check if the selector find a coincidence
	var usernameNode = (request && request.userSelector) ? $(request.userSelector) : '',
		passwordNode = (request && request.passSelector) ? $(request.passSelector) : '',
		userFound = true,
		passFound = true,
		LOG_PREFIX = '[SEMA-SLA] ';
	
	console.log(LOG_PREFIX + 'Injecting credentials...');
	
	//	
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

	// 
	if(!userFound && !passFound) {
		alert(LOG_PREFIX + 'Neither user field nor pass field have been found...');
		console.log(1);
	} else if(!userFound && passFound) {
		alert(LOG_PREFIX + 'User field not found with the given selector');
		console.log(2);
	} else if(userFound && !passFound) {
		alert(LOG_PREFIX + 'Password field not found with the given selector');
		console.log(3);
	}
})();