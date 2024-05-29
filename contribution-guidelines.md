# MYSQL GUIDELINES

1. All table and column names should be in snake_case.
2. ENUM should be used for columns with defined fixed values.

# API GUIDELINES

1. All API end points should be in kebab-case.
2. The request and response of each API should be in camelCase.
3. For new features new version should be created in routes, services and controllers.
4. All MYSQL operations and business logic should happen in the services.
5. Controllers should only connect the routes to the services.
6. Static reusable functions should be added in utils.
7. Functions which are a helper to the other classes/functions should be defined in helper.
8. Any external API call be made through the webservices folder.
9. Each new API request parameter should be validated through the validator middleware.
10. Configuration values should be added in the env file.

# GIT GUIDELINES

1. There are 2 permanent branches i.e dev and master.
2. There are 3 temporary branches i.e feature, bugfix, experimental.
3. Temporary branch name should be like {branch-name}/{name/JIRA ID/ID}
   Eg: feature/integrate-swagger, feature/JIRA-231, bugfix/scroll-enabled
4. No direct push to dev and master branch.
5. Pull request should be created only to dev branch.
6. No pull request should be created to master branch.

# GENERAL GUIDELINES

1. Function names should be in camelCase.
2. Folder/file names should be in kebab-case.
3. Class names should be in PascalCase.
4. Each statement should end in a semicolon(;).
5. Each line should have a maximum of 80 characters.
6. Use prettier extension
7. Remove console.log before commiting the changes.
