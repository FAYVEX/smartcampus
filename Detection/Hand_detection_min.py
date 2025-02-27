#minimum code required for handtracking using computer vision
#program is to get the landmark values out of the landmark points
import cv2
import mediapipe as mp
import time #to check frame rate
#now to create video generation class on webcam
cap = cv2.VideoCapture(0)
mpHands = mp.solutions.hands
hands = mpHands.Hands()#no need to write parameter now as it is false by default, if true, then specify parameter, same with other parameters of Hands()
#hands class only uses rgb images
mpDraw = mp.solutions.drawing_utils
pTime=0
cTime=0
while True:
    success, img = cap.read()
    imgRGB=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)#converting to RGB format
    results = hands.process(imgRGB)
    #print(results.multi_hand_landmarks)#returns none if hand is not present, other wise returns some values of rcognition
    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks: #if there are multiple hands,it becomes useful,that is why for loopm is used
            for id, lm in enumerate(handLms.landmark):
                #print(id,lm) to get id and landmark values as x,y and z
                h, w, c=img.shape
                cx, cy = int(lm.x*w), int(lm.y*h)
                print(id, cx, cy)
                ''' if id==8:#the position from 0 to 21:thqat is the whole 22 positions, skip this line to highlight whle 22 points'''#to highlight the point
                cv2.circle(img, (cx, cy),15,(255,0,255), cv2.FILLED)# here the landmark of 0 is highlighted with 25 px size colored circle
                    
            mpDraw.draw_landmarks(img, handLms, mpHands.HAND_CONNECTIONS)#landmark gives us x and y axes
    cTime = time.time()
    fps =- 1/(cTime-pTime)
    pTime = cTime

    cv2.putText(img,str(int(fps)),(10,70),cv2.FONT_HERSHEY_COMPLEX,3,(255,0,255),3)

    
    cv2.imshow("Image", img)
    cv2.waitKey(1)  
#cv2.waitKey(0): Waits indefinitely for a key press.
#cv2.waitKey(10): Waits for 10 milliseconds and then proceeds (useful in video processing).
#If a key is pressed, the function returns the ASCII value of the key.
#It’s necessary to use waitKey after imshow, or the window might not display properly.