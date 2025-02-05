from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
import time
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

RECORDING_DIR = 'recordings'
if not os.path.exists(RECORDING_DIR):
    os.makedirs(RECORDING_DIR)

class VideoCamera:
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.is_recording = False
        self.out = None
        self.start_time = time.time()
        self.frame_count = 0
        
    def __del__(self):
        self.video.release()
        if self.out:
            self.out.release()
    
    def get_frame(self):
        success, frame = self.video.read()
        if not success:
            return None
        
        self.frame_count += 1
        
        if self.is_recording and self.out:
            self.out.write(frame)
            
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
    
    def start_recording(self):
        if not self.is_recording:
            filename = os.path.join(RECORDING_DIR, 
                f'recording_{datetime.now().strftime("%Y%m%d_%H%M%S")}.avi')
            fourcc = cv2.VideoWriter_fourcc(*'XVID')
            self.out = cv2.VideoWriter(filename, fourcc, 20.0, 
                (int(self.video.get(3)), int(self.video.get(4))))
            self.is_recording = True
            return True
        return False
    
    def stop_recording(self):
        if self.is_recording:
            self.is_recording = False
            if self.out:
                self.out.release()
                self.out = None
            return True
        return False
    
    def get_metrics(self):
        fps = self.frame_count / (time.time() - self.start_time)
        return {
            'fps': round(fps, 2),
            'resolution': f'{int(self.video.get(3))}x{int(self.video.get(4))}',
            'is_recording': self.is_recording
        }

camera = VideoCamera()

def gen_frames():
    while True:
        frame = camera.get_frame()
        if frame:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_recording', methods=['POST'])
def start_recording():
    success = camera.start_recording()
    return jsonify({'success': success})

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    success = camera.stop_recording()
    return jsonify({'success': success})

@app.route('/metrics')
def get_metrics():
    return jsonify(camera.get_metrics())

if __name__ == '__main__':
    app.run(debug=True, port=5000)