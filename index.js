// Configure .env file with appropriate environmental variables
// for your storage account.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const {
  Aborter,
  BlobURL,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  SharedKeyCredential,
  uploadFileToBlockBlob
} = require('@azure/storage-blob');

// Set up user input.
const readline = require('readline');
const readInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read environment variables for storage access.
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const storageAccessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const secondaryAccountName = `${accountName}-secondary`;

// Create a SharedKeyCredential for storage access.
const sharedKeyCredential = new SharedKeyCredential(
  accountName,
  storageAccessKey);

// Create a pipeline with secondary endpoint and retry options defined.
const pipeline = StorageURL.newPipeline(sharedKeyCredential, {
  retryOptions: {
    maxTries: 3, tryTimeoutInMs: 10000,
    retryDelayInMs: 500, maxRetryDelayInMs: 1000,
    secondaryHost: `https://${secondaryAccountName}.blob.core.windows.net`
  }
});

// Create a ServiceURL for the primary and secondary region.
const serviceURL = new ServiceURL(
  `https://${accountName}.blob.core.windows.net`,
  pipeline
);

const serviceURLSecondary = new ServiceURL(
  `https://${secondaryAccountName}.blob.core.windows.net`,
  pipeline
);

const fileName = 'HelloWorld.png';
const containerName = `newcontainer${new Date().getTime()}`;
const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
const blobURL = BlobURL.fromContainerURL(containerURL, fileName);
const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

// Creates a container, uploads the BlockBlob, and waits for replication
// to the secondary region.
async function uploadBlob() {
  try {
    await containerURL.create(Aborter.none);
    console.log(`Created container successfully: ${containerName}`);
    await uploadFileToBlockBlob(Aborter.none, fileName, blockBlobURL, {
      blocksize: 4 * 1024 * 1024, // 4MB block size
      parallelism: 20 // 20 concurrency
    });
    console.log(`Uploaded blob: ${fileName}`);
  }
  catch (err) {
    console.log(err.message);
  }

  console.log(`Checking to see if container and blob have replicated to secondary region.`);

  let replicated = false;
  let lineCount = 0;
  
  while (!replicated) {
    try {
      const containerURLSecondary = ContainerURL.fromServiceURL(serviceURLSecondary, containerName);
      const listBlobsResponse = await containerURLSecondary.listBlobFlatSegment(Aborter.none);
      const blobItems = listBlobsResponse.segment.blobItems;

      if (blobItems.length > 0) {
        console.log(`[${lineCount}] Blob has replicated to secondary region.`);
        replicated = true;
      }
      else {
        console.log(`[${lineCount}] Container found, but blob has not replicated to secondary region yet.`);
      }
      lineCount++;
    }
    catch (err) {
      console.log(`[${lineCount}] Container has not replicated to secondary region yet: ${containerName} : ${err.body.Code}`);
      lineCount++;
    }
  }
}

// Downloads the blob and determines which endpoint (primary/secondary) was used
async function downloadBlob() {
  const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
  let url = downloadBlockBlobResponse._response.request.url;
  if (url.includes(`${accountName}-secondary`)) {
    console.log("Blob downloaded from secondary endpoint.")
  } else {
    console.log("Blob downloaded from primary endpoint.");
  } 
};

// Delete the created container
async function deleteContainer() {
  try {
    await containerURL.delete(Aborter.none);
    console.log(`Deleted container ${containerName}`);
  }
  catch(err){
    console.log(`Unable to delete storage container: ${err.message}`);
  }
}

uploadBlob()
  .then(() => {
    console.log("Ready for blob download. Enter (D) to download or (Q) to quit, followed by ENTER.");
    readInput.on('line', async (input) => {
      switch (input.toUpperCase()) {
        case 'D':
          console.log("Attempting to download blob...");
          await downloadBlob();
          break;
        case 'Q':
          console.log("Exiting...");
          readInput.close();
          await deleteContainer();
          break;
        default:
          console.log("Invalid input. (D) for download (Q) to quit.")
          break;
      }
    })
  })
  .catch(err => {
    console.log(err.message);
  });