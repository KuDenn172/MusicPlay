/**
 * 1.Render songs
 * 2.Scroll top
 * 3.Play / pause / seek
 * 4.CD rotate (xoay)
 * 5.Next / prev
 * 6.Random
 * 7.Next / Repeat when ended
 * 8.Active song
 * 9.Scroll active song into view
 * 10.Play song when click
 */


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STROAGE_KEY = 'F8_PLAYER'

const player = $('.container')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const playlist = $('.playlist')
const song = $('.song')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STROAGE_KEY)) || {},
    songs: [
        {
            name: "Counting Stars",
            singer: "OneRepublic",
            path: "https://tainhac365.org/download-music/4037",
            image: "https://avatar-nct.nixcdn.com/song/2017/11/13/3/e/1/2/1510567502143_640.jpg"
        },
        {
            name: "Close",
            singer: "The Chainsmokers & Halsey",
            path: "https://tainhac365.org/download-music/1108",
            image: "https://m.media-amazon.com/images/I/71W41ZB39lL._SS500_.jpg"
        },
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "https://tainhac365.org/download-music/501796",
            image: "https://i.ytimg.com/vi/rolCnUu8m-I/hqdefault.jpg"
        },
        {
            name: "Comethru",
            singer: "Jeremy Zucker",
            path: "https://tainhac365.org/download-music/40073",
            image: "https://i.ytimg.com/vi/sEbFxmLhekU/hqdefault.jpg"
        },
        {
            name: "Demons",
            singer: "Imagine Dragons",
            path: "https://tainhac365.org/download-music/2164",
            image: "https://bandlabimages.azureedge.net/v1.0/songs/55a983bd-882e-4fa0-86c3-6a4d034f88e9/640x640"
        },
        {
            name: "Head In The Clouds",
            singer: "Hayd",
            path: "https://tainhac365.org/download-music/552497",
            image: "https://i.scdn.co/image/ab67616d0000b2734c63cfdb09841a113ea7da1b"
        },
        {
            name: "Hero Feat Christina Perri",
            singer: "Cash Cash",
            path: "https://tainhac365.org/download-music/501909",
            image: "https://i.ytimg.com/vi/GKszRl2tLkk/maxresdefault.jpg"
        },
        {
            name: "Shape Of You",
            singer: "Ed Sheeran",
            path: "https://tainhac365.org/download-music/501591",
            image: "https://upload.wikimedia.org/wikipedia/vi/thumb/a/a3/Shape_of_You_cover.jpg/220px-Shape_of_You_cover.jpg"
        },
        {
            name: "Something Just Like This",
            singer: "The Chainsmok",
            path: "https://tainhac365.org/download-music/203",
            image: "https://upload.wikimedia.org/wikipedia/vi/thumb/5/57/Something_Just_Like_This.png/220px-Something_Just_Like_This.png"
        },
        {
            name: "Stay",
            singer: "The Kid LAROI & JustinBieber",
            path: "https://tainhac365.org/download-music/491100",
            image: "https://upload.wikimedia.org/wikipedia/vi/thumb/1/1e/Poster_b%C3%A0i_h%C3%A1t_%22Stay%22.png/220px-Poster_b%C3%A0i_h%C3%A1t_%22Stay%22.png"
        },
        {
            name: "Novada",
            singer: "Monstercat",
            path: "https://tainhac365.org/download-music/1365",
            image: "https://avatar-nct.nixcdn.com/singer/avatar/2016/07/20/a/8/c/e/1468981718704_600.jpg"
        },


    ],
    // l??u khi thoat ra
    setConfig: function (key, value) {
        // set v??o object 
        this.config[key] = value;
        // l??u v?? localStorage
        localStorage.setItem(PLAYER_STROAGE_KEY, JSON.stringify(this.config))
    },

    // H??m view
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                style=" background-image: url('${song.image}'); " ></div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
        `
            // ${index === this.currentIndex ? 'active' : ''} 
        })
        playlist.innerHTML = htmls.join('')
    },
    // ?????nh ngh??a ra thu???c t??nh cho apps
    defineProperties: function () {
        // defineProperty() >> cho ph??p khai b??o thu???c t??nh m???i, ho???c thay ?????i m???t thu???c t??nh ???? c?? c???a m???t object >> s??? d???ng property descriptors.ch??? cho ph??p thay ?????i m???t thu???c t??nh duy nh???t
        // C?? 3 ?????i s??? : 1.?????i t?????ng s??? t???o ho???c c???u h??nh c??c thu???c t??nh,2.t??n thu???c t??nh ???????c ?????nh ngh??a l?? m???t chu???i, 3.M???t ?????i t?????ng v???i ?????nh ngh??a thu???c t??nh.
        Object.defineProperty(this, 'currentSongs', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // h??m s??? l?? s??? ki???n
    handleEvents: function () {
        const _this = this
        // L???y ra width c???a block  cd
        const cdWidth = cd.offsetWidth

        // X??? l?? CD quay khi song
        //  animate() tr??? l???i m???t ?????i t?????ng Animation >> l??u v??o bi???n
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10seconds ,t???c ????? quay
            iterations: Infinity // l???p l???i bao nhi??u l???n
        })
        cdThumbAnimate.pause()

        // X??? l?? Ph??ng to / thu nh??? CD
        document.onscroll = function () {
            // windown > ?????i di???n cho c???a s??? tr??nh duy???t
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // X??? l?? khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song ???????c play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song b??? pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }


        // Khi ti???n ????? b??i h??t thay ?????i 
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
            }
        }

        // X???  l?? khi tua song
        //  oninput ???????c k??ch ho???t khi ng?????i d??ng nh???p ho???c thay ?????i <input> v?? <textarea>.
        //  oninput di???n ra ngay khi gi?? tr??? c???a th??? thay ?????i . onchange di???n ra khi b???n chuy???n tr??? chu???t sang m???t th??nh ph???n kh??c. 
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }


        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()

            }
            _this.render()
            audio.play()
            _this.scrollToActiveSong()

        }

        // x??? l?? random b???t t???t
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active', _this.isRandom)

        }

        // x??? l?? l???p l???i song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)

        }

        // x??? l?? next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click();
            }
        }

        // l??ng nghe h??nh vi click v??o playlist
        playlist.onclick = function (e) {
            const songNotActive = e.target.closest('.song:not(.active)')
            // target m???c ti??u b???n click v??o 
            // closest >> tr??? v??? element 1 l?? ch??nh n?? ,2 l?? th??? cha n?? , k t??m th???y tr??? v??? null
            if (
                // ki???m tra c?? ph???i .song k >> m?? k c?? .active  ho???c c?? option th?? cho n?? v??o
                songNotActive || e.target.closest('.option')
            ) {
                // x??? l?? khi click v??o song
                if (songNotActive) {
                    // songNotActive.getAttribute('data-index')
                    // m???c ????nh ?????t data-... >> s??? d???ng dataset 
                    _this.currentIndex = Number(songNotActive.dataset.index)
                    _this.loadCurrentSongs()
                    _this.render()
                    audio.play()
                }

            }
        }
    },
    // k??o khi next
    scrollToActiveSong() {
        // c??nh 1
        // setTimeout(() => {
        //     $('.song.active').scrollIntoView({
        //         behavior: 'smooth',
        //         block: 'nearest',
        //     });
        // }, 300);
        // if ($(".song.active").offsetTop <= 203) {
        //     window.scrollTo({ top: 408 + "px", behavior: "smooth" });
        // }

        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 300);
    },

    loadCurrentSongs() {
        heading.textContent = this.currentSongs.name
        cdThumb.style.backgroundImage = `url('${this.currentSongs.image}')`
        audio.src = this.currentSongs.path
    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        // assisn ????? g??n ????? h???p nh???t
        // Object.assign(this,this.config)
    },
    // H??m next
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
            // window.scrollTo({ top: 400 + 'px', behavior: 'smooth' })
        }
        // khi net s??? c???p  nh???t l???i th??ng tin m???i
        this.loadCurrentSongs();

    },

    // H??m prev
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        // khi net s??? c???p  nh???t l???i th??ng tin m???i
        this.loadCurrentSongs();
    },

    // H??m x??? l?? ranDom Song

    playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSongs();

    },
    start: function () {
        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig()
        // Ngay t??? start th?? ?????nh ngh??a ra thu???c t??nh cho Object
        this.defineProperties()

        // L???ng nghe / x??? l?? c??c s??? ki???n (DOM events) 
        this.handleEvents();

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y
        this.loadCurrentSongs();

        // Render playlist
        this.render();
        // // c??i hi???n th??? tr???ng th??i ban ?????u c???a button repeat v?? random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }
}
app.start()