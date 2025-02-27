import cv2
import mediapipe as mp
import time
import os

cap = cv2.VideoCapture(r"C:\Users\fayaz\Documents\Computer vision\Face_detection\face_detection_videos\12.mp4")


pTime = 0

mpFaceDetection=mp.solutions.face_detection
mpDraw = mp.solutions.drawing_utils
faceDetection = mpFaceDetection.FaceDetection()#can give values inside this function to focus the rectangle to a specific size


while True:
    success, img = cap.read()
    imgRGB = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    results = faceDetection.process(imgRGB)
    print(results)
    img = cv2.resize(img, (800, 600))  # Prevents zoom-in issues

    if results.detections:
        #lmList = []
        for id,detection in enumerate(results.detections):
            #mpDraw.draw_detection(img, detection)
            #print(id, detection)                
            #print(detection.score)
            #print(detection.location_data.relative_bounding_box ) #from output
            bboxC = detection.location_data.relative_bounding_box   #bounding box coming from the class, that is why C is used
            ih, iw, ic = img.shape
            '''bbox = int(bboxC.xmin * iw), int(bboxC.ymin * ih), #i means image , so image width
            int(bboxC.width * iw), int(bboxC.height * ih)'''
            bbox = (int(bboxC.xmin * iw), int(bboxC.ymin * ih), 
            int(bboxC.width * iw), int(bboxC.height * ih))

            #cv2.rectangle(img, bbox, (255,0,255),2)
            cv2.rectangle(img, (bbox[0], bbox[1]), 
            (bbox[0] + bbox[2], bbox[1] + bbox[3]), 
            (255, 0, 255), 2)

            cv2.putText(img,f'{int(detection.score[0]*100)}%',(bbox[0],bbox[1]-20),cv2.FONT_HERSHEY_PLAIN,2,(255,0,255),2)

    cTime =time.time()
    fps=1/(cTime-pTime)
    pTime = cTime
    cv2.putText(img,f'fps:{int(fps)}',(20,70),cv2.FONT_HERSHEY_PLAIN,3,(0,255,0),2)
    cv2.imshow("Image", img)
    cv2.waitKey(1)#we can reduce the frame rate by changing the number

'''
to make it read image instead of videos
Remove cv2.VideoCapture() → Since we’re not working with a video, we don’t need to capture frames.
Load an image using cv2.imread().
Remove the loop (while True) → We process only one image, so we don’t need an infinite loop.
Remove cv2.waitKey(1) → Use cv2.waitKey(0) instead to keep the image open until a key is pressed.'''
    