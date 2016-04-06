
var browserActionData = {};

$(document).ready(function() {
	loadLanguageLiterals();
	initBrowserActionDropdowns();

	//
	$('#environmentValues').on('change', function() {
  		// Clean previous values
  		cleanInfoFields();  

  		// Get the credentials for such environment selected
  		var envSelected = Number($(this).val());
  		slaUtils.getUsersByEnvironment(envSelected, function(credentials) {
	  		// Get the reference and cache it in order to operate with better performance
			var $usersDropDown = $('#userPassValues');

	  		// When the environment changes, update the related dropdown (users of that env)
	  		$usersDropDown.append('<option value="0">- ' + translate('msgSelectAnUser') + '... -</option>');

	  		// Fill the related dropdown (users)
			_.each(credentials, function(userCred) {
				$usersDropDown.append('<option>' + userCred.username + '</option>');
			});
  		});
	});

	//
	$('#userPassValues').on('change', function() {
		var envId = Number($('#environmentValues').val()),
			user = $('#userPassValues option:selected').text();
		
		slaUtils.getWholeInfoFromUser(envId, user, function(credentials) {
  			browserActionData = (credentials && credentials.length > 0) ? credentials[0] : {};
			$('#selectedUserInfoDescription').text(browserActionData.description);
	    	$('#selectedUserInfo').fadeIn('slow');
		});
	});

	//
	$('#home').click(function() {
		$('#aboutContent').fadeOut('fast', function() {
			$('#mainContent').fadeIn('fast');
		});
	});

	//
	$('#injectLoginCredentials').click(function() {
		//chrome.extension.sendMessage({
		chrome.runtime.sendMessage({
			action : 'inject',
			username : browserActionData.username, 
			password : browserActionData.password,
			userSelector:  browserActionData.userSelector,
			passSelector : browserActionData.passSelector
		});
	});

	//
	$('#configure').click(function() {
		if (chrome.runtime.openOptionsPage) {
			// New way to open options pages, if supported (Chrome 42+)
			chrome.runtime.openOptionsPage();
		} else {
			// Reasonable fallback
			window.open(chrome.runtime.getURL('src/options/options.html'));
		}
	});

	//
	$('#cleanData').click(function() {
		$('#mainContent').fadeOut('fast', function() {
			$('#cleanDataContent').fadeIn('fast');
		});
	});

	//
	$('#cleanDataYes').click(function() { 
		$('#mainContent, #cleanDataContent').fadeOut('fast', function() {
			slaUtils.deleteConfiguration();	
			$('#mainContent').fadeIn('slow');
		});
	});

	//
	$('#cleanDataNo').click(function() {  
		$('#mainContent, #cleanDataContent').fadeOut('fast', function() {
			$('#mainContent').fadeIn('slow');
		});
	});

	//
	$('#help').click(function() {
		alert('helps');
	});

	//
	$('#exportToFile').click(function() {
		slaUtils.getAllData(function(configuration) {
			chrome.runtime.sendMessage({
				action : 'copyToFile',
				content : JSON.stringify(configuration['sema-sla'])
			});
		});
	});

	//
	$('#exportToClipboard').click(function() {
		slaUtils.getAllData(function(configuration) {
			chrome.runtime.sendMessage({
				action : 'copyToClipboard',
				content : JSON.stringify(configuration['sema-sla'])
			});
		});
	});

	$('#importFromFile').click(function() {
		alert('This feature will be published in the next release!');
	});

	//
	$('#contact').click(function() {
		alert('Contactar');  // ToDo: reemplazar contenido y mostrar datos de contacto
	});

	//
	$('#fork').click(function() {
		chrome.tabs.update({
     		url: "https://github.com/semagarcia/sema-login-autocompleter"
		});
	});

	//
	$('#about').click(function() {
		$('#mainContent, #cleanDataContent').fadeOut('fast', function() {
			$('#aboutContent').fadeIn('fast');
		});
	});

});

// Auxiliar functions

function translate(key, insertIntoDOM) {
	if(insertIntoDOM) {
		$('#' + key).text(chrome.i18n.getMessage(key));
	} else {
		return chrome.i18n.getMessage(key);
	}
}

function loadLanguageLiterals() {
	translate('msgHomeDescription', true);
	translate('msgSelectEnvironment', true);
	translate('msgSelectEnvironmentOption', true);
	translate('msgSelectUser', true);
	translate('msgSelectCredsOption', true);
	translate('msgSlaHome', true);
	translate('msgLoginInject', true);
	translate('msgSettings', true);
	translate('msgMoreOptions', true);
	translate('msgCleanData', true);
	translate('msgChangeLang', true);
	translate('msgHelp', true);
	translate('msgExportSettings', true);
	translate('msgExportToFile', true);
	translate('msgExportToClipboard', true);
	translate('msgImportSettings', true);
	translate('msgImportFromFile', true);
	translate('msgSuggestComms', true);
	translate('msgContact', true);
	translate('msgGithubFork', true);
	translate('msgAbout', true);
}

function initBrowserActionDropdowns() {
	//
	cleanInfoFields();

	//
	slaUtils.getAllData(function(storedData) {
		_.each(storedData['sema-sla'].environments, function(env) {
			$('#environmentValues').append('<option value="' + env.envId + '">' + env.envName + '</option>');
		});
	});
}

function cleanInfoFields() {
	$('#userPassValues').html('');
	$('#selectedUserInfoDescription').text('');
}