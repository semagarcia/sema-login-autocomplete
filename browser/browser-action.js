// Global structure object
var browserActionData = {};

$(document).ready(function() {
	loadLanguageLiterals();
	initBrowserActionDropdowns();

	// Listener to handle the changes over environments selector
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

	// Listener to fill the description when the user selects one credential
	$('#userPassValues').on('change', function() {
		var envId = Number($('#environmentValues').val()),
			user = $('#userPassValues option:selected').text();
		
		slaUtils.getWholeInfoFromUser(envId, user, function(credentials) {
  			browserActionData = (credentials && credentials.length > 0) ? credentials[0] : {};
			$('#selectedUserInfoDescription').text(browserActionData.description);
	    	$('#selectedUserInfo').fadeIn('slow');
		});
	});

	// Navigate to home
	$('#home').click(function() {
		$('#aboutContent').fadeOut('fast', function() {
			$('#mainContent').fadeIn('fast');
		});
	});

	// Inject credentials into webpage
	$('#injectLoginCredentials').click(function() {
		chrome.runtime.sendMessage({
			action : 'inject',
			username : browserActionData.username, 
			password : browserActionData.password,
			userSelector:  browserActionData.userSelector,
			passSelector : browserActionData.passSelector
		});
	});

	// Open configuration window/popup
	$('#configure').click(function() {
		if (chrome.runtime.openOptionsPage) {
			// New way to open options pages, if supported (Chrome 42+)
			chrome.runtime.openOptionsPage();
		} else {
			// Reasonable fallback
			window.open(chrome.runtime.getURL('src/options/options.html'));
		}
	});

	// Clean area
	$('#cleanData').click(function() {
		$('#mainContent').fadeOut('fast', function() {
			$('#cleanDataContent').fadeIn('fast');
		});
	});

	// Click handler to confirm
	$('#cleanDataYes').click(function() { 
		$('#cleanDataContent').fadeOut('fast', function() {
			initBrowserActionDropdowns();
			slaUtils.deleteConfiguration(function(err) {
				$('#mainContent').fadeIn('slow');
				if(err) {
					alert(translate('msgErrorDeletingConfiguration') + ' (' + err + ')');
				}
			});	
		});
	});

	// Click handler to cancel
	$('#cleanDataNo').click(function() {  
		$('#cleanDataContent').fadeOut('fast', function() {
			$('#mainContent').fadeIn('slow');
		});
	});

	// Navigate to GitHub page
	$('#help').click(function() {
		chrome.tabs.update({
     		url: "https://semagarcia.github.io/sema-login-autocompleter"
		});
	});

	// Export configuration to file
	$('#exportToFile').click(function() {
		slaUtils.getAllData(function(configuration) {
			chrome.runtime.sendMessage({
				action : 'copyToFile',
				content : JSON.stringify(configuration['sema-sla'])
			});
		});
	});

	// Export configuration to clipboard 
	$('#exportToClipboard').click(function() {
		slaUtils.getAllData(function(configuration) {
			chrome.runtime.sendMessage({
				action : 'copyToClipboard',
				content : JSON.stringify(configuration['sema-sla'])
			});
		});
	});

	// Import configuration from file
	$('#importFromFile').click(function() {
		alert('This feature will be published in the next release!');
	});

	// Contact with owner
	$('#contact').click(function() {
		chrome.tabs.update({
     		url: "mailto:sema.login.autocomplete@gmail.com?subject=[Contact]%20SLA-Extension&body=[Your message here]"
		});
	});

	// Fork the project
	$('#fork').click(function() {
		chrome.tabs.update({
     		url: "https://github.com/semagarcia/sema-login-autocompleter"
		});
	});

	// About area
	$('#about').click(function() {
		$('#mainContent, #cleanDataContent').fadeOut('fast', function() {
			$('#aboutContent').fadeIn('fast');
		});
	});

});


// ------------------------
//   Auxiliar functions
// ------------------------

// Load all I18N literals
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
	translate('msgAboutContent1', true);
	translate('msgAboutContent2', true);
	translate('msgAboutContent3', true);
	translate('msgAboutContent4', true);
}

// Translate literals based on user's locale (if insertIntoDOM is true, the text will be replaced into DOM)
function translate(key, insertIntoDOM) {
	if(insertIntoDOM) {
		$('#' + key).text(chrome.i18n.getMessage(key));
	} else {
		return chrome.i18n.getMessage(key);
	}
}

// Clean fields and init selectors
function initBrowserActionDropdowns() {
	cleanInfoFields();
	slaUtils.getAllData(function(storedData) {
		_.each(storedData['sema-sla'].environments, function(env) {
			$('#environmentValues').append('<option value="' + env.envId + '">' + env.envName + '</option>');
		});
	});
}

// Clean the second selector and the description area
function cleanInfoFields() {
	$('#userPassValues').html('');
	$('#selectedUserInfoDescription').text('');
}