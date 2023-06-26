import runpod
import core


def handler(event):
    print(event)
    inputs = event["input"]
    core.audio_to_corpus(inputs["voice_url"], inputs["voice_key"])
    core.train_model(inputs["config_url"], inputs["voice_key"])
    model_url = core.upload_model(inputs["voice_key"])
    return {"model_url": model_url}


runpod.serverless.start({"handler": handler})
