import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      try {
        console.log('Starting to load model...');
        const loadedModel = await tf.loadLayersModel('http://localhost:3001/model_tfjs/model.json');
        setModel(loadedModel);
        console.log('Model loaded successfully!', loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    }
    loadModel();
  }, []);

  const processImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePredict = async (imageElement) => {
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims();
    const predictions = await model.predict(tensor).data();
    const isNormal = predictions[0] < 0.5;
    tf.dispose(tensor);
    return {
      prediction: isNormal ? "Normal" : "Abnormal",
      confidence: isNormal ? 1 - predictions[0] : predictions[0]
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

    const handleUpload = async (file) => {
        if (!model) {
            console.error('Model not loaded yet - please wait and try again');
            setLoading(false);  
            return;
        }
        try {
            setLoading(true);
            console.log('Processing image...');
            const imageElement = await processImage(file);
            console.log('Image processed, starting prediction...');
            const startTime = Date.now();
            const result = await handlePredict(imageElement);
            console.log('Prediction complete:', result);
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
            setPrediction({
                ...result,
                processingTime: `${processingTime}s`
            });
        } catch (error) {
            console.error('Error during upload/prediction:', error);
            setPrediction(null); 
        } finally {
            setLoading(false);
        }
    };


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Leukemia Detection System
        </h1>
          {!model && (
              <div className="text-center text-yellow-600 bg-yellow-50 p-4 rounded-lg mb-4">
                  Loading model... Please wait before uploading images.
              </div>
          )}
        <p className="text-center text-gray-600 mb-8">
          Upload a blood cell image for instant analysis
        </p>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div
            className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-6xl mb-4">🔬</div>
            <p className="text-gray-600 mb-2">
              Drag and drop your image here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPG, PNG, GIF
            </p>
          </div>
        </div>
        {preview && (
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Image Preview</h2>
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 rounded-lg mx-auto"
            />
          </div>
        )}
        {loading && (
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Analyzing image...</span>
            </div>
          </div>
        )}
        {prediction && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className={`p-4 rounded-lg inline-block ${
                prediction.prediction === "Normal"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
            }`}>
              <div className="mb-3">
                <span className="font-medium">Classification:</span>{' '}
                <span className={prediction.prediction === "Normal" ? "text-green-600" : "text-red-600"}>
                  {prediction.prediction}
                </span>
              </div>
              <div className="mb-3">
                <span className="font-medium">Confidence:</span>{' '}
                <span className="text-gray-700">
                  {(prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="font-medium">Processing Time:</span>{' '}
                <span className="text-gray-700">{prediction.processingTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;