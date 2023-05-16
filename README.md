# backseat-pilot

![https://marketplace.visualstudio.com/items?itemName=matthoffner.backseat-pilot](https://vsmarketplacebadges.dev/version-short/matthoffner.backseat-pilot.svg)

vscode + local LLMs

works offline + no autosuggest

### server

based on [llama-cpp-python](https://github.com/abetlen/llama-cpp-python/blob/main/llama_cpp/server/app.py) (v1/completions) server example.

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

### usage

Commands based on [ai_extension_vscode](https://github.com/garland3/ai_extension_vscode).

cmd + shift + p => `LLM Chat`, `LLM Refactor`, `LLM Description 2 Code`
