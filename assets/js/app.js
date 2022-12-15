const { createApp } = Vue;

createApp({
    template: `
<div class="content">
    <video
        @timeupdate="updateTime"
        ref="video"
        controls>
            <source src="video.mp4" type="video/mp4">
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
                <span :class="{chapters: true, activeChapter: isActive(chapter)}">
                    Chapter-{{chapter.id}}: {{chapter.text}}
                </span>
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
        },
        getVideoFileName() {
            const path = window.location.pathname;
            const page = path.split('/').pop().split('.')[0];
            return page;
        }
    },
    mounted() {
        const chapters = metadata.chapters.trim();
        this.$refs.chapters.src = `data:text/vtt;base64,${btoa(chapters)}`;
    }
}).mount('#app');