
// Init objects and load the data previously loaded
//document.addEventListener('DOMContentLoaded', restore_options);

(function(slaUtils) {

	var TAB = { envs : 'envs', users : 'users' };

	//window.addEventListener('DOMContentLoaded', function () {
	window.addEventListener('load', function () { 
		
	});

	//
	$(document).ready(function() {
		//
		loadLanguageLiterals();
		reloadEnvSelector();

		// Add a new environment
		$('#b1').click(function() {
			var newEnv = $('#addNewEnv');
			if(newEnv.val()) {
				slaUtils.addNewEnvironment(newEnv.val(), function(err) {
					if(err) {
						failedOperation(TAB.envs, translate('msgAnErrorHasOcurred') + ' (' + err + ')');
					} else {
						successOperation(TAB.envs, translate('msgEnvAddedOK'));
						cleanInputField(newEnv);
					}
				});
			} else {
				warningMessage(TAB.envs, translate('msgEnvEmptyName'));
			}
		});

		// Detect when an user select an environment to modify (help the user writting it into text field)
		$('#environmentModifySelector').change(function() {
			$('#envToModify').val($(this).find("option:selected").text());
		});

		// Modify an environment
		$('#b2').click(function() {  // OK
			var envToModify = $('#envToModify'),
				selectedEnv = $('#environmentModifySelector');
			if(envToModify.val() && envToModify.val() !== selectedEnv.val()) {
				slaUtils.modifyEnvironment(selectedEnv.val(), envToModify.val(), function(err) {
					if(err) {
						failedOperation(TAB.envs, translate('msgAnErrorHasOcurred') + ' (' + err + ')');
					} else {
						successOperation(TAB.envs, translate('msgEnvModifiedOK'));
						cleanInputField(envToModify);
					}
				});
			} else {  // Error
				warningMessage(TAB.envs, translate('msgEnvNameNeeded'));
			}
		});

		// Delete an environment
		$('#b3').click(function() {
			var selectedOption = $('#environmentDeleteSelector').val();
			if(selectedOption != 0) {
				slaUtils.deleteEnvironment(selectedOption, function(err) {
					if(err) {
						failedOperation(TAB.envs, translate('msgAnErrorHasOcurred') + ' (' + err + ')');
					} else {
						successOperation(TAB.envs, translate('msgEnvDeletedOK'));
					}
				});
			} else {
				warningMessage(TAB.envs, translate('msgEnvDeleteNoSelectedItem'));
			}
		});

		// Create a new user credentials
		$('#b4').click(function() {
			var user = $('#username').val(),
				pass = $('#password').val(),
				userSelector = $('#userSelector').val(),
				passSelector = $('#passSelector').val(),
				description = $('#desc').val(),
				envId = Number($('#newUserEnvSelector').val());
			
			// If there is an error, this function will automatically show the specific error message
			if(areCorrectMandatoryFields(envId, user, pass)) {
				slaUtils.addNewUserCredentials(user, pass, userSelector, passSelector, description, envId, function(err) {
					if(err) {
						failedOperation(TAB.users, translate('msgAnErrorHasOcurred') + ' (' + err + ')');
					} else {
						successOperation(TAB.users, translate('msgCredentialsAddedOK'));
						restartCredentialForm('add');
					}
				});
			} 
		});

		//
		$('#modifyUserEnvSelector').change(function() {
			if(Number($('#modifyUserEnvSelector').val()) !== 0) {
				loadUserCredentialsSelector('modifyUserEnvSelector', 'modifyUserSelector');
				$('#modifyUserCredentialsForm').slideDown('slow');
			} else {
				removeUsersFromCredentialSelector('modifyUserSelector');
				restartCredentialForm('modify');
			}
		});

		$('#modifyUserSelector').change(function() {
			if(Number($('#modifyUserEnvSelector').val()) !== 0) {
				var envId = Number($('#modifyUserEnvSelector').val()),
					username = $('#modifyUserSelector option:selected').text();
				slaUtils.getWholeInfoFromUser(envId, username, function(userCredentials) {
					if(userCredentials && userCredentials.length > 0) {
						$('#m_username').val(userCredentials[0].username);
						$('#m_password').val(userCredentials[0].password);
						$('#m_userSelector').val(userCredentials[0].userSelector);
						$('#m_passSelector').val(userCredentials[0].passSelector);
						$('#m_desc').val(userCredentials[0].description);
					}
				});
			}
		});

		//
		$('#deleteUserEnvSelector').change(function() {
			if(Number($('#deleteUserEnvSelector').val()) !== 0) {
				loadUserCredentialsSelector('deleteUserEnvSelector', 'deleteUserSelector');
			} else {
				removeUsersFromCredentialSelector('deleteUserSelector');
			}
		});

		// Modify an existing user credentials
		$('#b5').click(function() {
			var user = $('#m_username').val(),
				pass = $('#m_password').val(),
				userSelector = $('#m_userSelector').val(),
				passSelector = $('#m_passSelector').val(),
				description = $('#m_desc').val(),
				envId = Number($('#modifyUserEnvSelector').val()),
				olderUsername = $('#modifyUserSelector option:selected').text();
			
			// If there is an error, this function will automatically show the specific error message
			if(areCorrectMandatoryFields(envId, user, pass)) {
				slaUtils.modifyUserCredentials(user, pass, userSelector, passSelector, description, envId, olderUsername, function(err) {
					if(err) {
						failedOperation(TAB.users, translate('msgAnErrorHasOcurred') + ' (' + err + ')');
					} else {
						successOperation(TAB.users, translate('msgCredentialsModifiedOK'));
						removeUsersFromCredentialSelector('modifyUserSelector');
						restartCredentialForm('modify');
					}
				});
			} 
		});

		// Delete user credentials
		$('#b6').click(function() {
			var envId = Number($('#deleteUserEnvSelector').val()),
				username = $('#deleteUserSelector').val();

			//
			if(envId === 0) {
				failedOperation(TAB.users, translate('msgSelectAnEnvironment'));
			} else if(username === '0') {
				failedOperation(TAB.users, translate('msgSelectCredentialsToDelete'));
			} else {
				slaUtils.deleteUserCredentials(envId, username, function(err) {
					if(err) {
						failedOperation(TAB.users, translate('msgAnErrorHasOcurred') + ' (' + err + ')');
					} else {
						successOperation(TAB.users, translate('msgCredentialsDeletedOK'));
						removeUsersFromCredentialSelector('deleteUserSelector');
						loadUserCredentialsSelector('deleteUserEnvSelector', 'deleteUserSelector');
					}
				});
			}
		});

		//
		$('#optionTabs li').click(function(e) {
			// Tabs treatment - show and hide the tab correspondent
			if(!$(this).hasClass('active')) {
				var clickedTab = $(this).attr('class').split(' ')[1];
				$('.tabs').removeClass('active');
				$('.content-option-tab').hide();
				$(this).addClass('active');	
				$('#' + clickedTab).show();
			}
		});
	});

	function successOperation(tab, succesfullMessage) {
		showAlertMessage(tab, 'success', succesfullMessage);
		reloadEnvSelector();
	}

	function failedOperation(tab, errorMessage) {
		showAlertMessage(tab, 'danger', errorMessage);
	}

	function warningMessage(tab, warnMessage) {
		showAlertMessage(tab, 'warning', warnMessage);
	}

	function scheduleAutoCloseAlertMessage(tab) {
		setTimeout(function() {
			if(tab === TAB.envs)
				($($('#envErrorAlertContainer').children()[0])).alert('close');
			else
				($($('#userErrorAlertContainer').children()[0])).alert('close');
		}, 3000);
	}

	function reloadEnvSelector() {
		$('[data-selector="envSelector"] option[value!="0"]').each(function() {
			$(this).remove();
		});
		slaUtils.getEnvironments(function(environments) {
			_.each(environments, function(env) {
				$('<option value="' + env.envId + '">' + env.envName + '</option>').appendTo('[data-selector="envSelector"]');
			});
		});
	}

	function loadUserCredentialsSelector(selectorId, userCredentialsId) {
		slaUtils.getUsersByEnvironment(Number($('#' + selectorId).val()), function(credentials) {
			// Get the reference and cache it in order to operate with better performance
			var $usersCredentials = $('#' + userCredentialsId);

	  		// Fill the related dropdown (users)
			_.each(credentials, function(userCred) {
				$usersCredentials.append('<option value="' + userCred.username + '">' + userCred.username + '</option>');
			});
		});
	}

	function removeUsersFromCredentialSelector(selectNode) {
		_.each($('#' + selectNode + ' option'), function(selectEntry) {
			if($(selectEntry).val() != 0) {  // Non-strict equal comparasion => we can avoid the casting to Number
				$(selectEntry).remove();
			}
		});
	}

	function restartCredentialForm(typeForm) {
		if(typeForm === 'modify') {
			$('#modifyUserCredentialsForm').slideUp('slow', function() {
				$('#m_username').val('');
				$('#m_password').val('');
				$('#m_userSelector').val('');
				$('#m_passSelector').val('');
				$('#m_desc').val('');
			});
		} else {
			$('#username').val('');
			$('#password').val('');
			$('#userSelector').val('');
			$('#passSelector').val('');
			$('#desc').val('');
		}
	}

	function cleanInputField(node) {
		node.val('');
	}

	function showAlertMessage(tab, errorType, errorMessage) {
		// Check the origin of the error (tab)
		var htmlErrorMessageDiv = 
				'<div class="alert alert-' + errorType + ' fade in" style="margin: 12px 0;">' +
				'	<a href="#" class="close fade in" data-dismiss="alert" aria-label="close">&times;</a><p>' + errorMessage + '</p>' +
				'</div>'

		//
		if(tab === TAB.envs) {
			// Remove another possible previous error message
			$('#envErrorAlertContainer').children().remove();
			$('#envErrorAlertContainer').append(htmlErrorMessageDiv);
		} else if(tab === TAB.users) {
			// Remove another possible previous error message
			$('#userErrorAlertContainer').children().remove();
			$('#userErrorAlertContainer').append(htmlErrorMessageDiv);
		} 

		//
		scheduleAutoCloseAlertMessage(tab);
	}

	//
	function areCorrectMandatoryFields(env, user, pass) {
		if(!env || env === 0) {
			failedOperation(TAB.users, translate('msgSelectOneEnvironment'));
			return false;
		} else if(!user) {
			failedOperation(TAB.users, translate('msgUsernameNeeded'));
			return false;
		} else if(!pass) {
			failedOperation(TAB.users, translate('msgPasswordNeeded'));
			return false;
		} else {
			return true;
		}
	}

	//
	function loadLanguageLiterals() {
		translate('msgPreferenceTitle', true);
		translate('msgPreferencesIntroduction', true);
		translate('msgEnvPreferencesTab', true);
		translate('msgEnvironments', true);
		translate('msgCredentials', true);
		translate('msgPreferences', true);
		translate('msgAddNewEnv', true);
		translate('msgModifyEnv', true);
		translate('msgDeleteEnv', true);
		translate('msgCreateNewEnvTitle', true);
		translate('msgEnvLabel', true);
		translate('msgAddEnvButton', true);
		translate('msgModifyEnvTitle', true);
		translate('msgModifyEnvSelectorLabel', true);
		translate('msgModifyEnvLabel', true);
		translate('msgModifyEnvDefaultOption', true);
		translate('msgDeleteEnvSelectorLabel', true);
		translate('msgModifyEnvButton', true);
		translate('msgDeleteEnvTitle', true);
		translate('msgDeleteEnvSelectorLabel', true);
		translate('msgDeleteEnvDefaultOption', true);
		translate('msgDeleteEnvButton', true);
		translate('msgUserCredsPreferencesTab', true);
		translate('msgAddNewUser', true);
		translate('msgModifyUser', true);
		translate('msgDeleteUser', true);
		translate('msgCreateNewUser', true);
		translate('msgCreateUserLabel', true);
		translate('msgCreateUserEnvSelector', true);
		translate('msgAddUserUsernameLabel', true);
		translate('msgAddUserPasswordLabel', true);
		translate('msgAddUserUserSelector', true);
		translate('msgAddUserPassSelector', true);
		translate('msgAddUserDescription', true);
		translate('msgAddNewUserButton', true);
		translate('msgModifyUser', true);
		translate('msgEditUserLabel', true);
		translate('msgEditUserEnvSelector', true);
		translate('msgEditUserEnvSelectorLabel', true);
		translate('msgModifyUserSelector', true);
		translate('msgEditUserUserLabel', true);
		translate('msgEditUserPassLabel', true);
		translate('msgEditUserUserSelectorLabel', true);
		translate('msgEditUserPassSelectorLabel', true);
		translate('msgEditUserDescriptionLabel', true);
		translate('msgEditUserButton', true);
		translate('msgDeleteUser', true);
		translate('msgDeleteUserTitle', true);
		translate('msgDeleteUserLabel', true);
		translate('msgDeleteUserEnvSelector', true);
		translate('msgDeleteUserEnvSelectorLabel', true);
		translate('msgDeleteUserSelector', true);
		translate('msgDeleteUserButton', true);
		translate('msgExtesionPreferencesTab', true);
	}

	function translate(key, insertIntoDOM) {
		if(insertIntoDOM) {
			$('#' + key).text(chrome.i18n.getMessage(key));
		} else {
			return chrome.i18n.getMessage(key);
		}
	}


})(slaUtils);