import { uploadWorker } from "./upload/upload.worker";

async function startWorkers(){
    await uploadWorker();
};

startWorkers();