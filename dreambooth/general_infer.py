import replicate

output = replicate.run(
    "stability-ai/sdxl:7ca7f0d3a51cd993449541539270971d38a24d9a0d42f073caf25190d41346d7",
    input={"prompt": "Natalie Portman is reading a book"},
)

print(output)
