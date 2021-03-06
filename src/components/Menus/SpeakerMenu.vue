<template>
  <v-dialog v-model="SuperMenuOpen" persistent max-width="500px">
    <v-card dark raised>
      <v-card-title>
        <span class="headline">{{ name }}</span>

        <v-btn icon absolute right @click="SpeakerMenu = false">
          <v-avatar color="red">
            <v-icon>delete</v-icon>
          </v-avatar>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <span v-show="SpeakerModel.isSongLoaded">
              Playing <b>{{ SpeakerModel.currentSong.name }}</b> by
              <b>{{ SpeakerModel.currentSong.artist }}</b>
            </span>
            <span v-show="!SpeakerModel.isSongLoaded">
              No song
            </span>
          </v-row>
          <v-row>
            <div class="progressContainer">
              <span class="firstTimeMark">
                {{ Math.floor(SpeakerModel.currentSong.timemark / 60) }}:{{
                  this.SpeakerModel.currentSong.timemark % 60
                }}
              </span>

              <v-progress-linear
                top
                class=""
                color="light-blue"
                rounded
                :value="SpeakerModel.currentSong.progress"
                buffer-value="100"
              />
              <span class="lastTimeMark">
                {{ Math.floor(this.SpeakerModel.currentSong.duration / 60) }}:{{
                  this.SpeakerModel.currentSong.duration % 60
                }}
              </span>
            </div>
          </v-row>
          <v-row>
            <div class="buttonsContainer ">
              <v-btn
                icon
                height="50"
                width="50"
                class="prevButton"
                @click="previusSong()"
              >
                <v-avatar size="50" color="blue">
                  <v-icon>
                    fast_rewind
                  </v-icon>
                </v-avatar>
              </v-btn>

              <v-btn
                width="80"
                height="80"
                icon
                @click="playPauseButtonPressed()"
              >
                <v-avatar size="80" color="blue">
                  <v-icon
                    size="50"
                    v-show="!this.SpeakerModel.currentSong.isPlaying"
                  >
                    play_arrow
                  </v-icon>
                  <v-icon
                    size="50"
                    v-show="this.SpeakerModel.currentSong.isPlaying"
                  >
                    pause
                  </v-icon>
                </v-avatar>
              </v-btn>

              <v-btn
                icon
                height="50"
                width="50"
                class="nextButton"
                @click="nextSong()"
              >
                <v-avatar size="50" color="blue">
                  <v-icon>
                    fast_forward
                  </v-icon>
                </v-avatar>
              </v-btn>
            </div>
            <v-btn icon class="stopButton" @click="stopMusic()">
              <v-avatar color="blue">
                <v-icon>
                  stop
                </v-icon>
              </v-avatar>
            </v-btn>
          </v-row>
          <v-row>
            <v-slider
              class="volumeContainer"
              v-model="SelectedVolume"
              color="blue"
              track-color="white"
              always-dirty
              min="0"
              max="10"
            >
              <template v-slot:prepend>
                <v-icon color="blue" @click="decrementVolume()">
                  remove
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon color="blue" @click="incrementVolume()">
                  add
                </v-icon>
              </template>
            </v-slider>
          </v-row>
          <v-row>
            <div class="genresContainer">
              <v-overflow-btn
                class=" ddl"
                :items="GenresList"
                v-model="SelectedDDL"
              >
              </v-overflow-btn>

              <v-avatar color="blue" @click="LoadGenre()">
                <v-icon>
                  play_arrow
                </v-icon>
              </v-avatar>
            </div>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-center">
        <div class="text-center">
          <v-btn color="red" @click="Exit()">Cancel</v-btn>
          <v-btn color="blue" @click="Exit()">Confirm</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Speakers from "../../data/schemas/devices/Speakers";
export default {
  name: "SpeakerMenu",
  props: {
    deviceId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false
    },
    openMenu: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    SuperMenuOpen: false,
    interval:undefined,

    SpeakerModel: {
      genre: "",
      isSongLoaded: false,
      currentSong: {
        name: "",
        artist: "",
        album: "",
        duration: 0,
        timemark: 0,
        isPlaying: false,
        progress: 0
      },
      volume: 5,
      playlist: []
    },

    GenresList: [],
    SelectedDDL: 0,
    SelectedVolume: 5,

    PreviousModel: undefined
  }),
  methods: {
      Exit(){
          console.log("Sending Close Event from Speaker")
          this.$emit('CloseMenu')
      },
    playPauseButtonPressed() {
      if (!this.SpeakerModel.isSongLoaded) return;

      console.log("Big Button pressed");

      this.SpeakerModel.currentSong.isPlaying = !this.SpeakerModel.currentSong
        .isPlaying;
      console.log("is playing: " + this.SpeakerModel.currentSong.isPlaying);

      if (this.SpeakerModel.currentSong.isPlaying) this.resumeMusic();
      else this.pauseMusic();
    },
    async stopMusic() {
      console.log("STOP Music");
      let APISpeaker = new Speakers(this.deviceId, this.name);
      console.log("Executing action");
      await APISpeaker.stop();
      console.log("Updating model");
      await APISpeaker.refreshState();
      console.log(APISpeaker);
      console.log("Aplying model");
      this.LoadModel(APISpeaker);
      console.log("new Model:");
      console.log(this.SpeakerModel);

      window.clearInterval(this.interval);
    },
    async resumeMusic() {
      console.log("RESUME Music");
      let APISpeaker = new Speakers(this.deviceId, this.name);
      console.log("Executing action");
      await APISpeaker.resume();
      console.log("Updating model");
      await APISpeaker.refreshState();
      console.log(APISpeaker);
      console.log("Aplying model");
      this.LoadModel(APISpeaker);
      console.log("new Model:");
      console.log(this.SpeakerModel);
      console.log("Starting Song Timer");
      this.StartSongTimer();
    },
    async pauseMusic() {
      console.log("PAUSE Music");
      let APISpeaker = new Speakers(this.deviceId, this.name);
      console.log("Executing Pause");
      await APISpeaker.pause();
      console.log("Updating Model");
      await APISpeaker.refreshState();
      console.log("Updated Model:");
      console.log(APISpeaker);
      console.log("Appliying Model");
      this.LoadModel(APISpeaker);
      console.log("Model Applied:");
      console.log(this.SpeakerModel);
      window.clearInterval();
    },
    async LoadGenre() {
      console.log(this.SelectedDDL);
      let APISpeaker = new Speakers(this.deviceId, this.name);
      await APISpeaker.selectGenre(this.SelectedDDL);
      await APISpeaker.play();
      await APISpeaker.refreshState();
      this.LoadModel(APISpeaker);
      this.StartSongTimer();
    },
    async previusSong() {
      let APISpeaker = new Speakers(this.deviceId, this.name);
      await APISpeaker.previousSong();
      await APISpeaker.refreshState();
      this.LoadModel(APISpeaker);
    },
    async nextSong() {
      let APISpeaker = new Speakers(this.deviceId, this.name);
      await APISpeaker.nextSong();
      await APISpeaker.refreshState();
      this.LoadModel(APISpeaker);
    },
    incrementVolume() {
      if (this.SpeakerModel.volume < Speakers.maxVolume()) {
        this.SpeakerModel.volume++;
      }
    },
    async acknowledgeVolumenChange() {
      let APISpeaker = new Speakers(this.deviceId, this.name);
      this.SpeakerModel.volume = this.SelectedVolume;
      await APISpeaker.setVolume(this.SpeakerModel.volume);
    },
    decrementVolume() {
      if (this.SpeakerModel.volume > Speakers.minVolume()) {
        this.SpeakerModel.volume--;
      }
    },
    async setUp() {
      let APISpeaker = new Speakers(this.deviceId, this.name);
      await APISpeaker.refreshState();
      console.log(APISpeaker);

      this.PreviousModel = APISpeaker;
      this.LoadModel(APISpeaker);
      console.log(this.SpeakerModel);
    },
    ConvertSongModel(APISong) {
      console.log("Creo SONG temporal");
      var song = {
        name: APISong.title,
        artist: APISong.artist,
        duration: 0,
        timemark: 0,
        album: APISong.Album,
        isPlaying: false,
        progress: 0
      };
      console.log("duration: " + APISong.duration);
      console.log("duration: " + APISong.duration);
      song.duration =
        Number.parseInt(APISong.duration.match("^(\\d+):.*$")[1]) * 60 +
        Number.parseInt(APISong.duration.match("^.*:(\\d+)$")[1]);
      console.log("asigno duracion:" + song.duration);
      console.log("progress: " + APISong.progress);

      song.timemark =
        Number.parseInt(APISong.progress.match("^(\\d+):.*$")[1]) * 60 +
        Number.parseInt(APISong.progress.match("^.*:(\\d+)$")[1]);
      console.log("asigno progreso actual:" + song.timemark);

      song.progress =
        100 *
        (this.SpeakerModel.currentSong.timemark /
          this.SpeakerModel.currentSong.duration);

      return song;
    },
    LoadModel(model) {
      console.log("Again Model API: ");
      console.log(model);
      console.log("API Genre: " + model.genre);
      this.SpeakerModel.genre = model.genre;
      console.log("DDL: " + this.SpeakerModel.genre);

      this.SelectedDDL = model.genre;
      console.log("DDL: " + this.SelectedDDL);

      this.SpeakerModel.volume = model.volume;
      this.SelectedVolume = model.volume;

      console.log("Loading model");
      console.log(model);

      switch (model.status) {
        case "playing":
          console.log("Case Playing");
          this.SpeakerModel.isSongLoaded = true;
          this.SpeakerModel.currentSong = this.ConvertSongModel(model.song);
          this.SpeakerModel.currentSong.isPlaying = true;

          break;
        case "paused":
          console.log("case Paused");
          this.SpeakerModel.isSongLoaded = true;
          this.SpeakerModel.currentSong = this.ConvertSongModel(model.song);
          this.SpeakerModel.currentSong.isPlaying = false;
          break;
        case "stopped":
          console.log("case Stopped");
          this.SpeakerModel.isSongLoaded = false;
          this.SpeakerModel.currentSong = {
            isPlaying: false,
            timemark: 0,
            duration: 0,
            progress: 0
          };
          break;
      }
    },
    StartSongTimer() {
        window.clearInterval(this.interval);
      this.interval = window.setInterval(() => {
        if (this.SpeakerModel.isSongLoaded) {
          if (this.SpeakerModel.currentSong.isPlaying) {
            this.SpeakerModel.currentSong.timemark++;
            console.log("aumento el timer");

            this.SpeakerModel.currentSong.progress = 100 * (this.SpeakerModel.currentSong.timemark / this.SpeakerModel.currentSong.duration);

            if (
              this.SpeakerModel.currentSong.timemark >=
              this.SpeakerModel.currentSong.duration
            ) {
              console.log("NOOOOOOOOO");
              this.nextSong();
            }
          }
        }
      }, 1000);
    },
    async Cancel() {
      // CREO QUE NO ES NECESARIA
      this.LoadModel(this.PreviousModel);
      let APISpeaker = new Speakers(this.deviceId, this.name);
      await APISpeaker.refreshState();

      if (this.SpeakerModel.volume != APISpeaker.volume)
        await this.acknowledgeVolumenChange();

      if (this.SpeakerModel.currentSong != undefined) {
      }
    }
  },
  watch: {
    SelectedVolume: function(val) {
      if (val === this.SpeakerModel.volume) return;
      console.log("Detecting new volume: " + val);
      this.acknowledgeVolumenChange();
    },
    openMenu: function(val) {
      this.SuperMenuOpen = val;
      if (val) {
        this.GenresList = Speakers.supportedGenres();
        this.setUp();
        this.StartSongTimer();
      } else {
        window.clearInterval(this.interval);
      }
    }
  }
};
</script>

<style scoped>
.genresContainer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ddl {
  width: 90%;
}
.volumeContainer {
  width: 100%;
  padding-top: 30px;
}
.progressContainer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding-top: 10px;
}
.firstTimeMark {
  left: 3%;
  padding-right: 10px;
  width: 13%;
}
.lastTimeMark {
  right: 3%;
  padding-left: 10px;
  width: 13%;
}
.progressBar {
  width: auto;
  align-self: center;
}
.buttonsContainer {
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  width: 90%;
  padding-top: 30px;
  padding-left: 10%;
}

.prevButton {
  left: 12%;
  top: -10px;
}
.nextButton {
  right: 12%;
  top: -10px;
}
.stopButton {
  margin-top: 50px;
}
</style>
