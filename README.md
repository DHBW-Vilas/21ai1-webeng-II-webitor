# Webitor - A web-based Code Editor

## QuickStart

### Run on Gitpod

To get the project up and running on [gitpod](https://gitpod.io/) and add the repository [https://github.com/DHBW-Vilas/21ai1-webeng-II-webitor](https://github.com/DHBW-Vilas/21ai1-webeng-II-webitor) as a new workspace. This should automatically open a browser preview, that opens the website. Otherwise, you might have to run `gp validate` in gitpod's built-in console.

### Run locally

To run the project locally, make sure that you have [node.js and npm](https://nodejs.org/en) installed. Navigate to this project's root directory and run `npm install && npm run build`. Afterwards, run `npm start` to start the server.

Now you can open your favorite browser and navigate to [localhost:3000](http://localhost:3000/).

## Test Accounts

To test the website with already created accounts, one can use the following accounts. The app can alternatively also be used completely anonymously without being logged in.

| Username   | Password | Descriptions                                                                 |
| ---------- | -------- | ---------------------------------------------------------------------------- |
| ArtInLines | pass123  | Contains some repositories from [ArtInLines](https://github.com/ArtInLines)  |
| Starter    | newPass  | Contains only empty Hello World workspaces, that were all created by Webitor |

## Noteable Features

The following is a list of noteable features of our app.

-   Creating new Workspaces with short Hello-World programs in the chosen language
-   Uploading Workspaces from the local machine
-   Renaming Workspaces (either from the Start-Page or the Editor-Page)
-   Downloading Workspaces as Zip-Archives (either from the Start-Page or the Editor-Page)
-   Deleting Workspaces (can only be done from the Start-Page)
-   Anonymous Accounts
    -   When using the app without logging in, a temporary anonymous account is created
    -   All features of the app can be used without being logged in
    -   When logging in after having created workspaces with an anonymous account, the workspaces are transfered to the permament account
    -   An anonymous account is deleted after 4 days or when the server is restarted
-   Color Themes
    -   We offer four color themes (Light, Dark, High Contrast & Spooky)
    -   Because of time-limitations for the project, we were not able to adjust the icons or the editor itself to the different color themes. It is thus recommended to only use the Light Theme on the Editor-Page
-   Editor Features:
    -   Creating new Files/Folders in a Workspace
    -   Deleting Files/Folders in a Workspace
    -   Closing/Opening Folders in the File-Explorer via mouse clicks
    -   Saving changes of the currently opened file with `Ctrl+S`
    -   Saving changes of all files with the `Save Work` button
-   For supported languages (which are listed on the Start-Page), the following features also exist
    -   Syntax Highlighting in Editor
    -   Autocomplete with `Enter` in Editor
    -   Block-Folding in Editor
