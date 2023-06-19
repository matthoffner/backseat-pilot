# 💺 backseat-pilot 💺

## https://marketplace.visualstudio.com/items?itemName=matthoffner.backseat-pilot

This is less auto-complete and more auto-fill, thus the "backseat".

### server

Originally based on [llama-cpp-python](https://github.com/abetlen/llama-cpp-python/blob/main/llama_cpp/server/app.py) (v1/completions) server example.

### extension

cmd + shift + p => settings json

```json
"backseat-pilot.url": "http://localhost:8000/v1/completions"
```

Publish your own version

```sh
npx vsce package
```

### usage

Commands based on [ai_extension_vscode](https://github.com/garland3/ai_extension_vscode).

cmd + shift + p => `LLM Chat`, `LLM Refactor`, `LLM Description 2 Code`


### other models/projects to try

### 🧙‍♂️ wizardcoder (try here https://huggingface.co/spaces/matthoffner/wizardcoder-ggml)
### 💫 starchat beta (try here https://huggingface.co/spaces/matthoffner/starchat-ggml)

