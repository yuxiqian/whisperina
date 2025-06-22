import {MODELS} from "./models";
import {transcribe} from "./transcribe";

const { subtitle } = iina;

subtitle.registerProvider("whisper", {
    search: async () => MODELS.map(model => subtitle.item({
        id: model.name, name: model.name, size: model.size, sha: model.sha, format: "srt",
    })), description: (item) => ({
        name: item.data.id, left: item.data.size, right: item.data.sha,
    }), download: async (item) => {
        return Promise.resolve(transcribe(item.data.id));
    },
});
