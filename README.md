# Build a highly available app in Node.js with RA-GRS storage

This sample shows how to use the Node.js V10 Storage SDK with read-access geo-redundant storage (RA-GRS) to create a highly available application that accesses files from secondary storage when there is a problem with primary storage, and then switches back when primary storage becomes available again. For more information, see [Designing HA Apps with RA-GRS storage](https://docs.microsoft.com/azure/storage/common/storage-designing-ha-apps-with-ragrs).

* Create a storage account.
* Create a container.
* Upload a file to blockblob.
* Enter D to download the file or Q to quit

If you don't have a Microsoft Azure subscription, you can get a FREE trial account <a href="http://go.microsoft.com/fwlink/?LinkId=330212">here</a>.

# Folders introduction

Two folders are referred to different version of Azure SDK.
* storage-node-v10-ha-ra-grs-v3 referenced to following packages:
  * [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob/v/10.3.0)
* storage-node-v10-ha-ra-grs-v4 referenced to following packages:
  * [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob/v/12.0.0-preview.2)

## More information

- [About Azure storage accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account)
- [Designing HA Apps with RA-GRS storage](https://docs.microsoft.com/azure/storage/common/storage-designing-ha-apps-with-ragrs)
- [Azure Storage Replication](https://docs.microsoft.com/azure/storage/storage-redundancy)