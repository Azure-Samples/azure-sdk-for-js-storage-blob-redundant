// Configure .env file with appropriate environmental variables
// for your storage account.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const {
  BlobServiceClient,
  SharedKeyCredential,
  uploadFile,
  newPipeline
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
const sharedKeyCredential = new SharedKeyCredential(accountName, storageAccessKey);
const primaryAccountURL = `https://${accountName}.blob.core.windows.net`;
const secondaryAccountURL = `https://${accountName}-secondary.blob.core.windows.net`;

// Create a pipeline with secondary endpoint and retry options defined.
const pipeline = newPipeline(sharedKeyCredential, {
  retryOptions: {
    maxTries: 3,
    tryTimeoutInMs: 10000,
    retryDelayInMs: 500,
    maxRetryDelayInMs: 1000,
    secondaryHost: secondaryAccountURL
  }
});

// Create BlobServiceClient
const blobServiceClient = new BlobServiceClient(primaryAccountURL,pipeline);
const containerName = `newcontainer${new Date().getTime()}`;
const containerClient = blobServiceClient.getContainerClient(containerName);
const fileName = 'HelloWorld.png';
const blobName = "newblob" + new Date().getTime();
const blobClient = containerClient.getBlobClient(blobName);
const blockBlobClient = blobClient.getBlockBlobClient();

// Creates a container, uploads the BlockBlob, and waits for replication
// to the secondary region.
async function uploadBlob() {
  try {
    await containerClient.create();
    console.log(`Created container successfully: ${containerName}`);
    await blockBlobClient.uploadFile("./" + fileName, {
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
      let listBlobsResponse = await containerClient.listBlobFlatSegment();
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
      console.log(err);
      console.log(`[${lineCount}] Container has not replicated to secondary region yet: ${containerName} : ${err.body.Code}`);
      lineCount++;
    }
  }
}

// Downloads the blob and determines which endpoint (primary/secondary) was used
async function downloadBlob() {
  const downloadBlockBlobResponse = await blobClient.download(0);
  let url = downloadBlockBlobResponse._response.request.url;
  if (url.includes(`${accountName}-secondary`)) {
    console.log("Blob downloaded from secondary endpoint.")
  } else {
    console.log("Blob downloaded from primary endpoint.");
  }
}

// Delete the created container
async function deleteContainer() {
  try {
    await containerClient.delete();
    console.log(`Deleted container ${containerName}`);
  }
  catch (err) {
    console.log(`Unable to delete storage container: ${err.message}`);
  }
}

async function main(){
  await uploadBlob();
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
}

main().catch((err)=>{
  console.log(err.message);
})