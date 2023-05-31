# 💺 backseat-pilot 💺

![https://marketplace.visualstudio.com/items?itemName=matthoffner.backseat-pilot](https://vsmarketplacebadges.dev/version-short/matthoffner.backseat-pilot.svg)

Copilot's are meant to be hackable, and that's what this extension is meant to be. This is less auto-complete and more auto-fill, thus the "backseat".

### server

based on [llama-cpp-python](https://github.com/abetlen/llama-cpp-python/blob/main/llama_cpp/server/app.py) (v1/completions) server example, but designed to work with any model (starchat, starcode, etc)

### extension

cmd + shift + p => settings json

```json
"backseat-pilot.url": "http://localhost:8000/v1/completions",
"backseat-pilot.maxTokens": "512"
```

Publish your own version

```sh
npx vsce package
```

### models to try

* starcoder (try here [Monacopilot](https://matthoffner-monacopilot.hf.space/))
* starchat alpha (try here https://huggingface.co/spaces/matthoffner/starchat-alpha)
* bring your own LLaMa

### usage

Commands based on [ai_extension_vscode](https://github.com/garland3/ai_extension_vscode).

cmd + shift + p => `LLM Chat`, `LLM Refactor`, `LLM Description 2 Code`
