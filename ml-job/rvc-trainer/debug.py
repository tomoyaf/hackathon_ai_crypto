from fastapi import FastAPI
from pydantic import BaseModel
import core

app = FastAPI()


class TrainModelBody(BaseModel):
    voice_url: str
    voice_key: str
    config_url: str


@app.post("/train_model")
def train_model(body: TrainModelBody):
    core.audio_to_corpus(body.voice_url, body.voice_key)
    core.train_model(body.config_url, body.voice_key)
    model_url = core.upload_model(body.voice_key)
    return {"model_url": model_url}
