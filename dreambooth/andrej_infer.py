import replicate

output = replicate.run(
    "ytsheng/andrej:5320031817be818263e133437580180595d5f7960c0c6d84b96afbf6f51e53b7",
    input={"prompt": "Andrej riding a horse dressed in ethnic clothing"},
)

print(output)
