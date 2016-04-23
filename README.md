# Sema Login Autocomplete (chrome-extension)
Login autocomplete chrome-extension to login into applications, improving the native autocomplete-browser-feature.

## An extension for web application developers and teams

This extension has been realeased in order to help developers of web applications in which a login (username and password) is needed. If you need more details, please, visit the **Chrome Extension Store** entry in the [following URL](https://chrome.google.com/webstore/detail/sema-login-autocomplete/icibgoniiblnlggidknaoijhcomafhma?hl=es/) or search it querying by "sema login autocomplete".

### Why this extension?

One common action in a wide variety of projects is the login, where the credentials is composed by username and password. But... are all users the same in each environment (e.g.: development, intergration, preproduction, production...)? How do you know which user you should use in each environment? How manage the usernames and passwords? How share those credentials with other team mates?.

With this extension, you could:

 - Manage the credentials of your development project (notice that it is most powerful than a simple autocomplete remember browser feature.
 - Add a brief description about each user-credentials, to be able to remember the typology of that user (like rol, permissions, etc).
 - Export the configuration (environments and users created) to a file or to clipboard, in order to share them with other users/team mates or to do a backup.
 - ...And more future features are coming!!

### How can I use that extension?

Once the extension has been installed, it will appear in the upper-right part of the brower, and if you click on it, you will see something like that:

![sla screenshot](http://semagarcia.github.io/sema-login-autocomplete/images/sema-sla-extension_0.png)

The main area is formed by two selects, where the first one allow us to filter by environmnet (dev, inte...) and the second one ask us for the specific user we want to inject into login page.

![sla in action](http://semagarcia.github.io/sema-login-autocomplete/images/sema-sla-extension_1.png)

Notice that below of the second dropdown field will appear the description inserted related to the user selected. This brief info will help us to know the characteristics of the user (e.g.: roles, permissions, etc).

### Main actions

In the bottom area, we have a toolbar with the following options:

 - **SLA Home**: Go to user credentials injector.
 - **Inject!**: Insert the credentials into specified fiels (through the selectors). If username or password are not found, the extension will open an alert to inform you (probably, the selector is not correctly written).
 - **Settings**: opens the preference window (or chrome extension tab).
 - **More options**: export and import, clean data, etc.
 - **About...**: informacion about the extension.

### Setting the preferences

Ok. That extension seems to be cool, but... How the credentials could be added?

Go to preference page (either open the extension and click on "settings" or opening chrome extension option through the menubar).

![new environment](http://semagarcia.github.io/sema-login-autocomplete/images/sema-sla-extension_2.png)

Here you can create, modify or delete environments and user credentials. Moreover, there is another third empty tab (in progress) to set user-preferences.

![new credentials](http://semagarcia.github.io/sema-login-autocomplete/images/sema-sla-extension_3.png)

### I18N

In the current version, that extesion is available in two languages: english and spanish, and coming soon, italian.

Automatically, the extension will be shown in your local language; if it is not present in the defined ones, the default will be english.

### Support or Contact

You can contact me on: sema.login.autocomplete @ gmail.com.

Sema García. Github: [@semagarcia](https://github.com/semagarcia); Twitter: [@semagarcia](https://twitter.com/semagarcia)