# backseat-pilot

vscode extension using llm to write, refactor and prompt.

### server

based on the [llama-cpp-python](https://github.com/abetlen/llama-cpp-python/blob/main/llama_cpp/server/app.py) server example.

```sh
python3 -m llama_cpp.server --model ~/models/wizardLM-7B.ggml.q5_1.bin -n_threads 8 --use_mlock true --use_mmap true
```

### extension

LLM url is configuraable:

```json
"backseat-pilot.url": "http://localhost:8000/v1/completions"
```

Publish your own version

```sh
npx vsce package
```

Commands based on [ai_extension_vscode](https://github.com/garland3/ai_extension_vscode).
