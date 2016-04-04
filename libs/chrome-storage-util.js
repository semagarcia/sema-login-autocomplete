/**
 *
 */
var semaSLA = (function() {

	var _slaData = null;

	function synchronize(callback) {
		chrome.storage.sync.set(_slaData, function() {
			// Check if there was an error
			if(chrome.runtime.lastError) {
				console.log(chrome.runtime.lastError.message);
	       		callback(chrome.runtime.lastError.message);
	   		} else {
	   			console.log("No hay error, set correcto: ");
	   			callback(null);
	   		}
		});
	}

	function getStoredData(callback) {
		if(_slaData) {
			console.log('Returning from cache');
			callback(_slaData);
		} else {
			console.log('Returning from chrome.storage');
			getDataFromChromeStorage(function(err, storedValue) {
				console.log('GetStoredData');
				if(err) {
					console.log('Error: ' + err);
				}
				callback(_slaData);
			});
		}
	}

	function getDataFromChromeStorage(callback) {
		chrome.storage.sync.get('sema-sla', function (storedValue) {
			// Check if there was an error
			if(chrome.runtime.lastError) {
				console.log(chrome.runtime.lastError.message);
	       		callback(chrome.runtime.lastError.message);
	   		}

			// We check if the objet returned has our own specific signature
			console.log('StoredValue: ', storedValue);
			if(storedValue && storedValue['sema-sla']) {
				_slaData = storedValue;
			} else {
				_slaData = {
					'sema-sla' : {
						environments : [],
						users : [],
						slaConfiguration : { lang : 'en' }
					}
				};
			}
			callback(null, _slaData);
		});
	}

	return {
		synchronize : synchronize,
		getStoredData : getStoredData
	}

})();

/**
 *
 */
var slaUtils = (function(semaSLA) {

	function getAllData(callback) {
		semaSLA.getStoredData(function(storedData) {
			callback(storedData);
		});
	}

	function getEnvironments(callback) {
		var auxEnvs = [];
		semaSLA.getStoredData(function(envs) {
			if(envs && envs['sema-sla']) {
				_.each(envs['sema-sla'].environments, function(env) {
					auxEnvs.push(env);
				});
			}
			callback(auxEnvs);
		});
	}

	function getUsersByEnvironment(keyEnv, callback) {
		semaSLA.getStoredData(function(userCredentials) {
			if(userCredentials && userCredentials['sema-sla']) {
				var users = _.filter(userCredentials['sema-sla'].users, { 'envId' : keyEnv });
				callback((users) ? users : null);
			}
		});
	}

	function getWholeInfoFromUser(keyEnv, username, callback) {
		semaSLA.getStoredData(function(userCredentials) {
			if(userCredentials && userCredentials['sema-sla']) {
				var users = _.filter(userCredentials['sema-sla'].users, { 'envId' : keyEnv, 'username' : username });
				callback((users) ? users : null);
			}
		});
	}

	function addNewEnvironment(newEnvName, callback) {
		semaSLA.getStoredData(function(data) {
			data['sema-sla'].environments.push({ 
				envId : _.size(data['sema-sla'].environments) + 1, 
				envName : newEnvName 
			});
			semaSLA.synchronize(function(err) {
				callback((err) ? err : null);
			});
		});
	}

	function modifyEnvironment(keyEnv, newEnvName, callback) {
		semaSLA.getStoredData(function(data) {
			_.find(data['sema-sla'].environments, function(environment, envIndex) { 
				if(environment.envId === Number(keyEnv)) {
					data['sema-sla'].environments[envIndex].envName = newEnvName;  // Update
					return true;
				}
			});

			// Sync & commit data
			semaSLA.synchronize(function(err) {
				callback((err) ? err : null);
			});
		});
	}

	function deleteEnvironment(keyEnv, callback) {
		semaSLA.getStoredData(function(data) {
			_.find(data['sema-sla'].environments, function(environment, envIndex) { 
   				if(environment.envId === Number(keyEnv)) { 
   					// Delete the environment entry
   					data['sema-sla'].environments.splice(envIndex, 1);

   					// Delete the users entries related
   					_.find(data['sema-sla'].users, function(userEntry, userIndex) {
   						if(userEntry.envId === Number(keyEnv)) {
   							data['sema-sla'].users.splice(userIndex, 1);
   							return true;
   						}
   					});

   					// Sync & commit data
   					semaSLA.synchronize(function(err) {
   						callback((err) ? err : null);
   					});
   					return true;
   				}; 
			});
		});
	}

	function addNewUserCredentials(user, pass, userSelector, passSelector, description, envId, callback) {
		semaSLA.getStoredData(function(data) {
			data['sema-sla'].users.push({
				envId : envId,
				username : user,
				password : pass,
				userSelector : userSelector,
				passSelector : passSelector,
				description : description
			});
			semaSLA.synchronize(function(err) {
				callback((err) ? err : null);
			});
		});
	}

	function modifyUserCredentials(username, password, userSelector, passSelector, description, envId, olderUsername, callback) {
		semaSLA.getStoredData(function(data) {
			if(data && data['sema-sla']) {
				_.find(data['sema-sla'].users, function(user, userIndex) { 
					if(user.envId === Number(envId) && user.username === olderUsername) {
						data['sema-sla'].users[userIndex] = {
							envId : envId,
							username : username,
							password : password,
							userSelector : userSelector,
							passSelector : passSelector,
							description : description
						};
						return true;
					}
				});
				semaSLA.synchronize(function(err) {
					callback((err) ? err : null);
				});
			}			
		});
	}

	function deleteUserCredentials(envId, username, callback) {
		semaSLA.getStoredData(function(data) {
			if(data && data['sema-sla']) {
				_.find(data['sema-sla'].users, function(user, userIndex) { 
					if(user.envId === Number(envId) && user.username === username) {
						data['sema-sla'].users.splice(userIndex, 1);
						return true;
					}
				});
				semaSLA.synchronize(function(err) {
					callback((err) ? err : null);
				});
			}			
		});
	}

	return {
		getAllData : getAllData,
		getEnvironments : getEnvironments,
		getUsersByEnvironment : getUsersByEnvironment,
		getWholeInfoFromUser : getWholeInfoFromUser,
		addNewEnvironment : addNewEnvironment,
		modifyEnvironment : modifyEnvironment,
		deleteEnvironment : deleteEnvironment,
		addNewUserCredentials : addNewUserCredentials,
		modifyUserCredentials : modifyUserCredentials,
		deleteUserCredentials : deleteUserCredentials
	}

})(semaSLA);