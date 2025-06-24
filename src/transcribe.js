const {console, core, preferences, utils} = iina;

const HOME_PATH = '~/Library/Application Support/com.colliderli.iina/plugins/';

export async function transcribe(model) {
    await downloadOrGetModel(model);
    const url = core.status.url;
    if (!url.startsWith("file://")) {
        throw new Error(`Subtitle generation doesn't work with non-local file ${url}.`);
    }
    const fileName = url.substring(7);
    core.osd("Generating temporary wave file...");
    const tempWavFile = await generateTemporaryWaveFiles(fileName);

    core.osd("Transcribing...");
    await transcribeAudio(tempWavFile, model);

    core.osd("Transcription succeeded.");
    return [utils.resolvePath("@tmp/whisper_tmp.wav.srt")];
}

async function downloadOrGetModel(model) {
    if (utils.fileInPath(`@data/ggml-${model}.bin`)) {
        core.osd(`Model ${model} already exists.`);
    } else if (utils.ask(`Model ${model} does not exist. Would you like to download it now?`)) {
        await execWrapped(`${HOME}/bin/download-ggml-model.sh`, [model], DATA);
        core.osd(`Model ${model} has been successfully downloaded.`);
    } else {
        throw Error(`No such model ${model}.`);
    }
}

async function generateTemporaryWaveFiles(fileName) {
    const tempWavFile = utils.resolvePath("@tmp/whisper_tmp.wav");
    await execWrapped(getFfmpegPath(), ['-y', '-i', fileName, '-ar', '16000', '-ac', '1', "-c:a", "pcm_s16le", tempWavFile]);
    return tempWavFile;
}

async function transcribeAudio(tempWavName, modelName) {
    await execWrapped(getWhisperCliPath(), appendOptions(['-f', tempWavName, '-m', `${DATA}/ggml-${modelName}.bin`, '-osrt']));
}

function appendOptions(options) {
    try {
        const extras = preferences.get("wcli_options")
        if (extras && extras.length > 0) {
            return options.concat(extras);
        }
    } catch (error) {
        // Ignore
    }
    return options;
}

function getWhisperCliPath() {
    const whisperCliPath = preferences.get("wcli_path");
    if (!utils.fileInPath(whisperCliPath)) {
        throw new Error(`Unable to locate Whisper CLI executable at: ${whisperCliPath}. Check the preference page for more details.`);
    }
    return whisperCliPath;
}

function getFfmpegPath() {
    const ffmpegPath = preferences.get("ffmpeg_path");
    if (!utils.fileInPath(ffmpegPath)) {
        throw new Error(`Unable to locate ffmpeg executable at: ${ffmpegPath}. Check the preference page for more details.`);
    }
    return ffmpegPath;
}

function getPluginHomePath() {
    const PLUGIN_NAME = 'io.github.yuxiqian.whisperina.iinaplugin';
    const PLUGIN_NAME_DEV = 'whisperina.iinaplugin-dev';
    if (utils.fileInPath(HOME_PATH + PLUGIN_NAME)) {
        return utils.resolvePath(HOME_PATH + PLUGIN_NAME);
    } else if (utils.fileInPath(HOME_PATH + PLUGIN_NAME_DEV)) {
        return utils.resolvePath(HOME_PATH + PLUGIN_NAME_DEV);
    } else {
        throw new Error("Unable to locate plugin folder.");
    }
}

function getPluginDataPath() {
    return utils.resolvePath("@data/")
}

async function execWrapped(file, commands, cwd) {
    const {
        status, stdout, stderr
    } = await utils.exec(file, commands, cwd);
    console.log(status);
    console.log(stdout);
    console.log(stderr);
    if (status !== 0) {
        throw new Error(`Bad return status code: ${status}`);
    }
}

const HOME = getPluginHomePath();
const DATA = getPluginDataPath();

