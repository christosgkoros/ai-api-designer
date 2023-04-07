class OpenAIError extends Error {}
class DefinitionGenerator {
    openAiURL;

     constructor() {
        this.openAiURL = import.meta.env.VITE_OPENAI_URL;
    }

     async generateDefinition(apikey, story) {
         //return await this.OpenAIDaVinciCompletion(story);
         return await this.OpenAIGPTCompletion(apikey, story);
    }

    async OpenAIDaVinciCompletion(apikey, story) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + this.apiKey);
        myHeaders.append("Content-Type", "application/json");

        let prompt = "Create an OpenAPI definition as JSON for the following use case: " + story;

        const raw = JSON.stringify({
            "prompt": prompt,
            "max_tokens": 2048
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        console.log("Sending request to OpenAI DaVinci for the use case -> " + prompt);
        this.start = Date.now();
        let response = await fetch(this.openAiURL + "/engines/text-davinci-003/completions", requestOptions)
        let generation = await response.json();
        let text = generation.choices[0].text;
        console.log(text);
        return JSON.parse(processResponseText(text));
    }

    async OpenAIGPTCompletion(apikey, story) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + apikey);
        myHeaders.append("Content-Type", "application/json");

        let prompt = "Create an OpenAPI definition as JSON for the following use case: " + story;

        const raw = JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 1,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "max_tokens": 2048,
            "presence_penalty": 0,
            "frequency_penalty": 0
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        console.log("Sending request to OpenAI GPT for the use case -> " + prompt);
        this.start = Date.now();
        let response = await fetch(this.openAiURL + "/chat/completions", requestOptions)
        let responseJSON = await response.json();
        if (!response.ok && !response.redirected) {
            throw new OpenAIError(responseJSON.error.message);
        }
        let text = responseJSON.choices[0].message.content;
        console.log(text);
        return JSON.parse(processResponseText(text));
    }
}

function processResponseText(text) {
    //remove text before and after the JSON object. OpenAI sometimes adds some characters or text
    let firstBracketIndex = text.indexOf("{");
    let lastBracketIndex = text.lastIndexOf("}");

    if (lastBracketIndex !== text.length) {
        return text.slice(firstBracketIndex, lastBracketIndex + 1);
    } else {
        return text.substring(firstBracketIndex);
    }
}

export {DefinitionGenerator, OpenAIError};