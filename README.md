---
page_type: sample
languages:
- javascript
- nodejs
products:
- azure
- azure-storage
description: "How to use the Azure Storage JavaScript SDK with read-access geo-redundant."
urlFragment: redundant-storage-javascript
---

# How to utilize redundant Azure Blob Storage with JavaScript

This sample shows how to utilize redundant Azure Blob Storage with JavaScript.

If you don't have a Microsoft Azure subscription, you can get a [free account] before you begin.

## SDK Versions

In this sample, you will find the following folders:

* **[azure-sdk-for-js-storage-blob-redundant-v10]** - references [Storage Blob SDK v10]
* **[azure-sdk-for-js-storage-blob-redundant-v12]** - references [Storage Blob SDK v12]

## Prerequisites

Following prerequisites are needed to run this sample and verify that files are downloaded from primary storage:

1. Add your storage account credentials to the `.env.example` file and then rename it to `.env`.

    ```
    AZURE_STORAGE_ACCOUNT_NAME=<ReplaceWithYourStorageAccountName>
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY=<ReplaceWithYourStorageAccountAccessKey>
    ```

    You can find this information in the Azure portal by navigating to your storage account and selecting **Access keys** in the **Settings** section. 

2. Install the required dependencies in the console window by running `npm install`.

Steps to test secondary storage access:

1. Open a command prompt with administrator privileges.

2. Get the IP address of your storage account primary endpoint domain by entering the following command, replacing `STORAGEACCOUNTNAME` with the name of your storage account.

    ```
    nslookup STORAGEACCOUNTNAME.blob.core.windows.net
    ```

3. Get the IP address of your local host by entering `ifconfig` on Linux or `ipconfig` on Windows.

4. Add an invalid static route for a destination host. Replace `<DestinationIp>` with your storage account IP address, and `<GatewayIp>` with your local host IP address.

    **Linux**

    ```bash
    route add <DestinationIp> gw <GatewayIp>
    ```

    **Windows**

    ```cmd
    route add <DestinationIp> <GatewayIp>
    ```

## In this sample you will do the following: 

* Create a storage account.
* Create a container.
* Upload a file to blockblob.
* Enter D to download the file or Q to quit.

## How it works

This sample creates a new container in blob storage and uploads a sample file into it called `HelloWorld.jpg`. It then checks secondary storage repeatedly until both the container and file have been replicated. The user can then enter D to download the file or Q to quit. If the file is successfully downloaded, the sample indicates whether it came from primary or secondary storage. When the user quits the sample, it deletes the container and file. 

## How to run the sample

To run this sample and verify that files are downloaded from primary storage, we are going to:

1. Launch the sample from the console window by running `node index.js`.

2. Wait until the sample reports that the container and file have replicated to secondary storage.

3. When prompted, press D to download the sample file and verify that it comes from primary storage.

To test secondary storage access, we are going to:

1. In the console window with the running sample, press D to download the sample file and verify that it comes from secondary storage.

2. Remove the invalid static route.

    **Linux**

    ```bash
    route del <DestinationIp> gw <GatewayIp>
    ```

    **Windows**

    ```cmd
    route delete <DestinationIp>
    ```

3. In the console window with the running sample, press D to download the sample file and verify that it comes from primary storage. 

4. Press Q to quit the sample and delete the container and file from storage.

## More information

- [About Azure Storage Accounts]
- [Designing HA Apps with RA-GRS Storage]
- [Azure Storage Replication]

<!-- LINKS -->
[azure-sdk-for-js-storage-blob-redundant-v10]: https://github.com/Azure-Samples/azure-sdk-for-js-storage-blob-redundant/tree/master/azure-sdk-for-js-storage-blob-redundant-v10
[azure-sdk-for-js-storage-blob-redundant-v12]: https://github.com/Azure-Samples/azure-sdk-for-js-storage-blob-redundant/tree/master/azure-sdk-for-js-storage-blob-redundant-v12
[Storage Blob SDK v10]: https://www.npmjs.com/package/@azure/storage-blob/v/10.3.0
[Storage Blob SDK v12]: https://www.npmjs.com/package/@azure/storage-blob/v/12.0.0
[About Azure Storage Accounts]: https://docs.microsoft.com/azure/storage/storage-create-storage-account
[Designing HA Apps with RA-GRS Storage]: https://docs.microsoft.com/azure/storage/common/storage-designing-ha-apps-with-ragrs
[Azure Storage Replication]: https://docs.microsoft.com/azure/storage/storage-redundancy
[free account]: http://go.microsoft.com/fwlink/?LinkId=330212

