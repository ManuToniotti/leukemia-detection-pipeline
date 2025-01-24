import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Warning, CloudUpload } from '@mui/icons-material';
import moment from 'moment';

// Styled components
const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #E5E7EB',
  borderRadius: '8px',
  padding: '40px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginBottom: theme.spacing(4),
  '&:hover': {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB'
  }
}));

const ResultsContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  width: '100%'
});

const ImageContainer = styled(Box)({
  position: 'relative',
  backgroundColor: '#F9FAFB',
  borderRadius: '8px',
  overflow: 'hidden'
});

const ResultsPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
});

const ResultCard = styled(Box)(({ abnormal }) => ({
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '24px',
  border: '1px solid',
  borderColor: abnormal ? '#FEE2E2' : '#ECFDF5'
}));

const ConfidenceCard = styled(Box)({
  backgroundColor: '#18181B',
  color: 'white',
  borderRadius: '8px',
  padding: '24px'
});

const SaveButton = styled(Button)({
  backgroundColor: 'white',
  color: '#18181B',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '8px 16px',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#F9FAFB',
    boxShadow: 'none'
  }
});

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel('http://localhost:3001/model_tfjs/model.json');
        setModel(loadedModel);
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
      const imageElement = await processImage(file);
      const startTime = Date.now();
      const result = await handlePredict(imageElement);
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#18181B', color: 'white', py: 3 }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Leukemia Detection System
            </Typography>
            <Typography sx={{ color: '#A1A1AA', fontSize: '14px' }}>
              |
            </Typography>
            <Typography sx={{ color: '#A1A1AA', fontSize: '14px' }}>
              Upload a blood cell image for instant analysis
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        {/* Upload Area */}
        <UploadBox
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CloudUpload sx={{ color: '#9CA3AF' }} />
            <Typography>
              Drag and drop your image here or{' '}
              <Typography component="span" sx={{ color: '#3B82F6', textDecoration: 'underline', cursor: 'pointer' }}>
                click to browse
              </Typography>
            </Typography>
          </Box>
        </UploadBox>

        {loading && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <CircularProgress size={32} />
            <Typography sx={{ mt: 2, color: '#6B7280' }}>
              Analyzing image...
            </Typography>
          </Box>
        )}

        {preview && !loading && (
          <ResultsContainer>
            {/* Image Preview */}
            <ImageContainer>
              <Box
                component="img"
                src={preview}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                p: 2, 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.1)',
                backdropFilter: 'blur(4px)'
              }}>
                <Typography sx={{ color: '#18181B' }}>
                  Uploaded time: {moment().format('DD/MM/YYYY')}
                </Typography>
                <SaveButton>
                  Save results
                </SaveButton>
              </Box>
            </ImageContainer>

            {/* Results */}
            {prediction && (
              <ResultsPanel>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Results:
                </Typography>

                <ResultCard abnormal={prediction.prediction === "Abnormal"}>
                  <Typography sx={{ mb: 1, color: '#6B7280' }}>
                    Classification:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h4" sx={{ 
                      color: prediction.prediction === "Abnormal" ? '#DC2626' : '#059669',
                      fontWeight: 500
                    }}>
                      {prediction.prediction}
                    </Typography>
                    {prediction.prediction === "Abnormal" && (
                      <Warning sx={{ color: '#DC2626' }} />
                    )}
                  </Box>
                </ResultCard>

                <ConfidenceCard>
                  <Typography sx={{ mb: 1, color: '#A1A1AA' }}>
                    Confidence:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 500 }}>
                    {(prediction.confidence * 100).toFixed(0)}%
                  </Typography>
                </ConfidenceCard>

                <ResultCard>
                  <Typography sx={{ mb: 1, color: '#6B7280' }}>
                    Processing Time:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 500 }}>
                    {prediction.processingTime}
                  </Typography>
                </ResultCard>
              </ResultsPanel>
            )}
          </ResultsContainer>
        )}
      </Box>
    </Box>
  );
}

export default App;