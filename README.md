# Introduction 
This repository provides templated pipeline files suitable for building and publishing docker images from other repositories (in templates folder). 
This repository also contains helm deployment pipeline files (src).

For example the docker-build and docker-build-push yaml can be used within any repository like so:

Point to the devops-app-pipelines repo.

        resources:
        repositories:
        - repository: templates
            type: git
            name: devops-app-pipelines
            ref: refs/heads/master

Define a stage which uses the docker-build-push.yml template and pass in required variables. 

        stages:
        - template: src/templates/docker-build-push.yaml@templates
        parameters:
            majorVersionYear: $(MAJOR_VERSION_YEAR)
            majorVersionMonth: $(MAJOR_VERSION_MONTH)
            minorVersion: $(MINOR_VERSION)
            fullVersion: $(FULL_VERSION)
            friendlyName: $(FRIENDLY_NAME)
            fullVersionFriendly: $(FULL_VERSION_FRIENDLY)
            containerRegistry: $(containerRegistry)
            containerRepository: $(containerRepository)
            dockerFilePath: $(dockerFilePath)
            protoSrcPath: $(protoSrcPath)
            protoDestPath: $(protoDestPath)

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)