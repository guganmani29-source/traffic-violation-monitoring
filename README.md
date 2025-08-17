# TrafficVoilationMonitoring

## Traffic Violation Detection and E-Challan System

## Overview
The project develops a complete web application which uses real-time traffic violation detection to create electronic traffic tickets for lawbreakers. The system uses YOLO object detection to identify violations including helmetless riding and other dangerous behaviors. The system recognizes detected license plates before storing them for linking to violator information. The application includes automated notification systems which provide drivers with immediate alerts about their traffic violations.

Tech Stack & Components
MERN Stack:
The system uses MongoDB to store user information together with detected violations and challan records.
Express.js operates as the backend system to handle data management and alert operations.
The front-end dashboard and monitoring interface uses React.js as its interactive platform.
Node.js → Server-side runtime environment.
YOLO (You Only Look Once) → Detects helmets, vehicles, and license plates in uploaded video/image feeds.
The Twilio API functions as a system to deliver immediate SMS alerts/e-challans to violators.
Workflow
The system processes uploaded video/image content through YOLO for violation detection.
The system detects violations which triggers automatic license plate extraction.
The database records the information to produce a challan.
The violator receives fine details through SMS alerts immediately after the system generates them.
