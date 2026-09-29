# Japanese speech audio

The bundled clips use **VOICEVOX:四国めたん (ノーマル)**. The Shikoku Metan
voice terms permit commercial and non-commercial use with visible credit. Kumo
shows the required credit in Settings. Character artwork and voice-model files
are not bundled here; only the generated WAV audio is included.

The clip list and Japanese text are in `manifest.json`. With the local VOICEVOX
engine running on `http://127.0.0.1:50021`, run `npm run audio:generate` to
create missing clips. Existing WAVs are kept unless `--overwrite` is passed.
