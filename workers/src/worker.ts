import { uploadWorker } from "./upload/upload.worker";

async function startWorkers(){
    await uploadWorker();
    console.log('Upload Worker started...');
};

startWorkers();