import {quote} from "shell-quote";

const {console, core, file, utils} = iina;

const HOME_PATH = '~/Library/Application Support/com.colliderli.iina/plugins/';

export async function transcribe(path, model) {
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
        await utils.exec(`${HOME}/bin/download-ggml-model.sh`, [model], DATA).catch(error => console.error(error));
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
    await execWrapped('/bin/bash', ['-c', `DYLD_LIBRARY_PATH='${utils.resolvePath(HOME + '/bin')}' ` + quote([utils.resolvePath(`${HOME}/bin/whisper-cli`), '-f', tempWavName, '-m', `${DATA}/ggml-${modelName}.bin`, '-osrt'])]);
}

function getFfmpegPath() {
    const ffmpegPath = "/opt/homebrew/bin/ffmpeg";
    if (!utils.fileInPath(ffmpegPath)) {
        throw new Error(`Unable to locate ffmpeg executable at: ${ffmpegPath}`);
    }
    return ffmpegPath;
}

function getPluginHomePath() {
    const PLUGIN_NAME = 'iina-ai-subgen.iinaplugin';
    const PLUGIN_NAME_DEV = 'iina-ai-subgen.iinaplugin-dev';
    if (utils.fileInPath(HOME_PATH + PLUGIN_NAME)) {
        return utils.resolvePath(HOME_PATH + PLUGIN_NAME);
    } else if (utils.fileInPath(HOME_PATH + PLUGIN_NAME_DEV)) {
        return utils.resolvePath(HOME_PATH + PLUGIN_NAME_DEV);
    } else {
        alert("Boo!");
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

