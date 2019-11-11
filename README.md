# Build a high availability app in Node.js with RA-GRS storage

This sample shows how to use the Node.js V10 Storage SDK with read-access geo-redundant storage (RA-GRS) to create a high availability app that accesses files from secondary storage when primary storage is down, and then switches back to primary storage when it becomes available again. For more information, see [Designing HA Apps with RA-GRS storage](https://docs.microsoft.com/azure/storage/common/storage-designing-ha-apps-with-ragrs).

## Prerequisites

Using following steps before running this sample and verify that files are downloaded from primary storage:

1. Add your storage account credentials to the `.env.example` file and then rename it to `.env`.

    ```
    AZURE_STORAGE_ACCOUNT_NAME=<replace with your storage account name>
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY=<replace with your storage account access key>
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

4. Add an invalid static route for a destination host. Replace `<destination_ip>` with your storage account IP address, and `<gateway_ip>` with your local host IP address.

    **Linux**

    ```bash
    route add <destination_ip> gw <gateway_ip>
    ```

    **Windows**

    ```cmd
    route add <destination_ip> <gateway_ip>
    ```

## In this sample you will do the following: 

* Create a storage account.
* Create a container.
* Upload a file to blockblob.
* Enter D to download the file or Q to quit.

If you don't have a Microsoft Azure subscription, you can get a free trial account <a href="http://go.microsoft.com/fwlink/?LinkId=330212">here</a>.

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
    route del <destination_ip> gw <gateway_ip>
    ```

    **Windows**

    ```cmd
    route delete <destination_ip>
    ```

3. In the console window with the running sample, press D to download the sample file and verify that it comes from primary storage. 

4. Press Q to quit the sample and delete the container and file from storage.

## Azure SDK versions

* To use the latest Azure SDK version [storage-node-v10-ha-ra-grs-v4] please add the following dependency to the package.json file:

```json
   "dependencies": {
       "@azure/storage-blob": "^12.0.0",
       "dotenv": "^8.2.0"
    }
```

* For the previous stable Azure SDK version [storage-node-v10-ha-ra-grs-v3] please add the following dependencies to the package.json file :

```json
   "dependencies": {
       "@azure/storage-blob": "^10.3.0",
       "dotenv": "^6.2.0"
    }
```

## More information

- [About Azure Storage Accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account)
- [Designing HA Apps with RA-GRS Storage](https://docs.microsoft.com/azure/storage/common/storage-designing-ha-apps-with-ragrs)
- [Azure Storage Replication](https://docs.microsoft.com/azure/storage/storage-redundancy)