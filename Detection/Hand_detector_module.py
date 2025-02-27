# HAND TRACKING MODULE
import cv2
import mediapipe as mp
import time #to check frame rate
#now to create video generation class on webcam
class handDetector():
    def __init__(self,mode=False,maxHands=2,detectionCon=0.5,trackCon = 0.5):
        self.mode = mode
        self.maxHands =maxHands
        self.detectionCon = detectionCon
        self.trackCon =trackCon
        self.mpHands = mp.solutions.hands
        #self.hands = self.mpHands.Hands(self.mode,self.maxHands,self.detectionCon,self.trackCon)#no need to write parameter now as it is false by default, if true, then specify parameter, same with other parameters of Hands()
        self.hands = self.mpHands.Hands(
        static_image_mode=self.mode,
        max_num_hands=self.maxHands,
        min_detection_confidence=float(self.detectionCon),
        min_tracking_confidence=float(self.trackCon))


        #hands class only uses rgb images
        self.mpDraw = mp.solutions.drawing_utils

    def findHands(self,img, draw = True):
        imgRGB=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)#converting to RGB format
        self.results = self.hands.process(imgRGB)
            #print(results.multi_hand_landmarks)#returns none if hand is not present, other wise returns some values of recognition
        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks: #if there are multiple hands,it becomes useful,that is why for loopm is used
                    if draw:
                        self.mpDraw.draw_landmarks(img, handLms, self.mpHands.HAND_CONNECTIONS)#landmark gives us x and y axes
        return img
    def findPosition(self,img, handNo=0, draw=True):#value is 0, so for only one particular hand will the output be shown
        lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            for id, lm in enumerate(myHand.landmark):
                #print(id,lm) to get id and landmark values as x,y and z
                h, w, c=img.shape
                cx, cy = int(lm.x*w), int(lm.y*h)
                #print(id, cx, cy)
                lmList.append([id,cx,cy])
                ''' if id==0:#the position from 0 to 21:thqat is the whole 22 positions, skip this line to highlight whle 22 points'''#to highlight the point
                if draw:
                    cv2.circle(img, (cx, cy),5,(255,0,0), cv2.FILLED)
        return lmList
    
def main():
    pTime=0
    cTime=0
    cap = cv2.VideoCapture(0)
    detector = handDetector()
    while True:
        success, img = cap.read()
        img = detector.findHands(img)
        lmList = detector.findPosition(img)#add false to the parameter if we don't want to show it, like (img,draw=False)
        if len(lmList) != 0:
            print(lmList[4])#pick any point we are interestedm in out of 22 og points
        cTime = time.time()
        cTime = time.time()
        fps = 1/(cTime-pTime)
        pTime = cTime

        cv2.putText(img,str(int(fps)),(10,70),cv2.FONT_HERSHEY_COMPLEX,3,(255,0,255),3)

        
        cv2.imshow("Image", img)
        cv2.waitKey(1)

if __name__ == "__main__":
    main()

