<template>
    <div class="container">
        <p>{{description}}</p>
        <audio :src="newAudioSrc" controls="controls"></audio>
    </div>
</template>

<script>
import {AudioUtils} from "../components/utils/AudioUtils";
export default {
    name: "AudioView",
    data: function () {
        return {
            newAudioSrc: '',
            description: ''
        };
    },
    mounted() { 
        this.description = 'Hello world';
        AudioUtils.generateTranscript(this.description, (trans, audioPromise) => {
            console.log(trans)
            if (audioPromise != undefined) {
                audioPromise.then(audioBuffer => {
                    const newAudioBuffer = AudioUtils.extend1Sec(audioBuffer);
                    const newAudioBlob = AudioUtils.audioBufferToBlob(newAudioBuffer);
                    this.newAudioSrc = window.URL.createObjectURL(newAudioBlob)
                    // console.log(audioSrc);
                })
            }
        });
        this.$store.commit("updateAudioSrc", this.newAudioSrc)
        this.$store.commit("updateDescription", this.description)
    },
    methods: {

    },
};
</script>

<style>

</style>
