# Leukemia Detection Pipeline: An End-to-End Machine Learning System

[![GitHub Issues](https://img.shields.io/github/issues/ManuToniotti/leukemia-detection-pipeline)](https://github.com/ManuToniotti/leukemia-detection-pipeline/issues)
[![GitHub Pull Requests](https://img.shields.io/github/pulls/ManuToniotti/leukemia-detection-pipeline)](https://github.com/ManuToniotti/leukemia-detection-pipeline/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


This project demonstrates the development of a comprehensive machine learning system for the detection of leukemia in blood cell images. It showcases the design and implementation of all components of a real-world application, from data ingestion to a user-friendly frontend. This project emphasizes Data Engineering practices, as well as machine learning and web development skills.

## 🎯 Project Goal

The primary goal of this project is to create a scalable and automated end-to-end machine learning pipeline for leukemia detection. This includes:

-   Ingesting data from a cloud-based source (AWS S3).
-   Developing and training a custom Convolutional Neural Network (CNN) using TensorFlow/Keras.
-   Creating a backend API for model serving using Node.js and Express.
-   Designing an interactive user interface with React and Material UI for image uploading and displaying results.
-  Storing credentials securely using a `.env` file

## ⚙️ Architecture and Data Flow

The system follows a multi-stage data pipeline architecture:

1.  **Data Source:** Blood cell images are stored in an AWS S3 bucket, in folders: `basophil/` and `myeloblast/`.

2.  **Data Ingestion and Preprocessing:**
    -   A Python script `training/train.py` uses `boto3` to download images from S3. It loads AWS credentials from a `.env` file (excluded from version control).
    -   It uses the `PIL` library to resize the images to 224x224.
    -   Image pixel values are normalized, and training data is created using Tensorflow.

3.  **Machine Learning Model Training:**
    -  A CNN is created using Tensorflow/Keras, and trained to classify blood cells as either normal or abnormal.
    -  The model is trained to classify blood cells as either normal or abnormal, using binary crossentropy for the loss function and Adam optimizer.
    -   After training, model weights are saved to binary files and model metadata is saved in `model.json`.

4.  **Backend API (Model Serving):**
    -   A Node.js application with Express.js (located in `backend/server.js`) provides a REST API.
    -  It loads the serialized model from the `backend/model_tfjs` folder.
    -   The `/predict` endpoint accepts images from the frontend for classification, returning the prediction, confidence and processing time.

5.  **Frontend User Interface:**
    -   A React app (`frontend/src/App.js`) built with Material UI provides a user-friendly drag-and-drop interface.
     - Users can upload an image, and then the results are displayed below.
    -  The frontend makes requests to the `/predict` endpoint to analyze the images.

## 🛠️ Technology Stack

-   **Languages:** Python, JavaScript
-   **Machine Learning:** TensorFlow/Keras
-   **Cloud Storage:** AWS S3
-   **Backend:** Node.js, Express
-   **Frontend:** React, Material UI (MUI)
-   **Libraries:**
    -   `boto3` (AWS SDK for Python)
    -   `python-dotenv` (for environment variables)
    -   `Pillow` (for image processing)
    -   `@tensorflow/tfjs` (for browser model inference)
    -   `axios` (for making API requests)
    -   `moment` (for date formatting)
    - `cors` (to allow cross-origin requests)

## 🚀 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/leukemia-detection-pipeline.git
    cd leukemia-detection-pipeline
    ```
2.  **Set up the backend:**
    ```bash
     cd backend
     npm install
    ```
3.  **Set up the frontend:**
     ```bash
       cd frontend
       npm install
    ```
4. **Set up the training environment:**
    ```bash
      cd training
      python3 -m venv env
      source env/bin/activate
      pip install -r requirements.txt
    ```
5. **Configure AWS:**
    - Create an AWS account (if you don't have one) and upload the image dataset to an S3 bucket, as explained in the project description
    -  Create the `.env` file in `training/` and provide your AWS credentials:
    ```env
        AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
        AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
        AWS_DEFAULT_REGION=your-aws-region
    ```

6. **Run training script:**
    ```bash
        cd training
        .\env\Scripts\activate # for windows
        source env/bin/activate # for linux/macos
        python train.py
    ```

7.  **Run the backend server:**
    ```bash
    cd backend
    node server.js
    ```
8.  **Run the frontend application:**
    ```bash
    cd frontend
    npm start
    ```

## ✅ Key Features

-  **End-to-End System:** Complete ML application, from data ingestion to user interaction.
-  **Custom ML Model:** The model was trained from scratch using TensorFlow/Keras.
-   **Cloud Data Ingestion:** Reads data directly from AWS S3.
-   **REST API:** Serves the trained model to the frontend for real-time predictions
-   **User Interface:** Interactive React app with Material UI for image uploads and result visualization.
-  **Secure Credentials Management:** Uses a `.env` file to protect API keys.

## 🚧 Future Enhancements

-   **Model Versioning:** Implement a system to manage different versions of the trained model.
-   **Automated Training:** Schedule model training using orchestration tools like Apache Airflow.
-  **Comprehensive Logging:** Implement a logging system to track errors and metrics.
-   **Data Validation:** Add data validation steps to ensure data quality.
-   **CI/CD Pipeline:** Set up a continuous integration and continuous deployment pipeline.
-  **API Gateway:** Add an API gateway to handle authentication

## ⚠️ Technical Challenges and Resolutions

-   **AWS Credentials:** Initially faced `NoCredentialsError` which was resolved by loading credentials from a `.env` file.
-   **S3 Path Issues:** Addressed `KeyError: 'Contents'` by modifying data reading logic from S3.
-   **UI Framework Issue:** Successfully pivoted from `tailwindcss` to Material UI (MUI) when faced a persistent initialization issue, demonstrating problem-solving flexibility.

## 🛡️ License

This project is licensed under the MIT License.

##  👤 Author

   -   [Your Name](https://github.com/your-username)

##  🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.