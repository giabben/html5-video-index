const { createApp } = Vue;

createApp({
    template: `
<div class="content">
    <video
        @timeupdate="updateTime"
        ref="video"
        controls>
        <source :src="videoFileName+'.mkv'" type="video/mkv">
        <source :src="videoFileName+'.mp4'" type="video/mp4">
        <source :src="videoFileName+'.webm'" type="video/webm">
            <track
                class="chaptersTrack"
                kind="chapters"
                ref="chapters"
                v-on:load="getChaptersReady"
                default>
    </video>
    <div class="chapters-container">
        <div
            v-for="chapter in chapters"
            :class="{'chapter-container': true, activeChapter: isActive(chapter)}"
            @click="skipTo(chapter.startTime)">
                <span class="status-container" role="img" aria-label="Completed item">
                    <span :class="{'status-icon': true, completed: isCompleted(chapter)}">&nbsp;</span>
                </span>
                <span :class="{chapters: true, activeChapter: isActive(chapter)}">{{chapter.text}}</span>
        </div>
    </div>
    <div ref="loadingOverlay" class="overlay">
        <div class="overlay__inner">
            <div class="overlay__content">
                <span class="spinner"></span>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            chapters: [],
            currentTime: 0,
            imgReady: false,
            dataUrl: ''
        };
    },
    computed: {
        videoFileName: () => {
            const path = window.location.pathname;
            const page = path.split('/').pop().split('.')[0];
            return page;
        }
    },
    methods: {
        updateTime() {
            this.currentTime = this.$refs.video.currentTime;
        },
        skipTo(time) {
            this.$refs.video.currentTime = time;
        },
        getChaptersReady() {
            let chapters = this.$refs.chapters;
            this.chapters = chapters.track.cues;
        },
        // funcs for checking active and completed chapters
        isActive(chapter) {
            return chapter.endTime > this.currentTime && chapter.startTime <= this.currentTime;
        },
        isCompleted(chapter) {
            return chapter.endTime <= this.currentTime;
        }
    },
    beforeMount() {
        const videoMetadataElement = document.getElementById('video-metadata');
        videoMetadataElement.src = this.videoFileName + '.js';
    },
    mounted() {
        setTimeout(()=>{
            const chapters = METADATA.chapters.trim();
            this.$refs.chapters.src = `data:text/vtt;base64,${btoa(chapters)}`;
            this.$refs.loadingOverlay.style.display = 'none';
        }, 3000);
    }
}).mount('#app');