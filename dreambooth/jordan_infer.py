import replicate

output = replicate.run(
    "ytsheng/jordan:f9b09267695adf9a0be6b211d4c10e1bce4aaa8917a094d9ebc429d19499703e",
    input={"prompt": "Jordan riding a horse dressed in ethnic clothing"},
)

print(output)
