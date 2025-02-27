import cv2
import mediapipe as mp
import time
import os

class FaceDetector():
    def __init__(self, minDetectionCon=0.5):
        self.minDetectionCon = minDetectionCon
        self.mpFaceDetection = mp.solutions.face_detection
        self.mpDraw = mp.solutions.drawing_utils
        self.faceDetection = self.mpFaceDetection.FaceDetection(self.minDetectionCon)

    def findFaces(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.faceDetection.process(imgRGB)
        img = cv2.resize(img, (800, 600))  # Prevents zoom-in issues
        bboxs = []

        if self.results.detections:
            for id, detection in enumerate(self.results.detections):
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, ic = img.shape
                bbox = (int(bboxC.xmin * iw), int(bboxC.ymin * ih), 
                        int(bboxC.width * iw), int(bboxC.height * ih))

                bboxs.append([id, bbox, detection.score[0]])  # Access score correctly

                if draw:
                    img = self.fancyDraw(img, bbox)  # Using the improved drawing function
                    cv2.putText(img, f'{int(detection.score[0] * 100)}%', 
                                (bbox[0], bbox[1] - 20), 
                                cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 2)

        return img, bboxs

    def fancyDraw(self, img, bbox, t=7, rt=1, line_length=20): 
        x, y, w, h = bbox
        x1, y1 = x + w, y + h

        cv2.rectangle(img, (x, y), (x1, y1), (255, 0, 255), rt)

        # Draw corners
        cv2.line(img, (x, y), (x + line_length, y), (255, 0, 255), t)
        cv2.line(img, (x, y), (x, y + line_length), (255, 0, 255), t)
        cv2.line(img, (x1, y), (x1 - line_length, y), (255, 0, 255), t)
        cv2.line(img, (x1, y), (x1, y + line_length), (255, 0, 255), t)
        cv2.line(img, (x, y1), (x + line_length, y1), (255, 0, 255), t)
        cv2.line(img, (x, y1), (x, y1 - line_length), (255, 0, 255), t)
        cv2.line(img, (x1, y1), (x1 - line_length, y1), (255, 0, 255), t)
        cv2.line(img, (x1, y1), (x1, y1 - line_length), (255, 0, 255), t)

        return img

def main():
    """ Main function to run real-time face detection using webcam. """
    cap = cv2.VideoCapture(0)  # Open default webcam
    if not cap.isOpened():
        print("❌ Error: Could not open webcam.")
        return

    print("✅ Webcam opened successfully!")

    detector = FaceDetector()
    pTime = 0

    while True:
        success, img = cap.read()
        if not success:
            print("❌ Error: Unable to read video frame.")
            break

        img, bboxs = detector.findFaces(img)  # Detect faces in the frame
        print(bboxs)  # Prints detected bounding boxes and confidence scores

        # Calculate and display FPS
        cTime = time.time()
        fps = 1 / (cTime - pTime) if cTime - pTime > 0 else 0
        pTime = cTime
        cv2.putText(img, f'FPS: {int(fps)}', (20, 70), cv2.FONT_HERSHEY_PLAIN, 3, (0, 255, 0), 2)

        cv2.imshow("Face Detection", img)

        # Press 'q' to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()