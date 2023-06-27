import os
import requests
import subprocess
import sys

from urllib.parse import urlsplit
from google.cloud import storage
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file("gcloud.json")
storage_client = storage.Client(credentials=credentials, project="aicrypto-389808")


def parse_extension(url: str):
    return urlsplit(url).path.split(".")[-1]


def audio_to_corpus(voice_url: str, key: str):
    response = requests.get(voice_url)
    DOWNLOAD_DIR = f"download/{key}"
    os.makedirs(f"/workspace/{DOWNLOAD_DIR}", exist_ok=True)
    ext = parse_extension(voice_url)
    open(f"/workspace/{DOWNLOAD_DIR}/audio.{ext}", "wb").write(response.content)
    res = subprocess.run(
        [
            sys.executable,
            "audio_to_copas.py",
            "--input",
            f"/workspace/{DOWNLOAD_DIR}/audio.{ext}",
            "--outdir",
            f"/workspace/{DOWNLOAD_DIR}/corpus",
        ],
        capture_output=True,
        check=True,
        text=True,
        cwd="/workspace/Voice_Separation_and_Selection/",
    )

    print("return code: {}".format(res.returncode))
    print("captured stdout: {}".format(res.stdout))
    print("captured stderr: {}".format(res.stderr))


def train_model(config_url: str, key: str):
    response = requests.get(config_url)
    DOWNLOAD_DIR = f"download/{key}"
    os.makedirs(f"/workspace/{DOWNLOAD_DIR}", exist_ok=True)
    open(f"/workspace/{DOWNLOAD_DIR}/setting.json", "wb").write(response.content)

    res = subprocess.run(
        [
            sys.executable,
            "scripts/training_script.py",
            f"/workspace/{DOWNLOAD_DIR}/setting.json",
        ],
        capture_output=True,
        text=True,
        cwd="/workspace/rvc-webui/",
    )

    print("return code: {}".format(res.returncode))
    print("captured stdout: {}".format(res.stdout))
    print("captured stderr: {}".format(res.stderr))


def upload_model(key: str):
    bucket = storage_client.get_bucket("ai_crypto")
    blob = bucket.blob(f"models/{key}.pth")
    blob.upload_from_filename(
        f"/workspace/rvc-webui/models/training/models/{key}/checkpoints/{key}-30.pth"
    )

    return blob.public_url
