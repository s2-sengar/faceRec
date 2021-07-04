const video = document.querySelector("#video");

/*
*   loading all the modals
*/
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo);


function startVideo(){
    /*
    *   getting video feed
    */
    navigator.getUserMedia(
        {
            video:{}
        },
        stream => video.srcObject=stream,
        err=>console.log(err)
    );
}

video.addEventListener('play',()=>{
    // creating canvas from face api and appending at end of video
    const canvas = faceapi.createCanvasFromMedia(video);
    const displaySize={
        width:video.width,
        height:video.height
    };

    faceapi.matchDimensions(canvas,displaySize);

    document.body.append(canvas);
    setInterval(async()=>{
        // video,type of lib used
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        // const detections = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandMarks().withFaceExpression();
        
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);

        const resizedDetections = faceapi.resizeResults(detections,displaySize);

        faceapi.draw.drawDetections(canvas,resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections);

    },100)
})