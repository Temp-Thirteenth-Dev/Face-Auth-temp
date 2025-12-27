import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Camera, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CameraView = ({ mode, name, onSuccess, onError, status }) => {
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error('Model loading failed', err);
                onError('Failed to load face recognition models.');
            }
        };
        loadModels();
    }, []);

    const handleCapture = async () => {
        if (!webcamRef.current || isProcessing) return;
        setIsProcessing(true);

        try {
            const video = webcamRef.current.video;
            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                onError('No face detected. Please center your face.');
                setIsProcessing(false);
                return;
            }

            const embedding = Array.from(detection.descriptor);

            if (mode === 'register') {
                const response = await axios.post(`${API_URL}/register-face`, {
                    name,
                    embedding
                });
                onSuccess(`Registered successfully! Welcome, ${name}`);
            } else {
                const response = await axios.post(`${API_URL}/login-face`, {
                    embedding
                });
                onSuccess(`Welcome back, ${response.data.user.name}!`);
            }
        } catch (err) {
            console.error('Full Face Auth Error:', err);
            onError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!modelsLoaded) {
        return (
            <div className="camera-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ marginTop: '20px' }}>Loading Face AI...</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <div className="camera-container">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                    mirrored={true}
                />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    height: '70%',
                    border: '2px dashed rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }}></div>
            </div>

            <button
                className="btn-primary"
                onClick={handleCapture}
                disabled={isProcessing}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
                {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Camera size={20} />}
                {isProcessing ? 'Processing...' : (mode === 'register' ? 'Register Now' : 'Sign In Now')}
            </button>

            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>
                Please look directly at the camera
            </p>
        </div>
    );
};

export default CameraView;
