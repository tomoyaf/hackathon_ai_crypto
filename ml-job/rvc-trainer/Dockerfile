FROM nvidia/cuda:11.8.0-devel-ubuntu22.04

# Install dependencies
RUN apt-get update && apt-get install -y ffmpeg unzip wget python3 python3-dev python3-pip git libgl1 software-properties-common && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN python3 -m pip install runpod requests fastapi uvicorn[standard] google-cloud-storage google-auth
RUN python3 -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

WORKDIR /workspace
RUN git clone https://github.com/teftef6220/Voice_Separation_and_Selection.git
RUN python3 -m pip install -r Voice_Separation_and_Selection/requirements.txt
RUN git clone -b scripts https://github.com/terracottahaniwa/rvc-webui
RUN python3 -m pip install -r rvc-webui/requirements.txt

# Download models
WORKDIR /workspace/rvc-webui
RUN python3 -c "from modules.core import download_models; download_models()"

WORKDIR /workspace
ADD gcloud.json .
ADD core.py .
ADD debug.py .
ADD serverless.py .

# Run server
CMD python3 -u serverless.py 

