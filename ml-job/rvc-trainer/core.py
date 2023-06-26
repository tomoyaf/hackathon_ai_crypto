import os
import requests
import subprocess
import sys

from google.cloud import storage
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file("gcloud.json")
storage_client = storage.Client(credentials=credentials, project="aicrypto-389808")


def audio_to_corpus(voice_url: str, key: str):
    response = requests.get(voice_url)
    DOWNLOAD_DIR = f"download/{key}"
    os.makedirs(f"./{DOWNLOAD_DIR}", exist_ok=True)
    open(f"./{DOWNLOAD_DIR}/audio.mp3", "wb").write(response.content)
    subprocess.run(
        [
            sys.executable,
            "audio_to_copas.py",
            "--input",
            f"../{DOWNLOAD_DIR}/audio.mp3",
            "--outdir",
            f"../{DOWNLOAD_DIR}/corpus",
        ],
        shell=True,
        cwd="../Voice_Separation_and_Selection",
    )


def train_model(config_url: str, key: str):
    response = requests.get(config_url)
    DOWNLOAD_DIR = f"download/{key}"
    os.makedirs(f"./{DOWNLOAD_DIR}", exist_ok=True)
    open(f"./{DOWNLOAD_DIR}/setting.json", "wb").write(response.content)

    subprocess.run(
        [
            sys.executable,
            "scripts/training_script.py",
            "../{DOWNLOAD_DIR}/setting.json",
        ],
        shell=True,
        cwd="../rvc-webui",
    )


def upload_model(key: str):
    bucket = storage_client.get_bucket("ai_crypto")
    blob = bucket.blob(f"models/{key}.pth")
    blob.upload_from_filename(
        f"../rvc-webui/models/training/models/{key}/checkpoint/{key}-30.pth"
    )

    return blob.public_url
