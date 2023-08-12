import replicate

training = replicate.trainings.create(
    version="stability-ai/sdxl:7ca7f0d3a51cd993449541539270971d38a24d9a0d42f073caf25190d41346d7",
    input={
        "input_images": "https://github.com/bryce-evans/lifegen/raw/master/jordan.zip",
        "is_lora": False,
        "use_face_detection_instead": True,
    },
    destination="ytsheng/jordan",
)
