(function(){
	console.log('[SEMA-SLA] [INFO] Injecting credentials...');
	


	// Check if the selector find a coincidence




	// Inject user
	var usernameNode = $(request.userSelector);
	if(usernameNode && usernameNode.length > 0) {
		$(usernameNode[0]).val(request.username);
	} 

	// Inject password
	$(request.passSelector).val(request.password);
})();